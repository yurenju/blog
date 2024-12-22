---
title: 在 Ubuntu 10.04 啟用 Touchpad 雙指滾輪的功能
date: '2010-07-11'
tags:
  - ubuntu
  - xinput
  - elantech
  - touchpad
  - lucid
categories:
  - tech
---
這幾天用 EeePC S101 的時候，發現 Ubuntu 10.04 對於 Elantech Touchpad 的雙指滾輪又改成在 Touchpad 右側滑動的滾輪了。  
  
搜尋了一下才知道[現在設定的方式](http://linuxformat.co.uk/content/synaptics-multitouch)都是用 xinput 的方式設定。不過上面的設定方式是針對 Synaptics Touchpad，所以要先用以下指令找出 Elantech 所用的裝置名稱：  
```
xinput list

```用完之後會有以下輸出，可以從裡面發現使用的 Touchpad 裝置名稱是 ETPS/2 Elantech Touchpad  
```
⎡ Virtual core pointer                     id=2 \[master pointer  (3)\]
⎜   ↳ Virtual core XTEST pointer               id=4 \[slave  pointer  (2)\]
⎜   ↳ ETPS/2 Elantech Touchpad                 id=13 \[slave  pointer  (2)\]
⎜   ↳ Macintosh mouse button emulation         id=14 \[slave  pointer  (2)\]
⎣ Virtual core keyboard                    id=3 \[master keyboard (2)\]
    ↳ Virtual core XTEST keyboard              id=5 \[slave  keyboard (3)\]
    ↳ Power Button                             id=6 \[slave  keyboard (3)\]
    ↳ Video Bus                                id=7 \[slave  keyboard (3)\]
    ↳ Power Button                             id=8 \[slave  keyboard (3)\]
    ↳ Sleep Button                             id=9 \[slave  keyboard (3)\]
    ↳ USB2.0 0.3M UVC WebCam                   id=10 \[slave  keyboard (3)\]
    ↳ Asus EeePC extra buttons                 id=11 \[slave  keyboard (3)\]
    ↳ AT Translated Set 2 keyboard             id=12 \[slave  keyboard (3)\]

```  
所以只要用以下指令就可以設定好 Elantech Touchpad 的雙指滾輪  
```
xinput set-int-prop "ETPS/2 Elantech Touchpad" "Two-Finger Scrolling" 8 1
xinput set-int-prop "ETPS/2 Elantech Touchpad" "Synaptics Two-Finger Scrolling" 8 1 1
xinput set-int-prop "ETPS/2 Elantech Touchpad" "Synaptics Two-Finger Pressure" 32 10
xinput set-int-prop "ETPS/2 Elantech Touchpad" "Synaptics Two-Finger Width" 32 8

```  
不過這些設定都不會保存下來，需要在登入的時候重新設定。所以我把他放在 ~/bin/touchpad-setting.sh 底下，並且用 chmod +x touchpad-setting.sh 更改成可執行權限，然後在 \[系統\] → \[偏好設定\] → \[始動應用程式\] → \[初始啟動程式\] 裡面加入 touchpad-setting.sh。  
  
這個時候又遇到一個奇怪的問題，我直接執行這個 script 有用，不過如果是登入的時候自動執行卻沒用。後來我猜是剛登入的時候 xinput 的 backend 可能還沒準備好，所以執行下去沒反應。最後我又加入了 sleep 5 之後，就一切正常了。  
```
#!/bin/bash

sleep 5
xinput set-int-prop "ETPS/2 Elantech Touchpad" "Two-Finger Scrolling" 8 1
xinput set-int-prop "ETPS/2 Elantech Touchpad" "Synaptics Two-Finger Scrolling" 8 1 1
xinput set-int-prop "ETPS/2 Elantech Touchpad" "Synaptics Two-Finger Pressure" 32 10
xinput set-int-prop "ETPS/2 Elantech Touchpad" "Synaptics Two-Finger Width" 32 8

```