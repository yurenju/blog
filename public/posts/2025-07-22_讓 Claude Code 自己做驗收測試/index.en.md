---
title: Making Claude Code Run Its Own Acceptance Tests
---

Over the past few months, I've been developing with Cursor and Claude Code, continuously pushing the boundaries to see what LLM assistance can achieve. Throughout this process, I've encountered common issues that many developers face:

- Development speed is fast, but quality varies. When it works well, it's surprisingly good; when it fails, it's equally surprising
- When requirements aren't clear enough, the LLM fills in details on its own, and these details aren't necessarily what I want
- The LLM writes too fast and generates too much code, causing cognitive overload for developers who can't help but accept everything when reviewing the content

After various experiments, from a software developer's perspective, I've found a working method that suits collaboration with LLMs: returning to acceptance testing. After this extended period of AI collaboration, I've discovered that working with LLMs shares many similarities with working with human engineers: the clearer the requirements and the more discussion, the more likely the output will meet expectations.

This made me recall the Cucumber framework and its Gherkin syntax that I learned early in my career. Cucumber is a Behavior-Driven Development (BDD) tool that uses human-readable and machine-readable documents as acceptance criteria. For example, if we're developing a Todo application, one specification would be the ability to submit a todo item by pressing Enter. Using Gherkin syntax, we can describe it like this:

```gherkin
  Scenario: Add todo item
    When I enter "Buy milk" in the input field
    And I press the Enter key
    Then I should see "Buy milk" in the list
    And the input field should be cleared
```

But how does this translate into executable tests? Typically, you need to write glue code to bridge the specification with the test logic:

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

I've used Cucumber in several side projects before, but never in production projects. The main reason is that introducing such a mechanism isn't easy. It's already rare for teams to accept TDD, let alone bridging specifications to automated testing.

It's also related to my frequent work in startup teams. Startups typically don't have the luxury of time to practice the cycle planning from specification to testing.

However, the biggest obstacle was writing glue code. Because it breaks down each sentence into separate actions, a single test scenario gets fragmented into many small pieces. Additionally, when writing Gherkin, you need to be very careful to write the same sentences identically for the same functionality, so they can be merged in the glue code. For example:

```gherkin
When I click the button "ok"
When I go to click the button "ok"
```

These would be split into two different test logic fragments. Remember, when doing the same thing, the descriptions must be exactly the same.

In short, using Cucumber was a novel and interesting experience, but various obstacles prevented me from using it in production projects.

However, things are different in the age of LLM-assisted software development, because LLMs can directly read specifications written in Gherkin and **execute them directly without needing glue code**.

Since LLMs can directly read and understand specifications, and through the Model Context Protocol (MCP), Cursor or Claude Code can directly operate browsers and mobile emulators to assist development. This means we can use Gherkin to describe the expected behavior, and the LLM can verify through MCP whether its development results pass acceptance testing.

Gherkin syntax serves as an excellent bridge. It's a standard syntax that both humans and LLMs can understand, so we can use this specification to confirm implementation details before development, and after development is complete, let the LLM read this specification and use MCP to operate browsers and mobile devices for acceptance testing. For a detailed demonstration, please watch the YouTube video below.

!youtube[WvGY_Jcm_kY]


This not only serves as a communication tool with LLMs, but when it discovers that acceptance conditions aren't met, it can also observe and modify the implementation.

If you're interested, you can try it yourself on GitHub: [yurenju/llm-bdd-coding-demo](https://github.com/yurenju/llm-bdd-coding-demo)

## BDD + TDD
BDD can reduce the problem of unexpected results through clearer specifications and acceptance criteria, but it cannot solve the **cognitive overload** problem for developers. Combining it with incremental TDD can alleviate this issue.

When using BDD, development specifications and acceptance criteria can be well defined, but another situation frequently encountered in LLM development is that the LLM writes too fast. When the amount of content generated at once exceeds my cognitive capacity, I can't resist the temptation to directly press **confirm**, but sometimes not looking carefully results in content that's not what I wanted.

To solve this cognitive load, I've recently been testing BDD + TDD. The BDD part uses Gherkin as acceptance criteria as described earlier. But I ask the LLM to break down components, and when developing each component, follow this sequence:

1. First write the interface, empty classes, or empty functions, and throw an unimplemented error like `throw new Error('not implemented yet')`
2. Ask it to **write only test descriptions**, meaning the automated test's `describe('description')` and `it('description')`, and let me review them without implementing any test logic
3. At this stage, I'll know roughly what level of testing it intends to write, and I can communicate directly about the granularity of tests. Usually, I significantly reduce the test items because generally, it writes too detailed
4. After confirming the test items, ask it to write the test logic
5. Run the tests. At this point, all newly added tests should fail (red phase)
6. Ask it to start implementing, and run tests after implementation. Theoretically, all the tests we wrote should pass (green phase)

Under this development flow, the output of each stage stays within my cognitive capacity, and I can properly review its output. Then, after having a clear understanding of "what is correct," like the BDD flow, it can perform well with clear completion conditions.

If you're interested in this type of development flow, you can refer to my previous work [yurenju/cursor-tdd-rules](https://github.com/yurenju/cursor-tdd-rules). If you need to use it with Claude Code, some modifications will be required.

However, please remember that these are still evolving collaborative development methods. Tools and usage techniques are updating very quickly, and they may soon become outdated.

The main purpose of using this development method is to reduce my own cognitive burden, allowing projects to remain under my control while using LLMs as much as possible to accomplish my goals. At the same time, by defining boundaries and goals, I can better communicate with the LLM about what my objectives actually are.

Through this process, I also feel that I become clearer about what I want from the early stages of development. The key to working with LLMs is similar to working with humans: more frequent communication and requirement confirmation.

So perhaps it's not that different from working with humans after all - it's about strengthening your communication skills.
