---
title: Asked AI to Write Code, But It Can't Understand Me?
---

Recently, one of the sub-projects in our company's new project experimented with a new development approach: attempting to write most of the code using AI (Cursor), minimizing human intervention as much as possible, hoping to understand the future software development model through small-scale experimentation.

We also hoped that with AI's assistance, we could significantly shorten the development cycle:

![[reduce-development-cycle.png]]

If you've tried this on a slightly larger project, you can probably guess what our initial results were like:

![[expected-and-actual.png]]

Whenever we wanted AI to do a bit more, it often couldn't follow our expectations. Most work that can be completed in one go is usually simple, clear, and unambiguous tasks—these are usually done well.

Of course, we won't stop using AI for development because of this. For me personally, over 80-90% of the code is now developed using AI, with extensive use of conversational development. Since AI has deep software development capabilities, I can seriously act as a supervisor, ensuring that its work is completed as expected.

But how do we reach this level? Before actually introducing AI to a project, we need to reflect on how we usually develop software projects within the team.

## Traditional Software Development Discussions

In traditional software development processes, teams often conduct strategic discussions from a product perspective, and then the engineering team discusses technical solutions. After meetings and documentation, once consensus is reached, the product is gradually developed through iterative development.

What's important in the software development process is the team's **consensus** and **context**. When we expect AI to create the ideal system in our minds based on just a few words, relying on the common sense of software engineers it has learned, what's missing is conveying the most important consensus and context to it.

Because it's not a mind reader—it won't know this context from just a few short conversations.

Teams can build consensus and clarify context through meetings and documentation. So how do we provide such information to AI? There are several things we can try.

## Use Rules to Define Direction
![[rule-for-right-track.png]]

In Cursor, you can define rules. Although writing quality rules still requires a lot of time to consider and refine, rules can set a general direction for AI and bring its working style closer to the team's.

For example, should we write tests? To what extent? What kind of git commit messages do we prefer? What are the component writing conventions, naming rules, and technology stack to adopt? Without communicating these, it will often do as it pleases, like a software engineer who just joined the team and hasn't yet adapted to the development culture.

## Break Down Specs and Progress Step by Step
![[rules-specs-impl.png]]

Write a feature specification before implementation (of course, have it write it). Fully read and discuss the spec first, ensure what it wants to do is the same as what you want to do, then ask it to implement.

![[rule-spec-workflow.png]]

You don't have to write all the feature specs yourself. In our case, usually after creating a task in a project management service (like Asana), I tell it what I know this task should do, and ask it to write the spec. Then we discuss and update the spec it produced, and after completing the spec, open a new Chat Context and ask it to implement according to the spec.

If you feel the spec isn't written well, then revise the rule that generates the spec so that the team can generate better documentation quality when creating specs in the future.

The length of specs will vary depending on team habits, but shorter ones are easier to read and make it easier to develop according to our intentions. This helps us better achieve our goals.

![[feature-specs.png]]

As mentioned earlier, without context or consensus, it's very difficult to make the product we want. Besides establishing context and consensus through Rules, another way to avoid this problem is to set the goal first, but don't write all the specs at once—only write the spec for the feature you're about to complete.

Since we'll correct the direction it wants to go based on the spec it writes, each time we write and implement a spec, we can correct deviations. This allows the project to move from idea to actual product in the expected direction.

## Specs Should Have Acceptance Criteria
The content of specs will vary with each team, but I recommend having Acceptance Criteria. These acceptance criteria explicitly tell AI what counts as done. Such clear conditions can help AI more concretely know to what extent it needs to complete something.

There are many ways to define acceptance criteria. From an engineer's perspective, automated tests or checks can be substituted, such as unit tests or integration tests. Also, if you're developing a web application, you can use [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) to have AI open a browser to see what the current result is, and verify by directly operating the webpage.

When it can better judge the current results, it becomes easier to determine completion and take subsequent actions.

If automated verification isn't possible, you can also ask it to list manual testing methods, verify them yourself, and then tell it the results. Of course, it would be better if it can verify and fix itself.

## So Far…
We're also still trying out this development model, and there are many things that need adjustment in this process. Currently, we feel the rules -> spec -> implementation workflow works reasonably well. When writing specs, there's an opportunity to discuss with AI and update the plan, so before starting work, we can adjust it to the form we want to complete.

However, we've also encountered the problem that Cursor isn't very good at following rules. Over time, these issues should gradually be fixed, or better practices will accumulate. But until that day comes, we'll likely need to frequently modify rules. Currently, we feel that rules that are too long tend to be forgotten, and clear and short ones work better. Also, the description of rules is important because it affects when AI wants to apply specific rules.

Also, recently many people have been talking about Vibe Coding, which is developing through conversation in an almost intuitive way, not caring much about implementation details.

But actually, a large part of what's called "intuition" is that you already have deep background knowledge and experience in a domain, which allows you to seemingly effortlessly complete things using "intuition." In reality, not everyone can do this, and it also involves expressive ability.

To reach this level, you still need to see whether the person operating has sufficiently deep insights into the product domain and possesses sufficiently refined and clear expressive ability.

I think everyone should approach from their own perspective, seeing what method suits them for collaborating with AI to develop software projects. As a software engineer and a curious person, plus having accumulated certain expressive abilities from years of writing, I adopt methods suitable for me to collaborate with AI—more precisely describing my needs, dividing work, setting acceptance criteria and software development preferences, and even using automated testing methods to enable AI to do better.

I just start from my own perspective, understanding what I like and what I'm good at, then customize the workflow with AI. In this interaction, I discovered that compared to writing code, I prefer building products. Interacting with AI gives me the opportunity to separate these two things more clearly and understand myself better.

And everyone is different. My advice is to look back and examine what you like and what you're good at, then find a suitable way to collaborate with AI. There's no shortcut to understanding yourself—everyone just has to spend a lot of time exploring.

Even if your interest is writing code yourself and this process brings you happiness, then perhaps not using AI is best for you. In [Naoki Urasawa's interview](https://www.youtube.com/watch?v=pVr3sEeus6E&t=1245s), he mentions his view on AI art, saying: "Because I think drawing is very enjoyable, for someone like me who can find joy in work, wouldn't it be a waste to leave it to AI?"

What the masses are pursuing isn't necessarily what's right for you. You still need to look back and understand what kind of person you are, what you're passionate about, and take the next step from your own perspective.

It's okay if AI can't understand what you're saying. Understanding yourself is more important.
