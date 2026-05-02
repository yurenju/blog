---
title: '[Ubuntu] 安裝 OpenCA'
date: '2007-04-12'
tags:
  - ubuntu
  - linux
  - server
  - openca
categories:
  - tech
---
這文件是我修 Network Security 的作業，因為之前發生很鳥蛋的[抄襲事件](http://yurenju.blogspot.com/2006/05/blog-post.html "抄襲事件") ，所以這次先寫在前面，一樣也是修王老師 network security 別抓下來就直接當作業交出去啦 XD  

### OpenCA

由於參考資料的OpenCA 版本0.9.2.1與現在版本0.9.3-rc1已有差距功能以及組態設定都與之前版本不同，如組態設定時已取消 \--with-hierarchy-level 參數、\--with-engine參數，並且因OpenCA必須配合許多週邊軟體，而參考資料中的週邊軟體與環境均與目前不同。故參照OpenCA原始檔中的INSTALL檔案進行安裝。

#### Environment

*   Ubuntu 6.10
*   OpenCA 0.9.3-rc1

#### Prerequisites

閱讀 openca 中的 INSTALL，裡面提到

Prerequisites

\=============  
Prerequisites for building the OpenCA software are:

o GNU tar (a tar that understands the z option for gzip)  
o GNU make (at minimum for FreeBSD because there are several problems reported with the OS's own make)

Prerequisites for running the OpenCA software are:

o OpenSSL ( 0.9.7+ ) (on both CA and external server);  
o Perl (5.6.1+ with DBI support) (on both CA and external server);  
o Apache Web Server (on both CA and external server);  
o mod\_ssl (for Apache) (on external server only);  
o OpenLDAP (v2 is recommended) (on external server)

先確定系統裡面是否安裝了這些軟體。比較要注意到的是因為要編譯軟體，所以安裝時別忘了把名稱尾端為 \-dev 的套件安裝。最常會遺漏掉的通常是 openssl 的 header 檔 libssl-dev；Ubuntu 的 Apache2 已經將 SSL 編入，不需要另外掛載模組。我安裝了以下軟體：

*   tar
    
*   make
    
*   openssl
    
*   libssl-dev
    
*   perl
    
*   libdbi-perl
    
*   apache2
    
*   ldap-utils
    
*   libldap2
    
*   libldap2-dev
    

可以使用 apt-get 安裝以上軟體：

> `# apt-get install tar make openssl libssl-dev perl libdbi-perl apache2 ldap-utils libldap2 libldap2-dev`

#### Apache2 mod\_ssl configuration

Ubuntu最初的mod\_ssl設定檔並無將SSL啟動，必須先複製/usr/share/doc/apache2/example/ssl.conf.gz檔案至/etc/apache2/mods-available 中

> `cp /usr/share/doc/apache2/example/ssl.conf.gz /etc/apache2/mods-available`
> 
> `gzip -d ssl.conf.gz`

接著新增https的VirtualHost站台

> `cd /etc/apache2/sites-available/`
> 
> `cp default ssl`
> 
> `cd ../sites-enabled/`
> 
> `ln -s /etc/apache2/sites-avaiable/ssl 001-ssl`

編輯001-ssl，將以下兩處更改：

> `NameVirtualHost *:443`
> 
> `<VirtualHost *:443>`

最後產生Apache的憑證：

> `apache2-ssl-certificate`

回答完所有問題即可建立憑證。

#### OpenCA Tools installation

安裝 [OpenCA Tools](http://www.openca.org/alby/download?target=openca-tools-1.0.0.tar.gz)，解壓縮：  

> `tar zxvf openca-tools-1.0.0.tar.gz`

組態設定，我將 OpenCA Tools 安裝在 /usr/local/, 並且開啟 OpenSSL 支援。

> `cd openca-tools-1.0.0`  
> `./configure --prefix=/usr/local/ --enable-engine`

編譯與安裝（標明 \# 的命令代表需要取得 root 權限。）

> `make`  
> `# make install`

組態設定如下：

> `./configure --prefix=/usr/local --with-openssl-prefix=/usr --with-web-host=140.130.175.184 --with-httpd-user=www-data --with-httpd-group=www-data --with-htdocs-fs-prefix=/var/www --with-cgi-fs-prefix=/usr/lib/cgi-bin --with-db-type=mysql --with-db-port=3306 --enable-dbi`

而進行安裝、設定後，發現安裝程序並無將所需之script檔案複製入目的端，故手動進行複製：

> `make`
> 
> `make install-offline`
> 
> `make install-online`
> 
> `cd src/scripts`
> 
> `cp * /usr/local/bin/`
> 
> `rm /usr/local/bin/*.in`
> 
> `chmod 755 /usr/local/bin/*`

接下來對config.xml設定，並且執行./configure\_etc.sh，啟動 OpenCA：

openca\_rc start

接著照著參考資料上的作，最後就可以Approved Request。

![](images/0)  
  

#### Reference

Need Apache2 SSL howto, [http://ubuntuforums.org/archive/index.php/t-4466.html](http://ubuntuforums.org/archive/index.php/t-4466.html)

楊中皇, 網路安全理論與實務