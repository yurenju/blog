---
title: Gentoo Linux 2003,6,27 安裝小技巧
date: '2003-08-29'
tags:
  - linux
categories:
  - tech
---
此份文件僅是個人安裝的筆記，若有謬誤請多指正。  
  
安裝Gentoo Linux是一件令人心曠神怡的事情，雖然安裝完後會令人很不想在重新安裝。但基於這次要把電腦中的M$ Windows XP ==> M$ Windows 2000(因為我的wine使用xp似乎有些問題)，所以就乾脆來了系統重整，把所以的資料都備份到別的地方，重新安裝電腦上的Windows與Linux。  
  
當然，這次我還是選用了Gentoo Linux。基於一個桌面使用環境的狀況下，使用Gentoo Linux是相當不錯的選擇，因為Gentoo Linux擁有相當高的效率，相當具有彈性的設定，還有新到爆的軟體。比起GNU Debian，Debian對於非GPL軟體有點小小的固執，最顯著的例子就是Mplayer到目前都還有進入Debain的套件中。Gentoo Linux就比較沒有那麼固執了 :-)  
  
這次是我第三次安裝Gentoo Linux了。這次的安裝過程非常的順利，比起前幾次有點痛苦的安裝過程，因為對Gentoo的portage機制已經比較熟悉了，所以約兩天就把系統整理的相當舒服了。  
  
以下分享一些Gentoo 的小技巧。  
  
如果您也想安裝Gentoo Linux，請先準備約半天的時間。因為Gentoo整個系統都是使用compile的方式安裝的，如果你要安裝X-window，請準備兩天的時間，因為安裝的過程可以使用遠端安裝，所以你大可在學校、家裡、咖啡館任何有網路的地方遠端安裝，並且你可以使用screen，在你關閉你的terminal後在繼續安裝。  
  
ex:  
先使用Gentoo Linux的光碟開機，並將你的網路設定完成，接下來啟動ssh服務：  
\# /etc/init.d/sshd start  
在咖啡館：  
\# ssh id@domain.name  
\# screen  
\# emerge a\_package  
關閉這個terminal  
  
在家裡：  
\# ssh id@domain.name  
\# screen -r  
你可以看到a\_package安裝的狀況，並且繼續你的工作。利用這個方式就可以遠端安裝Gentoo Linux  

* * *

  
  
你可以先到 [Gentoo Linux 官方網站](http://www.gentoo.org) 下載Gentoo Linux 1.4\_RC4的iso檔下來，並把他燒成光碟。或者是你可以到 [NSYSU FTP](ftp://ftp.nsysu.edu.tw/Linux/Gentoo/releases/1.4_rc4) 或 [NSYSU CDPA](ftp://linux.cdpa.nsysu.edu.tw/Gentoo/releases/1.4_rc4) 下載。  
  
參考這份[中文安裝文件](http://home.kimo.com.tw/bell_yyy/)或是[英文安裝文件](http://www.gentoo.org/doc/en/gentoo-x86-install.xml)安裝Gentoo Linux。這大約要花掉半天的時間。假如說你對make kernel不熟，你必須要再花更多的時間在這個步驟。  

* * *

  
USE flag可以讓你在編譯的時候選擇你要編譯什麼，不要編譯什麼。USE flag可以在make.conf裡面找到，如果你要選擇某個選項，請直接在USE裡面寫入那個選項，如果你不要某個選項，就在那個項目前面加一個減號。  
  
ex:  
#vim /etc/make.conf  
USE="gnome gtk2 -kde -qt"  
這個的意思就是要使用gnome, gtk2但不要使用kde跟qt。  
  
通常中文的使用者會在USE內加入nls與cjk，nls是語言支援，cjk則是支援中文、日文、韓文。  

* * *

  
**中文化**  
Gentoo Linux中文化相當的簡單，除了前面提到的要在USE裡面使用cjk, nls以外，還有就是要安裝字型，設定環境變數以及輸入法。  
  
//安裝中文字型  
#emerge arphicfonts  
#emerge /usr/portage/media-fonts/zh-kcfonts/zh-kcfonts-1.05.ebuild  
  
//安裝輸入法  
#emerge /usr/portage/app-i18n/xcin/xcin-2.5.3\_pre2.ebuild  
他應該會跟你說要相依libtabe，用相同的方法把他裝起來就行了。  
  
//設定環境變數。  
//在/etc/profile中最後面加入：  
  
export LANG="zh\_TW.Big5"  
export LC\_ALL="zh\_TW.Big5"  
export XMODIFIERS="@im=xcin"  
  
如果你使用的是gnome環境，這時進去你就會看到中文化應該都ok了，假如說你對字型並不是很滿意，你可以到/etc/fonts/fonts.conf 設定你的字型，就像這樣：  
<alias>  
<family>Bitstream Vera Sans</family>  
<family>Helvetica</family>  
<family>Arial</family>  
<family>Verdana</family>  
<family>Nimbus Sans L</family>  
<family>Luxi Sans</family>  
<family>Kochi Gothic</family>  
<family>AR PL Mingti2L Big5</family> //假如你想要使用這個中文字型，就把它放在其他中文字型的前面。  
<family>AR PL KaitiM GB</family>  
<family>AR PL KaitiM Big5</family>  
<family>Baekmuk Dotum</family>  
<family>SimSun</family>  
<default><family>sans-serif</family></default>  
</alias>  
  
  
大致上就這樣。  
  
如果你使用gnome，可以在\[應用程式\]->\[桌面偏好設定\]->\[進階\]->\[作業階段\]->\[初始啟動程式\]  
中按新增，指令填入/usr/bin/xcin。  
  
如此就可以在進gnome時啟動xcin