ARCH.content.views.recipe = {};

ARCH.content.views.recipe.set = function( idx ){
	this.curr_recipe = ARCH.data.recipes[ idx ];
};

ARCH.content.views.recipe.get_ingredient_category = function( ingredient ){
	var category = ARCH.ingredient_categories.find(function( c ){
		return c.ingredients.includes( ingredient.name );
	});
	if( category ) return category.name;
	return '???';
};

ARCH.content.views.recipe.get_grouped_ingredients = function(){
	var grouped_ingredients = {};
	
	this.curr_recipe.ingredients.forEach(function( ingredient ){
		var category = this.get_ingredient_category( ingredient );
		if( !grouped_ingredients[ category ] ) grouped_ingredients[ category ] = [];
		grouped_ingredients[ category ].push( ingredient );
	}, this);
	
	return grouped_ingredients;
};

ARCH.content.views.recipe.get_ordered_ingredient_group_names = function( groups ){
	var names = ARCH.ingredient_categories.map( x => x.name );
	return Object.keys( groups ).sort( (a,b) => ( names.indexOf( a ) - names.indexOf( b ) ) );
};

ARCH.content.views.recipe.get_next_dish_suggestions = function(){
	console.log( this.curr_recipe );
};

ARCH.content.views.recipe.draw = function(){
	var grouped_ingredients = this.get_grouped_ingredients();
	$("#content").html(
		'<div class="container recipe">' +
				'<div class="item">' +
					ARCH.content.get_servings_html(        this.curr_recipe ) +
					ARCH.content.get_prep_time_html(       this.curr_recipe ) +
					ARCH.content.get_cook_time_html(       this.curr_recipe ) +
					ARCH.content.get_recipe_cuisines_html( this.curr_recipe ) +
					'<table>' +
						'<tr>' +
							'<td class="title">' + this.curr_recipe.name + '<hr></div>' +
						'</tr>' +
						'<tr><td class="img" style="background-image:url(' + ARCH.content.get_recipe_image( this.curr_recipe.name ) + ');"></td></tr>' +
						'<tr><td class="ingredients">' +
							'<div class="recipe-section-title">Ingredients<hr></div>' +
							this.get_ordered_ingredient_group_names( grouped_ingredients ).map(function( group_name ){
								var group = grouped_ingredients[ group_name ];
								return '<div class="ingredient-group-label">' +
										group_name + '<hr>' +
									'</div>' + group.map(function( ing, ing_idx ){
										var ingredient = ing;
										var alternate_units = ARCH.functions.get_alternate_units( ing.val, ing.units );
										if( typeof( ing ) == 'object' ){
											var ingredient_name = ing.name;
											if( !ing.units && ing.val != 1 ){
												ingredient_name = ing.plural || ing.name + 's';
											}
											ingredient = ARCH.functions.number_to_fraction( ing.val ) + ' ' +
												( ing.units ?
													ARCH.functions.format_units( ing.val, ing.units ) + 
													( alternate_units ? ' <span class="alternate-units">(or ' + alternate_units + ')</span>' : '' ) +
													' of '
													: ''
												) +
												'<span class="ingredient-name ' + ( ing.spicy ? 'spicy' : '' ) + '">' + ingredient_name + '</span>' + 
												( ing.style ? ', ' + ing.style : '' );
										}
										return '<div class="ingredient">' +
											'<span class="ingredient-text no-highlight" onclick="$( this ).parent().toggleClass(\'completed\');">' +
												'<span class="bullet">&bull;</span>' + ingredient + 
											'</span>' +
											// '<hr>' +
										'</div>';
									}).join('');
							}).join('') +
							// this.curr_recipe.ingredients.map(function( ing ){
							// 	var ingredient = ing;
							// 	var alternate_units = ARCH.functions.get_alternate_units( ing.val, ing.units );
							// 	if( typeof( ing ) == 'object' ){
							// 		ingredient = ARCH.functions.number_to_fraction( ing.val ) + ' ' +
							// 			( ing.units ?
							// 				ARCH.functions.format_units( ing.val, ing.units ) + 
							// 				( alternate_units ? ' <span class="alternate-units">(or ' + alternate_units + ')</span>' : '' ) +
							// 				' of '
							// 				: ''
							// 			) +
							// 			'<span class="ingredient-name ' + ( ing.spicy ? 'spicy' : '' ) + '">' + ing.name + '</span>' + 
							// 			( ing.style ? ', ' + ing.style : '' );
							// 	}
							// 	return '<div class="ingredient">' +
							// 		'<span class="ingredient-text no-highlight" onclick="$( this ).parent().toggleClass(\'completed\');">' +
							// 			'<span class="bullet">&bull;</span>' + ingredient + 
							// 		'</span>' +
							// 		'<hr>' +
							// 	'</div>';
							// }).join('') + 
						'</td></tr>' +
						'<tr><td class="steps">' +
							'<div class="recipe-section-title">Steps<hr></div>' +
							this.curr_recipe.steps.map(function( step, i ){
								return '<div class="step"  onclick="$( this ).toggleClass(\'completed\');">' + 
									'<span class="number">' + ( i + 1 ) + '</span>' + step +
								'</div>';
							}).join('<hr>') + 
						'</td></tr>' +
						'<tr><td class="completed">' +
							'<div class="button suggestions-button" onclick="ARCH.content.views.recipe.get_next_dish_suggestions();">' + 
								'Suggestions for Next Dish' +
							'</div>' +
						'</td></tr>' +
					'</table>' +
				'</div>' +
		'</div>'
	);
};