---
title: Running Firefox OS Gaia on Windows
date: '2013-06-30'
tags:
  - Firefox OS
  - windows
  - firefox
categories:
  - tech
---
[![](images/0.jpg)](http://1.bp.blogspot.com/-anrSX2Zb1Yg/UcgewfmIuMI/AAAAAAAAeM8/qf3JRv0Auw4/s1600/Sa2Xm4P.jpg)

  
你永遠不知道下一個要解的 Bug 是什麼 :-)  
  
上週送了一個 Pull Request 到 Gaia，Reviewer 非常好心的跟我說我的 patch 在 Windows 上面不會動，這時候才第二次意識到我們還是需要在 Windows 上面測試（上一次是我修 customization 的時候遇到的）。總之我這次很老實地把 Windows 的環境搞定了，在我等待 fetch pull request 的時候就來說說怎麼設定吧。  
  
首先下載 [Firefox Nightly](http://nightly.mozilla.org/)。  
  
接著你需要 [MinGW](http://www.mingw.org/)，寫這篇文章的時候我裝的是 [mingw-get-inst-20120426.exe](http://sourceforge.net/projects/mingw/files/Installer/mingw-get-inst/mingw-get-inst-20120426/mingw-get-inst-20120426.exe/download)，或許你看到這篇文章的時候已經有新版出來了。安裝的時候記得要選下面這兩個：  

*   MSYS Basic System
*   MinGW Developer ToolKit（這個我不確定要不要）

接下來安裝 git，Git 直接到[官方網站下載](http://git-scm.com/)就好了。安裝的時候選擇 "Run Git from the Windows Command Prompt"，這樣可以直接在 MinGW 的環境使用 git。  
  
然後接下來是裝 Python，一樣到[官網下載](http://python.org/)就好了。 但是你需要把 Pyhton 的路徑加入 PATH 這個環境變數裡面，在 My Computer 按右鍵，選 properties -> Advanced -> Environment Variables，找到 Path 把 C:\\Python27 加入。  
  
最後的一個步驟，安裝一些 build gaia 會用到的指令：  
  
$ mingw-get install msys-wget  
$ mingw-get install msys-zip  
$ mingw-get install msys-unzip  
  
這樣就搞定啦！  
  
打開 MinGW Shell 找個風水吉地 git clone gaia，進入目錄後用下面指令 build 出 profile 檔：  
  
$ DEBUG=1 make  
  
第一次會需要久一點，主要是下載一些 xulrunner 之類的東西。好了之後用下面的指令啓動你的 Nightly。依據你 clone Gaia 的地方會有些不一樣，自己摸索一下吧。  
  
$ /C/Program\\ Files/Nightly/firefox.exe -profile /C/MinGW/msys/1.0/home/IEUser/gaia/profile-debug/  
  
這樣就可以在 Windows 的 Nightly 上面啓動 Gaia 囉，在裡面收信也沒問題喔 LOL  
  

[![](images/1.png)](http://1.bp.blogspot.com/-eevKdxyduw0/Uc_zR72Od5I/AAAAAAAAeQQ/eKaTo7CDqkY/s1440/mail.png)