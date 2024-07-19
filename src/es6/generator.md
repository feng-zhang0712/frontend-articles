# Generator 函数

## 一、简介

### 1.1 基本概念

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。Generator 函数有多种理解角度。

- **状态机**：语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。
- **遍历器对象生成函数**：执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

Generator 函数是一个普通函数，但是有两个特征。

- function 关键字与函数名之间有一个星号（`*`）。
- 函数体内部使用 `yield` 表达式，定义不同的内部状态。

Generator 函数的调用方法与普通函数一样，不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的遍历器对象（Iterator Object）。调用遍历器对象的 `next` 方法，指针移向下一个状态，直到遇到下一个 `yield` 表达式（或 `return` 语句）为止。换言之，Generator 函数是分段执行的，`yield` 表达式是暂停执行的标记，而 `next` 方法是恢复执行的标记。

每次调用 `next` 方法都会返回一个对象，对象的 `value` 属性指向当前 `yield` 表达式后面的值，`done` 属性是一个布尔值，表示是否遍历完成。

### 1.2 yield 表达式

遍历器对象的next方法的运行逻辑如下。

（1）遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield` 后面的那个表达式的值，作为返回的对象的 `value` 属性值。

（2）下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式。

（3）如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值。

（4）如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`。

注意，`yield` 表达式只能用在 Generator 函数里面，用在其他地方会报错。

### 1.3 与 Iterator 接口的关系

任意一个对象的 `Symbol.iterator` 方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的 `Symbol.iterator` 属性，从而使得该对象具有 Iterator 接口。

Generator 函数执行后返回的遍历器对象，也具有 `Symbol.iterator` 属性，执行后返回自身。

```javascript
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g // true
```

## 二、next 方法的参数

next 方法可以带一个参数，该参数会被当作上一个 yield 表达式的返回值。Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。通过 next 方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值，从而调整函数行为。

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}
```

上面代码中，第二次运行 `next` 方法的时候不带参数，导致 y 的值等于 2 * undefined（即 NaN），除以 3 以后还是 NaN，因此返回对象的 `value` 属性也等于 NaN。第三次运行 `next` 方法的时候不带参数，所以 z 等于 undefined，返回对象的 `value` 属性等于 5 + NaN + undefined，即 NaN。

```javascript
var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

- 第一次调用 b 的 `next` 方法时，返回 x+1 的值6。
- 第二次调用 `next` 方法，将上一次 `yield` 表达式的值设为12，因此 y 等于24，返回 y / 3 的值8。
- 第三次调用 `next` 方法，将上一次 `yield` 表达式的值设为13，因此 z 等于13，这时 x 等于5，y 等于24，所以 `return` 语句的值等于42。

注意，由于 `next` 方法的参数表示上一个 `yield` 表达式的返回值，所以在第一次使用 `next` 方法时，传递参数是无效的。

## 三、for...of 循环

`for...of` 循环可以自动遍历 Generator 函数运行时生成的 Iterator 对象，且此时不再需要调用 `next` 方法。

```javascript
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3
```

注意，一旦 `next` 方法的返回对象的 `done` 属性为 `true`，`for...of` 循环就会中止，**且不包含该返回对象**，所以上面代码的 `return` 语句返回的 4，不包括在 `for...of` 循环之中。

原生的 JavaScript 对象没有遍历接口，无法使用 `for...of` 循环，可以通过 Generator 函数为它加上这个接口。

```javascript
function* objectEntries(obj) {
  let keys = Reflect.ownKeys(obj);

  for (let key of keys) {
    yield [key, obj[key]];
  }
}

let obj = { name: 'Jane' };

for (let [key, value] of objectEntries(obj)) {
  console.log(`${key}: ${value}`);
}
// name: Jane
```

上面代码中，对象 `obj` 原生不具备 Iterator 接口，无法用 `for...of` 遍历。这时，我们通过 Generator 函数 `objectEntries` 为它加上遍历器接口，就可以用 `for...of` 遍历了。

加上遍历器接口的另一种写法是，将 Generator 函数加到对象的 `Symbol.iterator` 属性上面。

```javascript
function* objectEntries() {
  let keys = Object.keys(this);

  for (let key of keys) {
    yield [key, this[key]];
  }
}

let obj = { name: 'Jane' };

obj[Symbol.iterator] = objectEntries;

for (let [key, value] of obj) {
  console.log(`${key}: ${value}`);
}
// name: Jane
```

除了 `for...of` 循环以外，扩展运算符（`...`）、解构赋值和 `Array.from` 方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。

```javascript
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// Array.from 方法
Array.from(numbers()) // [1, 2]

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

## 四、Generator.prototype.throw()

（1）Generator 函数返回的遍历器对象，有个 `throw` 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

```javascript
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

上面代码中，遍历器对象 i 连续抛出两个错误。

- 第一个错误被 Generator 函数体内的 `catch` 语句捕获。
- i 第二次抛出错误，由于 Generator 函数内部的 `catch` 语句已经执行过了，就不会再捕捉到这个错误，所以这个错误被抛出了 Generator 函数体，被函数体外的 `catch` 语句捕获。

（2）`throw` 方法可以接受一个参数，该参数会被 `catch` 语句接收，建议抛出 Error 对象的实例。

```javascript
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

var i = g();
i.next();
i.throw(new Error('出错了！'));
// Error: 出错了！(…)
```

（3）如果 Generator 函数内部没有部署 `try...catch` 代码块，那么 `throw` 方法抛出的错误，将被外部 `try...catch` 代码块捕获。

```javascript
var g = function* () {
  while (true) {
    yield;
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 a
```

如果 Generator 函数内部和外部，都没有部署 `try...catch` 代码块，那么程序将报错，直接中断执行。

```javascript
var gen = function* gen(){
  yield console.log('hello');
  yield console.log('world');
}

var g = gen();
g.next();
g.throw();
// hello
// Uncaught undefined
```

（4）`throw` 方法抛出的错误要被内部捕获，前提是必须至少执行过一次 `next` 方法。

```javascript
function* gen() {
  try {
    yield 1;
  } catch (e) {
    console.log('内部捕获');
  }
}

var g = gen();
g.throw(1);
// Uncaught 1
```

上面代码中，`g.throw(1)` 执行时，`next` 方法一次都没有执行过。这时，抛出的错误不会被内部捕获，而是直接在外部抛出，导致程序出错。这种行为其实很好理解，因为第一次执行 `next` 方法，等同于启动执行 Generator 函数的内部代码，否则 Generator 函数还没有开始执行，这时 throw 方法抛错只可能抛出在函数外部。

（5）`throw` 方法被内部捕获以后，会附带执行到下一条 `yield` 表达式，这种情况下等同于执行一次 `next` 方法。

```javascript
var gen = function* gen(){
  try {
    yield 1;
  } catch (e) {
    yield 2;
  }
  yield 3;
}

var g = gen();
g.next() // { value:1, done:false }
g.throw() // { value:2, done:false }
g.next() // { value:3, done:false }
g.next() // { value:undefined, done:true }
```

上面代码中，`g.throw` 方法被内部捕获以后，等同于执行了一次 `next` 方法，所以返回 `{ value:2, done:false }`。另外，也可以看到，只要 Generator 函数内部部署了 `try...catch` 代码块，那么遍历器的 `throw` 方法抛出的错误，不影响下一次遍历。

注意，另外，全局的 `throw` 命令与 `g.throw` 方法是无关的，两者互不影响。

（6）Generator 函数体外抛出的错误，可以在函数体内捕获；反过来，Generator 函数体内抛出的错误，也可以被函数体外的 `catch` 捕获。

```javascript
function* foo() {
  var x = yield 3;
  var y = x.toUpperCase();
  yield y;
}

var it = foo();

it.next(); // { value:3, done:false }

try {
  it.next(42);
} catch (err) {
  console.log(err); // TypeError: x.toUpperCase is not a function
}
```

上面代码中，第二个 `next` 方法向函数体内传入一个参数 42，数值是没有 `toUpperCase` 方法的，所以会抛出一个 TypeError 错误，被函数体外的 `catch` 捕获。

一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了。如果此后还调用 `next` 方法，将返回 `{ value: undefined, done: true }` 对象，即 JavaScript 引擎认为这个 Generator 已经运行结束了。

## 五、Generator.prototype.return()

（1）Generator 函数返回的遍历器对象，有个 `return()` 方法，可以返回给定的值，并且终结遍历 Generator 函数。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

上面代码中，遍历器对象 g 调用 `return()` 方法后，返回值的 `value` 属性就是 `return()` 方法的参数 foo。并且，Generator 函数的遍历就终止了，返回值的 `done` 属性为 true，以后再调用 `next` 方法，`done` 属性总是返回 true。

如果 `return()` 方法调用时，不提供参数，则返回值的 `value` 属性为 undefined。

（2）如果 Generator 函数内部有 `try...finally` 代码块，且正在执行 `try` 代码块，那么 `return()` 方法会导致立刻进入 `finally` 代码块，执行完以后，整个函数才会结束。

```javascript
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

上面代码中，调用 `return()` 方法后，就开始执行 `finally` 代码块，不执行 `try` 里面剩下的代码了，然后等到 `finally` 代码块执行完，再返回 `return()` 方法指定的返回值。

## 六、next()、throw()、return() 的共同点

`next()`、`throw()`、`return()` 这三个方法本质上是同一件事，它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换 `yield` 表达式。

（1）`next()` 是将 `yield` 表达式替换成一个值。

```javascript
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};

const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}

gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```

上面代码中，第二个 `next(1)` 方法就相当于将 `yield` 表达式替换成一个值1。如果 `next` 方法没有参数，就相当于替换成 undefined。

（2）`throw()` 是将 `yield` 表达式替换成一个 `throw` 语句。

```javascript
gen.throw(new Error('出错了')); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```

（3）`return()` 是将 `yield` 表达式替换成一个 `return` 语句。

```javascript
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

## 七、yield* 表达式

（1）ES6 提供了 `yield*` 表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数。

```javascript
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

作为对比，看下边一个例子。

```javascript
function* inner() {
  yield 'hello!';
}

function* outer1() {
  yield 'open';
  yield inner();
  yield 'close';
}

var gen = outer1()
gen.next().value // "open"
gen.next().value // 返回一个遍历器对象
gen.next().value // "close"

function* outer2() {
  yield 'open'
  yield* inner()
  yield 'close'
}

var gen = outer2()
gen.next().value // "open"
gen.next().value // "hello!"
gen.next().value // "close"
```

上面例子中，outer2 使用了 `yield*`，outer1 没使用。结果就是，outer2 返回该遍历器对象的内部值，outer1 返回一个遍历器对象。

（2）从语法角度看，如果 `yield` 表达式后面跟的是一个遍历器对象，需要在 `yield` 表达式后面加上星号（`*`），表明它返回的是一个遍历器对象。这被称为 `yield*` 表达式。

`yield*` 后面的 Generator 函数，如果没有 `return` 语句，等同于在 Generator 函数内部，部署一个 `for...of` 循环。

```javascript
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

// 等同于

function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

注意，在有 `return` 语句时，则需要用 `var value = yield* iterator` 的形式获取 `return` 语句的值。

（3）如果 `yield*` 后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。

```javascript
function* gen(){
  yield* ["a", "b", "c"];
}

gen().next() // { value:"a", done:false }
```

上面代码中，`yield` 命令后面如果不加星号，返回的是整个数组，加了星号就表示返回的是数组的遍历器对象。

实际上，任何数据结构只要有 Iterator 接口，就可以被 `yield*` 遍历。

```javascript
let read = (function* () {
  yield 'hello';
  yield* 'hello';
})();

read.next().value // "hello"
read.next().value // "h"
```

上面代码中，`yield` 表达式返回整个字符串，`yield*` 语句返回单个字符。因为字符串具有 Iterator 接口，所以被 `yield*` 遍历。

（4）如果被代理的 Generator 函数有 `return` 语句，那么就可以向代理它的 Generator 函数返回数据。

```javascript
function* foo() {
  yield 2;
  yield 3;
  return "foo";
}

function* bar() {
  yield 1;
  var v = yield* foo();
  console.log("v: " + v);
  yield 4;
}

var it = bar();

it.next()
// {value: 1, done: false}
it.next()
// {value: 2, done: false}
it.next()
// {value: 3, done: false}
it.next();
// "v: foo"
// {value: 4, done: false}
it.next()
// {value: undefined, done: true}
```

上面代码在第四次调用 `next` 方法的时候，屏幕上会有输出，这是因为函数 `foo` 的 `return` 语句，向函数 `bar` 提供了返回值。

```javascript
function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}
function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

[...logReturned(genFuncWithReturn())]
// The result
// [ 'a', 'b' ]
```

上面代码中，存在两次遍历。

- 第一次是扩展运算符遍历函数 `logReturned` 返回的遍历器对象。
- 第二次是 `yield*` 语句遍历函数 `genFuncWithReturn` 返回的遍历器对象。

这两次遍历的效果是叠加的，最终表现为扩展运算符遍历函数 `genFuncWithReturn` 返回的遍历器对象。所以，最后的数据表达式得到的值等于 `[ 'a', 'b' ]`。但是，函数 `genFuncWithReturn` 的 `return` 语句的返回值 `The result`，会返回给函数 `logReturned` 内部的 `result` 变量，因此会有终端输出。

（5）`yield*` 命令可以很方便地取出嵌套数组的所有成员。

```javascript
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}
// a
// b
// c
// d
// e
```

由于扩展运算符 `...` 默认调用 Iterator 接口，所以上面这个函数也可以用于嵌套数组的平铺。

```javascript
[...iterTree(tree)] // ["a", "b", "c", "d", "e"]
```

## 八、作为对象属性的 Generator 函数

如果一个对象的属性是 Generator 函数，可以简写成下面的形式。

```javascript
let obj = {
  * generator() {
    ···
  }
};

// 等同于
let obj = {
  generator: function* () {
    // ···
  }
};
```

## 九、Generator 函数的 this

（1）ES6 规定，Generator 函数返回的遍历器对象，是 Generator 函数的实例，也继承了 Generator 函数的 prototype 对象上的方法。但是，如果把 Generator 函数当作普通的构造函数，并不会生效，因为 Generator 函数返回的总是遍历器对象，而不是 this 对象。

```javascript
function* g() {
  this.a = 11;
}

let obj = g();
obj.next();
obj.a // undefined
```

上面代码中，Generator 函数 g 在 this 对象上面添加了一个属性 a，但是 obj 对象拿不到这个属性。

（2）Generator 函数也不能跟 new 命令一起用，会报错。

## 十、含义

### 10.1 Generator 与状态机

Generator 是实现状态机的最佳结构。比如，下面的 clock 函数就是一个状态机。

```javascript
var ticking = true;
var clock = function() {
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}
```

上面代码的 clock 函数一共有两种状态（Tick 和 Tock），每运行一次，就改变一次状态。这个函数如果用 Generator 实现，就是下面这样。

```javascript
var clock = function* () {
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
};
```

上面的 Generator 实现与 ES5 实现对比，可以看到少了用来保存状态的外部变量 ticking，这样就更简洁，更安全（状态不会被非法篡改）、更符合函数式编程的思想，在写法上也更优雅。Generator 之所以可以不用外部变量保存状态，是因为它本身就包含了一个状态信息，即目前是否处于暂停态。

### 10.2 Generator 与协程

#### （1）协程与子例程的差异

传统的“子例程”（subroutine）采用堆栈式“后进先出”的执行方式，只有当调用的子函数完全执行完毕，才会结束执行父函数。协程与其不同，多个线程（单线程情况下，即多个函数）可以并行执行，但是只有一个线程（或函数）处于正在运行的状态，其他线程（或函数）都处于暂停态（suspended），线程（或函数）之间可以交换执行权。也就是说，一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），等到稍后收回执行权的时候，再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就称为协程。

从实现上看，在内存中，子例程只使用一个栈（stack），而协程是同时存在多个栈，但只有一个栈是在运行状态，也就是说，协程是以多占用内存为代价，实现多任务的并行。

#### （2）协程与普通线程的差异

不难看出，协程适合用于多任务运行的环境。在这个意义上，它与普通的线程很相似，都有自己的执行上下文、可以分享全局变量。它们的不同之处在于，同一时间可以有多个线程处于运行状态，但是运行的协程只能有一个，其他协程都处于暂停状态。此外，普通的线程是抢先式的，到底哪个线程优先得到资源，必须由运行环境决定，但是协程是合作式的，执行权由协程自己分配。

由于 JavaScript 是单线程语言，只能保持一个调用栈。引入协程以后，每个任务可以保持自己的调用栈。这样做的最大好处，就是抛出错误的时候，可以找到原始的调用栈。不至于像异步操作的回调函数那样，一旦出错，原始的调用栈早就结束。

Generator 函数是 ES6 对协程的实现，但属于不完全实现。Generator 函数被称为“半协程”（semi-coroutine），意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。

如果将 Generator 函数当作协程，完全可以将多个需要互相协作的任务写成 Generator 函数，它们之间使用yield表达式交换控制权。

### 10.3 Generator 与上下文

JavaScript 代码运行时，会产生一个全局的上下文环境（context，又称运行环境），包含了当前所有的变量和对象。然后，执行函数（或块级代码）的时候，又会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前（active）的上下文，由此形成一个上下文环境的堆栈（context stack）。

这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，然后再执行完成它下层的上下文，直至所有代码执行完成，堆栈清空。

Generator 函数不是这样，它执行产生的上下文环境，一旦遇到yield命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。等到对它执行next命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。

```javascript
function* gen() {
  yield 1;
  return 2;
}

let g = gen();

console.log(
  g.next().value,
  g.next().value,
);
```

上面代码中，第一次执行 `g.next()` 时，Generator 函数 `gen` 的上下文会加入堆栈，即开始运行 `gen` 内部的代码。等遇到 `yield 1` 时，`gen` 上下文退出堆栈，内部状态冻结。第二次执行 `g.next()` 时，`gen` 上下文重新加入堆栈，变成当前的上下文，重新恢复执行。

## 十一、应用

Generator 可以暂停函数执行，返回任意表达式的值。这种特点使得 Generator 有多种应用场景。

### 11.1 异步操作的同步化表达

### 11.2 控制流管理

### 11.3 部署 Iterator 接口

利用 Generator 函数，可以在任意对象上部署 Iterator 接口。

```javascript
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

### 11.4 作为数据结构

Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。

```javascript
function* doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
```

上面代码就是依次返回三个函数，但是由于使用了 Generator 函数，导致可以像处理数组那样，处理这三个返回的函数。然后，就可以使用 `for...of` 循环进行处理。

不难看出 Generator 使得数据或者操作，具备了类似数组的接口。

## 十二、参考

- 阮一峰，[Generator 函数的语法](https://es6.ruanyifeng.com/#docs/generator)
