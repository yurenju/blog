---
title: 客製化 ListView 產生 ScrollRunnable 互搶的問題解法
date: '2011-12-30'
tags:
  - Pull Down Refresh
  - Android
  - ListView
categories:
  - tech
---
最近用了一個朋友寫的客製化的 ListView，主要的用途是作類似 iOS 上可以作 Pull down refresh 的功能。  
  
但遇到了一個小問題困擾我很久。  
  
因為 pull down 的 scrolling back to first item 的工作是由一個 ScrollRunnable 搭配 Scroller 實作的，這東西基本上平常運作都沒有問題，但是如果在 Scroll Fling 到最頂端的時候就會有 scroll 亂跳的問題。  
  
深究 ListView/AbsListView 之後，發現其實 AbsListView 內有一個 mFlingRunnable 負責控制 Fling 動作發生時的捲動動作，而當使用另外一個  ScrollRunnable 去控制捲動的時候，會跟原本的 mFlingRunnable 的捲動互搶，造成捲動亂跳的問題。  
  
知道原因了，要解決就很簡單吧？  
  
錯了。  
  
AbsListView 並沒有預留讓開發者存取 mFlingRunnable 的介面，拿不到 Runnable 就無法取消它。難道我要把整個 AbsListView, ListView 搬出來嗎 XDD  
  
還好找到了一個不太好的 workaround。但是鑑於要把整個 AbsListView 移出來的成本太大，就將就著用了。答案是當使用 smoothScrollBy 系列的 method 的時候，AbsListView 將會自己移除 mFlingRunnable 的操作：  
  
  
```
    public void smoothScrollBy(int distance, int duration) {
        if (mFlingRunnable == null) {
            mFlingRunnable = new FlingRunnable();
        } else {
            mFlingRunnable.endFling();
        }
        mFlingRunnable.startScroll(distance, duration);
    }


```所以當你要操作自己的 ScrollRunnable 的時候，先執行 smoothScrollBy(0, 0) 就行了。因為參數都是 0 所以基本上 Fling 的動作就會取消了。  
  
如果哪位看官有更好的解法請務必跟我說 :D  
  
特別感謝 [David Wu](https://www.facebook.com/wuman) 跟我一起看了這個問題！