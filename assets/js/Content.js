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

ARCH.content.load = function(){
	var self = this;

	this.sub_categories = { dish : [], cuisine : [], cookware : [] };

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
			
			var value_index = ARCH.data.recipes.map(function(a){ return a.name; }).indexOf( ARCH.hashlinks.params.recipe.value );
			
			if( value_index == -1 ) ARCH.content.views.main.draw();
			else{
				self.views.recipe.set( value_index );
				self.views.recipe.draw();
			}
		}
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

ARCH.content.get_prep_time_html = function( recipe ){
	var prep_time = ARCH.functions.get_recipe_time({ recipe, key : 'prep', abbreviated : true });
	if( !prep_time ) return '';
	return '<div class="info-label time-label prep">Prep : ' + prep_time + '</div>';
};

ARCH.content.get_cook_time_html = function( recipe ){
	var cook_time = ARCH.functions.get_recipe_time({ recipe, key : 'cook', abbreviated : true });
	if( !cook_time ) return '';
	return '<div class="info-label time-label cook">Cook : ' + cook_time + '</div>';
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

ARCH.content.random_recipe = function(){
	ARCH.hashlink.update( ARCH.data.recipes[ Math.floor(Math.random()*ARCH.data.recipes.length) ].name );
};