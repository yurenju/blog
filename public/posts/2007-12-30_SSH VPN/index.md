---
title: SSH VPN
date: '2007-12-30'
tags:
  - ssh
  - tunnel
  - vpn
categories:
  - tech
---
這幾天都在研究 SSH (Secure Shell) 神奇的妙用。其中一個就是 ssh 在 4.3 以後已經內建支援 VPN (Virtual Private Network)，只要配合多數 Linux 都支援的 iptables 就可以使用了。我幹嘛用 SSH VPN 勒？如果有筆記型電腦的人一定常在外面無線上網，但是沒有加密的無線網路可是很危險的阿，想像一下每個有無線網路的咖啡館都有個佈告欄，上面公告著每個人使用無線網路的帳號密碼，包括網站、BBS、電子郵件的。而使用 SSH VPN 可以將自己的訊息先用 SSH 加密後，再透過遠端的伺服器傳送，雖然這樣會拖慢速度，不過使用起來還是安心點囉。  
  
注意，以下都必須使用 root 權限。  
  
以下面這個例子來說，我在研究室有台 SSH Server S (假設 IP 是 140.130.120.110)，而我的筆記型電腦 Laptop C (IP 不固定)。首先要有 tun 這個 Tunnel 驅動程式。請在 S, C 中都下這個指令：  

> modprobe tun

接下來所有的動作都在筆記型電腦 C 上執行。如果要開機的時候自動載入驅動程式，請將 tun 加入 /etc/modules 裏面。接下來要使用 SSH VPN 要有以下資訊是在每個咖啡館都不一樣的：  

1.  你所處無線網路的網路與網路遮罩 (Network/netmask) - $NETWORK  
    
2.  你所處無線網路的閘道器 (Gateway) - $GW  
    

現在我們要用 ssh 開啟兩端 tun0 介面的 VPN 網路：  

> ssh -w 0:0 -f 140.130.120.110 "ifconfig tun0 10.0.2.1 netmask 255.255.255.252 pointopoint 10.0.2.2 ;echo 1 > /proc/sys/net/ipv4/ip\_forward ;/sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE ;route add -net $NETWORK gw 10.0.2.2 dev tun0"

下面介紹一下參數  
  
\-w 0:0  
開啟 tunnel，第一個是本機 C 的 tun 編號，第二個是伺服器 S 的 tun 編號。如果改成 1:2 就代表 C 用的 VPN 介面是 tun1，S 用的 VPN 介面是 tun2。  
  
\-f "command"  
登入 ssh 以後在遠端主機 S 要執行的命令。  
  
ifconfig tun0 10.0.2.1 netmask 255.255.255.252 pointopoint 10.0.2.2  
設定伺服器 S tun0 介面的 IP 位址、網路遮罩以及點對點另一端 C 的 IP 位址  
  
echo 1 > /proc/sys/net/ipv4/ip\_forward  
開啟 IP 轉送的功能  
  
/sbin/iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE  
設定 NAT。注意這只是簡單的設定，為了安全起見請 K 一下網路上的 iptables 資料，很充足。  
  
route add -net $NETWORK gw 10.0.2.2 dev tun0  
加入路由資訊，只要傳送給 C 所處網路的資訊都由 tun0 介面的 10.0.2.2 去傳送  
  
上面那個指令就可以把伺服器 S 設定完成，接下來要設定筆記型電腦 C。請執行以下指令：  

> ifconfig tun0 10.0.2.2 netmask 255.255.255.252 pointopoint 10.0.2.1  
> (設定 C 的 tun0 介面)  
>   
> route add -net 140.130.120.0/24 gw 10.0.2.1 dev tun0  
> (加入路由資訊)  
>   
> route add 140.130.120.110 gw $GW  
> (這蠻重要的，傳送給 140.130.120.110 的封包經由 $GW 傳送)  
>   
> route add default gw 10.0.2.1 tun0  
> (將預設 gateway 改成 tun0 的 10.0.2.1)  
>   
> route del default gw $GW  
> (刪除原本的 gateway)

這樣就可以傳送了。你可以上 [My IP](http://www.ip-adress.com/) 來確定一下自己的 IP。