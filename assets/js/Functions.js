ARCH.functions = {};

ARCH.functions.get_recipe_time = function( p ){
	try{
		var time_obj = p.time_obj || p.recipe.time[ p.key ];
		Object.assign( p, time_obj );
		return this.get_formatted_time( p );
	} catch(e){}
	return false;
};

ARCH.functions.get_formatted_time = function( p ){
	var value = ( p.val || 0 );
	var units = p.units || 'minute';

	if( p.abbreviated ) units = this.get_abbreviated_units( units );
	else                units = units + ( value == 1 ? '' : 's' );
	
	return value + ' ' + units;
};

ARCH.functions.get_abbreviated_units = function( units ){
	switch( units ){
		case 'second':
		case 'seconds':
			return 's';
		case 'minute':
		case 'minutes':
			return 'm';
		case 'hour':
		case 'hours':
			return 'h';
		case 'day':
		case 'days':
			return 'd';
		case 'year':
		case 'years':
			return 'y';
	};
	return '?';
};

ARCH.functions.remove_punctuation = function( str ){
	return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\']/g, "");
};

ARCH.functions.str_to_filename = function( str ){
	return this.remove_punctuation( str ).toLowerCase().replace(/ /g, '');
};

ARCH.functions.str_to_id = function( str ){
	return this.str_to_filename( str );
};

ARCH.functions.to_title_case = function(str){
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

ARCH.functions.number_to_fraction = function( val ){
	if     ( val == 0.125 )               return '1/8';
	else if( val == 0.25  )               return '1/4';
	else if( val == 0.375 )               return '3/8';
	else if( 0.33 <= val && val <= 0.34 ) return '1/3';
	else if( val == 0.5   )               return '1/2';
	else if( val == 0.625 )               return '5/8';
	else if( 0.66 <= val && val <= 0.67 ) return '2/3';
	else if( val == 0.75  )               return '3/4';
	else if( val == 0.875 )               return '7/8';
	return val;
};

ARCH.functions.format_units = function( val, units ){
	if( val == 1 ) return units;

	switch( units ){
		case 'cup'       :
		case 'lb'        :
		case 'ounce'     :
		case 'pound'     :
		case 'teaspoon'  :
		case 'tablespoon':
			units += 's';
			break;
	};
	
	return units;
};

ARCH.functions.get_alternate_units = function( val, units ){
	switch( units ){
		case 'cup'       :
			return this.number_to_fraction(  8 * val ) + ' oz';
		case 'pint'       :
			return this.number_to_fraction( 16 * val ) + ' oz';
		case 'lb'        :
		case 'pound'     :
			return this.number_to_fraction( 16 * val ) + ' oz';
	};
	
	return false;
};

ARCH.functions.get_plural_ingredient = function( ing ){
	if( !ing.units && ing.val != 1 ){
		if( [ 'Potato', 'Tomato' ].find( x => ing.name.endsWith(x) ) ) return ing.name + 'es';
		return ing.name + 's';
	}
	
	return ing.name;
};

ARCH.functions.get_matching_ingredients = function( recipe_1, recipe_2 ){
	var matches = [];
	var recipe_2_ingredients = [];
	try{ recipe_2_ingredients = recipe_2.ingredients.map( ing => ing.name ); } catch(e){}
	recipe_1.ingredients.forEach(function( ing ){
		try{
			if( recipe_2_ingredients.includes( ing.name ) ) matches.push( ing.name );
		} catch(e){}
	});
	return matches;
};

ARCH.functions.copy_to_clipboard = function( text ){
	var tmp_ele = document.createElement( 'textarea' );
	tmp_ele.value = text;
	document.body.appendChild( tmp_ele );
	tmp_ele.select();
	document.execCommand( 'copy' );
	document.body.removeChild( tmp_ele );
};