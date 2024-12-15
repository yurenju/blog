---
title: "NestJS 實作 EIP-4361 Ethereum 帳號登入機制"
author: "Yuren Ju"
date: 2023-02-13T01:32:31.752Z
lastmod: 2023-06-06T13:45:14+08:00
categories: [tech]

description: ""

subtitle: "Sign-in with Ethereum (SIWE) 是一個透過 Ethereum 的密碼學基礎建設作為登入的憑證，這樣既可以把擁有帳號的權力控制在自己手上，同時又可以取得單一登入方式的便利性。本文將會簡介 SIWE 以及如何使用 NestJS 整合之。"

images:
  - "/posts/2023-02-13_nestjs-實作-eip4361-ethereum-帳號登入機制/images/1.png"
  - "/posts/2023-02-13_nestjs-實作-eip4361-ethereum-帳號登入機制/images/2.png"
  - "/posts/2023-02-13_nestjs-實作-eip4361-ethereum-帳號登入機制/images/3.png"
---

帳號註冊與登入以前大多都是透過電子信箱與密碼註冊，而近幾年來則逐漸被如 Google, Facebook 這樣的帳號提供商取代，使用者會想使用第三方登入無非就是因為可以只記住單一密碼的便利性而採用。

不過近來 Facebook 無端的停用使用者帳號（我也是個受害者），導致透過 FB 帳號註冊的網站帳號都一併無法使用。這樣的情況也會讓人重新思考把擁有、管理帳號的權力交給一個大企業是否合宜，而又有哪些其他解決方案可以保持管理帳號的便利性與不被其他人箝制權力之間取得一個平衡。

Sign-in with Ethereum (SIWE) 是一個透過 Ethereum 區塊鏈基礎建設的角度思考的解決方案。由於在 Ethereum 上面每個使用者都會擁有自己的公私鑰來管理資產、執行交易，如果可以直接使用這把鑰匙來作為登入的憑證，只要使用者證明自己是一個 Ethereum 帳號的持有者就可以進行註冊與登入，這樣既可以把擁有帳號的權力控制在自己手上，同時又可以取得單一登入方式的便利性。

以下將會介紹 SIWE 的基礎原理以及如何透過 NestJS 來讓後端應用程序整合 SIWE 登入機制。NestJS 是一套相當強大的後端應用程序框架，有興趣學習的可以參閱 [NestJS 官方文件](https://docs.nestjs.com/)。

### EIP-4361 SIWE

Ethereum Foundation 與 ENS (Ethereum Naming Service) 提案了 [EIP-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361) 作為採用 Ethereum 基礎建設的登入機制，需要透過 Ethereum 登入的服務，只要請求使用者簽署一個結構化的純文字訊息即可登入：

```
${domain} wants you to sign in with your Ethereum account:
${address}

${statement}

URI: ${uri}
Version: ${version}
Chain ID: ${chain-id}
Nonce: ${nonce}
Issued At: ${issued-at}
```

當使用者簽章傳回後，只需要檢查傳來的訊息以及簽章是否確實由特定 Ethereum 帳號所簽署就可以確認登入操作是否合法，由於只有簽署者擁有該私鑰才有可能簽署出對應的簽章資訊，所以用這個方法就可以實作登入機制。

而整個流程當中比較重要的是 `nonce` 欄位，由於簽署後的訊息如果被中間人攔截之後就可以再次登入該服務，為了避免這樣的重送攻擊，請求登入的服務會需要實作一個額外的端點取得 `nonce` 亂數字串並且紀錄在系統當中，當使用者簽署登入訊息時就像上面的範例訊息一樣要把 `nonce` 附在其中，在使用者登入後把這個 `nonce` 標記成已使用或是刪除，如此一來這個簽署後的訊息就不能再次拿來登入使用。

![image](/posts/2023-02-13_nestjs-實作-eip4361-ethereum-帳號登入機制/images/1.png#layoutTextWidth)

上面的流程圖當中 Attacker 即使拿到了使用者原本拿來登入的訊息，因為原本的那個 `nonce` 已經被系統刪除，所以即使取得原始訊息也無法再次拿來登入網站。

所以如果要在一個服務實作 SIWE 登入，我們會需要實作這兩個路由端點：`/challenge` 與 `/login`，以下使用 NestJS 作為實作範例。

### 實作概觀

NestJS 是一個 Node.js 與 TypeScript 的後端框架解決方案，它提供了 Dependency Injection (DI) 的生命週期管理方式，同時提供許多後端應用程序經常會需要用到的工具如 Guard 作為權限檢查、裝飾子 (Decorators) 來自訂不同功能。

對我來說最重要的功能是他的 DI 容器讓撰寫測試時模擬 (Mocking) 相依性變得非常直覺好用，讓測試好寫不少。

NestJS 也提供了與 Passport 驗證框架的整合。Passport 是一個專門用於登錄驗證的框架，提供相對簡單的介面接口讓開發者實作不同的登入機制（Passport 把每個登入機制稱之為策略 Strategy）。從最簡單的帳號密碼登入、JWT 支援、Google 帳號登入都已經支援。而 SIWE 登入策略也由 Passport 的主要開發者 Jared Hanson 撰寫完畢，只需要透過 `@nestjs/passport` 就可以把該策略整合到 NestJS 撰寫的應用程序當中。

接下來我們會實作一個簡易的 NestJS SIWE 登入機制範例，透過整合 Passport 以及 `passport-ethereum-siwe` 套件的的策略來達成。

### NestJS 實作

NestJS 提供了 `@nestjs/passport` 套件將 passport 策略整合入 NestJS 後端應用程序裡面。要引入一個 Passport 的策略，首先需要建立一個繼承自 `PassportStrategy` 類別。

比如說要整合 `passport-google-oidc` 來實現 Google 帳號登入會需要建立一個 `GoogleStrategy` 類別繼承自 `PassportStrategy` 並且指定採用 `passport-google-oidc` 策略，整體運作的流程圖如下：

![image](/posts/2023-02-13_nestjs-實作-eip4361-ethereum-帳號登入機制/images/2.png#layoutTextWidth)

當使用者發出請求到 `/login` 端點後 NestJS 就會觸發 `passport-google-oidc` 的 `authenticate()` 函式並且開始進行 Google 帳號認證，當完成後會重導到原本網站的 `/redirect`。

而 `GoogleStrategy`僅是一個非常輕量的類別，主要的用途是提供一個 callback function `validate()`，讓 `passport-google-oidc` 在登入成功後重導使用者到 `/redirect` 時把資訊帶回的 callback，裡面會帶回 issuer 以及 profile 兩樣資訊。

在 Controller 端也只要使用 `@UseGuard()` 裝飾子與 `@nestjs/passport` 提供的 `AuthGuard()` 就可以在 `/login` 與 `/redirect`整端點合 Google 帳號登入，整體概念程式碼約略如下：

```typescript
// google.strategy.ts
import { Strategy } from 'passport-google-oidc';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {

  async validate(issuer, profile): Promise<any> {
    return {profile}
  }
}

// auth.controller.ts
@Controller('auth')
export class AuthController {

  @Get('login')
  @UseGuards(AuthGuard('google'))
  login(@Req() req) {
    return req.user;
  }

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  @Redirect('/')
  redirect() {}
}
```

要整合 SIWE 也是非常類似的方式，不同之處在於我們會需要在一個 Nonce Store 裡面產生與儲存亂數字串，並且於登入時檢查該亂數是否由系統發出並且使用完畢後刪除，避免攻擊者的重用攻擊：

![image](/posts/2023-02-13_nestjs-實作-eip4361-ethereum-帳號登入機制/images/3.png#layoutTextWidth)

跟 `GoogleStrategy` 一樣我們會先需要實作一個 `EthereumStrategy`，並且在建構子內宣告 `SessionNonceStore` 作為 nonce store 用途，另外新增一個 `challenge()` 準備來承接 `/challenge` POST 端點傳遞過來的 request 物件，並且透過 `store.challenge()` 新增一筆 nonce 亂數字串回傳給 `/challenge` 端點。

至於 `validate()` 函式會在 `passport-ethereum-siwe` 驗證登入訊息成功後作為 callback 函式被呼叫到，其中包含 `address` 資訊。

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, SessionNonceStore } from 'passport-ethereum-siwe';

@Injectable()
export class EthereumStrategy extends PassportStrategy(Strategy) {
  private store;

  constructor() {
    const store = new SessionNonceStore();
    super({ store });
    this.store = store;
  }

  async validate(address: string): Promise<any> {
    return { address };
  }

  challenge(req: Request) {
    return new Promise((resolve, reject) => {
      this.store.challenge(req, (err, nonce) => {
        if (err) {
          return reject(err);
        } else {
          return resolve({ nonce });
        }
      });
    });
  }
}

```

接下來在 Controller 上面把 `/challenge` 以及 `/login` 兩個 POST 端點加入即可：

```typescript
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EthereumStrategy } from './ethereum.strategy';

@Controller('auth')
export class AuthController {
  constructor(private ethereumStrategy: EthereumStrategy) {}

  @Post('login')
  @UseGuards(AuthGuard('ethereum'))
  login(@Req() req) {
    return req.user;
  }

  @Post('challenge')
  challenge(@Req() req: Request) {
    return this.ethereumStrategy.challenge(req);
  }
}

```

在前端實作上需要先透過 `/challenge` 取得 nonce 亂數字串，接著透過 `siwe` 套件建構出符合 EIP-4361 標準的結構化訊息，再透過 Wallet Provider 如 MetaMask 提供的 `personal_sign` 簽名，最後送出 POST 請求到 `/login` 端點就可以完成登入。

```javascript
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';

async function login() {
  const options = { method: 'POST' };
  const url = '/api/auth/challenge';
  const { nonce } = await fetch(url, options).then((res) => res.json());
  const address = ethers.utils.getAddress(account);
  const rawMessage = new SiweMessage({
    domain: window.location.host,
    address: address,
    statement: 'Sign in with Ethereum to the app.',
    uri: window.location.origin,
    version: '1',
    chainId: '1',
    nonce,
  });

  const message = rawMessage.prepareMessage();
  const signature = await ethereum.request({
    method: 'personal_sign',
    params: [message, address],
  });

  const result = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ message, signature }),
  }).then((res) => res.json());

  console.log(result);
}
```

完整的源碼可以在 Github 的 [@yurenju/nestjs-siwe-example](https://github.com/yurenju/nestjs-siwe-example) 找到。

### 結論

以上就是採用 NestJS 實作的最小化 SIWE 整合方式，實際上開發的時候還會需要考慮更多的事情，比如說第一次登入成功後會需要用資料庫建立一筆帳號資訊；或是登入後會需要結合 JWT 在後續的標頭上保持登入狀態，這些建構流程可以參考 [NestJS 登入驗證的文件](https://docs.nestjs.com/security/authentication) 以及 `passport-ethereum-siwe` 的 [README](https://github.com/jaredhanson/passport-ethereum)。

從一個 Ethereum 使用者的觀點來看，任何非操作鏈上資產的服務採用 SIWE 是再合理不過的方式，比如說 [snapshot](https://snapshot.org/) 的投票或是 [zapper](https://zapper.xyz/) 的資產管理服務，使用 Ethereum 帳號已經是使用區塊鏈應用的日常，既能達到原本集中式帳戶管理所需要的便利性，同時又可以將帳戶的管理權力操控在自己手中，而非可以隨時無端停用使用者帳號的大企業。

但從一個沒接觸過區塊鏈的使用者來看，這還存在著海溝一般深的隔閡。建立一個 Ethereum 帳號可能會需要 MetaMask 這類型的瀏覽器擴充套件或是獨立的錢包 app 才能達到，更別說還要注意 Network ID 以及各種安全問題，種種的障礙還不如使用像是 1Password 這樣的密碼管理軟體。

相對來說，如何讓一般的使用者可以兼具安全、去中心化的方式輕鬆的使用 Ethereum 區塊鏈會是一個更重要的課題，當更多使用者都認為擁有 Ethereum 帳號、使用錢包處理資產是家常便飯時，SIWE 能帶來的便利性才能更好的發揮在每一個使用者身上。

當然，如果一個針對區塊鏈使用者的鏈下服務，採用 SIWE 作為登入機制幾乎是不用思考的選擇了 😎
