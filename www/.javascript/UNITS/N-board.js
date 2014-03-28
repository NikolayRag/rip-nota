/*
	Global board UI class, inherits NoteUI(and Ncore).
*/
var Board= function(_id){
	var thisNote= new NoteUI(_id);

//todo: use level
	thisNote.coreType= 0;

	thisNote.doDraw= Board.prototype.doDraw;
	thisNote.doSaved= Board.prototype.doSaved;
	//override to make delayed
	thisNote.drawTimeout= null;
	thisNote.__draw= thisNote.draw;
	thisNote.draw= Board.prototype.draw;

//todo: move ui out from PUB to this
	thisNote.typeUI= thisNote.PUB.ui= new NUIBoard(thisNote,UI.DOM.workField);

	return thisNote;
}


Board.prototype.draw= function(){
	clearTimeout(this.drawTimeout);
	this.drawTimeout= setTimeout(this.__draw.bind(this),0);
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

	if (_force || this.PUB.forRedraw){
		this.typeUI.correct();
		this.typeUI.style();
		UI.style(); //parent holder influenced

//todo: set point of interest
		if (!this.typeUI.lookat.done){
			var coords= SESSION.cookieGet('bpos' +this.PUB.id).split('_');
			if (coords!=''){
				this.typeUI.lookat(coords[0], coords[1]);
				this.typeUI.lookat.done= true;
			} else {

			}
		}
	}

//todo:	redraw preview if need
	
	//reset redraw flag for Users
//todo: move elsewhere
	for (var nU in Ucore.all){
		var curUcore= Ucore.all[nU];
		curUcore.forRedraw= 0;
		curUcore.forRedrawBoards= 0;
		curUcore.forRedrawContacts= 0;
	}

ALERT(PROFILE.BREEF,"Board "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
}


Board.prototype.doSaved= function(){
}
