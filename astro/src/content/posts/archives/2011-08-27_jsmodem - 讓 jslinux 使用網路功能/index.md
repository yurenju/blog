---
title: jsmodem - 讓 jslinux 使用網路功能
date: '2011-08-27'
tags:
  - jslinux
  - linux
  - javascript
  - modem
  - jsmodem
categories:
  - tech
---
前陣子有個很有趣的 project - [jslinux](http://bellard.org/jslinux/)，這個專案主要是在瀏覽器上面模擬 x86 電腦，再將 Linux 跑在瀏覽器上面。等於說這個專案簡單實作了 PC 模擬器，就如同 VMWare, VirtualBox 一樣，但是在瀏覽器上就可以跑模擬器上面的 OS 了。甚至在上面還包含了一個 C compiler，可以在上面編譯程式。  
  

[![](images/0.png)](http://1.bp.blogspot.com/-3pRI2EPWnQM/TlhbpH3OP4I/AAAAAAAAKqQ/OERsG244474/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7+2011-08-27+%25E4%25B8%258A%25E5%258D%258810.48.02.png)

  
  
這個 project 非常的酷，不過看完之後也只是覺得有趣，沒繼續追之後的消息。而這個禮拜在 Hacking Thursday 遇到 [Ben](http://ben6.blogspot.com/), 他提到了這個專案的後續發展 - 有人利用 ppp 實作的 modem device，所以這個在瀏覽器上面運作的 Linux 現在可以上網了 XD  
  
這個延伸的專案是 [jsmodem](https://github.com/ewiger/jsmodem)，主要的功能是在 jslinux 這個 javascript emulator 上加上一個 modem，讓瀏覽器裡面的 Linux 可以上網，我看了一下 source code，推敲的架構如下：  
  

[![](images/1.png)](http://3.bp.blogspot.com/-oja4BK5Mz9I/TlhtvhULWEI/AAAAAAAAKqY/zYk1ixRTo14/s1600/jsmodem.png)

  
說是推敲的意思，其實我看了一下沒看到在 browser 怎麼從 ppp 轉到 websocket 的地方。如果有好心的朋友知道可以告訴我一聲 :p  
  
這個 linux 會利用 pppd 的方式開啟一個網路介面，並且接到 jsmodem。而 jsmodem 利用 websocket 的方式向 server 通訊。所以要讓 jslinux 可以上網，必須要在本機端跑一個 websocket server，並且用 iptable forward 封包。  
  
**架設步驟**  
  
我測試的環境是 Ubuntu 11.04，理論上用什麼 Linux 作法應該都一樣。首先當然是下載 jsmodem  
  
```
git clone https://github.com/ewiger/jsmodem.git
```  
接著理論上進去 emulator 目錄，打 make all 就可以了。不過不知道為什麼 http://bellard.org/ 會檔掉 wget，就算我換 user-agent 也沒辦法。懶得處理，就把四個檔案 cpux86.js cpux86-ta.js jslinux.js term.js 載下來放在原本的目錄裡面，再打 make all 就行了。  
  
另外在 jslinux.js 裡面所指示的 binary 路徑是 vmlinux.bin, 而非 vmlinux26.bin，所以必須要將 vmlinux26.bin rename 成 vmlinux.bin 完成之後，就可以用以下指令開啟 websocket server，並且開啟一個 ppp interface 準備接收 websocket 封包。  
  
```
sudo ./serve.sh
```  
  
這個時候用 Google Chrome 打開 0.0.0.0:2080，應該就可以看到 Linux 開機。用 root 登入後，打 ./ppp\_up 這樣就可以建立 ppp 連線。  
  
這個時候回到本機端的 Linux 建立 package forward  
  
```
# echo 1 > /proc/sys/net/ipv4/ip\_forward
# /sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```  

這樣就大功告成了 :)  
  
  

[![](images/2.png)](http://2.bp.blogspot.com/-RE_44ykf9pE/Tlh6HcdqEaI/AAAAAAAAKqc/ijDIV_T7Gzg/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7+2011-08-27+%25E4%25B8%258B%25E5%258D%258812.57.06.png)