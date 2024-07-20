# Promise 对象

## Promise 的含义

Promise 是 ES6 中新增的一种异步编程的解决方案，Promise 可以理解为一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

Promise对象有以下两个特点。

1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和 `rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。
2. 一旦状态改变，就不会再变。Promise 对象的状态改变，只有两种可能：从 `pending` 变为 `fulfilled` 和从 pending变为 `rejected`。只要这两种情况发生，就会一直保持这个结果，这时就称为 `resolved`（已定型）。

Promise 也有一些缺点。首先，无法取消 Promise，一旦新建它就会立即执行，无法中途取消。其次，如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。第三，当处于 `pending` 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

## 二、基本用法

Promise 新建后会立即执行。

```javascript
const promise = new Promise((resolve, reject) => {
  console.log('Promise');
  resolve();
});

promise.then(() => {
  console.log('resolved.');
});

console.log('Hi!');
// Promise
// Hi!
// resolved.
```

## 三、Promise.prototype.then()

### 3.1 Promise 的值穿透

Promise 的值穿透是指在 Promise 的链式调用中，如果某个 then 方法没有为其参数（即 `onFulfilled` 或 `onRejected`）提供处理函数，Promise 的值会自动穿透到下一个 `then` 方法中。

Promise 发生值穿透的原因，是由于 `Promise.then` 或者 `Promise.catch` 方法接受的参数类型决定的。Promise 的值穿透分为以下几种情况。

（1）如果 `Promise.then` 方法没有回调函数，那么，之前 Promise 对象的值，会透传到之后的 `then` 方法中。

```javascript
const promise = Promise.resolve(42);

promise
  .then() // 没有提供 onFulfilled 处理函数
  .then(value => {
    console.log(value);
  });
// 42
```

在上述示例中，第一个 `then` 方法没有提供任何处理函数，Promise 的值会直接穿透到下一个 `then` 方法，并在第二个 `then` 方法中被处理。

（2）如果 `Promise.then` 方法的回调函数没有返回值，此时，当前 `then` 方法的返回值，会被认为是 `undefined`，并且会被之后的 `then` 方法捕获。

```javascript
const promise = Promise.resolve(42);

promise
  .then(value => {
    console.log(value);
  })
  .then(value => {
    console.log(value);
  });
// 42
// undefined
```

（3）如果 `Promise.then` 方法的回调函数有返回值，则会被之后的 `then` 方法捕获。

```javascript
const promise = Promise.resolve(42);

promise
  .then(value => {
    console.log(value);
    return 43;
  })
  .then(value => {
    console.log(value);
  });
// 42
// 43
```

### 3.2 Promise 的异常穿透

Promise 的异常穿透是指在 Promise 链中，如果某个 `then` 方法没有为其参数（即 `onRejected`）提供错误处理函数，Promise 的错误会自动穿透到下一个 `catch` 方法中，或者下一个带有 `onRejected` 的 `then` 方法中。

```javascript
const promise = Promise.reject(new Error("Something went wrong"));

promise
.then(value => {
  console.log(value);
}) // 没有提供 onRejected 处理函数
  .catch(error => {
    console.error(error.message);
  });
// In catch error:  Something went wrong
```

如果 Promise 抛出的错误，被 `then` 方法的 `onRejected` 捕获，那么，错误不再被之后的 `catch` 方法捕获。

```javascript
const promise = Promise.reject(new Error("Something went wrong"));

promise
.then(
  value => {}, 
  error => {
    console.log('In then error: ', error);
  })
  .catch(error => {
    console.error('In catch error: ', error.message);
  });
// In then error:  Error: Something went wrong
```

## 四、Promise.prototype.catch()

`catch` 方法是 `.then(null, onRejected)` 或 `.then(undefined, onRejected)` 的别名，用于指定发生错误时的回调函数。`catch` 方法会返回一个等效的 Promise 对象。

如果 Promise 状态已经变成 `resolved`，再抛出错误是无效的。

```javascript
const promise = new Promise((resolve, reject) => {
  resolve('ok');
  throw new Error('test');
});

promise
  .then(value => console.log(value))
  .catch(error => console.log(error));
// ok
```

上面代码中，Promise 在 `resolve` 语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 Promise 的状态一旦改变，就不会再变。

作为对比，看下边的例子。

```javascript
const promise = new Promise((resolve, reject) => {
  resolve('ok');
  setTimeout(() => {
    throw new Error('test');
  }, 0)
});
promise.then(value => console.log(value));
// ok
// Uncaught Error: test
```

上面代码中，Promise 指定在下一轮“事件循环”再抛出错误。到了那个时候，Promise 的运行已经结束了，所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。

如果没有使用 `catch` 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，也就意味着，不会被 `try/catch` 代码块捕获。

```javascript
try {
  const someAsyncThing = () => {
    return new Promise((resolve, reject) => {
      // 下面一行会报错，因为 x 没有声明
      resolve(x + 2);
    });
  };
  
  someAsyncThing().then(() => {
    console.log('everything is great');
  });
} catch (error) {
  console.log('In try/catch error: ', error)
}
```

## 五、Promise.prototype.finally()

`finally` 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。`finally` 方法会返回一个等效的 Promise 对象。

## 六、Promise.all()

`Promise.all` 方法会在所有 Promise 对象 `resolved` 或者任何一个 Promise 对象 `rejected` 之后兑现。

如果作为参数的 Promise 实例，自己定义了 `catch` 方法，那么如果它 `rejected`，并不会触发 `Promise.all` 的 `catch` 方法。

```javascript
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e);

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ["hello", Error: 报错了]
```

上面代码中，`p1` 会 `resolved`，`p2` 首先会 `rejected`，但是 `p2` 有自己的 `catch` 方法，该方法返回的是一个新的 Promise 实例，`p2` 指向的实际上是这个实例。该实例执行完 `catch` 方法后，也会变成 `resolved`，导致 `Promise.all` 方法参数里面的两个实例都会 `resolved`，因此会调用 `then` 方法指定的回调函数，而不会调用 `catch` 方法指定的回调函数。如果 `p2` 没有自己的 `catch` 方法，就会调用 `Promise.all` 的 `catch` 方法。

## 七、Promise.any()

`Promise.any` 方法会在所有 Promise 对象 `rejected` 或者任何一个 Promise 对象 `resolved` 之后兑现。

注意，`Promise.any` 抛出的错误是一个 AggregateError 实例。

## 八、Promise.race()

`Promise.race` 方法会在任意一个 Promise 对象 `resolved` 或者 `rejected` 之后兑现。

## 九、Promise.allSettled()

`Promise.allSettled` 方法会在所有 Promise 对象 `resolved` 或者 `rejected` 之后兑现。

## 十、Promise.resolve()

`Promise.resolve` 方法返回一个新的 Promise。它的参数分成四种情况。

### 10.1 参数是 Promise 实例

如果参数是 Promise 实例，那么 `Promise.resolve` 将不做任何修改、原封不动地返回这个实例。

### 10.2 参数是 thenable 对象

thenable 对象指的是具有 `then` 方法的对象，`Promise.resolve` 方法会将这个对象转为 Promise 对象，然后就立即执行 thenable 对象的 `then` 方法。

```javascript
const thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

const p1 = Promise.resolve(thenable);
p1.then(value => {
  console.log(value);  // 42
});
```

### 10.3 参数不是具有 then 方法的对象，或根本就不是对象

如果参数是一个原始值，或者是一个不具有 `then` 方法的对象，则 `Promise.resolve` 方法返回一个新的 Promise 对象，状态为 `resolved`。

```javascript
Promise.resolve('Hello').then(s => {
  console.log(s)
});
// Hello
```

### 10.4 不带有任何参数

`Promise.resolve` 方法允许调用时不带参数，直接返回一个 `resolved` 状态的 Promise 对象。

需要注意的是，立即 `resolve` 的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。

```javascript
setTimeout(() => {
  console.log('three');
}, 0);

Promise.resolve().then(() => {
  console.log('two');
});

console.log('one');
// one
// two
// three
```

上面代码中，`setTimeout(fn, 0)` 在下一轮“事件循环”开始时执行，`Promise.resolve` 在本轮“事件循环”结束时执行，`console.log('one')` 则是立即执行，因此最先输出。

## 十一、Promise.reject()

`Promise.reject` 方法返回一个 `rejected` 的 Promise 对象。

## 十二、Promise.try()

`Promise.try` 方法接受一个回调函数（比如，带有返回值、抛出错误、同步或者异步等），然后将其结果包装为一个 Promise。可以认为，`Promise.try` 就是模拟的 `try` 代码块。

注意，`Promise.try` 目前只是一个 [提案](https://github.com/tc39/proposal-promise-try)，还未纳入正式的 ES 标准。

## 参考

- 阮一峰，[Promise 对象](https://es6.ruanyifeng.com/#docs/promise)
