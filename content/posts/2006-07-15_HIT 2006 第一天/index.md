---
title: HIT 2006 第一天
date: '2006-07-15'
tags:
  - community
  - development
categories:
  - tech
---
我自己都沒想到會參加 HIT 2006。  
  
星期五下午時，[shawn](http://kalug.linux.org.tw/pmwiki/pmwiki.php?n=Profiles.Shawn) 突然傳訊給我，說多了一張門票，看我要不要過去。幾經掙扎後（因為實在沒錢）結果還是上來了 XD  
  
廢話就不多說。第一天的行程有三個議程讓我印象深刻：Koun 講的 rootkit、中場許多人講解的 0day，還有最後 Armorize 公司的 Wayne Huang 講解的自動化安全性驗證系統。  
  
Koun 講的 rootkit 有許多部份都令我感到訝異萬分。可能自己對 security 並不是很重視，但沒想到 rootkit （還有其他可入侵的角落）可以鑽進 OS 的各個角落，連 kernel mode 都不放過，連 pre-OS 的 BIOS, NIC rootkit, ACPI rootkit 都可以做到！真的是大大的 Shock，而且發現自己的 security 的 sense 真的要好好加強。  
  
中場講解 0day 攻擊大家都應該還蠻聽的津津有味。這段展示了許多已填補以及尚未填補的漏洞。包括 excel、Windows 捷徑、某家公司的郵件系統、某家公司的搜尋系統、還有網頁程式上傳、下載檔案潛在的問題都一一的展示。  
  
而最後一場，也是我覺得最精彩的一場。Wayne Huang 展示了他們公司目前研發的，可以利用源碼自動驗證系統是否有安全性問題，無論是理論的講解，以及產品的 DEMO，都顯得出他們在自動化驗證方面投注的相當多的心力。而把學術研究成果帶到企業來還真是蠻厲害的。通常學術研究跟企業應用上都有些差距，能將學術研究的理論，製成產品，我也只能豎起大拇指了。  
  
明天還有很多精彩的內容，如果有什麼心得再分享給大家 :)