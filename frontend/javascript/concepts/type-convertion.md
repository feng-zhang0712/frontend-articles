# Javascript 中的类型转换机制

在 JavaScript 中，类型转换（Type Conversion）是一个常见且重要的概念。类型转换可以分为显式转换和隐式转换。

## 一、显式转换

显式转换是指使用明确的语法将一种数据类型转换为另一种数据类型。

### 1. 转换为字符串

- `String()` 函数
- `toString()` 方法

```javascript
// 使用 String() 函数
const num = 123;
const str1 = String(num);
console.log(str1); // 输出 "123"

// 使用 toString() 方法
const str2 = num.toString();
console.log(str2); // 输出 "123"

// 布尔值转换为字符串
const bool = true;
const str3 = String(bool);
console.log(str3); // 输出 "true"
```

### 2. 转换为数字

- `Number()` 函数
- `parseInt()` 函数
- `parseFloat()` 函数

```javascript
// 使用 Number() 函数
const str = "123";
const num1 = Number(str);
console.log(num1); // 输出 123

// 使用 parseInt() 函数
const num2 = parseInt(str);
console.log(num2); // 输出 123

// 使用 parseFloat() 函数
const strFloat = "123.45";
const num3 = parseFloat(strFloat);
console.log(num3); // 输出 123.45

// 布尔值转换为数字
const bool = true;
const num4 = Number(bool);
console.log(num4); // 输出 1
```

### 3. 转换为布尔值

- `Boolean()` 函数

```javascript
// 使用 Boolean() 函数
const str = "Hello";
const bool1 = Boolean(str);
console.log(bool1); // 输出 true

const zero = 0;
const bool2 = Boolean(zero);
console.log(bool2); // 输出 false
```

## 二、隐式转换

隐式转换是指 JavaScript 在需要时自动将一种数据类型转换为另一种数据类型。隐式转换通常发生在以下几种情况下：算术运算、比较运算和逻辑运算。

### 1. 转换为字符串

当一个非字符串类型的数据与字符串进行连接时，非字符串类型的数据会被隐式转换为字符串。

```javascript
const num = 123;
const str = "Number: " + num;
console.log(str); // 输出 "Number: 123"

const bool = true;
const str2 = "Boolean: " + bool;
console.log(str2); // 输出 "Boolean: true"
```

### 2. 转换为数字

当进行算术运算时，非数字类型的数据会被隐式转换为数字。

```javascript
const str = "123";
const result = str - 0;
console.log(result); // 输出 123

const bool = true;
const result2 = bool + 1;
console.log(result2); // 输出 2
```

### 3. 转换为布尔值

在条件判断中，非布尔类型的数据会被隐式转换为布尔值。

```javascript
if ("Hello") {
  console.log("This is truthy"); // 输出 "This is truthy"
}

if (0) {
  console.log("This will not run");
} else {
  console.log("This is falsy"); // 输出 "This is falsy"
}
```

## 三、特殊情况

### 1. `==` 和 `===` 的区别

- `==` 运算符会进行类型转换后再比较
- `===` 运算符不会进行类型转换，要求类型和值都相等

```javascript
console.log(123 == "123"); // 输出 true
console.log(123 === "123"); // 输出 false
```

### 2. `+` 运算符的特殊情况

`+` 运算符不仅用于算术运算，还用于字符串连接。在使用时需要注意其行为差异。

```javascript
console.log(1 + "2"); // 输出 "12"，数字被转换为字符串
console.log(1 + 2); // 输出 3，进行算术运算
```

## 四、手动实现类型转换

### 1. 转换为字符串

```javascript
function toString(value) {
  return value + '';
}

console.log(toString(123)); // 输出 "123"
console.log(toString(true)); // 输出 "true"
```

### 2. 转换为数字

```javascript
function toNumber(value) {
  return +value;
}

console.log(toNumber("123")); // 输出 123
console.log(toNumber(true)); // 输出 1
```

### 3. 转换为布尔值

```javascript
function toBoolean(value) {
  return !!value;
}

console.log(toBoolean("Hello")); // 输出 true
console.log(toBoolean(0)); // 输出 false
```
