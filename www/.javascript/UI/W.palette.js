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
	this.DOM.paletteSample.style.background= this.style.main.hex();

	var _this= this;

	var okCode= function(){
		  _cb(_this.style)
	};
	if (_isPop)
	  UI.popW.up(this.DOM.palette, IS.fn(_cb)? okCode :undefined);

	return this.DOM.palette;
}


this.bindEvt= function(){
	var _this= this;
	this.DOM.paletteSample.onclick= function(){
		_this.style= new Style(
			new Color([
				Math.random()*255,
				Math.random()*255,
				Math.random()*255
			]).hex()
		);
		_this.DOM.paletteSample.style.background= _this.style.main.hex();
	}

}


this.style= new Style('#888');


this.DOM= {
	palette: DOM('palette'),
	paletteSample: DOM('paletteSample')
};

this.bindEvt();
}
