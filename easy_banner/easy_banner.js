/*
 * 创建Banner对象
 * @obj {string, object} css选择器或者dom对象
 * @images {array} [images.src] = 图片路径, [images.link] = 点击链接
 * @options {object} [options.autoPlay] = {boolean}, [options.time] = {number}
 */
function Banner(obj, images, options) {
	this.element = null;
	this.images = images;
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
/*
 * 创建元素
 */
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
/*
 * 自动播放
 */
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
