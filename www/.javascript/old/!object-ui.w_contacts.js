//todo: ui: floating tooltips for every contact


//todo: allow only partial request/update
//todo: update not only contacts, but also boardlist (and html template!)
//fill SESSION.owner.contacts[]
function userUpdateCB(cData){
	var sArr= cData.split("\n");

	var userA= sArr[0].split(";");
	if (parseInt(userA[0])<0) {
		UI.popup(DIC.errrContactUpdate +": "+ sArr.join("<br>"));
		return;
	}

//todo: true version check
	if (SESSION.owner().ver>=parseInt(userA[0]))
	  return;

	SESSION.owner().ver= parseInt(userA[0]);
//todo: check: if id is not ruined somehow
	SESSION.owner().id= parseInt(userA[1]);
	SESSION.owner().name= decodeURIComponent(userA[2]);


	SESSION.owner.boards= [];
	var boardsA= sArr[1].split(",");
	for (var ib in boardsA){
		var boardEntryPair= boardsA[ib].split("=");
		var tBoard= new Board();
		tBoard.id= boardEntryPair[0];
		tBoard.name= decodeURIComponent(boardEntryPair[1]);
		tBoard.owner= SESSION.owner;
		SESSION.owner.boards[tBoard.id]= (tBoard.id==BOARD.id? BOARD:tBoard);
	}

	SESSION.owner.contacts= [];
	for (var ig= 2; ig<sArr.length-1; ig+= 1){ //groups
		var groupData= sArr[ig].split(";");

		for (var iu= 1; iu<groupData.length-1; iu+= 1){ //users
			cData= groupData[iu].split(",");
			var tmpContact= new Ucore();
			tmpContact.id= parseInt(cData[0]);
			tmpContact.name= decodeURIComponent(cData[1]);
			tmpContact.relation= parseInt(cData[2]);
			tmpContact.groupId= parseInt(groupData[0]);
//			tmpContact.groupName= decodeURIComponent(groupData[1]);
			SESSION.owner.contacts[tmpContact.id]= tmpContact;
		}
	}

	SESSION.owner.updated= 1;
	UI.update();
}

//todo: add notify
//todo: add list states(?)

function contactListOpen(reveal){
	if (reveal==1)
	  DOM.contactList.style.display= "";

	var saveData="full=" +1;
//pAlert("<Br>Send:	"+saveData+"<br>");
	saveHttpPost("../.async/asyncUpdateUser.php", saveData, this, userUpdateCB);
}

function contactListClose(){
	DOM.contactList.style.display= "none";
}

function contactMakeCB(cData){
	if (DOM.contactList.style.display=="")
	  contactListOpen();
}

//change one-way relation
//mode=[-1=del|1=add]
function contactMake(idWho, mode){
	if (!confirm(mode==1?DIC.popContactReq:DIC.popContactKill))
	  return;

	var saveData="who=" +idWho;
	saveData+="&make=" +(mode==1?1:-1);
//pAlert("<Br>Send:	"+saveData+"<br>");
	saveHttpPost("../.async/asyncContactMake.php", saveData, this, contactMakeCB);
}






//contact
//todo: ON
//DOM.contactsOpen.onclick=	function(){contactListOpen(1)};
//DOM.contactsClose.onclick=	function(e){contactListClose()};
