UI.youW= new function(){

this.logout= function(){
	SESSION.logon.login(SESSION_STATES.LOGOUT);
};

//todo: feature: if staying after being logged in for a while, ask pass again 
this.stayLogged= function(_tryStay){
	var _this= this;
	if (_tryStay){ //confirm staying
		UI.popW.up(
			DIC.popStayConfirm
			,function(){SESSION.logon.login(SESSION_STATES.STAY)}
			,function(){_this.DOM.stay.checked= 0}
		);
	} else //instant off
	  SESSION.logon.login(SESSION_STATES.LEAVE);
};


//SESSION.owner().updated
this.draw= function(){
	var _owner= SESSION.owner();
	if (!_owner || !_owner.forRedraw)
	  return;

	this.DOM.self.elementText(_owner.uname);

	//contactsNum - off
//todo: move contact board to contact object

/*
//contactlist
	DOM//todo.contactsContent.innerHTML= "";

//todo: contactlist updated
//todo: library
	var cBlockIn= this.cListAddBlock(2,DIC.contWaitingYou);
	var cBlockOut= this.cListAddBlock(1,DIC.contYouWait);
	var cBlockNorm= this.cListAddBlock(0,DIC.contLab);

	if (cBlockIn.children.length>0)
	  DOM//todo.contactsContent.appendChild(cBlockIn);
	if (cBlockOut.children.length>0)
	  DOM//todo.contactsContent.appendChild(cBlockOut);
	if (cBlockNorm.children.length>0)
	  DOM//todo.contactsContent.appendChild(cBlockNorm);

	DOM//todo.notifyContactsLab.innerHTML= (cBlockNorm.children.length==0 ?"No" :cBlockNorm.children.length);
	DOM//todo.notifyContactReqsLab.innerHTML= (cBlockIn.children.length==0 ?"" :"+"+cBlockIn.children.length);
	DOM//todo.notifyContactReqsLab.style.display= (cBlockIn.children.length==0 ?"none" :"");

//todo: user's (hidden) boardlist updated
	var bs= DOM//todo.tempUserBoardsList;
	while (bs.childNodes.length>0)
	  bs.removeChild(bs.childNodes[0])
	for (var ib in _owner.boards){
		var bsItem= DOCUMENT.createElement("option");
		  bsItem.value= _owner.boards[ib].id;
		  bsItem.innerHTML= _owner.boards[ib].name;
		bs.appendChild(bsItem);
	}

*/

ALERT(PROFILE.BREEF, "You draw",'',1);
}

//draw contact Block
/*
UI.cListAddBlock= function(relation,blockName){
	var _owner= SESSION.owner();

	var _tmpBin= DOCUMENT.createElement("div");
	  _tmpBin.innerHTML= blockName;
	for (var iu in _owner.contacts){
		var addUser= _owner.contacts[iu];
		if (addUser.relation==relation){
			var _tmpe= _tmpBin.appendChild(DOCUMENT.createElement("div"));
			  _tmpe.className= "toolWidget"; //contactItemUser
			var _tmpx= _tmpe.appendChild(DOCUMENT.createElement("a"));
			  _tmpx.innerHTML= addUser.name+ (addUser.relation!=USER_RELATION.NORMAL ?"..." :"");
			  _tmpx.href= "/" +addUser.name;

			if (addUser.relation==USER_RELATION.NEUTRAL || addUser.relation==USER_RELATION.IN) {
				_tmpx= _tmpe.appendChild(DOCUMENT.createElement("span")); //
				  _tmpx.className= "knobAdd";
				  _tmpx.innerHTML= "+";
				  _tmpx.onclick= function(){contactMake(addUser.id,1)};
			}

			if (
				addUser.relation==USER_RELATION.NORMAL
				|| addUser.relation==USER_RELATION.IN
				|| addUser.relation==USER_RELATION.OUT
			){
				_tmpx= _tmpe.appendChild(DOCUMENT.createElement("span")); //
				  _tmpx.className= "knobDel";
				  _tmpx.innerHTML= "-";
				  _tmpx.onclick= function(){contactMake(addUser.id,-1)};
			}
		}
	}
	return _tmpBin;
}
*/

this.bindEvt= function(){
	var _this= this;
	this.DOM.out.onclick= function(e){
		_this.logout();
	};
	this.DOM.stay.onchange= function(){
		_this.stayLogged(this.checked);
	};
	this.DOM.stayLab.onclick= function(){
		_this.DOM.stay.click();
	};

//todo:
	//this.DOM.self.onClick=?
}


this.validateTimeout= null;


this.DOM= {
	bar: DOM('barUser'),

	self: DOM('barUserSelf'),
	out: DOM('youOut'),

	stay: DOM('youStay'),
	stayLab: DOM('youStayLab')
};

this.bindEvt();

}
