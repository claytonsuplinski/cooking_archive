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
			
			var value_index = ARCH.data.recipes.map(function(a){ return a.name; }).indexOf( ARCH.hashlink.value );
			
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

ARCH.content.random_recipe = function(){
	ARCH.hashlink.update( ARCH.data.recipes[ Math.floor(Math.random()*ARCH.data.recipes.length) ].name );
};