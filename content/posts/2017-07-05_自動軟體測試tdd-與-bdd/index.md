---
title: "自動軟體測試、TDD 與 BDD"
author: "Yuren Ju"
date: 2017-07-05T02:45:13.469Z
lastmod: 2023-06-06T13:39:48+08:00
categories: [tech]

description: ""

subtitle: "軟體開發難免有錯誤，為了減低這些錯誤數量，開發時經常使用自動化的測試來確保每次的修改是否有改壞舊有的行為。搭配上持續整合 (continues integration) 的工具，在每次 git commit / push 時都可以交由這些工具自動測試。"

images:
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/1.png"
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/2.png"
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/3.png"
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/4.png"
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/5.png"
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/6.png"
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/7.png"
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/8.png"
  - "/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/9.png"
---

軟體開發難免有錯誤，為了減低這些錯誤數量，開發時經常使用自動化的測試來確保每次的修改是否有改壞舊有的行為。搭配上持續整合 (continues integration) 的工具，在每次 git commit / push 時都可以交由這些工具自動測試。

以下將會以兩個專案作為例子，第一個專案是「[勞基法函式庫](https://github.com/g0v/labor-standards-tw)」提供勞基法裡面程式化的法條規則，第二個專案是「[勞工權益](https://github.com/yurenju/laborrights)」網站，利用勞基法函式庫開發的 [mobile web app](https://yurenju.github.io/laborrights/#/)，填寫基本資訊後可以快速獲取各種權益如特休天數、加班費與資遣費等等資訊。

實際上以「勞工權益」這個網站為例子，該專案以 github 管理源碼，travis-ci 作為持續整合工具，整個開發流程會是這樣：

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/1.png#layoutTextWidth)

實際上運作時，不論是 pull request 的頁面或是 commit 列表都可以看到綠色的小勾勾，移到上面會寫 `Success: The Travis CI build passed`。

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/2.png#layoutTextWidth)

[https://github.com/yurenju/laborrights/commits/master](https://github.com/yurenju/laborrights/commits/master)

點進去可以看到每次的測試結果，同時也會顯示測試項目通過的狀況：

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/3.png#layoutTextWidth)

[https://travis-ci.org/yurenju/laborrights/builds/249925132](https://travis-ci.org/yurenju/laborrights/builds/249925132)

自動軟體測試是開發軟體中非常重要的環節，讓整個開發流程中，每次都需要做的瑣碎步驟如檢查 coding style, auto testing, deploy 等等都自動化，開發者就可以專注在更重要的事情，如 code review 以及討論規格等等。

另外測試有很多種類型如 unit test 或 e2e test，這次就先不討論了。

### TDD (Test-Driven Development)

TDD 是一種開發的流程。許多專案在開發時，通常會邊寫程式邊寫測試，或是先寫程式後寫測試，或是更常見  —  你知道的，寫了程式不寫測試。

TDD 則是「**先寫測試再開發程式**」。沒有程式要怎麼寫測試呢？除了有些工具可以讓你寫測試時，一邊幫你產生空的類別與方法外（如 Eclipse 撰寫 Java 時就有類似的功能），一般來說也可以直接假設你已經撰寫好了程式，先揣摩如果已經寫好了這個程式該要如何使用。

舉個例子，在[勞基法函式庫](https://github.com/g0v/labor-standards-tw)這個專案裡面的測試案例在還沒開始實作前，可以寫成這樣：
` // 一個月薪 25000 男性，今天剛上班的勞工，在平常日從八點工作十一個小時
// 他的加班費應該為 451 元``const labor = new Labor()
labor.setAge(20)
     .setGender(Gender.MALE)
     .onBoard(new Date())
     .setMonthlySalary(25000)``const worktime = new WorkTime(Duration.DAY, labor)
const start = new Date(2017, 6, 5, 8)
worktime.add(start, 11)
const result = worktime.overtimePay()
expect(result.value.overtimePay).eq(451) `

當我們在還沒開始寫程式之前就開始寫測試有什麼好處呢？其中一個最大的好處是開發者當寫出測試時，就可以瞭解這一個元件最後會怎麼使用，同時也釐清的程式的介面會如何定義。

在上面這個例子 labor 物件有 `setAge()`, `setMonthlySalary()` 等方法，當在設計這些方法前有測試案例時，我們又可以考慮這些方法都回傳 labor instance 本身，這樣就可以在使用時用 method chaining 的方式呼叫。同時我們也會釐清會有 `WorkTime` 與 `Labor` 兩個類別，其中各別包含了一些方法 (method)。

當我們沒有測試憑空開出的 API 介面，常常會設計好了真的使用時又發現不合用，會需要修改個幾次確定到底要怎麼開才好。當在沒有實作前就寫了測試，在開發前就會對整個介面有更清楚的理解，寫出來的介面變動就可以更小。

而開發者之間有需要討論時，也可以用這份測試案例討論到底該怎麼實作好，作為討論的基礎，在還程式還沒實作前就可以確認介面跟修改，花費的成本與時間會比實作後來得低。

而結合著前面提到的自動軟體測試，採用 TDD 時當所有測試都通過，持續整合的服務從紅燈變成綠燈時，就代表你已經實作完成所有測試案例涵蓋的範圍，軟體開發就可以到了一個階段，接下來可以撰寫更多測試，並且繼續實作，或是可以重構原本的源碼，在測試都會通過的狀況下撰寫更高品質的程式。

### BDD (Behavior-driven development)

大家有沒有發現不論是自動軟體測試或是 TDD 都是著重在工程師呢？儘管 TDD 可以作為工程師之間討論的媒介與基礎，但是非技術人員如 PM 或設計師其實是很難理解測試案例的內涵，也不太可能根據測試案例討論軟體的功能。

BDD 則是比起 TDD 更進一步，除了在實作前先寫測試外，而在測試前還要先寫規格，但是這份規格並不是單純的敘述軟體的功能，而是這份規格，是一份「**可以執行的規格**」。

以 cucumber 這個 BDD 框架為例，在勞工權益網站裡面有一個跟工會資訊相關的規格：

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/4.png#layoutTextWidth)

[https://github.com/yurenju/laborrights/blob/master/features/contact.feature](https://github.com/yurenju/laborrights/blob/master/features/contact.feature)

這段規格以中文書寫，不論是工程師或其他非技術人員都可以理解這段規格，並且可以一同討論這樣的規格有哪些需要修改，利用這樣大家都可以理解的文字，建立大家對規格的共識。

當這個規格充分討論並且定案後，這份「規格」就可以準備被轉換成「測試案例」，此時把這份規格放到 cucumber 預定的目錄 `features/` 後，執行 `cucumberjs` 指令則會出現以下兩種訊息，第一種是目前規格每個步驟的狀態：

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/5.png#layoutTextWidth)

黃色文字搭配問號的意思是此步驟尚未實作，若再稍微往下拉一點，則會看到 cucumberjs 提供給你實作的樣板：

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/6.png#layoutTextWidth)

這個樣板就可以直接複製貼上到你的測試案例中，成為一個尚未實作 (pending) 的步驟。你可以注意到在測試案例中用雙引號括起來的部分會被解析成 `{stringInDoubleQuotes}`，這個部分會被當作參數傳入測試步驟中，可以做進一步的使用。

而在測試案例中重複出現的步驟，比如說在另外一個測試案例，「使用者進入網站」跟「點選 “更多選項” 連結」重複出現，只是雙引號中的文字不同，這些步驟就會被歸類聚合在一起，成為同一個測試步驟。

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/7.png#layoutTextWidth)

最後，只要一一的實作目前還被標示 pending 的測試步驟，當所有步驟都被實作時，整個測試案例也就完成了。下面則是一個已經被實作的測試步驟

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/8.png#layoutTextWidth)

[https://github.com/yurenju/laborrights/blob/master/features/step_definitions/common-steps.js](https://github.com/yurenju/laborrights/blob/master/features/step_definitions/common-steps.js)

接下來就跟 TDD 一樣，寫完測試之後再寫主程式，一一地通過測試案例，當所有測試案例都通過時，程式也就完成了。

![image](/posts/2017-07-05_自動軟體測試tdd-與-bdd/images/9.png#layoutTextWidth)

當然有些測試案例當程式完成後發現原本的測試案例可能有些問題，但是大致上是不需要做太大的修正的。

比起 TDD 來說，BDD 更可以讓非技術人員一起參與討論，而工程師也可以直接拿這份規格轉化成測試案例，讓規格成為「可執行的規格」，各種不同背景的人一起討論時，也會更容易對軟體專案有更一致的共識。

而 BDD, TDD 與自動軟體測試這些都是需要一起相輔相成，沒有了自動軟體測試的持續整合服務，BDD 可以發揮的空間就更小了。

話說回來 BDD 跟 TDD 都不是可以容易施行的開發流程，也會需要工具輔助（如 cucumber）與團隊成員們的配合，但是接觸這樣的開發流程可以讓自己親自體驗這樣開發流程帶來的好處與壞處，我蠻建議工程師都可以在自己的小專案或 side project 實際實行這樣的開發流程，拓展自己的經驗。至於如公司的專案則需要許多人一起協力才可推動，也不是所有專案都適合這樣的開發流程，就要更審慎的評估了。

註記：在 javascript 著名的 assertion library [chaijs](http://chaijs.com/) 中，可以看到有兩種「風格」的測試方式：TDD style 與 BDD style。我覺得這比較像是藍山咖啡跟藍山「風味」咖啡，藍山咖啡是真的來自於牙買加藍山，而藍山風味咖啡就不見得了（雖然我自己是很少喝藍山咖啡啦）。同理使用 BDD style 的 assertion library 並不是真的就是施行 BDD，只是「BDD 風味」罷了。
