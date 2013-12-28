/*
	Global save class.

	Holds all saves to server:
		-notes and rights
		-data
//todo: -users
		-requested user with boardlist
		-all referenced boards from boardlists as breef (no data)
		-all referenced contacts - from user contacts and from all notes and data
*/
SESSION.save= new function(){

this.save= function(_immediate){
	lazyRun(
		this.saveGo.bind(this)
		, (_immediate?0:1)*TIMER_LENGTH.SAVE_DELAY
		, this.lazyCtx
	);

	SESSION.board.draw();

ALERT(PROFILE.BREEF, 'SAVE attempt', '');
}

this.saveGo= function(){
	var saveData= [];

	for(var iN in Ncore.all()){
		var curNote= Ncore.all(iN);
		var nId= iN; //test: and remove //curNote.PUB.id;

		if (curNote.canSave(true)==SAVE_STATES.READY){
			var noteBlock= [];
			noteBlock[ASIDX_SAVE.N_VER]= curNote.PUB.ver;
			noteBlock[ASIDX_SAVE.N_INHERIT]= curNote.inherit()? curNote.inherit().PUB.id :0;
			noteBlock[ASIDX_SAVE.N_NAME]= curNote.PUB.name;
			noteBlock[ASIDX_SAVE.N_STYLE]= encodeURIComponent(curNote.PUB.style.makeString());

			saveData[ASYGN.NBREEF+nId]= noteBlock.join(ASYGN.D_ITEM);
		}

//		var canSaveRts= curNote.canSaveRts(true);
//		if (canSaveRts==SAVE_STATES.IDLE){
//			var rightsBlock= [];
//			rightsBlock[ASIDX_SAVE.R_RIGHTS]= curNote.PUB.rightsA.join(ASYGN.D_LIST);
//
//			saveData[ASYGN.NRIGHTS+nId]= rightsBlock.join(ASYGN.D_ITEM);
//		}

		var allData= curNote.dataForSave(true);
		for (var iD in allData){
			var curData= allData[iD];

			var dataBlock= [];
			dataBlock[ASIDX_SAVE.D_VER]= curData.ver;
			if (curData.id<0) dataBlock[ASIDX_SAVE.D_PARENT]= nId;
			dataBlock[ASIDX_SAVE.D_PLACE]= [curData.place.x,curData.place.y,curData.place.w,curData.place.h].join(ASYGN.D_LIST);
			dataBlock[ASIDX_SAVE.D_DTYPE]= curData.dtype;
			dataBlock[ASIDX_SAVE.D_DATA]= curData.dtype==DATA_TYPE.TEXT? curData.content.base64_encode() : curData.content;

			saveData[ASYGN.NDATA+curData.id]= dataBlock.join(ASYGN.D_ITEM);
		}
	}

	SESSION.async(ASYNC_MODE.SAVE, saveData, this, this.saveCB, this.saveCBErr);
ALERT(PROFILE.GENERAL, 'SAVE', saveData);
} 

this.saveCB= function(_sData){
ALERT(PROFILE.BREEF, 'SAVE RES', _sData);

//todo: reset timestamp HERE
//todo: handle errors
	var sDataA= _sData.split(ASYGN.D_ITEM);

	var resNotesA= [];
	var resDataA= [];
	for (var i in sDataA){ //Notes should be reacted first to be available an possible later Ndata redraw
		var res= sDataA[i].split(ASYGN.D_LIST);
		switch (res[ASIDX_SAVECB.SIGN]){
			case ASYGN.NBREEF:
				var cNote= resNotesA[res[ASIDX_SAVECB.ID]]= Ncore.all(res[ASIDX_SAVECB.ID]);
				if (cNote && res[ASIDX_SAVECB.RES]>=0)
				  cNote.saved(res[ASIDX_SAVECB.RES])
				else
				  console.log('Error saving Note ' +iN +': ' +(cNote? resNotesA[iN] :'undefined'));

				break;
			case ASYGN.NRIGHTS:
				break;
			case ASYGN.NDATA:
				resDataA[res[ASIDX_SAVECB.ID]]= res[ASIDX_SAVECB.RES] |0;
				break;
		}
	}

	for (var iD in resDataA){ //phase two, Data
		var cData= Ndata.all(iD);
		if (cData && resDataA[iD]>=0)
		  cData.saved(resDataA[iD], resNotesA);
		else
		  console.log('Error saving Data ' +iD +': ' +(cData? resDataA[iD] :'undefined'));
	}

	SESSION.board.draw();

//todo: deal with accidentally unsaved
} 

this.saveCBErr= function(_err,_txt){
alert(_err +': ' +_txt);
ALERT(PROFILE.GENERAL,'Save error',_err +': ' +_txt);
	this.save();
} 


this.lazyCtx= {};

}
