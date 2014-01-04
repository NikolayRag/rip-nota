/*
	ui class for framed Note data
*/
var DataUIText= function(_ndata,_context){
	var _this= this;

	_this.ndata= _ndata;
//todo: make UI and reference be well-defined
	_this.rootUi= _ndata.rootNote.PUB.ui;

	_this.DOM= _this.build(_context);
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


////PRIVATE
DataUIText.tmpl= DOM('leafTextTmpl');
DataUIText.prototype.build= function(_parentEl,_curDI){
	var cRoot= DataUIText.tmpl.cloneNode(true);
	var cText= DOM('leafTextTxt',cRoot);
	NOID(cRoot);

	setTimeout(function(){
		_parentEl.appendChild(cRoot);
		cRoot.focus();
		cRoot.style.opacity= 1;
	},_curDI*TIMER_LENGTH.LEAF_CREATION_PERIOD);

	return {
		root:cRoot,
		content:cText
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

DataUIText.prototype.setState= function(_state){}
