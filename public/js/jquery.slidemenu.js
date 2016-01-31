(function($){
    $.fn.extend({
        slideMenu : function(options){
            var defaults = {
				moveBy : "20px",
				delay : 200,
				initialPadding : "5px",
				activeClass : "active"
            };
            var options = $.extend(defaults, options);		
			return this.each(function() {

				var obj = $(this);
				
				var moveBy = options.moveBy
				var delay = options.delay
				var initialPadding = options.initialPadding
				var activeClass = options.activeClass
			
				var items = $('li a', obj);
				
				items.mouseover(function(){
					$(this).attr("id",activeClass); 
					$(this).animate({
						"padding-left": moveBy
					},delay);
				});
				items.mouseout(function(){
					$(this).animate({
						"padding-left": initialPadding,
						"id" : ""
					},delay);
				});
			});
	  }
    });	
}) (jQuery);