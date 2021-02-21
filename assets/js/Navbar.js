ARCH.navbar = {
	groups : [
		{ name : 'Dish' },
		{ name : 'Cuisine' },
		{ name : 'Cookware' },
	]
};

ARCH.navbar.draw = function(){
	$(".header").html(
		'<div class="header-navbar">' +
			'<a href="index.html">' +
				'<div class="page-title">Cooking Archive<hr></div>' +
			'</a>' +
			this.groups.map(function( option ){
				var id = ARCH.functions.str_to_id( option.name );
				var data = ARCH.content.sub_categories[ option.name.toLowerCase() ];
				return '<div class="option no-highlight">' +
					option.name +
					'<hr>' +
					'<div id="dropdown-options-' + id + '" class="dropdown-options">' +
						data.sort( (a,b) => ( b.count - a.count ) ).map(function( dish ){
							var include = {};
							include[ option.name.toLowerCase() ] = dish.name;
							return '<a href="' + ARCH.hashlinks.get_url({ clear : true, include }) + '">' + 
								'<div class="dropdown-option">' +
									ARCH.functions.to_title_case( dish.name ) + ' <span class="num-recipes">' + dish.count + '</span>' +
								'</div>' + 
							'</a>';
						}).join('') +
					'</div>' +
				'</div>';
			}).join('') +
		'</div>'
	);
};