## 开始做第一个轮播图

> 第一个轮播图比较简单，显示隐藏的方式轮播图片。废话少说直接看效果。

> 效果
> [https://gksdnfla.github.io/banner/easy_banner/easy_banner.html](https://gksdnfla.github.io/banner/easy_banner/easy_banner.html)
> 源码
> [https://github.com/gksdnfla/banner/tree/master/easy_banner](https://github.com/gksdnfla/banner/tree/master/easy_banner)

我们先看一下 HTML 结构:

```HTML
<ul class="banner-list">
    <li active>
        <a href="#" class="active"><img src="<!-- 图片路径 -->"></a>
    </li>
    <li>
        <a href="#"><img src="<!-- 图片路径 -->"></a>
    </li>
    <li>
        <a href="#"><img src="<!-- 图片路径 -->"></a>
    </li>
    <li>
        <a href="#"><img src="<!-- 图片路径 -->"></a>
    </li>
    <li>
        <a href="#"><img src="<!-- 图片路径 -->"></a>
    </li>
</ul>
```

> 我们的图片是多个的，所以他是一个无序的列表图片，用 ul，li 标签来搭结构。然后轮播图的片都是有一个链接的，可以进行点击，这时候用的是 a 标签。（**其实我们可以用 javascript 来模拟 a 标签。但是一般的轮播图都是放一些活动，广告图片的。是为了吸引顾客，所以我们需要做一个语义标签让这些活动页，能让搜索引擎找到他，并能在搜索引擎提高优先级。所以我们选 a 标签来让这个链接在搜索引擎提高优先级。**）然后用 img 标签来显示图片。（**其实用背景图更方便，如果不想提高图片的搜索引擎优先级可以选择用背景图的方式去显示，如果图片需要提高搜索引擎的优先级，那需要用语义的标签来去显示这张图片。**）

再来看 CSS

```CSS
body, ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
}
.banner-list {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
}
.banner-list li {
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
}
.banner-list li[active] {
    opacity: 1;
}
.banner-list li img {
    width: 100%;
}
```

> body,ul,li 的样式是为了清掉默认样式。我给**.banner-list**给了绝对定位，因为我的图片是全屏显示的，要想给.banner-list{ height: 100%; }，需要这个元素是的绝对定位或者是固定定位。这里显然不适合用固定定位，所以选择了绝对定位。然后用了 overflow 隐藏了多余的部分。然后为了 li 叠加到一个地方，再用绝对定位移动到 left=0,top=0 的位置并把它隐藏掉。下一个就是用属性选择器来选择有 active 属性的 li 标签，并把显示出来。最后把图片的宽度设置为 100%，为了让整张图片显示出来。

最后是 JavaScript

```javascript
window.onload = function() {
	var aLi = document.querySelector(".banner-list li");
	var count = 0; //当先显示的图片的索引
	var length = aLi.length;

	window.setInterval(function() {
		count++; //每过5秒+1
		if (count >= length) {
			//当count大于等于5的时候让他变成0
			count = 0;
		}
		// 清楚所有的li的active属性
		for (var i = 0; i < length; i++) {
			aLi[i].removeAttribute("active");
		}
		// 给要显示的li加active属性
		aLi[count].setAttribute("active", "");
	}, 5000);
};
```

接下来把这个代码封装成插件，创建一个对象就可以让这个 banner 做出来。

```HTML
<div id="banner-box"></div>
```

用面相对象的方式来封装，并对参数进行限制。

```JavaScript
function Banner(obj, images, options) {
  this.element = null;
  this.images = images;

  // 没有传options的时候为了防止报错，给一个空的对象
  this.options = options || {};
  // 播放间隔默认为5秒
  this.options.time = this.options.time || 5000;
  // 默认为自动播放
  this.options.autoPlay = this.options.autoPlay || true;
  // 判断obj是个字符串还是对象，如果是字符串就选择这个元素，如果是对象赋给element，如果不是字符串或者是对象就停止运行代码
  switch (typeof obj) {
    case "string":
      this.element = document.querySelector(obj);
      break;
    case "object":
      this.element = obj;
      break;
    default:
      console.error("first argument is not selector or element!");
      return;
  }
  // 判断images是不是数组，如果不是就停止运行代码
  if (!this.images instanceof Array) {
    console.error("second argument is not Array!");
    return;
  }

  // 当前播放图片的索引
  this.count = 0;
  // 创建元素 *下面有这个方法的封装
  this.createElement();
}
```

然后我们要创建 ul，li，a，img 元素，并添加样式和属性。

```JavaScript
Banner.prototype.createElement = function() {
  var oUl = document.createElement("ul");

  // 给ul样式和class
  oUl.className = "banner-list";
  oUl.style.width = "100%";
  oUl.style.height = "100%";
  oUl.style.listStyle = "none";
  oUl.style.margin = "0";
  oUl.style.padding = "0";
  oUl.style.overflow = "hidden";
  oUl.style.position = "absolute";
  oUl.style.left = "0";
  oUl.style.top = "0";

  // li,a,img标签都是跟图片的数量一样，所以我们用循环创建元素
  for (var i = 0; i < this.images.length; i++) {
    // 创建li,a,img元素
    var oLi = document.createElement("li");
    var oAchor = document.createElement("a");
    var oImg = document.createElement("img");

    // 给li加样式
    oLi.style.width = "100%";
    oLi.style.height = "100%";
    i == 0 ? (oLi.style.opacity = "1") : (oLi.style.opacity = "0");
    oLi.style.transition = "0.3s ease";
    oLi.style.position = "absolute";
    oLi.style.left = "0";
    oLi.style.top = "0";

    // 给a元素加href  *this.images是传进来的参数
    oAchor.href = this.images[i].link;

    // 给img元素加样式并给图片路径  *this.images是传进来的参数
    oImg.style.width = "100%";
    oImg.src = this.images[i].src;

    // li元素添加在ul元素里，a元素添加在li元素里，img元素添加在a元素里
    oUl.appendChild(oLi);
    oLi.appendChild(oAchor);
    oAchor.appendChild(oImg);
  }

  // 把ul元素添加到传进来的元素里
  this.element.appendChild(oUl);

  // 自动播放
  if (this.options.autoPlay === true) this.autoPlay();
};
```

最后写一个自动播放方法。

```JavaScript
Banner.prototype.autoPlay = function() {
  // 因为定时器里的匿名函数，把this指向改成了window，所以我们用变量来存起来，在定时器里调用。
  var that = this;
  // 获取li元素
  var aLi = this.element.querySelectorAll(".banner-list li");

  // 定时器
  window.setInterval(function() {
    // 先把当前显示的图片隐藏
    aLi[that.count].style.opacity = 0;
    // 把count改成要显示的图片索引
    that.count++;
    // 防止count多余images的长度 *其实可以用if来判断，我这里用这方式来防止
    that.count %= that.images.length;
    // 把要显示的图片显示出来
    aLi[that.count].style.opacity = 1;
  }, this.options.time);
};
```

我们给样式的时候是一个一个给的，这么给样式很麻烦，所以模仿 jquery 里的 css 方法封装一个函数

```JavaScript
function css(elements) {
    // 判断elements是不是数组
    if (elements instanceof Array) {
        // 判断elements的第一个元素是不是对象
        if (typeof elements[0] !== "object") {
            console.error("first argument is not Dom element list!");
            return;
        }
    } else {
        // 判断elements是不是对象
        if (typeof elements !== "object") {
            console.error("first argument is not Dom element!");
            return;
        }
    }
    // 如果参数elements是一个数组，就把参数elements赋值到变量elements
    // 如果参数elements不是，把参数elements放到数组赋值到变量elements
    // 这是为了让elements保持是一个数组
    var elements = elements instanceof Array ? elements : [elements];
    // 为了内部函数也能访问到当前函数的arguments，赋值到arg
    var arg = arguments;

    // 在JQuery里传进一个参数的时候是有两种情况的
    if (arg.length === 2) {
        switch (typeof arg[1]) {
            // 参数是string的时候，就返回第一个元素的样式
            case "string":
                return elements[0].style[arg[1]];
                break;
            // 参数是json的时候，把样式赋给所有元素
            case "object":
                // forEach 封装在下面，这个跟Es6的封装差不多，不同的地方就是可以循环对象
                forEach(elements, function(element) {
                    forEach(arg[1], function(styleVal, styleName) {
                        element.style[styleName] = styleVal;
                    });
                });
                break;
            // 如果参数是其他类型就报错，这是自己加的错误提示
            default:
                console.error(
                    "The second argument is not string or object!"
                );
                return;
        }
        // Jquery里两个参数的时候是只有一个样式的，只要把一个样式赋值到所有元素就好
    } else if (arg.length === 3) {
        // 因为第一个参数肯定是一个string
        // 第二个参数有两种类型，string和number
        // 我自己给了限制，并提示错误
        if (
            typeof arg[1] !== "string" &&
            (typeof arg[2] !== "string" || typeof arg[2] !== "number")
        ) {
            console.error("The second and third arguments is not string!");
            return;
        }

        forEach(elements, function(element) {
            element.style[arg[1]] = arg[2];
        });
    }
}
```

> forEach 封装

```JavaScript
function forEach(obj, fn) {
    // 判断obj是不是一个对象，如果不是报错
    if (typeof obj !== "object") {
        console.error("The first argument is not Array or Object!");
        return;
    }

    // 循环的时候其实都可以用 for in 循环, 但是 for in 循环比for循环慢
    // 为了性能优化我去判断了是不是数组
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) {
            //判断fn是不是函数，如果是函数就运行fn
            typeof fn==='function' && fn(obj[i], i, obj);
        }
    } else {
        for (var key in obj) {
            typeof fn==='function' && fn(obj[key], key, obj);
        }
    }
}
```

封装好 css 方法一以后可以用这个方法了

```JavaScript
oUl.className = "banner-list";
oUl.style.width = "100%";
oUl.style.height = "100%";
oUl.style.listStyle = "none";
oUl.style.margin = "0";
oUl.style.padding = "0";
oUl.style.overflow = "hidden";
oUl.style.position = "absolute";
oUl.style.left = "0";
oUl.style.top = "0";
// 改成
css(oUl, {
    width: "100%",
    height: "100%",
    listStyle: "none",
    margin: 0,
    padding: 0,
    overflow: "hidden",
    position: "absolute",
    left: 0,
    top: 0
});

oLi.style.width = "100%";
oLi.style.height = "100%";
i == 0 ? (oLi.style.opacity = "1") : (oLi.style.opacity = "0");
oLi.style.transition = "0.3s ease";
oLi.style.position = "absolute";
oLi.style.left = "0";
oLi.style.top = "0";
// 改成
css(oLi, {
    width: "100%",
    height: "100%",
    opacity: i == 0 ? 1 : 0,
    transition: "0.3s ease",
    position: "absolute",
    left: 0,
    top: 0
});

oImg.style.width = "100%";
// 改成
css(oImg, "width", "100%");
// 最后一个改不改感觉没啥区别，封装了这种方式就这么用吧。。。。
```
