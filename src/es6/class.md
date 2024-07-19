# Class

## 一、Class 的基本语法

### 1.1 类的由来

ES6 引入了 Class（类）的概念，通过 `class` 关键字，可以定义类。

（1）ES6 的类，可以看作构造函数的另一种写法。

```javascript
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```

上面代码表明，类的数据类型就是函数，类本身就指向构造函数。

（2）类的所有方法都定义在类的 `prototype` 属性上面。因此，在类的实例上面调用方法，其实就是调用原型上的方法。

```javascript
class Point {
  constructor() {
    // ...
  }
  toString() {
    // ...
  }
  toValue() {
    // ...
  }
}

// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

（3）`prototype` 对象的 `constructor` 属性，直接指向“类”的本身，这与 ES5 的行为是一致的。

```javascript
Point.prototype.constructor === Point // true
```

（4）类的内部所有定义的方法，都是不可枚举的（non-enumerable）。

```javascript
class Point {
  constructor(x, y) {
    // ...
  }
  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

### 1.2 constructor() 方法

`constructor` 方法是类的默认方法，通过 `new` 命令生成对象实例时，自动调用该方法。一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 `constructor` 方法会被默认添加。

### 1.3 类的实例

类的属性和方法，除非显式定义在其本身（即定义在 this 对象上），否则都是定义在原型上（即定义在 class 上）。

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```

### 1.4 实例属性的新写法

ES2022 规定，实例属性除了可以定义在 `constructor` 方法里面的 `this` 上面，也可以定义在类内部的最顶层。

```javascript
class IncreasingCounter {
  _count = 0;
  get value() {
    console.log('Getting the current value!');
    return this._count;
  }
  increment() {
    this._count++;
  }
}
```

上面代码中，实例属性 `_count` 与取值函数 `value` 方法和 `increment` 方法，处于同一个层级。这时，不需要在实例属性前面加上 `this`。

注意，新写法定义的属性是实例对象自身的属性，而不是定义在实例对象的原型上面。

### 1.5 取值函数（getter）和存值函数（setter）

类的内部可以使用 `get` 和 `set` 关键字，对某个属性设置存值函数和取值函数。他们设置在属性的 Descriptor 对象上。

### 1.6 属性表达式

类的属性名，可以采用表达式。

```javascript
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }
  [methodName]() {
    // ...
  }
}
```

### 1.7 静态方法

（1）如果静态方法包含 `this` 关键字，这个 `this` 指的是类，而不是实例。

（2）父类的静态方法，可以被子类继承。

（3）静态方法可以从 `super` 对象上调用。

```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod() // "hello, too"
```

### 1.8 静态属性

在实例属性的前面，加上 `static` 关键字，就表示静态属性。

```javascript
class MyClass {
  static myStaticProp = 42;
}
```

### 1.9 私有方法和私有属性

ES2022 为 `class` 添加了私有属性，方法是在属性名之前使用 `#` 表示。

```javascript
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  increment() {
    this.#count++;
  }
}
```

上面代码中，`#count` 就是私有属性，只能在类的内部使用 `this.#count`。如果在类的外部使用，就会报错。

这种写法还可以用来写私有方法。

```javascript
class Foo {
  #a;
  #b;
  constructor(a, b) {
    this.#a = a;
    this.#b = b;
  }
  #sum() {
    return this.#a + this.#b;
  }
}
```

私有属性也可以设置 `getter` 和 `setter` 方法。

ES2022 改进了 `in` 运算符，使它也可以用来判断私有属性，此时，`in` 只能用在类的内部。

```javascript
class C {
  #brand;

  static isC(obj) {
    if (#brand in obj) {
      // 私有属性 #brand 存在
      return true;
    } else {
      // 私有属性 #foo 不存在
      return false;
    }
  }
}
```

### 1.10 静态块

ES2022 引入了静态块（static block），允许在类的内部设置一个代码块，在类生成时运行且只运行一次，主要作用是对静态属性进行初始化。以后，新建类的实例时，这个块就不运行了。

```javascript
class C {
  static {
    // ...
  }
}
```

### 1.11 类的注意点

#### （1）严格模式

类和模块的内部，默认是严格模式。

#### （2）不存在提升

类不存在变量提升，这也就意味着，ES6 不会把类的声明提升到代码头部。

#### （3）name 属性

ES6 的类是 ES5 的构造函数的一层包装，所以函数的许多特性都被 Class 继承，包括 `name` 属性。`name` 属性总是返回紧跟在 `class` 关键字后面的类名。

#### （4）this 的指向

类的方法内部如果含有 `this`，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

解决办法是，在构造方法中对 `this` 进行绑定，或者使用箭头函数。

### 1.12 new.target 属性

ES6 引入了 `new.target` 属性，该属性一般用在构造函数之中，返回 `new` 命令作用于的那个构造函数。如果构造函数不是通过 `new` 命令或 `Reflect.construct` 方法调用的，`new.target` 会 返回 `undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

（1）Class 内部调用 `new.target`，返回当前 Class。

```javascript
class Rectangle {
  constructor() {
    console.log(new.target === Rectangle);
  }
}

var obj = new Rectangle(); // 输出 true
```

（2）子类继承父类时，`new.target` 会返回子类。利用这个特点，可以写出不能独立使用、必须继承后才能使用的类。

```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}


class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```

上面代码中，Shape 类不能被实例化，只能用于继承。

（3）在函数外部，使用 `new.target` 会报错。

## 二、Class 的继承

### 2.1 简介

```javascript
```

### 2.2 私有属性和私有方法的继承

```javascript
```

### 2.3 静态属性和静态方法的继承

```javascript
```

### 2.4 Object.getPrototypeOf()

```javascript
```

### 2.5 super 关键字

```javascript
```

### 2.6 类的 prototype 属性和 __proto__ 属性

```javascript
```

### 2.7 原生构造函数的继承

```javascript
```

### 2.8 Mixin 模式的实现

```javascript
```

## 三、参考

- 阮一峰，[Class 的基本语法](https://es6.ruanyifeng.com/#docs/class)
- 阮一峰，[Class 的继承](https://es6.ruanyifeng.com/#docs/class-extends)
