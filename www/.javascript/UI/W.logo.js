UI.logoW= new function(){

this.draw= function(_newColor){
	this.DOMBar.style.backgroundColor= _newColor.hex();
}

this.bindEvt= function(){
	var _this= this;
	this.DOMLogo.onmouseover= function(){
		_this.tipTimeout= setTimeout(
	  		function(){UI.popW.tip();}
	  		, TIMER_LENGTH.LOGO_DELAY
	  	);
	};

	this.DOMLogo.onmouseout= function(){
		clearTimeout(_this.tipTimeout);
	};
}


this.tipTimeout= null;

////DOM
this.DOMBar= DOM('barLogo');
this.DOMLogo= DOM('notaLogo');

this.bindEvt();

}
