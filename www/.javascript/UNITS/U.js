/*
	User object.
	_id must be provided anyway.
	Ucore object is added to Ucore.all[_id] without overwrite.
	If duplicated, existing Ucore is updated and returned.
*/

var /**
 * @return {undefined}
 */
	Ucore= function(_id){
	var _this= this;

//todo: decide what to return instead of undefined to be adequate
	if (!(_this instanceof Ucore) && !Ucore.all[_id]) //static call
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
	_this.boardIds= undefined; //for logged user and board owner.
	_this.contactIds= undefined; //contactlist, basically for logged user.

	//operating
	_this.complete= 0; //all base data is filled
	_this.forRedraw= 0;
	_this.forRedrawBoards= 0;
	_this.forRedrawContacts= 0;
	_this.forSave= 0;

	Ucore.all[_id]= _this;
ALERT(PROFILE.GENERAL, "Nuser new", 'id: ' +_id, 1);
}

Ucore.all= []; //global users array

//destructor, holds global list
Ucore.prototype.kill= function(){
	delete Ucore.all[this.id];
}


//incoming update
Ucore.prototype.set= function(_uname,_ver,_relation,_groupId,_bList,_cList){
	this.complete= this.complete || (arguments.length==6); //initial suggestion

	if (_groupId!=undefined)
	  this.groupId= _groupId;
	if (_relation!=undefined)
	  this.relation= _relation;
	if (_ver!=undefined)
	  this.ver= _ver;
	if (_uname!=undefined)
	  this.uname= _uname;
	if (_bList!=undefined && _bList!=this.boardIds){
		this.boardIds= _bList;
		this.forRedrawBoards= 1;
	}
	if (_cList!=undefined && _cList!=this.contactIds){
		this.contactIds= _cList;
		this.forRedrawContacts= 1;
	}

	this.forRedraw= this.forRedraw || (arguments.length>0);
//todo: update sets redraw to 0

ALERT(PROFILE.BREEF,
	 "Nuser "+ this.id +" set ",
	  'ver: ' +this.ver +'; '
	  +'name: ' +this.uname +'; '
	  +'rel: ' +this.relation +'; '
	  +'group: ' +this.groupId +'; '
	  +'boards: ' +this.boardIds +'; '
	  +'contacts: ' +this.contactIds +'; '
);
}


Ucore.prototype.boards= function(){
	if (!this.boardIds || !this.boardIds.length)
	  return [];
	
	var outBoards= [];
	var curN;
	for (var bId in this.boardIds)
	  if (curN= Ncore(this.boardIds[bId]))
	    outBoards[bId]= curN;
	return outBoards;
}


Ucore.prototype.contacts= function(){
	if (!this.contactIds || !this.contactIds.length)
	  return [];
	
	var outContacts= [];
	var curU;
	for (var cId in this.contactIds)
	  if (curU= Ucore(this.contactIds[cId]))
	    outContacts[cId]= curU;
	return outContacts;
}
