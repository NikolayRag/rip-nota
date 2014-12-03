/*
	HTML5 upload engine.

	Interface:
		byForm(_onPickedCB) initiates file selection.
		As files picked, supplied _onPickedCB(files[]) called,
		 returning upload container notes

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

if (IS.dnd) {

var UPLOAD= new function(){
	var UploadFile= function(_file, _note){
		this.file= _file;
		this.note= _note;
		this.retries= 0;
		this.fileGuid= '';	//server-side file guid
	}

  /*
		New style, sliced blob mode
  */
	this.onPickedCB;

	this.queueA= []; //UploadFile,..
	this.queueNow;
	
	this.isUploading= 0;
	this.timeoutUpProgress;
	

	this.sliceOffset;
	this.blobSize;
	
	this.fReader= new FileReader();


	/*
		Select files into individual form.
		One/several files accepted.

		New Form is created from template and queued for uploading

		_onPickedCB([file,...]) is supplied callback
		returning array of notes for upload into
	*/
//todo: set final filename at start of upload, rather than end.
//PUBLIC
	this.byForm= function(_onPickedCB){
		if (SESSION.board.PUB.rights<NOTA_RIGHTS.RW)
		  return;

		this.onPickedCB= _onPickedCB;

		//choose files
		//form's .pushQueue assigned globally, as form is reused
		UPLOAD.formTry.pick.click();
	};


	this.byDnD= function(_filesA, _onPickedCB){
		if (SESSION.board.PUB.rights<NOTA_RIGHTS.RW)
		  return;

		this.onPickedCB= _onPickedCB;

		this.pushQueue(_filesA);
	}


	//add to queue and go if not yet
	this.pushQueue= function(_filesToUpload){
		var filesA= [];
		for (var f=0; f<_filesToUpload.length; f++)
		  filesA.push({name:_filesToUpload[f].name, size:_filesToUpload[f].size});

		var notesA= this.onPickedCB(filesA);
		for (var f=0; f<_filesToUpload.length; f++)
		  this.queueA.push( new UploadFile(_filesToUpload[f], notesA[f]) );
		if (!this.isUploading)
		  this.nextInQueue();
	}

	/*
		Files queue procceeded here
	*/
	this.nextInQueue= function(){
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
	this.fReader.onloadend= function(_e){
		if (_e.target.readyState != FileReader.DONE)
		  return;

		var thisFile= this.queueNow.file;

//todo: threat: check what is uploaded and where
		SESSION.async(ASYNC_MODE.UPLOAD_BLOB, _e.target.result, this.blobSentCB, this.blobSentErrCB, false, true, [
			['Filename', thisFile.name],
			['File-guid', this.sliceOffset==0? 0: this.queueNow.fileGuid], //reuse
			['Filesize', thisFile.size],
			['Slice-From', this.sliceOffset],
			['Slice-Size', this.blobSize]
		]);
	}.bind(this);

	/*
		One slice is sent.
		
		Check for error, and retry if need
		Procceed to next slice or next file in queue
	*/
	this.blobSentCB= function(_res) {
		if (_res==UPSET.RESTRICTED){
			UI.popW.up([DIC.uploadRestricted, this.queueNow.file.name]);
			this.nextInQueue();
			return;			
		}

		//OK at least

		if (this.sliceOffset==0) //first slice, store file names
		  this.queueNow.fileGuid= _res;
		  
		this.sliceOffset+= this.blobSize;

		//that was last
		if (this.sliceOffset>=this.queueNow.file.size){
			this.fileProgressCB(); //ensure 100% progress is called

			//procceed
			this.nextInQueue();
			return;
		}

		this.blobCut();
	}.bind(this);


	this.blobSentErrCB= function() {
		this.queueNow.retries+= 1;
		if (this.queueNow.retries>UPSET.MAX_RETRIES){
			this.queueNow.note.uploadError();
			this.isUploading= false;
		} else
		  this.blobCut();
	}.bind(this);

	/*
		update upload progress value
	*/
	this.fileProgressCB= function(){
		var filePerc= this.sliceOffset;

		this.queueNow.note.uploadSetPos(this.sliceOffset);
		if (this.sliceOffset==this.queueNow.file.size)
		  this.queueNow.note.uploadFinish(this.queueNow.fileGuid);
	}
};


var tmplForm= DOM('uploadTmpl').children[0];
UPLOAD.formTry= {
	form: tmplForm,
	pick: DOM('filePick', tmplForm),
	submit: DOM('upSubmit', tmplForm)
};

//bind
UPLOAD.formTry.pick.onchange= function(){
	UPLOAD.pushQueue(UPLOAD.formTry.pick.files)
};


}

















var nnn= function(_file){
	this.pos= -1;
	this.finished= false;
	this.err= false;
	this.name= _file.name;
	this.size= _file.size;

console.log('added: '+ _file.name);

	this.uploadSetPos= function(_filePos){
		if (this.err || _filePos<=this.pos)
		  return;

		this.pos= _filePos;
		console.log(this.name +': '+ (this.size? _filePos/this.size :0));
	}

	this.uploadFinish= function(_targ){
		if (this.err || this.finished)
		  return;
		this.uploadSetPos(this.size);

		this.finished= true;
		console.log(this.name +' set to '+ _targ);
	}

	this.uploadError= function(){
		if (this.err)
		  return;
		this.err= true;
		console.log(this.name +' ERROR!');
	}
}


var ccbb= function(_filesA,_place){
console.log('at '+ _place.x +'x' +_place.y +':');
	var fileNotesA= [];
	for (var f=0; f<_filesA.length; f++){
		fileNotesA.push(
			new nnn(_filesA[f])
		);
//		var tmpN= workFieldDbl(	{clientX:100+f*5, clientY:100+f*50}, _filesA.base64_encode() );
	}

//	SESSION.board.nFrontUI.correct();
	return fileNotesA;
}

var uplBtn= function(){
	UPLOAD.byForm(function(_filesInA){
		return ccbb(_filesInA,{x:'_e.clientX', y:'_e.clientX'});
	})
}


var xxx= DOCUMENT.bodyEl.appendChild(DOCUMENT.createElement('span'));
 xxx.innerHTML= 'upload';
 xxx.style.position= 'fixed';
 xxx.style.top= '100px';
 xxx.onclick= uplBtn;

if (IS.dnd) {
	UI.DOM.workField.ondragover=	function(){return false}; //need to be declared
	UI.DOM.workField.ondragleave=	function(){return false}; //need to be declared
	UI.DOM.workField.ondrop=	function(_e){
		UPLOAD.byDnD(_e.dataTransfer.files,function(_filesInA){
			return ccbb( _filesInA, {x:_e.clientX, y:_e.clientY} );
		});
		return false;
	}
}

