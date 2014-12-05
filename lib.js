/**
 * 
 * @authors yinone (eleven.image@gmail.com)
 * @link    http://yinone.com
 * @date    2014-12-03 10:31:43
 * @version $Id$
 */

 	//PageSlider Library

	function PageSlider(opts){

		this.wrapper = opts.wrapper; //@Element Object
		this.page    = opts.page;	//@NodeList Object

		//构造函数
		this.init();
		this.renderDOM();
		this.bindDOM();
	}

	//init
	PageSlider.prototype.init = function(){
		
		//get current device size
		this.scaleW = window.innerWidth;
		this.scaleH = window.innerHeight;
		this.screenH = screen.availHeight;
		this.index = 0;
		this.len = this.page.length;
		this.wrapperCls = this.wrapper.className;
		this.pageCls = this.page[0].className;
		this.os  = navigator.userAgent;
		console.log(this.os);

		//set page size
		this.wrapper.style.width = this.scaleW+'px';
		this.wrapper.style.height = this.scaleH+'px';

		for(var i = 0; i < this.len; i++){

			this.page[i].style.webkitTransform = 'translate3d(0,' + i*this.scaleH+ 'px,0)';
			this.page[i].style.height = this.scaleH+'px';
		}

		this.addEffect(this.index, 'animateImg');

		this.pre = document.getElementsByClassName('pre-page')[0];
		this.arrow = document.getElementsByClassName('arrowDown')[0];
		this.music = document.getElementById('music');
		this.main = document.getElementById('wrapper');
		this.pre.style.height = this.scaleH+'px';

		var self = this;
		function preHide(){

			self.pre.style.display = 'none';
			self.main.style.display = 'block';
			self.arrow.style.visibility = this.music.style.visibility  = 'visible';

		}

		setTimeout(preHide, 1000);
		
		document.body.addEventListener("touchmove", function(event) {
		    console.dir(event);	
		    event.preventDefault();
		});

		var hasVideo = !!(document.createElement('audio').canPlayType);

		console.log(hasVideo);
	};


	//addClass
	PageSlider.prototype.addClass = function(obj, cls){
		if (!this.hasClass(obj, cls)) obj.className += " " + cls;
	}

	//hasClass
	PageSlider.prototype.hasClass = function(obj, cls){
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}

	//removeClass
	PageSlider.prototype.removeClass = function(obj, cls){
		if (this.hasClass(obj, cls)) {  
	        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');  
	        obj.className = obj.className.replace(reg, ' ');  
	    }  
	}

	//addEffect
	PageSlider.prototype.addEffect = function(index, cls){

		console.log(index);

		var Img = this.page[index] && (this.page[index].getElementsByClassName(cls));
		if(typeof Img == 'undefined'){
			return false;
		}
		var j = Img.length;
		var dataStyle = null;
		for(var i = 0; i < j; i++){
			dataStyle = Img[i].dataset.effect || null;
			dataStyle && this.addClass(Img[i], dataStyle);
		}
	}

	//removeEffect
	PageSlider.prototype.removeEffect = function(index, cls){

		console.log(index);
		var Img = this.page[index] && (this.page[index].getElementsByClassName(cls));
		if(typeof Img == 'undefined'){
			return false;
		}

		var j = Img.length;
		var dataStyle = null;
		for(var i = 0; i < j; i++){
			dataStyle = Img[i].dataset.effect || null;
			dataStyle && this.removeClass(Img[i], dataStyle);
		}
	}

	//renderDoM
	PageSlider.prototype.renderDOM = function(){

	}

	//goIndex
	PageSlider.prototype.goIndex = function(n){


		var idx = this.index;
		var list = this.page;
		var currentIndex;
		var screenH = this.screenH;

		if(typeof n == 'number'){
		//指定跳到哪一页
			idx = n;
		}else if(typeof n == 'string'){
		//正常翻页
			currentIndex = idx + n*1;
		}

		if(currentIndex < 0){
			currentIndex = 0;
		}else if(currentIndex > this.len-1){
			currentIndex = this.len-1;
		}

		this.index = currentIndex;
		// console.log(this.index);

		list[currentIndex].style.webkitTransition = '-webkit-transform 0.2s ease-out';
		list[currentIndex-1] && (list[currentIndex-1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
		list[currentIndex+1] && (list[currentIndex+1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

		if(this.os.match('iPhone')){
			console.log(screenH);


			list[currentIndex].style.webkitTransform = 'translate3d(0,0,0)';
			list[currentIndex-1] && (list[currentIndex-1].style.webkitTransform = 'translate3d(0,-'+ screenH +'px,0)');
			list[currentIndex+1] && (list[currentIndex+1].style.webkitTransform = 'translate3d(0,'+ screenH +'px,0)');
		}else{

			list[currentIndex].style.webkitTransform = 'translate3d(0,0,0)';
			list[currentIndex-1] && (list[currentIndex-1].style.webkitTransform = 'translate3d(0,-'+ this.scaleH +'px,0)');
			list[currentIndex+1] && (list[currentIndex+1].style.webkitTransform = 'translate3d(0,'+ this.scaleH +'px,0)');
		}
		


	}

	//bindDOM
	PageSlider.prototype.bindDOM = function(){

		var self = this;
		var len = self.len;
		var outer = self.wrapper;
		var distance = self.scaleH;
		var list = self.page;
		var arrow = self.arrow;
		var music = self.music;
		var screenH = self.screenH;

		//touchstart
		var startHandler = function(evt){

			//记录滑动开始时间
			self.startTime = new Date() * 1;

			//记录手指按下的坐标
			self.startY = evt.touches[0].pageY

			//事件对象
			var target = evt.target;

			self.target = target;

			console.log(self.index);
		}

		//touchmove
		var moveHandler = function(evt){
			//兼容chrome android，阻止浏览器默认行为
			evt.preventDefault();
			//计算手指偏移量
			self.offsetY = evt.targetTouches[0].pageY - self.startY;

			// if()

			//当前所在页的起始三张图片
			var i = self.index - 1; 
			var m = i + 3;

			//监听滚动触摸距离
			for(i; i < m; i++){

				list[i] && (list[i].style.webkitTransition = '-webkit-transform 0s ease-out');
				list[i] && (list[i].style.webkitTransform  = 'translate3d(0,'+((i-self.index)*distance+self.offsetY)+'px, 0)');

			}
		}

		//touchend
		var endHandler = function(evt){
			evt.preventDefault();

			//边界值
			var boundary = distance/8;

			// console.log(boundary);

			//滑动结束时间
			var endTime = new Date*1;

			//滑动时间
			var duringTime = endTime - self.startTime;

			//正常速度移动翻页
			if(duringTime > 300){
				if(self.offsetY > boundary){
					self.goIndex('-1');
				}else if(self.offsetY < -boundary){
					self.goIndex('+1');
				}else{
					self.goIndex('0');
				}
			}else{
				//快速移动翻页
				if(self.offsetY > 50){
					self.goIndex('-1');
				}else if(self.offsetY < -50){
					self.goIndex('+1');
				}else{
					self.goIndex('0');
				}
			}

			console.log(self.index);
		}

		//pageEnd
		var pageEnd = function(evt){

			//页面切换结束当前index
			var pageEndIndex = self.index;
			// console.log(pageEndIndex);

			if(pageEndIndex > len-1 ){
				pageEndIndex = len-1;
			}
			if(pageEndIndex < 0){
				pageEndInex = 0;
			}
			if(pageEndIndex == len-1){
				arrow.style.webkitTransition = '-webkit-transform 1s ease-out forwards';
				arrow.getElementsByTagName('img')[0].style.webkitTransform = 'rotateZ(0)';
			}
			if(pageEndIndex == 0){

				arrow.getElementsByTagName('img')[0].style.webkitTransform = 'rotateZ(180deg)';
			}

			var i = pageEndIndex-1;
			var f = pageEndIndex+1;

			console.log(i, pageEndIndex, f);

			self.addEffect(pageEndIndex, 'animateImg');
			self.removeEffect(i, 'animateImg');
			self.removeEffect(f, 'animateImg');

			console.log(self.index);

		}

		var musicPlay = function(evt){
			var oAudio = music.getElementsByTagName('audio')[0];
			if(oAudio.paused){
				oAudio.play();
				console.log('music is playing now!');
				music.style.webkitAnimationName = 'musicPlay';
				music.style.backgroundImage = 'url(images/music.png)';
			}else{
				oAudio.pause();
				console.log('music has paused!');
				music.style.webkitAnimationName = 'Eleven';
				music.style.backgroundImage = 'url("images/music-off.png")';
			}
		}

		outer.addEventListener('touchstart', startHandler);
		outer.addEventListener('touchmove', moveHandler);
		outer.addEventListener('touchend', endHandler);
		outer.addEventListener('transitionend', pageEnd);
		music.addEventListener('touchstart', musicPlay);
	}
