---
title: GNOME javascript runtime introdution
date: '2010-07-21'
tags:
  - javascript
  - GNOME
categories:
  - tech
---
這幾天在寫 [COSCUP 議程](http://coscup.org/2010/zh-tw/program/abstracts#javascript-in-linux-desktop) Javascript in Linux Desktop 的範例，對於 Seed 跟 GJS 有了些認識。先解釋一下 [GNOME javascript runtime](http://live.gnome.org/JavaScript)。這個時候你先要把『**javascript 就是拿來寫 Web Application**』的觀念先忘掉，GNOME javascript runtime 可以讓你使用 javascript 撰寫桌面應用程式，一如 pidgin, stardict, 或是 filezilla 這類的軟體（當然 js runtime 現在還沒成熟）。  
  
這個時候問題就跟你挑瀏覽器一樣：我要用哪種 javascript engine? 目前開放源碼的 javascript 不外乎是 Mozilla Firefox 用的 [Spidermonkey](http://www.mozilla.org/js/spidermonkey/), Webkit 內建的 [JavaScriptCore](http://webkit.org/projects/javascript/), 以及 Google Chrome 用的 [V8](http://code.google.com/p/v8/)。而 Spidermonkey 跟 JavaScriptCore 在 GNOME 裡面分別被發展成兩套 Javascript runtime: [GJS](http://live.gnome.org/Gjs/) 跟 [Seed](http://live.gnome.org/Seed)。  
  
或許你有點疑惑，怎麼又提 javascript **engine** 又提 javascript **runtime**?  
  
因為有了 javascriptp engine 後，內建的函式庫並不足以開發桌面應用程序，而且在桌面應用程式也不一定有 DOM 可以使用。GNOME 為了解決這個問題，發展了一套 framework: [GObject introspection](http://live.gnome.org/GObjectIntrospection) (GI)，他主要的用處是提供 GNOME 使用 C 語言撰寫的函式庫跟其他 runtime 如 javascript, python, ruby 的橋樑，讓這些語言都可以透過 binding 的方式來使用 GNOME 函式庫。不過 GObject introspection 發展以前，python 跟 ruby 都已經有了跟 gnome 的 binding，只是 GObject introspection 採用更全面的方式來分享這類 dynamic language 作 binding 時都需要的基礎工程。詳細的原理寫出來就太多了，略過 XD  
  
所以基本上 GNOME 開發的函式庫都已經包含了 GIR (GObject Introspection Repository)，也就是給動態語言用的 binding 資料。Runtime 如 javascript engine 就可以利用這些資料來製作對 GNOME 函式庫的 binding，所以使用 javascript runtime 也可以撰寫 GTK 程式。  
  
以下是個 GTK hello world in javascript  
```
#!/usr/bin/seed

Gtk = imports.gi.Gtk;
Gtk.init(Seed.argv);

var window = new Gtk.Window();
window.signal.hide.connect(Gtk.main\_quit);
window.show\_all();
Gtk.main();

```  
如果你有安裝 python-gi, 那也可以透過 gir 來呼叫 gtk (而不是以現有的 python-gtk)。不過 GI 官網上是建議如果已經有了作好的 binding 就用原本的就好。畢竟 GI 的東西沒有針對每個語言 fine tune。  
  
  
```
#!/usr/bin/env python
from gi.repository import Gtk
import sys

Gtk.init (sys.argv)

window = Gtk.Window ();
window.connect ("hide", Gtk.main\_quit);
window.show\_all ();
Gtk.main ();


```  
  
晚點再來寫 seed 跟 gjs 真的動工時的差異。