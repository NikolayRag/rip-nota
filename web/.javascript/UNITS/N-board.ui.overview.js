var BoardOverviewUI= function(_board,_rootW){
	var _this= this;

	_this.board= _board;

	_this.redrawTimeout= undefined;
	_this.atoms= [];

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();

}


BoardOverviewUI.prototype.bindEvt= function(){
	var _this= this;
	this.DOM.root.onmousedown=	function(e){UI.mouseContext(e,_this,_this.mouseMove,_this.mouseMove)};
	this.DOM.root.ondblclick=	noBubbles;
}

BoardOverviewUI.prototype.mouseMove= function(_e){
	this.board.nFrontUI.lookXY(
		(_e.clientX -this.DOM.root.offsetLeft)/this.DOM.root.offsetWidth,
		(_e.clientY -this.DOM.root.offsetTop)/this.DOM.root.offsetHeight
	);
}

BoardOverviewUI.tmpl= DOM('overviewTmpl');
BoardOverviewUI.prototype.build= function(_parentEl){
	var cRoot= BoardOverviewUI.tmpl.cloneNode(true);
	var cBG= DOM('overViewBG',cRoot);
	var cFrame= DOM('overViewFrame',cRoot);
	NOID(cRoot);

	_parentEl.appendChild(cRoot);

	return {
		root:cRoot,
		bg:cBG,
		frame:cFrame
	};
}

////functions

//resize overview window itself
BoardOverviewUI.prototype.resize= function(){
	var aspect= DOCUMENT.scrollWidthF()/DOCUMENT.scrollHeightF();
	var ovw= aspect>1?STYLE.OVERVIEW_BASESIZE*aspect:STYLE.OVERVIEW_BASESIZE;
	var ovh= aspect>1?STYLE.OVERVIEW_BASESIZE:STYLE.OVERVIEW_BASESIZE/aspect;
	if (ovw>STYLE.OVERVIEW_MAXSIZE) {
		ovh= ovh*STYLE.OVERVIEW_MAXSIZE/ovw;
		ovw= STYLE.OVERVIEW_MAXSIZE;
	}
	if (ovh>STYLE.OVERVIEW_MAXSIZE) {
		ovw= ovw*STYLE.OVERVIEW_MAXSIZE/ovh;
		ovh= STYLE.OVERVIEW_MAXSIZE;
	}
	this.DOM.root.style.width= ovw +'px';
	this.DOM.root.style.height= ovh +'px';
}

BoardOverviewUI.prototype.correct= function(){
//todo: +make also for non-html5 scroll
	var curWidth= DOCUMENT.scrollWidthF()/100;
	var curHeight= DOCUMENT.scrollHeightF()/100;

	this.DOM.frame.style.top=	DOCUMENT.scrollTopF()/curHeight +'%';
	this.DOM.frame.style.height=	DOCUMENT.clientHeightF()/curHeight +'%';
	this.DOM.frame.style.left=	DOCUMENT.scrollLeftF()/curWidth +'%';
	this.DOM.frame.style.width=	DOCUMENT.clientWidthF()/curWidth +'%';
}


//re-paint overview nodes 
//onresize, resize() used instead
//todo: use arbitrary nId to update only one note.
//todo: make update lazy
BoardOverviewUI.prototype.draw= function(_redrawDelay){
	clearTimeout(this.redrawTimeout);
//todo: validate context (???)
	var _this= this;
	setTimeout(function(){
		_this.drawField();
		_this.resize();
		_this.correct();
	},_redrawDelay*TIMER_LENGTH.OVERVIEW_LAZY_DELAY);
}



////PRIVATE
//todo: add one atom redrawing
BoardOverviewUI.prototype.drawField= function(){
	this.atoms= [];
	while (this.DOM.bg.childNodes.length>0)
	  this.DOM.bg.removeChild(this.DOM.bg.lastChild);

	var curLeft= this.board.nFrontUI.DOM.context.offsetLeft;
	var curTop= this.board.nFrontUI.DOM.context.offsetTop;
	var curWidth= DOCUMENT.scrollWidthF()/100;
	var curHeight= DOCUMENT.scrollHeightF()/100;

	for (var i in this.board.PUB.ndata){ //paint overview
		var curLeaf= this.board.PUB.ndata[i];
		if (curLeaf.dtype!=DATA_TYPE.NOTE)
		  continue;
		var atomStyle= curLeaf.sibling().PUB.style;
		if (!atomStyle.main.a)
		  continue;

		var newAtomBG= this.atoms[i]= DOCUMENT.createElement('span');
		  newAtomBG.className= 'overViewAtomBG';

		  //desc: floor/cell used to show maximum used space
		  newAtomBG.style.left= Math.floor((curLeaf.place.x +curLeft)/curWidth) +'%';
		  newAtomBG.style.top= Math.floor((curLeaf.place.y +curTop)/curHeight) +'%';
		  newAtomBG.style.width= Math.ceil(curLeaf.place.w /curWidth) +'%';
		  newAtomBG.style.height= Math.ceil(curLeaf.place.h /curHeight) +'%';

		var newAtom= DOCUMENT.createElement('span');
		  newAtom.className= 'overViewAtom';

		  newAtom.style.backgroundColor= atomStyle.main.mix(STYLE.OVERVIEW_TINT,STYLE.OVERVIEW_MIX).hex();
		  newAtom.style.borderColor= atomStyle.mainDark.mix(STYLE.OVERVIEW_TINT,STYLE.OVERVIEW_MIX).hex();

		newAtomBG.appendChild(newAtom);
		this.DOM.bg.appendChild(newAtomBG);
	}
}

