> 效果 [https://gksdnfla.github.io/banner/easy_banner/easy_banner.html](https://gksdnfla.github.io/banner/easy_banner/easy_banner.html)
> 源码 [https://github.com/gksdnfla/banner/tree/master/ordinary_banner](https://github.com/gksdnfla/banner/tree/master/ordinary_banner)

#开始第二个轮播图

这期的轮播图效果是平滑的效果，首先图片的切换方式添加到三种，点击、拖拽、滚动。这回的功能复杂度会上升很多。

> 这回直接用封装的方式写代码。有些代码跟[简单的轮播图](https://www.jianshu.com/p/3c2f9fb9996e)，有些部分代码直接复制过来的。好了，开始撸代码吧。

第一步，创建 Banner 对象，参数还没有定好，代码跟**简单的轮播图**一样，我直接复制代码。后面有参数变动在去改代码。

```JavaScript
window.Banner = function(obj, images, options) {
    this.element = null;
    this.images = images;
    this.options = options || {};
    // 播放间隔默认为5秒
    this.options.time = this.options.time || 5000;
    // 默认为自动播放
    this.options.autoPlay =
        "autoPlay" in this.options ? this.options.autoPlay : true;
    // 是否调用滚轮事件，默认为false
    this.options.wheelEvent =
        "wheelEvent" in this.options ? this.options.wheelEvent : true;
    // 是否显示icon
    this.options.showIcon =
        "showIcon" in this.options ? this.options.showIcon : true;

    // 判断obj是个字符串还是对象，如果是字符串就选择这个元素，如果是对象赋给element，如果不是字符串或者是对象就停止运行代码
    switch (typeof obj) {
        case "string":
            this.element = document.querySelector(obj);
            break;
        case "object":
            this.element = obj;
            break;
        default:
            console.error("The first argument is not selector or element!");
            return;
    }
    // 判断images是不是数组，如果不是就停止运行代码
    if (!this.images instanceof Array) {
        console.error("The second argument is not Array!");
        return;
    }

    // 当前播放图片的索引
    this.count = 0;
    // 创建元素 *下面有这个方法的封装
    this.createElement();

    // 自动播放
    if (this.options.autoPlay === true) this.autoPlay();
    // 滚轮事件
    if (this.options.wheelEvent === true) this.wheelEvent();

    if (this.options.showIcon === true) this.createIcon();
}
```

开始创建 Dom。这个函数跟之前差不多，有一些样式的改动。

```JavaScript
Banner.prototype.createElement = function() {
    var that = this;
    var oUl = document.createElement("ul");

    css(this.element, {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "absolute",
        left: 0,
        top: 0
    });

    // 给ul样式和class
    oUl.className = "banner-list";
    css(oUl, {
        width: "100%",
        height: "100%",
        listStyle: "none",
        margin: 0,
        padding: 0,
        position: "absolute",
        left: 0,
        top: 0
    });

    // li,a,img标签都是跟图片的数量一样，所以我们用循环创建元素
    for (var i = 0; i < this.images.length; i++) {
        // 创建li,a,img元素
        var oLi = document.createElement("li");
        var oAchor = document.createElement("a");
        var oImg = document.createElement("img");

        // 给li加样式
        css(oLi, {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: this.count == i ? 1 : 0
        });

        // 给a元素加href  *this.images是传进来的参数
        oAchor.href = this.images[i].link;

        // 给img元素加样式并给图片路径  *this.images是传进来的参数
        css(oImg, "width", "100%");
        oImg.src = this.images[i].src;

        // li元素添加在ul元素里，a元素添加在li元素里，img元素添加在a元素里
        oUl.appendChild(oLi);
        oLi.appendChild(oAchor);
        oAchor.appendChild(oImg);
    }

    // 把ul元素添加到传进来的元素里
    this.element.appendChild(oUl);

    // 给ul添加动画结束事件
    oUl.addEventListener("transitionend", function() {
        // 动画结束的时候把动画清掉
        css(oUl, "transition", "");
        window.setTimeout(function() {
            // 把图片恢复到默认样式
            that.clearQueue();
            // 把ul的位置恢复到0
            css(oUl, "left", 0);
        });
    });
};
```

图片切换的时候需要有平移的动画，所以我们需要动画播放前做一个排版

```JavaScript
Banner.prototype.queue = function() {
    // 计算上一个图片的索引
    var prev = this.count == 0 ? this.images.length - 1 : this.count - 1;
    // 计算下一个图片的索引
    var next = this.count == this.images.length - 1 ? 0 : this.count + 1;
    // 获取所有Li
    var aLi = this.element.querySelectorAll(".banner-list li");

    // 把上一个图片移动到左边，并加上zIndex，防止图片看不到
    css(aLi[prev], {
        left: "-100%",
        zIndex: 1
    });
    // 把下一个图片移动到右边，并加上zIndex，防止图片看不到
    css(aLi[next], {
        left: "100%",
        zIndex: 1
    });
};
```

等动画结束以后需要清空排版，防止下次播放的时候排版出错

```JavaScript
Banner.prototype.clearQueue = function() {
    var that = this;
    // 获取所有Li
    var aLi = this.element.querySelectorAll(".banner-list li");
    // 把样式恢复到默认
    forEach(aLi, function(oLi, index) {
        css(oLi, {
            left: 0,
            top: 0,
            zIndex: that.count == index ? 1 : 0
        });
    });
};
```

最后需要做一些图片切换和自动播放，切换图片跟之前稍微有变动，但是自动播放还是跟之前一样

```JavaScript
/*
 * 下一个图片
 **/
Banner.prototype.next = function() {
    var oUl = this.element.querySelector(".banner-list");

    // 把图片排列
    this.queue();

    // 把索引++，并限制不要超过图片数量
    this.count++;
    if (this.count > this.images.length - 1) {
        this.count = 0;
    }

    // 给ul加动画，等播放完把动画干掉
    css(oUl, "transition", "0.6s ease");
    // 给代码延迟，为了让left有移动效果
    window.setTimeout(function() {
        css(oUl, "left", "-100%");
    });
};
/*
 * 上一个图片
 **/
Banner.prototype.prev = function() {
	var oUl = this.element.querySelector(".banner-list");

	// 把图片排列
	this.queue();

	// 把索引--，并限制不要低于0
	this.count--;
	if (this.count < 0) {
		this.count = this.images.length - 1;
	}

	// 给ul加动画，等播放完把动画干掉
	css(oUl, "transition", "0.6s ease");
	// 给代码延迟，为了让left有移动效果
	window.setTimeout(function() {
		css(oUl, "left", "-100%");
	});
};

/*
 * 自动播放
 **/
Banner.prototype.autoPlay = function() {
	var that = this;

	// 先清空定时器，在进行自动播放
	window.setInterval(this.autoPlayTimer);
	this.autoPlayTimer = window.setInterval(function() {
		that.next();
	}, this.options.time);
};
```
