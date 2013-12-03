/*
	color picker

	.show(cb) shows Palette;
	on confirm, supplied cb(newStyle,hideCB) is called with:
		newStyle:	new style object
*/
UI.paletteW= new function(){

this.style= new Style('#888');
this.cbFunction= null;

this.show= function(_cbFn){
	this.cbFunction= _cbFn;
	this.DOMPalette.style.display= '';
}

this.hide= function(){
	this.DOMPalette.style.display= 'none';
}


this.bindEvt= function(){
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
		if (_this.cbFunction)
		  _this.cbFunction(_this.style);
	}
}


this.DOMPalette= DOM('colorPicker');
this.DOMPaletteSample= DOM('colorSample');
this.DOMPaletteApply= DOM('colorApply');

//INIT
this.DOMPaletteSample.style.background= this.style.noteBG.hex();

this.bindEvt();
}
