# Web 开发中的设备检测

在 Web 开发中，判断用户是通过 PC 端还是移动端访问页面是非常重要的。根据用户的访问设备类型，可以提供不同的用户体验和界面布局。判断设备类型的常见方法包括使用 User-Agent 字符串、CSS 媒体查询以及 JavaScript 库。

## 一、使用 User-Agent 字符串

User-Agent 字符串是浏览器在 HTTP 请求头中发送的信息，其中包含了有关浏览器和操作系统的信息。通过解析 User-Agent 字符串，可以判断用户是使用什么设备访问的。

```javascript
function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge|maemo|midp|mmp|mobile|netfront|nokia|opera m(ob|in)i|palm( os)?|phone|pie|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.browser|up\.link|vodafone|wap|windows ce|xda|xiino/i.test(userAgent);
}

if (isMobile()) {
  console.log("移动端访问");
} else {
  console.log("PC端访问");
}
```

## 二、使用 CSS 媒体查询

CSS 媒体查询可以用于检测设备的特性（如屏幕宽度）并应用不同的样式。虽然不能直接在 JavaScript 中使用媒体查询，但可以通过结合 JavaScript 和 CSS 来实现。

```css
/* 移动端样式 */
@media only screen and (max-width: 768px) {
  body::before {
    content: "移动端访问";
    display: block;
    text-align: center;
    font-size: 20px;
    color: red;
  }
}

/* PC端样式 */
@media only screen and (min-width: 769px) {
  body::before {
    content: "PC端访问";
    display: block;
    text-align: center;
    font-size: 20px;
    color: blue;
  }
}
```

以下是 JavaScript 结合媒体查询的例子。

```javascript
function detectDevice() {
  const isMobile = window.matchMedia("only screen and (max-width: 768px)").matches;
  if (isMobile) {
    console.log("移动端访问");
  } else {
    console.log("PC端访问");
  }
}

detectDevice();
```

## 三、使用现代 JavaScript 库

使用现代 JavaScript 库（如 `Mobile-Detect`）可以更方便和准确地检测设备类型。

### 4. 综合方法

在实际项目中，可以综合使用多种方法来提高检测的准确性。例如，可以结合 User-Agent 字符串检测和 CSS 媒体查询来判断用户设备类型。

```javascript
function detectDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobile = /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge|maemo|midp|mmp|mobile|netfront|nokia|opera m(ob|in)i|palm( os)?|phone|pie|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.browser|up\.link|vodafone|wap|windows ce|xda|xiino/i.test(userAgent);
  const isMobileMediaQuery = window.matchMedia("only screen and (max-width: 768px)").matches;

  if (isMobile || isMobileMediaQuery) {
    console.log("移动端访问");
  } else {
    console.log("PC端访问");
  }
}

detectDevice();
```
