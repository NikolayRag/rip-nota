/*
	Holds login, logout, register, validation

*/
SESSION.logon= new function(){


this.login= function(_mode,_username,_password) {
	var saveData= [];
	saveData['logMode']= _mode || SESSION_STATES.NONE;
	var asyncMode= ASYNC_MODE.LOGON;
	switch (_mode) {
		case SESSION_STATES.LEAVE:
			SESSION.cookieSet(null,AUTHORIZE.COOKIENAME);
			return;
		case SESSION_STATES.REGISTER:
		case SESSION_STATES.LOGIN:
			saveData['password']= _password;
		case SESSION_STATES.VALIDATE:
			if (!_username){
				this.loginCB(''+_mode+';');
				return;
			}
			saveData['username']= _username;
			if (_mode==SESSION_STATES.VALIDATE){
				asyncMode= ASYNC_MODE.LOGVALIDATE;
				break;
			}
		case SESSION_STATES.LOGOUT:
			SESSION.update.coreCycle(false);
	}
	SESSION.async(asyncMode, saveData, this.loginCB, function(_code, _err,_txt){
ALERT(PROFILE.GENERAL, 'Login error: ' +saveData, _err +': ' +_txt);
//todo: expand
		console.log('Login error: ' +_err +': ' +_txt);
		UI.popW.up('Login server unavailable');
	}.bind(this));
};



//------Callback

//logCookie logic:
//	- login without cookie request from server
//	- request session cookie only by toggling STAY switch while logged
//	- logout deletes cookie anyway
//todo: long term: make unreloadable login/register/logout
this.loginCB= function(_res){
	var resA= _res.split(ASYGN.D_ITEM);
	var responce= resA[1];
	var fReg= 0;
	switch (resA[0] |0) {
		case SESSION_STATES.VALIDATE:
			UI.loginW.DOM.submit.value= (responce==1) ?DIC.labLogIn :DIC.labLogRegister;
			return;
		case SESSION_STATES.STAY:
			UI.youW.DOM.stayLab.flash(CSS.GREENLIGHT);
			SESSION.cookieSet(responce,AUTHORIZE.COOKIENAME);
			return;
		case SESSION_STATES.LOGOUT:
			SESSION.cookieSet(null,AUTHORIZE.COOKIENAME);
			SESSION.reload();
			return;
		case SESSION_STATES.REGISTER:
			fReg= 1;
		case SESSION_STATES.LOGIN:
			if (responce==SESSION_STATES.PROCCEED_REGISTER){
				UI.loginW.registerCheck();
				return;
			}
			if (!responce || responce==''){ //no errors, logged in/out
				if (fReg)
				  SESSION.reload();
				else
				  SESSION.reload(SESSION.reqWho, SESSION.reqWhat);
			} else {
				var logErrsA= [
					DIC.logErrRegister,
					DIC.logErrChange,
					DIC.logErrActivate,
					DIC.logErrRestore,
					DIC.logErrRepass,
					DIC.logErrCookie,
					DIC.logErrProvided,
					DIC.logErrActivated,
					DIC.logErrDeactivated,
					DIC.logErrBadpass,
					DIC.logErrHash,
					DIC.logErrConfirm,
					DIC.logErrSave,
					DIC.logErrReset,
					DIC.logErrUnregistered
				];
				UI.popW.up((parseInt(responce)>0)?logErrsA[responce-1]:responce);
			}
	}
}.bind(this);


}
