# 服务端渲染

## 一、客户端渲染

## 二、什么是服务端渲染（SSR）？

服务端渲染（Server-Side Rendering, SSR）是一种在服务端生成 HTML 内容的技术。与客户端渲染（Client-Side Rendering, CSR）不同，SSR 会在服务器上预先渲染页面并将完整的 HTML 内容发送到客户端。这样，当用户请求页面时，浏览器可以立即显示内容，而不需要等待 JavaScript 在客户端下载和执行。

**优点：**

- **更快的首屏渲染速度**：SSR 可以减少首屏渲染的时间，因为 HTML 已经在服务器端生成并发送到客户端。
- **更好的 SEO**：搜索引擎可以更好地抓取和索引预渲染的 HTML 内容，从而提高 SEO 性能。
- **减少客户端工作负载**：由于部分渲染工作在服务器端完成，客户端的渲染压力减轻。

**缺点：**

- **服务器负载增加**：SSR 会增加服务器的工作负载，因为服务器需要处理渲染逻辑。
- **开发复杂度增加**：需要处理更多的服务器端逻辑，并确保客户端和服务器端代码的一致性。

## 三、React 服务端渲染的原理

React SSR 的基本原理是：

1. **初始渲染**：当用户请求页面时，服务器会使用 React 组件生成 HTML 内容，然后将其发送到客户端。
2. **客户端接管**：客户端接收到 HTML 内容后，React 会在浏览器中 "接管" 这些内容，并将其转化为可交互的 React 组件。

## 三、React 服务端渲染的实现

### 3.1 设置 Node.js 服务器

首先，你需要一个 Node.js 服务器来处理 HTTP 请求。常用的服务器框架是 Express。

```bash
npm init -y
npm install express react react-dom
npm install @babel/core @babel/preset-env @babel/preset-react babel-loader --save-dev
```

### 3.2 配置 Babel

在项目根目录下创建 `.babelrc` 文件，用于配置 Babel。

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### 3.3 创建 React 应用

在项目中创建一个简单的 React 组件。

```jsx
// src/App.js
import React from 'react';

const App = () => {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
};

export default App;
```

### 3.4 设置 Webpack 配置

在项目根目录下创建 `webpack.config.js` 文件，用于配置 Webpack。

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
```

### 3.5 创建服务器端渲染逻辑

在项目根目录下创建 `server.js` 文件，用于设置 Express 服务器和处理 SSR 逻辑。

```javascript
const express = require('express');
const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('./src/App').default;
const path = require('path');

const app = express();

app.use(express.static('dist'));

app.get('*', (req, res) => {
  const appString = renderToString(<App />);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React SSR Example</title>
      </head>
      <body>
        <div id="root">${appString}</div>
        <script src="bundle.js"></script>
      </body>
    </html>
  `;

  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

### 3.6 启动应用

在项目根目录下添加 `scripts` 字段到 `package.json` 文件中，用于启动服务器。

```json
"scripts": {
  "start": "node server.js",
  "build": "webpack --mode production"
}
```

然后运行以下命令来构建和启动应用：

```bash
npm run build
npm start
```

访问 `http://localhost:3000`，你应该会看到 "Hello, world!" 的页面。这意味着 React 组件已经在服务器端渲染，并发送到客户端。
