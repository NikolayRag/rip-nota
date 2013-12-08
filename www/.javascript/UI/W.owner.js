UI.ownerW= new function(){

this.draw= function(_noteIn){
	var ownerIn= _noteIn.owner();

	DOCUMENT.title= DIC.labTitle +(!ownerIn.id? '' : (' - ' +ownerIn.uname +(_noteIn.PUB.name!=''? (', ' +_noteIn.PUB.name) : '')));
	this.DOM.bar.style.display= (!ownerIn.id? 'none' : '');
//todo: improve: move to unified contact drawing (minimized/normal)
	  this.DOM.whoName.elementText(ownerIn.uname);
	  this.DOM.whoAdd.style.display= (
		ownerIn.relation == USER_RELATION.NEUTRAL
		|| ownerIn.relation == USER_RELATION.IN
		? '' :'none'
	  );
	  this.DOM.whoDel.style.display= (
		ownerIn.relation == USER_RELATION.NORMAL
		|| ownerIn.relation == USER_RELATION.OUT
		|| ownerIn.relation == USER_RELATION.IN
		? '' : 'none'
	  );
	this.DOM.toolbar.style.display= (_noteIn.PUB.rights != NOTA_RIGHTS.OWN? 'none' :'');

ALERT(PROFILE.BREEF, "Owner draw",'',1);
}

this.drawBRight= function(_right){
	this.DOM.notifyRight.elementText(RES_BOARDRIGHTS[_right+1]);
}

this.bindEvt= function(){
//todo: contacts minimal ON
	this.DOM.whoAdd.onclick= function(){
	//	contactMake(SESSION.ownerId,1);
	};
	this.DOM.whoDel.onclick= function(){
	//	contactMake(SESSION.ownerId,-1);
	};
}


////DOM
this.DOM= {
	bar: DOM('barBoardOwner'),
	whoName: DOM('idWhoName'),
	whoAdd: DOM('idWhoAdd'),
	whoDel: DOM('idWhoDel'),

	toolbar: DOM('barBoardTools'),
	notifyRight: DOM('boardNotifyRight')
};

this.bindEvt();

}
