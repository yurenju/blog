---
title: "Pinkoi 設計師平臺工具組"
author: "Yuren Ju"
date: 2015-07-11T17:54:16.583Z
lastmod: 2023-06-06T13:36:52+08:00
categories: [tech]

description: ""

subtitle: "如果你朋友也是 Pinkoi 上的熱銷產品的設計師，或許你曾經聽過他提到 Pinkoi 平台後台的訂單管理系統有些可以改善的地方，主要一個就是沒有提供試算表匯出的功能。"

images:
  - "/posts/2015-07-11_pinkoi-設計師平臺工具組/images/1.png"
  - "/posts/2015-07-11_pinkoi-設計師平臺工具組/images/2.png"
  - "/posts/2015-07-11_pinkoi-設計師平臺工具組/images/3.png"
  - "/posts/2015-07-11_pinkoi-設計師平臺工具組/images/4.png"
  - "/posts/2015-07-11_pinkoi-設計師平臺工具組/images/5.png"
  - "/posts/2015-07-11_pinkoi-設計師平臺工具組/images/6.png"
---

如果你朋友也是 Pinkoi 上的熱銷產品的設計師，或許你曾經聽過他提到 Pinkoi 平台後台的訂單管理系統有些可以改善的地方，主要一個就是沒有提供試算表匯出的功能。

所以我寫了兩個小工具可以減輕一點痛苦。第一個工具比較簡單是一個 chrome 擴充程式  — [pinkoi-csv](https://chrome.google.com/webstore/detail/pinkoi-csv/iaffjhimpdggaelffiadojfihhcoomlk)，安裝了之後先重新整理頁面，接著到 pinkoi 後進入訂單管理，在訂單管理的任何一個頁面，按右上角粉紅色的 Px 圖示，選擇你要下載的訂單種類，按下擷取訂單稍後數秒，就會將訂單下載成 csv 的檔案格式。

![image](/posts/2015-07-11_pinkoi-設計師平臺工具組/images/1.png#layoutTextWidth)

CSV 檔案格式可以用 iWork 的 Number 或是 [LibreOffice](https://zh-tw.libreoffice.org/) 打開，如果很不幸的你只有 Microsoft Excel，你可以去下載 LibreOffice，那是開源且免費的。

![image](/posts/2015-07-11_pinkoi-設計師平臺工具組/images/2.png#layoutTextWidth)

Number 打開像這樣

第二個工具故事就長了 ⋯⋯

### Pinkoi Utility

Pinkoi Utility 是一個安裝在 Google Spreadsheet 的外掛，功能主要有二：第一個是可以幫你在試算表裡面開分頁，每個分頁都是一種類型的訂單如下圖

![image](/posts/2015-07-11_pinkoi-設計師平臺工具組/images/3.png#layoutTextWidth)

第二個功能是假如說你的公司是用[中華票務](http://www.cxn.com.tw/)來開電子發票，恭喜你這個外掛程式可以幫你將訂單資訊直接送到中華票務直接開立電子發票。

先跟大家提醒，如果你要使用第二個功能，一定要先在中華票務提供的測試平台測試過後再使用。

以下安裝過程只需要做一次，之後就不用了。為什麼安裝過程會這麼繁雜是因為我寫好 Addon 之後原本應該可以立即發布，但是 Google 卻跟我說我的 Addon 要經過人工審查，基於這個只是個寫爽的專案，還要來來回回跟 Google 搞人工審查我就放棄了，目前只能用這個比較複雜的方式安裝。

安裝步驟請到[這個 github 網址](https://github.com/yurenju/pinkoi-utility)，照著步驟做即可。

安裝完後，還記得 pinkoi-csv 有兩個選項嗎？其中一個選項是下載 JSON 檔案，這個檔案就是用來讀取到 Google 試算表用的。

![image](/posts/2015-07-11_pinkoi-設計師平臺工具組/images/4.png#layoutTextWidth)

按下**擷取訂單（下載 json）**後，將會下載一個 pinkoi.txt 檔案，這時請把這個檔案上傳到 Google Drive 上任何一個地方。但別忘記檔名一定要是 pinkoi.txt，如果你下載多次變成 pinkoi (1).txt 請記得要把檔名改回來之後再上傳。同樣的如果 Google Drive 上已經有相同名字的檔案，請先移除後再上傳一次。

上傳完之後回到試算表，按下 Load Pinkoi.txt 你就會看到試算表開始自動地幫你建立試算表分頁以及所有訂單資料囉！

那發票要怎麼開呢？請先開一個試算表分頁，名稱是「cxn」，依序填下以下資訊：

1.  A1 填下 API 接口資訊，測試平台請填 [https://api-test.cxn.com.tw](https://api-test.cxn.com.tw/)，正式平台請填 [https://api.cxn.com.tw/](https://api.cxn.com.tw/)
2.  B1 填統一編號
3.  C1 填中華票服的帳號
4.  D1 填中華票服的密碼

接著到訂單裡面去找哪些訂單你要開發票，要開發票的訂單就整列複製，貼到 cxn 從 A2 那列開始貼上，支援多筆訂單。填完之後，按下「開立發票」就會開始把 A2 開始的訂單全部都開成發票，如果有多個品項也會自動彙整成一張發票。最後看到這個畫面就成功啦！

![image](/posts/2015-07-11_pinkoi-設計師平臺工具組/images/5.png#layoutTextWidth)

如果使用上有任何問題，你可以寫信給我 yurenju@gmail.com，因為這算是我興趣開發的，可能也沒辦法保證多久可以解決你的問題，不過還是歡迎回報問題！

上傳到中華票服後，當然就可以得到精美的熱轉印紙電子發票紙本囉！

![image](/posts/2015-07-11_pinkoi-設計師平臺工具組/images/6.png#layoutTextWidth)
