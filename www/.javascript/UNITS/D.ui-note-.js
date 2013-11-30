/*
	ui class for unknown Note data
*/
var DataUINoteUnknown= function(_ndata,_context){
	var _this= this;

	_this.ndata= _ndata;

	_this.DOM= _this.build(_context);
}

DataUINoteUnknown.prototype.draw = function() {
	this.DOM.root.elementText(this.ndata.content);
}

DataUINoteUnknown.prototype.style= function(){}


////PRIVATE
DataUINoteUnknown.prototype.build= function(_parentEl){
	var elRoot= DOCUMENT.createElement("div");
	
	_parentEl.appendChild(elRoot);

	return {
		root: elRoot
	};
}

DataUINoteUnknown.prototype.setState= function(_state){}
