//saveCallback
var noteSaveCB= function(sData){
//pAlert(sData);
	var saveState= sData.split(";");
	for (var i in saveState){
		if (saveState[i]=="") break;
		var res= saveState[i].split("="); //"id=[Note:-=error|0=none|+=version/id]=[Data:0|+]=[Comments:0|+]=<errorString>"
		var exN= BOARD.notes[res[0]];
		if (res[1]>=0 && res[2]>=0 && res[3]>=0){
			if (exN.ver==-1) { //CREATED (ID)
				if (!exN.isRef) {
					exN.id= res[1];
					exN.ver= 1;
					exN.isChanged= 0;
					exN.data[0].ver= 1;
					exN.data[0].isChanged= 0;
					exN.isCChanged= 0;
					exN.setState(C_complete);
					BOARD.notes[res[1]]= exN; //change index
				}
				delete BOARD.notes[res[0]]; //remove from negative index
			} else if (exN.ver==0) { //DELETED
				exN._note_.parentNode.removeChild(exN._note_);
				delete BOARD.notes[res[0]];
				BOARD.noteFieldCorrect(0);
			} else { //SAVED (VER)
				if (res[1]>0){ //note
					exN.ver= res[1];
					exN.isChanged= 0;
				}
				if (res[2]>0){ //root
					exN.data[0].ver= res[2];
					exN.data[0].owner= SESSION.user;
				    exN.data[0].stamp= new Date();
					exN.data[0].isChanged= 0;
				}
				if (res[3]>0){ //comment
					exN.isCChanged= 0;
//todo: reliable update of recent comment. current can duplicate
					exN.comments(exN.data.length, exN._noteComment.value);
					exN._noteComment.value= "";
//todo: get real new versions and check for consistent
					var nData= exN.data[exN.data.length]= new Notedata();
					nData.ver= 1;
					nData.owner= SESSION.user;
				    nData.stamp= new Date();
				}
				exN.setState(C_complete);
				exN.updateStamps();
			}
		} else {
		  //ERROR
			UI.popup(DIC.errrNoteSave+ res[0] +": "+ res[1] +"/"+ res[2] +"/"+ res[3] +": "+ res.slice(4).join("="));
		}
	}
}
