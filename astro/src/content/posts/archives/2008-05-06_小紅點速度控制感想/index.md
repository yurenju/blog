---
title: 小紅點速度控制感想
date: '2008-05-06'
tags:
  - ThinkPad
  - X-Window
  - TrackPoint
categories:
  - tech
---
這幾天因為大量用小紅點，所以小紅點必須要有適合的速度才不會推的很難過。感謝 Thinkpad Wiki，上面有大量的文章教導 ThinkPad 在 Linux 下要如何設定，這就有一篇 [How to configure the TrackPoint - ThinkWiki](http://www.thinkwiki.org/wiki/How_to_configure_the_TrackPoint) 講到了如何改變小紅點的速度。範圍可以從 0 ~ 255，我的電腦預設是 92 (真是要了我的命)，試了許多不同的數值後，我自己用的數值是 170，剛好輕輕推小紅點就可以移動，才不會常常要花很大的力氣推它。  
  
echo -n 170 > /sys/devices/platform/i8042/serio1/speed