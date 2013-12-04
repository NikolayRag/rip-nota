var ToolBoardLeafEdit= function(_rootW,_ndata){
	var _this= this;

	_this.sticky= 1; //static
	_this.rootW= _rootW;
	_this.ndata= _ndata;

	_this.mouseHit= null;
	_this.shadow= null;
	_this.canceled= 0;


	_this.DOM= _this.build(_rootW);
	_this.bindEvt();
}

ToolBoardLeafEdit.prototype.bindEvt= function(){
	var _this= this;
	this.DOM.tStyle.onmouseup= function(_e){_this.opStyle(_e)};
	this.DOM.tMove.onmousedown= function(_e){UI.mouseContext(_e,_this,_this.mouseDown,_this.mouseMove,_this.opMouseUp)};

//	this.DOM.context.onmousedown= function(e){noBubbles(e)};
//	this.DOM.context.onmouseup= function(){_this.opEditAccept()};
}

ToolBoardLeafEdit.prototype.mouseDown= function(_e){
	this.mouseHit= {
		x: this.ndata.ui.DOM.root.offsetLeft -_e.clientX,
		y: this.ndata.ui.DOM.root.offsetTop -_e.clientY,
//todo: remove
		toolx: this.DOM.root.offsetLeft -_e.clientX,
		tooly: this.DOM.root.offsetTop -_e.clientY
	}

}
ToolBoardLeafEdit.prototype.mouseMove= function(_e){
	this.ndata.ui.DOM.root.style.left= this.mouseHit.x +_e.clientX +'px';
	this.ndata.ui.DOM.root.style.top= this.mouseHit.y +_e.clientY +'px';
//todo:remove
	this.DOM.root.style.left= this.mouseHit.toolx +_e.clientX +'px';
	this.DOM.root.style.top= this.mouseHit.tooly +_e.clientY +'px';
}
ToolBoardLeafEdit.prototype.opMouseUp= function(){
	this.ndata.save({place:{
		x:this.ndata.ui.DOM.root.offsetLeft,
		y:this.ndata.ui.DOM.root.offsetTop
	}});
	SESSION.board.PUB.ui.correct(1);
}


ToolBoardLeafEdit.tmpl= DOM('toolBLeafEditTmpl')
ToolBoardLeafEdit.prototype.build= function(_parentEl){
	var cClone= ToolBoardLeafEdit.tmpl.cloneNode(true);
	var cRoot= {
<<<<<<< HEAD
		root:ToolBoardLeafEdit.tmpl.cloneNode(true)
	};
	cRoot.context= DOM('toolBLeafEditContext',cRoot.root);

	cRoot.tOuter= DOM('toolBLeafEditOuter',cRoot.root);
	cRoot.tMove= DOM('toolBLeafEditMove',cRoot.root);

	cRoot.tInner= DOM('toolBLeafEditInner',cRoot.root);
	cRoot.tStyle= DOM('toolBLeafEditStyle',cRoot.root);
	NOID(cRoot.root);
=======
		root: cClone,
		context: DOM('toolContext',cClone),

		tOuter: DOM('toolOuter',cClone),
		tMove: DOM('toolMove',cClone),

		tInner: DOM('toolInner',cClone),
		tStyleSample: DOM('toolStyleSample',cClone),
		tStyle: DOM('toolStyle',cClone)
	};
	NOID(cClone);
>>>>>>> ui-colorPicker

	cRoot.tStyleSample.appendChild(UI.paletteW.show());
	this.assignRights(cRoot);
	
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

ToolBoardLeafEdit.prototype.assignRights= function(_DOM){
	var contentNote= this.ndata.sibling();

	var rRoot= this.ndata.rootNote.PUB.rights;
	var rNote= contentNote? contentNote.PUB.rights :null;

	_DOM.tOuter.style.display= rRoot<NOTA_RIGHTS.RW? 'none' :'';
	_DOM.tInner.style.display= rNote<NOTA_RIGHTS.RW? 'none' :'';
	if (rNote>=NOTA_RIGHTS.RW)
	  this.editMode(1);
}

ToolBoardLeafEdit.prototype.kill= function(){
	if (!this.DOM)
	  return;

	var ctx= this.DOM.context.style;
//+++classname
	  ctx.top= '';
	  ctx.left= '';
	  ctx.width= '';
	  ctx.height= '';
	  ctx.padding= '';
	  ctx.borderColor= '';

	this.editMode(0);

	var _this= this;
	setTimeout(function(){
	  _this.rootW.removeChild(_this.DOM.root);
	},CSS.TOOL_TRANSITIONTIME*1000);
}



//calls data save indirectly, from self destructor (default behavior)
ToolBoardLeafEdit.prototype.opDefault= function(){
	var _this= this;
	setTimeout(function(){
		UI.toolSet.kill(_this)
	},0);
}

ToolBoardLeafEdit.prototype.opCancel= function() {
	//remove newly created but unused
/*	if (thisNote.id<0 && thisNote.ndata[0].isChanged==0) {
		thisNote._note_.parentNode.removeChild(thisNote._note_);
		delete BOARD.notes[thisNote.id];
		BOARD.noteFieldCorrect(0);
		return;
	}
*/

	this.editContext().ui.content(this.shadow);
	this.canceled= 1;
	this.opDefault();
}


ToolBoardLeafEdit.prototype.opStyle= function() {
	var dTarget= this.ndata.sibling();
//popup, if need
//UI.paletteW.show(1,function(_style){dTarget.save({style:_style})});
	dTarget.save({style:UI.paletteW.style})
}


ToolBoardLeafEdit.prototype.editMode= function(_edit){
	var sibData= this.editContext();

	var _this= this;
	if (_edit)
	  this.shadow= sibData.ui.editMode(1,function(e){_this.keyPress(e)});
	else {
		sibData.ui.editMode(0);
		if (!this.canceled){
			if (sibData && sibData.ui.content()!=this.shadow)
			  sibData.save({content:sibData.ui.content()});
		}
		this.shadow= '';
	}
}

ToolBoardLeafEdit.prototype.keyPress= function(_e){
	_e= _e||WINDOW.event;
	var code= eKeyCode(_e);

	var _this= this;
	if ((code==13 && _e.ctrlKey) || code==10) this.opDefault();
//todo: feature; replace cancel with non-public store
	if (code==27) UI.popW.up(DIC.popEditCancel,function(){
		_this.opCancel();
	});
}


ToolBoardLeafEdit.prototype.editContext= function(){
	var sibNote= this.ndata.sibling();
//todo: get first element in better manner
	for (var rootData in sibNote.PUB.ndata)
	  break;
	return sibNote.PUB.ndata[rootData];
}