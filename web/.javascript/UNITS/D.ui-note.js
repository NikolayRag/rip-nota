/*
	ui class for toplevel Note stickers
*/

var DataUINote=
 NdataUI.newTemplate[DATA_TYPE.NOTE]=
 function(_UI){
	this.UI= _UI;
	this.DOM= this.build(_UI.DOM.context);
//todo 41 (xixi) +0: xoxo
	this.stampTimeout= null;

	this.actualMouseOver= 0;
	this.captionTimeout= null;
	this.hoverToolTimeout= null;

	this.tool= null;
	
//	this.bindEvt();




/*
//todo: check if version is important here
	if (rights>=2 && _dver.split(",")[0]!=0) { //for write permissions and not marked for deletion
		var iFdoc= _this._noteFrame.contentDocument;
		iFdoc.ondblclick= _this.dblClick;
		addEvent(iFdoc, 'keypress', _this.keyPress);
	}
	if (rights>=1 && _dver.split(",")[0]!=0) { //for comment permissions and not marked for deletion
		_this._noteComment.onkeypress= _this.commentKeyPress;
	}
	_this._noteRef.innerHTML= _ref; //ref is set only once as it can't change

	_this.updateNote(_ver, _x, _y, _w, _h, _style);
	_this.updateData(_dver,_src,_editor,_stamp);
*/
}

DataUINote.prototype.draw= function () {
//todo: move to dui
//	this.sign();
}

//support method for Data's derived Note draw() (same as UI.style() for NUI_board.draw())
//todo: lolwut? - ^^
DataUINote.prototype.style= function(){}


//only custom
DataUINote.prototype.setState= function(_msg){}




////PRIVATE

DataUINote.tmpl= DOM('leafNoteTmpl');
DataUINote.prototype.build= function(_parentEl,_curDI){
//todo: _resizeSpot to be removed at all
//todo: append _noteSign _noteRef to noteInfo (wat)
//todo: redesign comments
	var cClone= DataUINote.tmpl.cloneNode(true);
	var cRoot= {
		root:		cClone,
		shadow: 	DOM('leafNoteShadow',cRoot),
		context:	DOM('leafNoteContext',cRoot)

/*
		mark:		DOM('leafNoteMark',cRoot),
		stamp:		DOM('leafNoteStamp',cRoot),
		ref:		DOM('leafNoteRef',cRoot),
		sign:		DOM('leafNoteSign',cRoot),
*/
/*
		plate:		DOM('leafNotePlate',cRoot),
		tool:		DOM('leafNoteToolHolder',cRoot),
		cover:		DOM('leafNoteFrameCover',cRoot)
*/	}
	
	NOID(cClone);

	_parentEl.appendChild(cClone);

	return cRoot;
}

DataUINote.prototype.shadow= function () {
	var sFract= 1;

	var sibPUB= this.UI.rootNdata.sibling().PUB;
	for (var iD in sibPUB.UI.rootNdata) break;
	if (iD && sibPUB.rights>NOTA_RIGHTS.INIT && sibPUB.style.main.a){
//todo: get first element in better manner
		var sibData= sibPUB.UI.rootNdata[iD];

		var sFract= (new Date()-sibData.stamp)/(TIMER_LENGTH.MONTH*1000);
		sFract= sFract>1? 1 : sFract;
		sFract= Math.pow(sFract,STYLE.NOTESHADOW_DECAY_EXP);

		this.DOM.shadow.style.top= (sFract*STYLE.NOTESHADOW_TOP_RATE +STYLE.NOTESHADOW_INIT_OFFSET) +'px';
		this.DOM.shadow.style.bottom= -(sFract*STYLE.NOTESHADOW_BOTTOM_RATE +STYLE.NOTESHADOW_INIT_OFFSET)+'px';
		this.DOM.shadow.style.left= (sFract*STYLE.NOTESHADOW_LEFT_RATE +STYLE.NOTESHADOW_INIT_OFFSET) +'px';
		this.DOM.shadow.style.right= -(sFract*STYLE.NOTESHADOW_RIGHT_RATE +STYLE.NOTESHADOW_INIT_OFFSET) +'px';
		this.DOM.shadow.style.opacity= STYLE.NOTESHADOW_OPACITY_MAX*(1-sFract);
	}

	this.DOM.shadow.style.display= sFract==1? 'none' :'';
}

DataUINote.prototype.sign= function () {
	var sibParent= this.UI.rootNdata.sibling().inherit();
	var sibPUB= this.UI.rootNdata.sibling().PUB;
//todo: get first element in better manner
	for (var io in sibPUB.UI.rootNdata) break;
	var sibData= sibPUB.UI.rootNdata[io];

	if (sibPUB.style.main.a){
//todo: manage ref for restricted note
		if (sibPUB.rights==NOTA_RIGHTS.INIT) {
			this.DOM.ref.elementText(SESSION.owner().name);
			this.DOM.ref.style.display= '';
			return;
		}

		var okRef=
		  sibParent && (sibParent!= this.UI.rootNdata.rootNote);
//???4 times
		this.DOM.ref.elementText(
			okRef? sibParent.PUB.name :''
		);
		this.DOM.ref.style.display=
		  okRef? '':'none';

		var okSign=
		  sibData && sibParent && sibData.editorId!=sibParent.PUB.ownerId;
		this.DOM.sign.elementText(
			okSign? (
				(!sibData.editor() || sibData.editor().uname=='')?
				  DIC.stampSomebody
				  : sibData.editor().uname
			) :''
		);
		this.DOM.sign.style.display=
		  okSign? '':'none';

		this.DOM.mark.style.display=
		  (
		  	this.UI.rootNdata.forSave!=SAVE_STATES.IDLE
		  	|| sibPUB.forSave!=SAVE_STATES.IDLE
		  )? '': 'none';
	}

	this.signStamp();
}

DataUINote.prototype.signStamp= function(){
	clearTimeout(this.stampTimeout);

	var sibParent= this.UI.rootNdata.sibling().inherit();
	var sibPUB= this.UI.rootNdata.sibling().PUB;
//todo: get first element in better manner
	for (var iD in sibPUB.UI.rootNdata) break;

	if (!iD || !sibPUB.style.main.a)
	  return;

	var sibData= sibPUB.UI.rootNdata[iD];
	var okSign= sibParent && sibData.editorId!=sibParent.PUB.ownerId;

	var stamp= stampDiff(sibData? sibData.stamp :sibPUB.stamp,TIMER_LENGTH.MONTH*2);
	this.DOM.stamp.elementText(
		((okSign && okSign!='')? ', ': '') +stamp.stamp
	);
	this.DOM.stamp.style.display=
	  stamp.stamp!=''? '':'none';

	this.shadow();

	if (stamp.delay==0)
	  return;

	var _this= this;
	this.stampTimeout= setTimeout(function(){
		_this.signStamp();
	}, stamp.delay*1000);
}





DataUINote.prototype.bindEvt= function(){
	var _this= this;
	var rts= this.UI.rootNdata.rootNote.PUB.rights;

//todo: different behaviors for different user rights

//todo: dont allow to react with implicit referers
 	if (rts>= NOTA_RIGHTS.RO){
		this.DOM.plate.onmouseover= function(){_this.mouseOver()};
		this.DOM.plate.onmouseout= function(){_this.mouseOut()};
//todo: replace with mouseContext
		this.DOM.plate.onmouseup= function(e){e.toolFlag=1; _this.toolShow(1)};
	}

}






////interaction

DataUINote.prototype.mouseOver= function(){
	//switch previous hilite off instantly
	var prevHilite= this.UI.rootUI.lastHilite;
	if (prevHilite && prevHilite!=this){
		clearTimeout(prevHilite.captionTimeout);
		prevHilite.hiliteSet();
	}

	clearTimeout(this.captionTimeout);

	this.actualMouseOver= 1;
	this.hiliteSet();

	this.UI.rootUI.lastHilite= this;
}
DataUINote.prototype.mouseOut= function(){
	clearTimeout(this.captionTimeout);

	var _this= this;
	this.actualMouseOver= 0;
	this.captionTimeout=
	  setTimeout(function(){_this.hiliteSet()},TIMER_LENGTH.LEAF_FADEOUT);
}


//todo: constantly review rights effects
DataUINote.prototype.hiliteSet= function(){
	var mouseState= this.actualMouseOver;
	var _this= this;

	setTimeout(function(){ //small trail
		_this.DOM.root.style.borderColor=
		  _this.actualMouseOver? _this.UI.rootNdata.rootNote.PUB.style.borderActive.hex():'';
		_this.DOM.sign.style.color=
		  _this.DOM.stamp.style.color=
		  _this.DOM.ref.style.color=
		  _this.actualMouseOver? _this.UI.rootNdata.rootNote.PUB.style.signActive.hex():'';
	}, mouseState? 0:TIMER_LENGTH.LEAF_FADETRAIL);

	if (IS.hover){
		clearTimeout(this.hoverToolTimeout);
		if (mouseState){
			this.hoverToolTimeout= setTimeout(function(){ //
				_this.toolShow(1);
			}, TIMER_LENGTH.TOOLFADEIN_DELAY);
		} else {
			this.hoverToolTimeout= null;
			_this.toolShow();
		}
	}
}


DataUINote.prototype.toolShow= function(_show){
	if (_show && UI.mouseButton!=-1)
	  return;
	if (UI.toolSet.tool && UI.toolSet.tool.sticky)
	  return;

	if (_show){
		if (!UI.toolSet.tool || this.tool!=UI.toolSet.tool)
		  this.tool= UI.toolSet.make(ToolBoardLeaf,this.DOM.tool,this.UI.rootNdata);
	} else {
		UI.toolSet.kill(this.tool);
		this.tool= null;
	}

//+++constant
	this.DOM.root.style.zIndex= _show?2:'';
}

DataUINote.prototype.toolShowEdit= function(){
	var rRoot= this.UI.rootNdata.rootNote.PUB.rights;
	var rNote= this.UI.rootNdata.sibling().PUB.rights;
	if (rRoot || rNote)
	  this.tool= UI.toolSet.make(ToolBoardLeafEdit,this.DOM.tool,this.UI.rootNdata);
}

DataUINote.prototype.unbind= function(){
	clearTimeout(this.stampTimeout);

	this.DOM.plate.onmouseover=
	 this.DOM.plate.onmouseout=
	 this.DOM.plate.onmouseup= undefined;

	this.DOM.root.style.opacity= .33;
}

DataUINote.prototype.kill= function(){
}
