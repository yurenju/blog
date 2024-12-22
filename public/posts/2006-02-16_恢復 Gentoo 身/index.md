---
title: 恢復 Gentoo 身
date: '2006-02-16'
tags:
  - linux
categories:
  - tech
---
用了 Ubuntu 一個禮拜，我還是決定繼續使用 Gentoo。  
  
先說說 Ubuntu 好在哪。當初使用 Ubuntu 的契機，在於平常都習慣使用 dhcp 直接分配 IP, 不然就是在學校固定 IP 的環境，因為剛好必須要使用 ADSL 撥接上網，該死的是我的 Gentoo 不知道為什麼 adsl-start 以後一直都 Time Out，實在很火大，雖然說我猜可能是編譯核心的時候忘了勾什麼選項，不過真的很懶得弄，正巧手邊有一片 Ubuntu，索性就換了一顆硬碟，安裝看看。  
  
沒想到一裝就驚為天人。從安裝，到調校到系統符合我平常使用的環境，我幾乎只修改了兩個檔案：一個是 /etc/apt/source.list，另外一個是掛載 ibm-acpi 用的 modprobe.conf 檔。而設定完成後，ThinkPad X31 的所有功能都可以正常運作，包括兩種休眠功能、無線網路、CPU 頻率調整等，都不需要額外的設定。天那！太方便了！  
  
然而又轉回 Gentoo 的契機，是因為我最近都使用 30boxes, 他裡面有可以訂閱 webcal:// 的機制，所以我就使用 Ubuntu 底下的 Evolution 試試看，沒想到一訂閱就 Crash。我有感而發的說：『唉，還是 Gentoo 好』，所以又換回 Gentoo。  
  
沒想到我興高采烈的用 Gentoo 底下的 Evolution 訂閱 30boxes --- 靠！竟然是一樣的錯誤訊息！！  
  
後來我試著關掉一些 USE Flag 再編譯，還是不行。不過因為硬碟已經拔起來欄得換回去，而且我對 Gentoo 還是充滿著感情，所以就繼續使用可愛的 Gentoo 囉。