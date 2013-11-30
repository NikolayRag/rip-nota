UI.popW= new function(){

this.tip= function(_tipMsg){
	this.up(this.tipMsg);
	this.DOMUpBar.style.display= 'none';
	this.DOMUpWindow.style.left= (UI.mouseX>STYLE.TIP_PREPOSITION?UI.mouseX-STYLE.TIP_PREPOSITION:0) +'px';
	this.DOMUpWindow.style.top= (UI.mouseY>STYLE.TIP_PREPOSITION?UI.mouseY-STYLE.TIP_PREPOSITION:0) +'px';

	this.isTool= 1;
	if (_tipMsg)
	  tipSet(_tipMsg);
}

this.tipSet= function(_tipMsg){
	this.tipMsg= _tipMsg;

//todo: change to lazy
	if (this.tipMsgTimeout)
	  clearTimeout(this.tipMsgTimeout);
	var _this= this;
	this.tipMsgTimeout= setTimeout( function(){
		if (_this.isTool) _this.DOMUpContent.elementText(_tipMsg,true)
	}, TIMER_LENGTH.TIP_DELAY);
}

//todo: alternative buttons
this.up= function(_src,_okCode,_notCode,_focusOn){
	this.isTool= 0;
	this.focus= DOCUMENT.activeElement;

	while (this.DOMUpContent.firstChild)
      this.DOMUpContent.removeChild(this.DOMUpContent.firstChild);
	if (_src instanceof HTMLElement)
	  this.DOMUpContent.appendChild(_src.cloneNode(true));
	else
	  this.DOMUpContent.elementText(_src,true);

	this.okCode= _okCode;
	this.notCode= _notCode;
	this.DOMOk.style.display= (!_okCode? 'none':'');

	this.DOMUpCover.style.display= '';
	this.DOMUpWindow.style.display= '';
	this.DOMUpWindow.style.left= this.DOMUpCover.offsetWidth/2 -this.DOMUpWindow.offsetWidth/2 +'px';
	this.DOMUpWindow.style.top= this.DOMUpCover.offsetHeight/2 -this.DOMUpWindow.offsetHeight/2 +'px';
    this.DOMUpBar.style.display= '';

	if (_focusOn){
		DOM(_focusOn,this.DOMUpContent).focus();
		return;
	}

	if (_okCode=='' || _okCode==undefined)
	  this.DOMNo.focus();
	else
	  this.DOMOk.focus();
}

this.down= function(_skipNotCode){
	this.DOMUpCover.style.display='none';
	this.DOMUpWindow.style.display= 'none';
	if (!_skipNotCode && this.notCode!=undefined)
	  this.notCode();
	this.notCode= undefined;
	this.focus.focus();
}


this.bindEvt= function(){
	var _this= this;
	this.DOMUpWindow.onsubmit= //try submit
	  function(){_this.okCode();_this.down(1);return false;};
	this.DOMUpWindow.onkeypress= //ESC filter to close
	  function(_e){if(eKeyCode(_e)==27) _this.down();};
	this.DOMUpWindow.onreset= //cancel
	  function(){_this.down()};
	this.DOMUpCover.onmouseover= //tip mouseout to close
	  function(){if (_this.isTool==1) setTimeout(
	  	function(){_this.down();},TIMER_LENGTH.TIP_DELAY
	  )};
	this.DOMUpCover.onclick= //click outside popup to close
	  function(){_this.down()};
}

this.focus= null;
this.notCode= null;
this.okCode= null;
this.isTool= 0;
this.tipMsg= '';
this.tipMsgTimeout= null;


////DOM

this.DOMUpCover= DOM('popUpCover');
this.DOMUpWindow= DOM('popUpWindow');
this.DOMUpContent= DOM('popUpContent');
this.DOMUpBar= DOM('popUpBar');
this.DOMOk= DOM('popOk');
this.DOMNo= DOM('popNo');


this.bindEvt();

}
