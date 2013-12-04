UI.loginW= new function(){

//minimal validation, to unload server abit
this.validateUname= function(){
	var username= this.DOMUname.value.trim();
	if (username.length>1)
	  return username;
}

this.validatePass= function(){
	var password= this.DOMPass.value;
	if (password.length>0)
	  return password;
}

this.registerCheck= function(){
	this.DOMRegUName.elementText(this.DOMUname.value);
	this.DOMRegPass.value= '';
	var _this= this;
	UI.popW.up(this.DOMReg,
		function(){
			if (_this.DOMRegPass.value==_this.DOMPass.value)
			  _this.login(1);
			else
			  setTimeout(function(){UI.popW.up(DIC.errrPrePassMismatch)},0);
		},
		null,
		"regPass"
	);
}

this.login= function(_doRegister){
	var username= this.validateUname();
	if (!username){
		UI.popW.up(DIC.errrPreNoUsername);
		return;
	}
	var password= this.validatePass();
	if (!password){
		UI.popW.up(DIC.errrPreNoPassword);
		return;
	}
	SESSION.logon.login(
		_doRegister? SESSION_STATES.REGISTER : SESSION_STATES.LOGIN,
		username,
		password
	);
};

//this validate is called delayed for keypress, to have current field values
//server validate is actually called one per <time>
this.validateLogin= function(){
	if (this.validateTimeout!=undefined)
	  return;

	var _this= this;
	this.validateTimeout= setTimeout(function(){
		var username= _this.validateUname();
		var password= _this.validatePass();
		_this.DOMUnameCover.style.color= password? CSS.FIELD_REQUIRED_HILITE:'';
		_this.DOMPassCover.style.color= username? CSS.FIELD_REQUIRED_HILITE:'';
		_this.DOMSubmit.disabled= (!username || !password)? 'disabled':'';
		SESSION.logon.login(SESSION_STATES.VALIDATE,username);
		_this.validateTimeout= undefined;
	},TIMER_LENGTH.VALIDATE_DELAY);
};


this.bindEvt= function(){
	var _this= this;
	this.DOMForm.onsubmit= function(){
		_this.login();
		return false;
	};

	this.DOMUname.onkeypress= this.DOMUname.onkeyup= function(_e){
		_e= _e||WINDOW.event;
	 	_this.DOMUnameCover.style.display= (eKeyCode(_e)>=28 || this.value!='')? 'none' :'';

		_this.validateLogin();
	};
	this.DOMUnameCover.onclick= function(){_this.DOMUname.focus()};
	
	this.DOMPass.onkeypress= this.DOMPass.onkeyup= function(_e){
		_e= _e||WINDOW.event;
	 	_this.DOMPassCover.style.display= (eKeyCode(_e)>=28 || this.value!='')? 'none' :'';

		_this.validateLogin();
	};
	this.DOMPassCover.onclick= function(){_this.DOMPass.focus()};

	setTimeout(function(){_this.DOMUname.onkeypress(); _this.DOMPass.onkeypress();},TIMER_LENGTH.LOGPASS_FIX_DELAY);
}


////DOM
this.DOMBar= DOM('barLogon');
//
this.DOMForm= DOM('logForm');
this.DOMSubmit= DOM('logSubmit');
this.DOMUname= DOM('logUname');
this.DOMUnameCover= DOM('logUnameCover');
this.DOMPass= DOM('logPass');
this.DOMPassCover= DOM('logPassCover');
//
this.DOMReg= DOM('regTmpl');
this.DOMRegUName= DOM('regUname',this.DOMReg);
this.DOMRegPass= DOM('regPass',this.DOMReg);

this.bindEvt();

}
