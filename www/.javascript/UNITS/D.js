/*
//todo: make parent Unit class for all units to mantain flat lists;

Unit: root external interface; creation, reparent, reid, kill
	(Unit.DB) NoteDB, NdataDB, UserDB: implements save/update/set
	(Unit.UI[]) NUI, NdataUI: UI placeholter, Tool Context
		(NUI.nFrontUI) NUI_noteFUI, NUI_boardFUI
		(NdataUI.dFrontUI) DUIUnknown, DUIText, DUINote, DUIFile, DUIPaint
*/


/*
Class hierarchy:

0. ndataList[id]
1. Ndata +vals
2. .rootNote.ui[].dUI[id]
2.1.	.frontUI

0. notesList[id]
1. Ncore
1.1.	.PUB (db slice)
1.2.	.ui[] (.referrence[])
1.2.1.		.frontUI

!!!-> so Ndata doesnt contain its multiple UIs, but instead they
 stored within respective Note multiple UIs

*/

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
//todo: ref; use objects, make .changed(obj) reactor
	_this.content= null;
//todo: ref; use objects, make .changed(obj) reactor
	_this.editorId= null;
	_this.stamp= null;

//todo: ref; use objects, make .changed(obj) reactor
	_this.rootNote= _root;
	_this.forRedraw= 0;
	_this.forSave= SAVE_STATES.IDLE;
	_this.forDelete= false;

ALERT(PROFILE.BREEF,"Data new", 'id: ' +_id);
}

Ndata.newId= -1;

//spike: replace with all[] later; Bruteforce is evil
Ndata.all= function(_id){
	if (arguments.length==0){
		var outDataA= [];
		for (var iN in Ncore.all()){
			var allD= Ncore.all(iN).PUB.ndata;
			for (var iD in allD)
		  	  outDataA[iD]=allD[iD];
		}
		return outDataA;
	}

	for (var iN in Ncore.all()){
		var allD= Ncore.all(iN).PUB.ndata;
		for (var iD in allD)
		  if (allD[iD].id==_id)
		    return allD[iD];
	}
}

Ndata.prototype.set= function(_setA){ //{ver: , dtype: , content: , editor: , stamp: , place: }
	if (this.forSave!= SAVE_STATES.IDLE) //unsaved
	  return false;

	if (
		(_setA.ver |0)>this.ver
	){ //validaved
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

	return true;
}


Ndata.prototype.kill= function(){
	if (this.forSave!= SAVE_STATES.IDLE) //unsaved
	  return false;

	this.ui.kill();
//kill:	this.ui && this.ui.kill();

//todo: this is alien call for future Unit object
	if (this.dtype==DATA_TYPE.NOTE)
	  this.sibling() && this.sibling().kill();

	delete this.rootNote.PUB.ndata[this.id];

	return true;
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
//todo: !!! re-id ndata UI
}

Ndata.prototype.sibling= function(){
	if (this.dtype!=DATA_TYPE.NOTE)
	  return undefined;
	
	return Ncore(this.content |0);
}

Ndata.prototype.editor= function(){
	return Ucore(this.editorId);
}


//uiTemplateA varies dependent to context Data is in.
Ndata.prototype.draw= function(_parentUI, _curDI){
	var thisUI= _parentUI.dUI[this.id];
	if (!thisUI){
		thisUI= _parentUI.dUI[this.id]= new NdataUI(this, _parentUI, _curDI); //link ui instance to root data ui array
		thisUI.level= _parentUI.level;
	}

	if (this.forRedraw)
	  thisUI.draw();

	if (this.dtype==DATA_TYPE.NOTE) //go deeper
	  Ncore.all(this.content) && Ncore.all(this.content).draw(thisUI);

	var forRedraw_= this.forRedraw;
	this.forRedraw= 0;
	return forRedraw_;
}


//in reverse for Note, saving Data assumes visual changes are ALREADY made
//todo: mantain list of .forSave==1 data
Ndata.prototype.save= function(_vals){
//todo: use .set()

	if (!Object.keys(_vals).length)
	  return;

	if (_vals.del){
		if (this.ver == CORE_VERSION.INIT) //shorthand for unsaved yet
		  return this.saved(0);

		this.ui.unbind();
//		this.ui && this.ui.unbind();
		this.forDelete= true;
	}

	if (_vals.content!=undefined)
	  this.content= _vals.content;

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
	this.forSave= SAVE_STATES.READY;

//todo: completely move to set()
	this.forRedraw= true;

	SESSION.save.save();
}

Ndata.prototype.saved= function(_res, _resNotesA){
	this.forSave= SAVE_STATES.IDLE;
	this.forRedraw= true;

	if (_res==0){ //DELETED
		return this.kill();
	} else if (this.ver==CORE_VERSION.INIT){ //CREATED
	  this.ver= 1;
	  this.setId(_res);
	} else
	  this.ver= _res;

//todo: will be simplified after dedication of Unit
	//affect uplink
	this.rootNote.uiSaved();
	//affect downlink
	if (this.dtype==DATA_TYPE.NOTE){
		var curN= _resNotesA[this.content] || Ncore.all(this.content);
		this.content= curN.PUB.id;
		curN.uiSaved();
	}
}

//todo: check for being edited
Ndata.prototype.canSave= function(_enum){
	var curState= this.forSave;
	if (_enum && curState==SAVE_STATES.READY)
		this.forSave= SAVE_STATES.HOLD;
	return(curState);
}


////////////////////////////////





/*
Leafs are drawn at separate path

*/

var NdataUI= function(_rootD, _parentUI, _curDI){
	this.rootNdata= _rootD;

	this.rootUI= _parentUI;
	this.level= 0;

	this.DOM= this.build(_curDI);
	this.dFrontUI= new (NdataUI.newTemplate[this.rootNdata.dtype] || NdataUI.newTemplate[DATA_TYPE.UNKNOWN])(this);
}

NdataUI.newTemplate= [];

//todo: _resizeSpot to be removed at all
//todo: make complex leafSign
//todo: redesign comments
NdataUI.tmpl= DOM('leafTmpl');
NdataUI.prototype.build= function(_curDI){
	var cClone= NdataUI.tmpl.cloneNode(true);
	var cRoot= {
		root:	cClone,
		sign:	DOM('leafSign',cClone),
		shadow:	DOM('leafSignShadow',cClone),
		mark:	DOM('leafSignMark',cClone),
		stamp:	DOM('leafSignStamp',cClone),
		ref:	DOM('leafSignCustom',cClone),
		context:	DOM('leafContext',cClone),
		tool:	DOM('leafToolHolder',cClone),
		cover:	DOM('leafFrameCover',cClone)
	};
	NOID(cClone);

//cClone.style.transform= 'rotate('+(Math.random()-.5)*5+'deg)';

	var cCtx= this.rootUI.nFrontUI.DOM.context; //link created ui to parents' ui

//todo: make internally managed grain adding instead of supplied _curDI
	setTimeout(function(){
		cCtx.appendChild(cClone);
		cClone.focus();
		cClone.style.opacity= 1;
	}, _curDI*TIMER_LENGTH.LEAF_CREATION_PERIOD);

	return cRoot;
}


NdataUI.prototype.draw= function(){
	this.dFrontUI.draw();
	this.rootUI.nFrontUI.place(this.rootNdata, this.DOM.root); //container decides how to arrange in fact
}


NdataUI.prototype.style= function(){}


NdataUI.prototype.unbind= function(){
	if (!this.dFrontUI)
	  return;

	this.dFrontUI.unbind();
}

NdataUI.prototype.kill= function(){
//	this.dFrontUI && this.dFrontUI.kill();

	this.rootUI.nFrontUI.DOM.context.removeChild(this.DOM.root);
}

