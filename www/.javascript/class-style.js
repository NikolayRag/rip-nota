/*
	style parser
	default css values should be the same as ''-style result
*/
//todo: make proper defaults: same as initial HTML. Do it by declaring default constants
//at current, invalid style results in invalid colors, resulting in .hex()=='' (blank)
var Style= function(_styleStr){
	var _this= this;

	_this.main=
	_this.mainDark=

	_this.noteBG=
	_this.noteBorder=

	_this.borderActive=
	_this.signActive=

	_this.editfieldActive=

	  null;

	_this.bg= {
		imgName:null
	}


	_this.build(new Color(_styleStr));
}
	
//cache
Style.colorMainBG= new Color(CSS.MAIN_BG);
Style.colorNoteBG= new Color(CSS.NOTE_BG);
Style.colorNoteBorder= new Color(CSS.NOTE_BORDER);

Style.prototype.build= function(_rootColor){
	this.main=
	  _rootColor.valid? new Color(_rootColor) : Style.colorMainBG;
	this.mainDark= this.main.mix(STYLE.MAIN_CC_TINT,STYLE.MAIN_CC_MIX);

	this.noteBG=
	  _rootColor.valid? this.main : Style.colorNoteBG;
	this.noteBorder=
	  _rootColor.valid? this.mainDark : Style.colorNoteBorder;

//todo: make proper colors
	this.borderActive= new Color(
		(this.main.gray()>127)? 'white':'black'
	);
	this.signActive= new Color(
		(this.main.gray()>127)? 'black':'white'
	);

	this.editfieldActive= new Color('#eed');

	this.bg.imgName= "/.images/bg6.jpg";
}

//todo: finish
Style.prototype.makeString= function(){
	return(
		this.main.rgb()
	);
}
