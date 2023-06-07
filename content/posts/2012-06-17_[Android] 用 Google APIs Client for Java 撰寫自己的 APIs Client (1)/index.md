---
title: '[Android] 用 Google APIs Client for Java 撰寫自己的 APIs Client (1)'
date: '2012-06-17'
tags:
  - google-api-java-client
  - Android
  - java
categories:
  - tech
---
你在 Android 上都怎麼實作連接 web service 的 client library 呢？在之前的 Project 中，通常都是用 Apache 的 [HttpClient](http://developer.android.com/reference/org/apache/http/client/HttpClient.html), [HttpGet](http://developer.android.com/reference/org/apache/http/client/methods/HttpGet.html), [HttpPost](http://developer.android.com/reference/org/apache/http/client/methods/HttpPost.html) 刻自己的 client library，配合 [google-gson](http://code.google.com/p/google-gson/) 將 Json 轉換成 Java Object。但我一直希望可以有一個函式庫或 framework 可以處理這些事情，之前也看過 [Restlet](http://www.restlet.org/)，但是似乎不是很好用。最近開始使用 [Google APIs Client for Java](http://code.google.com/p/google-api-java-client/) 之後覺得這套 framework 似乎可以把事情處理的很好，就開始使用了。  
  
這套 Library 對我來說的好處是  

1.  很方便的切換不同的 HTTP Method，不必每次要換 Method 都需要重寫很多源碼
2.  自己處理瑣碎的事情，像是 gzip 壓縮, 傳入傳出 JSON 的 String-Object 轉換，URL builder 這些都很方便
3.  減少源碼，有了上述的東西，源碼行數當然是大幅減少了。

另外它還有些特性我不太用到像是同時支援 JSON, XML、同時 support GAE, J2SE/J2EE 跟 Android，甚至可以替換 HTTP Client、Json library 或 XML library。

  
  
話說他的名字可能會讓你覺得這是一套給 Google APIs 專門使用的 client library，其實不然。除了可以透過它存取 Google Services，也可以利用它來建構自己的 client library。如果要初步的了解這套 library 可以先看 [Google I/O 2011: Best Practices for Accessing Google APIs on Android](http://youtu.be/9fBcrzA-hWY)，這篇裡面有些使用他的基本知識。  
  
安裝很簡單，就直接照著 README 的說明，把該丟的 jar 檔放到 libs 裡面就行了。因為它同時支援 google app engine, Java SE, 跟 Android 開發環境，所以不同的狀況底下會有不同的 dependency，你可以參考我丟的 jar：  
  

[![](http://3.bp.blogspot.com/-M_6tL8luOXU/T90eGfsay5I/AAAAAAAAQQU/R1mGNhDwArs/s1600/%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%E5%AD%98%E7%82%BA+2012-06-17+07:58:45.png)](images/0.png)

  
你可能剛開始就被它龐大的相依 library 嚇到了，事實上它可以透過 proguard 在 release app 的時候去除掉那些你從沒用到的地方，在 Yaniv Inbar 的投影片裡面也有提到它在他的例子中可以節省 95% 的空間。  
  

[![](http://2.bp.blogspot.com/-xCqa_EOXlwQ/T90flCLltvI/AAAAAAAAQQc/xJf3iUEFVJA/s1600/%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%E5%AD%98%E7%82%BA+2012-06-17+08:03:51.png)](images/1.png)

  
  
怎麼樣開始用 Google APIs Client 寫自己的 APi wrapper 呢？下面參考 Google Task 跟 Google+ 的 API 提供了一個簡單的範本  
  
  
  
```
package idv.yurenju.google.sample;

import java.io.IOException;

import com.google.api.client.http.HttpMethod;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.json.JsonHttpClient;
import com.google.api.client.http.json.JsonHttpRequest;
import com.google.api.client.json.JsonFactory;
import com.google.common.base.Preconditions;

public class SampleClient extends JsonHttpClient {
 public static final String DEFAULT\_BASE\_URL = "https://api.twitter.com/";

 public SampleClient(HttpTransport transport, JsonFactory factory) {
  super(transport, factory, DEFAULT\_BASE\_URL);
 }
}



```  
DEFAULT\_BASE\_URL 是 web service 基礎的網址，往後所有的 query 都會基於這個網址。當建立你的 Client 的時候，你可以任意的替換 HttpTransport 與 JsonFactory。這邊我們用的是 NetHttpTransport 跟 JacksonFactory。  
  
```
SampleClient client = new SampleClient(new NetHttpTransport(), new JacksonFactory());

```  
要開始寫頭一個 API 時，首先要先建立 Data Model，這邊我們先用 Twitter 的 user\_timeline 測試。用 [http://api.twitter.com/1/statuses/user\_timeline/yurenju.json](http://api.twitter.com/1/statuses/user_timeline/yurenju.json) 可以獲得我的 twitter 訊息。而每個 tweet 物件的屬性非常多，我們先用 text 與 created\_at 這兩個訊息來測試。 在這邊建立 TweetModel 如下：  
```
package idv.yurenju.google.sample;

import com.google.api.client.json.GenericJson;

public class TweetModel extends GenericJson {
 @com.google.api.client.util.Key("text")
 private String mText;
 
 @com.google.api.client.util.Key("created\_at")
 private String mCreatedAt;

 public String getText() {
  return mText;
 }

 public void setText(String mText) {
  this.mText = mText;
 }

 public String getCreatedAt() {
  return mCreatedAt;
 }

 public void setCreatedAt(String mCreatedAt) {
  this.mCreatedAt = mCreatedAt;
 }
}

```  
重點其實是繼承 GenericJson，而 6-10 行主用的功能是協助我們把 text, created\_at mapping 到符合 Android 寫作風格的 mText, mCreatedAt，剩下的部份則是 setter/getter。接下來就可以在 SampleClient 裡面加入 API。  
  
```
package idv.yurenju.google.sample;

import java.io.IOException;

import com.google.api.client.http.HttpMethod;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.json.JsonHttpClient;
import com.google.api.client.http.json.JsonHttpRequest;
import com.google.api.client.json.JsonFactory;
import com.google.common.base.Preconditions;

public class SampleClient extends JsonHttpClient {
 public static final String DEFAULT\_BASE\_URL = "https://api.twitter.com/";

 public SampleClient(HttpTransport transport, JsonFactory factory) {
  super(transport, factory, DEFAULT\_BASE\_URL);
 }
 
 public Users users() {
  return new Users();
 }
 
 public class Users {
  public GetTimeline getTimeline(String screenname) throws IOException {
   GetTimeline get = new GetTimeline(screenname);
   initialize(get);
   return get;
  }
  
  public class GetTimeline extends JsonHttpRequest {
   private static final String REST\_PATH = "1/statuses/user\_timeline/{screenname}.json";
   
   @com.google.api.client.util.Key("screenname")
   private String mScreenName;
   
   private GetTimeline(String screenname) {
    super(SampleClient.this, HttpMethod.GET, REST\_PATH, null);
    Preconditions.checkNotNull(screenname);
    mScreenName = screenname;
   }
   
   public TweetModel\[\] execute() throws IOException {
    HttpResponse response = executeUnparsed();
    TweetModel\[\] result = response.parseAs(TweetModel\[\].class);
    return result;
   }
  }
 }
}


```  
32 行提供了 REST 所用的 Path，其中 screenname 是會將變數替代入 Path 的參數，34-35 行的工作就是將 mScreenName mapping 到 screenname。當你設定了 mScreenName 後，執行 query 時就會帶入到 {screenname}。  
  
37-41 行的建構子，在這邊可以指定要用的 Http Method 以及要放入 Body 的變數。在這邊我們使用 null 原因是因為 GET Method 不需要填任何東西在 Body，但是使用 POST Method 的時候這邊通常就會把 JSON object 填入。  
  
43-48 行是真正執行 query 的地方。這個時候它會取得 Response，並且將內容用 TweetModel 陣列的方式剖析，最後回傳 TweetModel\[\]。  
  
25-29 行的地方做了 Reuqest 的 initialize，如果你有需要對 header 作手腳的話可以在這邊弄。  
  
完成了 Client 之後，最後就可以利用以下的方法來調用 getTimeline 的 API：  
  
```
TweetModel\[\] tweets = client.users().getTimeline("yurenju").execute();
for (TweetModel tweet : tweets) {
 Log.i("SAMPLE", tweet.getText());
}
```  
接下來如果有意外的話（咦）我會繼續講解 POST, PUT, modify headers 跟 authentication 的部份。