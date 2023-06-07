---
title: Javascript client library 之 TDD
date: '2011-09-22'
tags:
  - qunit
  - TDD
  - unit test
  - javascript
categories:
  - tech
---
最近因緣際會在寫 web service 的 javascript client library，就趁著這個機會試試看 [TDD (Test-Driven Development)](http://en.wikipedia.org/wiki/Test-driven_development) 的方式來開發看看。  
  
這次撰寫的 client library 因為是 javascript，所以就利用了 Javascript 常見的 event driven 的呼叫方式。原本打算用 [jsunit](http://www.jsunit.net/) 作為 unit test 的框架，但因為沒看到可以測試 callback 的 method，最後改用了 jquery 所使用的 [qunit](http://docs.jquery.com/Qunit)。  
  
qunit 在測試 callback 的方式大略如下：  
  
  
```
test(
  'Login success test',

  function() {
    expect(1);
    stop();

    var service = new WebService();
    service.login(
      {
        username: 'user1@example.com',
        password: 'password'
      },
      function(res) {
        equal(res.response.status, "OK", 'expected login success');
        start();
      }
    );
  }
);

```qunit 可以利用 stop() 停止整個 unit test 的進行，等到呼叫 start() 的時候再繼續執行。在這個測試中，qunit 會在 stop() 之後開始等待，等到呼叫到 callback method 裡面的 start() 之後才會繼續執行，這個時候就可以擷取到 equal() 所測試的結果。另外 expect() 可以指定預期會跑到的 assert 總共有幾個，在這個例子裡面只跑了一次 equal()，所以是 expect(1)。 當所有 test case 完成後，跑 qunit 的結果大略如下：  
  

[![](images/0.png)](http://2.bp.blogspot.com/-UnVkxRZy3Qw/TntZF-CR0NI/AAAAAAAAK2Q/vjP71KeYDe0/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7+2011-09-22+%25E4%25B8%258B%25E5%258D%258811.39.44.png)

  
因為根本就還沒開始寫 client library，當然所有測試結果都是 failed。但在這個時候就已經得知 javascript client library 要如何使用以及有哪些回傳值了。這樣其實可以在早期的時候就可以看到整個 client library 的面貌。  
  
而且看著 test case 一個一個的通過心中真是有莫名的快感阿。寫完之後就變成這樣：  
  

[![](images/1.png)](http://2.bp.blogspot.com/-XTi2HJPnlQ0/TntaRtp6VJI/AAAAAAAAK2U/SZy3v8RPb2E/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7+2011-09-22+%25E4%25B8%258B%25E5%258D%258811.53.21.png)

  
  
使用 TDD 方法開發確實讓整個開發的過程踏實不少。不過這種開發方式還是比較適合實作函式庫，如果撰寫 UI 的話就沒有那麼適合了。  
  
不過大家還是可以玩一下，蠻有收穫的 :)