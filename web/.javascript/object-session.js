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
_cbOk:		normal callback
_cbErr:		error callback
_sync:		1 for blocked call
_binary:	send as binary
_headersA:	additional headers
*/
this.async= function(_saveMode, _saveData, _cbOk, _cbError, _sync, _binary, _headersA) {
	if (this.inAsync){
		this.asyncQueue.push(arguments);
		return;
	}
	if (!this.httpRequest && !this.asyncInit())
	  UI.popW.up(DIC.errrAsyncNA);

	this.inAsync= true;

	this.httpRequest.onreadystatechange = function(_e) {
		if (_e.target.readyState != 4)
		  return;

		if (_e.target.status == 200)
		  _cbOk(_e.target.responseText);
		else if (_cbError)
		  _cbError(_e.target.status, this.asyncStatusString(_e.target.status), _e.target.responseText);

		this.inAsync= false;

		if (this.asyncQueue.length)
		  this.async.apply(this,this.asyncQueue.shift());
	}.bind(this);

	this.httpRequest.open('POST', '/', !_sync)
	this.httpRequest.setRequestHeader('Content-type', _binary? 'application/x-binary; charset=x-user-defined' : 'application/x-www-form-urlencoded');
	this.httpRequest.setRequestHeader(ASYGN.MODE, _saveMode);
	for (var iH in _headersA)
	  this.httpRequest.setRequestHeader(_headersA[iH][0], _headersA[iH][1]);

	if (_binary)
	  this.httpRequest.sendAsBinary(_saveData);
	else{
		var saveData= [];
		for (var dName in _saveData)
		  saveData.push([dName,_saveData[dName]].join('='));

		this.httpRequest.send(saveData.join('&'));
	}

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

this.onWindowUnload= function(_e){
	_e= _e||WINDOW.event;

	SESSION.board.uiA[0].nFrontUI.saveBrowse();

//todo: catch update http err
	this.update.coreCycle(false);

	var lastSave= SESSION.save.saveGo(true);
	if (lastSave.status!=200){
//dic:
 		_e.returnValue= "Changes are NOT saved!";
		return _e.returnValue;
	}

	__PROFILE.close();
}

this.bindEvt= function(){
	WINDOW.onhashchange= this.onWindowHashChanged.bind(this);
	WINDOW.onbeforeunload= this.onWindowUnload.bind(this);
}


this.owner= function(_newid, _name){
	if (_newid===undefined)
	  return this.ownerId===null? undefined: Ucore(this.ownerId);

	var newUser= new Ucore(_newid)
	this.ownerId= newUser.id;
	newUser.set({uname:_name});
}

this.reqWho= '';
this.reqWhat= '';
this.reqFilter= '';
this.dbStamp= 0;

this.inAsync= false;
this.asyncQueue= [];
this.httpRequest= null;
//todo: make use of .updated in contacts and UI.update
//todo: ref; use objects, make .changed(obj) reactor
this.ownerId= null;
//todo: split to .boardObj and board(), as with .user
//todo: ref; use objects, make .changed(obj) reactor
this.board= null; //UI painting and interaction.

this.bindEvt();

}





if (IS.DnD){
	if (!XMLHttpRequest.prototype.sendAsBinary)
	  XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
		function byteValue(x) {
			return x.charCodeAt(0) & 0xff;
		}
		var ords = Array.prototype.map.call(datastr, byteValue);
		var ui8a = new Uint8Array(ords);
		this.send(ui8a.buffer);
	 }

	if (!File.prototype.slice){
		if (File.prototype.webkitSlice)
		  File.prototype.slice= File.prototype.webkitSlice;
		else if (File.prototype.mozSlice)
		  File.prototype.slice= File.prototype.mozSlice;
	}
}
