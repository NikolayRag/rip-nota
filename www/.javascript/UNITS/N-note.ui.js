/*
	Note UI
	called at Note.draw() after bulk Notes update to guarantee parent UI element is defined
*/
var NoteUI= function(_note,_rootW){
	var _this= this;

	_this.note= _note;

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();
}


//todo: make stilyze affecting only own UI elements
NoteUI.prototype.style= function(){
	var _style= this.note.PUB.style;

	this.DOM.bg.style.background= _style.noteBG.hex();
	this.DOM.bg.style.borderColor= _style.noteBorder.hex();
	this.DOM.overbg.style.background= _style.noteBG.hex(false)? '' :'transparent';

	var thisData= this.note.PUB.ndata;
	for (var i in thisData)
	  if (thisData[i].ui) //skip for nonexistent (yet) leafs
	    thisData[i].ui.style();
}

NoteUI.prototype.bindEvt= function(_parentEl){
}

NoteUI.tmpl= DOM('noteInlineTmpl');
NoteUI.prototype.build= function(_parentEl){
	var cRoot= NoteUI.tmpl.cloneNode(true);
	var cBg= DOM('noteInlineBg',cRoot);
	var cObg= DOM('noteInlineOverbg',cRoot);
	var cCtx= DOM('noteInlineContext',cRoot);
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

