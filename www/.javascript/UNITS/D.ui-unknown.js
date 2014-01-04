/*
	ui class for unknown Note data
*/
var DataUIUnknown= function(_ndata,_context){
	var _this= this;

	_this.ndata= _ndata;

	_this.DOM= _this.build(_context);
}

DataUIUnknown.prototype.draw = function() {
	this.DOM.root.elementText(this.ndata.content);

//todo: add directly-linked parent ui
	this.ndata.rootNote.PUB.ui.place(this.ndata, this.DOM.root);
}

DataUIUnknown.prototype.style= function(){}


////PRIVATE
DataUIUnknown.prototype.build= function(_parentEl){
	var elRoot= DOCUMENT.createElement("div");
	
	_parentEl.appendChild(elRoot);

	return {
		root: elRoot
	};
}

DataUIUnknown.prototype.setState= function(_state){}
