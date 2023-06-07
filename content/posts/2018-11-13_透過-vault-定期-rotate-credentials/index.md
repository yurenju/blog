---
title: "透過 Vault 定期 rotate credentials"
author: "Yuren Ju"
date: 2018-11-13T02:01:01.999Z
lastmod: 2023-06-06T13:42:05+08:00
categories: [tech]

description: ""

subtitle: "Vault 是一套由 HashiCorp 主導開發用於管理機密資料的開源專案。所有儲存在 vault 內的資料都會經過加密，並且管理限制存取範圍，同時也可以動態產生 credential 增加服務安全性。"

images:
  - "/posts/2018-11-13_透過-vault-定期-rotate-credentials/images/1.png"
  - "/posts/2018-11-13_透過-vault-定期-rotate-credentials/images/2.png"
  - "/posts/2018-11-13_透過-vault-定期-rotate-credentials/images/3.png"
  - "/posts/2018-11-13_透過-vault-定期-rotate-credentials/images/4.png"
---

建立一個軟體服務時，剛開始通常都會把 API Key、連接資料庫或 AWS 的帳號密碼儲存在各式各樣的地方，檔案、環境變數、甚至一個不小心就儲存到 git 裡面。
![image](/posts/2018-11-13_透過-vault-定期-rotate-credentials/images/1.png#layoutTextWidth)
沒有良好的規劃，帳號密碼很容易就散落各處

隨意儲存固然方便簡單，但是伴隨安全隱憂。隨著服務愈來愈重要，開發者會開始更加安全的儲存這些重要的資訊，例如將這些 credential 集中儲存在同一個地方。除此之外通常也會從多個面向來提昇安全性，像是縮限每個 credential 的存取範圍，或是過一段時間就更換一次 credential 等等。

可是要定期更換 credential 是一件多麽痛苦的事情，假如說服務中有十個 instance ，要規劃安全又不中斷服務的方式更換所有 instance 的資料庫帳號密碼會是個很大的挑戰。

當使用的 credential 數量與種類增加，痛苦指數就會快速上升。今天想來介紹 Vault，用它來動態的產生 credential 可以痛苦指數降低一些。

### Vault 介紹

[Vault by HashiCorp](https://www.vaultproject.io/)

Vault 是一套由 HashiCorp 主導開發用於管理機密資料的開源專案。所有儲存在 vault 內的資料都會經過加密，管理者可以透過開設不同的帳號或 token 來限制不同的存取範圍，同時 token 的存取紀錄都會透過 audit 模組記錄下來，方便之後查核用途。

但是安全的存放機密資料並不是 vault 最實用的地方，Vault 方便之處在於它可以幫你動態的產生 credential 並且設定過期的期限，等期限到了 Vault 會幫你撤銷該 credential。
![image](/posts/2018-11-13_透過-vault-定期-rotate-credentials/images/2.png#layoutTextWidth)
而因為 credential 會動態的產生，所以每一個元件都會拿到不一樣的 credential。如果發現已經洩漏，也可以透過 audit 模組知道是哪個元件使用的 credential 洩露了，接著用 vault 撤銷憑證的功能把特定的 credential 撤銷。跟所有的元件都採用同一個 credential 相比，影響的範圍會更小，會需要處理的工作也會更少。

### 範例

這邊用 node.js 展示一下 vault 的使用方法。

需求如下：demo.js 是一個需要存取 MySQL 的 command line 工具，我們希望定期變更 demo.js 使用的 MySQL 帳號密碼來增加安全程度。在範例中我們把 credential 期限設定成十秒，不過一般來說線上使用時期限可能會是二週或一個月等。

這個範例可以在 github 上面找到完整的源碼。

[yurenju/vault-demo](https://github.com/yurenju/vault-demo)

一般來說存取資料庫大多都會到特定資料表讀取與寫入資料，不過在這個例子裡面我們簡化 demo.js 存取 MySQL 拿到的資料是每秒去跟 MySQL 問自己目前用哪個 User 建立連線： `SELECT USER();`，這樣範例裡面我才不用額外需要新增表格 :-)

demo.js 會在幾個時機跟 vault/mysql 溝通：

1.  初始時會跟 vault 動態的索取一組 credential，此時 Vault 連結 MySQL 幫你動態生成一組帳號密碼，並且在期限後幫你刪除。
2.  每秒會用此 credential 讀取 MySQL 內的資訊
3.  到達過期時間的一半（五秒）時，跟 vault 拿一組新的 credential
4.  遇到無法存取資料的錯誤時，跟 vault 拿一組新的 credential
5.  結束時會把正在用的 credential 註銷
    ![image](/posts/2018-11-13_透過-vault-定期-rotate-credentials/images/3.png#layoutTextWidth)

#### 設定環境

首先我們會需要 MySQL 跟 Vault 的服務，利用 docker-compose 可以很簡單地把需要的環境建立完成。我們在 docker-compose 裡面起了一台 MySQL 與一台 vault：

透過 `docker-compose up` 就可以將 mysql 跟 vault 服務啟動。

接下來則要設定 Vault 讓它知道要怎麼動態發出 credential，打開另外一個終端機分頁，使用 bash shell script 來做初始化。這個命令使用了 vault 的 command line，macOS 可以利用 homebrew 安裝 vault。
`$ brew install vault`

這邊有幾個名詞先解釋一下：

- secret engine: 用來連接不同服務並且動態產生 credential 的元件，比如說 database secret engine 可以用來產生資料庫的動態帳號密碼，AWS secret engine 則是用來動態產生 AWS IAM user
- database 組態設定：用來告訴 vault 要怎麼連接你的資料庫，這邊會需要給他足夠大權限的 root credential 讓它可以幫你根據不同的 role 建立不同權限範圍的使用者
- role：因為資料庫裏面可能有很多不同的資料表，用多組 role 就可以設定不同權限範圍的使用者

在 init.sh 裡面，第 7 行 `vault secrets enable database` 的用途是啟用 database secret engine，這個引擎支援多種資料庫，可以讓 MySQL, PostgreSQL 等資料庫可以動態派送 credential。除此之外也有許多不同的 secret engine 如 AWS, Azure, Google Cloud, LDAP, SSH 等等，可以支援的服務非常多元。

第 9 行則是告訴 vault 該資料庫的 root credential 用來建立以及刪除資料庫使用者，這行指令除了把 root credential 傳給 vault 外還有指定我們要連接的資料庫的 plugin 是 `mysql-database-plugin`，另外也用 `allowed_roles` 指定這個資料庫設定只給 my_role 這個角色使用，其他 role 則不能存取這個資料庫設定。

第 14 行是建立 `my_role` 這個角色，其中 `creation_statements` 用來指定建立該使用者時的 SQL 語法，在這邊也可以設定這個使用者對資料表的存取權限。另外這邊我們設定 `default_ttl` 是十秒鐘，代表透過這個 role 產生的 credential 建立後十秒鐘後會過期， `max_ttl` 為 20 秒則是因為 vault 支援 credential 延長的功能，最多可以延長到 20 秒。

當執行 init.sh 後 vault 的設定就完成了，這時候可以利用 vault 來嘗試發出動態的 credential：
`# 讀取 .env 裡面的環境變數
$ export $(egrep -v &#39;^#&#39; .env | xargs)
$ vault read database/creds/my-role``Key Value

---

lease_id database/creds/my-role/1nZSP653ppdsrCMwDM7qDtob
lease_duration 10s
lease_renewable true
password A1a-4I90sOuUFcYKgeK9
username v-token-my-role-4iDqk7sRI4m6Gocm`

如果你手速夠快的話，可以馬上利用這組帳號密碼登入 MySQL，這組帳號密碼會在十秒後刪除。

到這邊就設定完成了，接下來我們來看一下 demo.js 的函式：

- `issueCredential()`: 利用 `node-vault` 來跟 vault 索取 credential，同時設定當時限過了一半後 rotate 目前正在用的 credential。
- `gracefulShutdown()`: 當收到 `SIGTERM` 也就是程序用 `kill` 指令砍掉時，會將目前正在使用的 credential 撤銷，這樣可以讓這個 credential 沒在使用後就立即刪除增加安全性。
- `loop()`: demo script 中的無限迴圈，會不停的跟 MySQL 查詢目前用什麼使用者登入，如果發現 SQL 登入錯誤則重新跟 vault 要一組新的帳號密碼。

執行 demo.js 時，首先會看到 demo.js 先跟 vault 要到了一組帳號密碼，接下來則會每秒鐘都跟資料庫查詢目前的使用者：
`Current user: v-token-my-role-2VWVbr1eWALVKLAB`

過了五秒後因為距離帳號密碼過期的期限只剩下一半，此時我們會再跟 vault 要一組新的帳號密碼，接下來的資料庫的使用者則變為：
`Current user: v-token-my-role-6rC0cBjcttqCUEyf`

這兩組帳號密碼都是由 vault 動態建立，並且會在建立後十秒鐘後刪除。
![image](/posts/2018-11-13_透過-vault-定期-rotate-credentials/images/4.png#layoutTextWidth)
最後當我們用 kill 指令停止 demo.js 程序時，因為我們有監聽 SIGTERM 信號的緣故，此時除了關閉程式我們還會將最近正在使用的帳號密碼撤銷以增加安全性，避免此帳號密碼之後還被其他人使用。

完成的展示過程可以看下面的影片。

### 踩雷區

應同事要求特別寫一下 vault 的雷區，其實上面的 demo.js 最重要的地方就在於 graceful shutdown 時要把目前使用的 credential 給撤銷掉。

你可能會覺得這個 credential 放著也還好，反正時候到了就會過期，不會有太多影響。BUT!! 假如你跟我們一樣 dev 環境是每個 commit 都會 deploy，而且 credential 的過期日期設定的比較長，比如說一個月的話，每天十個 commit，kubernetes 裡面有十個 pod，每個 pod 可能會用到兩三個由 Vault 管理的動態憑證的話，你在資料庫或 IAM User 會膨脹的很快，很快地你就會發現這些為數眾多的 credentials 管理上會造成困難，甚至拖累整個開發環境。

像最近我突然知道原來 AWS IAM User 的預設上限是 5000 人…。

當你有很多 IAM User 的時候，雖然可以透過指令一次把所有由 Vault 管理的 IAM User 撤銷，但是就我們的經驗來說大量 revoke IAM User 的時候，vault 大多都會 timeout (也有可能是因為我們 dev 環境開的資源太少)，所以要執行很多次才能把所有使用者刪除，其中還有可能會因為資源太少導致 Vault crash 的狀況，在 production 的狀況 vault 重啟會需要 unseal，此時就會伴隨許多痛苦，甚至 vault 會被不停地打掛，到最後只好到 backend storage 跟 AWS console 裡面手動刪除這些資料。

總之請大家別忘了在服務裡面加上 graceful shutdown 時同時也去撤銷 vault 裡面的 credential，免得原本採用 Vault 是要降低痛苦卻適得其反，讓痛苦太多，收穫太少。

### 結語

利用 vault 來做動態帳號密碼的派送讓 rotate credential 的痛苦下降了許多，可是當所有秘密都集中存放在一個地方時，在 production 環境採用就要更加小心謹慎，不僅要確保 vault 只能被特定的 ip 存取，每個 role 設定的權限都要開得剛剛好，每個 vault token 可以存取的 role 也都要審慎檢視。

另外一個方面，當 vault 在 production 環境使用時，會有許多為了安全性而設計的麻煩事情，比如說當啟動 vault 時會需要使用 unseal key 把 vault 解封 (unseal) 才可以使用，所以比如說 CoreOS 自行重新開機更新 kernel 時，vault 服務就會停擺需要等管理者來 unseal 的狀況，所以架設時有許多狀況需要細部設定。

回過頭來說 vault 其實只是一個工具，但是犯錯的通常都是人。面對需要高度安全性的服務，開發跟維護人員還是要在各種環節上更加謹慎小心，也會需要定期重新檢視安全檢查清單來增高安全性。
