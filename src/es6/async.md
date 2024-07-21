# async 函数

## 一、含义

ES2017 标准引入了 `async` 函数，它是 Generator 函数的语法糖。

```javascript
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// 上面代码的函数 gen 可以写成 async 函数，就是下面这样。
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

比较发现，`async` 函数就是将 Generator 函数的星号（*）替换成 `async`，将 `yield` 替换成 `await`，仅此而已。

`async` 函数对 Generator 函数的改进，体现在以下四点。

（1）内置执行器

Generator 函数的执行必须靠执行器，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一样。

```javascript
asyncReadFile();
```

上面的代码调用了 asyncReadFile 函数，然后它就会自动执行。这不像 Generator 函数，需要调用 next 方法才能真正执行，得到最后结果。

（2）更好的语义

`async` 和 `await`，比起星号（`*`）和 `yield`，语义更清楚。`async` 表示函数里有异步操作，`await` 表示紧跟在后面的表达式需要等待结果。

（3）更广的适用性

co 模块约定，`yield` 命令后面只能是 Thunk 函数或 Promise 对象，而 `async` 函数的 `await` 命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 Promise 对象）。

（4）返回值是 Promise

`async` 函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象更方便。

## 二、基本用法

`async` 函数返回一个 Promise 对象，可以使用 `then` 方法添加回调函数。当函数执行的时候，一旦遇到 `await` 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

## 三、语法

### 3.1 返回 Promise 对象

`async` 函数返回一个 Promise 对象。

`async` 函数内部 `return` 语句返回的值，会成为 `then` 方法回调函数的参数。

```javascript
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```

`async` 函数内部抛出错误，会导致返回的 Promise 对象变为 `reject` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到。

### 3.2 Promise 对象的状态变化

只有 `async` 函数内部的异步操作执行完，才会执行 `then` 方法指定的回调函数。

### 3.3 await 命令

正常情况下，`await` 命令后面是一个 Promise 对象，返回该对象的结果。

（1）如果 `await` 后面不是 Promise 对象，就直接返回对应的值。

```javascript
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v)) // 123
```

（2）如果 `await` 命令后面是一个 `thenable` 对象（即定义了 `then` 方法的对象），那么 `await` 会将其等同于 Promise 对象。

```javascript
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(() => resolve(Date.now() - startTime), this.timeout);
  }
}

(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})();
// 1000
```

上面代码中，`await` 命令后面是一个 Sleep 对象的实例。这个实例不是 Promise 对象，但是因为定义了 `then` 方法，`await` 会将其视为 Promise 处理。

（3）借助 `await` 命令可以实现休眠功能。下面给出了一个简化的 sleep 实现。

```javascript
function sleep(interval) {
  return new Promise(resolve => {
    setTimeout(resolve, interval);
  })
}

// 用法
async function one2FiveInAsync() {
  for(let i = 1; i <= 5; i++) {
    console.log(i);
    await sleep(1000);
  }
}

one2FiveInAsync();
```

（4）当函数执行到 `await` 时，被等待的表达式会立即执行，所有依赖该表达式的值的代码会被暂停，并推送进微任务队列（microtask queue）。然后主线程被释放出来，用于事件循环中的下一个任务。即使等待的值是已经敲定的 promise 或不是 promise，也会发生这种情况。

```javascript
async function foo(name) {
  console.log(name, "start");
  await console.log(name, "middle");
  console.log(name, "end");
}

foo("First");
foo("Second");

// First start
// First middle
// Second start
// Second middle
// First end
// Second end
```

上面的代码，执行到 `await` 时，后面的代码会整体被安排进一个新的微任务，此后的函数体变为异步执行。

```javascript
let i = 0;

queueMicrotask(function test() {
  i++;
  console.log("microtask", i);
  if (i < 3) {
    queueMicrotask(test);
  }
});

(async () => {
  console.log("async function start");
  for (let i = 1; i < 3; i++) {
    await null;
    console.log("async function resume", i);
  }
  await null;
  console.log("async function end");
})();

queueMicrotask(() => {
  console.log("queueMicrotask() after calling async function");
});

console.log("script sync part end");

// async function start
// script sync part end
// microtask 1
// async function resume 1
// queueMicrotask() after calling async function
// microtask 2
// async function resume 2
// microtask 3
// async function end
```

上面的代码，`test` 方法总会在异步函数恢复执行前被调用，呈现轮流的调度。微任务被执行的顺序通常就是入队的先后顺序，而 `console.log("queueMicrotask() after calling async function");` 比 `await` 晚入队，因此 `"queueMicrotask() after calling async function"` 在异步函数第一次恢复之后才输出。

### 3.4 使用注意点

a. `await` 命令只能用在 `async` 函数之中，如果用在普通函数，就会报错。

b. `for` 循环和数组的 `reduce` 方法支持 `async` 函数。

c. `async` 函数可以保留运行堆栈。

```javascript
const a = () => {
  b().then(() => c());
};
```

上面代码中，函数 `a` 内部运行了一个异步任务 `b`。当 `b` 运行的时候，函数 `a` 不会中断，而是继续执行。等到 `b` 运行结束，可能 `a` 早就运行结束了，`b` 所在的上下文环境已经消失了。如果 `b` 或 `c` 报错，错误堆栈将不包括 `a`。

```javascript
const a = async () => {
  await b();
  c();
};
```

上面代码中，`b` 运行的时候，`a` 是暂停执行，上下文环境都保存着。一旦 `b` 或 `c` 报错，错误堆栈将包括 `a`。

## 四、async 函数的实现原理

`async` 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```javascript
async function fn(args) {
  // ...
}

// 等同于
function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```

所有的 `async` 函数都可以写成上面的第二种形式，其中的 `spawn` 函数就是自动执行器。

## 五、顶层 await

从 ES2022 开始，允许在模块的顶层独立使用 `await` 命令。它的主要目的是使用 `await` 解决模块异步加载的问题。

```javascript
// awaiting.js
const dynamic = import(someMission);
const data = fetch(url);
export const output = someProcess((await dynamic).default, await data);
```

上面代码中，两个异步操作在输出的时候，都加上了 `await` 命令。只有等到异步操作完成，这个模块才会输出值。加载这个模块的写法如下。

```javascript
// usage.js
import { output } from "./awaiting.js";
function outputPlusValue(value) { return output + value }

console.log(outputPlusValue(100));
```

注意，顶层 `await` 只能用在 ES6 模块，不能用在 CommonJS 模块。这是因为 CommonJS 模块的 `require()` 是同步加载，如果有顶层 `await`，就没法处理加载了。

## 六、参考

- 阮一峰，[async 函数](https://es6.ruanyifeng.com/#docs/async)
- MDN，[await](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await)
