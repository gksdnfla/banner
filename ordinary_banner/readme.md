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

开始创建 Dom。这个函数也跟之前一样的，直接复制。

```JavaScript

```
