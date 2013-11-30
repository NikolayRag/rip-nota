/*
	ui class for framed Note data
*/
var DataUINoteEl= function(_ndata,_context){
	var _this= this;

	_this.ndata= _ndata;

	_this.DOM= _this.build(_context);
}

DataUINoteEl.prototype.draw = function() {
//todo: reduce multicall; called for every data within Note
	this.DOM.root.elementText(this.ndata.content,true);
	this.setState();
}

DataUINoteEl.prototype.style= function(){}


////PRIVATE
DataUINoteEl.prototype.build= function(_parentEl){
	var elRoot= DOCUMENT.createElement("div");
	
	_parentEl.appendChild(elRoot);

	return {
		root: elRoot
	};
}

DataUINoteEl.prototype.content= function(_newValue){
	return this.DOM.root.elementText(_newValue);
}

DataUINoteEl.prototype.editMode= function(_edit,_onkeypress){
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

DataUINoteEl.prototype.setState= function(_state){
	//redirect
	var rootData= SESSION.board.dataContext(this.ndata.rootNote.PUB.id);
	if (rootData)
	  rootData.ui.setState(_state);
}
