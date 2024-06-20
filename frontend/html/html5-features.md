# HTML5 新特性

## 新的语义标签

HTML5 新增了新的语义标签，以更好地描述网页的结构和内容，有助于搜索引擎优化（SEO）。

* `<header>`：表示文档或节的头部，通常包含标题、导航链接等。
* `<footer>`：表示文档或节的页脚，通常包含版权信息、联系信息等。
* `<nav>`：表示页面中的导航部分，包含导航链接的容器。
* `<aside>`：表示与主要内容相关的附属内容，如侧边栏、广告等。
* `<article>`：表示文档中的独立内容，例如博客文章、新闻文章等。
* `<section>`：表示文档中的节，用于将内容分组。

## 新的表单控件和属性

HTML5 新增了新的表单控件和属性，以增强表单功能和提高用户体验。

### 新的表单控件

* `<input type="email">`：<自动验证>用于输入电子邮件地址。
* `<input type="tel">`：<非自动验证>用于输入电话号码。
* `<input type="url">`：<自动验证>用于输入 URL。
* `<input type="date">`：<自动验证>用于输入日期。
* `<input type="time">`：用于输入时间。
* `<input type="number">`：用于输入数字。
* `<input type="range">`：用于输入范围值（滑块）。
* `<input type="color">`：用于选择颜色。

### 新的表单属性

* `required`：指定输入字段为必填项。
* `pattern`：指定输入字段的正则表达式模式。
* `placeholder`：为输入字段提供占位符文本。
* `autofocus`：页面加载时自动聚焦到输入字段。
* `autocomplete`：启用或禁用自动完成。

### 表单验证相关属性

* `novalidate`：在 `<form>` 元素上使用 `novalidate` 属性可以禁用表单的 HTML5 验证。
* `formnovalidate`：在 `<button>` 或 `<input type="submit">` 元素上使用 `formnovalidate` 属性可以禁用该按钮的表单验证。


注意，此部分也是面试题：HTML5 表单验证特性。

## 多媒体元素

HTML5 新增了原生的多媒体支持，包括 `<audio>` 和 `<video>` 元素，用于嵌入音频和视频内容。
* `<audio>`：用于在网页中嵌入音频内容。
* `<video>`：用于在网页中嵌入视频内容。

## 图形和动画

HTML5 新增了 `<canvas>` 用于绘制图形和动画，还支持 SVG 内联绘图。

* `<canvas>`：用于绘制图形，通过 JavaScript 进行操作。
* 内联 SVG：用于绘制矢量图形。

## 地理定位

HTML5 新增了 Geolocation API，可以获取用户的地理位置信息。

## 离线存储

HTML5 新增了多种离线存储机制，用于在客户端存储数据。

* `localStorage`：用于在客户端持久化存储数据，数据没有过期时间。
* `sessionStorage`：用于在客户端会话期内存储数据，当页面会话结束时数据被清除。

## Web Workers

HTML5 新增了Web Workers，用于在后台线程中运行脚本，避免阻塞主线程。
