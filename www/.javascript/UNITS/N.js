/*
	Ncore object.
	Performs Note+Ndata holding and saving.
	Ncore acts as Note core for several referers and holds mantainance of referers mechanics.
	Ncore thus shoudn't be called directly. Instead there's NUI object to be called or build other Notes from.

	Creation:
		Ncore is created with specified _id.
		If no _id supported, new blank Ncore created with unique negative id.
                Zero _id set 'implicit' and are replaced by normal auto-negative.

	Resulting negative id should be interpreted that Ncore is not linked (yet) to dbase.

	Ncore object is added to NOTES[_id] without override.


	Ncore stores array of UI's attached and provide methods using it.
*/

var Ncore= function(_id){
	var _this= this;

	if (!IS.instance(_this,Ncore) && !Ncore.all(_id)) //static call
	  return undefined;

	_id= _id |0;
//todo: check: id shouldn't be <0
	if (!_id) //get new auto-decrement id
	  _id= Ncore.newId--;


	var oldN= Ncore.all(_id);
	if (oldN) //reuse existing Ncore
	  return oldN;

	//Procceed New
ALERT(PROFILE.GENERAL,"Ncore new", 'id: ' +_id, 1);

	//Public shared container
	_this.PUB= {
		//dbase data
		id:			_id,
		ver:		CORE_VERSION.INIT,
		name:		'',
		style:		new Style(),
//todo: ref; use objects, make .changed(obj) reactor
		ownerId:	0,
//todo: ref; use objects, make .changed(obj) reactor
		editorId:	0,
		rights:		NOTA_RIGHTS.INIT,  //Substituted Notes remain INIT, virtually not RO.
		  rightsA:	[], //[gId]= [0=ro|1=add|2=rw]
//todo: ref; use objects, make .changed(obj) reactor
		inheritId:	NOTA_RIGHTS.INHERITED,
		stamp:		0,

		ndata:		[], //[id]= Ndata;

		//operating
		forRedraw: true,
		forSave: SAVE_STATES.IDLE,
		forSaveRts: SAVE_STATES.IDLE,
		saveCB: null
	};

	//Array of UI instances.
	//Each instance holds set of ndata UI instances as well
	//nData itself DONT hold its UI, but refers to by NCore->NUI->DUI(id)
	_this.uiA= [];

	Ncore.cache(_id, _this);
//todo: do also something with data Ndata additional storage properties
}


//todo: move out
Ncore.newId= -1;
////cache
/*
	global notes array.
	Positive indices holds normal and Subst Notes (referenced directly).
	Negative indices holds Imps and unsaved Notes, that also only have different rights (0|3). 
	Notes automatically set unsupplied id to negative (-1,-2,-3...)
*/	
Ncore.allNotes= [];
Ncore.cache= function(_id, _note){
//todo: should reuse instead of deleting
	if (Ncore.allNotes[_id]) //wipe duplicating Ncore
	  Ncore.allNotes[_id].kill();
	Ncore.allNotes[_id]= _note;
}
Ncore.uncache= function(_id){
	delete Ncore.allNotes[_id];
}
//todo: return filtered sets (unsaved, undrawed etc)
//todo: handle and return UnitLink
Ncore.all= function(_id, _filter){
	if (arguments.length==0)
	  return Ncore.allNotes;

	for (var iN in Ncore.allNotes){
		var curNote= Ncore.allNotes[iN];
		if (curNote.PUB.id==_id)
		  return curNote;
	}
}
/////-cache



/*
	Public destructor, holds global list
	Called to wipe out all Note referers
*/
Ncore.prototype.kill= function(){
	for (var ir in this.uiA)
	  if (this.uiA[ir]){
		this.uiA[ir].doKill();
		this.uiA[ir]= undefined; //unlink here instead of calling multiple unlink()
	  }
	Ncore.uncache(this.PUB.id);
}



/*
	!!!transparent functions (from ui)
*/

//change .id
//replaces existing Ncore.all[_id]
//todo: meke sure killing existing Ncore.all[_id] will not make garbage
Ncore.prototype.setId= function(_id){
	if (!_id || _id==this.PUB.id)
	  return;

ALERT(PROFILE.BREEF, "Ncore "+ this.PUB.id +' re-id ', 'id: '+ _id);

	Ncore.uncache(this.PUB.id);

	_id= _id |0;
	this.PUB.id= _id; //change id of provided Ncore

	Ncore.cache(_id, this);
}

/*
	Incoming set

	_rightsA is supplied only for owner as array or "group=[right]" strings and is parsed into existing rights group.
*/
Ncore.prototype.set= function(_setA){ //{name: , ver: , style: , rights: , rightsA: , inherit: , stamp: , owner: , editor: }
	if (this.PUB.forSave!= SAVE_STATES.IDLE) //unsaved
	  return false;

	if (
		this.PUB.id<=0 //subst notes
		|| (_setA.ver |0)>this.PUB.ver
		|| (_setA.rights |0)!=this.PUB.rights
		|| (_setA.inherit |0)!=this.PUB.inheritId
	){ //validated
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
	
	return true;
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
Ncore.prototype.save= function(_vals, _okCB, _immediate){
//todo: use .set()

	if (IS.fn(_okCB))
	  this.saveCB= _okCB;

	if (!Object.keys(_vals).length)
	  return;

	if (_vals.rights)
	  this.PUB.rightsA[_vals.rights.group]= _vals.rights.right;

	if (_vals.style)
	  this.PUB.style= _vals.style;

	if (_vals.name)
	  this.PUB.name= _vals.name;

	if (_vals.inherit!=this.PUB.inheritId && this.PUB.ver==CORE_VERSION.INIT)
	  this.PUB.inheritId= _vals.inherit |0;


//todo: dedicate rights
	if (_vals.rights)
	  this.PUB.forSaveRts= SAVE_STATES.READY;
	if (_vals.style || _vals.name || _vals.inherit){
		this.PUB.editorId= SESSION.owner().id;
		this.PUB.stamp= new Date();
		this.PUB.forSave= SAVE_STATES.READY;

		this.PUB.forRedraw= true;
	}


	if (_immediate)
	  SESSION.save.saveGo();
	else
	  SESSION.save.save();
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
	  SAVE_STATES.IDLE;

	if (this.saveCB)
	  this.saveCB(_res);
	this.saveCB= null;

	this.uiSaved();
}


//todo: check for being edited
Ncore.prototype.canSave= function(_enum){
	var curState= this.PUB.forSave;
	if (_enum && curState==SAVE_STATES.READY)
		this.PUB.forSave= SAVE_STATES.HOLD;
	return(curState);
}

Ncore.prototype.canSaveRts= function(_enum){
	var curState= this.PUB.forSaveRts;
	if (_enum && curState==SAVE_STATES.READY)
		this.PUB.forSaveRts= SAVE_STATES.HOLD;
	return(curState);
}

//todo: make ndata a collection object
Ncore.prototype.dataSet= function(_id, _setA){ //{ver: , dtype: , content: , editor: , stamp: , place: }
//todo: Data core should be same as Note core
	_id= _id |0;
//todo: check: id shouldn't be <0
	if (!_id) //get new auto-decrement id
	  _id= Ndata.newId--;

	var curData= this.PUB.ndata[_id];
	if (!curData)
	  curData= this.PUB.ndata[_id]= new Ndata(this,_id);

	return curData.set(_setA)? curData :false;
}

Ncore.prototype.dataForSave= function(_enum){
	var outDataA= [];
	for (var d in this.PUB.ndata)
	  if (this.PUB.ndata[d].canSave(_enum)==SAVE_STATES.READY)
	  	outDataA.push(this.PUB.ndata[d]);

	return outDataA;
}



//ui

Ncore.prototype.uiLink= function(_ui){
	if (!_ui)
	  return;
	var flag= 0;
	for (var ir in this.uiA) //check for existing
	  if (this.uiA[ir]==_ui){
		flag= 1;
		break;
	  }
else console.log('trying to link multiple UI');

	if (!flag)
	  this.uiA.push(_ui);

if (this.uiA.length!=1) ALERT(PROFILE.VERBOSE,'instances for ' +this.PUB.id +':', this.uiA.length);
}


Ncore.prototype.uiUnlink= function(_ui){
	var flag= 0;
	for (var ir in this.uiA){ //seek and destroy
		if (this.uiA[ir]==_ui)
		  this.uiA[ir]= undefined;
		if (this.uiA[ir]!=undefined)
		  flag= 1;
	}
	if (!flag) //cleanup Ncore itself
	  Ncore.uncache(this.PUB.id);
}


Ncore.prototype.uiSaved= function(){
	for (var ir in this.uiA)
	  if (this.uiA[ir])
		this.uiA[ir].doSaved();
}

/*macro:

	get UI for _parentUI
	  create if none
	draw children within UI
	draw (correct) UI
*/
//_parentUI provides parent data UI of TRUE for topmost (board)
Ncore.prototype.draw= function(_parentUI){
	if (!_parentUI)
	  return;

	var thisUI= false;
	for (var ir in this.uiA)
	  if (this.uiA[ir].parentUI == _parentUI){
	  	thisUI= this.uiA[ir];
	  	break;
	  }

	if (!thisUI){ //must create
		var uiLevel= _parentUI===true? 1:(_parentUI.level+1);

		switch (uiLevel) {
			case 1:
//todo: change to NUI(); remove NUI_* derived classes
				thisUI= new NUI_board(this, UI.DOM.workField);
				break;
			case 2:
				thisUI= new NUI_note(this, _parentUI.DOM.context);
		}
		this.uiLink(thisUI);

		thisUI.parentUI= _parentUI;
		thisUI.level= uiLevel;
	}


//todo: define limit
	if (thisUI.level <= 2){
		//update Data at its own condition
		var curDI= 1;
		var dataDrawed= false;
		for(var iD in this.PUB.ndata){
			var cData= this.PUB.ndata[iD];

			dataDrawed= dataDrawed || cData.forRedraw;
			if (cData.draw(thisUI, thisUI.level==1?curDI:0)) //only toplevel should bind sequentaly delayed
			  curDI++;
		}
	}
	else console.log('stop!');


	var success= true;
	if (dataDrawed || this.PUB.forRedraw)
	  success= thisUI.doDraw();
		
	this.PUB.forRedraw= !success;
}




//////////////////////////////


/*
	Root Note UI container

	NUI should be called only within NUI_<instance> construction.

	*No explicit NoteUi-DataUi link is used,
	 while everithing is redrawed from root
*/
var NUI= function(_rootN){
	this.Ncore= _rootN;

//todo: get rid
	this.PUB= this.Ncore.PUB;

	this.nFrontUI= {};
	this.level= 0;
	this.parentUI= false; //will be TRUE for topmost (board)
	//Each Note UI instance holds its Data instances referenced by ID.
	//Mantaining changing ID's (e.g. while first saving)
	// is propagated from Ncore and is called from Data:
	//<Data>.parent.setUiId(newId)
	this.dUI= [];
}

/*
	Public functions.
*/
NUI.prototype.kill= function(){
	this.Ncore.uiUnlink(this);
	this.doKill();
}

NUI.prototype.doKill= function(){
	this.nFrontUI.kill && this.nFrontUI.kill();
}


/*
	!!!private functions
*/

//Should be leaved blank at NUI to be safely overriden
NUI.prototype.doDraw= function(){
	if (!this.PUB.forRedraw)
	  return;

ALERT(PROFILE.BREEF, "NUI "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
}
