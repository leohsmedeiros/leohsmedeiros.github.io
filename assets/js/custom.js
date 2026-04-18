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
		
})(jQuery);