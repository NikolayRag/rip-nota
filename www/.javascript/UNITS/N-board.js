/*
	Global board UI class, inherits Nroot(and Ncore).
*/
var Board= function(_id){
	var thisNote= new Nroot(_id);
//todo: SHORTCUT, MUST REDESIGN
	thisNote.PUB.nroot= thisNote;

	thisNote.dataTemplates= Board.prototype.dataTemplates;
	thisNote.doDraw= Board.prototype.doDraw;
	thisNote.doSaved= Board.prototype.doSaved;
	//override to make delayed
	thisNote.drawTimeout= null;
	thisNote.__draw= thisNote.draw;
	thisNote.draw= Board.prototype.draw;

	thisNote.PUB.ui= new BoardUI(thisNote,UI.DOM.workField);
	thisNote.leafTemplates= [ //see DATA_TYPE constant enumeration
		DataUIBoardUnknown,
		DataUIBoardEl,
		DataUIBoardNote
	];

	return thisNote;
}


Board.prototype.draw= function(){
	clearTimeout(this.drawTimeout);
	this.drawTimeout= setTimeout(this.__draw.bind(this),0);
}

Board.prototype.dataTemplates= function(){
	return this.leafTemplates;
}

Board.prototype.doDraw= function(_force){
	if (this.owner().forRedraw)
	  UI.ownerW.draw(this);
	if (this.owner().forRedrawBoards)
	  UI.ownerW.boardlistW.draw(this);
	UI.ownerW.drawBRight(this.PUB.rights);

	//update Data at its own condition
	var curDI= 0;
	for(var iD in this.PUB.ndata){
		var cData= this.PUB.ndata[iD];

		_force= _force || cData.forRedraw;
		if (cData.draw(curDI))
		  curDI++;
	}

	if (!_force && !this.PUB.forRedraw)
	  return;

	this.PUB.ui.correct();
	this.PUB.ui.style();
	UI.style(); //parent holder influenced

//todo: set point of interest
	if (!this.PUB.ui.lookat.done){
		var coords= SESSION.cookieGet('bpos' +this.PUB.id).split('_');
		if (coords!=''){
			this.PUB.ui.lookat(coords[0], coords[1]);
			this.PUB.ui.lookat.done= true;
		} else {

		}
	}

//todo:
//	redraw preview if need
	
ALERT(PROFILE.BREEF,"Board "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
}


Board.prototype.doSaved= function(){
}
