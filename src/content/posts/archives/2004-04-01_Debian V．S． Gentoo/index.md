---
title: Debian V.S. Gentoo
date: '2004-04-01'
tags:
  - linux
categories:
  - tech
---
這幾天因為主要在使用的HITACHI硬碟掛點了，所以暫時灌了Debian來玩玩看。  
其實Debian與Gentoo都是很好的Linux distro.，兩方都有各自的優點。以一個桌面使用者 + C/Java/PHP 的程式設計者的角度來說，我認為這兩個套件的優缺點分析如下。（兩邊優劣條件相等的地方我就不提了）  
  

安裝系統
----

  

Debian在安裝上面最大的優勢，就是可以在相當短的時間就把系統完整的建製，並且最新的Debian-installer beta3也提供相當好的多國語言、使用者介面。

  

Gentoo在安裝的速度方面就比Debian還要慢了許多，但是Gentoo可以利用編譯時下的參數，對系統最佳化。Gentoo Kernel的另外一個好處，就是直接patch了bootsplash，所以在重開機後就可以看到漂亮的圖形console。而最佳化到底能夠提昇多少的效能？請參考Gentoo 網站上的[Performance benchmarks](http://www.gentoo.org/main/en/performance.xml)

  
  
  

與Java的整合程度
----------

  

Debian在Java的整合上就遜色的許多，不僅在套件中並沒有sun的Java SDK，充其量只有jikes而已，而java開發工具eclipse雖然說有內建，但是卻相依了java-runtime，但在系統中這只是個虛擬套件，實體的套件我目前還沒找到。但是手動安裝Java與eclipse也沒有什麼困難，運作的也相當順利。

  

Gentoo在Java上的整合相當的完整。不僅提供了sun的Java SDK，還提供了許多不同的SDK。eclipse也整合在portage中。但是其eclipse使用上有點問題，裝了emf後就會開始找不到jre =\_=，這個問題應該不難解決。

  
  
  

PHP相關的比較
--------

  

Debian unstable 安裝smarty時，他會相依到apache 1.3，但是apache 1.3卻沒有php的模組供載入。使用apache2又發現沒有整合入smarty，真是讓人有點火大...  
註：經由kanru的指正，apache 1.3只要有php4這個套件，PHP的部份就可以正常的運作

  

Gentoo這一個部份還沒試過，不過大概不會有什麼太大的問題。  
  
【Palatis】指正：  
  
\# emerge sync && emerge apache mod\_php smarty  
  
設定 apache2.conf  
  
\# rc-update add apache defalut  
  
\# rc  
  
就可以用了.  
  

  
  
  

影音相關
----

  

Debian並沒有mplayer，但是xine可以取代mplayer大部份的工作，中文字幕也沒有問題。但是在WMV 8的格式上卻沒有辦法支援，唯一的方法使用vlc開啟，但是vlc的解碼器似乎很差，畫面很容易就整個糊在一起了。

  

Gentoo這方面都沒什麼大問題。

  
  
  
hmm....寫完這格之後，我還是比較偏好Gentoo，雖然我要花上大半的時間在安裝上...不過...我認了 =\_=  
有誰支持Debian的可以讓我回心轉意嗎？ :-D