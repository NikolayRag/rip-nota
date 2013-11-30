UI.ownerW= new function(){

this.draw= function(_noteIn){
	var ownerIn= _noteIn.owner();

	DOCUMENT.title= DIC.labTitle +(!ownerIn.id? '' : (' - ' +ownerIn.uname +(_noteIn.PUB.name!=''? (', ' +_noteIn.PUB.name) : '')));
	this.DOMBar.style.display= (!ownerIn.id? 'none' : '');
//todo: improve: move to unified contact drawing (minimized/normal)
	  this.DOMWhoName.elementText(ownerIn.uname);
	  this.DOMWhoAdd.style.display= (
		ownerIn.relation == USER_RELATION.NEUTRAL
		|| ownerIn.relation == USER_RELATION.IN
		? '' :'none'
	  );
	  this.DOMWhoDel.style.display= (
		ownerIn.relation == USER_RELATION.NORMAL
		|| ownerIn.relation == USER_RELATION.OUT
		|| ownerIn.relation == USER_RELATION.IN
		? '' : 'none'
	  );
	this.DOMToolbar.style.display= (_noteIn.PUB.rights != NOTA_RIGHTS.OWN? 'none' :'');

ALERT(PROFILE.BREEF, "Owner draw",'',1);
}

this.drawBRight= function(_right){
	this.DOMNotifyRight.elementText(RES_BOARDRIGHTS[_right+1]);
}

this.bindEvt= function(){
//todo: contacts minimal ON
	this.DOMWhoAdd.onclick= function(){
	//	contactMake(SESSION.ownerId,1);
	};
	this.DOMWhoDel.onclick= function(){
	//	contactMake(SESSION.ownerId,-1);
	};
}


////DOM
this.DOMBar= DOM('barBoardOwner');
this.DOMWhoName= DOM('idWhoName');
this.DOMWhoAdd= DOM('idWhoAdd');
this.DOMWhoDel= DOM('idWhoDel');
//
this.DOMToolbar= DOM('barBoardTools');
this.DOMNotifyRight= DOM('boardNotifyRight');


this.bindEvt();

}
