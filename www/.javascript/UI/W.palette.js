/*
	color picker
*/
UI.paletteW= new function(){

this.style= '';

//cbFunction(newCol) should be called back when color IS picked
this.pick= function(_cbFunction){
	if (!_cbFunction)
	  return;

	this.style= new Style(
		new Color([
			Math.random()*255,
			Math.random()*255,
			Math.random()*255
		]).hex()
	);
	_cbFunction(this.style);
}

}
