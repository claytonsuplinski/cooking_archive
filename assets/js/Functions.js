ARCH.functions = {};

ARCH.functions.get_recipe_time = function( p ){
	try{
		var time_obj = p.recipe.time[ p.key ];
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

ARCH.functions.str_to_filename = function( str ){
	return str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\']/g, "").replace(/ /g, '');
};

ARCH.functions.to_title_case = function(str){
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};