var ToolBoard= function(_rootW,_board){
	var _this= this;

	_this.rootW= _rootW;
	_this.board= _board;

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();
}

ToolBoard.prototype.bindEvt= function(){
	var _this= this;
	this.DOM.tNew.onmouseup= function(){_this.opDefault()};
	this.DOM.tStyle.onmouseup= function(_e){_this.opStyle(_e)};

	this.DOM.rtsR[1].onclick=	function(){_this.opRights(this,1,0)};
	this.DOM.rtsR[2].onclick=	function(){_this.opRights(this,2,0)};
	this.DOM.rtsR[4].onclick=	function(){_this.opRights(this,4,0)};
	this.DOM.rtsA[1].onclick=	function(){_this.opRights(this,1,1)};
	this.DOM.rtsA[2].onclick=	function(){_this.opRights(this,2,1)};
	this.DOM.rtsA[4].onclick=	function(){_this.opRights(this,4,1)};
	this.DOM.rtsE[1].onclick=	function(){_this.opRights(this,1,2)};
	this.DOM.rtsE[2].onclick=	function(){_this.opRights(this,2,2)};
	this.DOM.rtsE[4].onclick=	function(){_this.opRights(this,4,2)};
}


ToolBoard.tmpl= DOM('toolBoardTmpl')
ToolBoard.prototype.build= function(_parentEl){
	var cClone= ToolBoard.tmpl.cloneNode(true);
	var cRoot= {
		root: cClone,
		context: DOM('toolContext',cClone),
		tNew: DOM('toolNew',cClone),
		tStyleSample: DOM('toolStyleSample',cClone),
		tStyle: DOM('toolStyle',cClone),
		setOwner: DOM('toolsetOwner',cClone),
		rtsR: [0,DOM('rights1_R',cClone),DOM('rights2_R',cClone),0,DOM('rights4_R',cClone)],
		rtsA: [0,DOM('rights1_A',cClone),DOM('rights2_A',cClone),0,DOM('rights4_A',cClone)],
		rtsE: [0,DOM('rights1_E',cClone),DOM('rights2_E',cClone),0,DOM('rights4_E',cClone)]
	};
<<<<<<< HEAD
	cRoot.context= DOM('toolBoardContext',cRoot.root);
	cRoot.tNew= DOM('toolBoardNew',cRoot.root);
	cRoot.tStyle= DOM('toolBoardStyle',cRoot.root);
	cRoot.setOwner= DOM('toolBoardSetOwner',cRoot.root);
	cRoot.rtsR= [0,DOM('rights1_R',cRoot.root),DOM('rights2_R',cRoot.root),0,DOM('rights4_R',cRoot.root)];
	cRoot.rtsA= [0,DOM('rights1_A',cRoot.root),DOM('rights2_A',cRoot.root),0,DOM('rights4_A',cRoot.root)];
	cRoot.rtsE= [0,DOM('rights1_E',cRoot.root),DOM('rights2_E',cRoot.root),0,DOM('rights4_E',cRoot.root)];
	NOID(cRoot.root);
=======
	NOID(cClone);
>>>>>>> ui-colorPicker

	cRoot.tStyleSample.appendChild(UI.paletteW.show());
	this.assignRights(cRoot);

	for (var i in this.board.PUB.rightsA)
	  this.draw1rt(i,this.board.PUB.rightsA[i],cRoot);

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
ToolBoard.prototype.draw1rt= function(_grp,_rts,_DOM){
	_DOM= _DOM || this.DOM;
	_DOM.rtsE[_grp].style.background= _rts==2? "#6a6" : "#aca";
	_DOM.rtsA[_grp].style.background= _rts==1? "#aa6" : "#cca";
	_DOM.rtsR[_grp].style.background= _rts==0? "#aaa" : "#ccc";
}
ToolBoard.prototype.assignRights= function(_DOM){
	var rRoot= this.board.PUB.rights;

	_DOM.setOwner.style.display= rRoot==NOTA_RIGHTS.OWN? '': 'none';
}

ToolBoard.prototype.kill= function(){
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



ToolBoard.prototype.opDefault= function(){
	var _this= this;

alert('new note at '
	+(UI.mouseX +DOCUMENT.scrollLeftF() -this.board.PUB.ui.DOM.context.offsetLeft)
	+':' +(UI.mouseY +DOCUMENT.scrollTopF() -this.board.PUB.ui.DOM.context.offsetTop)
);

	setTimeout(function(){
		UI.toolSet.kill(_this)
	},0);
}

ToolBoard.prototype.opStyle= function() {
	var dTarget= this.board;
//popup if need
	//UI.paletteW.show(1,function(_newStyle){dTarget.save({style:_newStyle})});
	dTarget.save({style:UI.paletteW.style})
}

ToolBoard.prototype.opRights= function(_el,_grp,_rt){
	if (_rt==this.board.PUB.rightsA[_grp])
	  _rt= NOTA_RIGHTS.INIT;

	this.draw1rt(_grp,_rt);

	this.board.save({rights:{group:_grp,right:_rt}});
}