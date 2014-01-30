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

		-new form created from template
		-its pickFiles() called
		-on picked or DnD:
			-files are put into file queue
			-blank notes are created for each file
			-procceed file queue
*/

if (IS.dnd)
  var UPLOAD= new function(){

  /*
		New style, sliced blob mode
  */
	this.queueA= []; //[file,associated_note],..
	this.queueNow;
	
	this.isUploading= 0;
	this.timeoutUpProgress;
	

	this.sliceOffset;
	this.blobSize;
	
	this.fReader= new FileReader();
	this.fileGuid;	//server-side file guid


	/*
		Select files into individual form.
		One/several files accepted.

		New Form is created from template and queued for uploading
	*/
//todo: set final filename at start of upload, rather than end.
	this.byForm= function(){
		if (SESSION.board.PUB.rights<NOTA_RIGHTS.RW)
		  return;

		//choose files
		UPLOAD.formTry.pick.onchange= function(){this.filesSelected()}.bind(this);
		UPLOAD.formTry.pick.click();
	};


	/*
		Queue selected files after files are selected.
		If dndEvt supplied, method is called by Drag-n-Drop,
		otherwise it is called by selecting files in form.
		
		macro:
		-Get files from dnd of form
		-Create template notes,
		-Append filelist to queue,
		-Procceed with form queue.
	*/
	this.filesSelected= function(dndEvt){
		var thisFiles= dndEvt?
		  dndEvt.dataTransfer.files
		  : UPLOAD.formTry.pick.files;

//todo: get from tool if not dnd
//..		var clientX= dndEvt? dndEvt.clientX :100;
//..		var clientY= dndEvt? dndEvt.clientY: 100;

		//create associated notes and add file/note pair to queue
		for (var f=0; f<thisFiles.length; f++){
//..			var tmpN= workFieldDbl( {clientX:clientX+f*5, clientY:clientY+f*50}, thisFiles[f].name.base64_encode() );
//..			tmpN.setState(C_progress,0);

			this.queueA.push({file:thisFiles[f], note:'tmpN'});
		}
//todo: fix in place
//..		SESSION.board.PUB.ui.correct();

		//go
		if (!this.isUploading)
		  this.goQueue();
	};


	/*
		Files queue procceeded here
	*/
	this.goQueue= function(){
		//re-init index
		if (!(this.queueNow= this.queueA.shift())){ //queue empty, stop
			this.isUploading= false;
			return;
		}
		this.isUploading= true;

		this.sliceOffset= 0;
		this.blobSize= UPSET.BLOB_SIZE;
		this.blobCut();
	};


	/*
		repeatedly cut and (automatically) send slice
	*/
	this.blobCut= function(){
		var thisFile= this.queueNow.file;

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
	this.fReader.onloadend= function(e){
		if (e.target.readyState != FileReader.DONE)
		  return;

		var thisFile= this.queueNow.file;

//todo: use ASYNC
		var xhr = new XMLHttpRequest();
		xhr.addEventListener("load",this.blobSent,false);
		xhr.open('POST', "/.async/_uploadBlob.php");
		xhr.setRequestHeader("Content-Type", "application/x-binary; charset=x-user-defined");
		xhr.setRequestHeader("Filename", thisFile.name);
		xhr.setRequestHeader("File-guid", this.sliceOffset==0? "0":this.fileGuid); //reuse
		xhr.setRequestHeader("Filesize", thisFile.size);
		xhr.setRequestHeader("Slice-From", this.sliceOffset);
		xhr.setRequestHeader("Slice-Size", this.blobSize);
		xhr.sendAsBinary(e.target.result);
	}.bind(this);

	/*
		One slice is sent.
		
		Check for error, and retry if need
		Procceed to next slice or next file in queue
	*/
	this.blobSent= function(e) {
		if (e.target.status!=200) {
//todo: proper message
			UI.popW.up(DIC.uploadLimit +' ' +e.target.responseText);
			return;
		}

		var thisFile= this.queueNow.file;

		if (this.sliceOffset==0) //first slice, store file names
		  this.fileGuid= e.target.responseText;
		  
//todo:	check for error, retry
		if (!0)
		  this.sliceOffset+= this.blobSize;

		//that was last
		if (this.sliceOffset>=thisFile.size){
			this.fileProgressCB(1); //100%

			//procceed
			this.goQueue();
			return;
		}

		this.blobCut();
	}.bind(this);

	
	/*
		update upload progress value
	*/
	this.fileProgressCB= function(_complete){
		var thisFile= this.queueNow.file;
		var thisNote= this.queueNow.note;

console.log(this.sliceOffset/thisFile.size);
return;
/*..
		if (!_complete){ //progress
			thisNote.setState(C_progress,this.sliceOffset/thisFile.size);
		} else { //complete
			thisNote.content("<a href='/file" +this.fileGuid +"'>" +thisFile.name +"</a>");
			thisNote.editAccept();
//		this._note_.style.backgroundImage= "url(/file" +guidS +")";
		}
*/
	}
  };


if (UPLOAD){
	var tmplForm= DOM('uploadTmpl').children[0];
	UPLOAD.formTry= {
		form: tmplForm,
		pick: DOM('filePick', tmplForm),
		submit: DOM('upSubmit', tmplForm)
	};

	UI.DOM.workField.ondragover=	function(){return false}; //need to be declared
	UI.DOM.workField.ondragleave=	function(){return false}; //need to be declared
	UI.DOM.workField.ondrop=	function(e){UPLOAD.filesSelected(e); return false};


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

var xxx= DOCUMENT.bodyEl.appendChild(DOCUMENT.createElement('span'));
 xxx.innerHTML= 'upload';
 xxx.style.position= 'fixed';
 xxx.style.top= '100px';
 xxx.onclick= function(){UPLOAD.byForm()};

