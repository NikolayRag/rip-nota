/*
	legacy upload engine.

	Interface:
		byForm(_onPickedCB) initiates file selection.
		New hidden form is added for each selection to hold queued files.
		As files picked, supplied _onPickedCB(files[]) called,
		 returning upload container notes

	macro:

		-new form created from template
		-its pickFiles() called
		-on picked:
			-form put into form queue
			-blank notes are created for each file
			-submit queued form
			-on uploaded iFrame.onLoad() called
				-continue queue
*/
	


//todo: define at loading js
if (!IS.dnd){


var UPLOAD= new function(){
	this.onPickedCB;

	this.queueA= []; //forms/associated_notes
	this.queueNow;
	
	this.isUploading;
	this.timeoutUpProgress;

	//called every time upload is complete;
	//notice: context is UPLOAD, arg is iFrame
 	var _this= this;
 	DOM('legacyUploadFrame').onload= function(){_this.formUploadCB(this)};

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
		//make new form and choose files
		var cClone= UPLOAD.tmplForm.cloneNode(true);;
		var formTry= {
			form: cClone,
			pick: DOM('filePick', cClone),
			submit: DOM('upSubmit', cClone)
		};

		formTry.pick.onchange= function(){this.filesSelected(formTry)}.bind(this);
		formTry.pick.click();
	};
	
	this.byDnD= function(){
//dic:
		UI.popW.up('unsupported dnd');
		return;
	}

	/*
		Queue Form after files are selected.
		
		macro:
		-Check size,
		-Create template notes,
		-Append form to queue,
		-Procceed with form queue.
	*/
	this.filesSelected= function(_formTry){
		var formUpFname= _formTry.pick;
		
//todo: should move to tool's callback .(files[])
		//create associated notes
		var filesA= [];
		if (formUpFname.files){ //multi
			//check total length
			var tl=0;
			for (var f=0; f<formUpFname.files.length; f++)
			  tl+= formUpFname.files[f].size;
			if (tl>1480000000) {
				UI.popW.up(DIC.uploadLimit);
				return;
			}

			for (var f=0; f<formUpFname.files.length; f++)
			  filesA.push( formUpFname.files[f].name );
		} else //veeeeery legacy, no multi-file
		  filesA.push( formUpFname.value );

		//add to queue and go if not yet
		this.queueA.push({
			uploadForm:_formTry,
			notesA:this.onPickedCB(filesA)
		});
		if (!this.isUploading)
		  this.nextInQueue();
	};
	
	
	/*
		Form queue procceeded here

		macro:
		-Setup progress request
		-Start upload
		
	*/
	this.nextInQueue= function(){
		clearTimeout(this.timeoutUpProgress);
		if (!(this.queueNow= this.queueA.shift())){ //queue empty, stop
			this.isUploading= false;
			return;
		}
		this.isUploading= true;

		//set progress check
		var _this= this;
		this.timeoutUpProgress= setInterval(
			function(){
				SESSION.async(ASYNC_MODE.UPLOADPROGRESS_LEGACY, [], _this, _this.fileProgressCB)
			}, 2000
		);

		var thisForm= this.queueNow.uploadForm;
//check: should click() call work in some browsers?
		//should be in DOM for submit clicks to work
		DOCUMENT.body.appendChild(thisForm.form);
		thisForm.submit.click(); //fired and forgot
		DOCUMENT.body.removeChild(thisForm.form);
	};




	/*
		macro:
		-Update all notes with Complete state,
		-Procceed form queue
		
		resA= [[guidS|'']\n..]
	*/
	this.formUploadCB= function(_frame){
		var result= _frame.contentDocument.firstChild.lastChild.innerHTML;
		this.fileProgressCB(result);

		this.nextInQueue();
	}

	
	/*
		Update Progress for uploading files.
		When uploading files with forms, files are actually proccessed at once,
		so some of files can be set to 100% but yet not be available.
	
		res= '' if progress is called after end of upload, skipped
		res= [total%,[-1=err,0,1=done]:bytes,..]
	*/
	this.fileProgressCB= function(res){
		if (res=='') //blank when called after upload, skip
		  return;
console.log(res);
return;
/*..
		if (!Array.isArray(res)) //filters out end of upload
		  var resA= res.split(",");

		var thisForm= this.queueNow[0].children[1];
		var thisNotes= this.queueNow[1];

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
*/
	};

};

UPLOAD.tmplForm= DOM('uploadTmpl').children[0];


}
