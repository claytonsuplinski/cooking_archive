ARCH.content.views.recipe = { completed_ingredients : [] };

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
	ARCH.content.views.main.draw({
		dish             : this.curr_recipe.dish,
		cuisines_exclude : this.curr_recipe.cuisines,
		sort_by          : 'ingredients_different',
		curr_recipe      : this.curr_recipe,
	});
};

ARCH.content.views.recipe.copy_ingredients = function(){
	var copy_text = '';

	this.get_ordered_ingredient_group_names( this.grouped_ingredients ).forEach(function( group_name ){
		var group = this.grouped_ingredients[ group_name ];
		group.forEach(function( ing ){
			if( !ing.completed ){
				var alternate_units = ARCH.functions.get_alternate_units( ing.val, ing.units );
				copy_text += ARCH.functions.number_to_fraction( ing.val ) + ' ' +
					( ing.units ?
						ARCH.functions.format_units( ing.val, ing.units ) + 
						( alternate_units ? ' (or ' + alternate_units + ')' : '' ) +
						' of '
						: ''
					) +
					ARCH.functions.get_plural_ingredient( ing ) +
					( ing.style ? ', ' + ing.style : '' ) +
					'\n';
			}
		});
	}, this);

	ARCH.functions.copy_to_clipboard( copy_text );
};

ARCH.content.views.recipe.toggle_ingredient = function( html_ele, group_name, ingredient_idx ){
	$( html_ele ).parent().toggleClass( 'completed' );
	
	this.grouped_ingredients[ group_name ][ ingredient_idx ].completed = !this.grouped_ingredients[ group_name ][ ingredient_idx ].completed;
};

ARCH.content.views.recipe.draw = function(){
	this.grouped_ingredients = this.get_grouped_ingredients();
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
							'<div class="recipe-section-title">' + 
								'Ingredients ' + 
								'<div class="copy-button" onclick="ARCH.content.views.recipe.copy_ingredients();">Copy</div>' + 
								'<hr>' + 
							'</div>' +
							this.get_ordered_ingredient_group_names( this.grouped_ingredients ).map(function( group_name ){
								var group = this.grouped_ingredients[ group_name ];
								return '<div class="ingredient-group-label">' +
										group_name + '<hr>' +
									'</div>' + group.map(function( ing, ing_idx ){
										var ingredient = ing;
										var alternate_units = ARCH.functions.get_alternate_units( ing.val, ing.units );
										if( typeof( ing ) == 'object' ){
											var ingredient_name = ARCH.functions.get_plural_ingredient( ing );
											ingredient = ARCH.functions.number_to_fraction( ing.val ) + ' ' +
												( ing.units ?
													ARCH.functions.format_units( ing.val, ing.units ) + 
													( alternate_units ? ' <span class="alternate-units">(or ' + alternate_units + ')</span>' : '' ) +
													' of '
													: ''
												) +
												'<span class="ingredient-name ' + ( group_name == 'Spicy' ? 'spicy' : '' ) + '">' + ingredient_name + '</span>' + 
												( ing.style ? ', ' + ing.style : '' ) +
												( ing.prep ?
													' <span class="prep-time">' + ARCH.functions.get_recipe_time({ time_obj : ing.prep, abbreviated : true }) + '</span>'
													: ''
												);
										}
										return '<div class="ingredient">' +
											'<span class="ingredient-text no-highlight" ' + 
														'onclick="ARCH.content.views.recipe.toggle_ingredient( this, \'' + group_name + '\', ' + ing_idx + ' );">' +
												'<span class="bullet">&bull;</span>' + ingredient + 
											'</span>' +
											// '<hr>' +
										'</div>';
									}).join('');
							}, this).join('') +
						'</td></tr>' +
						'<tr><td class="steps">' +
							'<div class="recipe-section-title">Steps<hr></div>' +
							this.curr_recipe.steps.map(function( step, i ){
								var content = step;
								if( typeof( step ) == 'object' ){
									content = '<span class="action">' + step.action + '</span>' + ( !step.desc ? '' : ', ' + step.desc + '.' );
								}
								return '<div class="step" onclick="$( this ).toggleClass(\'completed\');">' + 
									'<span class="number">' + ( i + 1 ) + '</span>' + content +
								'</div>';
							}).join('<hr>') + 
						'</td></tr>' +
						'<tr><td class="completed">' +
							'<a href="' + ARCH.hashlinks.get_url({ include : {
											dish             : this.curr_recipe.dish,
											cuisines_exclude : this.curr_recipe.cuisines,
											sort_by          : 'ingredients_different',
											suggested        : true,
										} }) + '">' +
								'<div class="button suggestions-button">' + 
									'Suggestions for Next Dish' +
								'</div>' +
							'</a>' +
						'</td></tr>' +
					'</table>' +
				'</div>' +
		'</div>'
	);
};