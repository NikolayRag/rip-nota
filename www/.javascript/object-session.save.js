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

this.save= function(){
	lazyRun(
		this.saveGo.bind(this)
		, TIMER_LENGTH.SAVE_DELAY
		, this.lazyCtx
	);

	SESSION.board.uiA[0].nFrontUI.draw();

ALERT(PROFILE.BREEF, 'SAVE attempt', '');
}

this.saveGo= function(_sync){
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
			if (curData.forDelete){
				dataBlock[ASIDX_SAVE.D_VER]= 0;
			} else {
				dataBlock[ASIDX_SAVE.D_VER]= curData.ver;
				if (curData.id<0) dataBlock[ASIDX_SAVE.D_PARENT]= nId;
				dataBlock[ASIDX_SAVE.D_PLACE]= [curData.place.x,curData.place.y,curData.place.w,curData.place.h].join(ASYGN.D_LIST);
				dataBlock[ASIDX_SAVE.D_DTYPE]= curData.dtype;
				dataBlock[ASIDX_SAVE.D_DATA]= curData.dtype==DATA_TYPE.TEXT? curData.content.base64_encode() : curData.content;
			}
			
			saveData[ASYGN.NDATA+curData.id]= dataBlock.join(ASYGN.D_ITEM);
		}
	}

ALERT(PROFILE.GENERAL, 'SAVE', saveData);

	return SESSION.async(ASYNC_MODE.SAVE, saveData, this.saveCB, this.saveCBErr, _sync);
} 

this.saveCB= function(_sData){
ALERT(PROFILE.BREEF, 'SAVE RES', _sData);

//todo: reset timestamp HERE
//todo: handle errors
	var sDataA= _sData.split(ASYGN.D_ITEM);

	var resNotesA= [];
	var resDataA= [];
	for (var iN in sDataA){ //Notes should be reacted first to have available possible later Ndata redraw
		var res= sDataA[iN].split(ASYGN.D_LIST);
		var resId= res[ASIDX_SAVECB.ID];
		var resRes= res[ASIDX_SAVECB.RES];
		switch (res[ASIDX_SAVECB.SIGN]){
			case ASYGN.NBREEF:
				var cNote= resNotesA[resId]= Ncore.all(resId);
				if (cNote && resRes>=0)
				  cNote.saved(resRes)
				else
				  console.log('Error saving Note ' +resId +': ' +(cNote? resRes :'undefined'));

				break;
			case ASYGN.NRIGHTS:
				break;
			case ASYGN.NDATA: //cache
				resDataA[resId]= resRes |0;
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

	SESSION.board.draw(true);

//todo: deal with accidentally unsaved
}.bind(this);

this.saveCBErr= function(_code, _err,_txt){
alert(_err +': ' +_txt);
ALERT(PROFILE.GENERAL,'Save error',_err +': ' +_txt);
	this.save();
}.bind(this);


this.lazyCtx= {};

}
