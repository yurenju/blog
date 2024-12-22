---
title: '[Firefox OS] 呼叫 MozActivity 的內部訊息流程'
date: '2012-10-15'
tags:
  - Firefox OS
  - gecko
  - gaia
categories:
  - tech
---
上週快結束的時候我一直在追蹤一個 Firefox OS 的 [Bug #800169](https://bugzilla.mozilla.org/show_bug.cgi?id=800169)，後來發現不是 Gaia (Firefox OS 的 App 層) 之後，我就一路往下看到了 Gecko (Firefox OS 的 Runtime 層)，當我覺得快要找出癥結的時候，這個 Bug 在 Nightly build 被別人解決了！ XDD  
  
不過趁著這個機會也把架構熟悉過了一遍，跟大家分享一下。  
  
先解釋一下這個 bug，Firefox OS 的瀏覽器在把一個網頁加入到 home screen 的時候，加入 Home screen 的確認視窗會跳出來兩次。  
  
首先我們就從 Browser 的 browser.js 開始，按下『加入至 home screen』後會使用下面的 API 呼叫加入 home screen 的 dialog 。  
  
```
new MozActivity({
  name: 'save-bookmark',
  data: {
    type: 'url',
    url: this.currentTab.url,
    name: this.currentTab.title,
    icon: place.iconUri
  }
});

```  
MozActivity 是怎麼呼叫 Dialog 的呢？經過追蹤，當你呼叫了 MozActivity 的時候，真正執行的是 B2G/gecko/dom/activities/src/Activity.cpp。當你找出這個地方後可以用 gdb 來確認是不是這裡，詳細的用法可以參考 [Debugging B2G using gdb](https://developer.mozilla.org/en-US/docs/Mozilla/Boot_to_Gecko/Debugging_on_Boot_to_Gecko/Debugging_B2G_using_gdb)。Activity:Initialize 的最後面的程式碼是這樣：  
  
```
nsresult rv;
mProxy = do\_CreateInstance("@mozilla.org/dom/activities/proxy;1", &rv);
NS\_ENSURE\_SUCCESS(rv, rv);

mProxy->StartActivity(this, options, window);
return NS\_OK;

```  
事實上這個時候 B2G 去調用了同一個目錄底下的 ActivityProxy.js，這個時候用 Child Process Message Manager 的  sendAsyncMessage 丟了用來開啟 Activity 的訊息出去。  
  
```
cpmm.sendAsyncMessage("Activity:Start", { id: this.id, options: aOptions });
cpmm.addMessageListener("Activity:FireSuccess", this);
cpmm.addMessageListener("Activity:FireError", this);

```  
ActivityService.jsm 的 receiveMessage 會接收到這個訊息，並且交由 this.startActivity 來處理之。而 startActivity 決定完成要用哪個 app 開啟這個 Activity 後，再用 system-message-internal 的 sendMessage 丟出一個名為 activity 的訊息。  
  
```
let sysmm = Cc\["@mozilla.org/system-message-internal;1"\]
              .getService(Ci.nsISystemMessagesInternal);
if (!sysmm) {
  // System message is not present, what should we do?
  return;
}

debug("Sending system message...");
let result = aResults.options\[aChoice\];
sysmm.sendMessage("activity", {
    "id": aMsg.id,
    "payload": aMsg.options,
    "target": result.description
  },
  Services.io.newURI(result.description.href, null, null),
  Services.io.newURI(result.manifest, null, null));

```  
最後到了 SystemMessageInternal.js 裡面的 sendMessage 最後會調用 \_processPage 來開啟正確的 App。  
  
```
let page = { uri: aPage.uri,
             manifest: aPage.manifest,
             type: aPage.type,
             target: aMessage.target };
debug("Asking to open  " + JSON.stringify(page));
Services.obs.notifyObservers(this, "system-messages-open-app", JSON.stringify(page));
```  
而追蹤的 bug 的問題點就在這裡，這邊有兩個 match 的 page，所以他連續開啟了兩次 add to home screen 的 dialog。當我追蹤到這邊的時候，其實基本上已經找到問題的根源了。不過在跟別人討論的過程中突然發現有另外一個 [bug 的 patch](https://bugzilla.mozilla.org/show_bug.cgi?id=795782) 已經解決這個問題，而且在 nightly 的 build 也不會有這個問題，所以我就沒繼續追蹤下去了。  
  
藉由這次機會也從 Gaia 到 Gecko 看了一大圈，也算是很有收穫  :D