/*
	Placed Note UI, inherits Nroot(and Ncore).
*/
var Note= function(_id){
	var thisNote= new Nroot(_id);

	thisNote.doDraw= Note.prototype.doDraw;
	thisNote.doSaved= Note.prototype.doSaved;
	thisNote.leafTemplates= [ //see DATA_TYPE constant enumeration
		DataUINoteUnknown,
		DataUINoteEl
	];

	thisNote.PUB.ui= null;

	return thisNote;
}



Note.prototype.doDraw= function(_force){
	var rootData= SESSION.board.dataContext(this.PUB.id);

	//inited at draw(), coz all Notes creation done prior to draw (see update cb)
	if (!this.PUB.ui)
	  this.PUB.ui= new NoteUI(this,rootData.ui.DOM.context);

	//update Data at its own condition
	for(var iD in this.PUB.ndata){
		var cData= this.PUB.ndata[iD];

		_force= _force || cData.forRedraw;
		cData.draw(this.leafTemplates);
	}

	if (!_force && !this.PUB.forRedraw)
	  return;

//	UI.ownerW.draw(this);
	this.PUB.ui.style();
	rootData.ui.style(); //parent holder influenced

ALERT(PROFILE.BREEF, "Note "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
}



Note.prototype.doSaved= function(){
	var rootData= SESSION.board.dataContext(this.PUB.id);

//todo: inspect, obsolete code?
/*
	var childDataSave= 0;
	for (var c in this.PUB.ndata)
	  if (this.PUB.ndata[c].forSave>0){
	  	childDataSave= 1;
	  	break;
	  }
*/

	rootData.ui.setState(this.PUB.forSave || rootData.forSave);
}
