ARCH.content = { views : {} };

ARCH.content.get_grouped_values = function( key ){
	var groups = [];
	ARCH.data.recipes.forEach(function( entry ){
		if( entry[ key ] !== undefined ){
			( entry[ key ].constructor === Array ? entry[ key ] : [ entry[key] ] ).forEach(function( group_name ){
				var group = groups.find(function( g ){ return g.name == group_name; });
				if( !group ) groups.push( group = { name : group_name, count : 0 } );
				group.count++;
			});
		}
	});
	return groups;
};

ARCH.content.list_uncategorized_ingredients = function(){
	var count = 0;
	ARCH.data.recipes.forEach(function( recipe ){
		recipe.ingredients.forEach(function( ingredient ){
			try{
				if( ARCH.content.views.recipe.get_ingredient_category( ingredient ) == '???' ){
					console.log( recipe.name, ' : ', ingredient );
					count++;
				}
			} catch(e){}
		});
	});
	console.log( 'Total uncategorized ingredients : ', count );
};

ARCH.content.list_unformatted_steps = function(){
	var count = 0;
	ARCH.data.recipes.forEach(function( recipe ){
		recipe.steps.forEach(function( step ){
			try{
				if( typeof step == 'string' ){
					console.log( recipe.name, ' : ', step );
					count++;
				}
			} catch(e){}
		});
	});
	console.log( 'Total remaining unformatted steps : ', count );
};

ARCH.content.load_step_durations = function( callback ){
	$.ajax({
		url: './assets/data/step_durations.json',
		dataType: 'json',
		success : function(data){
			ARCH.step_durations = data;
			if( callback ) callback();
		},
		error   : function(){
			console.log( 'Error loading step durations' );
			console.log( e );
		}
	});
};

ARCH.content.load_ingredient_categories = function( callback ){
	$.ajax({
		url: './assets/data/ingredient_categories.json',
		dataType: 'json',
		success : function(data){
			ARCH.ingredient_categories = data;
			if( callback ) callback();
		},
		error   : function(){
			console.log( 'Error loading ingredient categories' );
			console.log( e );
		}
	});
};

ARCH.content.load = function(){
	var self = this;

	this.sub_categories = { dish : [], cuisine : [], cookware : [] };

	this.load_ingredient_categories(function(){
		self.load_step_durations(function(){
			$.ajax({
				url: './assets/data/data.json',
				dataType: 'json',
				success: function(data){
					data.recipes.sort( function(a, b){ return a.name.toLowerCase() > b.name.toLowerCase(); });
					ARCH.data = data;
					
					self.sub_categories.dish     = self.get_grouped_values( 'dish' );
					self.sub_categories.cuisine  = self.get_grouped_values( 'cuisines' );
					self.sub_categories.cookware = self.get_grouped_values( 'cookware' );
					
					self.draw_header();
					
					ARCH.data.recipes.forEach(function( recipe ){
						recipe.time = { prep : { val : 0 }, cook : { val : 0 } };
						recipe.ingredients.forEach(function( ingredient ){
							if( !ingredient.prep ){
								try{
									var step_duration = ARCH.content.get_step_duration( ingredient );
									if( step_duration ) ingredient.prep = step_duration.prep;
								} catch(e){}
							}
							if( ingredient.prep ) recipe.time.prep = ARCH.functions.add_time_objects([ recipe.time.prep, ingredient.prep ]);
						});
						recipe.steps.forEach(function( step ){
							if( typeof step == 'object' ){
								if( !( step.prep || step.cook ) ){
									try{
										var step_duration = ARCH.content.get_step_duration( step );
										if( step_duration ){
											if( step_duration.prep ) step.prep = step_duration.prep;
											if( step_duration.cook ) step.cook = step_duration.cook;
										}
									} catch(e){}
								}
								if( step.prep ) recipe.time.prep = ARCH.functions.add_time_objects([ recipe.time.prep, step.prep ]);
								if( step.cook ) recipe.time.cook = ARCH.functions.add_time_objects([ recipe.time.cook, step.cook ]);
							}
						});
						recipe.time.total = ARCH.functions.add_time_objects([ recipe.time.prep, recipe.time.cook ]);
					});
					
					var value_index = ARCH.data.recipes.map(function(a){ return a.name; }).indexOf( ARCH.hashlinks.params.recipe.value );
									
					if( value_index == -1 ) self.views.main.draw();
					else{
						self.views.recipe.set( value_index );
						if( ARCH.hashlinks.params.suggested.value ) self.views.main.draw();
						else                                        self.views.recipe.draw();
					}
				}
			});
		});
	});
};

ARCH.content.draw_header = function(){
	ARCH.navbar.draw();
};

ARCH.content.get_recipe_image = function(name){
	return './assets/img/recipes/' + ARCH.functions.str_to_filename( name ) + '.jpg';
};

ARCH.content.get_cuisine_image = function(name){
	return './assets/img/cuisines/' + ARCH.functions.str_to_filename( name ) + '.jpg';
};

ARCH.content.get_time_html = function( recipe, type ){
	var time = ARCH.functions.get_recipe_time({ recipe, key : type, abbreviated : true });
	if( !time ) return '';
	return '<div class="info-label time-label ' + type + '-time">' + ARCH.functions.to_title_case( type ) + ' : ' + time + '</div>';
};

ARCH.content.get_servings_html = function( recipe ){
	if( !recipe.servings ) return '';
	return '<div class="info-label servings">Servings : ' + recipe.servings + '</div>';
};

ARCH.content.get_recipe_cuisines_html = function( recipe ){
	if( !recipe.cuisines ) return '';
	
	return recipe.cuisines.map(function( cuisine, i ){
		var style = 'background-image:url(' + ARCH.content.get_cuisine_image( cuisine ) + ');';
		if( i ) style += 'left:' + ( 30 * i + 5 ) + 'px;';
		return '<div class="info-label cuisine-icon" style="' + style + '"></div>';
	}).join('');
};

ARCH.content.get_step_duration = function( item ){
	return ARCH.step_durations.find(function( step ){
		// console.log( step );
		return Object.keys( step ).filter( x => ![ 'cook', 'prep' ].includes(x) ).every(function( x ){
			// console.log( x, step[ x ], item[ x ] );
			return ( step[ x ] == item[ x ] );
		});
	}) || false;
};

ARCH.content.random_recipe = function(){
	ARCH.hashlink.update( ARCH.data.recipes[ Math.floor(Math.random()*ARCH.data.recipes.length) ].name );
};