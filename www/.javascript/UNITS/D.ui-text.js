//todo: delegate D.UI class (and NRoot -> N.UI)

/*
	ui class for framed Note data
*/
var DataUIText= function(_ndata,_context){
	var _this= this;

	_this.ndata= _ndata;
	_this.context= _context;

//todo: make UI and reference be well-defined
	_this.rootUi= _ndata.rootNote.PUB.ui;

	_this.DOM= _this.build(_context);

	_this.bindEvt();
}

DataUIText.prototype.draw = function() {
	this.DOM.content.elementText(this.ndata.content, true);

//todo: reduce multicall; called for every data within Note
//	this.setState();


	var curCtx= this.rootUi.note.coreType;

//todo: introduce parents visual modifiers
	if (!curCtx)
	  this.DOM.content.style.fontSize= '20pt';

	this.rootUi.place(this.ndata, this.DOM.root);
}

DataUIText.prototype.style= function(){}

DataUIText.prototype.bindEvt= function(){
	var _this= this;
	var rts= this.ndata.rootNote.PUB.rights;

//todo: different behaviors for different user rights

//todo: dont allow to react with implicit referers
 	if (rts>= NOTA_RIGHTS.RO){
//todo: replace with mouseContext
		this.DOM.plate.onmouseup= function(e){e.toolFlag=1; _this.toolShow(1)};
	}

}
////PRIVATE
DataUIText.tmpl= DOM('leafTextTmpl');
DataUIText.prototype.build= function(_parentEl,_curDI){
	var cRoot= DataUIText.tmpl.cloneNode(true);
	var cPlate= DOM('leafTextPlate',cRoot);
	var cCtx= DOM('leafTextContext',cRoot);
	var cTool= DOM('leafTextToolHolder',cRoot);
	NOID(cRoot);

	setTimeout(function(){
		_parentEl.appendChild(cRoot);
		cRoot.focus();
		cRoot.style.opacity= 1;
	},_curDI*TIMER_LENGTH.LEAF_CREATION_PERIOD);

	return {
		root:cRoot,
		plate:cPlate,
		content:cCtx,
		tool:cTool
	};
}

DataUIText.prototype.content= function(_newValue){
	return this.DOM.root.elementText(_newValue);
}

DataUIText.prototype.editMode= function(_edit,_onkeypress){
	var editField= this.DOM.root;

	if (_edit){
		editField.contentEditable= 'true';
		editField.style.background= this.ndata.rootNote.PUB.style.editfieldActive.hex();
		editField.focus();
	
		//place cursor at end
		if (DOCUMENT.createRange) {
			var range= DOCUMENT.createRange();
			range.selectNodeContents(editField);
			range.collapse(false);
			var sel= WINDOW.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else {
			var range= DOCUMENT.bodyEl.createTextRange();
			range.moveToElementText(editField);
			range.collapseToEnd();
			range.select();
		}

		editField.onkeypress= _onkeypress;
		this.ndata.rootNote.PUB.ui.DOM.context.onmousedown= noBubbles;
		return this.content();
  	} else {
		editField.contentEditable= 'false';
		editField.style.background= '';
		editField.blur();

		editField.onkeypress=
		this.ndata.rootNote.PUB.ui.DOM.context.onmousedown=
		  null;
	}
}

DataUIText.prototype.toolShow= function(_show){
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

DataUIText.prototype.setState= function(_state){}

DataUIText.prototype.unbind= function(){
	
}

DataUIText.prototype.kill= function(){
	this.context.removeChild(this.DOM.root);
}
