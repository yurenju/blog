---
title: 用 ASP.NET 2.0 製作檔案上傳 + MD5 驗證
date: '2006-06-29'
tags:
  - MS Windows
  - development
categories:
  - tech
---
像 ASP.NET 2.0 有這～～～～麼方便的開發工具 - Visual Web Developer (VWD)，無論如何都會讓人想到，只要把資料庫欄位設定一下， controls 拖出來，打幾行不是程式的程式，就可以完成這項功能。  
  
但很遺憾，事情並沒有那麼容易。  
  
情境：  
製作一個可以儲存 PDF 文件的資料表，並且使用 MD5sum 作為 table 的 primary key，並且有欄位專儲存名稱、出處、發表年份等資料。  
  
喔，這看起來不難，所以我就用 Boss 諭令指定的 VWD 開始寫。剛開始覺得很噁心，因為 SQL command 跟網頁都混在一起，厲害的是雖然 VWD 將網頁樣板放在一個檔案(aspx)，另抽出一個 Class 專門撰寫程式(cs)，但卻把 SQL Command 儲存在 aspx 檔案裡面！雖然很方便，但是以前沒這樣寫過，覺得真是噁心…。  
  
不過很快的就完成 Form 了，所以是有好壞啦。接著按下 run。填完資料按下確認。啥？ image 與 sql\_variant blah blah balh...，我從來沒有指定過這種資料型態阿？接著，我就跟 VWD 奮戰了一天…。  
  
看起來是內部處理的機制弄錯了，搞得不能直接拉拉元件就上傳。後來就先在 insert 資料前的 event handler ItemInserting 先插入資料，順便產生 MD5sum：  
`    FileUpload uploader = (FileUpload)FormView1.FindControl("FileUpload_paper_file");   byte[] imgBytes = uploader.FileBytes;   MD5 hasher = MD5.Create();   byte[] data = hasher.ComputeHash(imgBytes);   StringBuilder builder = new StringBuilder();      for (int i = 0; i < data.Length; i++)   {   builder.Append(data[i].ToString("x2"));   }   string md5sum = builder.ToString();      e.Values["md5sum"] = md5sum;   this.md5sum = md5sum;    `  
  
然後資料插入後，再用一個 event ItemInserted 傳上圖檔：  
`    string connStr = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["connectionString"].ConnectionString;   SqlConnection conn = new SqlConnection(connStr);   conn.Open();   SqlCommand cmd = new SqlCommand("UPDATE [paper] SET [paper_file] = @paper_file WHERE md5sum = @md5sum", conn);   SqlParameter parm = new SqlParameter("md5sum", this.md5sum);   cmd.Parameters.Add(parm);   parm = new SqlParameter("paper_file", imgBytes);   parm.SqlDbType = SqlDbType.Image;   cmd.Parameters.Add(parm);   cmd.ExecuteNonQuery();   conn.Close();    `  
  
這…真是繞了一大圈阿。  
  
**\[UPDATE\]**  
不好意思，繞了一大圈的是我。只要在插入資料後產生 MD5sum 即可。