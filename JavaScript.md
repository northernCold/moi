
### JavaScirpt的数据类型中8种：

1. Undefined

2. Null

3. Number

4. String

5. Boolean

6. Symbol

7. BigInt(es10加入的)

8. Object

这些有分为基本类型（原始类型）（1-7）和引用类型（8）

存储位置：

- 基本类型存储在栈内存，被引用或者拷贝时，会创建一个完全相等的变量

- 引用类型存储在堆内存，存储的是地址

### 数据类型检测

1. typeof
```javascript
console.log(typeof 1)   // number
console.log(typeof "2") // string
console.log(typeof null) // object
console.log(typeof undefined) // undefined
console.log(typeof {}) // object
console.log(typeof 4n) // bigint
console.log(typeof false) // boolean
console.log(typeof Symbol("1")) // symbol
console.log(typeof function () {}) // function
```

> 注1：null不是对象，typeof null输出object。是js中存在已久的bug。

typeof能检测出除了null的基本类型,但是引用类型中，除了 function 类型以外，其他的也无法判断都为Object。


2. instanceof
```javascript
function _instanceof(obj, ctor) {
    if (typeof obj !== "object" || obj === null) return false;
    let proto;
    while(true) {
        proto = Object.getPrototypeOf(obj);
        if (proto === ctor.prototype) return true;
        if (!!proto) return false;
    }
}

_instanceof({}, Object)
```
instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。

instanceof 可以准确地判断复杂引用数据类型，但是不能正确判断基础数据类型；

```
需要注意的是，如果表达式 obj instanceof Foo 返回 true，则并不意味着该表达式会永远返回 true，因为 Foo.prototype 属性的值有可能会改变，改变之后的值很有可能不存在于 obj 的原型链上，这时原表达式的值就会成为 false。另外一种情况下，原表达式的值也会改变，就是改变对象 obj 的原型链的情况，虽然在目前的ES规范中，我们只能读取对象的原型而不能改变它，但借助于非标准的 __proto__ 伪属性，是可以实现的。比如执行 obj.__proto__ = {} 之后，obj instanceof Foo 就会返回 false 了。
```

3. Object.prototype.toString
```javascript
function getType(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s+(.+)\]/, (match, p) => p.slice(0, 1).toLowerCase() + p.slice(1))
}
```

>1：在 JavaScript 最初的实现中，JavaScript 中的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是 0。由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是 0，typeof null 也因此返回 "object"。

[typeof - JavaScript | MDN](https://developer.mozilla.org/zh-cn/docs/web/javascript/reference/operators/typeof)
[instanceof - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)
[【JS 进阶】你真的掌握变量和类型了吗](https://juejin.im/post/5cec1bcff265da1b8f1aa08f)
[JavaScript内置对象--基本包装类型(Boolean、Number、String)详解](https://blog.csdn.net/baidu_25343343/article/details/54849475)

### 数据类型转换


#### 隐式转换

##### 数学运算符中的类型转换

1. 减、乘、除

我们在对各种非Number类型运用数学运算符(- * /)时，会先将非Number类型转换为Number类型。

2. 加法的特殊性

JS里 +还可以用来拼接字符串。谨记以下3条：

1.当一侧为String类型，被识别为字符串拼接，并会优先将另一侧转换为字符串类型。
2.当一侧为Number类型，另一侧为原始类型，则将原始类型转换为Number类型。
3.当一侧为Number类型，另一侧为引用类型，将引用类型和Number类型转换成字符串后拼接。
⭐️以上 3 点，优先级从高到低，即 3+'abc' 会应用规则 1，而 3+true会应用规则2。

逻辑语句中的类型转换

1.单个变量
⭐️如果只有单个变量，会先将变量转换为Boolean值。

只有 null undefined '' NaN 0 false 这几个是 false，其他的情况都是 true，比如 {} , []。

2.使用 == 比较中的5条规则
虽然我们可以严格使用 ===，不过了解==的习性还是很有必要的。

⭐️根据 == 两侧的数据类型，我们总结出 5 条规则：

规则 1：NaN和其他任何类型比较永远返回false（包括和他自己）。

规则 2：Boolean 和其他任何类型比较，Boolean 首先被转换为 Number 类型。

规则 3：String和Number比较，先将String转换为Number类型。

规则 4：null == undefined比较结果是true，除此之外，null、undefined和其他任何结果的比较值都为false。

规则 5：原始类型和引用类型做比较时，引用类型会依照ToPrimitive规则转换为原始类型。

> ⭐️ToPrimitive规则，是引用类型向原始类型转变的规则，它遵循先valueOf后toString的模式期望得到一个原始类型。
如果还是没法得到一个原始类型，就会抛出 TypeError。

## 原型

new

new 关键字会进行如下的操作：

  1. 创建一个空的简单JavaScript对象（即{}）；
  2. 链接该对象（设置该对象的constructor）到另一个对象 ；
  3. 将步骤1新创建的对象作为this的上下文 ；
  4. 如果该函数没有返回对象，则返回this。

```javascript
function _new (ctor, ...args) {
  let obj = {};
  obj.__proto__ = ctor.prototype;
  let result = ctor.call(obj, args);
  return typeof result === "object" ? result : obj;
}
```
继承

原型链