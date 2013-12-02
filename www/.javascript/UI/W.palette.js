/*
	color picker

	.pick(cb) shows Palette;
	on confirm, supplied cb(newStyle,hideCB) is called with:
		newStyle:	new style object
*/
UI.paletteW= new function(){

this.style= new Style('#888');

this.pick= function(_cbFunction){
	if (!_cbFunction)
	  return;

	this.DOMPalette.style.display= '';

	var _this= this;
	this.DOMPaletteSample.onclick= function(){
		_this.style= new Style(
			new Color([
				Math.random()*255,
				Math.random()*255,
				Math.random()*255
			]).hex()
		);
		_this.DOMPaletteSample.style.background= _this.style.noteBG.hex();
	}

	this.DOMPaletteApply.onclick= function(){
		_cbFunction(_this.style);
	}
}

this.hide= function(){
	this.DOMPalette.style.display= 'none';
}

this.DOMPalette= DOM('colorPicker');
this.DOMPaletteSample= DOM('colorSample');
this.DOMPaletteApply= DOM('colorApply');

this.DOMPaletteSample.style.background= this.style.noteBG.hex();

}
