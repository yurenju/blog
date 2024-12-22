---
title: 在 X31 安裝 Gentoo 2005.0 找不到光碟機的問題
date: '2005-06-10'
tags:
  - linux
categories:
  - tech
---
找到解答了。  
  
http://forums.gentoo.org/viewtopic-t-320660-highlight-livecd+boot+usb.html  
  

> \*\*\* UPDATE - changed /dev/sr0 to /dev/ram0 in the last part (bolded) below. Sorry 'bout that.  
>   
> After pulling my hair out (what's left anyway), I got this thing working. I saw other posts that say it just won't work with this release. Here's what I did:  
>   
> After dropping to the mini-shell:  
>   
> Determining root device...  
> The root block device is unspecified or not detected.  
> Please specify a device to boot, or "shell" for a shell...  
> boot() :: shell  
>   
> Checked to see that the USB CD-ROM was found  
>   
> cat /proc/scsi/scsi  
> cat /proc/scsi/usb-storage/0 \[your number here may vary\]  
> cat /proc/sys/dev/cdrom/info \[I found my drive name was "sr0"\]  
> ls -l /dev/sr0 \[shows that the device doesn't exist\]  
> cat /proc/devices | grep sr \[shows me the major node (?), mine is "11 sr"\]  
> mknod /dev/sr0 b 11 0  
> exit  
>   
> Then, it asks again for the boot device:  
>   
> boot() ::  
>   
> this time, I entered "/dev/ram0" and it booted into the livecd!  
>   
> Hope this helps someone.  
>   
> 0bijuan