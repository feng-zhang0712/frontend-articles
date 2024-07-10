# 跨域

跨域（Cross-Origin Request）是指浏览器中的Web应用程序尝试从不同的协议、域名或端口获取资源。由于安全限制，浏览器只能访问与其所在页面在同一源（同一协议、域名、端口）的资源。这种安全机制被称为同源策略（Same-Origin Policy）。

## 一、同源策略 (Same-Origin Policy)

同源策略是一种重要的安全机制，用于防止恶意网站读取其他网站的敏感数据。根据同源策略，只有当两个 URL 拥有相同的协议、域名和端口时，它们才被认为是同源的。

## 二、跨域资源共享 (CORS)

跨域资源共享（Cross-Origin Resource Sharing，CORS）是 W3C 标准，为服务器定义了一种方式，使得浏览器可以安全地进行跨域请求。CORS 通过在 HTTP 请求和响应中使用额外的头信息来告知浏览器允许的跨域行为。根据请求的不同，CORS 请求分为两种类型：简单请求和预检请求。

### 2.1 简单请求

满足以下所有条件的请求被认为是简单请求：

1. 使用的方法是 `GET`、`POST` 或 `HEAD`。
2. 仅使用了以下几种安全的首部字段：
   - `Accept`
   - `Accept-Language`
   - `Content-Language`
   - `Content-Type`（值仅限于 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`）

浏览器在发出简单请求时，会自动在请求头中添加 `Origin` 字段，以告知服务器请求的来源。

### 2.2 预检请求

任何不满足简单请求条件的请求都需要进行预检请求。预检请求使用 `OPTIONS` 方法，在实际请求之前发送，用于询问服务器是否允许跨域请求。预检请求是一种使用 HTTP OPTIONS 方法的请求，在实际请求之前发送。浏览器会首先发送这个预检请求，以确认服务器是否允许特定的跨域请求（例如，使用自定义头部或方法）。只有当服务器明确允许这些跨域请求时，浏览器才会发送实际的请求。

#### （1）为什么需要预检请求？

预检请求是为了确保跨域请求的安全性。当请求中使用了非简单请求（Non-Simple Requests）时，预检请求可以防止未经授权的访问和操作。这包括：

- 使用了非简单方法（如 `PUT`、`DELETE`、`PATCH` 等）。
- 使用了非简单头部（如自定义头部）。
- 使用了 `Content-Type` 之外的 MIME 类型。

#### （2）CORS 预检请求的头部

预检请求和响应涉及一些特定的 CORS 头部：

- **请求头部**：
  - `Origin`: 发起请求的页面的来源。
  - `Access-Control-Request-Method`：预检请求中使用，告诉服务器实际请求会使用的 HTTP 方法。
  - `Access-Control-Request-Headers`：预检请求中使用，告诉服务器实际请求会包含的自定义首部字段。

- **响应头部**：
  - `Access-Control-Allow-Origin`：指定哪些源可以访问资源。例如，`*` 表示允许任何源访问。
  - `Access-Control-Allow-Methods`：指定允许的 HTTP 方法。
  - `Access-Control-Allow-Headers`：指定允许的自定义首部字段。
  - `Access-Control-Allow-Credentials`：指示是否可以发送和接收凭据（如 Cookies）。
  - `Access-Control-Max-Age`：指定预检请求的结果可以缓存多长时间（以秒为单位），在有效期内，浏览器将不会发送预检请求。

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

浏览器会先发送一个预检请求：

```http
OPTIONS /api/data HTTP/1.1
Host: example.com
Origin: http://yourdomain.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, X-Custom-Header
```

服务器响应：

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://yourdomain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-Custom-Header
```

如果服务器的响应中包含了适当的 CORS 头部，则浏览器会继续发送实际请求：

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

## 三、解决跨域问题的方法

### 3.1 CORS（跨域资源共享）

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

### 3.2 JSONP (JSON with Padding)

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

注意，该方法仅支持 GET 请求。

### 3.3 服务器代理 (Server Proxy)

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

### 3.4 Nginx 反向代理

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
