---
title: 如何讓X31小紅點的中鍵支援捲軸功能？
date: '2004-04-21'
tags:
  - hardware
categories:
  - tech
---
[![](http://wshlab2.ee.kuas.edu.tw/~yurenju/albums/screenshot/dsc02557.thumb.jpg)](http://wshlab2.ee.kuas.edu.tw/~yurenju/gallery/view_photo.php?set_albumName=screenshot&id=dsc02557)  
剛剛在[TPUSER](http://www.ibmuser.idv.tw/phpBB2/viewtopic.php?t=8973&highlight=%A4p%AC%F5%C2I)看到TzanJan大大發表的文章裡面提到，只要把X滑鼠的設定檔改為以下即可：  

Identifier "Mouse1"  
Option "CorePointer"  
Driver "mouse"  
Option "Protocol" "PS/2"  
Option "Device" "/dev/psaux"  
Option "Emulate3Buttons" "true"  
Option "EmulateWheel" "yes"  
Option "EmulateWheelButton" "2"  
Option "ZAxisMapping" "4 5"