/**
 * 
 * @authors yinone (eleven.image@gmail.com)
 * @link    http://yinone.com
 * @date    2014-12-09 10:31:43
 * @version $Id$
 */
/********************************************
*                        					*
*			  PAGE LIBRARY				    *
*											*
*********************************************/

 'use strict';

/* PAGE */

var Page = function(el, opts){

    /*
    *   @description 移动端切屏动画框架
    *   @param {object | string} el - 包裹动画元素的父元素，接受css选择器和DO
    *   @param {object} opts - 可配置选项
    */
    
	var setting = opts || {};

	this.duration = setting.duration || 0.3; //切屏速度
	this.currentPage = setting.currentPage || 0; //当前所在page

	this.$el = (typeof el === 'string') ? document.querySelector(el) : el; //
	this.total = this.$el.children.length - 1; //所有page

	this.init();
	this.renderDOM();
	this.bindDOM();
}

//初始化page
Page.prototype.init = function(){

	this.os  = navigator.userAgent
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.scaleEnd = 0.6;

	this.wrapper = this.$el;
	this.index = this.currentPage;
	this.wrapper.style.width = this.width+'px';
	this.wrapper.style.height = this.height+'px';
	this.wrapper.style.overflow = 'hidden';

	this.audio = document.getElementsByTagName('audio')[0];
	this.music = document.getElementById('music');
	this.music.style.webkitAnimation = 'musicPlay 2s linear infinite';

	document.body.addEventListener('touchmove', function(evt){evt.preventDefault()}, false);
	window.addEventListener('touchmove', function(evt){evt.preventDefault()}, false);

	for (var i = this.total; i >= 0; i--) {
		this.wrapper.children[i].style.webkitTransform = 'translate3d(0,'+i*this.height+'px,0)';
	};

	this.go(this.index);
	this.wrapper.children[this.index].style.webkitTransform='translate3d(0,0,0) scale(1)';
	(this.wrapper.children[0]).children[0].style.display = 'block';
	for(var i = 1; i < this.total; i++){
		(this.wrapper.children[i]).children[0].style.display = 'none';
	}

	if(this.audio.paused){
		this.audio.play();
	}


}

//插入必要DOM
Page.prototype.renderDOM = function(){

	this.page = this.wrapper.children;

	for (var i = this.page.length - 1; i >= 0; i--) {
		this.page[i].style.width = this.width+'px';
		this.page[i].style.height = this.height+'px';
		this.page[i].style.overflow = 'hidden';
	};
}

//绑定必要DOM事件
Page.prototype.bindDOM = function(){

	var self = this;
	var cH = self.height;
	var outer = self.$el;
	var distance = cH;
	var range = distance/6;
	var page = self.wrapper.children;
	var idx = self.index;
	var scaleEnd = self.scaleEnd;
	var total = self.total;
	var oAudio = self.audio;
	var music = self.music;
	var os = self.os;

	var startHandler = function(evt){
		evt.preventDefault();

		self.startY = evt.touches[0].pageY;
		self.targetNode = evt.touches[0].target; 
		self.cidx = self.index; 
		self.distanceY = 0;
		self.startTime = new Date() *1;

	}

	var moveHandler = function(evt){
		evt.preventDefault();

		self.distanceY = evt.touches[0].pageY - self.startY;
		self.scale = 1 - Math.abs(self.distanceY)/distance/3;

		var prev = page[self.cidx -1];
		var next = page[self.cidx +1];
		var current = page[self.cidx];
		var i = self.cidx - 1;
		var j = self.cidx + 1;

		for(; i < j+1; i++){
			page[i] && (page[i].style.webkitTransition = '-webkit-transform 0s ease-out');
		}
  		
  		if((current === page[0]) && (self.distanceY > 0)){
  			page[0] && (page[0].style.webkitTransition = '-webkit-transform 3s ease-out');
  			self.setY(page[0], self.distanceY);
  		}else if((current === page[total]) && (self.distanceY < 0)){
  			if(os.indexOf('iPhone') != -1){
				page[total].style.webkitTransform = 'translate3d(0,0,0)';
			}else{
				page[total] && (page[total].style.webkitTransition = '-webkit-transform 3s ease-out');
				self.setY(page[total], self.distanceY);
			}
  		}else{
  			current.style.webkitTransformOrigin = '50% '+ (self.distanceY > 0? '80%': '20%');
			current.style.webkitTransform = 'scale('+self.scale+')';
			current.style.zIndex = '1';
		}

		prev && self.setY(prev, self.distanceY-distance);
		next && self.setY(next, self.distanceY+distance);
  
	}

	var endHandler = function(evt){
		evt.preventDefault();

		var durationTime = new Date()*1 - self.startTime;

		if(durationTime > 300){
			if(self.distanceY > range){
				self.go('-1');
			}else if(self.distanceY < -range){
				self.go('+1');
			}else{
				self.go('0');
			}
		}else{
			if(self.distanceY > 50){
				self.go('-1');
			}else if(self.distanceY < -50){
				self.go('+1');
			}else{
				self.go('0');
			}
		}	

		var modal = document.querySelector('.modal');
		(self.targetNode.parentNode.classList.contains('shareBtn')) && (modal.classList.toggle('show'));
		(self.targetNode.classList.contains('modal')) && (modal.classList.toggle('show'));
		(self.targetNode.parentNode.classList.contains('enter')) && (window.location.href = document.querySelector('.enter').href);
		

	}

	var musicPlay = function(evt){
		if(oAudio.paused){
			oAudio.play();
			console.log('music is playing now!');
			music.style.webkitAnimation = 'musicPlay 2s linear infinite';
			music.style.backgroundImage = 'url(images/music.png)';
		}else{
			oAudio.pause();
			console.log('music has paused!');
			music.style.webkitAnimation = 'none';
			music.style.backgroundImage = 'url("images/music-off.png")';
		}
	}

	outer.addEventListener('touchstart', startHandler);
	outer.addEventListener('touchmove', moveHandler);
	outer.addEventListener('touchend', endHandler);
	music.addEventListener('touchstart', musicPlay);
}

Page.prototype.go = function(n){

	var self = this;
	var idx = self.index;
	var len = self.total;
	var scaleEnd = self.scaleEnd;
	var page = self.wrapper.children;
	var currentIndex;
	var H = self.height;
	if(typeof n === 'number'){
		currentIndex = n;
	}else if(typeof n === 'string'){
		currentIndex = idx + n*1;
	}

	if(currentIndex < 0){
		currentIndex = 0;
	}else if(currentIndex > self.total){
		currentIndex = self.total;
	}

	self.index = currentIndex;

	page[currentIndex].style.webkitTransition = '-webkit-transform 0.3s ease-out';
	page[currentIndex-1] && (page[currentIndex-1].style.webkitTransition = '-webkit-transform 0.3s ease-out');
	page[currentIndex+1] && (page[currentIndex+1].style.webkitTransition = '-webkit-transform 0.3s ease-out');

	page[currentIndex].style.webkitTransform = 'translate3d(0,0,0)';
	page[currentIndex-1] && (page[currentIndex-1].style.webkitTransform = 'translate3d(0,-'+H+'px,0)');
	page[currentIndex+1] && (page[currentIndex+1].style.webkitTransform = 'translate3d(0,'+H+'px,0)');

	page[currentIndex].style.zIndex = '3';
	page[currentIndex-1] && (page[currentIndex -1].style.zIndex = '');
	page[currentIndex+1] && (page[currentIndex +1].style.zIndex = '');

	if((self.distanceY === 0 )|| ((self.distanceY > 0) && (idx === 0)) || ((self.distanceY < 0) && (idx === len)) || (n === '0')){
		page[idx].style.webkitTransform = 'scale(1)';
	}else{
		page[idx].style.webkitTransform = 'scale('+scaleEnd+')';
	}

	self.animateImg(currentIndex, 'show');
	page[currentIndex-1] && (self.animateImg(currentIndex-1, 'hide'));
	page[currentIndex+1] && (self.animateImg(currentIndex+1, 'hide'));
}

Page.prototype.setY = function(el, y){
	el && (el.style.webkitTransform = 'translate3d(0,'+y+'px,0)');
}

Page.prototype.animateImg = function(curIndex, status){

	var self = this;
	var idx = self.index;
	var len = self.total;
	var outer = self.$el;
	var page = self.wrapper.children[curIndex];

	var animateImgShow = function(){
		page.children[0].style.display = 'block';	
	}

	var animateImgHide = function(){
		page.children[0].style.display = 'none';
	}

	if((typeof status === 'string') && (status === 'show')){
		outer.addEventListener('webkitTransitionEnd', animateImgShow)
	}else if((typeof status === 'string') && (status === 'hide')){
		outer.addEventListener('webkitTransitionEnd', animateImgHide)
	}

}
