---
title: ReactiveUI 概念篇
date: '2012-08-01'
tags:
  - .NET
  - C#
  - reactiveui
  - WPF
categories:
  - tech
---
ReactiveUI 解決了我兩個問題，一個是把 App 中可以測試的部分擴大，二是解決 UI/Thread 糾結的問題。  
  
你怎麼測試你的 app 的呢？底層我們當然可以透過 unit test 的方式進行，但是通常來說 UI 上面的東西都是比較難以測試的。通常我們會透過自動化 UI 的測試如 Sikuli 測試。但是這樣自動化 UI 常常會跟畫面綁定造成常會因為畫面變更而需要重新製作測試的 script。至於 MVC 裡面 Controller 的部分常因為跟 Event 綁定造成 Controller 其實是很難以測試的。ReactiveUI 是一種 MVVM (Model View ViewModel) 的 framework，其中由 ViewModel 取代 Controller 達到連 ViewModel 這個部份都可以測試，原因在後面讓我娓娓道來。  
  
另外，我們這邊討論的 MVVM 只限於 ReactiveUI，我並沒有用過其他的 MVVM Framework。  
  

### MVC v.s. MVVM

  

MVC (Model-View-Controll) 是大家現在非常常用的 pattern，基本上就是把資料 (Model)、UI (View)、邏輯 (Controller) 分開來。在 Android 或一般的 WPF 裡面，我們會把事件處理也放在 Controller 裡面，Controller 可以作為聯繫 View 與 Model 的橋梁處理各式各樣的事情。所以 Controller 處理了邏輯跟事件。那 Controller 有辦法獨立進行測試嗎？這只有在你把邏輯與事件處理拆開後才有辦法單獨針對邏輯測試。

  

MVVM 是有別於 MVC 的另外一種設計方式，架構如下：

  

[![](images/0.png)](http://4.bp.blogspot.com/-6E7bBFIPw1c/UBcWbbSfpFI/AAAAAAAARLE/41qOIwl8ooA/s1600/mvvm-reactiveui.png)

  

  

你可以能會說，這架構只是把 Controller 換成 ViewModel 而已，感覺不出來什麼差別阿？但其實不是的，ViewModel 反映了 View 裡面的資料。ReactiveUI 裡面的 ViewModel 包含了兩個重要的東西：**屬性與命令**

  

我用下面這個 Mockup 舉例，這是一個可以選擇要把內容發布到不同 Social Network 的小程式，左邊的 100x100 是自己的大頭照 Avatar。右上角的輸入框是要發布的內容，下面的下拉選單是要發布到哪裡的選項。

  

[![](http://3.bp.blogspot.com/-MUvyjwGTPe0/UBjPzMevM8I/AAAAAAAARQE/1I-hRoCH1ys/s1600/hello.png)](images/1.png)

  

在 View 裡面的每個需要資料的元件，指定要跟 ViewModel 裡面的哪個**屬性**綁定，如同上面的例子，View 裡面要指定：

1.  圖片的 Source 位置 => AvatarSource
2.  輸入框的文字 => ContentText
3.  下拉式選單的選項 => SocialNetworks \["Facebook", "Twitter", "Google+"\]
4.  下拉式選單選擇的項目 => SelectedSocialNetwork

ViewModel 與 View 的互動是雙向的，比如說 (1) 我在輸入框裡面打了 "I saw The Dark Knight Rises today!"，這個時候 ViewModel 裡面的 ContentText 就會更新成新的文字敘述。(2) 當我點擊下拉選單，把要發表的 Social Network 從 Facebook 改成 Twitter 後，ViewModel 裡面的 SelectedSocialNetwork 也會被修改成新的數值。從另一個方向來看，(3) 如果我在程式裡面修改了 AvatarSource 的網址，這個時候 View 裡面的圖片就會自動更新。所以兩個方向的更新都是可以的。  
  

[![](http://4.bp.blogspot.com/-f6UtGUst598/UBpYV2LeNgI/AAAAAAAARQU/WKEoSZ7gWxI/s1600/hello2.png)](images/2.png)

  

  

至於命令 (Command) 則是獨立於 View Event 的部分。在上面這個例子裡面，按下 PostButton  之後就會執行 PostCommand。由於在 Command 裡面需要的東西，如要發表到哪個 Social Network，要發表的內容都已經綁定到 ViewModel 裡面的屬性了，所以不需要跟 View 互動，只要直接取用屬性及可，我們可以用簡單的虛擬碼表示：

  

PostCommand.Subscribe( \_ => SendToSocialNetwork (SelectedSocialNetwork, Content))

  

由於屬性與命令都已經 Mapping 到了 ViewModel 了。這下子 ViewModel 的部分就可以被拿出來獨立測試。如同下面的虛擬碼：

  

Test {

    var ViewModel = new ViewModel()

    ViewModel.SocialNetworks.AddRange("Facebook", "Twitter", "Google+")

    ViewModel.ContentText = "Test Content"

    ViewModel.PostCommand.Execute()

}

  
如此一來 ViewModel 就可以測試了，而且架構非常乾淨！  
  
而 ReactiveUI 裡面包含了 ReactiveCommand 與 ReactiveAsyncCommand，當你要處理非同步事件只要用 ReactiveAsyncCommand 即可。  
  
這樣的架構是不是很乾淨呢？下次再來講 ReactiveUI 實際上要怎麼使用。  
  
等不及的人，這邊是 [ReactiveUI 的官網](http://www.reactiveui.net/)。