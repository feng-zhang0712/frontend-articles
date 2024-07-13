# 深拷贝、浅拷贝

## 一、浅拷贝

### 1. 定义

浅拷贝是指创建一个新对象，这个新对象的属性是对原对象属性的引用。如果这些属性是基本类型，拷贝的是基本类型的值；如果这些属性是引用类型，拷贝的是内存地址，因此新旧对象共享同一块内存。

#### 2. 常见方法

- `Array.from()`
- `Array.prototype.concat()`
- `Array.prototype.slice()`
- `Object.assign()`
- `Object.create()`
- 展开运算符（`...`）

```javascript
const original = {
  name: 'Alice',
  age: 25,
  address: {
    city: 'Wonderland',
    zip: '12345'
  }
};

// 使用 Object.assign() 实现浅拷贝
const copy1 = Object.assign({}, original);

// 使用展开运算符实现浅拷贝
const copy2 = { ...original };

copy1.name = 'Bob';
copy1.address.city = 'Dreamland';

console.log(original.name); // 输出 'Alice'
console.log(original.address.city); // 输出 'Dreamland'，因为 address 是引用类型
```

## 二、深拷贝

### 1. 定义

深拷贝是指创建一个新对象，这个新对象完全独立于原对象。所有级别的属性（包括嵌套的对象和数组）都被递归地复制，因此新对象与原对象之间没有任何共享的引用。

### 2. 常见方法

- 递归函数
- `JSON.parse(JSON.stringify())`
- 其他库（如 `lodash` 的 `cloneDeep`）

```javascript
const original = {
  name: 'Alice',
  age: 25,
  address: {
    city: 'Wonderland',
    zip: '12345'
  }
};

// 使用 JSON.parse(JSON.stringify()) 实现深拷贝
const deepCopy1 = JSON.parse(JSON.stringify(original));

// 手动实现深拷贝
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i]);
    }
    return arrCopy;
  }
  const objCopy = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key]);
    }
  }
  return objCopy;
}

const deepCopy2 = deepClone(original);

deepCopy2.name = 'Bob';
deepCopy2.address.city = 'Dreamland';

console.log(original.name); // 输出 'Alice'
console.log(original.address.city); // 输出 'Wonderland'，因为 address 是深拷贝的
```

## 三、比较浅拷贝和深拷贝

| 特性           | 浅拷贝                                 | 深拷贝                                |
| -------------- | -------------------------------------- | ------------------------------------- |
| 实现方法       | `Object.assign()`、展开运算符（`...`） | 递归函数、`JSON.parse(JSON.stringify())`、`lodash.cloneDeep` 等 |
| 拷贝级别       | 仅拷贝一层属性                         | 递归拷贝所有嵌套属性                 |
| 性能           | 较快                                   | 较慢                                  |
| 数据共享       | 引用类型数据共享                       | 无数据共享                            |
| 应用场景       | 对象较浅或不包含嵌套引用类型           | 需要完全独立的副本，包括深层嵌套对象 |

## 四、手动实现浅拷贝和深拷贝

### 1. 手动实现浅拷贝

浅拷贝只需要复制对象的表层属性，而不关心其嵌套的引用类型属性。

```javascript
function shallowClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.slice();
  }
  const clone = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = obj[key];
    }
  }
  return clone;
}

const original = { a: 1, b: { c: 2 } };
const shallowCopy = shallowClone(original);

shallowCopy.b.c = 3;
console.log(original.b.c); // 输出 3，浅拷贝共享引用类型数据
```

### 2. 手动实现深拷贝

深拷贝需要递归地复制所有嵌套的属性，以确保新旧对象完全独立。

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i]);
    }
    return arrCopy;
  }
  const objCopy = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key]);
    }
  }
  return objCopy;
}

const original = { a: 1, b: { c: 2 } };
const deepCopy = deepClone(original);

deepCopy.b.c = 3;
console.log(original.b.c); // 输出 2，深拷贝数据完全独立
```

## 五、注意事项

- **循环引用**：`JSON.parse(JSON.stringify())` 方法无法处理循环引用，会抛出错误。
- **函数和特殊对象**：`JSON.parse(JSON.stringify())` 方法会忽略函数、`undefined`、`Symbol` 等值。如果需要保留这些类型的数据，请使用递归函数或第三方库（如 `lodash`）。

## 示例：处理循环引用的深拷贝

```javascript
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  const result = Array.isArray(obj) ? [] : {};
  hash.set(obj, result);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key], hash);
    }
  }
  return result;
}

const obj = { a: 1 };
obj.b = obj; // 循环引用

const deepCopy = deepClone(obj);
console.log(deepCopy);
```

通过这种方式，可以处理循环引用的深拷贝。
