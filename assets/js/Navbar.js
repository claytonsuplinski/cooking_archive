ARCH.navbar = {
	groups : [
		{ name : 'Dish' },
		{ name : 'Cuisine' },
		{ name : 'Cookware' },
	]
};

ARCH.navbar.show_options = function( id ){
	this.hide_options();
	var pos = $( '#option-button-' + id ).offset();
	$( '#dropdown-options-' + id ).css({ left : pos.left });
	$( '#dropdown-options-' + id ).show();
	event.stopPropagation();

	$( document ).on( 'click.options', function(){
		ARCH.navbar.hide_options();
		$( document ).off( 'click.options' );
	});
};

ARCH.navbar.hide_options = function(){
	$( '.dropdown-options' ).hide();
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
				return '<div id="option-button-' + id + '" class="option no-highlight" onclick="ARCH.navbar.show_options( \'' + id + '\' );">' +
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
			'<div style="width:50px;display:inline-block;"></div>' +
		'</div>'
	);
};