//todo: dynamically create instead of reuse
//		- decide how to (re)use cover
//		- check use of tipSet
//		- as created with constructor, rearrange arguments
//			ex:(_msg,{okCode:{},noCode:{},focusOn:'',isTip:bool})
//		- formalize Bar logic
//		- deal with previously focused elements

UI.popW= new function(){

this.tip= function(_tipMsg){
	this.up(this.tipMsg);
	this.DOMUpBar.style.display= 'none';
	this.DOMUpWindow.style.left= (
		UI.mouseX>STYLE.TIP_PREPOSITION?UI.mouseX-STYLE.TIP_PREPOSITION:0
	) +'px';
	this.DOMUpWindow.style.top= (
		UI.mouseY>STYLE.TIP_PREPOSITION?UI.mouseY-STYLE.TIP_PREPOSITION:0
	) +'px';

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
	  this.DOMUpContent.appendChild(_src);
	else
	  this.DOMUpContent.elementText(_src,true);

	this.okCode= IS.fn(_okCode)? _okCode :undefined;
	this.notCode= IS.fn(_notCode)? _notCode :undefined;
	this.DOMOk.style.display= (!_okCode? 'none':'');

	this.DOMUpWindow.style.display= '';
	this.DOMUpWindow.style.left= this.DOMUpCover.offsetWidth/2 -this.DOMUpWindow.offsetWidth/2 +'px';
	this.DOMUpWindow.style.top= this.DOMUpCover.offsetHeight/2 -this.DOMUpWindow.offsetHeight/2 +'px';
    this.DOMUpBar.style.display= '';
	this.DOMUpCover.style.display= '';

	if (_focusOn){
		DOM(_focusOn,this.DOMUpContent).focus();
		return;
	}

	if (_okCode)
	  this.DOMOk.focus();
	else
	  this.DOMNo.focus();
}

this.down= function(_skipNotCode){
	this.DOMUpCover.style.display='none';
	this.DOMUpWindow.style.display= 'none';

	if (this.notCode && !_skipNotCode)
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
//reserve: switch on if still blinking
//	this.DOMUpCover.onmouseover=
//	  function(){_this.lockTool= 1};
//	this.DOMUpCover.onmouseout=
//	  function(){_this.lockTool= 0};
	this.DOMUpCover.onmouseover= //tip mouseout to close
	  function(){
	  	setTimeout(function(){
	  		if (_this.isTool && !_this.lockTool) _this.down();
	    }, TIMER_LENGTH.TIP_DELAY)
	  };
	this.DOMUpCover.onclick= //click outside popup to close
	  function(){_this.down()};
}

this.focus= null;
this.notCode= null;
this.okCode= null;
this.isTool= 0;
this.lockTool= 0;
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