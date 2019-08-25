//todo: change to tools context
UI.boardToolsW= new function(){

this.bindEvt= function(){
	var _this= this;

	this.DOM.boardCreate.onchange= function(){
		//validate
		var newName= this.value;
		for(var iN in Ncore.all())
			if (Ncore.all(iN).PUB.name == newName)
//todo: ask to switch
		    	return;

		//create
		var newNote= new Ncore();
		newNote.save({name:newName}, function(_res){
			SESSION.owner().set({boardList:SESSION.owner().boardIds.concat([_res])});
			SESSION.reload(SESSION.reqWho,newName)
		}, true);
	};

}

this.DOM= {
	bar: DOM('barBoardTools'),

	boardCreate: DOM('boardCreate')
};

this.bindEvt();


}
