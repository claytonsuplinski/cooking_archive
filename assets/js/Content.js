ARCH.content = {};

ARCH.content.get_image = function(name){
	return './assets/img/'+name.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\']/g, "").replace(/ /g, '')+'.jpg';
};

ARCH.content.item_to_html = function(a){
	return '<div class="container">'+
		// '<a onclick="ARCH.hashlink.update(\''+a.name+'\');">'+
		'<a href="' + ARCH.hashlink.get_url( a.name ) + '">'+
			'<div class="item">'+
				'<table>'+
					'<tr>'+
						'<td class="title" style="font-size:'+(1.5 - Math.max(0, (a.name.length - 20) / 40))+'vw;">'+a.name.toUpperCase()+'</div>'+
					'</tr>'+
					'<tr><td class="img" style="background-image:url('+ARCH.content.get_image(a.name)+');"></td></tr>'+
				'</table>'+
			'</div>'+
		'</a>'+
	'</div>';
};

ARCH.content.random_recipe = function(){
	ARCH.hashlink.update( ARCH.data.recipes[ Math.floor(Math.random()*ARCH.data.recipes.length) ].name );
};

ARCH.content.draw_all = function(){
	$("#content").html( ARCH.data.recipes.map(function(a){ return ARCH.content.item_to_html(a); }).join('') );
};

ARCH.content.draw_item = function(idx){
	var a= ARCH.data.recipes[idx];
	
	$("#content").html(
		'<div class="container container-solo">'+
			'<a>'+
				'<div class="item">'+
					'<table>'+
						'<tr>'+
							'<td class="title">'+a.name.toUpperCase()+'</div>'+
						'</tr>'+
						'<tr><td class="img" style="background-image:url('+ARCH.content.get_image(a.name)+');"></td></tr>'+
						'<tr><td class="ingredients">'+
							'<div id="ingredients-title">INGREDIENTS<hr></div>'+
							a.ingredients.map(function(i){ return '<div class="col-xs-12 col-md-6 col-lg-4"><div class="ingredient">'+i+'<hr></div></div>'; }).join('') + 
						'</td></tr>'+
						'<tr><td class="steps">'+
							a.steps.map(function(s, i){ return '<hr><div class="step"><span class="number">'+(i+1)+'</span>'+s+'</div>'; }).join('')+'<hr>'+
						'</td></tr>'+
					'</table>'+
				'</div>'+
			'</a>'+
		'</div>'
	);
};