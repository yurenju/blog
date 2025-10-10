---
title: Trading Tokens Directly Within Claude Desktop
---

Conversational AI tools initially had no access to external information, but gradually began to integrate external tools such as search functionality. However, "search" is a broad and expansive feature. For specific functions like checking the weather or querying stock prices, while web search can accomplish these tasks, it still falls short compared to directly integrating new weather or stock market features through APIs.

Looking at the broader picture, there are countless services on the internet, making it impossible to connect them all through APIs. Moreover, some tools are not in HTTP API format but are only available on local computers. For example, when programming, it would be ideal for an editor to access precise browser screens, structures, and developer debugging information, which cannot be connected through HTTP APIs.

MCP is an open standard designed to help AI understand how to utilize tools. For instance, if you want assistance with task management, you can use an Asana MCP to connect to a task management service via API, enabling it to help plan entire projects, create necessary data, and even manage task dependencies.

The browser-assisted development mentioned earlier can also be achieved through [mcp-playwright](https://github.com/executeautomation/mcp-playwright), which allows browser manipulation, direct console reading for error detection, and automatic correction.

I happened to have a work-related task that required researching related matters, so I experimented with writing a Uniswap MCP using Protocolink and Moralis, allowing direct trading within Claude Desktop.

![[uniswap-mcp.png]]

You can watch the demonstration at [this YouTube link](https://www.youtube.com/watch?v=7fRmwQYaBLg).

After completing this, it made me reflect on the development of messaging apps over the past decade. Initially, LINE MINI App and Telegram Mini Apps became popular, but later most functionality was redirected to external web pages, with only small, simple UI elements embedded within messaging conversations. I would take the same approach, as implementing on external sites is simpler—only the most essential user authentication needs to be handled within LINE.

A few months ago, when I saw Vercel's AI SDK 3.0, it was a moment when I realized that future software user interfaces might be very different. Their announcement included a tool that could generate a weather display interface directly after querying the weather.

![[vercel-ai-sdk.png]]

I initially thought it was completely dynamic UI generation, but after carefully reading the documentation, I found that you still need to [predefine UI components](https://sdk.vercel.ai/docs/ai-sdk-ui/generative-user-interfaces#create-ui-components).

Even if they haven't achieved that yet, it opened up a space for imagination: What if UI components could dynamically assemble appropriate UI interfaces based on the context of received data? What if future user interactions are completely different from today? Will it be voice conversations followed by completely dynamic generation of suitable user interfaces?

What kind of impact will this have on our industry?

I think projecting or imagining the future is an interesting endeavor. The future appears chaotic yet interesting, but I hope the interesting aspects outweigh the chaos.

## Postscript
This uniswap-mcp was written solely for research purposes, and 99% of the code was written by Cursor. We all know that we shouldn't pass private keys into programs through environment variables, but for those who are still curious, here's the source code. Please only use it for testing and research purposes, and don't put too much money into it.

- [https://github.com/yurenju/uniswap-mcp](https://github.com/yurenju/uniswap-mcp)
