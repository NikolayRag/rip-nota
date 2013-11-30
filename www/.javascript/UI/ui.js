/*
UI has
  explicit:
	- User login area
	- Logged User tools
	- Contacts list
	- Board area
	- Target User tools (relations, boardlist)
	- Board tools (make, del, rights)
	- Overview
  implicits:
	- Contacts users
	- Notes
	- Note's assigned users

  which are updated by callbacks from:
	- Board update
	- Notes update
	- UI xform
	- Self info
	- Cookie managing
	- Users/contacts change
*/

var UI= new function(){

//UI.updated;
//todo: should be called only when Board is changed or it changes implicit state
this.drawWindow= function(){
	this.DOMToolbar.style.display= (this.embed? 'none' : '');
}


//display update state
this.drawState= function(_state, _msgVerb){
	var stateMsg= '';
	var newColor='';
	switch (_state) {
		case UPDATE_STATE.UPDATE:
			newColor= CSS.UPDATEMARKER_UPDATE;
			stateMsg= DIC.popStateUpdating;
			break;
		case UPDATE_STATE.ERROR:
			newColor= CSS.UPDATEMARKER_ERROR;
			stateMsg= DIC.popStateError;
			break;
		case UPDATE_STATE.STOP:
			newColor= CSS.UPDATEMARKER_STOP;
			stateMsg= DIC.popStateStop;
			break;
		case UPDATE_STATE.NORMAL:
			stateMsg= DIC.popStateOkay;
	}
	this.popW.tipSet(
		stateMsg +(
			(!NOPROFILE && _msgVerb && _msgVerb!='')?
			String(_msgVerb).decorateHTML(STR.DIV |STR.ITALIC |STR.QUOTE,75,[96,96,192])
			:''
		)
	);

	var _this= this;
	setTimeout(
		function(){
			_this.logoW.draw(new Color(newColor))
		}, _state==UPDATE_STATE.NORMAL? TIMER_LENGTH.LOGO2NORMAL_DELAY:0 //normal state is delayed for avoid too fast responce
	);
}





//Globally change style
this.style= function(){
	var style= SESSION.board.PUB.style;

	this.DOMToolbar.style.backgroundColor= style.mainDark.hex('');
	
//todo: style out everything else
}



this.freeze= function(_mode){
	this.DOMBody.style.cursor= _mode?STYLE.CURSOR_MOVE:'';

//	STYLES.freezein.display= _mode?'':'none'; //cover with lids globally
//	STYLES.freezeout.display= _mode?'none':''; //hide globally

	if (_mode){
		if (WINDOW.getSelection)
		  WINDOW.getSelection().removeAllRanges();
		else if (DOCUMENT.selection)
		  DOCUMENT.selection.clear();
  	}

	DOCUMENT.onselectstart= function(){return _mode};
}


//get and store fps tick counter every second
this.fpsTick= function(){
	if (this._fpsTick>this.fps)
	  this.fps= this._fpsTick;
	this._fpsTick=0;
	var _this= this;
	clearTimeout(this._fpsTickTimeout);
	this._fpsTickTimeout= setTimeout(function(){_this.fpsTick()},1000);
}

//switch to global context using mouse -move and -out functions. Should be called within mouseover
//todo: monitor noBubbles() behavior
this.mouseContext= function(_e,_that,_fnDown,_fnMove,_fnUp){
	_e= _e||WINDOW.event;
	if (_e.button>0)
	  return;
	this.fpsTick();

	this.mouseX= _e.clientX;
	this.mouseY= _e.clientY;
	this.freeze(1);

	var _this= this;
	if (_fnMove)
	  this.DOMBody.onmousemove=	function(_e2){
		_e2= _e2||WINDOW.event;
		_this._fpsTick+= 1;

		if (_this.mouseButton==-1){ //initial move
			if (
				(Math.pow(_this.mouseX-_e2.clientX, 2) +Math.pow(_this.mouseY-_e2.clientY, 2))
				>(USER_REACTION.POINTER_DEAD_SPOT*USER_REACTION.POINTER_DEAD_SPOT) //^2 px radius
			)
			  _this.mouseButton= _e2.button;
		}

		_fnMove.call(_that,_e2)
	  };
	  this.DOMBody.onmouseup= function(_e2){
		_this.mouseContextRelease(_e2);
		if (_fnUp)
		  _fnUp.call(_that,_e2||WINDOW.event);
	  };

	if (_fnDown)
	  _fnDown.call(_that,_e);

	noBubbles(_e);
	_e.preventDefault();
}

////private
this.mouseContextRelease= function(_e){
	this.DOMBody.onmousedown=
	 this.DOMBody.onmouseup=
	 null;
	this.DOMBody.onmousemove= this.mouseContextNop;

	this.mouseButton= -1;
	this.freeze(0);
}

this.mouseContextNop= function(_e){
	_e= _e||WINDOW.event;
	UI.mouseX= _e.clientX;
	UI.mouseY= _e.clientY;
}


this.bindEvt= function(){
	this.DOMBody.onmousemove= this.mouseContextNop;
}

this.bindDeep= function(_scrollFn, _resizeFn){
	if (_scrollFn)
	  WINDOW.onscroll= _scrollFn;
	if (_resizeFn)
	  WINDOW.onresize= _resizeFn;
}

this.embed=	0;
this.perfLevel= PERF.LEVEL;

//operating
this.mouseButton= -1;
this.mouseX= null;
this.mouseY= null;

//state
this._fpsTickTimeout= null;
this._fpsTick= 0; //self profiling
this.fps= 0;


////bind
this.DOMBody= DOCUMENT.bodyEl;
this.DOMToolbar= DOM('workToolbar');
//
this.DOMWorkField= DOM('workField');


this.bindEvt();

}


