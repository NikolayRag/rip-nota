/*
	Note UI
	called at Note.draw() after bulk Notes update to guarantee parent UI element is defined
*/
var NoteUI= function(_note,_rootW){
	var _this= this;

	_this.note= _note;
	_this.rootW= _rootW;

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();
}


NoteUI.prototype.place= function(){
}

//todo: make stilyze affecting only own UI elements
NoteUI.prototype.style= function(){
	var _style= this.note.PUB.style;

	this.DOM.bg.style.background= _style.main.hex();
	this.DOM.bg.style.borderColor= _style.mainDark.hex();
	this.DOM.overbg.style.background= _style.main.hex(false)? '' :'transparent';

	var thisData= this.note.PUB.ndata;
	for (var i in thisData)
	  if (thisData[i].ui) //skip for nonexistent (yet) leafs
	    thisData[i].ui.style();
}

NoteUI.prototype.bindEvt= function(_parentEl){
}

NoteUI.tmpl= DOM('plateNoteTmpl');
NoteUI.prototype.build= function(_parentEl){
	var cRoot= NoteUI.tmpl.cloneNode(true);
	var cBg= DOM('plateNoteBg',cRoot);
	var cObg= DOM('plateNoteOverbg',cRoot);
	var cCtx= DOM('plateNoteContext',cRoot);
	NOID(cRoot);

	cObg.style.display= (UI.perfLevel &PERF.GRADIENTS)? '' :'none';

	_parentEl.appendChild(cRoot);

	return {
		root:cRoot,
		bg:cBg,
		overbg:cObg,
		context:cCtx
	};
}

NoteUI.prototype.kill= function(){
	this.rootW.removeChild(this.DOM.root);
}