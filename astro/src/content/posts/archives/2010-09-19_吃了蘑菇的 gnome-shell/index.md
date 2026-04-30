---
title: 吃了蘑菇的 gnome-shell
date: '2010-09-19'
tags:
  - gnome-shell
  - icos
  - javascript
  - GNOME
categories:
  - tech
---
  
  
  
**會變大～**  
  
上面這個影片主要是 demo 目前 gnome-shell 的 extension 可以控制 gnome-shell 裡面的任意元件，所以才可以做出讓 calendar 放大的外掛。有興趣可以看一下[源碼](http://gist.github.com/586175)。  
  
這是在 ICOS 的講題 Javascript in Linux Desktop，雖然跟 COSCUP 講的題目一樣，不過經過了一個月當然是要升級一下啦。  
  
這次不一樣的地方還有加入了 seedkit 的部份。不過瞄準的是略有開發經驗的聽眾，所以技術細節其實並沒有提很多。這次 seedkit 的範例用了 seedkit 原本就內附的 dbus, libnotify 範例外，也加了使用 wnck, 用 javascript 控制視窗的範例。  
  
下面這個影片依據 demo 用 dbus 控制 Ubuntu music player - rhythmbox 的上下首變更、libnotify 跳出通知訊息、以及用 wnck 取得視窗標題以及最後的操作所有視窗最小化。  
  
  
  
而操作這些動作的全部都是使用 html 與 javascript, 範例源碼如下：  
HTML 部份  
```
<html>
    <head>
    <link rel="stylesheet" href="./ui.css" type="text/css" media="all" />
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    <script src="./ui.js"></script>

    </head>
    <body>
    <div class="demo">
        <img id="cover-art"></img>
        <div id="prev-button" class="button">Prev</div>
        <div id="next-button" class="button">Next</div>
        <div id="notify-button" class="button">notify</div>
        <div id="wins-button" class="button">get wins</div>
        <div id="min-button" class="button">minimize</div>
        <div id="file-uri"></div>
    </div>
    <ul id="windows-list"></ul>
</body>
</html>

```  
Javascript 部份：  
```
Seed.include("./dbus-rhythmbox.js");

function sendNotification(summary, body, timeOut) {
 var notification = new Notify.Notification({summary:summary, body:body});
 notification.set\_timeout(timeOut);
 notification.show();
}

function getWindows () {
        Wnck = imports.gi.Wnck;
        Gtk = imports.gi.Gtk
        Gtk.init(Seed.argv);

        var screen = Wnck.Screen.get\_default();
        while (Gtk.events\_pending())
            Gtk.main\_iteration();
        return screen.get\_windows();
}

$(document).ready(function(){
 var shell = new RhythmboxShell();
 var player = new RhythmboxPlayer();

 Notify = imports.gi.Notify;

 $("#wins-button").click( function() {
        var wins = getWindows();
        Seed.print (wins.length);
        for (var i = 0; i < wins.length; i++) {
            Seed.print (wins\[i\].get\_name());
            $("#windows-list").append("<li>" + wins\[i\].get\_name() + "</li>");
        }
    });

 $("#min-button").click( function() {
        var wins = getWindows();
        for (var i = 0; i < wins.length; i++) {
            wins\[i\].minimize();
        }
    });
 
    Notify.init("Webview");
 $("#notify-button").click( function() {
  sendNotification("Raised from a WebView","Raised from a WebView", 500); 
  Seed.print("clicked");
 });

 //playeplayer.getVolumeRemote(function (volume) {print("oi")});
 $("#next-button").click(function(){
  player.nextRemote();
 });

 $("#prev-button").click(function(){
  player.previousRemote();
 });

 player.connect("playingUriChanged", 
         function(emitter, uri){
   //var song = shell.getSongPropertiesRemoteSync(uri);
   //print(song); 
         });

 player.connect("playingSongPropertyChanged", 
         function(emitter, title, property\_name, old\_value, new\_value){
   if (property\_name == "rb:coverArt-uri")
    $("#cover-art").attr('src', new\_value);
 });
});

```  
dbus 的操作一樣的是比較複雜，你可以參考[上一篇](http://yurinfore.blogspot.com/2010/09/seedkit-web-technology-desktop.html)。不過相對起來 wnck, libnotify 就簡單許多。而這整個操作，全部都可以使用 jquery 的方式操作，撰寫起桌面應用程式就跟網頁一樣。  
  
  
最後是 slide。謝謝昨天大家的聆聽 ![](images/0.png)  
  

**[Javascript in linux desktop (ICOS ver.)](http://www.slideshare.net/yurenju/javascript-in-linux-desktop-icos-ver "Javascript in linux desktop (ICOS ver.)")**  

View more [presentations](http://www.slideshare.net/) from [yurenju](http://www.slideshare.net/yurenju).