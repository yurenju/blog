---
title: "21 世紀社會安全網"
author: "Yuren Ju"
date: 2016-11-24T02:01:02.552Z
lastmod: 2023-06-06T13:39:22+08:00
categories: [tech]

description: ""

subtitle: "這是在 cfasummit 聽到的座談會 “A 21st century safety net: visions, models, and…"

images:
  - "/posts/2016-11-24_21-世紀社會安全網/images/1.jpeg"
---

![image](/posts/2016-11-24_21-世紀社會安全網/images/1.jpeg#layoutTextWidth)

這是在 cfasummit 聽到的座談會 “A 21st century safety net: visions, models, and tactics”。這個的演講方式是每個人都有段時間可以講自己參與的專案，不過跟之前形式比較不一樣的是講者之間的討論比較少，另外因為演講的時間較長所以 QA 的時間也比較少一點。

這篇我會把列出這場座談會所介紹的專案（有些我沒聽到就跳過了）。

### HealthCare.gov

講者是 Sha Hwang，NAVA PBC 的 co-founder。NAVA 是一間公益性企業（public benefit corporation），主要負責的專案是改善 2013 釋出的歐巴馬健保的 HealthCare.gov 這個網站，前身為 Marketplace Lite 公司。

根據 Wikipedia 的資料，這個在 2013 年十月一日公開的 HealthCare.gov 網站，雖然照計畫在時程內上線了但是卻遇到一連串的技術問題讓民眾難以透過這個網站登錄他們的健保。主要的承包商 CGI Federal 還出席了國會聽證會解釋這些問題。

根據 wikipedia 的資料，原本這個系統的預算是九千三百萬美金，最後卻已經花費超過十七億美金。而根據[新聞](http://america.aljazeera.com/articles/2013/10/31/only-six-enrollmentsforhealthcaregovafterfirstday.html)指出這個網站開張的第一天，只有六個人成功註冊這個系統，說明這個系統有非常嚴重的缺陷。

NAVA （前身為 Marketplace Lite, 簡稱 MPL）感覺起來就是一個救火隊來解救花費高昂但卻又沒有真的達到功效的 healthcare.gov 網站。根據 [報導](http://www.theatlantic.com/technology/archive/2015/07/the-secret-startup-saved-healthcare-gov-the-worst-website-in-america/397784/) 他們在數個月內完全重寫 healthcare.gov 網站，利用矽谷創業公司慣用的 agile 敏捷式開發，建構了一個全新 RWD 的網站，並且更換掉原本的登入系統，也重新檢討過了使用流程，讓使用者操作時只要花費以前一半的時間。

不過因為我不是美國人的關係，雖然進了網站但也不知道該如何操作，但聽起來這種救火隊的工作通常都是吃力不討好，還好他們最後有完成任務了。

### mRelief

mRelief 是一個整合了多種社會照顧服務的專案，不僅通過網站的方式就可以啟用，他們真正實用的是可以透過簡訊的方式就可以存取你可能會需要的資訊，如下面這個影片。

這個影片用 mRelief 提供的簡訊服務，傳送 Hello 過去後就可以開始整個流程，上面的範例示範了要如何用簡訊了解自己是否符合食物卷計畫，並且依據你的所在地（透過 zipcode）告訴你最近的社區服務中心在哪裡。

這個其實跟我們在寫 chatbot 根本一樣，而且簡訊服務其實是對於沒有智慧型手機的人非常重要，而需要這樣資源的人也很有可能沒有智慧型手機，簡訊服務對他們來說算是非常方便，這個專案也是蠻值得學習的。

### Fresh EBT — Propel

這是另外一個有意思的專案，如果大家有印象的話我曾經在 GetCalFresh 文章裡面提到他們的食物卷目前使用 EBT 簽帳卡提供，申請者可以用這張卡去買食物。

那要如何查詢你的消費記錄，跟你還剩多少糧食補助呢？根據 Fresh EBT 的 Youtube 你可以透過熱線查詢，或者乾脆留下消費的明細之後對帳用。

而 Fresh EBT 就是一個設計給這樣申請者的 iOS/Android app，安裝了這個 app 後，使用者可以透過這個 app 存取自己 EBT 簽帳卡的消費記錄，這樣申請人就可以很快地就知道自己這個月的糧食補助還剩多少，要如何規劃這個月的補助分配，同時也可以直接從這個 app 查詢附近可以用 EBT 買食物的地方在哪邊。

但是其實 Propel 也是一間公司，要如何利用這樣的 app 盈利呢？基本上 app 是免費的，以後也不太可能會跟使用者收錢，而且他們也宣稱他們沒有把任何財務資料回傳回伺服器，所有財務資料都在使用者的手機裡。

不過根據 [Propel 的調查](https://medium.com/@JoinPropel/helping-our-users-build-financial-health-fresh-ebts-referral-policy-e83ccf48a169)，他們的使用者當中有相當一部分的人財務健康有非常大的改善空間，而他們又跟其他一些 FinTech 公司有非常不錯的夥伴關係，所以他們利用轉介使用者給其他 FinTech 的公司來盈利。Propel 可以依此盈利，夥伴公司可以獲得新客戶，而使用者有可能可以藉此改善財務困境。

這也是個很妙的商業模式，畢竟它們的使用者數量應該不少，有此需求的使用者也很多，所以看起來或許是可行的商業模式。但是這樣的商業模式不知道在台灣可不可行，或許很容易就罵到臭頭，這也是值得好好在思考的問題。
