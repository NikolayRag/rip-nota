/*
	Board UI.
 	called at Board.draw() to guarantee parent UI element is defined
*/
var BoardUI= function(_note,_rootW){
	var _this= this;

	_this.note= _note;

	_this.DOM= _this.build(_rootW);
	_this.overview= new BoardUIOverview(_this.note,_rootW);

	_this.bound= {
		xmin: null,	xmax: null, width: null,
		ymin: null,	ymax: null, height: null,
		dirty: true
	}
	_this.lastHilite= null; //data.ui with mouseover
	_this.mouseInitialX= 0;
	_this.mouseInitialY= 0;

	_this.lazyCtx= {};

	_this.bindEvt();
}


BoardUI.prototype.place= function(_data,_uiRoot){
	_uiRoot.style.left= _data.place.x +"px";
	_uiRoot.style.top= _data.place.y +"px";
	_uiRoot.style.width= _data.place.w +"px";
	_uiRoot.style.height= _data.place.h +"px";
}

////PRIVATE
BoardUI.prototype.bindEvt= function(){
	var _this= this;
	this.DOM.root.onmousedown= function(_e){UI.mouseContext(_e,_this,_this.mouseDown,_this.mouseMove)};
	this.DOM.root.onmouseup= function(_e){if (!_e.toolFlag && _this.note.PUB.rights>=NOTA_RIGHTS.RW) UI.toolSet.make(ToolBoard,_this.DOM.tool,_this.note)};

	UI.bindDeep(this.onWndScroll.bind(this),this.onWndResize.bind(this));
}

BoardUI.prototype.mouseDown= function(_e){
	this.mouseInitialX= DOCUMENT.scrollLeftF() +_e.clientX;
	this.mouseInitialY= DOCUMENT.scrollTopF() +_e.clientY;
}

BoardUI.prototype.mouseMove= function(_e){
	DOCUMENT.scrollXY(
		this.mouseInitialX -_e.clientX,
		this.mouseInitialY -_e.clientY
	);
}


BoardUI.tmpl= DOM('plateBoardTmpl');
BoardUI.prototype.build= function(_parentEl){
	var cRoot= BoardUI.tmpl.cloneNode(true);
	var cBG= DOM('plateBoardBG',cRoot);
	var cCanvas= DOM('plateBoardCanvas',cRoot);
	var cRootover= DOM('plateBoardRoot',cRoot);
	var cCtx= DOM('plateBoardContext',cRoot);
	var cTool= DOM('plateBoardToolHolder',cRoot);
	NOID(cRoot);

	cCanvas.style.display= (UI.perfLevel &PERF.IMAGEBG)? '' :'none';

	_parentEl.appendChild(cRoot);

	return {
		root:cRootover,
		context:cCtx,
		bg:cBG,
		canvas:cCanvas,
		tool:cTool
	};
}

BoardUI.prototype.canvasSet= function(){
	var canvas= this.DOM.canvas;
	if ((canvas.width == canvas.offsetWidth) && (canvas.height == canvas.offsetHeight))
	  return;

	canvas.width= canvas.offsetWidth;
	canvas.height= canvas.offsetHeight;

	var cStyle= this.note.PUB.style;

	var canvasImgRepaint= function(_img){
		var cctx= canvas.getContext('2d');
		cctx.globalAlpha= 0.05;
		cctx.drawImage(_img,0,0,canvas.width,canvas.height);
		_img.isLoaded= true;
	}

	if (!this.bgimg){
		this.bgimg= new Image();
		var _this= this;
		  this.bgimg.onload= function(){canvasImgRepaint(_this.bgimg)};
		this.bgimg.src= cStyle.bg.imgName;
//todo: make normal animating bg
//		paintC(canvas);
	} else if (this.bgimg.isLoaded)
	  canvasImgRepaint(this.bgimg);
}

BoardUI.prototype.style= function() {
	var curStyle= this.note.PUB.style;

	this.canvasSet();

	this.DOM.bg.style.backgroundColor= curStyle.main.hex('');

//todo: usa: overview should be auto-hidden for implicits not larger than screen
	this.overview.DOM.root.style.display= ((this.note.PUB.rights<NOTA_RIGHTS.RO || UI.embed)? 'none' : '');
	this.overview.DOM.bg.style.backgroundColor= curStyle.main.mix(STYLE.OVERVIEW_TINT,STYLE.OVERVIEW_MIX).hex('');

	var thisData= this.note.PUB.ndata;
	for (var i in thisData)
	  if (thisData[i].ui) //skip for nonexistent (yet) leafs
	    thisData[i].ui.style();
}


//todo: unify full and partial redraw
BoardUI.prototype.onWndScroll= function(){
	this.overview.correct();
	this.canvasMove();

	lazyRun(
		this.saveBrowse.bind(this)
		, TIMER_LENGTH.BROWSE_DELAY
		, this.lazyCtx
	);
}

BoardUI.prototype.onWndResize= function(){
	this.canvasMove();
	this.correct(1);
}


/*
*/
BoardUI.prototype.canvasMove= function() {
	var  canvasGapW= this.DOM.canvas.clientWidth-DOCUMENT.clientWidthF(1)
		,canvasGapH= this.DOM.canvas.clientHeight-DOCUMENT.clientHeightF(1)
		,frameGapW= DOCUMENT.scrollWidthF()-DOCUMENT.clientWidthF()
		,frameGapH= DOCUMENT.scrollHeightF()-DOCUMENT.clientHeightF();

	if (canvasGapW<=0 || canvasGapH<=0)
	  return;

//	Moving range is canvasGap, but no more than frameGap/2
	this.DOM.canvas.style.left= -DOCUMENT.scrollLeftF() *Math.min(canvasGapW/frameGapW,.5) +'px';
	this.DOM.canvas.style.top= -DOCUMENT.scrollTopF() *Math.min(canvasGapH/frameGapH,.5) +'px';
}


//0-1 range of ENTIRE workfield span
BoardUI.prototype.lookXY= function(_x,_y){
	DOCUMENT.scrollXY(
		1.*_x*DOCUMENT.scrollWidthF() -DOCUMENT.clientWidthF()*.5
		,1.*_y*DOCUMENT.scrollHeightF() -DOCUMENT.clientHeightF()*.5
	);
}

//0-1 range inside notes block ONLY
//todo: need at all?
BoardUI.prototype.lookat= function(_lookX,_lookY){
	var bound= this.getBound();
	DOCUMENT.scrollXY(
		bound.width*(_lookX*2-1)*.5
		 +DOCUMENT.scrollWidthF()*.5
		 -DOCUMENT.clientWidthF()*.5
		,bound.height*(_lookY*2-1)*.5
		 +DOCUMENT.scrollHeightF()*.5
		 -DOCUMENT.clientHeightF()*.5
	);
}
BoardUI.prototype.blocksXY= function(){
	var bound= this.getBound();
	return {
		x:
		((DOCUMENT.scrollLeftF()+DOCUMENT.clientWidthF()*.5)/DOCUMENT.scrollWidthF()-.5)
		*DOCUMENT.scrollWidthF()/bound.width
		+.5,
		y:
		((DOCUMENT.scrollTopF()+DOCUMENT.clientHeightF()*.5)/DOCUMENT.scrollHeightF()-.5)
		*DOCUMENT.scrollHeightF()/bound.height
		+.5
	};
}


//todo: remove f'n redrawdelay
BoardUI.prototype.correct= function(redrawDelay){
	this.canvasSet();
	this.correctField();

	this.overview.draw(redrawDelay |0);
}

//todo: maybe: check for real changes, before applying
//todo: issue: Board.BG moved out from Board.context and placed earlier. POSSIBLE correctField errors.
BoardUI.prototype.correctField= function(){
	if (this.note.PUB.ndata.length==0) { //blank field
		this.DOM.root.style.width=
		  this.DOM.root.style.height= 0;
		return;
	}

	var bound= this.getBound();
	var mainMargins= (this.note.PUB.rights>=NOTA_RIGHTS.RW? 0: STYLE.BOARD_MARGIN);

	//Horisontal
	var wClient= DOCUMENT.clientWidthF();
	var wClientEditable= wClient *(this.note.PUB.rights>=NOTA_RIGHTS.RW? STYLE.BOARD_MARGIN_EDITABLE :.0) +mainMargins;
	var wFocus= bound.width +wClientEditable*2;
	var wExcess= wClient>wFocus? wClient-wFocus :0;
	this.DOM.root.style.width= (wExcess>0?wClient:wFocus) +"px";
	this.DOM.context.style.left= -bound.xmin +wClientEditable +wExcess/2 +"px";

	//Vertical
	var hClient= DOCUMENT.clientHeightF();
	var hClientEditable= hClient *(this.note.PUB.rights>=NOTA_RIGHTS.RW? STYLE.BOARD_MARGIN_EDITABLE :.0) +mainMargins;
	var hFocus= bound.height +hClientEditable*2;
	var hExcess= hClient>hFocus? hClient-hFocus :0;
	this.DOM.root.style.height= (hExcess>0?hClient:hFocus) +"px";
	this.DOM.context.style.top= -bound.ymin +hClientEditable +hExcess/2 +"px";
}


BoardUI.prototype.getBound= function(){
//todo: bound should be updated as leafs changed, use dirtyBound()
//	if (0 &&  !this.bound.dirty)
//	  return this.bound;

	var f; 
	for (var i in this.note.PUB.ndata){
		var curPlace= this.note.PUB.ndata[i].place;

		if (f){
			var xm= curPlace.x+curPlace.w;
			var ym= curPlace.y+curPlace.h;
			if (curPlace.x<this.bound.xmin)
			  this.bound.xmin= curPlace.x;
			if (xm>this.bound.xmax)
			  this.bound.xmax= xm;
			if (curPlace.y<this.bound.ymin)
			  this.bound.ymin= curPlace.y;
			if (ym>this.bound.ymax)
			  this.bound.ymax= ym;
		} else {
			this.bound.xmin= curPlace.x;
			this.bound.xmax= this.bound.xmin+curPlace.w;
			this.bound.ymin= curPlace.y;
			this.bound.ymax= this.bound.ymin+curPlace.h;

			f= true;
		}
	}

	this.bound.width= this.bound.xmax -this.bound.xmin;
	this.bound.height= this.bound.ymax -this.bound.ymin;
	this.bound.dirty= false;

	return this.bound;
}

BoardUI.prototype.dirtyBound= function(){
	this.bound.dirty= true;
}

BoardUI.prototype.saveBrowse= function(){
	var xy= this.blocksXY();
	SESSION.cookieSet(xy.x +'_' +xy.y, 'bpos' +this.note.PUB.id);
}
