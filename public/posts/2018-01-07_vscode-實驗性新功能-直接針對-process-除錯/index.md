---
title: "vscode 實驗性新功能 — 直接針對 process 除錯"
author: "Yuren Ju"
date: 2018-01-07T07:44:45.715Z
lastmod: 2023-06-06T13:40:49+08:00
categories: [tech]

description: ""

subtitle: "最近在看 Visual Studio Code 新版本的說明時看到了一個很神奇的功能，雖然現在還在實驗階段，但是正式推出之後感覺非常方便。"

images:
  - "/posts/2018-01-07_vscode-實驗性新功能-直接針對-process-除錯/images/1.gif"
---

最近在看 Visual Studio Code 新版本的說明時看到了一個很神奇的功能，雖然現在還在實驗階段，但是正式推出之後感覺非常方便。

這個新功能叫做 VS Code process，目前是一個實驗性的延伸套件，放在 github 供人安裝測試，它的功能是可以觀看目前在 vscode 底下所執行的所有程序 (process)，包含使用者在內嵌的終端機內執行的 process。

前面這聽起來還好，但是他方便的功能在於除了觀看 process 外，他還可以直接對特定的 process 按右鍵直接除錯！！

比如說你有個 hello.js 檔案，在編輯起裡面開啟以及設定好了中斷點，執行後就可以透過 process view 看到該程序，而且按下右鍵選擇除錯後，就可以直接停在中斷點，並且開始除錯。

![image](/posts/2018-01-07_vscode-實驗性新功能-直接針對-process-除錯/images/1.gif#layoutTextWidth)

這省去了設定 node.js 的除錯組態，以前在除錯比較複雜的 node.js app 前通常都要從一些 shell script 裡面找出真正執行的 node.js process，並且在組態裡面正確設定參數後才可以開始除錯。

如果這個工具成熟後，除錯時可以省去不少時間。不太確定不同程式語言之間要怎麼支援，不過很期待這個功能正式釋出的那天 :D

詳細的說明可以看 vscode 十一月份的新版本訊息：

[Visual Studio Code November 2017](https://code.visualstudio.com/updates/v1_19)
