/*
 * 
 * @authors yinone(eleven.image@gmail.com)
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
		bounceTime: 1000,
		useTransition: true
	});

	console.dir(myScroll.options);
	//variables
	var $page = $('.page'),
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

	//滑动缩放主函数
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
		var _isSlider = $page.eq(currentPage).children('.slider');
		if(_isSlider){
			_isSlider.find('img').removeClass('showOut');
			var cleanAttr = function(){
				_isSlider.find('img').removeAttr('style');
			}
			setTimeout(cleanAttr, 1000);
		}
	});

	//监听滚动
	myScroll.on('scroll', function(){
		currentZoom = getZoom();//获取缩放倍数
		init();
	});

	//图片旋转淡入淡出
	myScroll.on('scrollEnd', function(){

		//console.log(currentPage);
		//console.log(direction);
		var _sPage;

		//图片旋转主函数
		var imgInit = function(page){
			var $showImg = $page.eq(page).children('.slider') || 0;
			var index = $showImg ? page : 0;
			if(page == index){
				$showImg.find('img').addClass('showOut');
				var i = 0, t= 0.1, j = $showImg.children().length;
				for(; i <= j; i++) {
					if(i==j){
						t = 0.1;
						return false;
					}else{
						t+=0.06; //图片滑动速度
						$showImg.children().eq(i).children('img').css({
							'-webkit-transition-delay': t+'s'
						})
					}
				}
			}
		}

		//向上滑动
		if(direction == 1){
			_sPage  = currentPage + 1;
			imgInit(_sPage);
		}

		//向下滑动
		if(direction == -1){
			_sPage = currentPage -1;
			imgInit(_sPage);
		}
		
		$
	});


	//slider
	var $slider = $('.img-container li');

	$slider.live('tap', function(){


		var _this = $(this),
		   	currentHTML = _this.html();

		//console.log(_this.index());
		//console.log(currentHTML);

		_this.addClass('slider-hide');
		
		_this.prev().addClass('rotate'); //将下一张图片旋转到正常位置
		var emptyNode = function(){
			_this.removeClass('rotate');

		}
	 	setTimeout(emptyNode, 2000); 

	 	if(_this.index() == 0){
	 		$slider.removeClass('slider-hide');
	 	}
	});


	//input validate
	$('.radio').on('tap', function(){

		$('.radio').children('input').attr('checked','');
		$(this).children('input').attr('checked','checked');
	})

	$('#nowSubmit').on('tap', function(){

		var username = $('#name').val(),
			male = $('input[name="sex"][checked="checked"]').val(),
			mobile = $('#mobile').val(),
			date = $('#date').val(),
			square = $('#square').val();

		var msg = {
			successMsg: '恭喜您！预约成功！',
			failMsg: '系统繁忙，请稍后再试！'
		}

		var reg = /^1\d{10}$/;
		//console.log(name, male, mobile, date, square);

		if(!username){
			alert('请输入用户名！');
		}else if(!reg.test(mobile)){
			alert('请输入正确的电话号码！');
		}else if(!date){
			alert('请输入预约时间！');
		}else{


			$.ajax({
				url: 'book.php',
				type: 'post',
				dataType: 'json',
				data: {
					name: username,
					male: male,
					mobile: mobile,
					date: date,
					square: square
				},
				success: function(data){
					console.dir(data);
					$('.notice').html(msg.successMsg).addClass('showNotice');

				},
				error: function(xhr, errorType, error){
					$('.notice').html(msg.failMsg).addClass('showNotice');
					console.dir(errorType);
				}
			})

		}
	})
	

	//showStar
	$('<i></i>')
	$('.m-animationBox').append('Some text')
});

