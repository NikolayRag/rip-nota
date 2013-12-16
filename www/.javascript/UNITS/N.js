/*
	Ncore object.
	Performs Note+Ndata holding and saving.
	Ncore acts as Note core for several referers and holds mantainance of referers mechanics.
	Ncore thus shoudn't be called directly. Instead there's Nroot object to be called or build other Notes from.

	Creation:
		Ncore is created with specified _id.
		If no _id supported, new blank Ncore created with unique negative id.
                Zero _id set 'implicit' and are replaced by normal auto-negative.

	Resulting negative id should be interpreted that Ncore is not linked (yet) to dbase.

	Ncore object is added to NOTES[_id] without override.


	Inheritants:
	To inherit Ncore, inheritant must:
		- transparently hold local public variables as references ([0])
		- transparently support core public methods with same arguments and with call to originals
		- at creation:
			- request/create Ncore
			- Link itself to Ncore referers list by calling Ncore.link()
		- unlink itself from Ncore at deletion by calling Ncore.unlink()
			

*/

var Ncore= function(_id,_referer){
	var _this= this;

	if (!(_this instanceof Ncore) && !Ncore.all[_id]) //static call
	  return undefined;

	_id= _id |0;
	if (!_id) //get new auto-decrement id
	  _id= Ncore.newId--;


	var oldN= Ncore.all[_id];
	if (oldN){ //reuse existing Ncore
		oldN.link(_referer);
		return oldN;
	}

	//Procceed New
ALERT(PROFILE.GENERAL,"Ncore new", 'id: ' +_id, 1);

	//Public shared container
	_this.PUB= {
		//dbase data
		id:			_id,
		ver:		CORE_VERSION.INIT,
		name:		'',
		style:		'',
		ownerId:	0,
		editorId:	0,
		rights:		NOTA_RIGHTS.INIT,  //Substituted Notes remain INIT, virtually not RO.
		  rightsA:	[], //[gId]= [0=ro|1=add|2=rw]
		inheritId:	NOTA_RIGHTS.INHERITED,
		stamp:		0,

		ndata:		[], //[id]= Ndata;

		//operating
		complete: 0,
		forRedraw: 0,
		forSave: 0,
		forSaveRts: 0,
		saveCB: null
	};

	//private
	_this.referers= []; //all who refers to this ncore

	Ncore.all[_id]= _this;
//todo: do also something with data Ndata additional storage properties
	_this.link(_referer);
}


////static

Ncore.newId= -1;

/*
	global notes array.
	Positive indices holds normal and Subst Notes.
	Negative indices holds Imps and unsaved Notes, that also only have different rights (0|3). 
	Notes automatically set unsupplied id to negative-1 (-1,-2,-3...)
*/	
Ncore.all= [];

/*
	Public destructor, holds global list
	Called to wipe out all Note referers
*/
Ncore.prototype.kill= function(){
	for (var ir in this.referers)
	  if (this.referers[ir]){
		this.referers[ir].doKill();
		this.referers[ir]= undefined; //unlink here instead of calling multiple unlink()
	  }
	this.doKill();
}


/*
	local destructor
	Mantain global Ncore.all list
*/
Ncore.prototype.doKill= function(){
	delete Ncore.all[this.PUB.id];
}


Ncore.prototype.link= function(_ref){
	if (!_ref)
	  return;
	var flag= 0;
	for (var ir in this.referers) //check for existing
	  if (this.referers[ir]==_ref){
		flag= 1;
		break;
	  }
	if (!flag)
	  this.referers.push(_ref);
if (this.referers.length!=1) ALERT(PROFILE.VERBOSE,'instances for ' +this.PUB.id +':', this.referers.length);
}


Ncore.prototype.unlink= function(_ref){
	var flag= 0;
	for (var ir in this.referers){ //seek and destroy
		if (this.referers[ir]==_ref)
		  this.referers[ir]= undefined;
		if (this.referers[ir]!=undefined)
		  flag= 1;
	}
	if (!flag) //cleanup Ncore itself
	  this.doKill();
}


/*
	!!!transparent functions
*/

//change .id
//replaces existing Ncore.all[_id]
//todo: meke sure killing existing Ncore.all[_id] will not make garbage
Ncore.prototype.setId= function(_id){
	if (!_id || _id==this.PUB.id)
	  return;

ALERT(PROFILE.BREEF, "Ncore "+ this.PUB.id +' re-id ', 'id: '+ _id);

	this.doKill();

	_id= _id |0;
	this.PUB.id= _id; //change id of provided Ncore

//todo: should reuse instead of deleting
	if (Ncore.all[_id]) //wipe duplicating Ncore
	  Ncore.all[_id].kill();
	Ncore.all[_id]= this; //fill in existent Ncore
}

/*
	Incoming set

	_rightsA is supplied only for owner as array or "group=[right]" strings and is parsed into existing rights group.
*/
Ncore.prototype.set= function(_setA){ //{name: , ver: , style: , rights: , rightsA: , inherit: , stamp: , owner: , editor: }
	if ((_setA.ver |0)<=this.PUB.ver) //inconsistent
	  return;

	this.PUB.complete= this.PUB.complete || (Object.keys(_setA).length==9); //initial suggestion

	if (_setA.name!=undefined)
	  this.PUB.name= _setA.name;
	if (_setA.ver!=undefined)
	  this.PUB.ver= _setA.ver |0;
	if (_setA.style!=undefined)
	  this.PUB.style= new Style(_setA.style);
	if (_setA.inherit!=undefined)
	  this.PUB.inheritId= _setA.inherit |0;
	if (_setA.stamp!=undefined)
	  this.PUB.stamp= _setA.stamp;
	if (_setA.owner!=undefined)
	  this.PUB.ownerId= _setA.owner |0;
	if (_setA.editor!=undefined)
	  this.PUB.editorId= _setA.editor |0;

	if (_setA.rights!=undefined)
	  this.PUB.rights= this.PUB.inheritId==NOTA_RIGHTS.INHERITED? NOTA_RIGHTS.INIT : (_setA.rights |0);
//fix: _setA.rightsA!='' due to getting here '' instead of []
	if (_setA.rightsA!=undefined && _setA.rightsA!='')
	  for (var rt in _setA.rightsA){
		var rtA= _setA.rightsA[rt].split("=");
		this.PUB.rightsA[rtA[0] |0]= rtA[1]!=''? (rtA[1] |0) : undefined;
	  }

if (!this.PUB.forRedraw) ALERT(PROFILE.BREEF, "Ncore "+ this.PUB.id +"("+ this.PUB.inheritId +") set ", 'ver: ' +_setA.ver);
	  
	this.PUB.forRedraw= this.PUB.forRedraw || (Object.keys(_setA).length>0);
}


Ncore.prototype.draw= function(_force){
	for (var ir in this.referers)
	  if (this.referers[ir])
		this.referers[ir].doDraw(_force);
		
	this.PUB.forRedraw= 0;
}


Ncore.prototype.owner= function(){
	return Ucore(this.PUB.ownerId);
}

Ncore.prototype.editor= function(){
	return Ucore(this.PUB.editorId);
}

Ncore.prototype.inherit= function(){
	if (this.PUB.inheritId>0)
	  return Ncore(this.PUB.inheritId);
}

//todo: mantain list of .forSave==1 notes
Ncore.prototype.save= function(_vals, _immediate, _okCB){
	if (IS.fn(_okCB))
	  this.saveCB= _okCB;

	if (!Object.keys(_vals).length)
	  return;

	if (_vals.rights){
		this.PUB.rightsA[_vals.rights.group]= _vals.rights.right;
		this.PUB.forSaveRts= SAVE_STATES.UNSAVED;
	}

	if (_vals.style)
	  this.PUB.style= _vals.style;

	if (_vals.name)
	  this.PUB.name= _vals.name;

	if (_vals.style || _vals.name){
		this.PUB.editorId= SESSION.owner().id;
		this.PUB.stamp= new Date();
		this.PUB.forSave= SAVE_STATES.UNSAVED;

		this.draw(1);
	}

	for (var ir in this.referers)
	  if (this.referers[ir])
		this.referers[ir].doSaved();

	SESSION.save.save(_immediate);
}

Ncore.prototype.saved= function(_res){
	if (this.PUB.ver==CORE_VERSION.INIT){ //CREATED
		this.PUB.ver= 1;
		this.PUB.ownerId= SESSION.owner().id;
		this.PUB.rights= NOTA_RIGHTS.OWN;
		this.setId(_res);
	} else
	  this.PUB.ver= _res;

//todo: hold case when Ncore is changed to save WHILE IN save
	this.PUB.forSave=
	  this.PUB.forSaveRts=
	  0;

	if (this.saveCB)
	  this.saveCB(_res);
	this.saveCB= null;

	SESSION.board.draw();
	for (var ir in this.referers)
	  if (this.referers[ir])
		this.referers[ir].doSaved();
}


//todo: check for being edited
Ncore.prototype.canSave= function(){
	return(this.PUB.forSave*SAVE_MODE.MAIN | this.PUB.forSaveRts*SAVE_MODE.RIGHTS);
}


//todo: make ndata a collection object
Ncore.prototype.dataSet= function(_id, _setA){ //{ver: , dtype: , content: , editor: , stamp: , place: }
//todo: Data core should be same as Note core
	_id= _id |0;
	if (!_id) //get new auto-decrement id
	  _id= Ndata.newId--;

	var curData= this.PUB.ndata[_id];
	if (!curData)
	  curData= this.PUB.ndata[_id]= new Ndata(this,_id);

	if (_setA.ver<=curData.ver) //inconsistent
	  return;

	curData.set(_setA);

	return curData;
}

//fetch Data that refers specified Note(_id)
//check: for multi-ref
Ncore.prototype.dataContext= function(_id){
	for (var iD in this.PUB.ndata){
		var testData= this.PUB.ndata[iD];
		if (testData.dtype==DATA_TYPE.NOTE && testData.content==_id)
		  return testData;
	}
}

Ncore.prototype.dataForSave= function(){
	var outDataA= [];
	for (var d in this.PUB.ndata)
	  if (this.PUB.ndata[d].canSave())
	  	outDataA.push(this.PUB.ndata[d]);

	return outDataA;
}







//////////////////////////////
//todo: decide to use this class at all


/*
	Root Note container instance without ui
*/
var Nroot= function(_id){
	var _this= this;

	_this.Ncore= new Ncore(_id,_this);

	_this.PUB= _this.Ncore.PUB;
}

/*
	!!!transparent public functions
*/
Nroot.prototype.set= function(_setA){
	return this.Ncore.set(_setA);
}

Nroot.prototype.setId= function(_id){
	return this.Ncore.setId(_id);
}

Nroot.prototype.draw= function(_force){
	return this.Ncore.draw(_force);
}

Nroot.prototype.owner= function(){
	return this.Ncore.owner();
}

Nroot.prototype.editor= function(){
	return this.Ncore.editor();
}

Nroot.prototype.inherit= function(){
	return this.Ncore.inherit();
}

Nroot.prototype.save= function(_val){
	return this.Ncore.save(_val);
}


Nroot.prototype.dataSet= function(_id, _setA){
	return this.Ncore.dataSet(_id, _setA);
}
Nroot.prototype.dataContext= function(_id){
	return this.Ncore.dataContext(_id);
}


/*
	Public functions.
*/
Nroot.prototype.kill= function(){
	this.Ncore.unlink(this);
	this.doKill();
}


/*
	!!!private functions
*/

//Should be leaved blank at Nroot to be safely overriden
Nroot.prototype.doDraw= function(){
	if (!this.PUB.forRedraw)
	  return;

ALERT(PROFILE.BREEF, "Nroot "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
}

Nroot.prototype.doKill= function(){
}
