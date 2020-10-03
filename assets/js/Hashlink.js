ARCH.hashlink = { value : '' };

ARCH.hashlink.check_url = function(){
	this.value = decodeURI( location.hash.substring(1) );
};

ARCH.hashlink.get_url = function( value ){
	return String( window.location ).split('#')[ 0 ] + '#' + encodeURI( value );
};

ARCH.hashlink.write = function(){
	var output = encodeURI( this.value );

	if(output == ""){
		history.pushState("", document.title, window.location.pathname);
	}
	else{
		location.hash = output;
	}
};

ARCH.hashlink.update = function(value){
	this.check_url();
	this.value = value;
	this.write();
};

ARCH.hashlink.clear = function(){
	window.location.href = '';
};

ARCH.hashlink.start = function(){
	ARCH.hashlink.check_url();

	document.title = ARCH.config.document_title + (ARCH.hashlink.value ? ' - ' + ARCH.hashlink.value : '');

	$.ajax({
		url: './assets/data/data.json',
		dataType: 'json',
		success: function(data){
			data.recipes.sort( function(a, b){ return a.name.toLowerCase() > b.name.toLowerCase(); });
			ARCH.data = data;
			
			$(".header").html(
				'<div class="button" onclick="ARCH.content.random_recipe();" >RANDOM RECIPE</div>' +
				'<div class="button button-sm" onclick="ARCH.hashlink.clear();">'+ data.recipes.length +  ' recipe'+(data.recipes.length != 1 ? 's' : '')+'</div>'
			);
			
			var value_index = ARCH.data.recipes.map(function(a){ return a.name; }).indexOf( ARCH.hashlink.value );
			( value_index == -1 ?
				ARCH.content.draw_all() :
				ARCH.content.draw_item( value_index )
			)
		}
	});
};

window.onhashchange = ARCH.hashlink.start;
window.onload       = ARCH.hashlink.start;
