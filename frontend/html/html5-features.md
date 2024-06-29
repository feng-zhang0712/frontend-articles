HTML5 是最新的 HTML 标准，由万维网联盟（W3C）和 Web 超文本应用技术工作组（WHATWG）共同开发。HTML5 在传统 HTML 基础上引入了许多新特性，旨在提高 Web 应用的性能、功能和用户体验。以下是 HTML5 的一些主要新特性和改进：

### 1. 新的语义元素

HTML5 引入了许多新的语义元素，帮助开发者更清晰地定义文档结构，使搜索引擎和辅助技术更容易理解页面内容。

- `<header>`：定义页面或区域的页眉。
- `<footer>`：定义页面或区域的页脚。
- `<section>`：定义文档中的章节。
- `<article>`：定义独立的内容块，如博客文章或新闻条目。
- `<aside>`：定义与主内容相关的附加内容，如侧边栏。
- `<nav>`：定义导航链接区域。
- `<figure>` 和 `<figcaption>`：用于图像和图像说明。
- `<main>`：定义文档的主要内容。
- `<mark>`：定义高亮文本。

#### 示例

```html
<article>
  <header>
    <h1>Article Title</h1>
    <p>Author: John Doe</p>
  </header>
  <section>
    <h2>Section Title</h2>
    <p>Section content...</p>
  </section>
  <footer>
    <p>Published: 2024-06-29</p>
  </footer>
</article>
```

### 2. 新的表单控件

HTML5 增强了表单控件，引入了新的输入类型和属性，简化了表单验证和交互。

- 新的输入类型：`email`、`url`、`date`、`time`、`datetime-local`、`number`、`range`、`color`、`tel`、`search` 等。
- 新的属性：`placeholder`、`required`、`pattern`、`autocomplete`、`autofocus` 等。

#### 示例

```html
<form>
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="birthday">Birthday:</label>
  <input type="date" id="birthday" name="birthday">

  <label for="quantity">Quantity (between 1 and 5):</label>
  <input type="number" id="quantity" name="quantity" min="1" max="5">

  <input type="submit" value="Submit">
</form>
```

### 3. 多媒体元素

HTML5 引入了新的多媒体元素，使嵌入音频和视频变得更加容易。

- `<audio>`：用于嵌入音频文件。
- `<video>`：用于嵌入视频文件。

#### 示例

```html
<audio controls>
  <source src="audiofile.mp3" type="audio/mpeg">
  <source src="audiofile.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>

<video controls>
  <source src="videofile.mp4" type="video/mp4">
  <source src="videofile.ogg" type="video/ogg">
  Your browser does not support the video element.
</video>
```

### 4. 图形和绘图

HTML5 支持内置的绘图和图形功能，主要通过 `<canvas>` 和 `<svg>` 实现。

- `<canvas>`：用于通过 JavaScript 绘制图形和动画。
- `<svg>`：用于定义可缩放矢量图形。

#### 示例

```html
<!-- Canvas 示例 -->
<canvas id="myCanvas" width="200" height="200"></canvas>
<script>
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(10, 10, 150, 100);
</script>

<!-- SVG 示例 -->
<svg width="100" height="100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
```

### 5. 本地存储

HTML5 提供了多种本地存储机制，允许 Web 应用在客户端存储数据。

- `localStorage`：用于存储持久化数据，即使浏览器关闭后数据仍然存在。
- `sessionStorage`：用于存储会话数据，浏览器关闭后数据丢失。
- `IndexedDB`：用于存储更复杂的数据结构和大量数据。

#### 示例

```html
<script>
  // localStorage 示例
  localStorage.setItem('username', 'JohnDoe');
  var username = localStorage.getItem('username');
  console.log(username); // JohnDoe

  // sessionStorage 示例
  sessionStorage.setItem('sessionID', '123456');
  var sessionID = sessionStorage.getItem('sessionID');
  console.log(sessionID); // 123456
</script>
```

### 6. 地理位置

HTML5 提供了 Geolocation API，可以获取用户的地理位置信息。

#### 示例

```html
<button onclick="getLocation()">Get Location</button>
<p id="location"></p>
<script>
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      document.getElementById('location').innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  function showPosition(position) {
    document.getElementById('location').innerHTML =
      'Latitude: ' + position.coords.latitude +
      '<br>Longitude: ' + position.coords.longitude;
  }
</script>
```

### 7. Web Workers

Web Workers 允许在后台运行 JavaScript，避免阻塞主线程，提高应用性能。

#### 示例

```html
<!-- main.js -->
if (window.Worker) {
  const worker = new Worker('worker.js');
  worker.postMessage('Hello Worker');

  worker.onmessage = function(event) {
    console.log('Message from worker: ' + event.data);
  };
}

<!-- worker.js -->
onmessage = function(event) {
  postMessage('Hello from Worker');
};
```

### 8. Web Sockets

Web Sockets 提供了一种在客户端和服务器之间建立实时双向通信的机制。

#### 示例

```html
<script>
  const socket = new WebSocket('ws://example.com/socket');

  socket.onopen = function(event) {
    socket.send('Hello Server!');
  };

  socket.onmessage = function(event) {
    console.log('Message from server: ' + event.data);
  };
</script>
```

### 9. 拖放（Drag and Drop）

HTML5 增强了拖放功能，使其更容易实现拖放交互。

#### 示例

```html
<div id="drag1" draggable="true" ondragstart="drag(event)">Drag me</div>
<div id="dropZone" ondrop="drop(event)" ondragover="allowDrop(event)">Drop here</div>

<script>
  function allowDrop(event) {
    event.preventDefault();
  }

  function drag(event) {
    event.dataTransfer.setData('text', event.target.id);
  }

  function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    event.target.appendChild(document.getElementById(data));
  }
</script>
```

#### 10. 微数据（Microdata）

- 提供了一种嵌入结构化数据到 HTML 文档中的方式，帮助搜索引擎更好地理解页面内容。

#### 11. 新的文档类型声明

- 简化的 DOCTYPE 声明：`<!DOCTYPE html>`

#### 12. 增强的 JavaScript API

- 如 History API、Web Storage API、File API 等。

#### 13. WebGL

- 提供了在浏览器中进行 3D 渲染的功能。
