(function($){

		/* ---------------------------------------------- /*
		 * Animated scrolling / Scroll Up
		/* ---------------------------------------------- */

		$('a[href*=#]').bind("click", function(e){
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top
			}, 1000);
			e.preventDefault();
		});

		function updateNavbarScrollState() {
			if ($(window).scrollTop() > 0) {
				$('.header nav').addClass('bg-background/80 backdrop-blur-xl border-b border-border/50').removeClass('bg-transparent');
			} else {
				$('.header nav').removeClass('bg-background/80 backdrop-blur-xl border-b border-border/50').addClass('bg-transparent');
			}
		}

		$(window).scroll(function() {
			if ($(this).scrollTop() > 100) {
				$('.scroll-up').fadeIn();
			} else {
				$('.scroll-up').fadeOut();
			}
			updateNavbarScrollState();
		});

		updateNavbarScrollState();

		/* ---------------------------------------------- /*
		 * Initialize shuffle plugin
		/* ---------------------------------------------- */

		var $portfolioContainer = $('.portfolio-items-container');

		$('#filter li').on('click', function (e) {
			e.preventDefault();

			$('#filter li').removeClass('active');
			$(this).addClass('active');

			group = $(this).attr('data-group');
			var groupName = $(this).attr('data-group');

			$portfolioContainer.shuffle('shuffle', groupName );
		});
		
		$('.simple-ajax-popup').magnificPopup({
		  type: 'image',
		  gallery:{enabled:true}
		});		
})(jQuery);