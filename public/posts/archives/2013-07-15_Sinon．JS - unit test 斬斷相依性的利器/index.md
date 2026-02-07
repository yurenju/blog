---
title: Sinon.JS - unit test 斬斷相依性的利器
date: '2013-07-15'
tags:
  - Firefox OS
  - unit test
  - javascript
categories:
  - tech
---
這兩天跟上周抽出一些時間正在弄 Firefox OS 中 system app 的 unit test，然後這次好好讀了 [sinon.js](http://sinonjs.org/) 之後開始試著用他來處理一些相依性問題感覺還真不賴。  
  
是這樣的，unit test 主要的目的是檢測特定的 unit 的工作是否正常運作，在這樣的狀況下我們僅測試該 unit 的邏輯與功能，至於跟它相依的部分通常會在另外一個 unit test 或是 integration test 的時候再測試。  
  
但是問題來了，我想測試的 function 就是有用到其他外部 Object，你總不可能要我整個 Javascript 都沒用到 document.getElementById 吧（這還是有可能啦...）？  
  
Sinon.JS 的其中一個功能就是可以隔絕 unit 對於其他 Object 的相依性，讓開發者可以單獨測試單一 unit 邏輯的好幫手。剛好我最近正在寫 system app 其中 ScreenManager 的 unit test，讓我們來看看 ScreenManager.init() 這個函式的相依性關係：  
  

[![](http://4.bp.blogspot.com/-h0ACGrom5Vg/Ud1TJkLZ6ZI/AAAAAAAAeVc/n8n42F2--8Q/s1600/ScreenManager.png)](images/0.png)

  
  
ScreenManager.init() 除了 call 外部的五個 Object 以外，還調用了自己的三個 function。而這些相依性都可以透過 Sinon 的功能隔絕他們。  
  
在這之前先介紹一下 Sinon.JS 的三大物件：  
  
**Spy**: 可以把一個 object/function wrap 起來，可以用來監看該 object/function 被呼叫的狀況。舉個例來說，假設我們要測試某個條件下 init() 就會呼叫到 turnScreenOn(), 我們可以用 spy 把 turnScreenOn wrap 起來：  
  
```
var spyTurnScreenOn = sinon.spy(ScreenManager, 'turnScreenOn');
ScreenManager.init();
assert.isTrue(spyTurnScreenOn.called);

```  
上面這段的意思是如果執行了 init() 之後，ScreenManager.turnScreenOn 會被執行到就代表正確。如果不僅執行到，而且傳入的參數一定要是特定值（比如說 true）也可以這樣用：  
  
```
spyTurnScreen.calledWith(true);
```  
除了上面提到這兩個 API 以外，還有幾個都還蠻實用的如 calledCount, calledTwice 等等，詳情請見 [Spy API](http://sinonjs.org/docs/#spies)。  
  
**Stub**: 有 spy 的所有功能。但是造出 stub 之後，原本的 function 就不會再被呼叫了。我通常都會用 stub 把所有的相依性全部切掉。一樣是 turnScreenOn() 在 init() 會被呼叫的例子，如果使用 stub 代替 spy，不一樣的地方是 spy 還是會去呼叫原有 function，而 stub 則不會呼叫原有 function。  
  
**Mock**: 有 Spy 跟 Stub 所有功能，但是還可以透過在跑之前設定期望值，最後再檢查 Mock 後的物件是否有照期待的執行。舉個 Sinon.JS 官網上面的例子，下面這樣的寫法可以讓你確認 jquery.ajax 最少被呼叫到了兩次，最多呼叫五次：  
  
```
sinon.mock(jQuery).expects("ajax").atLeast(2).atMost(5);
...
jQuery.ajax.verify();
```  
跟 Spy, Stub 不一樣的是 Mock 可以在測試還沒開始前就先預先指定期望值，而不是像 Stub 一樣需要等到呼叫後才能檢測條件是否成立。不過我目前測試的部分都可以用 stub 做到，Mock 暫時還沒用到，等到真的有用到之後再跟大家分享。  
  
接下來我們先來看一下相對簡單的例子要怎麼測試：ScreenManager:toggleScreen()：  
  
```
toggleScreen: function scm\_toggleScreen() {
  if (this.screenEnabled) {
    // Currently there is no one used toggleScreen, so just set reason as
    // toggle. If it is used by someone in the future, we can rename it.
    this.\_screenOffBy = 'toggle';
    this.turnScreenOff();
  } else {
    this.turnScreenOn();
  }

```  
這個 function相當的簡單，只要 screenEnabled 是 true，\_screenOffBy 就會是 toggle，並且 turnScreenOff 會呼叫到。所以只要利用 sinon.stub 分別作出 turnScreenOff 跟 turnScreenOn 的 stub，並且確認會不會正確的呼叫到即可。  
  
```
suite('toggleScreen()', function() {
  var stubTurnOff, stubTurnOn;

  setup(function() {
    stubTurnOff = sinon.stub(ScreenManager, 'turnScreenOff');
    stubTurnOn = sinon.stub(ScreenManager, 'turnScreenOn');
  });

  teardown(function() {
    stubTurnOff.restore();
    stubTurnOn.restore();
  });

  test('if screenEnabled is true', function() {
    ScreenManager.screenEnabled = true;
    ScreenManager.toggleScreen();
    assert.equal(ScreenManager.\_screenOffBy, 'toggle');
    assert.isTrue(stubTurnOff.called);
    assert.isFalse(stubTurnOn.called);
  });

  test('if screenEnabled is false', function() {
    ScreenManager.screenEnabled = false;
    ScreenManager.toggleScreen();
    assert.isTrue(stubTurnOn.called);
    assert.isFalse(stubTurnOff.called);
  });
});
```  
所以我在 5-6 行的地方用 sinon.stub() 分別對兩個 function 做了 stub，這樣一來當 toggleScreen() 呼叫這兩個 function 的時候，就會呼叫到假的 function 了。比如說 15-19 行的測試，當 screenEnabled 是 true 時，turnOff 要被呼叫到，而 turnOn 則不會被呼叫到。sinon.stub() 在這種種狀況就可以協助我們把相依性切除，只專注在測試目標 function 的邏輯。  
  
但是我們的測試環境是將 Firefox OS 在瀏覽器上面運行，這時候有些 Object 很可能是不存在的。比如說 mozTelephony，所以就不能用上面 sinon.stub(Object, propertyName) 的方式造假物件，還是要利用 sinon.stub() 造一個新的物件。正是因為這樣我設計了 switchProperty/restoreProperty 的 helper function 用來替換掉可能不存在的物件。  
  
再來看看一些比較進階的例子：如果你有一個 function 只希望在某種狀況下，才使用 stub 指定的回傳值，而其他狀況則是調用原本的 function 該怎麼寫呢？init() 的 setup() 正好有這樣的狀況：  
  
```
var stubById = sinon.stub(document, 'getElementById').withArgs('screen')
    .returns(document.createElement('div'));

```  
這段的意思是我們為 document.getElementById 做了一個假物件，他會直接回傳一個 div DOM 元件，但是只有在傳入參數為 screen 的時候才會發生，所以說：  
  
```
document.getElementById('screen');
```  
這個時候就會直接回傳一個假的 div，而不會真的到 DOM 裡面查詢一個 #screen 的元素，而且如果你查的是任何其他的參數，就還是可以正常運作！這樣可以確保你的 stub 只在你想要的參數被觸發！  
  
還有一個很常需要對付的狀況：如果你的測項是需要被 callback 呼叫才能測該怎麼辦呢？舉例：你用了一個 addEventListener('click', callback)，所以說一定要 click 才能呼叫 callback 該怎麼辦呢？用下面的 function：  
  
```
sinon.stub(window, 'addEventListener').callsArgWith(1, evt)
```  
如果一呼叫 addEventListener 就會直接呼叫第一個參數（'click' 是 0, callback 是 1），這樣就可以測試更深層的狀況了。  
  
總而言之，Sinon.JS 準備了一拖拉庫的造假工具給你用，Javascript Unit Test 有了像 Sinon.JS 這樣強大的工具，就可以切斷相依性，測試的更徹底！  
  
另外這邊有一個 Firefox OS 裡面的範例：[screen\_manager.js](https://github.com/mozilla-b2g/gaia/blob/master/apps/system/js/screen_manager.js) 跟 [screen\_manager\_test.js](https://github.com/mozilla-b2g/gaia/blob/master/apps/system/test/unit/screen_manager_test.js)，有興趣的可以參考參考。