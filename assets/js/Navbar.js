ARCH.navbar = {
	groups : [
		// { name : 'Dish' },
		// { name : 'Cuisine' },
		// { name : 'Cookware' },
	]
};

ARCH.navbar.show_dropdown = function( group ){
};

ARCH.navbar.hide_dropdown = function( group ){
};

ARCH.navbar.draw = function(){
	$(".header").html(
		'<div class="header-navbar">' +
			'<a href="index.html">' +
				'<div class="page-title">Cooking Archive<hr></div>' +
			'</a>' +
			this.groups.map(function( option ){
				var is_selected = ( option.name == 'Cuisine');
				return '<div class="option ' + ( is_selected ? 'selected' : '' ) + '">' +
					option.name +
					( is_selected ? '<hr>' : '' ) +
				'</div>';
			}).join('') +
		'</div>'
	);
};