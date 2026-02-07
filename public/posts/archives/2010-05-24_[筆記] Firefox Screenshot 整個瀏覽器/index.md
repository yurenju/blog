---
title: '[筆記] Firefox Screenshot 整個瀏覽器'
date: '2010-05-24'
tags: []
categories:
  - tech
---
這段 code 從 UploadScreenshot.com Capture 延伸套件還有 [Canvas - MDC](http://mdn.beonex.com/en/Code_snippets/Canvas) 拼湊出來的。  
  
```
function onScreenshot (event) {
    var canvas = document.createElementNS ("http://www.w3.org/1999/xhtml", "html:canvas");
    var width = document.documentElement.scrollWidth;
    var height = document.documentElement.scrollHeight;
    canvas.style.width = String (width) + "px";
    canvas.style.height= String (height) + "px";
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext ("2d");
    ctx.clearRect (0, 0, width, height);
    ctx.save ();
    ctx.drawWindow (window, 0, 0, width, height, "rgb(255,255,255)");
    ctx.restore ();
    saveCanvas (canvas, "/tmp/test.png");
}

function saveCanvas(canvas, destFile) {
    // convert string filepath to an nsIFile
    var file = Components.classes\["@mozilla.org/file/local;1"\]
                       .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(destFile);

    // create a data url from the canvas and then create URIs of the source and targets  
    var io = Components.classes\["@mozilla.org/network/io-service;1"\]
                     .getService(Components.interfaces.nsIIOService);
    var source = io.newURI(canvas.toDataURL("image/png", ""), "UTF8", null);
    var target = io.newFileURI(file)

    // prepare to save the canvas data
    var persist = Components.classes\["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"\]
                          .createInstance(Components.interfaces.nsIWebBrowserPersist);

    persist.persistFlags = Components.interfaces.nsIWebBrowserPersist.PERSIST\_FLAGS\_REPLACE\_EXISTING\_FILES;
    persist.persistFlags |= Components.interfaces.nsIWebBrowserPersist.PERSIST\_FLAGS\_AUTODETECT\_APPLY\_CONVERSION;

    // displays a download dialog (remove these 3 lines for silent download)
    var xfer = Components.classes\["@mozilla.org/transfer;1"\]
                       .createInstance(Components.interfaces.nsITransfer);
    xfer.init(source, target, "", null, null, null, persist);
    persist.progressListener = xfer;

    // save the canvas data to the file
    persist.saveURI(source, null, null, null, null, file);
}

```