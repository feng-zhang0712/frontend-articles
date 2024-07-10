# Symbol

## JavaScript 中的 `Symbol`

`Symbol` 是 ES6 引入的一种新的原始数据类型，表示独一无二的值。每个从 `Symbol` 构造函数创建的 Symbol 都是唯一的，可以用于生成对象的私有属性，避免属性名冲突。

```javascript
const sym1 = Symbol();
const sym2 = Symbol('description');

console.log(typeof sym1); // 输出: "symbol"
console.log(sym2.toString()); // 输出: "Symbol(description)"
```

## Symbol 构造函数

`Symbol` 构造函数不能使用 `new` 关键字创建，因为它不是一个构造器。可以通过 `Symbol()` 或 `Symbol(description)` 创建 Symbol。

```javascript
const sym = Symbol('example');
console.log(sym); // 输出: Symbol(example)
```

## Symbol 的 description 属性

`description` 属性返回 Symbol 的描述字符串。

```javascript
const sym = Symbol('example');
console.log(sym.description); // 输出: "example"
```

## `Symbol.for()`

`Symbol.for` 方法会在全局 Symbol 注册表中查找具有指定键的 Symbol。如果存在，则返回该 Symbol；否则，创建一个新的 Symbol 并添加到全局 Symbol 注册表中。

```javascript
const globalSym = Symbol.for('global');
const sameGlobalSym = Symbol.for('global');

console.log(globalSym === sameGlobalSym); // 输出: true
```

## `Symbol.keyFor()`

`Symbol.keyFor` 方法返回一个在全局 Symbol 注册表中找到的 Symbol 的键。

```javascript
const globalSym = Symbol.for('global');
console.log(Symbol.keyFor(globalSym)); // 输出: "global"
```

## 内置 Symbol

JavaScript 提供了一些内置的 Symbol，用于改变语言内在行为的元编程。

### `Symbol.hasInstance`

用于检测构造函数是否识别一个对象是其实例。

```javascript
class MyClass {
  static [Symbol.hasInstance](instance) {
    return instance instanceof Array;
  }
}

console.log([] instanceof MyClass); // 输出: true
```

### `Symbol.isConcatSpreadable`

用于配置对象数组是否可以在 `Array.prototype.concat()` 中展开。

```javascript
let arr1 = [1, 2];
let arr2 = [3, 4];
arr2[Symbol.isConcatSpreadable] = false;

console.log(arr1.concat(arr2)); // 输出: [1, 2, [3, 4]]
```

### `Symbol.species`

指定用于创建派生对象的构造函数。

```javascript
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}

let arr = new MyArray(1, 2, 3);
let mapped = arr.map(x => x * 2);

console.log(mapped instanceof MyArray); // 输出: false
console.log(mapped instanceof Array); // 输出: true
```

### `Symbol.match`

指定对象是否可以作为 `String.prototype.match()` 的参数。

```javascript
const regex = /foo/;
console.log('foobar'.match(regex)); // 输出: ["foo"]

regex[Symbol.match] = false;
console.log('foobar'.match(regex)); // 输出: null
```

### `Symbol.matchAll`

指定对象是否可以作为 `String.prototype.matchAll()` 的参数。

```javascript
const regex = /foo/g;
const str = 'foo foo';

console.log([...str.matchAll(regex)]); // 输出: [["foo"], ["foo"]]
```

### `Symbol.replace`

指定对象是否可以作为 `String.prototype.replace()` 的参数。

```javascript
const regex = /foo/;
console.log('foobar'.replace(regex, 'bar')); // 输出: "barbar"
```

### `Symbol.search`

指定对象是否可以作为 `String.prototype.search()` 的参数。

```javascript
const regex = /foo/;
console.log('foobar'.search(regex)); // 输出: 0
```

### `Symbol.split`

指定对象是否可以作为 `String.prototype.split()` 的参数。

```javascript
const regex = /o/;
console.log('foobar'.split(regex)); // 输出: ["f", "", "bar"]
```

### `Symbol.iterator`

指定对象的默认迭代器方法。

```javascript
const iterable = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        step++;
        if (step === 1) {
          return { value: 'This', done: false };
        } else if (step === 2) {
          return { value: 'is', done: false };
        } else if (step === 3) {
          return { value: 'iterator', done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (let value of iterable) {
  console.log(value);
}
// 输出:
// This
// is
// iterator
```

### `Symbol.asyncIterator`

指定对象的默认异步迭代器方法。

```javascript
const asyncIterable = {
  [Symbol.asyncIterator]() {
    let step = 0;
    return {
      async next() {
        step++;
        if (step === 1) {
          return { value: 'This', done: false };
        } else if (step === 2) {
          return { value: 'is', done: false };
        } else if (step === 3) {
          return { value: 'async iterator', done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

(async () => {
  for await (let value of asyncIterable) {
    console.log(value);
  }
})();
// 输出:
// This
// is
// async iterator
```

### `Symbol.toPrimitive`

指定对象在转化为原始值时调用的方法。

```javascript
const obj = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return 42;
    }
    return null;
  }
};

console.log(Number(obj)); // 输出: 42
```

### `Symbol.toStringTag`

用于修改对象的默认 `toString()` 行为。

```javascript
class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyClass';
  }
}

const myInstance = new MyClass();
console.log(myInstance.toString()); // 输出: "[object MyClass]"
```

### `Symbol.unscopables`

指定对象的属性在 `with` 语句中不暴露。

```javascript
const obj = {
  foo: 1,
  bar: 2,
  [Symbol.unscopables]: {
    foo: true
  }
};

with (obj) {
  console.log(foo); // 错误: foo is not defined
  console.log(bar); // 输出: 2
}
```

## `Symbol.prototype.valueOf()`

返回 Symbol 的原始值。

```javascript
const sym = Symbol('example');
console.log(sym.valueOf() === sym); // 输出: true
```

## `Symbol.prototype.toString()`

返回 Symbol 的字符串表示形式。

```javascript
const sym = Symbol('example');
console.log(sym.toString()); // 输出: "Symbol(example)"
```
