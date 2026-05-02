---
title: '[tip] 使用 Win XP 防火牆時連結 proftpd 緩慢'
date: '2005-12-18'
tags:
  - linux
categories:
  - tech
---
感謝 HY 無私的分享 :)  
  
如果您也有使用 Microsoft Windows XP 內建防火牆時，連結 Proftpd 所建置的 FTP 站台有緩慢的現象，可以試試在 proftpd.conf 中加入以下參數：  
  

>   
> UseReverseDNS off  
> IdentLookups off  

  
  
便可以恢復 FTP 雄風！