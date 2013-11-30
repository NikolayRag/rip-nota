//todo: make parent Unit class for all units to mantain flat lists;
//		Maybe ((Ncore<-Nroot) + Ndata + Ucore) turn to (Unit<-(Nroot+Ndata+Ucore))

/*
	Data atom for notes.
	One Data belongs exactly to one Note, so there's no existence check logic
*/
var Ndata= function(_root,_id)//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	var _this= this;

	_this.id= _id;
	_this.ver= CORE_VERSION.INIT;
	_this.place= null;
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

//spike: replace uses of all() after; Bruteforce is evil
Ndata.all= function(_id)//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	for (var iN in Ncore.all){
		var allD= Ncore.all[iN].PUB.ndata;
		for (var iD in allD)
		  if (allD[iD].id==_id)
		    return allD[iD];
	}
}

Ndata.prototype.set= function(_ver,_dtype,_content,_editor,_stamp,_place)//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	if (_ver!=undefined)
	  this.ver= _ver |0;
	if (_dtype!=undefined)
	  this.dtype= _dtype |0;
	if (_content!=undefined)
	  this.content= this.dtype==DATA_TYPE.TEXT? _content.base64_decode() : _content;
	if (_editor!=undefined)
	  this.editorId= _editor |0;
	if (_stamp!=undefined)
	  this.stamp= _stamp;
	if (_place!=undefined)
	  this.place= {
	  	x:_place[0] |0,
	  	y:_place[1] |0,
	  	w:_place[2] |0,
	  	h:_place[3] |0
	  };

if (!this.forRedraw) ALERT(PROFILE.VERBOSE, "Data "+ this.id +"("+ this.rootNote.PUB.id +") set ", 'ver: ' +_ver +(_dtype==DATA_TYPE.NOTE? ('; link: ') : ('; data: ') +_content));
	  
	this.forRedraw= this.forRedraw || (arguments.length>0);
}

Ndata.prototype.sibling= function()//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	if (this.dtype!=DATA_TYPE.NOTE)
	  return undefined;
	
	return Ncore(this.content |0);
}

Ndata.prototype.editor= function()//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	return Ucore(this.editorId);
}


Ndata.prototype.draw= function(_uiTemplateA,_curDI)//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	_curDI= _curDI ||0;
	if (!this.ui){
		var newTemplate= _uiTemplateA[this.dtype]?
		  _uiTemplateA[this.dtype]
		  : _uiTemplateA[DATA_TYPE.UNKNOWN];

		this.ui= new newTemplate(this,this.rootNote.PUB.ui.DOM.context,_curDI);
	}

	if (this.forRedraw)
	  this.ui.draw();

	var retRedraw= this.forRedraw;
	this.forRedraw= 0;
	return retRedraw;
}


//in reverse for Note, saving Data assumes visual changes are ALREADY made
//todo: mantain list of .forSave==1 data
Ndata.prototype.save= function(_vals)//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	if (!Object.props(_vals))
	  return;

	if (_vals.content!=undefined)
	  this.content= _vals.content;
	if (_vals.place!=undefined) 
	  this.place= {
	  	x:_vals.place.x,
	  	y:_vals.place.y,
//todo: remove (autosize)
	  	w:this.place.w,
	  	h:this.place.h
	  };

	this.editorId= SESSION.owner().id;
	this.stamp= new Date();
	this.forSave= SAVE_STATES.UNSAVED;

	this.ui.setState(this.forSave);

	SESSION.save.save();
}

Ndata.prototype.saved= function(_res)//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	if (this.ver==-1){ //CREATED
//todo:
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
Ndata.prototype.canSave= function()//noinspection UnterminatedStatementJS,UnterminatedStatementJS,UnterminatedStatementJS
{
	return(this.forSave);
}
