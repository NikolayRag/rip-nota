/*
	ui class for unknown Note data
*/
var DataUIBoardUnknown= function(_ndata,_context){
	var _this= this;

	_this.ndata= _ndata;

	_this.DOM= _this.build(_context);
}

DataUIBoardUnknown.prototype.draw = function() {
	this.DOM.root.elementText(this.ndata.content);
}

DataUIBoardUnknown.prototype.style= function(){}


////PRIVATE
DataUIBoardUnknown.prototype.build= function(_parentEl){
	var elRoot= DOCUMENT.createElement("div");
	
	_parentEl.appendChild(elRoot);

	return {
		root: elRoot
	};
}

DataUIBoardUnknown.prototype.setState= function(_state){}
