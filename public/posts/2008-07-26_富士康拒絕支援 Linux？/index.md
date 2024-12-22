---
title: 富士康拒絕支援 Linux?
date: '2008-07-26'
tags:
  - 富士康
  - foxconn
categories:
  - tech
---
原諒我下了一個竦動的標題 :P  
我是學媒體記者的~  
  
台灣的主機板大廠富士康 (foxconn)最近有一則很有趣的新聞，是關於富士康客服 (或 FAE/RD) 跟一個買富士康主機板的客戶針對主機板 Linux 支援的魚雁往返，在國外各大科技新聞網站 [Slashdot](http://linux.slashdot.org/article.pl?sid=08/07/25/1150218), [digg](http://digg.com/linux_unix/Foxconn_deliberately_sabotaging_their_BIOS_to_destroy_Linux), [ZDNet](http://blogs.zdnet.com/hardware/?p=2292) 上都有報導，尤其是 digg 已經破 4000 了 (現在快破5000了)。富士康真是一戰成名，一次就讓三個國外大站報導了，正所謂三個願望一次達成阿。我想過了週末會有更多國外網站報導這件事情。  
  
\[update 2008/7/27 2:13\]  
我剛發現一件事情，wikipedia 上的[英文 foxconn 條目](http://en.wikipedia.org/wiki/Foxconn)已經補上這次 [BIOS DSDT 事件](http://en.wikipedia.org/wiki/Foxconn#Criticism)了。此條目上記載：此客戶已經投訴到美國公平交易委員會跟消費者團體(應該是台灣的消基會吧)。富士康還能坐視不管這件事情嗎？  
  
故事是這樣開始的…。  
  
在 [Ubuntu 論壇](http://ubuntuforums.org/showthread.php?t=869249)中有人發現了一個 BIOS 的臭蟲，這位老兄反組譯了 BIOS 試圖解決這個問題，他發現如果作業系統是 Linux 時，BIOS 給作業系統的 DSDT 表格是錯誤的，但是如果是 XP, Vista 的時候則會丟一個正確的 DSDT 表格給作業系統，所以只要把原始碼修正成跟 XP, Vista 使用同一個 DSDT 表格就可以正常運作了。  
  
這邊的問題是，BIOS 給 XP/Vista 的表格是正確的，但是給 Linux 的表格是錯誤的。  
  
接著他給富士康寫了信希望可以修正這個問題，但跟富士康通信後他最後投訴給公平交易委員會了。  
  
注意，以下是大概的翻譯，想知道詳情請直接閱讀原文以免我少翻了什麼 XDD (有人可以全部翻出來嗎？我覺得這件事情很有趣)  
  
\--------  
  
這段是 Ryan 寫給公平交易委員會的。  
  
我發現了 G33M-S 的主機板的規格聲稱支援 ACPI 1.0, 2.0 ,3.0。但 Linux 跟 FreeBSD 沒辦法在這個主機板的 ACPI 組態下運作。用了反組譯程式後我發現主機板偵測到了 Linux，但是給了一個不正確的 DSDT table。(中間有段省略)我會抱怨是因為我覺得 Microsoft給了富士康一些好處讓這塊主機板在跑非 Windows 作業系統時會有些問題。  
  
以下是信件往來內容  
  
**Ryan:**  
有個 ACPI 問題，我使用休眠到記憶體的功能後沒辦法重新啟動電腦。  
  
Jul 22 08:37:53 ryan-pc kernel: ACPI: FACS 7FFBE000, 0040  
Jul 22 08:37:53 ryan-pc kernel: ACPI: FACS 7FFBE000, 0040  
Jul 22 08:37:53 ryan-pc kernel: ACPI: FACS 7FFBE000, 0040  
Jul 22 08:37:53 ryan-pc kernel: ACPI: FACS 7FFBE000, 0040  
Jul 22 08:37:53 ryan-pc kernel: ACPI Warning (tbutils-0217): Incorrect checksum in table \[OEMB\] - 70, should be 69 \[20070126\]  
  
我在開機的時候收到這個訊息，相同的發生這個狀況以後我也無法重新開機 ，他停在關機過程，PC 喇叭不斷的發生持續的嗶聲。  
  
Foxconn:  
如果你移除了所有記憶體後再開機還會有相同的嗶聲嗎？  
  
Ryan:  
不。這樣的話我就沒辦法開機到 linux、休眠並且取得 ACPI 錯誤。如果你需要完整的 /var/log/messages 我也可以寄給你。  
  
Foxconn:  
這塊版子從來沒有通過 Linux 認証，他只通過 Vista 認証。請在 Vista 下測試。這個問題會在 Vista 或 XP 下發生嗎？  
  
Ryan:  
我已經回報到 kernel.org, Red hat 跟 Canonical 的錯誤回報系統，並且寫在我的 blog 上，你只要用 google 找 "Foxconn G33M" 或 "Foxconn G33M-s", "Foxconn Linux" 很明顯的在最前面幾個就可以看到這些結果，希望可以讓其他人不要花錢在錯誤的產品上，或是希望 kernel 可以在 2.6.26 裏面為這個無法運作的 BIOS 提供修正。而且我知道 kernel 比起那個只讓 windows 會動的 BIOS還要更願意幫我修正問題。  
  
我已經這個頁面上點了很多次了，長遠的來說你們現在這樣做只是在傷害你們自己。特別是像我這樣喜歡告訴別人哪些是壞產品的人。  
  
Foxconn:  
這樣無意義的討論是沒辦法解決任何問題的。  
現在的情況就是這個產品並沒有 Linux 支援認証。  
如果你不滿這個產品沒有辦法在沒經過認証的作業系統下運行，請連絡你的銷售商退貨。  
  
Ryan: (附上原句，這超有殺傷力的 XD)  
Yeah, well, I allege that you guys thoroughly suck.  
Learn how to write a BIOS before you go selling hardware with falsified specs.  
呃，我想你完全是個混帳。  
在你銷售偽造規格的硬體前先學好怎麼寫 BIOS 吧。  
  
Ryan: (繼續回應)  
你的產品號稱支援 ACPI 標準，但卻沒有。這代表你們的廣告是騙人的。  
  
Foxconn:  
你說這塊版子不支援 ACPI 標準是錯誤的，不然的話它就不會通過微軟的認証了。  
  
Ryan:  
我發現到版子如果偵測到是 Linux 將會給作業系統另外一個 DSDT 表格，如果我給 Linux 正確的那個表格(也就是 Vista 得到的那個 DSDT) 所有的 Linux 問題都可以解決了。  
  
雖然說我同意你們通過了某個微軟硬體認証 (我並不驚訝)，但那個認証並不代表符合 ACPI 標準，只是讓 Windows 可以很容易的對付這個小問題罷了。  
  
Foxconn: (生氣了)  
**Stop sending us these!!!**  
**不要再送這些東西給我們了！！！**  
  
  
後面自己看吧 XD  
  
\[update - 2008/7/26 晚間 11:16\]  

*   先生改成老兄 (這樣比較好吧 XD)
*   更加詳細的敘述 BIOS 錯誤的細節，關於 Vista/XP 是正確的表格， Linux 卻是錯誤表格的那段。  
    

\[update - 2008/7/27 早上 10:10\]  
我果然有翻錯的地方 ，其實原本 Ryan第一段的部份是他寫給公平交易委員會而非 Foxconn 的。原諒我沒看的那麼仔細 :P