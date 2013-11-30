/*
	toolSet mantains the only visible tool within several conexts and tool templates
*/
UI.toolSet= new function(){


this.tool= null; //current and only

this.make= function(_template,_rootW,_entity){
	this.kill();
	if (UI.mouseButton!=-1)
	  return;

	this.tool= new _template(_rootW,_entity);
	if (this.tool.DOM && UI.mouseX!==null && UI.mouseY!==null){
		this.tool.DOM.root.style.left= UI.mouseX +"px";
		this.tool.DOM.root.style.top= UI.mouseY +"px";
	}

	return this.tool;
}

this.kill= function(_focus){
	if (_focus && _focus!=this.tool)
	  return;

	if (this.tool)
	  this.tool.kill();
	this.tool= null;
}


}
