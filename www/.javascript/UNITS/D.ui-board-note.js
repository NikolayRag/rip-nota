/*
	ui class for toplevel Note stickers
*/
var DataUIBoardNote= function(_ndata,_context,_curDI){
	var _this= this;

	_this.ndata= _ndata;
	_this.rootUi= _ndata.rootNote.PUB.ui;

	_this.stampTimeout= null;

	_this.actualMouseOver= 0;
	_this.captionTimeout= null;
	_this.hoverToolTimeout= null;

	_this.tool= null;
	
	_this.DOM= _this.build(_context,_curDI);
//	_this.DOMResizeSpot= DOM('noteResizeSpot',_this.DOMRoot);
//	_this.DOMComment= DOM('noteComment',_this.DOMRoot);
//	_this.DOMButEditOk= DOM('noteButEditOk',_this.DOMRoot);
//	_this.DOMButEditNo= DOM('noteButEditNo',_this.DOMRoot);
//	_this.DOMButPin= DOM('noteButPin',_this.DOMRoot);
//	_this.DOMButTransp= DOM('noteButTransp',_this.DOMRoot);
//	_this.DOMButCol= DOM('noteButCol',_this.DOMRoot);
//	_this.DOMButDel= DOM('noteButDel',_this.DOMRoot);
//	_this.DOMCaption= DOM('noteCaption',_this.DOMRoot);

	_this.bindEvt();

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

DataUIBoardNote.prototype.draw= function () {
	this.place();
	this.sign();
}

//support method for Data's derived Note draw() (same as UI.style() for Board.draw())
//todo: lolwut? - ^^
DataUIBoardNote.prototype.style= function(){}


DataUIBoardNote.prototype.setState= function(_state){
	this.sign();

//todo: state must remain after data saved if sibling is unsaved
	this.DOM.mark.style.display= _state? '': 'none';
}




////PRIVATE

DataUIBoardNote.tmpl= DOM('noteTmpl');
DataUIBoardNote.prototype.build= function(_parentEl,_curDI){
//todo: _resizeSpot to be removed at all
//todo: append _noteSign _noteRef to noteInfo (wat)
//todo: redesign comments

	var cRoot= DataUIBoardNote.tmpl.cloneNode(true);
	var cShadow= DOM('noteShadow',cRoot);
	var cMark= DOM('noteMark',cRoot);
	var cStamp= DOM('noteStamp',cRoot);
	var cRef= DOM('noteRef',cRoot);
	var cSign= DOM('noteSign',cRoot);
	var cPlate= DOM('notePlate',cRoot);
	var cCtx= DOM('noteContext',cRoot);
	var cTool= DOM('noteToolHolder',cRoot);
	var cCover= DOM('noteFrameCover',cRoot);
	
//cRoot.style.transform= 'rotate('+(Math.random()*100-50)+'deg)';

	NOID(cRoot);

	setTimeout(function(){
		_parentEl.appendChild(cRoot);
		cRoot.focus();
		cRoot.style.opacity= 1;
	},_curDI*TIMER_LENGTH.LEAF_CREATION_PERIOD);

	return {
		root:cRoot,
		shadow:cShadow,
		mark:cMark,
		stamp:cStamp,
		ref:cRef,
		sign:cSign,
		plate:cPlate,
		context:cCtx,
		tool:cTool,
		cover:cCover
	};
}

DataUIBoardNote.prototype.place= function(){
	var _place= this.ndata.place;

	this.DOM.root.style.left= _place.x +"px";
	this.DOM.root.style.top= _place.y +"px";
	this.DOM.root.style.width= _place.w +"px";
	this.DOM.root.style.height= _place.h +"px";
}

DataUIBoardNote.prototype.shadow= function () {
	var sFract= 1;

	var sibPUB= this.ndata.sibling().PUB;
	for (var iD in sibPUB.ndata) break;
	if (iD && sibPUB.rights>NOTA_RIGHTS.INIT && sibPUB.style.main.a){
//todo: get first element in better manner
		var sibData= sibPUB.ndata[iD];

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

DataUIBoardNote.prototype.sign= function () {
	var sib= this.ndata.sibling();
	var sibPUB= this.ndata.sibling().PUB;
//todo: get first element in better manner
	for (var io in sibPUB.ndata) break;
	var sibData= sibPUB.ndata[io];

	if (sibPUB.style.main.a){
//todo: manage ref for restricted note
		if (sibPUB.rights==NOTA_RIGHTS.INIT) {
			this.DOM.ref.elementText(SESSION.owner().name);
			this.DOM.ref.style.display= '';
			return;
		}

		var okRef= sib.inherit() && (sib.inherit()!= this.ndata.rootNote);
//???4 times
		this.DOM.ref.elementText(
			okRef? sib.inherit().PUB.name :''
		);
		this.DOM.ref.style.display=
		  okRef? '':'none';

		var okSign= sibData && sib.inherit() && sibData.editorId!=sib.inherit().PUB.ownerId;
		this.DOM.sign.elementText(
			okSign? (
				(!sibData.editor() || sibData.editor().uname=='')?
				  DIC.stampSomebody : sibData.editor().uname
			) :''
		);
		this.DOM.sign.style.display=
		  okSign? '':'none';
	}

	this.signStamp();
}

DataUIBoardNote.prototype.signStamp= function(){
	clearTimeout(this.stampTimeout);

	var sib= this.ndata.sibling();
	var sibPUB= this.ndata.sibling().PUB;
//todo: get first element in better manner
	for (var iD in sibPUB.ndata) break;

	if (!iD || !sibPUB.style.main.a)
	  return;

	var sibData= sibPUB.ndata[iD];
	var okSign= sib.inherit() && sibData.editorId!=sib.inherit().PUB.ownerId;

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





DataUIBoardNote.prototype.bindEvt= function(){
	var _this= this;
	var rts= this.ndata.rootNote.PUB.rights;

	//cancels
//tool:	this.DOMComment.onmousedown= noBubbles;
//tool:	this.DOMComment.ondblclick= noBubbles;
//tool:	this.DOMCaption.ondblclick= noBubbles;
//tool:	this.DOMButBlockPublic.onmousedown= noBubbles;
//tool:	this.DOMButPin.onclick= function(){_this.notePin()};
//tool:	this.DOMButTransp.onclick= function(){_this.colorize(0)};
//tool:	this.DOMButCol.onclick= function(){_this.colorize(1)};
//tool:	this.DOMButDel.onclick= function(){_this.noteDelete();};
//tool:	this.DOMButBlockEdit.onmousedown= noBubbles;
//tool:	this.DOMButEditOk.onclick= this.editAccept;
//tool:	this.DOMButEditNo.onclick= this.editCancel;


//todo: different behaviors for different user rights

//todo: dont allow to react with implicit referers
 	if (rts>= NOTA_RIGHTS.RO){
		this.DOM.plate.onmouseover= function(){_this.mouseOver()};
		this.DOM.plate.onmouseout= function(){_this.mouseOut()};
//todo: replace with mouseContext
		this.DOM.plate.onmouseup= function(e){e.toolFlag=1; _this.toolShow(1)};
	}

/*
	if (rts>=NOTA_RIGHTS.RW) { //for write/owner permissions
		this._caption.onmousedown= function(e){mouseModeTo(e,thisNote,"capt")};
		this._resizeSpot.onmousedown= function(e){mouseModeTo(e,thisNote,"resiz")};
		this._glueL.onmouseover= function(e){thisNote.glue("l")};
		this._glueL.onmouseout= function(e){thisNote.glue()};
		this._glueL.onmousedown= noBubbles;
		this._glueR.onmouseover= function(e){thisNote.glue("r")};
		this._glueR.onmouseout= function(e){thisNote.glue()};
		this._glueR.onmousedown= noBubbles;
		this._glueU.onmouseover= function(e){thisNote.glue("u")};
		this._glueU.onmouseout= function(e){thisNote.glue()};
		this._glueU.onmousedown= noBubbles;
		this._glueD.onmouseover= function(e){thisNote.glue("d")};
		this._glueD.onmouseout= function(e){thisNote.glue()};
		this._glueD.onmousedown= noBubbles;
	}
*/

}





////interaction

DataUIBoardNote.prototype.mouseOver= function(){
	//switch previous hilite off instantly
	var prevHilite= this.rootUi.lastHilite;
	if (prevHilite && prevHilite!=this){
		clearTimeout(prevHilite.captionTimeout);
		prevHilite.hiliteSet();
	}

	clearTimeout(this.captionTimeout);

	this.actualMouseOver= 1;
	this.hiliteSet();

	this.rootUi.lastHilite= this;
}
DataUIBoardNote.prototype.mouseOut= function(){
	clearTimeout(this.captionTimeout);

	var _this= this;
	this.actualMouseOver= 0;
	this.captionTimeout=
	  setTimeout(function(){_this.hiliteSet()},TIMER_LENGTH.LEAF_FADEOUT);
}


//todo: constantly review rights effects
DataUIBoardNote.prototype.hiliteSet= function(){
	var mouseState= this.actualMouseOver;
	var _this= this;

	setTimeout(function(){ //small trail
		_this.DOM.root.style.borderColor=
		  _this.actualMouseOver? _this.ndata.rootNote.PUB.style.borderActive.hex():'';
		_this.DOM.sign.style.color=
		  _this.DOM.stamp.style.color=
		  _this.DOM.ref.style.color=
		  _this.actualMouseOver? _this.ndata.rootNote.PUB.style.signActive.hex():'';
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


DataUIBoardNote.prototype.toolShow= function(_show){
	if (_show && UI.mouseButton!=-1)
	  return;
	if (UI.toolSet.tool && UI.toolSet.tool.sticky)
	  return;

	if (_show){
		if (!UI.toolSet.tool || this.tool!=UI.toolSet.tool)
		  this.tool= UI.toolSet.make(ToolBoardLeaf,this.DOM.tool,this.ndata);
	} else {
		UI.toolSet.kill(this.tool);
		this.tool= null;
	}

//+++constant
	this.DOM.root.style.zIndex= _show?2:'';
}

DataUIBoardNote.prototype.toolShowEdit= function(){
	var rRoot= this.ndata.rootNote.PUB.rights;
	var rNote= this.ndata.sibling().PUB.rights;
	if (rRoot || rNote)
	  this.tool= UI.toolSet.make(ToolBoardLeafEdit,this.DOM.tool,this.ndata);
}

