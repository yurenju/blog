---
title: "[筆記] 用 vscode 針對 ethereum-go 除錯"
author: "Yuren Ju"
date: 2018-03-15T15:30:42.219Z
lastmod: 2023-06-06T13:41:08+08:00
categories: [tech]

description: ""

subtitle: "其實針對 go 在 Visual Studio Code 的除錯設定，官方的 github 上算是交代得蠻清楚了，只是針對我的狀況再多做一些小調整，在 mac 上面安裝需要自己 codesign 除錯程式，不過看起來 debugger 都用 make install…"

images:
  - "/posts/2018-03-15_筆記-用-vscode-針對-ethereumgo-除錯/images/1.png"
  - "/posts/2018-03-15_筆記-用-vscode-針對-ethereumgo-除錯/images/2.png"
  - "/posts/2018-03-15_筆記-用-vscode-針對-ethereumgo-除錯/images/3.png"
  - "/posts/2018-03-15_筆記-用-vscode-針對-ethereumgo-除錯/images/4.png"
---

其實針對 go 在 Visual Studio Code 的除錯設定，官方的 github 上算是交代得蠻清楚了，只是針對我的狀況再多做一些小調整，在 mac 上面安裝需要自己 codesign 除錯程式，不過看起來 debugger 都用 `make install` 把整個過程都包好，照著做就可以了。

[Debugging Go code using vscode](https://github.com/Microsoft/vscode-go/wiki/Debugging-Go-code-using-VS-Code)

首先先設定一個目標，我想要針對 `geth account new`指令除錯，目的是了解這個指令的執行流程。

先到 github 下載 [ethereum-go](https://github.com/ethereum/go-ethereum) 的源碼，並且用 make 編譯 geth：
`$ make geth`

這個步驟不是必須的，不過可以先試試這個指令會怎麼跑。
![image](/posts/2018-03-15_筆記-用-vscode-針對-ethereumgo-除錯/images/1.png#layoutTextWidth)
接下來就可以新增 launch.json 這個在 vscode 裡面用來設定 task 的檔案，除了可以用它來設定要怎麼執行指令外，除錯也是利用 launch.json 設定。進到 vscode 第四個 tab 除錯頁籤後，點擊「沒有組態」的下拉選單會出現「新增組態」的選項，接下來基本的 launch.json 就會產生了。

![image](/posts/2018-03-15_筆記-用-vscode-針對-ethereumgo-除錯/images/2.png#layoutTextWidth)
預設裝好就是中文版就沒調整了。

剛開始的 launch.json 幾乎不用修改就可以使用，長得像下面這個樣子。

![image](/posts/2018-03-15_筆記-用-vscode-針對-ethereumgo-除錯/images/3.png#layoutTextWidth)

這邊唯一要修改的是 args 參數，因為我們要除錯 `geth account new` 指令，所以要在這邊加入 `[&#34;account&#34;, &#34;new&#34;]` 。

設定好之後，我們可以先設定 `cmd/geth/accountcmd.go` 裡面的 `accountCreate()` function 為除錯點，接著在開啟著 accountcmd.go 的狀態按下綠色的執行鍵。

此時 vscode debugger 會偵測到有 accountcmd 是由 geth 所引入並且執行（說實在我不太確定他怎麼知道是 geth 指令而不是其他指令），程式執行到這行的時候就會中斷並且列出目前的所有變數、執行堆疊以及可以逐一觀看執行順序。
![image](/posts/2018-03-15_筆記-用-vscode-針對-ethereumgo-除錯/images/4.png#layoutTextWidth)
除了直接讀原碼外，我一直都還蠻喜歡用除錯功能單步執行來慢慢了解整個程式的架構，這樣了解程式架構還蠻有效的。
