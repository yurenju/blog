---
title: Android 自製元件 - PrismFlipper
date: '2011-12-14'
tags:
  - Android
categories:
  - tech
---
這幾天公司的 app 要作訂製的 notification bar，花了一點時間做出來，把他整理出來成一個小 view widget，這個 widget 主要是一個客製化的 notification bar，主要是想模擬三角稜柱翻動的樣子。跑起來大概像下面這樣：  
  

  
  
使用方法也很簡單，用 flipper.showNext(text, reverse) 就可以使用了，下面附上比較完整的範例  
  
  
```
final PrismFlipper flipper = (PrismFlipper)findViewById(R.id.viewFlipper1);
final String\[\] texts = new String\[\] { "Refresh", "go to last read position", "last read post" };
flipper.setFrontText(texts\[0\]);
flipper.setBackground(new ColorDrawable(0xff3465a4));
flipper.setTextColor(Color.WHITE);
Button btn = (Button)findViewById(R.id.button1);
btn.setOnClickListener(new OnClickListener() {
   
 @Override
 public void onClick(View arg0) {
  flipper.showNext(texts\[mPosition\], false);
  mPosition = (mPosition + 1) % texts.length;
 }
});
        
btn = (Button)findViewById(R.id.button2);
btn.setOnClickListener(new OnClickListener() {
   
 @Override
 public void onClick(View arg0) {
  flipper.showNext(texts\[mPosition\], true);
  mPosition = (mPosition + 1) % texts.length;
 }
});

```  
完整的範例可以在 [github](https://github.com/yurenju/PrismFlipper) 上找到，授權是 BSD license。