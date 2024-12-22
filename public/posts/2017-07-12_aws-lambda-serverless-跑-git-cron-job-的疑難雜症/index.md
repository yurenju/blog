---
title: "AWS Lambda (serverless) 跑 git cron job 的疑難雜症"
author: "Yuren Ju"
date: 2017-07-12T09:46:31.987Z
lastmod: 2023-06-06T13:39:52+08:00
categories: [tech]

description: ""

subtitle: "最近終於把之前放在 iron.io 上面的兩個小程式移到 AWS Lambda 了。有一些小技巧值得提一下。"

images:
  - "/posts/2017-07-12_aws-lambda-serverless-跑-git-cron-job-的疑難雜症/images/1.png"
---

![image](/posts/2017-07-12_aws-lambda-serverless-跑-git-cron-job-的疑難雜症/images/1.png#layoutTextWidth)

最近終於把之前放在 iron.io 上面的兩個小程式移到 AWS Lambda 了。有一些小技巧值得提一下。

我的兩個小程式分別是去抓血液基金會的血液庫存資料儲存成 JSON 檔案與抓衛生福利部重大災害民生物資中台北市庫存物資資訊並且儲存成 CSV 檔案，這邊是兩個分別的專案網址： [g0v/blood](https://github.com/g0v/blood) 與 [g0v-data/aid-sync](https://github.com/g0v-data/aid-sync/)。

這兩個專案都是採用 serverless framework 來簡化 AWS Lambda 的設定。serverless 使用上還蠻簡單的，有興趣的可以看一下文件。

[Serverless - The Serverless Application Framework powered by AWS Lambda and API Gateway](https://serverless.com/)

這兩個專案的特點都是擷取網頁的資訊並且儲存成結構化的檔案，並且都將檔案放在 github 上面，所以 script 中都需要使用 git 以及可存取網頁的模組如 cheerio 或 jsdom，並且會需要用環境變數傳遞 API key。

### 本地儲存空間

根據 [AWS Lambda FAQ](https://aws.amazon.com/tw/lambda/faqs/)，只有 /tmp 提供 500MB 的空間，如果需要暫存任何資料，請記得儲存到 /tmp 目錄下，否則會收到 read only 的錯誤。

### git

AWS Lambda instance 是 Amazon Linux AMI，雖然上面提供了一些基本的工具如 curl，但是卻沒有提供 git。好心人士包了一個可以在 lambda 中使用的 node.js git 模組 [lambda-git](https://www.npmjs.com/package/lambda-git)，安裝後用下面的指令就可以設定好 git 執行環境，直接執行指令就可以使用。
```
require(&#39;lambda-git&#39;)();
```

### 環境變數

環境變數可以透過 serverless 傳遞進 AWS Lambda，使用 `${file(file.yml):VARIABLE}` 就可以把 `file.yml` 裡面的 `VARIABLE `屬性作為環境變數，下面是範例的 serverless.yml：
` service: aws-nodejs``provider:
  name: aws
  runtime: nodejs6.10
  environment:
    GH_TOKEN: ${file(env.yml):GH_TOKEN}
    GH_REF: ${file(env.yml):GH_REF} `

env.yml 看起來則是長這樣：
`GH_TOKEN: YOUR_GITHUB_API_TOKEN
GH_REF:   github.com/g0v/blood.git`

記得如果在 env.yml 中有放敏感資訊如 API key，記得不要 check in 進 git，只需要在本地端存在，在 serverless deploy 的時候會將其引入。

### 一些感想

AWS Lambda 雖然便宜又方便，不過限制還真不少。限制的部分可以看[官方文件](https://docs.aws.amazon.com/lambda/latest/dg/limits.html)。不過自從支援 cron job 之後拿來做頻率不太高的定期爬蟲還蠻適合的。

而且 iron.io 更新版本之後變得十分難用。官方提供的 node.js docker image 又是被閹割到超慘的 linux，許多指令都沒有，如果改用 node.js 官方提供的 docker image 又超過 iron.io 的限制，這麼麻煩還不如使用 AWS Lambda。

目前使用 AWS Lambda 都還沒有達到免費上限，如果下次還有類似的小程式其實都可以多多搬到 Lambda 上來。

**2017/8/ 1 更新**

看來 github 更改了 personal access token 的使用方式，現在拿到 token 之後要把它當作密碼，所以以前用這種方式做自動化 push 是不能動了，所以現在要不推一個 private key 到 lambda 去，不然就要改用 travis-ci 的 crontab，好麻煩 :-(
