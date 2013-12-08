/*
Nota have following entity types, updated accordingly:
	1.	Board,
		Owner contact (breef, relation, boardlist),
		Notes, data:
			main cycle (adjustable 1-10s?)
	2.	//todo:make more clear this point
		User contact (breef, boardlist),
		Contactlist (contacts, breef, relations):
			logon/start,
			contactlist request,
			lazy cycle (1min?)
	todo:	Notes contacts breef:
			after updating board, only absent,
			lazy cycle

	
Main logics are:
	Core(main cycle)
	Logon
	Contacts
	BoardNav
	Notes

Support logics:
	+Popup
	+Log cookie
	Palette
	Timestamps
	Notifiers
	Uploads
	Pin
	Offline

---
Core logic.
 - Page is painted respecting userlogon related states
 - Globals are filled with <request> from URL/DB:
	- SESSION
	- BOARD
	- UI
 - Main cycle started:
	- Board requested
	- Update Notes
	- Update UI
*/




var SESSION= new function(){


////ASYNC
this.asyncStatusString= function(_code){
	var verbMsg= '';
	switch (_code){
		case 0: verbMsg= DIC.popStateVAsync0; break;
		case 500: verbMsg= DIC.popStateVAsync500; break;
	}
	return DIC.popStateVAsyncHead
	  +_code
	  +(verbMsg!=''? ' ('+ verbMsg +')' :'');
}

this.asyncInit= function(){
	this.httpRequest= null;

	if (WINDOW.XMLHttpRequest) { // Mozilla, Safari, ...
		this.httpRequest= new XMLHttpRequest();
		if (this.httpRequest.overrideMimeType)
		  this.httpRequest.overrideMimeType('text/plain');
	} else if (WINDOW.ActiveXObject) { // IE
		try {this.httpRequest= new ActiveXObject("Msxml2.XMLHTTP");}
		catch (e) {
			try {this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");}
			catch (e){return}
		}
	}

	return true;
}
/*
_saveMode:	request identifier; see ASYNC_MODE
_saveData:	Array of POST data passed; SHOULD REMAIN ARRAY TYPE DUE TO MINIFYING
_that:		caller context to call callbacks within
_cbOk:		normal callback
_cbErr:		error callback
*/
this.async= function(_saveMode,_saveData,_that,_cbOk,_cbError) {
	if (this.inAsync){
		this.asyncQueue.push(arguments);
		return;
	}
	if (!this.httpRequest && !this.asyncInit())
	  UI.popW.up(DIC.errrAsyncNA);

	this.inAsync= true;

	var _this= this;
	this.httpRequest.onreadystatechange = function() {
		if (this.readyState != 4)
		  return;

		if (this.status == 200)
		  _cbOk.call(_that, this.responseText);
		else if (_cbError)
		  _cbError.call(_that, _this.asyncStatusString(this.status), this.responseText);

		_this.inAsync= false;

		if (_this.asyncQueue.length)
		  _this.async.apply(_this,_this.asyncQueue.shift());
	};

	var saveData= [[ASYGN.MODE,_saveMode].join('=')];
	for (var dName in _saveData)
	  saveData.push([dName,_saveData[dName]].join('='));

	this.httpRequest.open('POST', '/', true)
	this.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	this.httpRequest.send(saveData.join('&'));
	return this.httpRequest;
}




////COOKIE

this.cookieSet= function(_inStr,_inName,_inTime){
	var time= _inTime ||AUTHORIZE.COOKIETIME;

	var cookStr= _inName+ '=';
	if (_inStr){
		cookStr+= encodeURI(_inStr);
		if (time){
			var exdate=new Date();
			exdate.setDate(exdate.getDate()+time);
			cookStr+= '; expires='+exdate.toUTCString();
		}
	}
	cookStr+= ';path=/'
	DOCUMENT.cookie= cookStr;
}

this.cookieGet= function(_inName) {
	var cA= DOCUMENT.cookie.split(';');
	for (var i=0;i < cA.length;i++) {
		var c = cA[i].trim();
		if (c.indexOf(_inName+'=') == 0)
		  return c.substr(_inName.length+1);
	}
	return '';
}

this.reload= IS.popurl?
  function(_user,_board){
	this.update.coreCycle(false);
//todo: and go on
  }
  : function(_user,_board){
	var newLoc= '/' +(
		!_user? ''
		: (_user +(
			!_board? ''
			: ('/' +_board)
		))
	);
	DOCUMENT.location= newLoc;
  }


this.onWindowHashChanged= function(){
    pAlert(WINDOW.location.hash);
}

//todo: catch update http err
//randdd= Math.random();

this.onWindowUnload= function(_e){
	_e= _e||WINDOW.event;

//todo: catch update http err
	this.update.coreCycle(false);

	__PROFILE.close();

/*
	if (BOARD.isChanged==1){
		if (e)
		  e.returnValue = DIC.warrBoardChanged;
		return DIC.warrBoardChanged;
	}

	for (var i in BOARD.notes)
	  if (BOARD.notes[i].isChanged || BOARD.notes[i].ndata[0].isChanged || BOARD.notes[i].isCChanged() || BOARD.notes[i].editMode()){
		if (e) {
			e.returnValue = DIC.warrNotesChanged;
			return;
		}
		return DIC.warrNotesChanged;
	  }
*/
}

this.bindEvt= function(){
	WINDOW.onhashchange= this.onWindowHashChanged.bind(this);
	WINDOW.onunload= this.onWindowUnload.bind(this);
}


this.owner= function(_newid, _name){
	if (_newid===undefined)
	  return this.ownerId===null? undefined: Ucore(this.ownerId);

	var newUser= new Ucore(_newid)
	this.ownerId= newUser.id;
	newUser.set(_name);
}

this.inAsync= false;
this.asyncQueue= [];
this.httpRequest= null;
//todo: make use of .updated in contacts and UI.update
this.ownerId= null;
//todo: split to .boardObj and board(), as with .user
this.board= null; //UI painting and interaction.

this.bindEvt();

}