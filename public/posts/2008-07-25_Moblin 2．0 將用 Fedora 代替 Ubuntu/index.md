---
title: Moblin 2.0 將用 Fedora 代替 Ubuntu
date: '2008-07-25'
tags:
  - ubuntu
  - fedora
  - intel
  - moblin
  - deb
  - rpm
categories:
  - tech
---
[Intel switches from Ubuntu to Fedora for Mobile Linux](http://www.heise-online.co.uk/open/Intel-switches-from-Ubuntu-to-Fedora-for-Mobile-Linux--/news/111166)  
  
Intel 在最近 O'reilly 的 OSCON 2008 大會上宣佈給 MID 使用的 Moblin 2.0 將用 Fedora 取代 Ubuntu。最主要的原因是 Fedora 的 RPM 套件管理格式可以內含授權資訊，而 Debian/Ubuntu 使用的 DEB 格式並不提供授權資訊，因此才從 Ubuntu 換到 Fedora。  
  
這個消息對我來說是蠻可惜的，我自己喜歡 Ubuntu 勝過於 Fedora。而關於 deb 無法提供檔案授權資訊的問題我也感到蠻奇怪的。debian/copyright 不就是放置授權資訊的地方嗎？剛剛翻了一下 RPM 的檔案格式，RPM 的授權欄位是只填寫了是 GPL而沒有詳細的 GPL 內文，而 deb 的 copryright 則是授權全文。或許這樣的欄位格式會更符合 Intel 的需求？