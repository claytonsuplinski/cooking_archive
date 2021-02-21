ARCH.hashlinks = new Hashlinks({
	cookware : {},
	cuisine  : {},
	dish     : {},
	recipe   : {},
});

ARCH.hashlinks.on_start = function(){
	document.title = ARCH.config.document_title + ( this.params.recipe.value ? ' - ' + this.params.recipe.value : '' );
	
	ARCH.content.load();
};

window.onhashchange = function(){ ARCH.hashlinks.start(); };
window.onload       = function(){ ARCH.hashlinks.start(); };