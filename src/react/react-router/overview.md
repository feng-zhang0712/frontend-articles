React Router 是 React 应用程序中最常用的路由解决方案。它允许你在单页面应用中实现客户端路由，管理 URL 和组件之间的映射关系。React Router 提供了一系列组件和钩子用于配置和管理路由。

### 1. BrowserRouter

`BrowserRouter` 是 React Router 提供的路由器组件，使用 HTML5 的 History API 来保持 UI 和 URL 的同步。适用于现代浏览器环境。

#### 使用示例：

```jsx
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Router>
  );
}

export default App;
```

### 2. Route

`Route` 组件主要用于定义路由规则。它会根据当前 URL 路径匹配对应的组件，并进行渲染。

#### 使用示例：

```jsx
import { Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Route path="/home" component={Home} />
      <Route path="/about" component={About} />
    </div>
  );
}
```

#### Route 的 props：

- **path**: 路径字符串，定义 URL 路径。
- **component**: 要渲染的组件。
- **exact**: 精确匹配路径。
- **render**: 渲染函数，返回要渲染的组件。
- **children**: 无论路径是否匹配，都渲染子组件。

### 3. Switch

`Switch` 组件用于包装 `Route` 组件，当路径匹配时，只渲染第一个匹配的路由。

#### 使用示例：

```jsx
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </Switch>
  );
}
```

### 4. Link

`Link` 组件用于创建可点击的导航链接，类似于 HTML 中的 `<a>` 标签，但不会刷新页面。

#### 使用示例：

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/home">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}
```

### 5. NavLink

`NavLink` 组件是 `Link` 组件的一个变体，用于创建带有活动状态的导航链接。可以通过 `activeClassName` 或 `activeStyle` 属性自定义活动状态的样式。

#### 使用示例：

```jsx
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink to="/home" activeClassName="active">Home</NavLink>
      <NavLink to="/about" activeClassName="active">About</NavLink>
      <NavLink to="/contact" activeClassName="active">Contact</NavLink>
    </nav>
  );
}
```

### 6. Redirect

`Redirect` 组件用于重定向到指定路径。

#### 使用示例：

```jsx
import { Redirect, Route } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/about" component={About} />
      <Redirect from="/old-about" to="/about" />
    </Switch>
  );
}
```

### 7. useHistory

`useHistory` 是 React Router 提供的钩子，用于访问和操纵历史对象。

#### 使用示例：

```jsx
import { useHistory } from 'react-router-dom';

function MyComponent() {
  const history = useHistory();

  const handleClick = () => {
    history.push('/new-path');
  };

  return (
    <button onClick={handleClick}>Go to New Path</button>
  );
}
```

### 8. useLocation

`useLocation` 钩子返回当前的 location 对象，包含 pathname、search、hash 等信息。

#### 使用示例：

```jsx
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();

  return (
    <div>
      <p>Current Path: {location.pathname}</p>
    </div>
  );
}
```

### 9. useParams

`useParams` 钩子返回当前路由匹配的参数对象。

#### 使用示例：

```jsx
import { useParams } from 'react-router-dom';

function MyComponent() {
  const { id } = useParams();

  return (
    <div>
      <p>Parameter ID: {id}</p>
    </div>
  );
}
```

### 10. useRouteMatch

`useRouteMatch` 钩子返回当前匹配的路由对象，可以用于获取路径、url 等信息。

#### 使用示例：

```jsx
import { useRouteMatch } from 'react-router-dom';

function MyComponent() {
  const match = useRouteMatch('/example-path');

  return (
    <div>
      {match && <p>Matched Path: {match.url}</p>}
    </div>
  );
}
```

### 11. Prompt

`Prompt` 组件用于阻止导航，通常用于在用户离开页面前确认。

#### 使用示例：

```jsx
import { Prompt } from 'react-router-dom';

function MyComponent() {
  const [isBlocking, setIsBlocking] = useState(false);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsBlocking(false);
        }}
        onChange={() => {
          setIsBlocking(true);
        }}
      >
        <Prompt
          when={isBlocking}
          message={(location) => `Are you sure you want to go to ${location.pathname}?`}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
```