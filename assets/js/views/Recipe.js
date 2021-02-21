ARCH.content.views.recipe = {};

ARCH.content.views.recipe.set = function( idx ){
	this.curr_recipe = ARCH.data.recipes[ idx ];
};

ARCH.content.views.recipe.draw = function(){
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
							this.curr_recipe.ingredients.map(function( ing ){
								var ingredient = ing;
								if( typeof( ing ) == 'object' ){
									ingredient = ARCH.functions.number_to_fraction( ing.val ) + ' ' +
										( ing.units ? ARCH.functions.format_units( ing.val, ing.units ) + ' of ' : '' ) +
										'<span class="ingredient-name ' + ( ing.spicy ? 'spicy' : '' ) + '">' + ing.name + '</span>' + 
										( ing.style ? ', ' + ing.style : '' );
								}
								return '<div class="ingredient">' +
									'<span class="ingredient-text no-highlight" onclick="$( this ).parent().toggleClass(\'completed\');">' +
										'<span class="bullet">&bull;</span>' + ingredient + 
									'</span>' +
									'<hr>' +
								'</div>';
							}).join('') + 
						'</td></tr>' +
						'<tr><td class="steps">' +
							'<div class="recipe-section-title">Steps<hr></div>' +
							this.curr_recipe.steps.map(function( step, i ){
								return '<div class="step"  onclick="$( this ).toggleClass(\'completed\');">' + 
									'<span class="number">' + ( i + 1 ) + '</span>' + step +
								'</div>';
							}).join('<hr>') + 
						'</td></tr>' +
					'</table>' +
				'</div>' +
		'</div>'
	);
};