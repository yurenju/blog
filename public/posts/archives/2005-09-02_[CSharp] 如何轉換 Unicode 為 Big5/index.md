---
title: '[C#] 如何轉換 Unicode 為 Big5'
date: '2005-09-02'
tags:
  - development
categories:
  - tech
---
怎麼提起了 C# 呢？其實最近有一個 Case 是客戶指定程式語言，所以這個月幾乎都用 C# 開發程式。  
  
今天我剛好遇到一個狀況，是要將 Unicode 轉換成 Big5 編碼，我立即想起了 iconv，直接給些參數就可以快速的達到這個功能。但是搜尋 MSDN， .NET 竟然沒有類似的原生函式。花了許多時間在 Google 搜尋，終於找到了個不錯的解決方案。  
  
感謝 [Net Industry](http://www.netindustry.nl/resources/unicodeeditor/default.aspx) 提供了轉換各種編碼的程式，並以 Mozilla Public License 釋出。  
  
直接用 VS .NET 的 IntelliSense 找 System.Text.Encoding 中的編碼，僅有 Unicode, UTF-8, UTF-7 這三種編碼，如果要存取更多的編碼，以下提供一個方式：  
  
1\. 新增一 app.config，並且加入專案當中：  
`    <?xml version="1.0" encoding="utf-8"?>   <configuration>   <appSettings>   <!-- User application and configured property settings go here.-->   <!-- Example: <add key="settingName" value="settingValue"/> -->   <add key="richTextBox1.WordWrap" value="False" />   <add key="CodePages" value="950"/>   </appSettings>   </configuration>    `  
  
重點在於其中 CodePage 的數值為 cp950，這是相容於 Big5 的 CodePage。接著只要把要轉換編碼的資料，用以下程式轉換即可：  
` ```    byte[] bytData = Encoding.Unicode.GetBytes(unicodeString);      Encoding cp950 = System.Text.Encoding.Default;   string codePages = ConfigurationSettings.AppSettings["CodePages"];   try   {   	int np = int.Parse(codePages.Trim());   	cp950 = Encoding.GetEncoding(np);   }   catch (Exception e )   {   	Console.WriteLine( e.Message );   }      byte[] cp950Bytes = System.Text.Encoding.Convert(System.Text.Encoding.Unicode, cp950, bytData);    ``` `  
  
更詳細的內容可以直接參考 Net Industry 提供的 Universal Unicode Editor/Converter。  
  
**註：其實不用透過 app.config，只要使用 getEncoding(950) 即可，所以上面都是多此一舉了。**