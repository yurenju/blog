---
title: EeePC 701 硬體詳細資訊
date: '2007-10-19'
tags:
  - 硬體
  - asus
  - eee-pc
categories:
  - tech
---
剛用 lshw 指令查看 EeePC 701 的硬體詳細資訊，列出幾個重要的分享給大家。不過說實在的華碩有蠻多欄位都亂填的，硬體序號竟然填 EeePC-1234567890，雖然不影響功能，不過看到還是有點傻眼。  
  

*   BIOS 廠商: American Megatrends Inc.
*   CPU

*   Product: Intel(R) Celeron(R) M processor 900MHz
*   Clock: 70Mhz
*   capabilities: fpu fpu\_exception wp vme de pse tsc msr mce cx8 apic sep mtrr pge mca cmov pat clflush dts acpi mmx fxsr sse sse2 ss tm pbe cpufreq
*   L1 cache: 32 KB
*   L2 cache: 512 KB

*   記憶體
*   PCI 晶片: Mobile 915GM/PM/GMS/910GML Express Processor to DRAM Controller
*   顯示卡：Mobile 915GM/GMS/910GML Express Graphics Controller (256MB) (這地方可能是錯誤的)
*   音效卡：82801FB/FBM/FR/FW/FRW (ICH6 Family) High Definition Audio Controller
*   有線網卡：Atheros L2 100 Mbit Ethernet Adapter
*   無線網卡：Atheros AR5007EG 802.11 b/g Wireless PCI Express Adapter
*   IDE 晶片：82801FBM (ICH6M) SATA Controller
*   或許是 SSD 硬碟廠商：SILICONMOTION SM

吐一下槽，下面是華碩亂填或者是應該填沒有填的  

*   product serial: EeePC-1234567890
*   product configuration uuid: 00020003-0004-0005-0006-000700080009
*   product version: x.x
*   Motherboard slot: To Be Filled By O.E.M.
*   VGA Card size: 256 MB
*   VGA Card mode: 640x480