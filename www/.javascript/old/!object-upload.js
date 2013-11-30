!!adapt: DOM, bind


/*
	HTML5 upload engine.

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
var UPLOAD;

if (IS.dnd)
  var UPLOAD= new function(){

  /*
		New style, sliced blob mode
  */
  new function(){
	this.formTry;  //used to select files only
	this.queueA= []; //[file,associated_note],..
	this.queueI;
	
	this.isUploading= 0;
	this.timeoutUpProgress;
	

	this.sliceOffset;
	this.blobSize;
	
	this.fReader= new FileReader();
	this.fileTarget	;	//server-side file guid


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
		this.formTry= DOM.templateUpload.children[0].children["filePick"];
		this.formTry.click();
	};


	/*
		Queue selected files after files are selected.
		If dndEvent supplied, method is called by Drag-n-Drop,
		otherwise it is called by selecting files in form.
		
		macro:
		-Get files from dnd of form
		-Create template notes,
		-Append filelist to queue,
		-Procceed with form queue.
	*/
	this.filesSelected= function(dndEvent){
		if (dndEvent) //dnd
		  dndEvent.preventDefault();
		var thisFiles= dndEvent?
		  dndEvent.dataTransfer.files
		  : this.formTry.files;
		var clientX= dndEvent? dndEvent.clientX :100;
		var clientY= dndEvent? dndEvent.clientY: 100;

		//create associated notes and add file/note pair to queue
		for (var f=0; f<thisFiles.length; f++){
			var tmpN= workFieldDbl( {clientX:clientX+f*5, clientY:clientY+f*50}, thisFiles[f].name.base64_encode() );
			tmpN.setState(C_progress,0);

			this.queueA[this.queueA.length]= [thisFiles[f],tmpN];
		}
//todo: fix in place
		SESSION.board.PUB.ui.correct();

		//go
		if (!this.isUploading)
		  this.goQueue();
	};


	/*
		Files queue procceeded here
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

		this.sliceOffset= 0;
		this.blobSize= 1024*1024; //1mb chunk defaults
		this.blobCut();
	};


	/*
		repeatedly cut and (automatically) send slice
	*/
	this.blobCut= function(){
		var thisFile= this.queueA[this.queueI][0];

		//progress
		this.fileProgressCB();

		if (thisFile.size-this.sliceOffset < this.blobSize) //final slice
		  this.blobSize= thisFile.size-this.sliceOffset;

		var blob= thisFile.slice(this.sliceOffset, this.sliceOffset +this.blobSize);
		this.fReader.readAsBinaryString(blob);
	}

	
	/*
		Send file slice actually readed.
	*/
//todo: validate "this"
	this.blobSend=
	 this.fReader.onloadend= 
	 function(e){
		if (e.target.readyState != FileReader.DONE)
		  return;

		var thisFile= this.queueA[this.queueI][0];

		var xhr = new XMLHttpRequest();
		xhr.addEventListener("load",this.blobSent,false);
		xhr.open('POST', "../.async/asyncUploadFileBlob.php");
		xhr.setRequestHeader("Content-Type", "application/x-binary; charset=x-user-defined");
		xhr.setRequestHeader("Filename", thisFile.name);
		xhr.setRequestHeader("File-guid", this.sliceOffset==0? "0":this.fileTarget); //tell what to continue
		xhr.setRequestHeader("Filesize", thisFile.size);
		xhr.setRequestHeader("Slice-From", this.sliceOffset);
		xhr.setRequestHeader("Slice-Size", this.blobSize);
		xhr.sendAsBinary(e.target.result);
	}

	/*
		One slice is sent.
		
		Check for error, and retry if need
		Procceed to next slice or next file in queue
	*/
	this.blobSent= function(e) {
		if (e.target.status!=200) {
			alert(e.target.responseText);
			return;
		}

		var thisFile= this.queueA[this.queueI][0];

		if (this.sliceOffset==0) //first slice, store file names
		  this.fileTarget= e.target.responseText;
		  
//todo:	check for error
		if (!0)
		  this.sliceOffset+= this.blobSize;

		//that was last
		if (this.sliceOffset>=thisFile.size){
			this.fileProgressCB(1); //100%

			//remove first form and procceed
			delete this.queueA[this.queueI];
			this.goQueue();
			return;
		}

		this.blobCut();
	}

	
	/*
		update upload progress value
	*/
	this.fileProgressCB= function(complete){
		var thisFile= this.queueA[this.queueI][0];
		var thisNote= this.queueA[this.queueI][1];

		if (!complete){ //progress
			thisNote.setState(C_progress,this.sliceOffset/thisFile.size);
		} else { //complete
			thisNote.content("<a href='/file" +this.fileTarget +"'>" +thisFile.name +"</a>");
			thisNote.editAccept();
//		this._note_.style.backgroundImage= "url(/file" +guidS +")";
		}
	}
};


if (UPLOAD){
	DOM.boardUpload.onclick= //start pick files
	  function(e){UPLOAD.byForm()};
	DOM.filePick.onchange= //end pick files
	  function(e){UPLOAD.filesSelected()};
	if (IS.dnd){ //dnd
		DOM.workField.ondragover=	function(){return false}; //need to be declared
		DOM.workField.ondragleave=	function(){return false}; //need to be declared
		DOM.workField.ondrop=	function(e){UPLOAD.filesSelected()};
	}


//wrap blob methods
	if (!XMLHttpRequest.prototype.sendAsBinary)
	  XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
		function byteValue(x) {
			return x.charCodeAt(0) & 0xff;
		}
		var ords = Array.prototype.map.call(datastr, byteValue);
		var ui8a = new Uint8Array(ords);
		this.send(ui8a.buffer);
	  }

	if (!File.prototype.slice){
		if (File.prototype.webkitSlice)
		  File.prototype.slice= File.prototype.webkitSlice;
		else if (File.prototype.mozSlice)
		  File.prototype.slice= File.prototype.mozSlice;
	}
}