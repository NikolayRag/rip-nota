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
	this.DOM.upBar.style.display= 'none';
	this.DOM.upWindow.style.left= (
		UI.mouseX>STYLE.TIP_PREPOSITION?UI.mouseX-STYLE.TIP_PREPOSITION:0
	) +'px';
	this.DOM.upWindow.style.top= (
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
		if (_this.isTool) _this.DOM.upContent.elementText(_tipMsg,true)
	}, TIMER_LENGTH.TIP_DELAY);
}

//todo: alternative buttons
this.up= function(_src,_okCode,_notCode,_focusOn){
	this.isTool= 0;
	this.focus= DOCUMENT.activeElement;

	while (this.DOM.upContent.firstChild)
      this.DOM.upContent.removeChild(this.DOM.upContent.firstChild);
	if (IS.instance(_src,HTMLElement))
	  this.DOM.upContent.appendChild(_src);
	else
	  this.DOM.upContent.elementText(_src,true);

	this.okCode= IS.fn(_okCode)? _okCode :undefined;
	this.notCode= IS.fn(_notCode)? _notCode :undefined;
	this.DOM.ok.style.display= (!_okCode? 'none':'');

	this.DOM.upCover.style.display= '';
	this.DOM.upWindow.style.display= '';
	this.DOM.upWindow.style.left= this.DOM.upCover.offsetWidth/2 -this.DOM.upWindow.offsetWidth/2 +'px';
	this.DOM.upWindow.style.top= this.DOM.upCover.offsetHeight/2 -this.DOM.upWindow.offsetHeight/2 +'px';
    this.DOM.upBar.style.display= '';

	if (_focusOn){
		DOM(_focusOn,this.DOM.upContent).focus();
		return;
	}

	if (_okCode)
	  this.DOM.ok.focus();
	else
	  this.DOM.no.focus();
}

this.down= function(_skipNotCode){
	this.DOM.upCover.style.display='none';
	this.DOM.upWindow.style.display= 'none';

	if (this.notCode && !_skipNotCode)
	  this.notCode();
	this.notCode= undefined;
	this.focus.focus();
}


this.bindEvt= function(){
	var _this= this;
	this.DOM.upWindow.onsubmit= //try submit
	  function(){_this.okCode();_this.down(1);return false;};
	this.DOM.upWindow.onkeypress= //ESC filter to close
	  function(_e){if(eKeyCode(_e)==27) _this.down();};
	this.DOM.upWindow.onreset= //cancel
	  function(){_this.down()};
//reserve: switch on if still blinking
//	this.DOM.upCover.onmouseover=
//	  function(){_this.lockTool= 1};
//	this.DOM.upCover.onmouseout=
//	  function(){_this.lockTool= 0};
	this.DOM.upCover.onmouseover= //tip mouseout to close
	  function(){
	  	setTimeout(function(){
	  		if (_this.isTool && !_this.lockTool) _this.down();
	    }, TIMER_LENGTH.TIP_DELAY)
	  };
	this.DOM.upCover.onclick= //click outside popup to close
	  function(){_this.down()};
}

this.focus= null;
this.notCode= null;
this.okCode= null;
this.isTool= 0;
this.lockTool= 0;
this.tipMsg= '';
this.tipMsgTimeout= null;


this.DOM= {
	upCover: DOM('popUpCover'),
	upWindow: DOM('popUpWindow'),
	upContent: DOM('popUpContent'),
	upBar: DOM('popUpBar'),
	ok: DOM('popOk'),
	no: DOM('popNo')
};

this.bindEvt();

}
