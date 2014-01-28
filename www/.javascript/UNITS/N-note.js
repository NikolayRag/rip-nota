/*
	Placed Note UI, inherits Nroot(and Ncore).
*/
var Note= function(_id){
	var thisNote= new Nroot(_id);

//todo: find place
	thisNote.coreType= 1;

	thisNote.doDraw= Note.prototype.doDraw;
	thisNote.doSaved= Note.prototype.doSaved;
	thisNote.doKill= Note.prototype.doKill;

//todo: move ui out from PUB to this
	thisNote.PUB.ui= null; //inited at draw(), coz all Notes UI depend of parent

	return thisNote;
}

Note.prototype.doDraw= function(_force){
	var rootData= SESSION.board.dataContext(this.PUB.id);
	if (!rootData)
	  return;

	if (!this.PUB.ui)
	  this.PUB.ui= new NoteUI(this,rootData.ui.DOM.context);

	//update Data at its own condition
	for(var iD in this.PUB.ndata){
		var cData= this.PUB.ndata[iD];

		_force= _force || cData.forRedraw;
		cData.draw();
	}

	if (!_force && !this.PUB.forRedraw)
	  return true;

//	UI.ownerW.draw(this);
	this.PUB.ui.style();
	rootData.ui.style(); //parent holder influenced

ALERT(PROFILE.BREEF, "Note "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
	return true;
}


Note.prototype.doSaved= function(){
	var rootData= SESSION.board.dataContext(this.PUB.id);
	if (!rootData || !rootData.ui)
	  return;

//todo: inspect, obsolete code?
/*
	var childDataSave= 0;
	for (var c in this.PUB.ndata)
	  if (this.PUB.ndata[c].forSave>0){
	  	childDataSave= 1;
	  	break;
	  }
*/

	rootData.ui.setState(this.PUB.forSave!=SAVE_STATES.IDLE || rootData.forSave!=SAVE_STATES.IDLE);
}


Note.prototype.doKill= function(){
	this.PUB.ui && this.PUB.ui.kill();
}
