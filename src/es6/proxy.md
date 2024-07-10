# Proxy

在 ES6 中，`Proxy` 是一个用于定义基本操作（如属性查找、赋值、枚举、函数调用等）的自定义行为的对象。`Proxy` 可以拦截并修改对目标对象的基本操作，从而实现更强大的功能和灵活性。

## 一、`Proxy` 的基本概念

### 1. 定义

`Proxy` 对象用于定义基本操作的自定义行为。它由两个部分组成：

- **目标对象**：需要代理的对象，可以是任何类型的对象，包括数组、函数等。
- **处理器对象**：定义了基本操作的捕获器（trap）函数。

### 2. 基本语法

```javascript
const proxy = new Proxy(target, handler);
```

- `target`：需要代理的目标对象。
- `handler`：一个处理器对象，其中包含捕获器函数。

## 二、`Proxy` 的捕获器

捕获器是定义在处理器对象中的函数，用于拦截并自定义目标对象的基本操作。常见的捕获器包括：

- `get`：拦截对象属性的读取操作。
- `set`：拦截对象属性的设置操作。
- `has`：拦截 `in` 操作符。
- `deleteProperty`：拦截属性删除操作。
- `apply`：拦截函数调用操作。
- `construct`：拦截 `new` 操作符。
- `ownKeys`：拦截对象自身属性的枚举操作。

## 三、`Proxy` 的基本用法

### 1. 拦截属性读取

使用 `get` 捕获器可以拦截对象属性的读取操作。

```javascript
const target = {
  message: "Hello, World!"
};

const handler = {
  get: function(target, prop, receiver) {
    return prop in target ? target[prop] : `Property ${prop} does not exist.`;
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy.message); // 输出 "Hello, World!"
console.log(proxy.nonExistentProp); // 输出 "Property nonExistentProp does not exist."
```

### 2. 拦截属性设置

使用 `set` 捕获器可以拦截对象属性的设置操作。

```javascript
const target = {
  message: "Hello, World!"
};

const handler = {
  set: function(target, prop, value, receiver) {
    if (prop === 'message') {
      if (typeof value !== 'string') {
        throw new TypeError('The message must be a string');
      }
    }
    target[prop] = value;
    return true;
  }
};

const proxy = new Proxy(target, handler);

proxy.message = "Hello, Proxy!";
console.log(proxy.message); // 输出 "Hello, Proxy!"

try {
  proxy.message = 42; // 抛出 TypeError: The message must be a string
} catch (e) {
  console.error(e);
}
```

### 3. 拦截属性存在检查

使用 `has` 捕获器可以拦截 `in` 操作符。

```javascript
const target = {
  message: "Hello, World!"
};

const handler = {
  has: function(target, prop) {
    if (prop === 'secret') {
      return false;
    }
    return prop in target;
  }
};

const proxy = new Proxy(target, handler);

console.log('message' in proxy); // 输出 true
console.log('secret' in proxy); // 输出 false
```

### 4. 拦截属性删除

使用 `deleteProperty` 捕获器可以拦截属性删除操作。

```javascript
const target = {
  message: "Hello, World!"
};

const handler = {
  deleteProperty: function(target, prop) {
    if (prop === 'message') {
      return false;
    }
    delete target[prop];
    return true;
  }
};

const proxy = new Proxy(target, handler);

delete proxy.message; // 删除失败
console.log(proxy.message); // 输出 "Hello, World!"

delete proxy.nonExistentProp; // 删除成功
console.log(proxy.nonExistentProp); // 输出 undefined
```

### 5. 拦截函数调用

使用 `apply` 捕获器可以拦截函数调用操作。

```javascript
const target = function(name) {
  return `Hello, ${name}!`;
};

const handler = {
  apply: function(target, thisArg, argumentsList) {
    if (argumentsList.length === 0) {
      throw new Error('Name is required');
    }
    return target.apply(thisArg, argumentsList);
  }
};

const proxy = new Proxy(target, handler);

console.log(proxy('Alice')); // 输出 "Hello, Alice!"

try {
  console.log(proxy()); // 抛出 Error: Name is required
} catch (e) {
  console.error(e);
}
```

### 6. 拦截构造函数调用

使用 `construct` 捕获器可以拦截 `new` 操作符。

```javascript
const target = function(name) {
  this.name = name;
};

const handler = {
  construct: function(target, argumentsList) {
    if (argumentsList.length === 0) {
      throw new Error('Name is required');
    }
    return new target(...argumentsList);
  }
};

const proxy = new Proxy(target, handler);

const instance = new proxy('Alice');
console.log(instance.name); // 输出 "Alice"

try {
  const instance2 = new proxy(); // 抛出 Error: Name is required
} catch (e) {
  console.error(e);
}
```

## 四、`Proxy` 的实际使用场景

### 1. 数据绑定和观察者模式

使用 `Proxy` 可以实现数据绑定，自动监听对象属性的变化。

```javascript
function createReactiveObject(target, callback) {
  const handler = {
    set: function(target, prop, value) {
      target[prop] = value;
      callback(prop, value);
      return true;
    }
  };
  return new Proxy(target, handler);
}

const data = {
  message: 'Hello'
};

const reactiveData = createReactiveObject(data, (prop, value) => {
  console.log(`Property ${prop} changed to ${value}`);
});

reactiveData.message = 'Hello, Proxy!'; // 输出 "Property message changed to Hello, Proxy!"
```

### 2. 输入验证

使用 `Proxy` 可以对对象属性的设置进行输入验证。

```javascript
const user = {
  name: 'Alice',
  age: 25
};

const handler = {
  set: function(target, prop, value) {
    if (prop === 'age') {
      if (typeof value !== 'number' || value <= 0) {
        throw new TypeError('Age must be a positive number');
      }
    }
    target[prop] = value;
    return true;
  }
};

const proxyUser = new Proxy(user, handler);

proxyUser.age = 30; // 设置成功
console.log(proxyUser.age); // 输出 30

try {
  proxyUser.age = -5; // 抛出 TypeError: Age must be a positive number
} catch (e) {
  console.error(e);
}
```

### 3. 动态属性

使用 `Proxy` 可以动态地定义对象的属性和方法。

```javascript
const handler = {
  get: function(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    return function(...args) {
      console.log(`Method ${prop} called with arguments: ${args}`);
    };
  }
};

const proxy = new Proxy({}, handler);

proxy.existingMethod = function() {
  console.log('Existing method called');
};

proxy.existingMethod(); // 输出 "Existing method called"
proxy.nonExistentMethod(1, 2, 3); // 输出 "Method nonExistentMethod called with arguments: 1,2,3"
```

### 4. 安全性和访问控制

使用 `Proxy` 可以限制对对象某些属性的访问。

```javascript
const sensitiveData = {
  username: 'admin',
  password: '12345'
};

const handler = {
  get: function(target, prop) {
    if (prop === 'password') {
      throw new Error('Access to password is denied');
    }
    return target[prop];
  }
};

const proxy = new Proxy(sensitiveData, handler);

console.log(proxy.username); // 输出 "admin"

try {
  console.log(proxy.password); // 抛出 Error: Access to password is denied
} catch (e) {
  console.error(e);
}
```
