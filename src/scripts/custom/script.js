$(function() {

	$('._phone-mask').mask('+7 (000) 000-00-00', {
		placeholder: '+7 (___) ___-__-__',
		selectOnFocus: true
	});

	$('.custom-scroll_container').customScroll();

	$('[data-fancybox="images"]').fancybox();

	$('.reviews-slider').slick({
		nextArrow: $('.slider-wrap__arrow._next'),
		prevArrow: $('.slider-wrap__arrow._prev'),
		infinite: true,
		slidesToShow: 2,
		swipeToSlide: true,
		responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
				infinite: true,
			}
		},
		{
			breakpoint: 959,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
		]
	});

	$('.certificates-slider').slick({
		infinite: true,
		nextArrow: $('.slider-wrap__arrow._next'),
		prevArrow: $('.slider-wrap__arrow._prev'),
		slidesToShow: 4,
		swipeToSlide: true,
		responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 4,
			}
		},
		{
			breakpoint: 769,
			settings: {
				slidesToShow: 3,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 2,
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
			}
		}
		]
	});

	
	let modalInit,
		modalInitClass = $('.popup');

	(modalInit = function() {
		modalInitClass.magnificPopup({
			type: 'inline',
			fixedContentPos: true,
			fixedBgPos: true,
			overflowY: 'auto',
			closeBtnInside: true,
			preloader: false,
			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-zoom-in',
			showCloseBtn: false,
			callbacks: {
				beforeOpen: function() {
					if ($('#callback-form').find('.callback-form__field').length > 0) {
						this.st.focus = $('#callback-form').find('.callback-form__field');
					} else {
						this.st.focus = false;
					}
				}
			}
		});
	})();

	$('.popup-close').on('click',function(){ $.magnificPopup.close(); });
	modalInitClass.on('click', modalInit);

// header search form

	(function () {
		var search = $('.header__search'),
			searchBtn = $('.header__search-btn'),
			field = search.find('.search-form__field');
		
		searchBtn.on('click', function() {
			$(this).toggleClass('_active');
			search.fadeToggle();
			field.focus();
		});

		field.on('keyup', searchReset);

		$(document).on('click touchstart', function(event) {
			if (searchBtn.is('._active') && $(event.target).closest(search).length === 0 && $(event.target).closest(searchBtn).length === 0) {
				search.fadeOut();
				searchBtn.removeClass('_active');
				field.blur();
			}
		});
	})();

	function searchReset() {
		let resetBtn = $('.search-form__reset');

		($(this).val() === '') ? resetBtn.removeClass('_visible') : resetBtn.addClass('_visible');
	};

	$('.search-form__reset').on('click', function() {
		$(this).siblings('.search-form__field').val('');
	});

// Аккордеон, когда у первого элемента в разметке указан класс '._open', чтобы не триггерить событие на первом элементе

	$('.faq-list__item-toggle').on('click', function() {
		if ($(this).hasClass('_open')){
			$(this).toggleClass('_open').siblings('.faq-list__item-desc').stop().slideUp(400);
		} else {
			$('.faq-list__item-toggle').removeClass('_open').siblings('.faq-list__item-desc').stop().slideUp(400);
			$(this).addClass('_open').siblings('.faq-list__item-desc').stop().slideDown(400);
		}
	});

// Кнопка скролла наверх

	$(window).scroll(function() {
		($(this).scrollTop() > 100 && !$('body').hasClass('_no-scroll')) ? $('.scrollTop').addClass('_show') : $('.scrollTop').removeClass('_show');
	});

	$('.scrollTop').click(function() {
		$('html, body').animate({scrollTop : 0}, 600);
		return false;
	});


// burger-menu
	$('.burger-button').on('click', function() {
		// $('.header__search-btn').trigger('click');
		$('body').toggleClass('_no-scroll');
		
		if ($(this).hasClass('_active')) {
			$(this).removeClass('_active');
			$('.nav').removeClass('_js-show');
			$('.submenu').removeClass('_js-show');
			$('.submenu__elements').removeClass('_js-show');
		} else {
			$(this).addClass('_active');
			$('.nav').addClass('_js-show');
		}
	});

// dropdown menu
	(function() {
		var submenu = $('.submenu'),
			menuDropdownLink = $('.nav__link._dropdown');

		$(document).click(function(event) {
			if ($(event.target).closest(menuDropdownLink).length && $(window).width() > 1024) {
				submenu.toggleClass('_open');
				menuDropdownLink.toggleClass('_open');
				return;
			}

			if ($(event.target).closest(submenu).length) return;
			
			submenu.removeClass('_open');
			menuDropdownLink.removeClass('_open');

			if ($(event.target).closest(menuDropdownLink).length && $(window).width() <= 1024) {
				submenu.toggleClass('_js-show');
			}
		});
	})();

	$('.submenu__col-title').on('click', function() {
		let submenuList = $(this).closest('.submenu__col').find('.submenu__elements');

		submenuList.addClass('_js-show');
	});

	$('.return-btn').on('click', function() {
		$(this).closest('._js-show').removeClass('_js-show');
	});

});