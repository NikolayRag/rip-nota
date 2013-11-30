!!adapt: DOM, bind


/*
	legacy upload engine.

	Interface:
		byForm() initiates file selection.
		 For legacy, new hidden form is added for each selection to hold queue.
		 'templateUpload'/form/'filePick' should exist to go.

		filesSelected() should be binded to 'filePick'.onchange.
		 It's called as files ARE selectes with form to add corresponding Notes
		 and start upload queue.

		for dnd: filesSelected() should be binded to 'ondrop' property of desired element


	macro:

	?in: pickFiles:
		-new form created
		-pickFiles() called
		?by form:
			-form put into form queue
			-blank notes are created for each file
			-submit queued form
			end

		?by blob:
			-files from form are put into file queue
	?in: DnD:
			-file from DnD are put into file queue
			-blank notes are created for each file
			-procceed file queue
			end
*/
	

if (!IS.dnd)
  var UPLOAD= new function(){
	this.formTry;  //used to select files only, valid till appended to queue
	this.queueA= []; //forms/associated_notes
	this.queueI;
	
	this.isUploading= 0;
	this.timeoutUpProgress;

	/*
		Select files into individual form.
		One/several files accepted.

		New Form is created from template and queued for uploading
	*/
//todo: set final filename at start of upload, rather than end.
	this.byForm= function(){
		if (SESSION.board.PUB.rights<2)
		  return;
		//make new form and choose files
		this.formTry= DOM.templateUpload.children[0].cloneNode(true);
		this.formTry.children["filePick"].click();
	};
	

	/*
		Queue Form after files are selected.
		
		macro:
		-Check size,
		-Create template notes,
		-Append form to queue,
		-Procceed with form queue.
	*/
	this.filesSelected= function(){
		var formUpFname= this.formTry.children["filePick"];
		
		//check total length
		if (formUpFname.files){
			var tl=0;
			for (var f=0; f<formUpFname.files.length; f++){
				tl+= formUpFname.files[f].size;
			}
			if (tl>1480000000) {
				UI.popW.up(DIC.uploadLimit);
				return;
			}
		}

		//create associated notes
		var fileNotes= [];
		if (formUpFname.files) //multi
		  for (var f=0; f<formUpFname.files.length; f++){
			var tmpN= fileNotes[fileNotes.length]= workFieldDbl(	{clientX:100+f*5, clientY:100+f*50}, formUpFname.files[f].name.base64_encode() );
			tmpN.setState(C_progress,0);
		  }
		else { //single
			var tmpN= fileNotes[fileNotes.length]= workFieldDbl(	{clientX:0, clientY:0}, formUpFname.value.base64_encode() );
			tmpN.setState(C_progress,0);
		}
//todo: fix in place		
		SESSION.board.PUB.ui.correct();

		//add to queue and go
		this.queueA[this.queueA.length]= [this.formTry,fileNotes];
		this.formTry= undefined;
		if (!this.isUploading)
		  this.goQueue();
	};
	
	
	/*
		Form queue procceeded here

		macro:
		-Setup progress request
		-Start upload
		
	*/
	this.goQueue= function(){
		//re-init index
		this.queueI= -1;
		for (this.queueI in this.queueA) break;

		if (this.queueI==-1){ //queue empty, stop
			this.isUploading= 0;
			return;
		}
		this.isUploading= 1;

		//set progress check
		var _this= this;
		this.timeoutUpProgress= setInterval(
			function(){
				saveHttpPost("../.async/asyncUploadFilesProgress.php", "", _this, _this.fileProgressCB)
			}, 2000
		);

		var thisForm= this.queueA[this.queueI][0];
//check: should byForm click() call work in some browsers?
		DOCUMENT.body.appendChild(thisForm); //should be in for submit clicks to work
		thisForm.children["upSubmit"].click();
		DOCUMENT.body.removeChild(thisForm);
	};


	/*
		formUploadCB is called not from js code itself, but from external IFRAME as result of successfully uploaded form.
		
		macro:
		-Remove form from queue,
		-Update all notes with Complete state,
		-Procceed form queue
		
		resA= [guidS,..]
	*/
	this.formUploadCB= function(resA){
		clearTimeout(this.timeoutUpProgress);
		this.fileProgressCB(resA);

		//remove first form and procceed
		delete this.queueA[this.queueI];
		this.goQueue();
	}

	
	/*
		Update Progress for uploading files.
		When uploading files with forms, files are actually proccessed at once,
		so some of files can be set to 100% but yet not be available.
	
		res= "" if progress is called after end of upload, skipped
		res= "totalPrc,b,b,.." if in progress. Count of values is from one to files count.
		res= [guid,guid,..] if complete
	*/
	this.fileProgressCB= function(res){
		if (res=="") //blank is last call on timer, should be skipped
		  return;
		if (!Array.isArray(res)) //filters out end of upload
		  var resA= res.split(",");

		var thisForm= this.queueA[this.queueI][0].children["filePick"];
		var thisNotes= this.queueA[this.queueI][1];

		if (thisForm.files){
			for (var fi=0; fi<thisForm.files.length; fi++){
				if (resA){ //progress
					var fs= resA[fi+1]!=undefined? resA[fi+1] :0;
					thisNotes[fi].setState(C_progress,fs/thisForm.files[fi].size);
				} else { //complete
					thisNotes[fi].content("<a href='/file" +res[fi] +"'>" +thisForm.files[fi].name +"</a>");
					thisNotes[fi].editAccept();
//		this._note_.style.backgroundImage= "url(/file" +guidS +")";
				}
			}
		} else { //one-file mode
			if (resA){ //progress
				thisNotes.setState(C_progress,resA[0]);
			} else { //complete
				thisNotes.content("<a href='/file" +res[0] +"'>" +thisForm.value +"</a>");
				thisNotes.editAccept();
//		this._note_.style.backgroundImage= "url(/file" +guidS +")";
			}
		}
	};

};
