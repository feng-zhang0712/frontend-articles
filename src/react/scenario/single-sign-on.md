## 单点登录

单点登录（Single Sign-On，简称 SSO）是一种身份验证方式，允许用户使用一个账户登录多个独立的软件系统。SSO 的目标是简化用户管理和提高用户体验，同时确保系统的安全性。

### 一、单点登录（SSO）的原理

#### 1. 核心概念
单点登录的核心概念是用户只需进行一次身份验证，就可以访问多个相关但独立的系统或应用程序。SSO 通过集中管理用户身份，并在各个系统之间共享认证状态，实现无缝登录体验。

#### 2. 原理
SSO 的工作原理通常涉及以下步骤：
1. **用户请求访问应用 A**：用户尝试访问受保护的资源。
2. **应用 A 检查用户身份**：应用 A 检查用户是否已登录，若未登录，将用户重定向到 SSO 服务器。
3. **用户在 SSO 服务器上登录**：用户在 SSO 服务器上进行身份验证（如输入用户名和密码）。
4. **SSO 服务器生成令牌**：验证成功后，SSO 服务器生成一个令牌（Token），并将其发送回应用 A。
5. **应用 A 验证令牌**：应用 A 验证令牌的有效性，并创建本地会话。
6. **用户访问其他应用 B**：用户尝试访问应用 B，应用 B 重定向到 SSO 服务器验证令牌。
7. **SSO 服务器确认身份**：SSO 服务器确认令牌有效，应用 B 创建本地会话。

### 二、单点登录的实现方式

#### 1. 基于 Cookie 的 SSO
- **共享域名**：多个子域名共享一个顶级域名（如 `example.com`），通过共享 Cookie 实现 SSO。
- **实现**：
    1. 在用户登录时，SSO 服务器设置顶级域名的 Cookie。
    2. 各个子域名应用检查顶级域名的 Cookie 实现 SSO。

#### 2. 基于 SAML 的 SSO
- **SAML (Security Assertion Markup Language)**：是一种基于 XML 的开放标准，用于在身份提供者（IdP）和服务提供者（SP）之间传递认证信息。
- **实现**：
    1. 用户访问 SP 资源，SP 将用户重定向到 IdP。
    2. 用户在 IdP 进行身份验证，IdP 生成 SAML 断言（Assertion）。
    3. SP 验证 SAML 断言，创建会话并允许访问资源。

#### 3. 基于 OAuth 和 OpenID Connect 的 SSO
- **OAuth 2.0**：一种授权框架，允许用户授权第三方应用访问其资源，而无需暴露凭据。
- **OpenID Connect**：基于 OAuth 2.0 的身份层，用于验证用户身份。
- **实现**：
    1. 用户访问客户端应用，客户端将用户重定向到授权服务器（AS）。
    2. 用户在 AS 进行身份验证，AS 返回授权码（Authorization Code）。
    3. 客户端使用授权码向 AS 请求访问令牌和 ID 令牌。
    4. 客户端验证 ID 令牌，创建会话并允许访问资源。

### 三、单点登录的安全性

#### 1. 安全性挑战
- **单点故障**：SSO 服务器的不可用或被攻击将影响所有依赖 SSO 的应用。
- **令牌泄露**：令牌在传输和存储过程中可能被截获或泄露。
- **重放攻击**：攻击者可能重放已使用的令牌，获取未授权访问。

#### 2. 安全性防护措施
- **使用 HTTPS**：确保令牌和敏感数据在传输过程中加密。
- **短时令牌**：使用短时有效的令牌，减少令牌泄露的风险。
- **令牌存储**：在客户端使用 HttpOnly 和 Secure 属性存储令牌，防止 JavaScript 访问和跨站请求伪造（CSRF）。
- **令牌签名和加密**：使用签名和加密技术保护令牌的完整性和保密性。
- **多因素认证（MFA）**：增加额外的认证因素，提高安全性。
- **日志和监控**：记录登录和令牌使用的日志，监控异常行为。

### 四、单点登录的应用场景

#### 1. 企业内部系统
- 企业内部有多个信息系统（如 ERP、CRM、OA），使用 SSO 实现用户的统一登录和管理。

#### 2. 云服务集成
- 提供云服务的企业，通过 SSO 统一管理用户访问多个云服务平台。

#### 3. 联合登录
- 网站或应用允许用户使用社交账号（如 Google、Facebook）进行登录，通过 OAuth 或 OpenID Connect 实现 SSO。

### 五、单点登录的示例实现

#### 1. 基于 OAuth 2.0 和 OpenID Connect 的 SSO 示例

##### a. 安装依赖
```sh
npm install express express-session passport passport-openidconnect
```

##### b. 配置 Passport.js
```javascript
// index.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;

passport.use(new OpenIDConnectStrategy({
    issuer: 'https://example.com',
    clientID: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    authorizationURL: 'https://example.com/authorize',
    tokenURL: 'https://example.com/token',
    userInfoURL: 'https://example.com/userinfo',
    callbackURL: 'https://yourapp.com/callback',
    scope: 'openid profile email'
}, (issuer, sub, profile, accessToken, refreshToken, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

const app = express();
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('openidconnect'));
app.get('/callback', passport.authenticate('openidconnect', { failureRedirect: '/' }), (req, res) => res.redirect('/profile'));
app.get('/profile', (req, res) => res.json(req.user));

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
```

### 六、总结

单点登录（SSO）通过集中管理用户身份和减少多次登录的需求，提升了用户体验和管理效率。根据不同的需求和场景，可以选择基于 Cookie、SAML、OAuth 和 OpenID Connect 等不同的实现方式。为了确保 SSO 的安全性，需要采取多种防护措施，包括使用 HTTPS、短时令牌、多因素认证等。
