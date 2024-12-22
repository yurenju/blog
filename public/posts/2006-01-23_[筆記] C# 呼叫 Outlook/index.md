---
title: '[筆記] C# 呼叫 Outlook'
date: '2006-01-23'
tags:
  - .NET
  - development
categories:
  - tech
---
先加入參考，選擇 COM tab，選取 Microsoft Outlook 11.0 Object Library。  
  
然後加入以下程式片段：  
  
  

> Outlook.ApplicationClass app = new Outlook.ApplicationClass();  
> Outlook.MailItemClass mi = (Outlook.MailItemClass)app.CreateItem(Outlook.OlItemType.olMailItem);  
> mi.BodyFormat = Outlook.OlBodyFormat.olFormatHTML;  
> mi.To = "yurenju@gmail.com";  
> mi.Display(new object());