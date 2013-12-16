//todo: make parent Unit class for all units to mantain flat lists;
//		Maybe ((Ncore<-Nroot) + Ndata + Ucore) turn to (Unit<-(Nroot+Ndata+Ucore))

/*
	Data atom for notes.
	One Data belongs exactly to one Note, so there's no existence check logic
*/
var Ndata= function(_root,_id)
{
	var _this= this;

	_this.id= _id;
	_this.ver= CORE_VERSION.INIT;
	_this.place= {x:null,y:null,w:null,h:null};
	_this.dtype= null;
	_this.content= null;
	_this.editorId= null;
	_this.stamp= null;

	_this.rootNote= _root;
	_this.ui= null;
	_this.forRedraw= 0;
	_this.forSave= 0;

ALERT(PROFILE.BREEF,"Data new", 'id: ' +_id);
}

Ndata.newId= -1;

//spike: replace with all[] later; Bruteforce is evil
Ndata.all= function(_id){
	for (var iN in Ncore.all){
		var allD= Ncore.all[iN].PUB.ndata;
		for (var iD in allD)
		  if (allD[iD].id==_id)
		    return allD[iD];
	}
}

Ndata.prototype.set= function(_setA){ //{ver: , dtype: , content: , editor: , stamp: , place: }
 	if (_setA.ver!=undefined)
	  this.ver= _setA.ver |0;
	if (_setA.dtype!=undefined)
	  this.dtype= _setA.dtype |0;
	if (_setA.content!=undefined)
	  this.content= _setA.content;
	if (_setA.editor!=undefined)
	  this.editorId= _setA.editor |0;
	if (_setA.stamp!=undefined)
	  this.stamp= _setA.stamp;
	if (_setA.place!=undefined)
	  this.place= {
	  	x:_setA.place[0] |0,
	  	y:_setA.place[1] |0,
	  	w:_setA.place[2] |0,
	  	h:_setA.place[3] |0
	  };

if (!this.forRedraw) ALERT(PROFILE.VERBOSE, "Data "+ this.id +"("+ this.rootNote.PUB.id +") set ", 'ver: ' +_setA.ver +(_setA.dtype==DATA_TYPE.NOTE? ('; link: ') : ('; data: ') +_setA.content));
	  
	this.forRedraw= this.forRedraw || (Object.keys(_setA).length>0);
}

//change .id
//replaces parent's .data[_id]
//todo: meke sure killing existing parent's .data[_id] will not make garbage
Ndata.prototype.setId= function(_id){
	if (!_id || _id==this.id)
	  return;

ALERT(PROFILE.BREEF, "Ndata "+ this.id +' re-id ', 'id: '+ _id);

var parentCollection= this.rootNote.PUB.ndata;
	delete parentCollection[this.id];

	_id= _id |0;
	this.id= _id; //change id

//todo: should reuse instead of deleting
	if (parentCollection[_id]) //wipe duplicating Ncore
	  parentCollection[_id].kill();
	parentCollection[_id]= this; //fill in existent Ncore
}

Ndata.prototype.sibling= function(){
	if (this.dtype!=DATA_TYPE.NOTE)
	  return undefined;
	
	return Ncore(this.content |0);
}

Ndata.prototype.editor= function(){
	return Ucore(this.editorId);
}


Ndata.prototype.draw= function(_uiTemplateA,_curDI){
	if (!this.ui){
		var newTemplate= _uiTemplateA[this.dtype]?
		  _uiTemplateA[this.dtype]
		  : _uiTemplateA[DATA_TYPE.UNKNOWN];

		this.ui= new newTemplate(this,this.rootNote.PUB.ui.DOM.context,_curDI||0);
	}

	if (this.forRedraw)
	  this.ui.draw();

	var retRedraw= this.forRedraw;
	this.forRedraw= 0;
	return retRedraw;
}


//in reverse for Note, saving Data assumes visual changes are ALREADY made
//todo: mantain list of .forSave==1 data
Ndata.prototype.save= function(_vals){
	if (!Object.keys(_vals).length)
	  return;

	if (_vals.content!=undefined){
		this.dtype= DATA_TYPE.TEXT;
		this.content= _vals.content;
	}
	if (_vals.place!=undefined) 
	  this.place= {
	  	x:_vals.place.x,
	  	y:_vals.place.y,
//todo: remove (autosize)
	  	w:this.place.w ||300,
	  	h:this.place.h ||100
	  };

	this.editorId= SESSION.owner().id;
	this.stamp= new Date();
	this.forSave= SAVE_STATES.UNSAVED;

	this.ui && this.ui.setState(this.forSave);

	SESSION.save.save();
}

Ndata.prototype.saved= function(_res){
	if (this.ver==CORE_VERSION.INIT){ //CREATED
	  this.ver= 1;
	  this.setId(_res);
	} else
	  this.ver= _res;

	this.forSave= 0;

//todo: will be simplified after dedication of Unit
	//affect container
	for (var ir in this.rootNote.referers)
	  if (this.rootNote.referers[ir])
		this.rootNote.referers[ir].doSaved();
	//affect contained
	if (this.dtype==DATA_TYPE.NOTE){
		var curN= Ncore.all[this.content];
		for (var ir in curN.referers)
		  if (curN.referers[ir])
			curN.referers[ir].doSaved();
	}
}

//todo: check for being edited
Ndata.prototype.canSave= function(){
	return(this.forSave);
}
