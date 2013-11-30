/*
	ui class for toplevel Board Data atom
*/
var DataUIBoardEl= function(_ndata,_context,_curDI){
	var _this= this;

	_this.ndata= _ndata;

	_this.DOM= _this.build(_context,_curDI);
}

DataUIBoardEl.prototype.draw= function () {
	this.DOM.hilite.elementText(this.ndata.content);
	this.DOM.shadow.elementText(this.ndata.content);
	this.DOM.content.elementText(this.ndata.content);

	this.place();
}


DataUIBoardEl.prototype.style= function(){}


////PRIVATE
DataUIBoardEl.prototype.place= function(){
	var _place= this.ndata.place;

	this.DOM.root.style.left= _place.x +"px";
	this.DOM.root.style.top= _place.y +"px";
	this.DOM.root.style.width= _place.w +"px";
	this.DOM.root.style.height= _place.h +"px";
}



////PRIVATE

DataUIBoardEl.tmpl= DOM('elInlineTmpl');
DataUIBoardEl.prototype.build= function(_parentEl,_curDI){
	var cRoot= DataUIBoardEl.tmpl.cloneNode(true);
	var cHilite= DOM('elInlineHil',cRoot);
	var cShadow= DOM('elInlineSh',cRoot);
	var cText= DOM('elInlineTxt',cRoot);
	NOID(cRoot);

	setTimeout(function(){
		_parentEl.appendChild(cRoot);
		cRoot.focus();
		cRoot.style.opacity= 1;
	},_curDI*TIMER_LENGTH.LEAF_CREATION_PERIOD);

	return {
		root:cRoot,
		hilite:cHilite,
		shadow:cShadow,
		content:cText
	};
}

DataUIBoardEl.prototype.setState= function(_state){}
