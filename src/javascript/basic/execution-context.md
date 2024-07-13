在 JavaScript 中，执行上下文（Execution Context）和执行栈（Execution Stack）是理解 JavaScript 代码执行过程关键概念。它们协同工作来管理和调度代码的执行。
### 一、执行上下文

#### 1. 定义
执行上下文是 JavaScript 代码执行时的环境，它包含了代码执行所需的所有信息。每当函数被调用或全局代码被执行时，都会创建一个新的执行上下文。

#### 2. 类型
执行上下文主要有三种类型：
- **全局执行上下文**：这是默认的执行上下文，代码在运行时首先进入全局执行上下文。
- **函数执行上下文**：每当一个函数被调用时，都会创建一个新的函数执行上下文。
- **Eval 执行上下文**：当代码在 `eval` 函数中执行时，会创建 eval 执行上下文（不推荐使用 eval）。

#### 3. 组成部分
每个执行上下文由以下三个部分组成：
- **变量对象（Variable Object, VO）**：存储变量、函数声明和函数参数。
- **作用域链（Scope Chain）**：包含当前执行上下文的变量对象及其父级上下文的变量对象，形成一个作用域链，用于变量查找。
- **this 绑定**：确定在当前执行上下文中 `this` 指向的对象。

#### 4. 创建过程
执行上下文的创建分为两个阶段：创建阶段和执行阶段。

##### a. 创建阶段
- **建立变量对象**：创建变量对象，存储函数参数、变量和函数声明。
- **建立作用域链**：创建作用域链，将变量对象加入作用域链。
- **确定 this 指向**：确定 this 的指向。

##### b. 执行阶段
- **变量赋值**：变量和函数参数赋值。
- **执行代码**：执行代码块中的具体逻辑。

### 二、执行栈

#### 1. 定义
执行栈（也称调用栈）是一个堆栈结构，用于管理执行上下文的执行顺序。每当一个新的执行上下文被创建时，它会被推入执行栈的栈顶。当前函数执行完毕后，该执行上下文会从栈顶弹出。

#### 2. 工作原理
- **压栈（Push）**：当函数被调用时，该函数的执行上下文被创建并推入栈顶。
- **出栈（Pop）**：当函数执行完毕时，当前执行上下文从栈顶弹出，控制权返回到上一个执行上下文。

#### 3. 示例
```javascript
function firstFunction() {
    secondFunction();
}

function secondFunction() {
    thirdFunction();
}

function thirdFunction() {
    console.log('Hello, World!');
}

firstFunction();
```

执行过程如下：
1. 全局执行上下文被创建并推入执行栈。
2. `firstFunction` 被调用，创建其执行上下文并推入栈顶。
3. `secondFunction` 被调用，创建其执行上下文并推入栈顶。
4. `thirdFunction` 被调用，创建其执行上下文并推入栈顶。
5. `thirdFunction` 执行完毕，其执行上下文被弹出。
6. `secondFunction` 执行完毕，其执行上下文被弹出。
7. `firstFunction` 执行完毕，其执行上下文被弹出。
8. 最后，只有全局执行上下文留在执行栈中。

### 三、示例解析

#### 1. 简单示例
```javascript
var name = 'Global';

function outer() {
    var name = 'Outer';
    
    function inner() {
        var name = 'Inner';
        console.log(name);
    }
    
    inner();
}

outer();
```

执行过程详解：
1. **全局执行上下文创建**：
   - 变量对象：`{ name: undefined, outer: <function> }`
   - 作用域链：`[全局变量对象]`
   - this：全局对象（如 `window`）

2. **全局执行上下文执行**：
   - 变量赋值：`{ name: 'Global', outer: <function> }`

3. **outer 函数执行上下文创建并推入栈顶**：
   - 变量对象：`{ name: undefined, inner: <function> }`
   - 作用域链：`[outer 变量对象, 全局变量对象]`
   - this：全局对象

4. **outer 函数上下文执行**：
   - 变量赋值：`{ name: 'Outer', inner: <function> }`

5. **inner 函数执行上下文创建并推入栈顶**：
   - 变量对象：`{ name: undefined }`
   - 作用域链：`[inner 变量对象, outer 变量对象, 全局变量对象]`
   - this：全局对象

6. **inner 函数上下文执行**：
   - 变量赋值：`{ name: 'Inner' }`
   - `console.log(name)` 打印 `Inner`

7. **inner 函数执行完毕，其执行上下文弹出**。
8. **outer 函数执行完毕，其执行上下文弹出**。

### 四、深入理解

#### 1. 作用域链
作用域链是当前执行上下文中的变量对象和上级执行上下文的变量对象的集合。当访问一个变量时，JavaScript 引擎会沿着作用域链从当前变量对象向上查找，直到找到该变量或到达全局执行上下文。

#### 2. 闭包与执行上下文
闭包是指一个函数可以访问其外部函数作用域中的变量。闭包通过保留对外部函数执行上下文中变量对象的引用来实现。

```javascript
function outer() {
    var outerVar = 'I am outer';
    
    return function inner() {
        console.log(outerVar);
    };
}

var closure = outer();
closure(); // 输出 'I am outer'
```

在上述示例中，`inner` 函数在 `outer` 函数执行完毕后仍然保留对 `outerVar` 的引用，这就是闭包的特性。

### 总结

执行上下文和执行栈是 JavaScript 代码执行的核心机制。执行上下文包含了代码执行所需的所有信息，而执行栈则管理和调度执行上下文的执行顺序。理解这些概念有助于识别和解决 JavaScript 中的复杂问题，如作用域、闭包和内存泄漏等。
