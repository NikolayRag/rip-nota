/*

	Comments flow (the same as saving board notes themselves, will be joined to Board flow after reorganize):
		Creating new comment:
			-Create new DOM and new Notedata
			-switch created Notedata into edit mode
			*Cancel:
				-Deletes unsaved Notedata and DOM
			*Accept:
				-Assigns temporary id
				-Mark as Changed and FreeToSave
				-Save in ordinary loop
					-Replace Id with returned CommentId
		Deleting comment:
			-Mark Notedata as going to delete
			-Save in ordinary loop
				-Remove completely
		Editing comment:
			-Mark as Changed
			-Save in ordinary loop

//todo: begin
	Note engine should be merged with Board as they're very
	close in organizing data:
	-	they holds queue of data
	-	they data can be created, edited and remover by different users at once.
	-	they are decorated in same manner
	with differences of:
	-	Board is toplevel placeholder, enumerated in boadlist
	-	Board have user navigation support
	-	Board can be blank while staying alive
	-	Board access rights are explicitely defined
	-	Note have placement coordinates inside Board
	-	Note should have at least one root Notedata
	-	Note can have linkage to other Notes
	-	Note can be instanced over several Boards
	-	Notes's access rights are inherited from it's home Board
	-	Notedata is lowlevel data storage
	-	Notedata is sequenced within only one data thread
//todo: continue
	That should be reorganized in base in something like:
	-	Board(current Board+Note) with optional enumeration and
		placement attributes, used to list Notedata queue
	-	Noteitem(current Note+Notedata) without specified placement, holding
		unique data or reference to Board with datalist.

		I.e. from:

		*Board (toplevel)
			*Note (user-placed note)
				*Notedata (data atom)
					*Linked data
				...
			*Note (user-placed note)
				*Notedata (data atom)
					...
			...

		to:

		*Note (toplevel)
			*Noteitem (user-placed note)
				*Note (queue holder)
					*Notedata (data atom)
						*Linked data
					...
			*Noteitem (user-placed note)
				*Note (queue holder)
					*Noteitem (data atom)
					...
			...

		Note itself thus becomes a client-side itemized Board representation.
		Since Notes become Boards, it's become virtually the same if fullscreen or itemized.

//todo: end
*/

//todo: fix different rights behaviour
//todo: ui: split stamps to mouseover and permanent

//todo: "name" should be caption/searchstring
/*
var
 C_wait=0,
 C_progress=1,
 C_complete=2,
 C_error=3;
 
var Note= function(rights,w,id,_ver,_dver,_x,_y,_w,_h,_name,_style,_src,_editor,_stamp,_ref){
	var thisNote= this;
	var timeoutStamps;
	var timeoutUpProgress;

	this.isRef= 0;

	this.ver= -2; //-2=uninited; -1=uncreated; 0=deleted

	//dataId= Notedata
//todo: data id instead of sequental
	this.ndata= [];

//todo: fix: replace by true Board object (with id and owner)
	this._ref= _ref.split("/");
	
	this.rights= rights;
	this.realMouseOver= 0;
	this.captionDesiredState= 0;
	this.captionNextState= 0;
	this.captionTimeout;
	this.isChanged= 0;
	this.isCChanged= 0;
	
	this.glueToL= undefined;
	this.glueToR= undefined;
	this.glueToU= undefined;
	this.glueToD= undefined;

//todo: wut string?
	this.id= id.toString();
	

//helpers
	this.canSaveNote= function(){
		return (thisNote.isChanged && thisNote!=MouseHit.node);
	}
//todo: move to Notedata(Noteitem)
	this.canSaveData= function(){
		return (thisNote.data[0].isChanged && !thisNote.editMode());
	}
//todo: move to Notedata(Noteitem)
	this.canSaveComment= function(){
		return (thisNote.isCChanged);
	}
	this.getVer= function(){
		return thisNote.ver;
	}
	this.getBoard= function(){
		return BOARD.id;
	}
	this.getX= function(){
		return thisNote._note_.offsetLeft;
	}
	this.getY= function(){
		return thisNote._note_.offsetTop;
	}
	this.getW= function(){
		return thisNote._note_.offsetWidth-2;
	}
	this.getH= function(){
		return thisNote._note_.offsetHeight-2;
	}
//todo: check: !
	this.getName= function(){
			return "";
	}
	this.getStyle= function(){
		var bgc= "";
		switch (thisNote._note_.style.backgroundColor){
			case "transparent":
				bgc= "transparent";
			case "":
				break;
			default:
				bgc= new Color(thisNote._note_.style.backgroundColor).rgb();
		}

		return bgc +"+" +thisNote._note_.style.backgroundImage;
	}
*/
//-helpers

//+updates
//todo: make adequate with updateNote
/*
	this.colorize= function(a){
		thisNote._note_.className= a==0? "noteTrans":"note";

		thisNote._note_.style.backgroundColor=
		  a==0 ?"transparent" :UI.paletteGetRGB().hex();

		thisNote._note_.style.borderColor=
		  new Color(getComputedStyle(thisNote._note_).backgroundColor).mix(0,.25).hex();

		UI.overviewRedraw(thisNote.id);
		thisNote.noteChange(0);
	}
*/

//todo: add rights
/*
	this.updateNote= function(_v,_x,_y,_w,_h,_style){
		if (_v<=thisNote.ver)
		  return 0;
		thisNote.ver= _v;
		thisNote._note_.style.left= _x +"px";
		thisNote._note_.style.top= _y +"px";
		thisNote._note_.style.width= _w +"px";
		thisNote._note_.style.height= _h +"px";

		var styleA= _style.split("+");
		thisNote._note_.className= styleA[0]=="transparent"? "noteTrans":"note";

		thisNote._note_.style.backgroundColor= (styleA[0]=="" && styleA[0]=="transparent")? styleA[0]:(new Color(styleA[0]).hex());
//todo: check browser compat
		thisNote._note_.style.borderColor=
		  new Color(getComputedStyle(thisNote._note_).backgroundColor).mix(0,.25).hex();
		
		thisNote._note_.style.backgroundImage= styleA[1] ||"";

//todo: try to remove
		thisNote._note_.style.backgroundSize= "contain";
		thisNote._note_.style.backgroundPosition= "50% 50%";
		thisNote._note_.style.backgroundRepeat= "no-repeat";

		return 1;
	}
*/

	//update data and add comments.
	/*
		Each argument is ","-separated list of equal size
		list contains root element and new one comments
	*/
//todo: add rights
//todo: rely on Notedata(Noteitem)
/*
	this.updateData= function(_v,_d,_e,_s){
		var vA= _v.split(",");
		var dA= _d.split(",");
		var edtA= _e.split(",");
		var stampA= _s.split(",");

		if (vA[0]!=thisNote.data[0].ver) {
			thisNote.data[0].ver= vA[0];

			//change owner to new current/new if need.
			var tOwner= new Ucore();
			tOwner.id= SESSION.user.id; //temporary, to hold implicit current user definition
			if (edtA[0]!=""){
				var edtP= edtA[0].split("=");
				tOwner.id= edtP[0];
				tOwner.name= edtP[1];
			}
			if (thisNote.data[0].owner.id!=tOwner.id) //owner is really changed
			  thisNote.data[0].owner= (tOwner.id==SESSION.user.id? SESSION.user:tOwner);

			thisNote.data[0].stamp= new Date(new Date()-stampA[0]*1000);
			thisNote.content(
				vA[0]==0?
				  ("<span style=color:#f00>" +DIC.labDeleted +"</span>")
				  : dA[0].base64_decode()
			);
		}

		var ic= thisNote.data.length;
		for (var i=1; i<dA.length; i+=1) {
			if (thisNote.data[ic]==undefined){
				thisNote.data[ic]= new Notedata();
	  			thisNote.data[ic].id= ic;
			}
//todo: fix: comments versions
			thisNote.data[ic].id= vA[i];
			thisNote.data[ic].ver= vA[i];

			//change owner to new current/new if need.
			var tOwner= new Ucore();
			tOwner.id= SESSION.user.id; //temporary, to hold implicit current user definition
			if (edtA[i]!=""){
				var edtP= edtA[i].split("=");
				tOwner.id= edtP[0];
				tOwner.name= edtP[1];
			}
			if (thisNote.data[ic].owner.id!=tOwner.id) //owner is really changed
			  thisNote.data[ic].owner= (tOwner.id==SESSION.user.id? SESSION.user:tOwner);

			thisNote.data[ic].stamp= new Date(new Date()-stampA[i]*1000);
			thisNote.data[ic].domNode= thisNote.comments(
				ic,
				vA[i]==0?
				  ("<span style=color:#f00>" +DIC.labDeleted +"</span>")
				  : dA[i].base64_decode()
			);
			
			ic+=1;
		}

		thisNote.updateStamps();
		return 1;
	}
*/
//todo: maybe: split refree and timestamp

//todo: move to Notedata(Noteitem)
/*	this.updateStamps= function(){
		if (thisNote.data[0].owner!=undefined || thisNote.data[0].stamp!=undefined)
		  thisNote._noteSign.innerHTML=
		    thisNote.stampString(  //root editor, blank name if by owner
			(
				thisNote.data[0].owner.name.toLowerCase()==
				  (thisNote._ref[0]=="" ?BOARD.owner.name :thisNote._ref[0]).toLowerCase()?
				"":thisNote.data[0].owner.name
			)
			, thisNote.data[0].stamp
		  );

		for (var ic=1; ic<thisNote.data.length; ic+=1)
			thisNote._noteComments.children["comment"+ic].children["cStamp"].innerHTML=
			  thisNote.stampString(thisNote.data[ic].owner.name,thisNote.data[ic].stamp);

//todo: deside if per-note update is better (maybe coz of time-distribution)
//		clearTimeout(timeoutStamps);
//		timeoutStamps= setTimeout(thisNote.updateStamps,5000);
	}	
*/ 
//todo: move to Notedata(Noteitem)
/*
	this.comments= function(_id,_d){
		if (_d==undefined){
			if (_id!=undefined)
			  return thisNote._noteComments.children["comment"+_id].children["cData"].innerHTML;
//todo: make obsolete, remove by
			return thisNote._noteComment.value;
		}

		if (thisNote._noteComments.children["comment"+_id]!=undefined){ //update existing
			thisNote._noteComments.children["comment"+_id].children["cData"].innerHTML= _d;
			return;
		}
		var tmpDiv, tmpDiv2;
		thisNote._noteComments.appendChild(
			tmpDiv= DOCUMENT.createElement("div")
		);
		  tmpDiv.className= "commentDiv";
		  tmpDiv.id= "comment" +_id;

		tmpDiv.appendChild(
			tmpDiv2= DOCUMENT.createElement("div")
		);
		  tmpDiv2.className= "commentStamp";
		  tmpDiv2.id= "cStamp";

		tmpDiv.appendChild(
			tmpDiv2= DOCUMENT.createElement("div")
		);
		  tmpDiv2.className= "commentData";
		  tmpDiv2.id= "cData";
		  tmpDiv2.innerHTML= _d;
		
		return tmpDiv2;
	}
*/

//todo: move to Notedata(Noteitem)
/*	this.content= function(_v){
		if (_v==undefined)
		  return thisNote.iFdoc.body.innerHTML;
		thisNote.iFdoc.body.innerHTML= _v;
	}
*/

/*	this.stampString= function(_editor,_stamp){
		var std= stampDiff(_stamp,8640000000);
		return (
			"<span id=stampName class=commentStamp>"
			+_editor
			+"</span>"
			+((_editor=="" || std=="") ?"" :", ")
			+"<span id=stampDate class=commentStamp>"
			+std
			+"</span>"
		);
	}
*///-updates


/*
	this.notePin= function(){
//todo: maybe: get recent boardlist
		poptip(
			DOM.templatePinList.innerHTML,
			function(){
				BOARD.notes[BOARD.notesNewId]= new Noteref(
					DOM.popUpContent.children["tempUserBoardsList"].value,
					0,0,100,100,
					thisNote.id
				);
				BOARD.notesNewId-= 1;
			}
		);

	}
*/
/*
Set/get editmode
*/
//todo: move to Notedata(Noteitem)
/*	this.editMode= function(v){
		if (v==undefined)
		  return thisNote.iFdoc.designMode=="on";
		thisNote.iFdoc.designMode = (v==1?"on":"off");
		thisNote._toolbarNorm.style.display=(v==0?"inline":"none");
		thisNote._toolbarEdit.style.display=(v==1?"inline":"none");
		thisNote._note_.style.zIndex=(v==1?2:0);
		if (v==0) {
			if (thisNote.realMouseOver)
			  thisNote.mouseOver();
			else
			  thisNote.mouseOut();
		} else {
			thisNote.mouseOver();
			thisNote._noteFrame.contentWindow.focus();
		}
	}*/

//caption
/*
	this.captionSet= function(){
//td: remove entire scanning
		for (var i in BOARD.notes) {
			var n=BOARD.notes[i];
			clearTimeout(n.captionTimeout);
			n._caption.style.display=
			  (n.captionDesiredState==1 && thisNote.rights>=0? "inline":"none"); //move and pin
			n._butDel.style.display=
			  (n.captionDesiredState==1 && BOARD.rights>=2? "inline":"none"); //del
			n._resizeSpot.style.display=
			  (n.captionDesiredState==1 && BOARD.rights>=2? "inline":"none");
			n._noteComment.style.display=
			  (n.captionDesiredState==1 && thisNote.rights>=1? "inline":"none"); //comment
			n._butBlockNorm.style.display=
			  (n.captionDesiredState==1 && thisNote.rights>=2? "inline":"none"); //edit
		}
	}
	this.mouseOver= function(){
		thisNote.realMouseOver= 1;
		if (MouseHit.node!=undefined) return; //Suppress action at mouse activity

		thisNote.captionDesiredState= 1;
		thisNote.captionSet();
		thisNote._note_.style.zIndex= 1;
	}
	this.mouseOut= function(){
		thisNote.realMouseOver= 0;
		if (MouseHit.node!=undefined) return; //Suppress action at mouse activity
		if (thisNote.editMode()) return; //Suppress in-edit notes

		thisNote.captionDesiredState= 0;
		thisNote.captionTimeout=
		  setTimeout(thisNote.captionSet,1000);
		thisNote._note_.style.zIndex= "";
	}
//-caption
*/
//edit
//todo: move to Notedata(Noteitem)
/*	this.dblClick= function() {
		if (thisNote.editMode()) return;
		thisNote.data[0].shadow= thisNote.content();
		thisNote.editMode(1);
	}*/
//todo: move to Notedata(Noteitem)
/*	this.editCancel= function() {
		if (!confirm(DIC.popEditCancel)) return;
		if (thisNote.id<0 && thisNote.data[0].isChanged==0) { //remove newly created but unused
			thisNote._note_.parentNode.removeChild(thisNote._note_);
			delete BOARD.notes[thisNote.id];
			BOARD.noteFieldCorrect(0);
			return;
		}

		thisNote.content(thisNote.data[0].shadow);
		thisNote.data[0].shadow= '';
		thisNote.editMode(0);
	}
//todo: move to Notedata(Noteitem)
	this.editAccept= function() {
		thisNote.editMode(0);
		thisNote.data[0].isChanged= 1;
		
		thisNote.noteChange(1);
	}*/
//todo: move to Notedata(Noteitem)
/*	this.keyPress= function(e){
		if (!thisNote.editMode()) return; //React only in edit

		e= e||window.event;
		var code= e.keyCode ?e.keyCode :e.which; //mozilla/ie

		if ((code==13 && e.ctrlKey) || code==10) thisNote.editAccept();
		if (code==27) thisNote.editCancel();
	}*/
/*	this.commentAccept= function() {
		thisNote.noteChange(2);
	}
	this.commentKeyPress= function(e) {
		e= e||window.event;
		var code= e.keyCode ?e.keyCode :e.which; //mozilla/ie

		if (code==13) thisNote.commentAccept();
	}
*///-edit

/*
	this.setState= function(c_state,val){
		var newState= 1;
		var newColor= "#bb0";
		var newLab= "";
		switch (c_state) {
			case C_wait:
				newLab= "*";
				break;
			case C_progress:
				newColor= "#480";
				newLab= Math.floor(val*1000)/1000;
				break;
			case C_complete:
				newColor= "#080";
				newLab= "ok";
				setTimeout(thisNote.setState,1000);
				break;
			case C_error:
				newColor= "#f00";
				newLab= "E!";
				break;
			default:
				newState= 0;
		}
		thisNote._noteState.style.display= newState? "":"none";
		thisNote._noteState.style.color= newColor;
		thisNote._noteState.innerHTML= newLab;
	}
*/

//store. nd=0: note itself, nd=1: data.
/*
	this.noteChange= function(nd){
		  //ignore movements on new unsaved note
		if (nd==0 && thisNote.ver==-1 && n.editMode()) return;

//todo: flexible lazy save
		if (BOARD.noteChangeTimeout!=undefined) //restart countdown
		  clearTimeout(BOARD.noteChangeTimeout);		

		thisNote.setState(C_wait);
		if (nd==0 || thisNote.ver==-1)
		  thisNote.isChanged= 1; //if new note, save all
		if (nd==1)
		  thisNote.data[0].isChanged= 1;
		if (nd==2)
		  thisNote.isCChanged= 1;
		BOARD.noteChangeTimeout= setTimeout(asyncSaveNote,2000);
	}
*/

	this.noteDelete= function () {
		if (!confirm(DIC.popEditRemove)) return;
		if (thisNote.id<0){ //remove unsaved instantly
			thisNote._note_.parentNode.removeChild(thisNote._note_);
			delete BOARD.notes[thisNote.id];
			BOARD.noteFieldCorrect(0);
			return;
		}

		thisNote.ver= 0;
		thisNote._note_.onmouseover= undefined;
		thisNote._note_.onmouseout= undefined;
		thisNote.iFdoc.ondblclick= undefined;
		thisNote._noteFrame.scrolling= "no";

		thisNote.captionDesiredState= 0;
		thisNote.captionSet();

//+todo: optimize: make as stilyze fn
		thisNote.iFdoc.body.style.color=
		  new Color(
			new Color(thisNote._note_.style.borderColor).gray()
		  ).mix(DOM.workField.style.backgroundColor,.5).hex();
		thisNote._note_.style.boxShadow= "0 0 0 0";
		if (thisNote._note_.style.backgroundColor!= "transparent"){
			thisNote._note_.style.backgroundColor=
			  new Color(
				new Color(getComputedStyle(thisNote._note_).backgroundColor).gray()
			  ).mix(DOM.workField.style.backgroundColor,.5).hex();
			thisNote._note_.style.borderColor=
			  thisNote.iFdoc.body.style.color;
		}
//-todo:

		thisNote.noteChange(0);
	}
//-store

//+glue
/*
	this.glue= function(side){
		Glue.note= thisNote;
		Glue.side= side;
		switch (side) {
			case "l": {
				thisNote._glueLPic.style.display= "inline";
				break;
			}
			case "r": {
				thisNote._glueRPic.style.display= "inline";
				break;
			}
			case "u": {
				thisNote._glueUPic.style.display= "inline";
				break;
			}
			case "d": {
				thisNote._glueDPic.style.display= "inline";
				break;
			}
			case undefined: {
				Glue.note= undefined;
				thisNote._glueLPic.style.display= "none";
				thisNote._glueRPic.style.display= "none";
				thisNote._glueUPic.style.display= "none";
				thisNote._glueDPic.style.display= "none";
				break;
			}
		}
	}
//-glue
}
*/
//save all notes at once
//todo: AND ALL COMMENTS of all notes
/*
function asyncSaveNote() {
	var saveListA=[];
	for (var i in BOARD.notes)
	  if (BOARD.notes[i].canSaveNote() || BOARD.notes[i].canSaveData() || BOARD.notes[i].canSaveComment())
	    saveListA[saveListA.length]=i;

	var saveData="idSave=" +saveListA;
	for (var i in saveListA){
		var n=BOARD.notes[saveListA[i]];
		if (n.canSaveNote()) {
			if (n.ver==0) { //delete, short version
				saveData+="&nS"+i+"=-1";
				continue;
			}
			saveData+="&nV"+i+"="+n.getVer();
			saveData+="&bId"+i+"=" +n.getBoard(); //not need at update
			saveData+="&x"+i+"=" +n.getX();
			saveData+="&y"+i+"=" +n.getY();
			saveData+="&w"+i+"=" +n.getW();
			saveData+="&h"+i+"=" +n.getH();
//todo: engine: move tags to data (root attribute, root, comennt?)
			saveData+="&name"+i+"="+n.getName();
//todo: engine: leave style as style
			saveData+="&style"+i+"="+encodeURIComponent(n.getStyle());
			if (n.isRef){ //create ref, sort of short too
				saveData+="&nS"+i+"=3";
				saveData+="&d"+i+"=" +n._src; //source Note id here
				continue;
			}
			if (saveListA[i]<0)
			  saveData+="&nS"+i+"=2"; //or create nonref
			else
			  saveData+="&nS"+i+"=1"; //or update
		} else
		  saveData+="&nS"+i+"=0"; //actually works out as canSaveData or canSaveComment

		if (n.canSaveData() || n.canSaveComment()) { //ref is continued at 'nS'
			saveData+="&dS"+i+"="+(n.canSaveData()?1:0);
			saveData+="&cS"+i+"="+(n.canSaveComment()?1:0);
			saveData+="&dV"+i+"=" +(n.ndata==[]? -1:n.ndata[0].ver);
			saveData+="&d"+i+"="+(n.canSaveData()?n.content().base64_encode():"")+","+(n.canSaveComment()?n.comments().base64_encode():"");
		} else
		  saveData+="&dS"+i+"=0&cS"+i+"=0";
	}

	saveHttpPost("../.async/asyncSaveNote.php", saveData, noteSaveCB);
}
*/
