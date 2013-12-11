//todo: make class with ownerW.boardlistW instance
UI.ownerW.boardlistW= new function(){

//todo: draw incremental (sure?)
this.draw= function(_noteIn){
	var boardListA= _noteIn.owner().boards();
	
	var bs= this.DOM.selector;
	while (bs.childNodes.length>0)
	  bs.removeChild(bs.childNodes[0])
	for (var iN in boardListA){
		var bsItem= DOCUMENT.createElement('option');
		  bsItem.value= boardListA[iN].PUB.id;
		  bsItem.elementText(boardListA[iN].PUB.name);
		  if (boardListA[iN].PUB.id==_noteIn.PUB.id)
		    bsItem.selected= 'selected';
		bs.appendChild(bsItem);
	}

	if (_noteIn.PUB.id<0){
		var bsItem= DOCUMENT.createElement('option');
		  bsItem.value= '';
		  bsItem.elementText('');
		  bsItem.selected= 'selected';
		bs.appendChild(bsItem);
	}
}


this.bindEvt= function(){
	this.DOM.selector.onchange= function(){
		SESSION.reload(SESSION.board.PUB.reqWho, this.children[this.selectedIndex].elementText());
	};
}

////DOM
this.DOM= {
	selector: DOM('boardSwitch')
};

this.bindEvt();

}
