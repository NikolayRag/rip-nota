var ToolBoardLeaf= function(_rootW,_ndata){
	var _this= this;

	_this.rootW= _rootW;
	_this.ndata= _ndata;

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();
}

ToolBoardLeaf.prototype.bindEvt= function(){
	var _this= this;

	this.DOM.context.onmousedown= noBubbles;
	this.DOM.context.onmouseup= function(){_this.opDefault()};
}

ToolBoardLeaf.tmpl= DOM('toolBLeafTmpl')
ToolBoardLeaf.prototype.build= function(_parentEl){
<<<<<<< HEAD
	var cRoot= ToolBoardLeaf.tmpl.cloneNode(true);
	var cContext= DOM('toolBLeafContext',cRoot);
	NOID(cRoot);
=======
	var cClone= ToolBoardLeaf.tmpl.cloneNode(true);
	var cRoot= {
		root: cClone,
		context: DOM('toolContext',cClone)
	};
	NOID(cClone);
>>>>>>> ui-colorPicker

	cRoot.context.elementText(cRoot.context.elementText() +this.ndata.id);

	_parentEl.appendChild(cClone);

	cRoot.context.focus();
	var ctx= cRoot.context.style;
//+++classname
	  ctx.top= '-30px';
	  ctx.left= '-30px';
	  ctx.width= '200px';
	  ctx.height= '24px';
	  ctx.padding= '14px';
	  ctx.borderColor= '#aad';

	return cRoot;
}

ToolBoardLeaf.prototype.kill= function(){
	var ctx= this.DOM.context.style;
//+++classname
	  ctx.top= '';
	  ctx.left= '';
	  ctx.width= '';
	  ctx.height= '';
	  ctx.padding= '';
	  ctx.borderColor= '';

	var _this= this;
	setTimeout(function(){
	  _this.rootW.removeChild(_this.DOM.root);
	},CSS.TOOL_TRANSITIONTIME*1000);
}


ToolBoardLeaf.prototype.opDefault= function(){
	var _this= this;
	setTimeout(function(){
		_this.ndata.ui.toolShowEdit();
	},0);
}
