---
slug: 2025-07-22_claude-acceptance-test
categories:
- tech
---

最近幾個月一直在使用 Cursor 與 Claude Code 進行開發，並且一直在推進邊界，看 LLM 輔助可以到達什麼程度。覺得在這個過程裡面，也遇到大家經常遇到的問題：
- 寫得很快，但時好時壞。好的時候很驚訝，壞的時候也很驚訝
- 需求不夠清楚時，它會自行補足細節，而這些細節不見得是我要的

經過各種嘗試之後，從一個軟體開發者的角度，我找到了適合自己與 LLM 的工作方法，也就是回歸到驗收測試。

經過這麼長時間的協同工作後，我發現跟 LLM 合作與跟工程師合作有許多相似之處，當需求越明確，討論得越多，我們通常可以產生更符合預期的產出。

而需求要如何才能明確，就讓我想到剛入行時學習的一套框架 Cucumber 以及其語法 Gherkin。Cucumber 是一套 Behavior-driven development (BDD) 工具，他透過撰寫人類與機器皆可閱讀的文件作為驗收條件。比如說我們如果要開發一個 Todo 軟體，其中一個規格就是要可以按下 Enter 來送出待辦事項，使用 Gherkin 語法就可以這麼敘述：

```gherkin
  Scenario: Add todo item
    When I enter "Buy milk" in the input field
    And I press the Enter key
    Then I should see "Buy milk" in the list
    And the input field should be cleared
```

但他要怎麼轉化成可自動執行的測試呢？通常要寫一段 glue code 來將規格銜接到測試邏輯：

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Assume we have a page object to manipulate the browser
let page;

When('I enter {string} in the input field', async function (text) {
  // Find the input field and enter text
  const inputField = await page.locator('input[type="text"]');
  await inputField.fill(text);
});

When('I press the Enter key', async function () {
  // Press Enter key in the input field
  const inputField = await page.locator('input[type="text"]');
  await inputField.press('Enter');
});

Then('I should see {string} in the list', async function (expectedText) {
  // Verify that the todo item appears in the list
  const todoItems = await page.locator('.todo-item');
  const itemTexts = await todoItems.allTextContents();
  expect(itemTexts).toContain(expectedText);
});

Then('the input field should be cleared', async function () {
  // Verify that the input field is cleared
  const inputField = await page.locator('input[type="text"]');
  const value = await inputField.inputValue();
  expect(value).toBe('');
});
```

以前我在幾個 side project 使用過 Cucumber，但是後來從來沒在 Production 的專案裡面用過，主要還是要導入這樣的機制並不容易，通常團隊可以接受 TDD 的就已經很少見了，更別說要從規格銜接到自動化測試。

另外也跟我經常是在新創團隊工作有關，通常新創團隊不會有那麼長的時間可以實踐規格到測試的週期規劃。

但到了 LLM 進行軟體開發的年代，我發現這個遠古時學習的工具又可以拿出來用了。在 Cursor 或是 Claude Code 裡面，由於有  Model Context Protocol (MCP) 的關係，我們可以直接讓 Claude Code 來操作瀏覽器來輔助開發，甚至也可以操作 Android 或是 iOS 模擬器，這也代表我們可以告訴他預期的行為是怎樣後，我們就可以透過 MCP 來讓 Claude 自行確認他的開發成果是否可以通過驗收。

而 Gherkin 語法就可以當作一個很好的橋樑，他是一個標準語法可以讓人類與 LLM 都可以讀懂，所以我們就可以在開發前透過這份規格來確認實作內容，而在開發完成之後可以讓 LLM 執行閱讀這份規格，並且使用 MCP 操作瀏覽器、手機來進行驗收，詳細的展示可以看點選到下面的 Youtube 影片觀看。

!youtube[WvGY_Jcm_kY]


這樣除了可以拿來跟 LLM 溝通以外，當它發現不符合驗收條件時，也可以觀察並且修改實作。

## BDD + TDD
當我自己在開發 production 專案時，我現在也嘗試著使用 BDD 加上 TDD。當我們使用 BDD 時，就可以很好的確定開發規格以及驗收標準，但是另外一個是 LLM 開發現在很經常遇到的狀況，就是 LLM 寫得太快了，當一次產出的內容大過我的認知負擔後，我就會經不起誘惑，直接按下 **確定**，但很常又會因此出問題。

為了解決這樣的認知負荷，我最近都在測試 BDD + TDD。BDD 的部分跟前面敘述的一樣使用 Gherkin 作為驗收標準。但我會請 LLM 開發每一個元件時，遵守以下的順序：

1. 先寫介面 (Interface)、空類別或是空函式，並且拋出未實作的錯誤如 `throw new Error('not implemented yet')`
2. 請它**只寫測試敘述**，也就是自動化測試的 `describe('敘述')` 與 `it('敘述')`，並且讓我檢查，不要實作任何測試邏輯
3. 接下來我會知道它想要寫大概到什麼程度的測試，並且直接在這個階段跟他溝通測試的顆粒細度，通常我都會大砍測試項目，因為一般來說它會寫得太細
4. 確認測試項目之後，再請他寫測試邏輯
5. 跑測試，這個時候應該新增測試都要是錯誤的（紅燈階段）
6. 請它開始實作，並且在實作完後跑測試，理論上我們寫的測試最後要全部通過（綠燈階段）

在這樣的開發流程下，就可以確保每個階段的產出都在我的認知負荷內，我可以很好的確認它的產出，然後有明確的「什麼是對的」之後，跟 BDD 流程相同，在有明確的完成條件下它可以做得很好。

如果你對這樣的開發流程有興趣，你可以參考我之前寫的 [yurenju/cursor-tdd-rules](https://github.com/yurenju/cursor-tdd-rules)，如果需要在 Claude Code 使用的話還需要稍微修改一下。

不過請記住這些都是還在發展的合作協同開發方式，現在工具跟使用技巧更新的很快，或許很快就不適用了。

Happy Coding!
