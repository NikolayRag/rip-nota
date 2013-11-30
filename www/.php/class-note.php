<?

include('class-note.rights.php');
include('class-note.implicit.php');
include('sqTmpl/SQLTNote.php');

class Note {
	var $id, $name, $ownerId, $editorId, $isImplicit, $inherit, $stamp, $version, $style, $isDeleted; //constructor arguments
	var $data= Array(), $rights= -1, $rightGrps= Array(), $isBreef= 1, $clientId= 0, $forSave= 0, $saveRes;
		
	function Note($_id= 0, $_isImplicit= 0, $_name= '', $_ownerId= 0, $_editorId= 0, $_inherit= 0, $_stamp= 0, $_version= 1, $_style= '', $_isDeleted= 0) {
		global $SAVE_RES;

		$this->id= $_id;
		$this->isImplicit= $_isImplicit;
		$this->name= $_name;
		$this->ownerId= $_ownerId;
		$this->editorId= $_editorId;
		$this->inherit= $_inherit;
		$this->stamp= $_stamp;
		$this->version= $_version;
		$this->style= $_style;
		$this->isDeleted= $_isDeleted;

		$this->saveRes= $SAVE_RES->INIT;
	}
	
	function copy($_inNote,$_hideId=true){
		if ($_hideId)
		 $this->id= $_inNote->id;
		$this->inherit= $_inNote->inherit;
		$this->ownerId= $_inNote->ownerId;
		$this->editorId= $_inNote->editorId;

		$this->name= $_inNote->name;
		$this->isImplicit= $_inNote->isImplicit;
		$this->stamp= $_inNote->stamp;
		$this->version= $_inNote->version;
		$this->style= $_inNote->style;
		$this->data= $_inNote->data;
		$this->rights= $_inNote->rights;
		$this->rightGrps= $_inNote->rightGrps;
		$this->isDeleted= $_inNote->isDeleted;
		$this->isBreef= $_inNote->isBreef;
	}

}

//todo: make updateNotesById
//todo: optimize: make this bulk-optimized, at SQL especially
/*
	Make breef Notes array for id's array.
	Returned implicit Notes all have 'inherit' and 'ownerId' set blank
	On any errors noBoard substs are returned
	
	return: array of new Notes.
	
	arg:
		id's array
*/
function notesById($_idWhatA){
	$rNoteA= notesBDById($_idWhatA);
	noteAssignRights($rNoteA,false); //2.1, 2.2: rights; leave id's alone

	foreach ($_idWhatA as $idWhat) //1: no requested Note
	 if (!array_key_exists($idWhat,$rNoteA)){ //subst absent
		$_tmpn= formSubst('noBoard');
		$_tmpn->id= $idWhat;
		$rNoteA[]= $_tmpn;
	 }
	return $rNoteA;
}

function notesBDById($_idWhatA){
	global $DB;

	$rNoteA= Array();
	if ($DB->apply('notesByIds',$_idWhatA)) //2: read Notes from base
	  while ($qND= $DB->fetch())
	    $rNoteA[$qND['id']]= new Note(
			$qND['id'],
			0,
			$qND['name'],
			$qND['id_owner'],
			$qND['id_editor'],
			$qND['inherit'],
			$qND['stamp'],
			$qND['version'],
			$qND['style'],
			$qND['isdeleted']
	    );

	return $rNoteA;
}

/*	
	Get dBase Note for exact user/note named request. 
	Error substitution is performed implicitely with noteAssignRights() for restricted/deleted
	or explicitely if theres no specified user on board.
		
	return: 2-elements array of new actual Note and resolved owner Id if any.
	
	arg:
		UserName
		NoteName
*/
function noteByNamed($_uName,$_nName){
	global $DB;

	$DB->apply('userByName1',$_uName);
	$uId= $DB->fetch('user_id', 0);
	if (!$uId) //1: no requested user
	 return Array(formSubst('noUser'),0);
	//2: user found

	$DB->apply('noteByName1',$uId,$_nName);
	$row= $DB->fetch();
	if ($row==false) //3: no requested Note
	 return Array(formSubst('noBoard'),$uId);
	//4: all's ok

	$rNote= new Note(
		arrGet($row,'id',0),
		0,
		$_nName,
		$uId,
		arrGet($row,'id_editor',0),
		arrGet($row,'inherit',0),
		arrGet($row,'stamp',0),
		arrGet($row,'version',1),
		arrGet($row,'style',''),
		arrGet($row,'isdeleted',0)
	);

	noteAssignRights(Array($rNote)); //4.1, 4.2: check availability
	return Array($rNote,$uId);
}


/*	
	Make implicit Note for requested or implicit user. 
	Error substitution is performed explicitely if there's no specified user.
		
	return: 2-elements array of new actual Note and resolved owner Id if any.
	
	arg:
		UserName
*/
function noteByImp($_uName=''){
	global $USER, $DB;
	if ($_uName== '') { //1: user not supplied
		if (!$USER->signed)  //1.1: anon welcome
		 return Array(formImplicit('welcome', $USER->id), 0);

		//1.2: private home, same as 3.1
		return Array(
			formImplicit('homePrivate', $USER->id),
			$USER->id
		);
	}
	$DB->apply('userByName1',$_uName);
	$uId= $DB->fetch('user_id',0);
	if (!$uId) //2: no requested user
	 return Array(formSubst('noUser'),0);
	//3: user found

	if ($uId== $USER->id) //3.1: private home, same as 1.2
	 return Array(
		formImplicit('homePrivate',$USER->id),
		$USER->id
	 );
	else //3.2: public home
	 return Array(
		formImplicit('homePublic',$USER->id,$uId),
		$uId
	 );
}


/* Macro:
	filter_out_deleted
		get_ancestors_ids
		read_rights
	subst_unavailable
*/
/*
	get Note's right for current user
	and substitute unavailable with substs
	//return: errorcode
	//	0: ok
	//	1: any
	argument:	Notes array
	
	Rights assigned are always at least 0=ro as all restricted Notes are substituted with ro errormessage Note.
*/
function noteAssignRights($_noteInA,$_hideId=true){
	global $notesA;

	$notesUnImpA= Array();
	foreach ($_noteInA as $noteIn)
	  if (!$noteIn-> isImplicit){ //implicit's rights are implicitely declared as RO
   		if ($noteIn-> isDeleted){
			$noteIn-> copy(formSubst('noBoard'),$_hideId);
			$noteIn-> isDeleted= 1;
		} else //procceed
	    $notesUnImpA[]= $noteIn;
	  }

	notesGetRights($notesUnImpA, $notesA);

	foreach ($notesUnImpA as $noteIn)
	  if ($noteIn->rights==-1) //no chance for rights
	    $noteIn->copy(formSubst('noBoard'),$_hideId);
}

/*
	Get rights for array of Notes.
	Get ancestors to get inherited rights
*/
//todo:	define 'ancestor/root' at once
function notesGetRights($_noteInA, $_notesCacheA=false){
	global $USER;
	if (!count($_noteInA))
	  return;


	//cache all incoming Notes
	$innerCache= new Collect();
	if ($_notesCacheA)
	  foreach ($_notesCacheA->all() as $noteIn)
	    $innerCache->add($noteIn->id,$noteIn);

	foreach ($_noteInA as $noteIn)
	  $innerCache->add($noteIn->id,$noteIn);


//todo: simplify futher
	  
	//get ancestors: unsupplied
	$ancestorsIdA= Array();
	foreach ($_noteInA as $noteIn)
	  if (
	  	$noteIn->inherit>0
	  	&& !array_key_exists($noteIn->inherit, $ancestorsIdA)
	  	&& !$innerCache->get($noteIn->inherit)
	  )
	    $ancestorsIdA[$noteIn->inherit]= $noteIn->inherit;
	$ancestorsA= notesBDById($ancestorsIdA);

	//get ancestors: fillup rest of supplied
	foreach ($_noteInA as $noteIn)
	  if ($noteIn->inherit>0 && $innerCache->get($noteIn->inherit) && !array_key_exists($noteIn->inherit, $ancestorsA))
		$ancestorsA[$noteIn->inherit]= $innerCache->get($noteIn->inherit);

	
	//get bundle for rights resolving
	$notesForSec= new Collect();
	foreach ($_noteInA as $noteIn)
	  $notesForSec->add($noteIn->id,$noteIn);
	foreach ($ancestorsA as $noteIn)
	  $notesForSec->add($noteIn->id,$noteIn);
	  
	notesSecA($USER->id, $notesForSec->all());


	//apply inherited rights and restrictions for deleted ancestors
	foreach ($_noteInA as $noteIn)
	  if ($noteIn->inherit>0){
			$checkNote= $ancestorsA[$noteIn->inherit];
			if ($checkNote->rights>$noteIn->rights)
			  $noteIn->rights= $checkNote->rights;
			if ($checkNote->isDeleted) //inherit Note is deleted, no way
			  $noteIn->rights= -1;
	  }
}
?>