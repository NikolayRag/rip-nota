/*
	Global board UI class, inherits NUI
*/
var NUI_board= function(_rootN, _ctx){
	var thisNote= new NUI(_rootN);

	thisNote.doDraw= NUI_board.prototype.doDraw;
	thisNote.doSaved= NUI_board.prototype.doSaved;

	thisNote.nFrontUI= new NUI_boardFUI(thisNote, _ctx);

	return thisNote;
}


NUI_board.prototype.doDraw= function(){
	this.nFrontUI.correct();
	this.nFrontUI.style();
	UI.style(); //parent holder influenced

//todo: set point of interest
	if (!this.nFrontUI.lookat.done){
		var coords= SESSION.cookieGet('bpos' +this.PUB.id).split('_');
		if (coords!=''){
			this.nFrontUI.lookat(coords[0], coords[1]);
			this.nFrontUI.lookat.done= true;
		} else {

		}
	}

//todo:	redraw preview if need

ALERT(PROFILE.BREEF,"Board "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
}


NUI_board.prototype.doSaved= function(){
}
