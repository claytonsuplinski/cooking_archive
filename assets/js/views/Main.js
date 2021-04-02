ARCH.content.views.main = {};

ARCH.content.views.main.search = function(){
	var self = this;
	if( this.is_searching ){
		clearTimeout( this.is_searching );
		this.is_searching = false;
	}
	this.is_searching = setTimeout( function(){ self.draw_recipe_list({ query : $( "#search-bar input" ).val() }); }, 500 );
};

ARCH.content.views.main.get_recipe_list = function( criteria ){
	var recipes = ARCH.data.recipes.slice();
	
	if( criteria.dish ) recipes = recipes.filter(function( r ){ return r.dish == criteria.dish; });
	
	if( criteria.cuisine ) recipes = recipes.filter(function( r ){
		if( !r.cuisines ) return false;
		return r.cuisines.includes( criteria.cuisine );
	});
	
	if( criteria.cuisines_exclude ) recipes = recipes.filter(function( r ){
		if( !r.cuisines ) return true;
		return !r.cuisines.find(function( c ){ return criteria.cuisines_exclude.includes( c ); });
	});
	
	if( criteria.cookware ) recipes = recipes.filter(function( r ){
		if( !r.cookware ) return false;
		return r.cookware.includes( criteria.cookware );
	});
	
	if( criteria.query ){
		var query = ARCH.functions.remove_punctuation( criteria.query.toLowerCase() );
		var query_parts = query.split(' ');
		recipes.forEach(function( recipe ){
			recipe._query_score = 0;
			
			[
				{ str : recipe.name                                    , weight : 10 },
				{ str : recipe.ingredients.map( x => x.name ).join(' '), weight :  5 },
				{ str : recipe.dish || ''                              , weight :  3 },
				{ str : ( recipe.cuisines || [] ).join(' ')            , weight :  3 },
				{ str : ( recipe.cookware || [] ).join(' ')            , weight :  3 },
			].forEach(function( matching_string ){
				var str       = ARCH.functions.remove_punctuation( matching_string.str.toLowerCase() );
				var str_parts = str.split(' ');
				
				// Exact match of query
				if( str.includes( query ) ) recipe._query_score += 5 * matching_string.weight;
				
				// Exact matches of parts of query
				recipe._query_score += matching_string.weight * query_parts.filter( x => str_parts.includes( x ) ).length;
			});
		});
		
		recipes = recipes.filter( r => r._query_score ).sort( (a,b) => ( b._query_score - a._query_score ) );
	}
	
	if( criteria.sort_by ){
		switch( criteria.sort_by ){
			case 'ingredients_different':
				recipes = recipes.sort(function( a, b ){
					return (
						ARCH.functions.get_matching_ingredients( a, ARCH.content.views.recipe.curr_recipe ).length -
						ARCH.functions.get_matching_ingredients( b, ARCH.content.views.recipe.curr_recipe ).length
					);
				});
				break;
		}
	}
	
	if( criteria.suggested ) recipes = recipes.filter( r => r.name !== ARCH.content.views.recipe.curr_recipe.name );

	return recipes;
};

ARCH.content.views.main.draw_recipe_list = function( p ){
	var p = p || {};
	
	var criteria = {};
	[ 
		'cuisine', 'cuisines_exclude', 'cookware', 'dish', 'sort_by', 'suggested'
	].forEach(function( x ){ criteria[ x ] = ARCH.hashlinks.params[ x ].value; });
	Object.assign( criteria, p );
	
	var recipe_list = this.get_recipe_list( criteria );

	$("#recipe-list").html(
		recipe_list.map(function( recipe ){
			return '<div class="container">'+
				'<a href="' + ARCH.hashlinks.get_url({ clear : true, include : { recipe : recipe.name } }) + '">'+
					'<div class="item selectable">'+
						ARCH.content.get_servings_html(        recipe ) +
						ARCH.content.get_time_html(            recipe, 'prep'  ) +
						ARCH.content.get_time_html(            recipe, 'cook'  ) +
						ARCH.content.get_time_html(            recipe, 'total' ) +
						ARCH.content.get_recipe_cuisines_html( recipe ) +
						'<table>'+
							'<tr>'+
								'<td class="title">' + recipe.name + '<hr></div>'+
							'</tr>'+
							'<tr><td class="img" style="background-image:url(' + ARCH.content.get_recipe_image( recipe.name ) + ');"></td></tr>'+
						'</table>'+
					'</div>'+
				'</a>'+
			'</div>';
		}, this).join('') +
		'<div id="num-drawn-recipes"><hr>' + recipe_list.length + ' recipe' + ( recipe_list.length == 1 ? '' : 's' ) + '</div>'
	);
};

ARCH.content.views.main.draw = function( p ){
	$("#content").html(
		'<div id="search-bar"><input oninput="ARCH.content.views.main.search();" placeholder="&#xF002;   Filter recipes..."></input></div><br>' +
		'<div id="recipe-list"></div>'
	);
	
	$("#search-bar input").focus();
	
	this.draw_recipe_list( p );
};