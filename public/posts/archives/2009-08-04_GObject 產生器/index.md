---
title: GObject 產生器
date: '2009-08-04'
tags:
  - gobject
categories:
  - tech
---
好久沒 Post 了 XD  
  
今天寫了個 GObject 產生器，後來無聊一查才知道早就有人寫了 囧  
真是白費工夫…不過還是丟出來，寫都寫了…。  
  
\[使用方式\]  

./gobjgen

  
接下來會問 namespace, class name 跟 parent object，格式都統一用 dash "-" 來區分，比如說我想要一個 LazyscriptsController，就在 class name 的地方輸入 lazyscripts-controller。所以如果你要繼承自 GObject，就必須鍵入 g-object。  
  
回答完 namespace, class name & parent object 後，你可以決定需不需要一個 main function 作為測試。全部完成後就會有兩個像 lazyscripts-controller.h, lazyscripts-controller.c 這樣的檔案，如果剛剛有選 main function for test，就可以直接編譯來看看可不可以用。  
  

gcc -g -Wall \`pkg-config --libs --cflags glib-2.0 gobject-2.0\` example-namespace-lazyscripts-controller.c

  
理論上應該是可以用的 XD  
  
  
\[源碼\]  
放在 bitbucket 上，用以下指令下載源碼：  
  

hg clone http://bitbucket.org/yurenju/gobjgen/

  
\[其他相關\]  

*   [http://burtonini.com/cgi/gobject.py](http://burtonini.com/cgi/gobject.py)
*   [http://blogs.gnome.org/thos/2009/05/15/gobject-generator/](http://blogs.gnome.org/thos/2009/05/15/gobject-generator/)
*   [http://www.vim.org/scripts/script.php?script\_id=2003](http://www.vim.org/scripts/script.php?script_id=2003)