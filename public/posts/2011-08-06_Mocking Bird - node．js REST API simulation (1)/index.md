---
title: Mocking Bird - node.js REST API simulation (1)
date: '2011-08-06'
tags:
  - python
  - node.js
  - restful
categories:
  - tech
---
當團隊決定開發一個使用 web service 的 mobile app 時，我們遇到了一個小問題：mobile app 跟 web service 是同時開發的，當 web service 還沒實作完畢前，mobile app developer 只能暫時先從規格中 implement 跟 web service 銜接的介面。  

  

這聽起來有點瞎子摸象。

  

不過 Jamie Sa 提供了個有趣的點子：如果我們可以寫個模擬的 REST API service，並且透過 YAML 定義簡單的規格的話，我們就可以利用這個模擬 REST API 比較真實的跟 web service 銜接了 :)

  

[![](http://1.bp.blogspot.com/-EKIHMifuE0A/TjyapToKkQI/AAAAAAAAKZU/w6lhDyKrcuQ/s1600/arch.png)](images/0.png)

  
  
正巧手邊大家正在研究 node.js，不免俗的我們就用了它來實作了初版的 API Simulator，Jamie 把它叫做 mockingBird。這個時候 YAML spec 看起來像這樣：  
  
```
\# APIs in V1
meta:
  version: draft
v1\_articles:
  timestamp: '2011-07-19T08:54Z'
  is\_end: true
  articles:
    - { article: 1 }
    - { article: 2 }
    - { article: 3 }
  article\_count: 3

```  
而用瀏覽器開啟 http://127.0.0.1:8080/v1/articles 則會輸出以下結果：  
  

[![](http://3.bp.blogspot.com/-4aCXPkkIDaI/TjzLrnwngsI/AAAAAAAAKZY/W6jgCXrtGvc/s1600/v1.png)](images/1.png)

  
  
初版的時候我們用 underline "\_" 來分割版本，並且將假資料直接放在 YAML 裡面。而當我們需要模擬取得多筆資料的時候還可以處理，但如果需要類似 http://HOST/article/ARTICLE\_ID 這樣的 API 就無法模擬了，目前這樣的寫法也無法模擬 POST method。  
  
做了一連串的 hacking 後，終於完成了一個較有彈性的架構，不過當然還是沒辦法模擬太過於複雜的狀況 :P  
  

[![](http://2.bp.blogspot.com/-HGudaXyIgOE/TjzM8c5bpiI/AAAAAAAAKZc/RgmbNsQPnzs/s1600/arch-v2.png)](images/2.png)

  
MockingBird 會將 JSON 格式的假資料讀取進來，而可以在 YAML 裡面調用 dummy data 以及使用簡單的 Javascript 做計算。  
  
比如說我要模擬 Social network 的 API，  
  
首先要先產生 dummy.json 假資料檔，這邊我用一個 python script 產生 dummy.json。  
  
```
import uuid
import json
from random import randint, choice
from datetime import datetime, timedelta

firstnames = \['Ericka', 'Amie', 'Annabelle', 'Hugh', 'Carmella'\]
lastnames = \['Hilts', 'Kowalsky', 'Cincotta', 'Gerken', 'Stults'\]
devicenames = \['iPad', 'Android', 'Web'\]
basetime = datetime.today()
lipsum='Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sollicitudin elementum tristique. Nullam gravida bibendum magna viverra gravida. Cras nec mi a est malesuada dictum.'

def gen\_id():
    return uuid.uuid1().hex\[:24\]

def gen\_users(num=10):
    users = \[\]
    for i in range(num):
        user = {}
        user\['id'\] = gen\_id()
        user\['email'\] = 'a%s@example.com' % randint(0,1000000)
        user\['nickname'\] = "%s %s" % \\
                           (choice(firstnames), \\
                           choice(lastnames))
        users.append(user)
    return users

def gen\_comment(users, article\_id, timestamp):
    c = {}
    c\['id'\] = gen\_id()
    c\['creator\_id'\] = choice(users)\['id'\]
    c\['creation\_device\_name'\] = choice(devicenames)
    c\['article\_id'\] = article\_id
    c\['timestamp'\] = timestamp
    c\['text'\] = lipsum
    return c

def gen\_articles(users, num=20):
    articles = \[\]
    for i in range(num):
        user = choice(users)
        timestamp = basetime+timedelta(0,i\*10)
        article = {}
        article\['id'\] = gen\_id()
        article\['creator\_id'\] = user\['id'\]
        article\['creation\_device\_name'\] = choice(devicenames)
        article\['timestamp'\] = timestamp.isoformat()
        article\['text'\] = lipsum
        article\['comment\_count'\] = randint(0,5)
        article\['comments'\] = \[\]
        for j in range(article\['comment\_count'\]):
            c = gen\_comment(users, article\['id'\], \\
                            (timestamp+timedelta(0,j\*10)).isoformat())
            article\['comments'\].append(c)

        articles.append(article)
    return articles

if \_\_name\_\_ == '\_\_main\_\_':
    data = {}
    data\['users'\] = gen\_users()
    data\['articles'\] = gen\_articles(data\['users'\])
    print json.dumps(data, indent=2)


```  
  
這個 dummy json 會 load 進去 node.js 的主程式裡面，可以由程式或者是 YAML 裡面使用。現在的 YAML 檔案則是長成這樣：  
  
```
version: 0
api:
  articles:
    prefix: api
    url: "articles.\*"
    http\_method: GET
    response:
      timestamp: "timestamp"
      is\_end: "true"
      article\_count: "dummy\['articles'\].length"
      articles: "params\['limit'\] ? dummy\['articles'\].slice(0,params\['limit'\]) : dummy\['articles'\]"
  article:
    prefix: api
    url: "article/(\\w+)$"
    http\_method: GET
    response:
      article: "findById(dummy\['articles'\], match)"
  users:
    prefix: api
    url: "users"
    http\_method: GET
    response:
      users: "dummy\['users'\]"
  
  post\_article:
    prefix: api
    url: article
    http\_method: POST
    response:
      creator\_id: "params.creator\_id"
      creation\_device\_name: "params.creation\_device\_name"
      text: "params.text"
      timestamp: "timestamp"
      comment\_count: "0"
      comments: "\[\]"
      id: "generateId()"
  
  post\_comment:
    prefix: api
    url: comment
    http\_method: POST
    response:
      creator\_id: "params.creator\_id"
      creation\_device\_name: "params.creation\_device\_name"
      article\_id: "params.article\_id"
      text: "params.text"
      id: "generateId()"
      

```  
裡面有些關鍵字解釋一下：  

*   **version**: 最後 mockingBird 的網址會是 http://HOST/PREFIX/VERSION/method，如 http://localhost/api/0/articles，用來區分 API 版本用的變數
*   **prefix**: 可以針對 API 的用途使用不同的 prefix，在這邊我們只用了 "api" 這個 prefix。
*   **url**: url 的 match pattern
*   **http\_method**: 可以指定要用 POST 或是 GET 的 HTTP Method
*   **response**: 要回應的 JSON 訊息。
*   **dummy**: 在 YAML 裡面可以利用 dummy 取得假資料，比如說 dummy\['articles'\] 就是所有的 articles。
*   **params**: 使用 GET/POST 的時候丟進來的參數。比如下達了 http://localhost/api/0/articles?limit=2 時，YAML 可以使用參數 params.limit 取得這個 limit 數值，可以參考下面的片段
*   **findById**: 用 id 來搜尋物件的 method

```
articles:
    prefix: api
    url: "articles.\*"
    http\_method: GET
    response:
      timestamp: "timestamp"
      is\_end: "true"
      article\_count: "dummy\['articles'\].length"
      articles: "params\['limit'\] ? dummy\['articles'\].slice(0,params\['limit'\]) : dummy\['articles'\]"

```

  
當用瀏覽器開啟 http://localhost:8080/api/0/articles?limit=1 的時候，就可以獲得以下結果：  

[![](images/3.png)](http://4.bp.blogspot.com/-9B1ODBVlkeQ/TjzZzozlQiI/AAAAAAAAKZg/sjOpGjP8Vus/s1600/%25E8%259E%25A2%25E5%25B9%2595%25E5%25BF%25AB%25E7%2585%25A7+2011-08-06+%25E4%25B8%258B%25E5%258D%25882.05.17.png)

  
如此一來，你的 mobile app 就可以開幹了，而有了這個實體的 SPEC，web service 的 developer 也可以依此為目標，最終做成跟這個相同的 API。  
  
下一篇再來詳細講解怎麼使用這個工具還有 node.js 裡面是怎麼實作的。但重點是：有人有興趣嗎？出個聲吧 :P