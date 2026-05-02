---
title: Open Street Map 編輯地圖
date: '2009-01-17'
tags:
  - openstreetmap
categories:
  - tech
---
首先你需要 josm，當然 ubuntu 跟 debian 也都有了，請下 apt-get install josm。  
  
打開 josm，通常會在應用程式->教育->josm。進去之後直接開啟你的 \_trk.gpx 檔案，會看到以下畫面。  
  

[![](images/0.png)](http://3.bp.blogspot.com/_iOO0fC4NKLE/SXFiIBH_gpI/AAAAAAAAFRg/L8fpdfLJ0b0/s1600-h/Screenshot-Java+OpenStreetMap+-+Editor.png)

  
這就是你的路徑了。當然這樣是看不出所以然的。請按下工具列第四個圖示：下載。並且選擇儲存到新的圖層去。  
  

[![](images/1.png)](http://4.bp.blogspot.com/_iOO0fC4NKLE/SXFiiVjLRGI/AAAAAAAAFRo/wi5H2so8T2Q/s1600-h/Screenshot-Download.png)

  
此時 josm 會自動幫你下載軌跡附近的地圖，你大概就可以知道附近的路了。以我的例子來說他會下載復興崗捷運站附近的圖資。  
  

[![](images/2.png)](http://2.bp.blogspot.com/_iOO0fC4NKLE/SXFjAFcWt_I/AAAAAAAAFRw/gstkKgDlS14/s1600-h/Screenshot-Java+OpenStreetMap+-+Editor-1.png)

  
這個時候照片就派上用場了。右上角的 layer 目前應該會有兩個圖層：Data Layer 跟你剛上傳的路徑，這個時候對你上傳的路徑按右鍵，選擇 import images。然後把你剛剛照的照片全部一次都匯入。接下來會長這樣：  
  

[![](images/3.png)](http://2.bp.blogspot.com/_iOO0fC4NKLE/SXFjpwiz3-I/AAAAAAAAFR4/OCS4xVu7baE/s1600-h/Screenshot-Java+OpenStreetMap+-+Editor-2.png)

  
點選圖片後就會放大，你就可以知道你拍的照片是在軌跡的哪裡拍的了。最後一個步驟，就是依據你的 GPS 軌跡繪製地圖了。以我的例子來說，中央北路還沒補齊。  
  

[![](images/4.png)](http://4.bp.blogspot.com/_iOO0fC4NKLE/SXFkBSw7wgI/AAAAAAAAFSA/Kjl3ZI5Gtpo/s1600-h/Screenshot-Java+OpenStreetMap+-+Editor-3.png)

  
那你就可以利用左邊第三個工具繼續往下畫，畫完後用第二個工具隨便選取空白的地方取消選取。這樣就有新的路了。  
  

[![](images/5.png)](http://2.bp.blogspot.com/_iOO0fC4NKLE/SXFkllE8cSI/AAAAAAAAFSQ/SLH8suTVy24/s1600-h/Screenshot-Java+OpenStreetMap+-+Editor-4.png)

  
 如同上圖所示，你會發現這時候有一個照片在路徑上，點開來看是『稻香路』，但是我並沒有真的往稻香路去，只是拍個十字路口。這時我就會依照的我印象，先作一條分叉路出去。並且用第二個工具選擇路徑，按右邊的 Add 增加屬性。新手的話我建議你先填 name 跟 name:zh，這兩個分別代表英文路名跟中文路名。這是一條道路最基本的屬性。如下圖  
  

[![](images/6.png)](http://3.bp.blogspot.com/_iOO0fC4NKLE/SXFltjYlqKI/AAAAAAAAFSY/-xbStexFbrk/s1600-h/Screenshot-Java+OpenStreetMap+-+Editor-5.png)

  
當所有路名都填完後，就直接按下載的右邊上傳鈕就可以上傳囉！記得先去註冊一個 Open Street Map 帳號，等下禮拜你就可以看到你繪製的地圖出現在網站上囉！