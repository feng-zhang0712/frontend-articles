# 前端跨页面通信方式

## 一、`localStorage`

`localStorage` 是一种简单的方式，适用于在同一浏览器的同源标签页之间共享数据。它具有持久性，但不会触发事件，通知其他标签页数据已更改。

```javascript
// 1. 设置数据
localStorage.setItem('key', 'value');

// 2. 获取数据
const value = localStorage.getItem('key');

// 3. 监听变化（`Storage` 事件）：在同一浏览器的其他标签页中，可以监听 `storage` 事件来检测数据变化。
window.addEventListener('storage', (event) => {
  if (event.key === 'key') {
    console.log('Data changed:', event.newValue);
  }
});
```

## 二、`IndexedDB`

`IndexedDB` 是一种低级 API，用于在用户的浏览器中存储大量结构化数据。可以通过它建立一个监听机制来实现通信。

  ```javascript
  // 1. 存储数据
  const request = indexedDB.open('myDatabase', 1);

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['myObjectStore'], 'readwrite');
    const objectStore = transaction.objectStore('myObjectStore');
    objectStore.put('value', 'key');
  };

  // 2. 监听数据变化：可以通过定时器或者更高级的监听机制来检测数据变化。
  ```

## 三、`BroadcastChannel`

`BroadcastChannel` API 允许同源的多个浏览器上下文（如标签页、iframe、worker）之间进行简单的通信。

```javascript
// 1. 创建频道并发送消息
const channel = new BroadcastChannel('my_channel');
channel.postMessage('Hello from another tab');

// 接收消息
const channel = new BroadcastChannel('my_channel');
channel.onmessage = (event) => {
  console.log('Received message:', event.data);
};
```

## 四、`Service Workers` 和 `MessageChannel`

Service Workers 可以在后台运行，并且可以使用 `MessageChannel` 实现多个标签页之间的通信。

```javascript
// 1. 在 Service Worker 中设置消息监听
self.addEventListener('message', (event) => {
  console.log('Received message in Service Worker:', event.data);
  event.ports[0].postMessage('Response from Service Worker');
});

// 2. 在主脚本中发送消息
navigator.serviceWorker.controller.postMessage('Message to Service Worker', [messageChannel.port2]);

messageChannel.port1.onmessage = (event) => {
  console.log('Received response from Service Worker:', event.data);
};
```

## 五、`SharedWorker`

`SharedWorker` 可以在多个浏览器上下文中共享，并且允许它们之间进行通信。

```javascript
// shared-worker.js
// 1. 在 SharedWorker 脚本中设置消息监听
onconnect = function(event) {
  const port = event.ports[0];

  port.onmessage = function(event) {
    port.postMessage('Hello from SharedWorker');
  };
};

// 2. 在主脚本中连接 SharedWorker 并发送消息
const worker = new SharedWorker('shared-worker.js');
worker.port.start();

worker.port.postMessage('Message to SharedWorker');

worker.port.onmessage = (event) => {
  console.log('Received message from SharedWorker:', event.data);
};
```

## 六、`window.postMessage`

`window.postMessage` 通常用于跨域 iframe 通信，但也可以用于同域的标签页之间的通信（通过引用彼此的 `window` 对象）。

```javascript
// 1. 发送消息
const otherWindow = window.open('url_of_other_tab');
otherWindow.postMessage('Hello from another tab', 'https://target-origin.com');

// 2. 接收消息
window.addEventListener('message', (event) => {
  if (event.origin === 'https://target-origin.com') {
    console.log('Received message:', event.data);
  }
});
```
