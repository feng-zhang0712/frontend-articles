# Proxy

## 一、概述

Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改。

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```javascript
var proxy = new Proxy(target, handler);
```

Proxy 对象的所有用法，都是上面这种形式，不同的只是 `handler` 参数的写法。

- `new Proxy()` 表示生成一个 Proxy 实例。
- `target` 参数表示所要拦截的目标对象。
- `handler` 参数是用来定制拦截行为的对象。

（1）要使得 Proxy 起作用，必须针对 Proxy 实例进行操作，而不是针对目标对象进行操作。

（2）如果 `handler` 没有设置任何拦截，那就等同于直接通向原对象。

（3）Proxy 对象，可以设置到对象的属性上，从而可以在对象上调用；也可以作为其他对象的原型对象。

（4）同一个拦截器函数，可以设置拦截多个操作。

Proxy 支持的拦截操作共 13 种。

- **`construct(target, arguments)`**：拦截 Proxy 实例作为构造函数调用的操作，比如 `new proxy(...arguments)`。
- **`apply(target, object, arguments)`**：拦截 Proxy 实例作为函数调用的操作，比如 `proxy(...arguments)`、`proxy.call(object, ...arguments)`、`proxy.apply(...)`。
- **`get(target, property, receiver)`**：拦截对象属性的读取，比如 `proxy.foo` 和 `proxy['foo']`。
- **`set(target, property, value, receiver)`**：拦截对象属性的设置，比如 `proxy.foo = v` 或 `proxy['foo'] = v`，返回一个布尔值。
- **`has(target, property)`**：拦截 `property in proxy` 的操作，返回一个布尔值。
- **`defineProperty(target, property, propDesc)`**：拦截 `Object.defineProperty(proxy, property, propDesc)`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。
- **`deleteProperty(target, property)`**：拦截 `delete proxy[property]` 的操作，返回一个布尔值。
- **`getPrototypeOf(target)`**：拦截 `Object.getPrototypeOf(proxy)`，返回一个对象。
- **`setPrototypeOf(target, proto)`**：拦截 `Object.setPrototypeOf(proxy, proto)`，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- **`ownKeys(target)`**：拦截 `Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in` 循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 `Object.keys()` 的返回结果仅包括目标对象自身的可遍历属性。
- **`getOwnPropertyDescriptor(target, property)`**：拦截 `Object.getOwnPropertyDescriptor(proxy, property)`，返回属性的描述对象。
- **`preventExtensions(target)`**：拦截 `Object.preventExtensions(proxy)`，返回一个布尔值。
- **`isExtensible(target)`**：拦截 `Object.isExtensible(proxy)`，返回一个布尔值。

## 二、Proxy 实例的方法

### 2.1 construct()

`construct` 方法用于拦截 `new` 命令。

```javascript
const p = new Proxy(function () {}, {
  construct: function(target, arguments, newTarget) {
    console.log('called: ' + arguments.join(', '));
    return {
      value: arguments[0] * 10,
    };
  }
});

(new p(1)).value
// "called: 1"
// 10
```

construct 方法接受三个参数。

- `target`：目标对象。
- `arguments`：构造函数的参数数组。
- `newTarget`：创造实例对象时，`new` 命令作用的构造函数。

（1）`construct` 方法返回的必须是一个对象，否则会报错。

（2）`construct` 方法拦截的是构造函数，所以它的目标对象必须是函数，否则就会报错。

（3）`construct` 方法中的 `this` 指向的是 `handler`，而不是实例对象。

### 2.2 apply()

`apply` 方法拦截函数的调用、`call` 和 `apply` 操作。

`apply` 方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。

```javascript
var twice = {
  apply (target, ctx, arguments) {
    return Reflect.apply(...arguments) * 2;
  }
};

function sum (left, right) {
  return left + right;
};

var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```

上面代码中，每当执行 proxy 函数（直接调用或 `call` 和 `apply` 调用），就会被 `apply` 方法拦截。

另外，直接调用 `Reflect.apply` 方法，也会被拦截。

### 2.3 get()

`get` 方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（可选）。

（1）get方法可以继承。

```javascript
let proto = new Proxy({}, {
  get(target, propertyKey, receiver) {
    console.log('GET ' + propertyKey);
    return target[propertyKey];
  }
});

let obj = Object.create(proto);
obj.foo // "GET foo"
```

上面代码中，拦截操作定义在 Prototype 对象上面，读取 `obj` 对象继承的属性时，拦截会生效。

（2）利用 Proxy，可以将读取属性的操作（get），转变为执行某个函数，从而实现属性的链式操作。

```javascript
var pipe = function (value) {
  var funcStack = [];
  var oproxy = new Proxy({} , {
    get : function (pipeObject, fnName) {
      if (fnName === 'get') {
        return funcStack.reduce(function (val, fn) {
          return fn(val);
        },value);
      }
      funcStack.push(window[fnName]);
      return oproxy;
    }
  });

  return oproxy;
}

var double = n => n * 2;
var pow    = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63
```

上面代码设置 Proxy 以后，达到了将函数名链式使用的效果。

（3）get 方法的第三个参数，总是指向原始的读操作所在的那个对象，一般情况下就是 Proxy 实例。

```javascript
const proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true
```

上面代码中，proxy 对象的 `getReceiver` 属性会被 `get` 方法拦截，得到的返回值就是 proxy 对象。

（4）如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错。

```javascript
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, property) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo // TypeError: Invariant check failed
```

### 2.4 set()

`set` 方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身（可选）。

（1）如果目标对象自身的某个属性不可写，那么 `set` 方法将不起作用。

（2）set 代理应当返回一个布尔值。严格模式下，set 代理如果没有返回 true，就会报错。

```javascript
'use strict';
const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = receiver;
    // 如果这里是 false 或者 undefined 会报错。
    return true;
  }
};
const proxy = new Proxy({}, handler);
proxy.foo = 'bar';
```

### 2.5 has()

`has` 方法用来拦截 HasProperty 操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是 `in` 运算符。

`has` 方法可以接受两个参数，分别是目标对象、需查询的属性名。

如果原对象不可配置或者禁止扩展，这时 `has` 方法拦截会报错。

```javascript
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};

var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false
```

上面代码中，如果原对象的属性名的第一个字符是下划线，`proxy.has` 方法就会返回 false，从而不会被 `in` 运算符发现。

### 2.6 defineProperty()

`defineProperty` 方法拦截 `Object.defineProperty()` 操作。

```javascript
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};

var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' // 不会生效
```

上面代码中，`defineProperty` 方法内部没有任何操作，只返回 `false`，导致添加新属性总是无效。注意，这里的 `false` 只是用来提示操作失败，本身并不能阻止添加新属性。

注意，如果目标对象不可扩展（non-extensible），则 `defineProperty` 方法不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则 `defineProperty` 方法不得改变这两个设置。

### 2.7 deleteProperty()

`deleteProperty` 方法用于拦截 `delete` 操作，如果这个方法抛出错误或者返回 `false`，当前属性就无法被 `delete` 命令删除。

```javascript
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    delete target[key];
    return true;
  }
};

function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop
// Error: Invalid attempt to delete private "_prop" property
```

注意，目标对象自身的不可配置（configurable）的属性，不能被 `deleteProperty` 方法删除，否则报错。

### 2.8 getPrototypeOf()

`getPrototypeOf` 方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。

- `Object.prototype.__proto__`
- `Object.prototype.isPrototypeOf()`
- `Object.getPrototypeOf()`
- `Reflect.getPrototypeOf()`
- `instanceof`

```javascript
var proto = {};
var p = new Proxy({}, {
  getPrototypeOf(target) {
    return proto;
  }
});

Object.getPrototypeOf(p) === proto // true
```

注意，`getPrototypeOf` 方法的返回值必须是对象或者 `null`，否则报错。另外，如果目标对象不可扩展（non-extensible），`getPrototypeOf` 方法必须返回目标对象的原型对象。

### 2.9 setPrototypeOf()

`setPrototypeOf` 方法主要用来拦截 `Object.setPrototypeOf` 方法。

```javascript
var handler = {
  setPrototypeOf (target, proto) {
    throw new Error('Changing the prototype is forbidden');
  }
};

var proto = {};
var target = function () {};
var proxy = new Proxy(target, handler);
Object.setPrototypeOf(proxy, proto);
// Error: Changing the prototype is forbidden
```

注意，该方法只能返回布尔值，否则会被自动转为布尔值。另外，如果目标对象不可扩展（non-extensible），`setPrototypeOf` 方法不得改变目标对象的原型。

### 2.10 ownKeys()

ownKeys 方法用来拦截对象自身属性的读取操作。具体来说，拦截以下操作。

- Object.getOwnPropertyNames()
- Object.getOwnPropertySymbols()
- Object.keys()
- for...in

（1）ownKeys 方法可以拦截 Object.keys 操作。

```javascript
let target = {
  a: 1,
  b: 2,
  c: 3
};

let handler = {
  ownKeys(target) {
    return ['a'];
  }
};

let proxy = new Proxy(target, handler);
Object.keys(proxy)
// [ 'a' ]
```

上面代码拦截了对于 target 对象的 Object.keys 操作，只返回 a、b、c 三个属性中的 a 属性。

（2）ownKeys 方法可以拦截 Object.getOwnPropertyNames 操作。

```javascript
var p = new Proxy({}, {
  ownKeys: function(target) {
    return ['a', 'b', 'c'];
  }
});

Object.getOwnPropertyNames(p)
// [ 'a', 'b', 'c' ]
```

（3）ownKeys 方法可以拦截 for...in 循环。

```javascript
const obj = { hello: 'world' };
const proxy = new Proxy(obj, {
  ownKeys: function () {
    return ['a', 'b'];
  }
});

for (let key in proxy) {
  console.log(key); // 没有任何输出
}
```

上面代码中，ownkeys 方法指定只返回 a 和 b 属性，由于 obj 没有这两个属性，因此 for...in 循环不会有任何输出。

（4）ownKeys 方法返回的数组成员，只能是字符串或 Symbol 值。如果有其他类型的值，或者返回的根本不是数组，就会报错。

（5）如果目标对象自身包含不可配置的属性，则该属性必须被 ownKeys 方法返回，否则报错。

（6）如果目标对象是不可扩展的（non-extensible），这时 ownKeys 方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错。

```javascript
var obj = {
  a: 1
};

Object.preventExtensions(obj);

var p = new Proxy(obj, {
  ownKeys: function(target) {
    return ['a', 'b'];
  }
});

Object.getOwnPropertyNames(p)
// Uncaught TypeError: 'ownKeys' on proxy: trap returned extra keys but proxy target is non-extensible
```

上面代码中，obj 对象是不可扩展的，这时 ownKeys 方法返回的数组之中，包含了 obj 对象的多余属性 b，所以导致了报错。

### 2.11 getOwnPropertyDescriptor()

`getOwnPropertyDescriptor` 方法拦截 `Object.getOwnPropertyDescriptor` 方法，返回一个属性描述对象或者 `undefined`。

```javascript
var handler = {
  getOwnPropertyDescriptor (target, key) {
    if (key[0] === '_') {
      return;
    }
    return Object.getOwnPropertyDescriptor(target, key);
  }
};

var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat')
// undefined

Object.getOwnPropertyDescriptor(proxy, '_foo')
// undefined

Object.getOwnPropertyDescriptor(proxy, 'baz')
// { value: 'tar', writable: true, enumerable: true, configurable: true }
```

### 2.12 preventExtensions()

preventExtensions 方法拦截 Object.preventExtensions 方法。该方法必须返回一个布尔值，否则会被自动转为布尔值。

这个方法有一个限制，只有目标对象不可扩展时（即 Object.isExtensible(proxy) 为 false），proxy.preventExtensions 才能返回 true，否则会报错。

```javascript
var proxy = new Proxy({}, {
  preventExtensions: function(target) {
    return true;
  }
});

Object.preventExtensions(proxy)
// Uncaught TypeError: 'preventExtensions' on proxy: trap returned truish but the proxy target is extensible
```

上面代码中，proxy.preventExtensions 方法返回 true，但这时 Object.isExtensible(proxy) 会返回 true，因此报错。

为了防止出现这个问题，通常要在 proxy.preventExtensions 方法里面，调用一次 Object.preventExtensions 方法。

```javascript
var proxy = new Proxy({}, {
  preventExtensions: function(target) {
    console.log('called');
    Object.preventExtensions(target);
    return true;
  }
});

Object.preventExtensions(proxy)
// "called"
// Proxy {}
```

### 2.13 isExtensible()

`isExtensible` 方法拦截 `Object.isExtensible` 操作。

```javascript
var p = new Proxy({}, {
  isExtensible: function(target) {
    console.log("called");
    return true;
  }
});

Object.isExtensible(p)
// "called"
// true
```

注意，该方法只能返回布尔值，否则返回值会被自动转为布尔值。

这个方法有一个强限制，它的返回值必须与目标对象的 `isExtensible` 属性保持一致，否则就会抛出错误。

```javascript
Object.isExtensible(proxy) === Object.isExtensible(target)
```

下面是一个例子。

```javascript
var p = new Proxy({}, {
  isExtensible: function(target) {
    return false;
  }
});

Object.isExtensible(p)
// Uncaught TypeError: 'isExtensible' on proxy: trap result does not reflect extensibility of proxy target (which is 'true')
```

## 三、Proxy.revocable()

`Proxy.revocable` 方法返回一个可取消的 Proxy 实例。

```javascript
let target = {};
let handler = {};

let { proxy, revoke } = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```

`Proxy.revocable` 方法返回一个对象，该对象的 proxy 属性是 Proxy 实例，`revoke` 属性是一个函数，可以取消 Proxy 实例。上面代码中，当执行 `revoke` 方法之后，再访问 Proxy 实例，就会抛出一个错误。

`Proxy.revocable` 方法的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

## 四、this 问题

（1）虽然 Proxy 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，无法保证与目标对象的行为一致。主要原因就是在 Proxy 代理的情况下，目标对象内部的 `this` 关键字会指向 Proxy 代理。

```javascript
const target = {
  m: function () {
    console.log(this === proxy);
  }
};
const handler = {};

const proxy = new Proxy(target, handler);

target.m() // false
proxy.m()  // true
```

上面代码中，一旦 proxy 代理 target，`target.m` 方法内部的 `this` 就是指向 proxy，而不是 target。所以，虽然 proxy 没有做任何拦截，`target.m` 方法和 `proxy.m` 方法返回不一样的结果。

（2）有些原生对象的内部属性，只有通过正确的 this 才能拿到，所以 Proxy 也无法代理这些原生对象的属性。

```javascript
const target = new Date();
const handler = {};
const proxy = new Proxy(target, handler);

proxy.getDate();
// TypeError: this is not a Date object.
```

上面代码中，`getDate` 方法只能在 Date 对象实例上面拿到，如果 `this` 不是 Date 对象实例就会报错。这时，`this` 绑定原始对象，就可以解决这个问题。

```javascript
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);

proxy.getDate() // 1
```

（3）Proxy 拦截函数内部的 `this`，指向的是 `handler` 对象。

```javascript
const handler = {
  get: function (target, key, receiver) {
    console.log(this === handler);
    return 'Hello, ' + key;
  },
  set: function (target, key, value) {
    console.log(this === handler);
    target[key] = value;
    return true;
  }
};

const proxy = new Proxy({}, handler);

proxy.foo
// true
// Hello, foo

proxy.foo = 1
// true
```

上面例子中，get 方法和 set 方法拦截函数内部的 this，指向的都是 handler 对象。

## 五、参考

- 阮一峰，[Proxy](https://es6.ruanyifeng.com/#docs/proxy)
