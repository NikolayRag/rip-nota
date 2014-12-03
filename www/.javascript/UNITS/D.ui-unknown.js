/*
	ui class for unknown Note data
*/
var DataUIUnknown=
 NdataUI.newTemplate[DATA_TYPE.UNKNOWN]=
 function(_UI){
	this.UI= _UI;
	this.DOM= this.build(_UI.DOM.context);
}

DataUIUnknown.prototype.draw = function() {
	this.DOM.root.elementText(this.UI.rootNdata.content);
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

DataUIUnknown.prototype.unbind= function(){
	
}

DataUIUnknown.prototype.kill= function(){
}
