---
title: 更改 OpenOffice 的預設開啟檔案路徑
date: '2008-08-26'
tags:
  - openoffice.org
categories:
  - tech
---
包裝各種軟體時，常常會遇到預設檔案設定的問題，而各種不同的軟體都有不同的設定方法，每次都要找半天才知道在哪邊修改 :(  
  
OpenOffice 如果要修改預設開啟路徑必須修改 /usr/lib/openoffice/share/registry/data/org/openoffice/Office/Common.xcu，加入以下片段：  
  
  
  
這樣就可以讓 OpenOffice 預設在某個目錄開啟/儲存檔案了。