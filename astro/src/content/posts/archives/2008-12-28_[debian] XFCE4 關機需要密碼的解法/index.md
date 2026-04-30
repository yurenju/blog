---
title: '[debian] XFCE4 關機需要密碼的解法'
date: '2008-12-28'
tags:
  - xfce
  - debian
categories:
  - tech
---
如果你也在 netbook 上用 debian xfce4 的話，應該會發現每次關機的時候 XFCE4 都會很不識趣的問密碼。今天剛好有些空，就上網找找是怎麼回事。我剛開始用 "xfce reboot password" 去 google。後來看到[這篇文章](http://mv153.wordpress.com/2006/05/09/xfce-shutdown-without-password/)的作法是修改 /etc/sudoers。  
  
不過我並不認為這是正確的解法。但這篇文章提供了一個資訊：xfce 關機是用 xfsm-shutdown-helper 這隻程式，所以我們可以利用 dpkg 查出 xfsm-shutdown-helper 所屬的套件。  

> $ dpkg -S xfsm-shutdown-helper  
> xfce4-session: /usr/sbin/xfsm-shutdown-helper

原來是屬於 xfce4-session 的，這樣我們可以利用 dpkg 繼續查詢 xfce4-session 有哪些檔案。  

> $ dpkg -L xfce4-session  
> ...  
>  **/usr/share/doc/xfce4-session/README.Debian**  
> ...

有關於 Debian 的 readme，進去看看，正巧裡面就提供了關於 xfce shutdown 的三個解決方法：  

1.  用 sudo，並且允許使用者執行 xfsm-shutdown-helper。也就是上面提到那篇文章的方式。
2.  如果系統中有 hal 跟 dbus，就直接把使用者加到 powerdev 群組即可。
3.  使用 policykit 並且採用相容的登入管理程式（目前 gdm 是支援的）

第一個我不太喜歡這種作法，第三個我覺得會超麻煩，感覺又是 freedesktop 訂出來偉大的標準，所以我採用了方法二。  
  
請用 root 權限編輯 /etc/group，並且在 powerdev 那行的最後面加入使用者的 id。我的使用者 id 是 yurenju，所以那行大概就會長的像這樣：  

> powerdev:x:105:yurenju

重新登入後不管是關機還是重開機都不會再問你密碼了。其實多數的 Debian Linux 桌面問題都可以尋著這個問題的解決方法前進。  

1.  到 google 搜尋
2.  找到相關的 package
3.  瀏覽 package 的 README

這樣可以解決還不少問題。