//todo: delegate D.UI class (and NRoot -> N.UI)

/*
	ui class for framed Note data
*/
var DataUIText=
 NdataUI.newTemplate[DATA_TYPE.TEXT]=
 function(_UI){
	this.UI= _UI;
	this.DOM= this.build(_UI.DOM.context);

	this.bindEvt();
}

DataUIText.prototype.draw = function() {
	this.DOM.content.elementText(this.UI.rootNdata.content, true);

//todo: reduce multicall; called for every data within Note
//	this.setState();


//todo: introduce parents visual modifiers
	if (this.UI.level==1)
	  this.DOM.content.style.fontSize= '20pt';
}

DataUIText.prototype.style= function(){}

DataUIText.prototype.bindEvt= function(){
	var _this= this;
	var rts= this.UI.rootNdata.rootNote.PUB.rights;

//todo: different behaviors for different user rights

//todo: dont allow to react with implicit referers
 	if (rts>= NOTA_RIGHTS.RO){
//todo: replace with mouseContext
		this.DOM.plate.onmouseup= function(e){e.toolFlag=1; _this.toolShow(1)};
	}

}
////PRIVATE
DataUIText.tmpl= DOM('leafTextTmpl');
DataUIText.prototype.build= function(_parentCtx){
	var cClone= DataUIText.tmpl.cloneNode(true);
	var cRoot= {
		root:		cClone,
		plate:		DOM('leafTextPlate',cClone),
		content:	DOM('leafTextContext',cClone),
		tool:		DOM('leafTextToolHolder',cClone)
	};
	NOID(cClone);

	_parentCtx.appendChild(cClone);

	return cRoot;
}

DataUIText.prototype.content= function(_newValue){
	return this.DOM.root.elementText(_newValue);
}

DataUIText.prototype.editMode= function(_edit,_onkeypress){
	var editField= this.DOM.root;

	if (_edit){
		editField.contentEditable= 'true';
		editField.style.background= this.UI.rootNdata.rootNote.PUB.style.editfieldActive.hex();
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
		this.UI.dFrontUI.DOM.context.onmousedown= noBubbles;
		return this.content();
  	} else {
		editField.contentEditable= 'false';
		editField.style.background= '';
		editField.blur();

		editField.onkeypress=
		this.UI.dFrontUI.DOM.context.onmousedown=
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
		  this.tool= UI.toolSet.make(ToolBoardLeaf,this.DOM.tool,this.UI.rootNdata);
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
}
