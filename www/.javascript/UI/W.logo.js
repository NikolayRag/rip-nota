UI.logoW= new function(){

this.draw= function(_newColor){
	this.DOM.logo.style.backgroundColor= _newColor.hex();
}

this.bindEvt= function(){
	var _this= this;
	this.DOM.logo.onmouseover= function(){
		_this.tipTimeout= setTimeout(
	  		function(){UI.popW.tip();}
	  		, TIMER_LENGTH.LOGO_DELAY
	  	);
	};

	this.DOM.logo.onmouseout= function(){
		clearTimeout(_this.tipTimeout);
	};
}


this.tipTimeout= null;

this.DOM= {
	logo: DOM('notaLogo')
};

this.bindEvt();

}
