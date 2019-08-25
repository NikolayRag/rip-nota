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

	this.DOM.tDel.onmouseup= function(){_this.opDel()};
	this.DOM.tMove.onmousedown= function(_e){UI.mouseContext(_e,_this,_this.mouseDown,_this.mouseMove,_this.opMouseUp)};
	this.DOM.tInner.onmouseup= function(){_this.opInnerTool()};
}

ToolBoardLeaf.tmpl= DOM('toolBLeafTmpl')
ToolBoardLeaf.prototype.build= function(_parentEl){
	var cClone= ToolBoardLeaf.tmpl.cloneNode(true);
	var cRoot= {
		root: cClone,
		context: DOM('toolBLeafContext',cClone),

		tOuter: DOM('toolBLeafOuter',cClone),
		tDel: DOM('toolBLeafDelete',cClone),
		tMove: DOM('toolBLeafEditMove',cClone),

		tInner: DOM('toolBLeafInner',cClone)
	};
	NOID(cClone);

//tmp
	cRoot.tInner.elementText('Leaf ' +this.ndata.id);

	_parentEl.appendChild(cClone);

	cRoot.context.focus(); //focus prior to set size to allow in-transition
	var ctx= cRoot.context.style;
//todo: classname
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
//todo: classname
	  ctx.top= '';
	  ctx.left= '';
	  ctx.width= '';
	  ctx.height= '';
	  ctx.padding= '';
	  ctx.borderColor= '';

	var _this= this;
	setTimeout(function(){
	  _this.rootW.removeChild(_this.DOM.root);
	}, CSS.TOOL_TRANSITIONTIME*1000);
}


ToolBoardLeaf.prototype.mouseDown= function(_e){
	this.mouseHit= {
		x: this.ndata.ui.DOM.root.offsetLeft -_e.clientX,
		y: this.ndata.ui.DOM.root.offsetTop -_e.clientY,
//todo: remove
		toolx: this.DOM.root.offsetLeft -_e.clientX,
		tooly: this.DOM.root.offsetTop -_e.clientY
	}

}
ToolBoardLeaf.prototype.mouseMove= function(_e){
	this.ndata.ui.DOM.root.style.left= this.mouseHit.x +_e.clientX +'px';
	this.ndata.ui.DOM.root.style.top= this.mouseHit.y +_e.clientY +'px';
//todo:remove
	this.DOM.root.style.left= this.mouseHit.toolx +_e.clientX +'px';
	this.DOM.root.style.top= this.mouseHit.tooly +_e.clientY +'px';
}
ToolBoardLeaf.prototype.opMouseUp= function(){
	this.ndata.save({place:{
		x:this.ndata.ui.DOM.root.offsetLeft,
		y:this.ndata.ui.DOM.root.offsetTop
	}});
	SESSION.board.uiA[0].nFrontUI.correct(1);
}

ToolBoardLeaf.prototype.opInnerTool= function(){
	var _this= this;
	setTimeout(function(){
		_this.ndata.ui.toolShowEdit();
	},0);
}


ToolBoardLeaf.prototype.opDefault= function(){
	var _this= this;
	setTimeout(function(){
		UI.toolSet.kill(_this)
	},0);
}

ToolBoardLeaf.prototype.opDel= function() {
	UI.popW.up(DIC.popEditRemove,function(){
		this.ndata.save({del:true});
		this.opDefault();
	}.bind(this));
}
