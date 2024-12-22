---
title: "Vault 與 Kubernetes 的深度整合"
author: "Yuren Ju"
date: 2019-04-22T01:01:11.975Z
lastmod: 2023-06-06T13:42:26+08:00
categories: [tech]

description: "本文解釋了要如何透過 Kubernetes 的 Service Account 整合登入驗證，並且針對不同 Account 管理權限範圍讓特定 deployment 僅能存取特定 credentials。"

subtitle: ""

images:
  - "/posts/2019-04-22_vault-與-kubernetes-的深度整合/images/1.png"
  - "/posts/2019-04-22_vault-與-kubernetes-的深度整合/images/2.png"
  - "/posts/2019-04-22_vault-與-kubernetes-的深度整合/images/3.png"
---

在上一篇 Vault 相關的文章《[透過 Vault 定期 rotate credentials](/posts/2018-11-13_%E9%80%8F%E9%81%8E-vault-%E5%AE%9A%E6%9C%9F-rotate-credentials/)》解釋了如何使用 vault 動態管理 credentials，透過每次都發出有時效性的帳號密碼來減低安全風險。

本篇文章則更進一步的解釋要如何透過 Kubernetes 的 Service Account 整合登入驗證，並且針對不同 Account 管理權限範圍讓特定 deployment 僅能存取特定 credentials。

本文將不會介紹 Kubernetes，請先到 [Kubernetes 官網](http://kubernetes.io) 了解此工具。如果想了解 Vault 如何動態管理 Credentials，請先閱讀《[透過 Vault 定期 rotate credentials](/posts/2018-11-13_%E9%80%8F%E9%81%8E-vault-%E5%AE%9A%E6%9C%9F-rotate-credentials/)》。

### 使用情境與問題

前篇文章我們介紹了要如何用 vault 發出 dynamic credential 增強安全性，而當服務變複雜時，每個服務都會有針對不同 credentials 有不同的存取權限的需求。此時在 vault 管理時就會需要用不同的 policy 來管理不同範圍的權限。而如果服務是架設在 Kubernetes 時，又要如何管理呢？

其中一個解決方案是依照 deployment 的權限範圍將相似權限的放在同一個 namespace 中。並且在每個 namespace 底下放入一個內容為 vault token 的 secret，並且在 vault 當中設定此 token 的存取權限。我們在 deployment 中則透過 Kubernetes 的環境變數指向此 secret，如此一來在程式中利用 Vault SDK 就可以取得 Dynamic Credential。

![image](/posts/2019-04-22_vault-與-kubernetes-的深度整合/images/1.png#layoutTextWidth)

因為 namespace 的切分可以讓不同 namespace 之間沒有辦法讀取其他 namespace 的 secret，以達到權限分群的效果。但是這樣的設定只要稍稍複雜的情境就變得不怎麼好用。

假設我們要開發一套簡易銀行轉帳的 API 系統，切分成三個元件：

- explorer: 登入使用者後可讀取交易資料
- tx: 登入使用者後寫入交易資料
- account: 創建使用者

而系統裡有兩個資料庫：

- txdb: 存放交易資料
- accountdb: 存放使用者帳戶

依照權限劃分出元件與資料庫的關係如下：

![image](/posts/2019-04-22_vault-與-kubernetes-的深度整合/images/2.png#layoutTextWidth)

此時用上述的 namespace 切分法就顯得窒礙難行，每個元件的權限範圍都不同，幾乎每個 deployment 就要放在一個 namespace ，本例僅有三個元件，但是稍微複雜一點的系統都會超過這個數量，原本的管理方法就變得不合適。

在這樣的狀況下 vault 有提供更進一步的功能可以透過 Kubernetes 的 Service Account 來登入 vault，並且取得該 service account 的特定權限。

### Vault Kubernetes Auth

Kubernetes 當中有兩個 account 類型：User Account 跟 Service Account，分別是給一般使用者與 Service 使用，而 Service Account 大多用來規範 Service 可以存取 Kubernetes API 的權限。

在我們的使用情境當中，我們並不用它來規範 Kubernetes API 存取範圍，而是用來登入 Vault 並且取得由 Vault 管理的 Dynamic Credentials，並且透過每個 account 設定一組特定的 policy 來區分存取 credential 的權限。

![image](/posts/2019-04-22_vault-與-kubernetes-的深度整合/images/3.png#layoutTextWidth)

vault 整合 kubernetes service account 的方式是設定一組 token reviewer 的 service account，此帳號需要有 kubernetes 的 `system:auth-delegator` 權限，另外也會為每個 component 都建立一組 role，每組 role 都會對應一組 policy 明定可以存取的 credentials。

接下來每一個 component 都會建立一組專用的 service account，並且在 deployment 中指定 service account。

部署上 kubernetes 後，每個 pod 會綁定一個 service account 並且將相關資訊放在 secret 當中，其中有兩類型的資料是我們會使用到的：

- **service account name (後面簡稱 sa name)**: service account 的名字，通常可以訂為跟 deployment 一樣的名字
- **token**: service account 的 [JWT Token](https://jwt.io/)，可以用來驗證此 Service Account 是否為合法的帳號。

當一個 pod 啟動後會有以下的幾個步驟：

1.  從 pod 當中取出 sa name 與 JWT token 並且嘗試登入 vault
2.  vault 會將 sa name 與 JWT token 透過 token reviewer 跟 Kubernetes Cluster 確認此帳號是否合法
3.  若為合法帳號，則回傳 client token，此 token 可以存取特定的 Dynamic Credentials
4.  pod 取得 Dynamic Credentials 並且存取資料庫。

每個 service account 對應到 vault 的 role 都會有一組自己的 policy，如此一來就可以利用 service account 來切分不同的權限。

### 實作概略

因為 kubernetes 實作細節滿複雜的，這邊就不提供完整的範例了。如果想要了解實作細節可以參考 HashiCorp 官方的文章《[Vault Agent with Kubernetes](https://learn.hashicorp.com/vault/identity-access-management/vault-agent-k8s)》，不過裡面沒有針對多帳號以及 Dynamic Credentials 設定。

#### 建立 service account

這邊會有兩種 service account 需要建立：token reviewer 跟給 deployment 用的 service account。token reviewer 需要兩種 resources: ServiceAccount 跟 ClusterRoleBinding，後者用來綁定 `system:auth-delegator` 權限。

至於 deployment 所使用的 Service Account 不需要任何額外的權限，只需要在 deployment 綁上相對應的 service account。以下的範例中第一個 resource 是 ServiceAccount 名字是 tx，而第二個 resource 是 Deployment，並且設定 `serviceAccountName `為 tx。

#### 設定 Vault

Vault 部分的設定主要是啟用 kubernetes auth、設定 token reviewer 以及建立對應的 role 與 policy。

在開始之前我們需要先取得接下來會需要用到的一些資訊，以下指令參考自 [Vault Agent with Kubernetes](https://learn.hashicorp.com/vault/identity-access-management/vault-agent-k8s)。
``# 取得 service account (SA) 存在 k8s 的 secret name
$ export VAULT_SA_NAME=$(kubectl get sa vault-auth -o jsonpath=&#34;{.secrets[\*][&#39;name&#39;]}&#34;)

# 將 Token Reviewer 的 JWT token 取出

$ export SA_JWT_TOKEN=$(kubectl get secret $VAULT_SA_NAME -o jsonpath=&#34;{.data.token}&#34; | base64 --decode; echo)

# Kubernetes 的 CA

$ export SA_CA_CRT=$(kubectl get secret $VAULT_SA_NAME -o jsonpath=&#34;{.data[&#39;ca\.crt&#39;]}&#34; | base64 --decode; echo)

# cluster 的 host/ip，正式環境可以從 kubeconfig 裡面取得

$ export K8S_HOST=$(minikube ip)``

接著使用以下指令即可啟用 vault 的 kubernetes auth：
`$ vault auth enable kubernetes`

啟用後就可以設定 token reviewer 的相關資訊：
`vault write auth/kubernetes/config \
  token_reviewer_jwt=&#34;${`SA_JWT_TOKEN`}&#34; \
  kubernetes_host=&#34;${`K8S_HOST`}&#34; \
  kubernetes_ca_cert=&#34;${`SA_CA_CRT`}&#34;`

以上設定可以讓 vault 可以使用 token reviewer 的角色驗證接下來的 service account 是否合格，接下來則是設定每個 service account 對應的 vault role。下面的設定中採用了 `kubernetes-tx` 這個 policy，此時我們還沒建立，下一個步驟會建立該 policy。
`vault write auth/kubernetes/role/tx \
    bound_service_account_names=tx \
    bound_service_account_namespaces=default \
    policies=kubernetes-tx \
    ttl=336h`

以上是 tx role，以我們舉例的簡易銀行 API 系統，我們還要新增 explorer 與 account role。新增完畢後下一步是新增對應的 policy 與指定給特定的 role。首先會需要新增一個 hcl 檔案，比如說 tx 會需要如下的 policy：
` path &#34;database/creds/tx {
  capabilities = [&#34;read&#34;]
}``path &#34;database/creds/account-readonly {
  capabilities = [&#34;read&#34;]
} `

並且用 write policy 寫入 vault 設定：
`vault policy write kubernetes-tx tx.hcl`

上面要設定的事情滿繁瑣的，我們是使用一個 python script 讀取自訂的設定檔案把這一連串繁瑣的事情用 script 設定。

#### 程式部分實作

要存取 vault 得到 Dynamic Credentials 有幾種方式，像 [Vault Agent with Kubernetes](https://learn.hashicorp.com/vault/identity-access-management/vault-agent-k8s) 文章中提到的是利用一個 vault agent 放在 initContainer 裡面把 secret 讀取出來。另外一個方式是在程式中利用 Vault SDK 登入與取得 Dynamic Credentials。

以下是透過 Vault SDK 存取 Dynamic Credentials 的範例：

這邊要注意的是 kubernetes 會將 JWT token 掛載在 `/var/run/secrets/kubernetes.io/serviceaccount/token`，所以會需要從此路徑取得 token，取得 client token 之後就可以利用此 token 存取權限範圍內的 credential 了，在這個範例讀取了 `database/creds/tx` 路徑底下的帳號密碼， `secret.Data` 內會包含 `username` 與 `password`。

### 結語

vault 跟 kubernetes 結合登入驗證後讓服務可以結合 kubernetes cluster 裡面所設計好的 deployment 與綁定的 service account，每個 deployment 都可以有自訂存取秘密的範圍，讓權限控制可以做到很細緻。加上 vault audit 可以做為追蹤存取 credential 的調查方式，這樣在服務上的機密管理帶來不少好處。

不過另外一方面 vault 的原理與設定還是比較複雜些，還是要讓團隊成員多了解 vault 的原理以及在專案中是怎麼規劃權限範圍，在需要新增元件或除錯時才可以比較容易進入狀況。
