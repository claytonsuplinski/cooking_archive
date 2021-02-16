ARCH.content.views.main = {};

ARCH.content.views.main.draw = function(){
	var recipe_types = {};
	
	ARCH.data.recipes.forEach(function( recipe ){
		var type = recipe.dish || 'unknown';
		if( !recipe_types[ type ] ) recipe_types[ type ] = { recipes : [] };
		recipe_types[ type ].recipes.push( recipe );
	});

	$("#content").html(
		// '<div id="search-bar"><input placeholder="&#xF002;   Filter recipes..."></input></div><br>' +
		// [ 'dish', 'cookware', 'cuisine' ].map(function( category ){
		// 	return ARCH.content.sub_categories[ category ].sort( (a,b) => ( b.count - a.count ) ).map(function( dish ){
		// 		return '<div class="recipe-type-button">' +
		// 			ARCH.functions.to_title_case( dish.name ) + ' <span class="num-recipes">' + dish.count + '</span>' +
		// 		'</div>';
		// 	}).join('');
		// }).join('<br>') + '<br>' +
		ARCH.data.recipes.map(function( recipe ){
			var prep_time = ARCH.functions.get_recipe_time({ recipe, key : 'prep', abbreviated : true });
			var cook_time = ARCH.functions.get_recipe_time({ recipe, key : 'cook', abbreviated : true });
			return '<div class="container">'+
				'<a href="' + ARCH.hashlink.get_url( recipe.name ) + '">'+
					'<div class="item selectable">'+
						( recipe.servings ? '<div class="info-label servings">Servings : '    + recipe.servings + '</div>' : '' ) +
						( prep_time       ? '<div class="info-label time-label prep">Prep : ' + prep_time       + '</div>' : '' ) +
						( cook_time       ? '<div class="info-label time-label cook">Cook : ' + cook_time       + '</div>' : '' ) +
						( recipe.cuisines ?
							recipe.cuisines.map(function( cuisine, i ){
								var style = 'background-image:url(' + ARCH.content.get_cuisine_image( cuisine ) + ');';
								if( i ) style += 'left:' + ( 30 * i + 5 ) + 'px;';
								return '<div class="info-label cuisine-icon" style="' + style + '"></div>';
							}).join('')
							: ''
						) +
						'<table>'+
							'<tr>'+
								'<td class="title">' + recipe.name + '<hr></div>'+
							'</tr>'+
							'<tr><td class="img" style="background-image:url(' + ARCH.content.get_recipe_image( recipe.name ) + ');"></td></tr>'+
						'</table>'+
					'</div>'+
				'</a>'+
			'</div>';
		}, this).join('')
	);
};