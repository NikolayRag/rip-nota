//todo: GC for Ucore/Ncore
/*
	Global update class.

	Holds all server updates:
		-requested note with data
		-contained notes with data
		-current user with contact references and boardlist
		-requested user with boardlist
		-all referenced boards from boardlists as breef (no data)
		-all referenced contacts - from user contacts and from all notes and data
*/
SESSION.update= new function(){


//State change
/*
	 - UPDATE: periodically set from coreCycle(),
	 - ERROR: server responce is delayed ar server returns error.
	 	Non-critical, just trying to call over without returning to NORMAL.
	 - STEADY: start of client-side update routine
	 - STOP client-side update routine is delayed. Update is stopped at all.
	 - NORMAL is successfull end of update cycle, 
*/
this.setState= function(_newState, _msgVerb){
	switch (_newState) {
		case UPDATE_STATE.UPDATE:
			//async sent, UPDATE_STATE_ERROR is charged
			if (this.updateState == UPDATE_STATE.UPDATE || this.updateState == UPDATE_STATE.STOP)
			  return;

			clearTimeout(this.timeOut);
			var _this= this;
			  this.timeOut= setTimeout( function(){
			  	_this.setState(UPDATE_STATE.ERROR,DIC.popStateVDelayed);
			  }, TIMER_LENGTH.UPDATE_DELAY_ERROR); 

			this.update();
			if (this.updateState != UPDATE_STATE.NORMAL) //no visual updates 
			  return;
			break;
		case UPDATE_STATE.ERROR:
			clearTimeout(this.timeOut);

			//Server error, non-critical: async was not returned in timeout (or explicitely set by returning error, see updateCBErr())
			this.HTTPReq && this.HTTPReq.abort();
			break;

		case UPDATE_STATE.STEADY:
			//UPDATE_STATE_STOP is silently charged
			clearTimeout(this.timeOut);
			var _this= this;
			  this.timeOut= setTimeout( function(){
			  	_this.setState(UPDATE_STATE.STOP,DIC.popStateVDelayed);
			  }, TIMER_LENGTH.UPDATE_DELAY_STOP);
			return;
		case UPDATE_STATE.STOP:
			//board update callback was hang, CRITICAL
			this.coreCycle(false);
			UI.popW.up(DIC.popStateStopALERT);
			break;
		case UPDATE_STATE.NORMAL:
			//callback finished normally
			clearTimeout(this.timeOut);
	}
	this.updateState= _newState;
	if (this.active)
	  UI.drawState(_newState, _msgVerb);
}


//	Update notes from server.
/*
	Called periodically from setState()
*/
//todo change update to hash+data 2-step call.
this.update= function() {
__PROFILE.profileTime(); //profile
	var _board= SESSION.board;

	var saveData= [];
	saveData['rId']= _board.PUB.id; //lock onto original id
	if (_board.PUB.id<0){
		saveData['rWho']= SESSION.reqWho;
		saveData['rWhat']= SESSION.reqWhat;
		saveData['rFilter']= SESSION.reqFilter;
//		saveData+= "&bWhoVer=" +this.board.owner.ver;
	}
/*
	saveData+="&bVer=" +this.ver;
	saveData+="&idCheck=";
	for (var i in this.notes)
	  if (i>0)
		saveData+=i+",";
	for (var i in this.notes){
		var bn= this.notes[i];
		saveData+="&vn"+i+"=" +bn.ver;
		saveData+="&vd"+i+"=" +(bn.ndata==[]? -1:bn.ndata[0].ver);
		saveData+="&vc"+i+"=" +(bn.ndata.length-1);
	}
*/
	this.saveData= saveData; //cache for report

	this.HTTPReq= SESSION.async(ASYNC_MODE.UPDATE, saveData, this, this.updateCB, this.updateCBErr);
}

this.updateCBErr= function(_err,_txt){
//todo: catch update http err

	var resTxt= (_err+(_txt!=''? ': ' :'')).decorateHTML(STR.DIV |STR.BOLD)+ _txt;
	this.setState(UPDATE_STATE.ERROR,resTxt);
}



/*
	infinite update calls, starting instantly
*/
//todo: make flexible pulse, based on update complexity and response time/timeout
this.coreCycle= function(_state){
	if (!(this.active= (this.active && _state))){
		this.HTTPReq && this.HTTPReq.abort();
		return;
	}

	var _this= this;
	  setTimeout(function(){
	  	_this.coreCycle(_this.active)
	  }, this.pulse);

	this.setState(UPDATE_STATE.UPDATE);
} 


//UPDATE CALLBACKS
/*
	incremental update of everything
	->remember, index and booleans are string!<-

	Everything is fetched as plain list of Notes, Data and Users each by one ";"-separated string.

	Assignment of Notes and Users to any particular list is holded by prefix and elsewhere.
	All used Notes and Users are listed once, with full-form in priority.
	
	Notes:
		1a. full/requested Note
			Prefix "R"
			goes first
		1b. full/all children
			Prefix "N"
			goes subsequentally after "R"
		1c. inherit Notes list
			temp formed. Notes that are parents to 1a and 1b Notes (i.e. their home Board)
		3a. breef/Your boardlist
			the List itself is located at "You" User
		3b. breef/User boardlist
			the List itself is located at "User" User
	Users:
		2a. You
			Prefix "Y" or "YU"
			Current user. If Anon, then id=0
		2b. User
			Prefix "U" or "YU"
			requested Note's owner. If Note is NativeImp then User is Anon (id=0)
		4a. Your contactlist
			List itself is located at "You" User
		4b. all Notes owners
			temp formed.
			
	Due to lot of possible cross-references, it's unable (?) to delete existing Notes/Users
	on fly as data is read. In that cause deletion is done as bulk afted everything is read.
	
	Macro:
		Read everything
			update Note/User
			create Note/User
			form Requested list
			form Inherit list
			form Owners list
		Delete existing Notes/Users based on difference with read data

	Data recieved is:
		-N:	full Note: requested or leaf, data (d) follows
		-n:	breef Note, basically for user board list and ancestors. No data applied.
		-d:	NData for non-breef Notes. NData supplied is sent serially next to Note
		-U:	active User. Holds boardlist and contacts list. Corresponds to SESSION.owner()
		-u:	breef Users, basically active user's contacts and all Note's and NData owners
		-t:	debug, time profile
*/

//...continued

this.updateCB= function(_bData){
	//start waiting for fuckup. removed at end of routine.
	this.setState(UPDATE_STATE.STEADY); //hanging update routine will set STOP mode
	var splitData= _bData.split(ASYGN.D_UNIT);
	var ctxNote= undefined; //context for storing Ndata to within cycle

	var profTime= __PROFILE.profileTime();
	var profSize= DIC._got +': ' +formatMeasures(_bData.length,1024,.1,'b');
	var profTimeA= splitData[splitData.length>1?splitData.length-2:0].split(ASYGN.D_ITEM);
	var profTimeMsg= profTimeA[0]=='t'?
	  (profTimeA[2]*1000 +':' +DIC.popStateProfTimeServ +', ' +(profTime-profTimeA[2]*1000) +':' +DIC.popStateProfTimeTransfer)
	  : '';

var ALERTFLAG= 1;
if (ALERTFLAG) {	//profile request +CBtime +responce
	ALERT(PROFILE.VERBOSE, 'Request', this.saveData);
	ALERT(PROFILE.VERBOSE, 'Reloaded in', profTime/1000 +(profTimeMsg!=''? 's (' +profTimeMsg +')' :''));
	ALERT(PROFILE.VERBOSE, 'FPS', UI.fps);
	ALERT(PROFILE.VERBOSE, profSize +': ', splitData.join("\n"));
//	ALERTFLAG= 0; //do once
}

	//Update all changes prior to any redraw
	for (var splitI in splitData){
		var splitDStr= splitData[splitI].split(ASYGN.D_ITEM);
		var sign= splitDStr[ASIDX_UPDCB.SIGN];

		//class proccessing
		switch (sign) {
			case ASYGN.NFULL: case ASYGN.NBREEF:
			 	ctxNote= this.respondN(
					sign,
				 	splitDStr[ASIDX_UPDCB.N_OLDID] |0,
					splitDStr[ASIDX_UPDCB.N_ID] |0,
					{
						ver: splitDStr[ASIDX_UPDCB.N_VER] |0,
						name: splitDStr[ASIDX_UPDCB.N_NAME],
						style: splitDStr[ASIDX_UPDCB.N_STYLE],
						owner: splitDStr[ASIDX_UPDCB.N_OWNER] |0,
						editor: splitDStr[ASIDX_UPDCB.N_EDITOR] |0,
						rights: splitDStr[ASIDX_UPDCB.N_RIGHTS] |0,
						rightA: splitDStr[ASIDX_UPDCB.N_RIGHTGRPA].split(ASYGN.D_LIST),
						inherit: splitDStr[ASIDX_UPDCB.N_INHERIT] |0,
						stamp: new Date(new Date()-(splitDStr[ASIDX_UPDCB.N_STAMP] |0)*1000)
					}
				);
				break;
			case ASYGN.NDATA:
				if (ctxNote)
				  this.respondD(
					splitDStr[ASIDX_UPDCB.D_ID] |0,
					{
						ver: splitDStr[ASIDX_UPDCB.D_VER] |0,
						dtype: splitDStr[ASIDX_UPDCB.D_DTYPE] |0,
						content: splitDStr[ASIDX_UPDCB.D_DATA],
						editor: splitDStr[ASIDX_UPDCB.D_EDITOR] |0,
						stamp: new Date(new Date()-(splitDStr[ASIDX_UPDCB.D_STAMP] |0)*1000),
						place: splitDStr[ASIDX_UPDCB.D_PLACE].split(ASYGN.D_LIST)
				  	},
				  ctxNote);
				break;
			case ASYGN.USER: case ASYGN.YOU:
	  			ctxNote= undefined;
				this.respondU(
					sign,
					splitDStr[ASIDX_UPDCB.U_ID] |0,
					{
						ver: splitDStr[ASIDX_UPDCB.U_VER] |0,
						uname: splitDStr[ASIDX_UPDCB.U_NAME],
						relation: splitDStr[ASIDX_UPDCB.U_RELATION] |0,
						groupId: splitDStr[ASIDX_UPDCB.U_GROUPID] |0,
						boardList: splitDStr[ASIDX_UPDCB.U_BOARDLIST].split(ASYGN.D_LIST),
						contactsList: splitDStr[ASIDX_UPDCB.U_CONTACTSLIST].split(ASYGN.D_LIST)
					}
				);
				break;
		}
	}	


//todo:
	//delete all unused
//	Ncore.all().forEach(function(note){
//		if (note.PUB.ver==CORE_VERSION.DEL){
//		}
//	});

//todo: make condition to call; see UI.drawWindow definition
	UI.drawWindow();
	UI.youW.draw();

//todo: mantain cached Ncore/Ndata .redrawList[]
	SESSION.board.draw();


ALERT();

	//no errors, fuckup is canceled and error state is reset
	var profBreef= profSize +' ' +DIC._in.toLowerCase() +' ' +profTime/1000 +'s' +((profTimeMsg!=''? profTimeMsg +'<br> ' :'') +__PROFILE.profileTime() +'ms: ' +DIC._proccessed).decorateHTML(STR.IDENT) +'FPS: ' +UI.fps;
	this.setState(UPDATE_STATE.NORMAL,profBreef);
}



this.respondN= function(_sign, _oldId, _id, _unit){
//todo: plug; remove after incrementals implemented
if (!_oldId && _id>0 && Ncore(_id)) _oldId= _id;

	//use existing or CREATE appropriate. Board assumed to exist
	var ctxNote;
	if (_oldId)
	  ctxNote= new Ncore(_oldId); //only fetch
	else {
		if (_sign==ASYGN.NFULL){
		  ctxNote= new Note(_id);
		} else
		  ctxNote= new Nroot(_id);
	}

	//resolve ID for found named request
	if (ctxNote.PUB.id != _id)
	  ctxNote.setId(_id);

//todo:	proper reaction to inadequate server version

//todo: remove when incremental update implemented
	//no difference for real Note
	if (
		_id<0
		|| _unit.ver>=ctxNote.PUB.ver
		|| _unit.rights!=ctxNote.PUB.rights
		|| _unit.inherit!=ctxNote.PUB.inheritId
	)
	//set grabbed; _name,_ver,_style,_rights,_rightA,_inherit,_stamp,_owner; _in.ver=0 for deletion
	  ctxNote.set(_unit);

	return ctxNote;
}


this.respondD= function(_id, _unit, _ctxNote){
	if (_unit.dtype==DATA_TYPE.TEXT)
	  _unit.content= _unit.content.base64_decode();

	_ctxNote.dataSet(_id, _unit);
}


this.respondU= function(_sign, _id, _unit){
	var curUser= new Ucore(_id);
	if (_unit.ver<=curUser.ver)
	  return;
	
	curUser.set(_unit);

	if (_sign == ASYGN.YOU && _id != SESSION.owner().id){
//todo: proper user relogon reaction
		alert(DIC.errrUserOutdated);
		SESSION.reload(SESSION.reqWho, SESSION.reqWhat);
	}
}

this.pulse= TIMER_LENGTH.UPDATE_PULSE;
this.active= true;
this.HTTPReq= null;

this.updateState= UPDATE_STATE.NORMAL;
this.timeOut= null;

}
