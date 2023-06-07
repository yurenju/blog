---
title: "IronWorker — Scheduled tasks 好工具"
author: "Yuren Ju"
date: 2015-07-10T17:00:11.423Z
lastmod: 2023-06-06T13:36:50+08:00
categories: [tech]

description: ""

subtitle: "上週八仙塵爆發生時，台灣血液基金會因為沒有提供血液庫存資訊開放格式的資料，晚上就快速寫了一個從他們網站自動解析庫存資訊並且儲存成 JSON 的小爬蟲 blood，再儲存到 github 的小程式。在村長的推薦下用了 IronWorker…"

images:
  - "/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/1.png"
  - "/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/2.png"
  - "/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/3.png"
  - "/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/4.png"
  - "/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/5.png"
  - "/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/6.png"
---

![image](/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/1.png#layoutTextWidth)

上週八仙塵爆發生時，台灣血液基金會因為沒有提供血液庫存資訊開放格式的資料，晚上就快速寫了一個從他們網站自動解析庫存資訊並且儲存成 JSON 的小爬蟲 [blood](https://github.com/g0v/blood)，再儲存到 github 的小程式。在[村長](http://blog.clkao.org/)的推薦下用了 [IronWorker](http://www.iron.io/) 真是驚為天人的好用，在這邊介紹一下，順便簡介如何設定整個服務。

IronWorker 是一個可以執行程式片段的服務，你可以把各式各樣的程式片段放到上面執行像是縮圖、處理資料、轉檔等等工作，藉著被切成獨立並且非同步執行的程式片段可以讓你自己的服務容易擴展。同類型的服務有 AWS Lambda。

而在我的使用情境則是用它來定時跑一個擷取分析網頁內容，並且把結果 commit 回 github 的小程式。雖然 AWS Lambda 也有相同的功能但是要設定 scheduled task 有點麻煩。更重要的是 IronWorker 提供每個月十小時的免費額度，我們用的這個小程式每次執行大概需要十秒鐘，所以一個月下來也不會超過額度。

回到專案本身，這個專案產生出來的資料主要是用在 [八仙粉塵爆炸開放資料查詢](http://g0v.github.io/color/#blood) 中血液查詢的部分

![image](/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/2.png#layoutTextWidth)

而小程式則是利用 jsdom 分析網頁搭配 shell.js 簡化指令操作達成，整個 script 只有四十行。

其中 GH_TOKEN 跟 GH_REF 要用環境變數的方式設定，GH_REF 設定為 github.com/g0v/blood.git，而 GH_TOKEN 則從 github 的 Settings -&gt; Personal access keys 裡新增。

當執行這個小 script 時，就會到 blood.org.tw 分析網頁，並且把擷取到的資訊存成 JSON 檔案再 commit 回去 blood 專案的 gh-pages branch。

至於如何在 IronWorker 上面每個小時執行一次呢？首先需要在專案當中新增兩個檔案 blood.worker 跟 iron.json。前者用來設定 IronWorker 的環境，後者則放置 iron.io 的 token 跟 project_id。

blood.worker 檔案內容如下：

重要的有兩個地方，第五行用來安裝套件，但有些 ssl 不會過所以在這邊要把 SSL 關閉。第八行意思是要在遠端安裝所有相依套件。至於 iron.json 在 iron.io 建立專案後可以直接下載。

![image](/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/3.png#layoutTextWidth)

接下來就可以把專案上傳到 iron.io 了，先用 gem 安裝 IronWorker 的工具：

> $ gem install iron_worker_ng

安裝完畢後用下面的指令就可以上傳專案源碼

> $ iron_worker upload blood

最後到 iron 專案內的 scheduled task 設定什麼時候想跑就收工了！

![image](/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/4.png#layoutTextWidth)

最後就可以在 blood project 的 gh-pages branch 中找到 [JSON 檔案](https://github.com/g0v/blood/blob/gh-pages/blood.json)，也可以看到每一個小時就會多一個 commit：
![image](/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/5.png#layoutTextWidth)

### Github + Travis-CI + IronWorker

身為一個愛好自動化的宅宅，每次有人送了 pull request 之後，我還要自己執行 iron_worker 也說不過去，這個時候就可以用 Travis-CI 幫 github 跟 IronWorker 建起友誼的橋樑，也讓我 merge commit 之後可以透過 travis-ci deploy 到 iron.io 上面。

![image](/posts/2015-07-10_ironworker-scheduled-tasks-好工具/images/6.png#layoutTextWidth)

其中 .travis.yml 是這樣設定的

其中 env.global 裡面有好幾個 secure 開頭的環境變數，這是因為這些環境變數被加密了的關係，建立加密的環境變數可以用下面的指令

而 install section 不要忘記要安裝 iron_worker_ng，以及最後用 after_success 執行 deploy 用的 script iron-upload.js

這個 script 最主要的目的就是產生 blood.worker, iron.json 以及執行 iron_worker upload 指令這三件事情，大多都跟手動 deploy 差不多，不一樣的是環境變數會自 .travis.yml 中的加密環境變數取得。為什麼會需要自動產生是因為這兩個檔案都有包含 Token，直接 checkin 到 github 顯然不是個好主意。

有了這樣的設定，當有人 send pull request 並且接受後，就會自動的 deploy 到 iron.io，省下開發者寶貴的時間。

總之， IronWorker 佛心的提供了每個月十小時的運算時間，一般來說處理簡單的自動分析網頁其實也花不了多久，以 blood project 來說每個工作大概十秒鐘上下就可以結束，就算每個小時都更新一個月下來也花不到幾個小時，真的是一個很不錯的工具！
