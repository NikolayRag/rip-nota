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

ALERT(PROFILE.BREEF, 'SAVE attempt', '');
}

this.saveGo= function(){
	var saveData= [];

	for(var iN in Ncore.all){
		var curNote= Ncore.all[iN];

		var canSave= curNote.canSave();
		var nId= curNote.PUB.id;

		if (canSave){
			var noteBlock= [];
			noteBlock[ASYNC_PLACE.SVN_CANSAVE]= canSave;
			if (canSave &SAVE_MODE.MAIN){
				noteBlock[ASYNC_PLACE.SVN_VER]= curNote.PUB.ver;
				if (curNote.inherit()) noteBlock[ASYNC_PLACE.SVN_INHERIT]= curNote.inherit().PUB.id;
				noteBlock[ASYNC_PLACE.SVN_NAME]= curNote.PUB.name;
				noteBlock[ASYNC_PLACE.SVN_STYLE]= encodeURIComponent(curNote.PUB.style.makeString());
			}
			if (canSave &SAVE_MODE.RIGHTS)
			  noteBlock[ASYNC_PLACE.SVN_RIGHTS]= curNote.PUB.rightsA.join(ASYGN.D_LIST);

			saveData[ASYGN.NBREEF+nId]= noteBlock.join(ASYGN.D_ITEM);
		}

		var allData= curNote.dataForSave()
		for (var iD in allData){
			var curData= allData[iD];

			var dataBlock= [];
			dataBlock[ASYNC_PLACE.SVD_VER]= curData.ver;
			if (curData.id<0) dataBlock[ASYNC_PLACE.SVD_PARENT]= nId;
			dataBlock[ASYNC_PLACE.SVD_PLACE]= [curData.place.x,curData.place.y,curData.place.w,curData.place.h].join(ASYGN.D_LIST);
			dataBlock[ASYNC_PLACE.SVD_DTYPE]= curData.dtype;
			dataBlock[ASYNC_PLACE.SVD_DATA]= curData.dtype==DATA_TYPE.TEXT? curData.content.base64_encode() : curData.content;

			saveData[ASYGN.NDATA+curData.id]= dataBlock.join(ASYGN.D_ITEM);
		}
	}

//todo: suppress update while saving; and visa-versa
	SESSION.async(ASYNC_MODE.SAVE, saveData, this, this.saveCB, this.saveCBErr);
ALERT(PROFILE.GENERAL, 'SAVE', saveData);
} 

this.saveCB= function(_sData){
ALERT(PROFILE.BREEF, 'SAVE RES', _sData);

//todo: reset timestamp HERE
//todo: handle errors
	var sDataA= _sData.split(ASYGN.D_ITEM);
	for (var i in sDataA){
		var res= sDataA[i].split(ASYGN.D_LIST);

		switch (res[0]){
			case ASYGN.NBREEF:
				var cNote= Ncore.all[res[1]];
				if (cNote && res[2]>=0)
				  cNote.saved(res[2] |0);
				else
				  console.log('Error saving Note ' +res[1] +': ' +(cNote? res[2] :'undefined'));
				break;
			case ASYGN.NDATA:
				var cData= Ndata.all(res[1]);
				if (cData && res[2]>=0)
				  cData.saved(res[2] |0);
				else
				  console.log('Error saving Data ' +res[1] +': ' +(cData? res[2] :'undefined'));
				break;
		}
	}

//todo: check for accidentally unsaved

} 

this.saveCBErr= function(_err,_txt){
alert(_err +': ' +_txt);
ALERT(PROFILE.GENERAL,'Save error',_err +': ' +_txt);
	this.save();
} 


this.lazyCtx= {};

}
