---
title: python 的 if item not in items 的 javascript 版本？
date: '2010-05-14'
tags: []
categories:
  - tech
---
平常在 Python 底下 if not in 還蠻好用的。舉例：  
```
items = \[1, 2, 3, 4\]
if 2 in items:
  print "in here!"
else
  print "not in here"

```那 javascript 有什麼簡單的方法可以作這判斷呢？目前還沒想到，所以用以下方法。  
```
let targetItem = something;
let items = \[1, 2, 3, 4\];

function containItem (item) {
  if (item == targetItem)
    return true;
  return false;
}

if (items.some (containItem))
  alert ("in here");
else
  alert ("not in here");

```好多行阿，懇求 javascript 高手釋疑。  
  
\[updated\]  
下面的迴響提供了 array.indexOf 這個更好用的方法。感謝 [想](http://www.blogger.com/profile/13341024946789148586)  
```
items = \[1, 2, 3, 4\];
if (items.indexOf (2) >= 0)
  alert ("in here");
else
  alert ("not in here");

```