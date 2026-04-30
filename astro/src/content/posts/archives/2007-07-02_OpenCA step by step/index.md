---
title: OpenCA step by step
date: '2007-07-02'
tags:
  - openca
categories:
  - tech
---
環境 (environment)  

*   Ubuntu 7.04
*   OpenCA PKI Project 0.9.3-rc1

更新 Ubuntu  
使用終端機 (Terminal) 輸入以下指令：  

> $ sudo aptitude update  
> $ sudo aptitude dist-upgrade

下載，解壓縮 OpenCA  
到 [OpenCA PKI 下載頁面](https://www.openca.org/projects/openca/downloads.shtml)，下載以下兩個檔案：  

*   [openca-0.9.3-rc1.tar.gz](https://www.openca.org/alby/download?target=openca-0.9.3-rc1.tar.gz)
*   [openca-tools-1.0.0.tar.gz](https://www.openca.org/alby/download?target=openca-tools-1.0.0.tar.gz)

使用終端機 (Terminal) 切換至下載目錄，預設在 Desktop 目錄，並且使用 tar 指令解壓縮：  

> $ cd Desktop  
> $ tar zxvf openca-0.9.3-rc1.tar.gz  
> $ tar zxvf openca-tools-1.0.0.tar.gz

安裝必備軟體  
在 openca 的安裝說明檔 INSTALL 裡面有寫到必須安裝的軟體。遇到 Postfix 請先回答不要設定（No Configuration）  

> $ sudo aptitude install apache2 libssl-dev libldap2-dev ldap-utils libdbi-perl libclass-dbi-mysql-perl mysql-server  

這是安裝 openca 時另外沒有提到，但是需要的 perl 函式庫  

> $ sudo aptitude install libconvert-asn1-perl libauthen-sasl-perl libio-socket-ssl-perl libxml-sax-perl

設定 MySQL  
設定 mysql root 密碼，這邊設定成 1234。另外再新增一個資料庫 openca  

> $ mysql -u root -p  
> mysql> set password for root@localhost = password('1234');  
> mysql> CREATE DATABASE openca;

  
安裝 OpenCA-Tools  
進入 openca-tools 目錄後，使用 configure 進行組態設定，make 編譯，以及 make install 進行安裝。其中 configure 中的 prefix 參數設定將程式安裝到 /usr 當中。  

> $ cd openca-tools-1.0.0/  
> $ ./configure --prefix=/usr --enable-debug  
> $ make  
> $ sudo make install

安裝 OpenCA  
退回上一個目錄後，進入 openca 目錄。使用 configure 進行組態設定，並使用 make 編譯，而安裝則分成兩個步驟，make install-offline 會安裝 CA 系統，make install-online 會安裝 RA 與 pub 公開目錄。另外 make 的時候如果任何詢問是否要從 CPAN 線上安裝任何套件，全部回答 y 即可。如果 make 時詢問是否要手動設定『Are you ready for manual configuration?』，依據懶人原則，請回答 no。  

> $ sudo mkdir /usr/lib/cgi-bin  
> $ cd ..  
> $ cd openca-0.9.3-rc1  
> $ ./configure --prefix=/usr --with-httpd-user=www-data --with-httpd-group=www-data --with-htdocs-fs-prefix=/var/www --with-cgi-fs-prefix=/usr/lib/cgi-bin --with-db-type=mysql --with-db-port=3306 --with-db-name=openca --with-db-user=root --with-db-host=localhost --with-db-passwd=1234 --enable-dbi  
> $ sudo make  
> $ sudo make install-offline  
> $ sudo make install-online  
> $ sudo cp src/scripts/open\* /usr/bin/  
> $ sudo chmod a+x /usr/bin/open\*

設定 OpenCA  

> $ cd /usr/OpenCA/etc  
> $ sudo ./configure\_etc.sh  
> $ sudo ./openca\_rc start

  
  
這個程序理論上可以安裝好 OpenCA, 我試蠻多次的。另外他還要安裝 SSL，請參考[這裡](http://alephzarro.com/blog/2007/01/07/installation-of-subversion-on-ubuntu-with-apache-ssl-and-basicauth/)。