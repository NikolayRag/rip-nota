/*
	Placed Note UI, inherits NUI
*/
var NUI_note= function(_rootN, _ctx){
	var thisNote= new NUI(_rootN);

	thisNote.doDraw= NUI_note.prototype.doDraw;
	thisNote.doSaved= NUI_note.prototype.doSaved;

	thisNote.nFrontUI= new NUI_noteFUI(thisNote, _ctx);

	return thisNote;
}


NUI_note.prototype.doDraw= function(){
//	UI.ownerW.draw(this);
	this.nFrontUI.style();
	this.parentUI.dFrontUI.style(); //parent holder influenced

ALERT(PROFILE.BREEF, "Note "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
	return true;
}


NUI_note.prototype.doSaved= function(){
	if (!this.parentUI.dFrontUI)
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

	rootData.dFrontUI.setState(this.PUB.forSave!=SAVE_STATES.IDLE ||  this.parentUI.rootNdata.forSave!=SAVE_STATES.IDLE);
}
