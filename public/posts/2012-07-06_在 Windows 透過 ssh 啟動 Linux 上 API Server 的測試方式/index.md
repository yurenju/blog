---
title: 在 Windows 透過 ssh 啟動 Linux 上 API Server 的測試方式
date: '2012-07-06'
tags:
  - MS Windows
  - C#
categories:
  - tech
---
如果你採用 Django, Node.js 或 Rails 這些網頁開發 framework 大多都不會真的在 Windows 上架設服務，通常會在 Mac 或 Linux 架設測試伺服器。開發 Windows 的時候比較好的解決方法就是在 VirtualBox (或其他軟體) 裝 Linux 連接到上面測試。  
  
這樣做在我的狀況下會有些問題，因為我的測試項目會更改到一些儲存在資料庫的東西會影響到下次測試的結果。所以我希望每次測試都可以用新的資料庫環境測試。今天下午花了些時間設定好，分享一下。  
  
基本上就是透過 putty 的指令介面 plink 來執行遠端 Linux 的指令，達到開啟關閉以及清除資料庫的功能。遠端的 script 大概長這樣：  
  
```
#!/bin/bash

if \[ "$1" = "start" \]; then
  echo "starting api service"
  #start web service > /dev/null 2>&1 &
  pidfile=$!
  echo $pidfile > ~/api.pid
else
  echo "stopping api service"
  kill \`cat ~/api.pid\`
  mongo api\_db --eval "db.dropDatabase()"
fi


```  
在 Windows 這邊可以到 [putty 官網](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)下載 plink.exe，先把它丟到家目錄去。遠端的指令要這樣執行：  
  
```
%HOMEDRIVE%%HOMEPATH%\\plink.exe -pw PASSWORD USERNAME@192.168.1.148 /PATH/TO/SCRIPT start

```  
你可能注意到我沒有用 public key 的方式做，因為不知道為什麼在 linux 產生的 private key 好像沒辦法直接拿來用。後來懶得研究就直接用密碼了。  
  
最後我們是要在 NUnit 跑的時候執行這個指令，所以你可以修改測試專案下面的 Program.cs 來達到執行指令的功能，下面我就貼出整個檔案了，基本上就是在前後加上執行的指令，ExecuteCommand 是從網路上貼來的。  
  
```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Threading;

namespace YourNamespace
{
    class Program
    {
        \[STAThread\]
        static void Main(string\[\] args)
        {
            string script = "\\\\plink.exe -pw PASSWORD USERNAME@192.168.1.148 /PATH/TO/SCRIPT ";
            string home = Environment.ExpandEnvironmentVariables("%HOMEDRIVE%%HOMEPATH%");
            ExecuteCommandAsync(home + script + "start");
            Console.WriteLine("starting service, sleep 15 seconds");
            Thread.Sleep(15000);

            string\[\] my\_args = { Assembly.GetExecutingAssembly().Location };

            int returnCode = NUnit.ConsoleRunner.Runner.Main(my\_args);

            Console.WriteLine("stopping service...");
            ExecuteCommandSync(home + script + "stop");
            Console.WriteLine("service stopped");
            if (returnCode != 0)
                Console.Beep();
        }

        static public void ExecuteCommandSync(object command)
        {
            try
            {
                // create the ProcessStartInfo using "cmd" as the program to be run,
                // and "/c " as the parameters.
                // Incidentally, /c tells cmd that we want it to execute the command that follows,
                // and then exit.
                System.Diagnostics.ProcessStartInfo procStartInfo =
                    new System.Diagnostics.ProcessStartInfo("cmd", "/c " + command);

                procStartInfo.RedirectStandardOutput = true;
                procStartInfo.UseShellExecute = false;
                // Do not create the black window.
                procStartInfo.CreateNoWindow = true;
                // Now we create a process, assign its ProcessStartInfo and start it
                System.Diagnostics.Process proc = new System.Diagnostics.Process();
                proc.StartInfo = procStartInfo;
                proc.Start();
                // Get the output into a string
                string result = proc.StandardOutput.ReadToEnd();
                // Display the command output.
                Console.WriteLine(result);
            }
            catch (Exception objException)
            {
                // Log the exception
            }
        }

        static public void ExecuteCommandAsync(string command)
        {
            try
            {
                //Asynchronously start the Thread to process the Execute command request.
                Thread objThread = new Thread(new ParameterizedThreadStart(ExecuteCommandSync));
                //Make the thread as background thread.
                objThread.IsBackground = true;
                //Set the Priority of the thread.
                objThread.Priority = ThreadPriority.AboveNormal;
                //Start the thread.
                objThread.Start(command);
            }
            catch (ThreadStartException objException)
            {
                // Log the exception
            }
            catch (ThreadAbortException objException)
            {
                // Log the exception
            }
            catch (Exception objException)
            {
                // Log the exception
            }
        }
    }
}

```