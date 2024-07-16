# 跨域

跨域（Cross-Origin Request）是指浏览器中的Web应用程序尝试从不同的协议、域名或端口获取资源。

## 一、同源策略 (Same-Origin Policy)

### 1.1 概念

由于安全限制，浏览器只能访问与其所在页面在同一源（同一协议、域名、端口）的资源。这种安全机制被称为同源策略（Same-Origin Policy）。同源策略是一种重要的安全机制，用于防止恶意网站读取其他网站的敏感数据。根据同源策略，只有当两个 URL 拥有相同的协议、域名和端口时，它们才被认为是同源的。

### 1.2 同源策略的限制范围

对于非同源应用之间的通信，共有三种行为受到限制。

- 无法接触非同源网页的 DOM。
- 无法读取非同源网页的 Cookie、LocalStorage 和 IndexedDB。
- 无法向非同源地址发送 AJAX 请求（可以发送，但浏览器会拒绝接受响应）。

但是，通过一些特殊方法，可以规避这些限制。

### 1.3 Cookie

Cookie 是服务器写入浏览器的一小段信息，只有同源的网页才能共享。如果两个网页一级域名相同，只是次级域名不同，浏览器允许通过设置 `document.domain` 共享 Cookie。此时两个网页都需要设置 `document.domain` 属性，才能达到同源的目的。因为设置 `document.domain` 的同时，会把端口重置为 `null`，因此如果只设置一个网页的 `document.domain`，会导致两个网址的端口不同，还是达不到同源的目的。

注意，这种方法只适用于 Cookie 和 iframe 窗口，LocalStorage 和 IndexedDB 无法通过这种方法，规避同源政策。

### 1.4 iframe 和多窗口通信

iframe 窗口之中的脚本，可以获得父窗口和子窗口。但是，只有在同源的情况下，父窗口和子窗口才能通信；如果跨域，就无法拿到对方的 DOM。这种情况不仅适用于 iframe 窗口，还适用于 `window.open` 方法打开的窗口，只要跨域，父窗口与子窗口之间就无法通信。

### 1.5 片段识别符

片段标识符（fragment identifier）指的是，URL 的 `#` 号后面的部分，如果只是改变片段标识符，页面不会重新刷新。通过这种方式，父窗口可以把信息，写入子窗口的片段标识符。此方法对于完全不同源的网站，可以解决跨域窗口的通信问题。

### 1.6 window.postMessage()

HTML5 引入了一个全新的API：跨文档通信 API（Cross-document messaging）。这个 API 为 window 对象新增了一个 `window.postMessage` 方法，允许跨窗口通信，不论这两个窗口是否同源。

```javascript
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

`postMessage` 方法的第一个参数是具体的信息内容，第二个参数是接收消息的窗口的源（origin），即“协议 + 域名 + 端口”。也可以设为 `*`，表示不限制域名，向所有窗口发送。

然后，可以通过 `message` 事件，监听发送者的消息。

```javascript
// 监听 message 消息
window.addEventListener('message', function (event) {
  console.log(event);
},false);
```

message事件的参数是事件对象event，提供以下三个属性。

- `event.source`：发送消息的窗口。
- `event.origin`: 消息发送者的源（origin），即协议、域名、端口。
- `event.data`: 消息内容。

### 1.7 LocalStorage

通过 `window.postMessage`，可以做到读写其他窗口的 `LocalStorage`。

## 二、跨域资源共享 (CORS)

跨域资源共享（Cross-Origin Resource Sharing，CORS）是 W3C 标准，为服务器定义了一种方式，使得浏览器可以安全地进行跨域请求。CORS 通过在 HTTP 请求和响应中使用额外的头信息来告知浏览器允许的跨域行为。

CORS 请求分为两类：简单请求和非简单请求。同时满足以下两个条件的请求被认为是简单请求：

1. 使用的方法是 `GET`、`POST` 或 `HEAD`。
2. 仅使用了以下几种安全的首部字段：
   - `Accept`
   - `Accept-Language`
   - `Content-Language`
   - `Content-Type`（值仅限于 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`）

凡是不满足上面两个条件的，都属于非简单请求。一句话，简单请求就是简单的 HTTP 方法与简单的 HTTP 头信息的结合。

这样划分的原因是，表单在历史上一直可以跨源发出请求。简单请求就是表单请求，浏览器沿袭了传统的处理方式，不把行为复杂化，否则开发者可能转而使用表单，规避 CORS 的限制。

## 三、简单请求

### 3.1 基本流程

浏览器在发出简单请求时，会自动在请求头中添加 `Origin` 字段，以告知服务器请求的来源。

如果 `Origin` 指定的源，不在许可范围内，服务器会返回一个正常的 HTTP 回应，浏览器则会抛出一个 `NetworkError`。

如果 `Origin` 指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

```http
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

上面的头信息之中，有三个与 `CORS` 请求相关的字段，都以 `Access-Control-` 开头。

- `Access-Control-Allow-Origin`: 指定允许访问资源的源。它的值可以是特定的源，也可以是通配符 `*`，表示接受任意域名的请求。
- `Access-Control-Allow-Credentials`（可选）：表示是否允许发送 Cookie，当设置为 `true` 时，`Access-Control-Allow-Origin` 不能是通配符 `*`。
- `Access-Control-Expose-Headers`（可选）：指定哪些头信息可以在响应中暴露给浏览器。

当浏览器检测到请求满足简单请求的条件时，会直接发送请求，而不需要预检请求（OPTIONS）。如果服务器的响应包含适当的 CORS 头信息，浏览器将允许访问响应数据，否则将阻止访问。

### 3.2 withCredentials 属性

为了降低 CSRF 攻击的风险，CORS 请求默认不包含 Cookie 信息。如果服务器需要拿到 Cookie，这时服务器会显式指定 `Access-Control-Allow-Credentials` 字段，告诉浏览器可以发送 Cookie。

```http
Access-Control-Allow-Credentials: true
```

同时，在客户端请求时，需要将 `withCredentials` 字段设置为 `true`。否则，即使服务器要求发送 Cookie，浏览器也不会发送。此时，`Access-Control-Allow-Origin` 必须指定明确的、与请求网页一致的域名，不能设置为 `*`。

## 四、非简单请求

### 4.1 预检请求

任何不满足简单请求条件的请求都需要进行预检请求。预检请求使用 `OPTIONS` 方法，在实际请求之前发送，用于询问服务器是否允许跨域请求。只有当服务器明确允许这些跨域请求时，浏览器才会发送实际的请求。

预检请求是为了确保跨域请求的安全性，防止未经授权的访问和操作。

#### 4.2 CORS 预检请求的头部

假设我们向 `https://example.com/api/data` 发送一个带有自定义头部的 `POST` 请求：

```javascript
fetch('https://example.com/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'my-custom-header'
  },
  body: JSON.stringify({ key: 'value' })
});
```

（1） 请求头字段

浏览器会先发送一个预检请求：

```http
OPTIONS /api/data HTTP/1.1
Host: example.com
Origin: http://yourdomain.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, X-Custom-Header
```

- `Origin`: 发起请求的页面的来源。
- `Access-Control-Request-Method`：告诉服务器实际请求会使用的 HTTP 方法。
- `Access-Control-Request-Headers`：告诉服务器实际请求会额外发送的头信息字段。

（2） 响应头字段

服务器响应：

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://yourdomain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Custom-Header
```

- `Access-Control-Allow-Origin`：指定哪些源可以访问资源。例如，`*` 表示允许任何源访问。
- `Access-Control-Allow-Methods`：指定允许的 HTTP 方法。
- `Access-Control-Allow-Headers`：指定允许的自定义首部字段。
- `Access-Control-Allow-Credentials`：指定客户端是否可以发送凭据（如 Cookies）。
- `Access-Control-Max-Age`：指定预检请求的结果可以缓存多长时间（以秒为单位），在有效期内，浏览器将不会发送预检请求。

（3） 如果服务器的响应中包含了适当的 CORS 头部，则浏览器会继续发送实际请求：

```http
POST /api/data HTTP/1.1
Host: example.com
Origin: http://yourdomain.com
Content-Type: application/json
X-Custom-Header: my-custom-header

{"key": "value"}
```

服务器响应：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://yourdomain.com
Content-Type: application/json

{"response": "data"}
```

（4） 如果服务器否定了“预检”请求，会返回一个正常的 HTTP 回应，但是没有任何 CORS 相关的头信息字段，或者明确表示请求不符合条件。此时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误。

一旦服务器通过了“预检”请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 `Origin` 头信息字段。服务器的回应，也都会有一个 `Access-Control-Allow-Origin` 头信息字段。

## 五、解决跨域问题的方法

### 5.1 CORS（跨域资源共享）

CORS（Cross-Origin Resource Sharing）是一种允许服务器声明哪些来源的请求可以访问其资源的机制。通过设置特定的HTTP头，服务器可以控制跨域请求的权限。

**基本原理**：当前端发起跨域请求时，浏览器会自动发送预检请求，以确定服务器是否允许跨域请求。服务器响应预检请求后，浏览器会根据响应头的内容决定是否继续发送实际请求。

```javascript
// 服务器端（Node.js Express）
const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://example.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/data', (req, res) => {
  res.json({ message: 'This is a CORS-enabled response' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

```javascript
// 客户端（JavaScript）
fetch('http://localhost:3000/data', {
  credentials: 'include',
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 5.2 WebSocket

WebSocket 是一种通信协议，使用 ws://（非加密）和 wss://（加密）作为协议前缀。该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。

下面是一个例子，浏览器发出的 WebSocket 请求的头信息（摘自[维基百科](https://en.wikipedia.org/wiki/WebSocket)）。

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

上面代码中，有一个字段是 `Origin`，表示该请求的请求源（origin），即发自哪个域名。

正是因为有了 `Origin` 这个字段，所以 WebSocket 才没有实行同源政策。因为服务器可以根据这个字段，判断是否许可本次通信。如果该域名在白名单内，服务器就会做出如下回应。

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

### 5.2 JSONP (JSON with Padding)

JSONP 是一种跨域请求的老方法，仅支持 `GET` 请求。通过动态创建 `<script>` 标签，并利用其不受同源策略限制的特点来实现跨域请求。

```javascript
// 服务器端
app.get('/data', (req, res) => {
  const callback = req.query.callback;
  res.send(`${callback}(${JSON.stringify({ message: 'Hello, JSONP!' })})`);
});
```

```html
<!-- 客户端 -->
<script>
function handleResponse(data) {
  console.log(data);
}

const script = document.createElement('script');
script.src = 'http://localhost:3000/data?callback=handleResponse';
document.body.appendChild(script);
</script>
```

### 5.3 服务器代理 (Server Proxy)

通过在同源服务器上设置代理，将跨域请求转发到目标服务器。客户端向代理服务器发送请求，代理服务器再向目标服务器发送请求并返回结果。

```javascript
// 服务器端（Node.js Express）
const express = require('express');
const request = require('request');
const app = express();

app.get('/proxy', (req, res) => {
  const url = 'http://example.com/api'; // 目标服务器地址
  req.pipe(request(url)).pipe(res);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

```javascript
// 客户端
fetch('http://localhost:3000/proxy')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### 5.4 Nginx 反向代理

使用 Nginx 反向代理将跨域请求转发到目标服务器。

```nginx
server {
  listen 80;
  server_name localhost;

  location /api {
    proxy_pass http://example.com;
    proxy_set_header Host $host;
  }
}
```

```javascript
// 客户端
fetch('http://localhost/api')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

参考

- [同源限制](https://wangdoc.com/javascript/bom/same-origin)
- [CORS 通信](https://wangdoc.com/javascript/bom/cors)
