/*
	color picker

	.show((bool)isPop,(fn)cb) shows Palette;
	If isPop, palette is shown with pop.up() and cb(style) is
	 passed as okCode.
	Else Palette is only inited and its instance is returned to
	 parent elsewhere.
*/
UI.paletteW= new function(){

this.show= function(_isPop,_cb){
	this.DOMPaletteSample.style.background= this.style.noteBG.hex();

	var _this= this;

	var okCode= function(){
		  _cb(_this.style)
	};
	if (_isPop)
	  UI.popW.up(this.DOMPalette, IS.fn(_cb)? okCode :undefined);

	return this.DOMPalette;
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

}


this.style= new Style('#888');


this.DOMPalette= DOM('palette');
this.DOMPaletteSample= DOM('paletteSample');

this.bindEvt();
}
