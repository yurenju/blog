---
title: The Door Opened by OpenClaw
---
![[openclaw-logo.png]]

"How is OpenClaw different from other AI bots?"

To answer this question, let me start with the first thing I asked it to help with: **finding coffee shops I'd like**.

I have very specific preferences when it comes to coffee, which means I'd have to click into every single coffee shop on Google Maps, checking whether their menu lists the coffee's origin, processing method, and so on before I could filter out the ones I'd actually enjoy. This has always been a real pain, and no other bot supported browsing store photos on Google Maps either.

So after setting up OpenClaw, my first question was about nearby coffee shops. My next question was whether it could look at the shop's interior photos or Google reviews. That's when its response got really interesting.

"Currently only returning basic information, no photos or review content."

"If you want, I can add photo and review functionality to this skill, but it'll take a bit of time to modify the code. Should I do it?"

My jaw literally dropped when I saw this reply. When I used ChatGPT or Gemini before, the room for customization was limited, and I'd never encountered a bot that could modify its own code to solve my problem. It was like watching it pick up a soldering iron, crack open its own mechanical chest, and rewire itself.

After discussing it with the bot, here's what it produced.

![[bernard-cafe-scout.png]]


Coming back to the question of "how OpenClaw differs from other AI bots," I'd say OpenClaw is like "having a software engineer as a partner, and giving them a computer." Beyond using the existing tools on the computer to solve problems, the most important thing is that it can **create and modify tools**. If its current tools can't view Google Maps images, it simply modifies the code to add that capability.

Most current AI chatbots primarily provide tools, and those tools need to be built by someone else before users can access specific services. OpenClaw, on the other hand, builds its own tools even when nobody has provided them. Even a tool like Claude Code, which can also build tools, is somewhat different — Claude Code's purpose is to collaboratively develop software with you.

OpenClaw's purpose in building tools is to solve your problems in a more general sense.

From there, I started tackling some of my other frustrations. For instance, I have a habit of reading news from various countries, but for reading speed, I usually have to find foreign news sites with Chinese versions — like The New York Times, Deutsche Welle, RFI, and so on. But with OpenClaw, I simply asked it to research which media outlets from different countries offer RSS feeds for their original-language news sites, then asked it to pick out stories I'd likely find interesting based on its understanding of me, translate them into Chinese, and produce an audio news briefing every morning. Now I can just listen to the news when I wake up.

I even added a rating system so it can use my feedback to improve its news selection next time 😁

![[bernard-daily-news.png]]

Of course, this brings us back to the elephant in the room. Is OpenClaw really that unsafe?

This is easy enough to imagine. Give a software engineer a computer (even without admin privileges) and consider what they could do and how dangerous that could be. Ask your engineer friends about the silly things that happen in engineering circles — accidentally deleting databases, messing up git, nuking the root directory, and so on. This bot is capable of doing all of those things (even though the model itself has many safety measures in place).

OpenClaw is roughly at that level of risk, plus the additional possibility of being hijacked through Prompt Injection to do other things. In my case, if someone injects malicious content into an RSS feed or comments, I'm not confident it can adequately defend against that kind of attack.

So I'd say the security concerns are quite serious, especially if you don't provide it with an isolated environment and instead run it on your own computer — that makes the security issues even greater.

But none of this can overshadow the fact that OpenClaw is an experiment brimming with creativity and fun. If you look at how Anthropic or OpenAI conduct experiments, they're relatively cautious, hoping to accomplish more within a controllable scope. OpenClaw takes the opposite approach: what if I give an AI bot a computer — how fun could that be?

It's like the dance of Shiva — the beginning of destruction, and also the moment of rebirth.
