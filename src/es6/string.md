# 字符串的扩展

## 一、字符的 Unicode 表示法

ES6 允许采用 `\uxxxx` 形式表示一个字符，其中 `xxxx` 表示字符的 Unicode 码点。并且，只要将码点放入大括号，就能正确解读该字符。

```javascript
"\u0061"
// "a"

"\u{20BB7}"
// "𠮷"
```

## 二、字符串的遍历器接口

ES6 为字符串添加了遍历器接口，使得字符串可以被 `for...of` 循环遍历。它的最大的优点是可以识别大于 `0xFFFF` 的码点，传统的 `for` 循环无法识别这样的码点。

```javascript
const text = String.fromCodePoint(0x20BB7);
for (let i of text) {
  console.log(i);
}
// "𠮷"
```

## 三、模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

## 四、标签模板

模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。这被称为“标签模板”功能。标签模板是函数调用的一种特殊形式。“标签”指的是函数，紧跟在后面的模板字符串就是它的参数。

```javascript
alert`hello`
// 等同于
alert(['hello'])
```

如果模板字符里面有变量，会将模板字符串先处理成多个参数，再调用函数。

```javascript
let a = 5;
let b = 10;

tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
```

函数 tag 依次会接收到多个参数。

```javascript
function tag(stringArr, value1, value2){
  // ...
}

// 等同于
function tag(stringArr, ...values){
  // ...
}
```

`tag` 函数的第一个参数是一个数组，该数组的成员是模板字符串中那些没有变量替换的部分，也就是说，变量替换只发生在数组的第一个成员与第二个成员之间、第二个成员与第三个成员之间，以此类推。`tag` 函数的其他参数，都是模板字符串各个变量被替换后的值。

也就是说，`tag` 函数实际上以下面的形式调用。

```javascript
tag(['Hello ', ' world ', ''], 15, 50)
```

## 五、模板字符串的限制

模板字符串默认会将字符串转义，导致无法嵌入其他语言。

比如说，模板字符串会将 `\u00FF` 和 `\u{42}` 当作 Unicode 字符进行转义，所以 `\unicode` 解析时报错；而 `\x56` 会被当作十六进制字符串转义，所以 `\xerxes` 会报错。也就是说， JavaScript 将它们转义了。

为了解决这个问题，ES2018 放松了对标签模板里面的字符串转义的限制。如果遇到不合法的字符串转义，就返回 `undefined`，而不是报错，并且从 `raw` 属性上面可以得到原始字符串。

```javascript
function tag(strs) {
  strs[0] === undefined
  strs.raw[0] === "\\unicode and \\u{55}";
}

tag`\unicode and \u{55}`
```

上面代码中，模板字符串原本是应该报错的，但是由于放松了对字符串转义的限制，所以不报错了，JavaScript 引擎将第一个字符设置为 `undefined`，但是 `raw` 属性依然可以得到原始字符串，因此 `tag` 函数还是可以对原字符串进行处理。

注意，这种对字符串转义的放松，只在标签模板解析字符串时生效，不是标签模板的场合，依然会报错。

```javascript
const bad = `bad escape sequence: \unicode`; // 报错
```

## 六、参考

- 阮一峰，[字符串的扩展](https://es6.ruanyifeng.com/#docs/string)
