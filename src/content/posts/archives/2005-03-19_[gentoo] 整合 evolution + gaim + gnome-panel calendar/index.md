---
title: '[gentoo] 整合 evolution + gaim + gnome-panel calendar'
date: '2005-03-19'
tags:
  - linux
categories:
  - tech
---
把 Evolution, gaim, gnome-panel calendar 整合在一起可以帶來很多方便。像是可以直接點開日曆，就可以看到最近的行程；用 gaim 加使用者時，可以順道加入 evolution 的通訊錄。  
  
而要將這三個軟體整合 USE Flags 除了加 evo ，另外還要再加上 eds (Evolution-data-server)，再重編 gaim, gnome-panel 就行了 :-)  
  
另外 [Planner 0.13](http://www.imendio.com/projects/planner/) 也支援與 evolution 整合，就等 Planner 放到 portage 裡面了。  
  
[![Screenshot-18](http://wshlab2.ee.kuas.edu.tw/%7Eyurenju/albums/screenshot/Screenshot_18.thumb.png "Screenshot-18")](http://wshlab2.ee.kuas.edu.tw/%7Eyurenju/gallery/screenshot/Screenshot_18) [![Screenshot-偏好設定](http://wshlab2.ee.kuas.edu.tw/%7Eyurenju/albums/screenshot/Screenshot_n_w.thumb.png "Screenshot-偏好設定")](http://wshlab2.ee.kuas.edu.tw/%7Eyurenju/gallery/screenshot/Screenshot_n_w)  
  
延伸閱讀：[Evolution: Features](http://www.gnome.org/projects/evolution/features.shtml)