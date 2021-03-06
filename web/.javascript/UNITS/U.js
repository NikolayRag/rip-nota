/*
	User object.
	_id must be provided anyway.
	Ucore object is added to Ucore.all[_id] without overwrite.
	If duplicated, existing Ucore is updated and returned.
*/

var Ucore= function(_id){
	var _this= this;

//todo: decide what to return instead of undefined to be adequate
	if (!IS.instance(_this,Ucore) && !Ucore.all[_id]) //static call
	  return undefined;

//todo: decide what to return instead of undefined to be adequate
//todo:	error handling
	if (!arguments.length || !(_id>=0))
	  return undefined;

	if (Ucore.all[_id]) //reuse
	  return Ucore.all[_id];

	//Procceed New

	//dbase data
	_this.id= _id;
	_this.ver= CORE_VERSION.INIT;
	_this.uname= '';
	_this.relation= USER_RELATION.UNAVAILABLE;
	_this.groupId= 0; //relative to You
//todo: ref; use objects, make .changed(obj) reactor
	_this.boardIds= []; //for logged user and board owner.
//todo: ref; use objects, make .changed(obj) reactor
	_this.contactIds= []; //contactlist, basically for logged user.

	//operating
	_this.forRedraw= 0;
	_this.forRedrawBoards= 0;
	_this.forRedrawContacts= 0;
	_this.forSave= SAVE_STATES.IDLE;

	Ucore.all[_id]= _this;
ALERT(PROFILE.GENERAL, "Nuser new", 'id: ' +_id, 1);
}

Ucore.all= []; //global users array

//destructor, holds global list
Ucore.prototype.kill= function(){
	delete Ucore.all[this.id];
}


//incoming update
Ucore.prototype.set= function(_setA){ //{groupId: , relation: , ver: , uname: , bList: , cList: }
	if (this.forSave!= SAVE_STATES.IDLE) //unsaved
	  return false;

	if (
		(_setA.ver |0)>this.ver
	){ //validated
//todo: maybe change to comparing with key existance, not to being undefined
		if (_setA.groupId!=undefined)
		  this.groupId= _setA.groupId;
		if (_setA.relation!=undefined)
		  this.relation= _setA.relation;
		if (_setA.ver!=undefined)
		  this.ver= _setA.ver;
		if (_setA.uname!=undefined)
		  this.uname= _setA.uname;
		if (_setA.boardList!=undefined && _setA.boardList!=this.boardIds){
			this.boardIds= _setA.boardList;
			this.forRedrawBoards= 1;
		}
		if (_setA.contactsList!=undefined && _setA.contactsList!=this.contactIds){
			this.contactIds= _setA.contactsList;
			this.forRedrawContacts= 1;
		}

		this.forRedraw= this.forRedraw || (Object.keys(_setA).length>0);
//todo: update sets redraw to 0

ALERT(PROFILE.BREEF, "Nuser "+ this.id +" set ", 'ver: ' +this.ver +'; ' +'name: ' +this.uname +'; ' +'rel: ' +this.relation +'; ' +'group: ' +this.groupId +'; ' +'boards: ' +this.boardIds +'; ' +'contacts: ' +this.contactIds +'; ');
	}
	
	return true;
}


Ucore.prototype.boards= function(){
	var outBoards= [];
	var curN;
	for (var bId in this.boardIds)
	  if (curN= Ncore(this.boardIds[bId]))
	    outBoards[bId]= curN;
	return outBoards;
}


Ucore.prototype.contacts= function(){
	var outContacts= [];
	var curU;
	for (var cId in this.contactIds)
	  if (curU= Ucore(this.contactIds[cId]))
	    outContacts[cId]= curU;
	return outContacts;
}
