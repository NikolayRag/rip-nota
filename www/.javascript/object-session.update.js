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
ALERT();

	var _board= SESSION.board;

	var saveData= [];
	saveData['last']= SESSION.dbStamp;
	saveData['rId']= _board.PUB.id; //lock onto original id
	if (_board.PUB.id<0){ //freeform request, prioritized
		saveData['rWho']= SESSION.reqWho;
		saveData['rWhat']= SESSION.reqWhat;
		saveData['rFilter']= SESSION.reqFilter;
	}

//checklist: used only for deletion
//todo: depricate block
	this.completeRequest= true; //depricete too
	var checkNotes= [];
	var allNotes= Ncore.all();
	for (var iN in allNotes)
	  if (allNotes[iN].PUB.forSave == SAVE_STATES.IDLE)
	    checkNotes.push(iN);
	  else
	  	this.completeRequest= false;
	saveData['chkN']= checkNotes.join(ASYGN.D_LIST);

	var checkData= [];
	var allData= Ndata.all();
	for (var iD in allData)
	  if (allData[iD].forSave == SAVE_STATES.IDLE)
	    checkData.push(iD);
	  else
	  	this.completeRequest= false;
	saveData['chkD']= checkData.join(ASYGN.D_LIST);

	var checkUsers= [];
	var allUsers= Ucore.all;
	for (var iU in allUsers)
	  if (allUsers[iU].forSave == SAVE_STATES.IDLE)
	    checkUsers.push(iU);
	  else
	  	this.completeRequest= false;
	saveData['chkU']= checkUsers.join(ASYGN.D_LIST);


ALERT(PROFILE.VERBOSE, 'Request', saveData);
	this.HTTPReq= SESSION.async(ASYNC_MODE.UPDATE, saveData, this, this.updateCB, this.updateCBErr);
}

this.updateCBErr= function(_code, _err,_txt){
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

	var profTime= __PROFILE.profileTime();
	var profSize= formatMeasures(_bData.length,1024,.1,'b');
	var profTimeA= splitData[splitData.length>1?splitData.length-2:0].split(ASYGN.D_ITEM);
	var profTimeMsg= profTimeA[0]=='t'?
	  DIC.popStateProfTime.subst([profTimeA[2]*1000, profTime-profTimeA[2]*1000])
	  : '';

var ALERTFLAG= 1;
if (ALERTFLAG) {	//profile request +CBtime +responce
	ALERT(PROFILE.VERBOSE, 'Reloaded in', profTime/1000 +'s' +(profTimeMsg!=''? '(' +profTimeMsg +')' :''));
	ALERT(PROFILE.VERBOSE, 'FPS', UI.fps);
	ALERT(PROFILE.VERBOSE, DIC._got.subst([profSize]) +': ', splitData.join("\n"));
//	ALERTFLAG= 0; //do once
}

	var newDbStamp= 0;
	var updSuccess= true;

	//Update all changes prior to any redraw
	for (var splitI in splitData){
		var splitDStr= splitData[splitI].split(ASYGN.D_ITEM);
		var sign= splitDStr[ASIDX_UPDCB.SIGN];

		//class proccessing
		switch (sign) {
			case ASYGN.STAMP:
				newDbStamp= splitDStr[1];
				break;
			case ASYGN.NFULL: case ASYGN.NBREEF:
			 	updSuccess= this.respondN(
					sign,
				 	splitDStr[ASIDX_UPDCB.N_OLDID] |0,
					splitDStr[ASIDX_UPDCB.N_ID] |0,
					splitDStr[ASIDX_UPDCB.N_VER] |0,
					splitDStr[ASIDX_UPDCB.N_NAME],
					splitDStr[ASIDX_UPDCB.N_STYLE],
					splitDStr[ASIDX_UPDCB.N_OWNER] |0,
					splitDStr[ASIDX_UPDCB.N_EDITOR] |0,
					splitDStr[ASIDX_UPDCB.N_RIGHTS] |0,
					splitDStr[ASIDX_UPDCB.N_RIGHTGRPA],
					splitDStr[ASIDX_UPDCB.N_INHERIT] |0,
					splitDStr[ASIDX_UPDCB.N_STAMP] |0
				) &&updSuccess;
				break;
			case ASYGN.NDATA:
				updSuccess= this.respondD(
					splitDStr[ASIDX_UPDCB.D_ID] |0,
					splitDStr[ASIDX_UPDCB.D_VER] |0,
					splitDStr[ASIDX_UPDCB.D_ROOT] |0,
					splitDStr[ASIDX_UPDCB.D_DTYPE] |0,
					splitDStr[ASIDX_UPDCB.D_DATA],
					splitDStr[ASIDX_UPDCB.D_EDITOR] |0,
					splitDStr[ASIDX_UPDCB.D_STAMP] |0,
					splitDStr[ASIDX_UPDCB.D_PLACE]
				) &&updSuccess;
				break;
			case ASYGN.USER: case ASYGN.YOU:
				updSuccess= this.respondU(
					sign,
					splitDStr[ASIDX_UPDCB.U_ID] |0,
					splitDStr[ASIDX_UPDCB.U_VER] |0,
					splitDStr[ASIDX_UPDCB.U_NAME],
					splitDStr[ASIDX_UPDCB.U_RELATION] |0,
					splitDStr[ASIDX_UPDCB.U_GROUPID] |0,
					splitDStr[ASIDX_UPDCB.U_BOARDLIST],
					splitDStr[ASIDX_UPDCB.U_CONTACTSLIST]
				) &&updSuccess;
				break;
		}
	}	
	if (updSuccess && this.completeRequest) //else should retry update
	  SESSION.dbStamp= newDbStamp;

//todo: make condition to call; see UI.drawWindow definition
	UI.drawWindow();
	UI.youW.draw();

//todo: mantain cached Ncore/Ndata .redrawList[]
	SESSION.board.draw();


	//no errors, fuckup is canceled and error state is reset
	var profBreef= DIC._in.subst([
		profSize, profTime/1000,
			DIC._proccessed.subst([profTimeMsg, __PROFILE.profileTime()]).decorateHTML(STR.IDENT),
		UI.fps
	]);
	this.setState(UPDATE_STATE.NORMAL,profBreef);
}


/*
checklist:

- update implicits on/off (foreign note with/no rights)
- update unit which id changed before callback (note created, [update], saved, [updateCB])

*/

this.respondN= function(_sign, _oldId, _id, _ver, _name, _style, _owner, _editor, _rights, _rightA, _inherit, _stamp){
//todo: MAKE normal deletion
	if (!_ver){

		//return delete success
		return true;
	}

	var unit= {
		ver: _ver,
		name: _name,
		style: _style,
		owner: _owner,
		editor: _editor,
		rights: _rights,
		rightA: _rightA.split(ASYGN.D_LIST),
		inherit: _inherit,
		stamp: new Date(new Date() -_stamp*1000)
	};

//todo: plug; remove after incrementals implemented
//????? watthis
if (!_oldId && _id>0 && Ncore(_id)) _oldId= _id;

	//use existing or CREATE appropriate. Board assumed to exist
	var ctxNote;
	if (_oldId)
	  ctxNote= new Ncore(_oldId); //only fetch
	else {
		if (_sign==ASYGN.NFULL)
		  ctxNote= new Note(_id);
		else
		  ctxNote= new Ncore(_id);
	}

	ctxNote.setId(_id); //resolve ID for found named request

	//set grabbed; _name,_ver,_style,_rights,_rightA,_inherit,_stamp,_owner; _in.ver=0 for deletion
//todo: Unit .set() should return VARIOUR errorcodes
	return ctxNote.set(unit);
}


this.respondD= function(_id, _ver, _root, _dtype, _content, _editor, _stamp, _place){
//todo: MAKE normal deletion
	if (!_ver){ //delete
		var curData= Ndata.all(_id);
		if (!curData) //deleted already
		  return true;
		return curData.kill()? true:false;
	}

	var unit= {
		ver: _ver,
		root: _root,
		dtype: _dtype,
		content: _content,
		editor: _editor,
		stamp: new Date(new Date() -_stamp*1000),
		place: _place.split(ASYGN.D_LIST)
	};

	var ctxNote= Ncore.all(unit.root);
	if (!ctxNote)
	  return false;

	if (unit.dtype==DATA_TYPE.TEXT)
	  unit.content= unit.content.base64_decode();

	return ctxNote.dataSet(_id, unit)? true:false;
}


this.respondU= function(_sign, _id, _ver, _uname, _relation, _groupId, _boardList, _contactsList){
//todo: MAKE normal deletion
	if (!_ver){

		//return delete success
		return true;
	}

	var unit= {
		ver: _ver,
		uname: _uname,
		relation: _relation,
		groupId: _groupId,
		boardList: _boardList.split(ASYGN.D_LIST),
		contactsList: _contactsList.split(ASYGN.D_LIST)
	}



	if (_sign == ASYGN.YOU && _id != SESSION.owner().id){ //YOU changed, relogon
//todo: proper user relogon reaction
		alert(DIC.errrUserOutdated);
		SESSION.reload(SESSION.reqWho, SESSION.reqWhat);
	}

	var curUser= new Ucore(_id);

	return curUser.set(unit);
}

this.pulse= TIMER_LENGTH.UPDATE_PULSE;
this.active= true;
this.HTTPReq= null;

this.updateState= UPDATE_STATE.NORMAL;
this.timeOut= null;

}
