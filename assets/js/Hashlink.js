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
	
	ARCH.content.load();
};

window.onhashchange = ARCH.hashlink.start;
window.onload       = ARCH.hashlink.start;
