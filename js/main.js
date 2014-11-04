/*
 * 
 * @authors yinone
 * @date    2014-10-24 16:23:25
 * @version 1.00
 */

$(function(){

	//init scroller
	var myScroll = new IScroll('#wrapper', {
		snap: true,
		bounceEasing: 'circular',
		probeType: 3,
		momentum: false,
		hScrollbar: false,
		deceleration: 0.0003,
		bounceTime: 1000
	}),

	$page = $('.page'),
	$wrapper = $('.wrapper'),
	$scroller = $('#scroller'),
	imgHeight = $page.height(),
	totalPages = $('.page').length,
	currentPage = 0, direction = 0, currentZoom = 1;

	//动态获取zoom
	var getZoom = function(){

		var distance = $scroller.css('transform');
		distance = Math.abs(parseInt(distance.slice(15, 20)));
		//console.dir(currentPage);
		var nowZoom = 1-Math.abs(distance - currentPage*imgHeight)/imgHeight;
		return nowZoom;
	};

	//init
	var init = function (){

		//console.log(currentZoom);

		if(direction == 1){

			if(currentPage == totalPages - 1){
				$page.eq(currentPage).css({
					'-webkit-transform': 'scale(1)'
				});
			}else{
				$page.eq(currentPage).css({
					'-webkit-transform': 'scale('+currentZoom+')'
				});
				$page.eq(currentPage).next().css({
					'-webkit-transform': 'scale(1)'
				});
			}
		}

		if(direction == -1){

			if(currentPage == 0){
				$page.eq(0).css({
					'-webkit-transform': 'scale(1)'
				});
			}else{
				$page.eq(currentPage).css({
					'-webkit-transform': 'scale('+currentZoom+')'
				});
				$page.eq(currentPage).prev().css({
					'-webkit-transform': 'scale(1)'
				});
			}
		}
	};


	//获取当前所在Page
	myScroll.on('beforeScrollStart', function(){
		currentPage = this.currentPage.pageY;
	});

	//获取滑动方向
	myScroll.on('scrollStart', function(){
		direction = this.directionY;
	});

	//监听滚动
	myScroll.on('scroll', function(){
		currentZoom = getZoom();
		init();
	});

	myScroll.on('scrollEnd', function(){

		$showImg = $('.slider') || 0;
		if($showImg){
			$('.slider li img').addClass('showOut');
			var i = 0, t= 0.1, j = $showImg.children().length;
			for(; i < j; i++) {
				$showImg.children().eq(i).children('img').css({
					'-webkit-transition-delay': t+++'s'
				})
			}
		}
		// alert(1);
	});


	//slider
	var $slider = $('.img-container li');

	$slider.live('tap', function(){


		var _this = $(this),
		   	currentHTML = _this.html();

		console.log(_this.index());
		console.log(currentHTML);

		_this.addClass('slider-hide');
		_this.prev().addClass('rotate');
		var emptyNode = function(){
			_this.removeClass('rotate');

		}
	 	setTimeout(emptyNode, 2000);

	 	if(_this.index() == 0){
	 		$slider.removeClass('slider-hide');
	 	}
	});

	//showSlider

	
});
