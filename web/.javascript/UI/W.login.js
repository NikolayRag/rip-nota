UI.loginW= new function(){

//minimal validation, to unload server abit
this.validateUname= function(){
	var username= this.DOM.uname.value.trim();
	if (username.length>1)
	  return username;
}

this.validatePass= function(){
	var password= this.DOM.pass.value;
	if (password.length>0)
	  return password;
}

this.registerCheck= function(){
	this.DOM.regUName.elementText(this.DOM.uname.value);
	this.DOM.regPass.value= '';
	var _this= this;
	UI.popW.up(this.DOM.reg,
		function(){
			if (_this.DOM.regPass.value==_this.DOM.pass.value)
			  _this.login(true);
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
		_this.DOM.unameCover.style.color= password? CSS.FIELD_REQUIRED_HILITE:'';
		_this.DOM.passCover.style.color= username? CSS.FIELD_REQUIRED_HILITE:'';
		_this.DOM.submit.disabled= (!username || !password)? 'disabled':'';
		SESSION.logon.login(SESSION_STATES.VALIDATE,username);
		_this.validateTimeout= undefined;
	},TIMER_LENGTH.VALIDATE_DELAY);
};


this.bindEvt= function(){
	var _this= this;
	this.DOM.form.onsubmit= function(){
		_this.login();
		return false;
	};

	this.DOM.uname.onkeypress= this.DOM.uname.onkeyup= function(_e){
	 	_this.DOM.unameCover.style.display= (eKeyCode(_e)>=28 || this.value!='')? 'none' :'';

		_this.validateLogin();
	};
	this.DOM.unameCover.onclick= function(){_this.DOM.uname.focus()};
	
	this.DOM.pass.onkeypress= this.DOM.pass.onkeyup= function(_e){
	 	_this.DOM.passCover.style.display= (eKeyCode(_e)>=28 || this.value!='')? 'none' :'';

		_this.validateLogin();
	};
	this.DOM.passCover.onclick= function(){_this.DOM.pass.focus()};

	setTimeout(function(){_this.DOM.uname.onkeypress(); _this.DOM.pass.onkeypress();},TIMER_LENGTH.LOGPASS_FIX_DELAY);
}


////DOM
this.DOM= {
	bar: DOM('barLogon'),

	form: DOM('logForm'),
	submit: DOM('logSubmit'),
	uname: DOM('logUname'),
	unameCover: DOM('logUnameCover'),
	pass: DOM('logPass'),
	passCover: DOM('logPassCover'),

	reg: DOM('regTmpl')
};

this.DOM.regUName= DOM('regUname', this.DOM.reg);
this.DOM.regPass= DOM('regPass', this.DOM.reg);

this.bindEvt();

}
