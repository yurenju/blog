---
title: "開放源碼授權概觀（下）"
author: "Yuren Ju"
date: 2018-07-03T01:31:01.411Z
lastmod: 2023-06-06T13:41:54+08:00
categories: [tech]

description: ""

subtitle: "在本文的上篇概略講解了開源授權定義與使用情境，但是不同的授權之間還是有細微的差別。本篇則針對常用的不同授權講解，由於授權數量眾多，我們會從鬆散到嚴謹程度逐一討論各種授權。"

images:
  - "/posts/2018-07-03_開放源碼授權概觀下/images/1.jpeg"
---

![image](/posts/2018-07-03_開放源碼授權概觀下/images/1.jpeg#layoutTextWidth)
在台灣的 OSDC 研討會所拍攝的照片

在[本文的上篇](https://medium.com/getamis/%E9%96%8B%E6%94%BE%E6%BA%90%E7%A2%BC%E6%8E%88%E6%AC%8A%E6%A6%82%E8%A7%80-%E4%B8%8A-45309a387c64)概略講解了開源授權定義與使用情境，但是不同的授權之間還是有細微的差別。本篇則針對常用的不同授權講解，由於授權數量眾多，我們會從鬆散到嚴謹程度逐一討論各種授權。

### 個別授權差異

#### MIT 授權

[https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

MIT 授權是這幾個列出來的授權當中最鬆散的一個，在權利上面規範有授予使用、重製、修改、合併、發行、散佈再授權及販售等權利，並且可以依照需求修改 MIT 授權條款內容。

而需要遵守的義務僅有要一併散佈 MIT 的授權聲明，至於衍生物開源與否並不在義務範圍內。

MIT 授權的好處在於授權本身非常簡短，同時也沒有規範太多規則，在個人專案我通常都會採用 MIT 授權的原因也在於沒有太多規則。

重點規則：

- 散佈時要附上 MIT 授權
- 衍生作品不需要開源

#### BSD 授權

[https://opensource.org/licenses/BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)

BSD 授權有許多變形，我們這邊談論的是 3-clause BSD。BSD 授權散佈源碼以及執行檔，但是不若 MIT 一樣有明確列出其他所有權利。

所需要遵守的義務跟 MIT 一樣需要一併散佈 BSD 授權聲明並且不規定開源與否，不同處在於 BSD 授權內額外規定衍生作品不得利用軟體貢獻者的名字為其背書。

重點規則：

- 散佈時要附上 BSD 授權
- 衍生作品不需要開源
- 不得利用軟體貢獻者為衍生產品背書

#### Apache 2.0 授權

[https://opensource.org/licenses/Apache-2.0](https://opensource.org/licenses/Apache-2.0)

Apache 2.0 授權基本上效力跟 BSD 授權非常類似，不同之處在於 Apache 2.0 授權在各個方面都提供非常詳實的授權說明，相比起來 BSD 授權則較為簡單。

在權利方面 Apache 授權針對著作權、專利授權以及商標權都有詳細的規定，著作權上允許製作衍生物、公開展示、公開演出、再授權和散佈。專利授權上允許製造、使用、販售等權利。商標權上明確規定 Apache 授權並無授權使用商標，相對於 MIT, BSD 授權並沒有明顯規範商標權來說，這樣清楚的說明不處理商標權比較明確。

在義務方面相同的需要附上 Apache 授權，並且在修改的檔案必須要附上修改聲明與一些細節的規定。

重點規則：

- 散佈時要附上 Apache 2.0 授權
- 衍生作品不需要開源
- 專利授權方面允許製造、使用、販售等多種權利
- 可為使用者提供擔保、支援服務等，但是不得使用其他貢獻者的名義擔保或背書支援服務
- 明確說明授權不處理商標權

關於 Apache 2.0 與 BSD 的差異可以參考這篇林懿萱著作的《[化簡為繁的 Apache-2.0 授權條款](https://www.openfoundry.org/tw/legal-column-list/8581-the-elaborate-license-apache-20)》。

#### MPL 2.0 授權

[https://opensource.org/licenses/MPL-2.0](https://opensource.org/licenses/MPL-2.0)

MPL 2.0 授權比起 Apache 授權更加嚴格，若採用 MPL 授權的源碼經過修改後，必須也要採用 MPL 2.0 授權釋出。但是如果不是修改 MPL 授權的檔案，而是連結（靜態與動態連結皆可）或使用 MPL 授權的檔案，則是可以採用其他授權，也就是不需一定要開放源碼。

至於專利授權上跟 Apache 授權類似允許製造、使用、販售等權利，另外也規範了若被授權人對其他貢獻者展開專利訴訟，該被授權人原本使用 MPL 授權軟體被授予的權利將會被撤銷。

重點規則：

- 散佈時要附上 MPL 2.0 授權
- 以 MPL 授權的源碼修改後也必須要使用相同授權釋出
- 衍生作品只需要開源自 MPL 授權修改的檔案，其他部分不需開源
- 專利授權方面允許製造、使用、販售等多種權利
- 被授權人展開專利訴訟時將會被撤銷該 MPL 授權軟體賦予他的權利
- 明確說明授權不處理商標權

#### LGPL 3.0 授權

[https://opensource.org/licenses/LGPL-3.0](https://opensource.org/licenses/LGPL-3.0)

LGPL 全文是 GNU Lesser General Public License，從名稱可以得知是較鬆散的授權，不過比較的對象是 GPL，如果跟其他授權比較起來還是滿嚴格的。

首先跟 MPL 相同，如果修改了 LGPL 的源碼一律都要開源。比起 MPL 更嚴格的地方在於 MPL 授權允許你把一個 MPL 授權的專案直接放到你自己專案的目錄底下一起編譯成執行檔，但是 LGPL 授權的專案當你這麼做時會被視為 LGPL 授權的衍生作品，也需要一併以 LGPL 授權釋出。

根據 [StackExchange 上面其他人的見解](https://softwareengineering.stackexchange.com/questions/221365/mozilla-public-license-mpl-2-0-vs-lesser-gnu-general-public-license-lgpl-3-0)，LGPL 3.0 與 MPL 2.0 的差異實務上在於 LGPL 可以允許用動態連結 (Dymanic Link) 的方式將閉源專案與 LGPL 3.0 授權專案一起使用，但是如果要採用靜態連結 (Static Link) 則是會需要一併以 LGPL 3.0 授權釋出。MPL 2.0 則允許靜態連結與動態連結都不需開源。

重點規則：

- 散佈時要附上 LGPL 3.0 授權
- 以 LGPL 授權的源碼修改後也必須要使用相同授權釋出
- 衍生作品若是採用動態連結則不需要一併開源，靜態連結則需開源
- 專利授權方面允許製造、使用、販售等多種權利
- 被授權人展開專利訴訟時將會被撤銷該 LGPL 授權軟體賦予他的權利

#### GPL 3.0 授權

[https://opensource.org/licenses/GPL-3.0](https://opensource.org/licenses/GPL-3.0)

GPL 比起前面的授權都要更加嚴格。無論是靜態或動態連結到 GPL 授權專案時，都需要相同以 GPL 授權釋出，至於其他特性則與 LGPL 3.0 相同。

重點規則：

- 散佈時要附上 GPL 3.0 授權
- 以 GPL 授權的源碼修改後也必須要使用相同授權釋出
- 衍生作品需要以 GPL 授權釋出，無論是靜態或是動態連結
- 專利授權方面允許製造、使用、販售等多種權利
- 被授權人展開專利訴訟時將會被撤銷該 GPL 授權軟體賦予他的權利

另外舊版的 GPL 2 也是目前相當熱門的授權，關於版本之間的差異可以參考林誠夏的《[GPL-3.0 與 GPL-2.0 的異同比較與應用分析](https://www.openfoundry.org/tw/legal-column-list/8753-the-analysis-of-foss-license-upgrade-based-on-gpl-30-and-gpl-20-comparison)》。

#### AGPL 3.0 授權

[https://opensource.org/licenses/AGPL-3.0](https://opensource.org/licenses/AGPL-3.0)

AGPL 是這邊最嚴格的授權，以上的所有授權在「開放源碼」的時機通常都在於當你「散佈」你的產品時需要附上源碼。但是如果像是 Google 或 Facebook 這樣的雲端服務，當你瀏覽他們的網站時其實公司並沒有「散佈」他們的產品，而是你連結到他們的網站使用他們的服務。既然沒有散佈，那就不需要開源。即使使用 GPL 3.0，只要你是類似這樣的服務模式都不會需要開放源碼。

AGPL 則是對應這樣的雲端服務而誕生的授權，就算只是使用者「利用」到自 AGPL 衍生的產品，即使產品沒有散佈到使用者手上，仍需要以 AGPL 3.0 授權。

重點規則：

- 散佈時要附上 AGPL 3.0 授權
- 以 AGPL 授權的源碼修改後也必須要使用相同授權釋出，即使沒有散佈軟體，只要有人「使用」軟體就就需要以 AGPL 開源
- 衍生作品需要以 AGPL 授權釋出，無論是靜態或是動態連結
- 專利授權方面允許製造、使用、販售等多種權利
- 被授權人展開專利訴訟時將會被撤銷該 AGPL 授權軟體賦予他的權利

### 總結

開放源碼授權真是一個龐大的課題，但是身為開發者又不得不好好的理解這些授權。不過就如同前面的 TL;DR 一樣，我自己選擇時通常有個簡單的策略來判斷專案若要開源要如何選擇專案。

你也可以了解完所有開源授權後，建立自己簡易的授權決策方針，往後要開源時就照著這個決策方針來判斷軟體要以哪個授權釋出就行了。

最後想要再次感謝自由軟體鑄造場大量的開源授權資訊，本篇文章閱讀了相當多鑄造廠發表的資料後並且整理成這篇文章。另外 2018 年 COSCUP 將會有個社群議程軌 “[FOSS Compliance — Complex Made Simple](http://blog.coscup.org/2018/05/coscup-information-about-tracks-this.html#FOSS-Compliance---Complex-Made-Simple)” 將會探討關於開源授權的相關知識，如果你想更深入了解，可以到時也到該軌議程參與。

如果有興趣了解 AMIS 的開源專案，也可以從下面的連結前往。

[AMIS](https://github.com/getamis)

### 補充

讀者 [Fiona Lo](https://medium.com/u/2c17c82f79fd) 提問想確認 AGPL v3 對於動、靜態連結的解釋的對應條文為何，詳情可見[評論](https://medium.com/@fionanalo/yuren-%E6%82%A8%E5%A5%BD-%E8%BF%91%E6%97%A5%E7%A0%94%E7%A9%B6agplv3-7057b23d648c)。因為我自己對於開源授權主要還是第二手資料，並沒有直接閱讀法律條文，所以請教了[林誠夏老師](https://www.facebook.com/lucienchenghsia.lin)這個問題，回覆如下：

#### 林誠夏老師的回覆

> 其實你原文指涉到 static link 和 dynamic link 就是這句：「衍生作品需要以 AGPL 授權釋出，無論是靜態或是動態連結」。> 這句是對的，怎麼說呢？不論是 GPL-3.0、GPL-2.0，或 AGPL-3.0，決定授權拘束有沒有「擴散」，認定的都是「新作是不是原開源作品的衍生著作(derivative work)」，所以如果把你的原句「衍生作品需要以 AGPL 授權釋出，無論是靜態或是動態連結」作以下的結構解讀，就完全沒有問題：> 1、衍生作品需要以 AGPL 授權釋出，這是規定在 AGPL-3.0 授權條款的要求；> 2、無論是靜態或是動態連結，只要這個連結利用關係，算是基於原著作另為創作，那就是衍生關係。> 然後，其實當代較有使用率的開源授權，是沒有直接將靜態、動態這樣的區隔列入條款定義的，因為技術上太容易被操弄，除了中國大陸新訂的 Mulan Public License 2.0 以外：[https://license.coscl.org.cn/MulanPubL-2.0/index.html](https://license.coscl.org.cn/MulanPubL-2.0/index.html%EF%BC%8C%E5%85%B6%E4%BB%96%E8%BC%83%E9%80%9A%E7%94%A8%E7%9A%84%E9%96%8B%E6%BA%90%E6%8E%88%E6%AC%8A%EF%BC%8C%E5%85%B6%E5%AF%A6%E6%8E%88%E6%AC%8A%E6%96%87%E6%9C%AC%E6%A0%B9%E6%9C%AC%E6%89%BE%E4%B8%8D%E5%88%B0%E9%9D%9C%E6%85%8B%E6%88%96%E5%8B%95%E6%85%8B%E9%80%99%E6%A8%A3%E7%9A%84%E5%AD%97%E8%A9%9E%E3%80%82?fbclid=IwAR2EDDz2fZzIEBHK5fp35qmIHCRmqFdVBCqA4ptX2KCcm9-5mQw69pygONY) ，其他較通用的開源授權，其實授權文本根本找不到靜態或動態這樣的字詞。> 重點還是在衍生著作的認定，一旦被認定是衍生著作，那 AGPL-3.0 的授權拘束要求就會隨之而來，靜態和動態只是一個推定效果，就是說，新作有透過連結的方式呼叫原 AGPL-3.0 程式，我們推定這個衍生關係是在的，若此推定能被推翻，可能就另作解釋，但若不能被推翻，則當這個衍生關係是存在的。> 所以，若要論條款內容，就是去挑出 AGPL-3.0 認定衍生程式的條款，有以下幾條：> 1、To “modify” a work means to copy from or adapt all or part of the work in a fashion requiring copyright permission, other than the making of an exact copy. The resulting work is called a “modified version” of the earlier work or a work “based on” the earlier work.→ 這條有！衍生關係即為取用抄寫(adapt)原作的一部份，該行為若需要得到著作權允許，則改作衍生關係即存在。> 2、A compilation of a covered work with other separate and independent works, which are not by their nature extensions of the covered work, and which are not combined with it such as to form a larger program, in or on a volume of a storage or distribution medium, is called an “aggregate” if the compilation and its resulting copyright are not used to limit the access or legal rights of the compilation’s users beyond what the individual works permit. Inclusion of a covered work in an aggregate does not cause this License to apply to the other parts of the aggregate.→ 這條是授權拘束性的除外沒錯。(aggregation 除外)> 3、A separable portion of the object code, whose source code is excluded from the Corresponding Source as a System Library, need not be included in conveying the object code work.→ 這條也是授權拘束性的除外沒錯。(System Library 除外)> 迂回來，其實你原表達的語勢是對的，「衍生作品需要以 AGPL 授權釋出，無論是靜態或是動態連結」，更完整的解釋是「只要是被認定為 AGPL-3.0 的衍生作品，後續又提供網路使用，則需要以 AGPL-3.0 授權釋出程式源碼給網路使用的使用者，無論這時候這個衍生程式被觀察是採靜態或動態的方式與原 AGPL-3.0 的程式進行互動，重點在於衍生關係存在，這個拘束關係就存在。」> 所以大概更進一步補充這樣的資訊給這位讀者，應該就可以了！
