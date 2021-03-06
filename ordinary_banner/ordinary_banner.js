/*
 * 为了有些有些函数不对外公布，用了函数自调用。
 **/
(function() {
	/*
	 * 创建Banner对象
	 * @obj {string, object} css选择器或者dom对象
	 * @images {array} [images.src] = 图片路径, [images.link] = 点击链接
	 * @options {object} [options.autoPlay] = {boolean}, [options.time] = {number}
	 **/
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

		this.createBtn();

		// 自动播放
		if (this.options.autoPlay === true) this.autoPlay();
		// 滚轮事件
		if (this.options.wheelEvent === true) this.wheelEvent();
		// 创建Icon
		if (this.options.showIcon === true) this.createIcon();
	};

	/*
	 * 创建元素
	 **/
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
			css(oUl, "transition", "");
			window.setTimeout(function() {
				that.clearQueue();
				css(oUl, "left", 0);

				that.moving = false;
			});
		});
	};

	/*
     * 图片排版
     * 我们需要在图片切换的时候把图片排列好
     * 等播放完以后需要回复到原来的位置
     **/
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

	/*
     * 把图片恢复到原来位置
     **/
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

	/*
     * 下一个图片
     **/
	Banner.prototype.next = function() {
		if (this.moving) return;
		var oUl = this.element.querySelector(".banner-list");

		this.moving = true;

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
		if (this.moving) return;
		var oUl = this.element.querySelector(".banner-list");

		this.moving = true;

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
			css(oUl, "left", "100%");
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

	/*
     * 创建切换图片按钮
     **/
	Banner.prototype.createBtn = function() {
		var that = this;
		var prevBtn = document.createElement("a");
		var nextBtn = document.createElement("a");
		var prevIcon = document.createElement("span");
		var nextIcon = document.createElement("span");

		prevBtn.href = "javascript:void(0);";
		nextBtn.href = "javascript:void(0);";

		// 给a标签加样式
		css(prevBtn, {
			width: "40px",
			height: "60px",
			backgroundColor: "rgba(0,0,0,0.3)",
			borderRadius: "3px",
			cursor: "pointer",
			position: "absolute",
			left: "20px",
			top: "50%",
			zIndex: 1,
			transform: "translateY(-50%)"
		});
		css(nextBtn, {
			width: "40px",
			height: "60px",
			backgroundColor: "rgba(0,0,0,0.3)",
			borderRadius: "3px",
			cursor: "pointer",
			position: "absolute",
			right: "20px",
			top: "50%",
			zIndex: 1,
			transform: "translateY(-50%)"
		});

		// 三角形箭头
		css(prevIcon, {
			border: "12px solid transparent",
			borderRightColor: "#fff",
			position: "absolute",
			left: "3px",
			top: "18px"
		});
		css(nextIcon, {
			border: "12px solid transparent",
			borderLeftColor: "#fff",
			position: "absolute",
			right: "3px",
			top: "18px"
		});

		// 给a标签添加
		prevBtn.onclick = function() {
			// 因为prev方法里用了this.element，所以不能改this的指向
			that.prev.call(that);

			that.options.autoPlay && that.autoPlay();
		};
		nextBtn.onclick = function() {
			// 因为next方法里用了this.element，所以不能改this的指向
			that.next.call(that);

			that.options.autoPlay && that.autoPlay();
		};

		// 添加Dom节点
		prevBtn.appendChild(prevIcon);
		nextBtn.appendChild(nextIcon);
		this.element.appendChild(prevBtn);
		this.element.appendChild(nextBtn);
	};

	/*
     * 滚轮事件
     **/
	Banner.prototype.wheelEvent = function() {
		var that = this;

		wheelEvent(
			window,
			function() {
				window.clearTimeout(that.wheelTimer);

				that.wheelTimer = window.setTimeout(function() {
					that.prev.call(that);
					that.options.autoPlay && that.autoPlay();
				}, 100);
			},
			function() {
				window.clearTimeout(that.wheelTimer);

				that.wheelTimer = window.setTimeout(function() {
					that.next.call(that);
					that.options.autoPlay && that.autoPlay();
				}, 100);
			}
		);
	};

	/*
	 * 模仿jquery的css方法
	 * @elements {object} Dom元素
	 * @arguments[1] {string, object} 接收样式名和json
	 * @arguments[2] {string} 接收样式
	 **/
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
		var elements = elements[0] ? elements : [elements];
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

	/*
     * forEach封装
     * @obj {array, object} 接收Array和Json
     * @fn {function} 接收函数
     **/
	function forEach(obj, fn) {
		// 判断obj是不是一个对象，如果不是报错
		if (typeof obj !== "object") {
			console.error("The first argument is not Array or Object!");
			return;
		}

		// 循环的时候其实都可以用 for in 循环, 但是 for in 循环比for循环慢
		// 为了性能优化我去判断了是不是数组
		// 没有用instanceof来判断的原因是因为Js里伪数组，伪数组也可以用for循环来循环。
		if (obj.length) {
			for (var i = 0; i < obj.length; i++) {
				//判断fn是不是函数，如果是函数就运行fn
				typeof fn === "function" && fn(obj[i], i, obj);
			}
		} else {
			for (var key in obj) {
				typeof fn === "function" && fn(obj[key], key, obj);
			}
		}
	}
	/*
     * 监听滚动条事件，兼容写法
     **/
	function wheelEvent(obj, upFn, downFn) {
		var prefix = "";
		var _addEventListener = "";
		var support = "";

		// 判断浏览器支不支持addEventListener方法
		if (window.addEventListener) {
			// 如果支持用addEventListener
			_addEventListener = "addEventListener";
		} else {
			// 如果不支持用attachEvent
			_addEventListener = "attachEvent";
			// *attachEvent绑定事件的时候前面要加on,所以给prefix存on，等绑定的时候用
			prefix = "on";
		}

		// 判断该用哪一个事件
		support =
			"onwheel" in document.createElement("div")
				? "wheel"
				: document.onmousewheel !== undefined
					? "mousewheel"
					: "DOMMouseScroll";

		// 事件绑定
		obj[_addEventListener](prefix + support, function(ev) {
			var oEvent = ev || window.event;

			// 滚动方向 true为往下，false为网上
			var down = oEvent.wheelDelta
				? oEvent.wheelDelta < 0
				: oEvent.wheelDelta > 0;

			// 往下滚动，调用downFn callback
			// 网上滚动，调用upFn callback
			if (down) downFn && downFn(oEvent);
			else upFn && upFn(oEvent);
		});
	}
})();
