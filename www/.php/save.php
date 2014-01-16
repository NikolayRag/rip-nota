<?

include('class-note.php');
include('class-nData.php');
include('sqTmpl/SQLTSave.php');




function svParseInput($_postIn, $notesA, $dataA) {
	global $ASIDX_SAVE, $ASYGN, $SAVE_RES, $SAVE_STATES, $CORE_VERSION, $USER;
	foreach ($_postIn as $entityId=> $entityData){
		$entityIdSplit= array();
		if (!preg_match("/^($ASYGN->NBREEF|$ASYGN->NDATA)(-?\\d+)\$/", $entityId, $entityIdSplit))
		  continue;
		$curId= $entityIdSplit[2];
		$entityDataA= explode($ASYGN->D_ITEM,$entityData);
		switch ($entityIdSplit[1]) {
			case $ASYGN->NBREEF:
				$curNote= new Note(
					$curId,
					0, arrGet($entityDataA,$ASIDX_SAVE->N_NAME,''),
					0, $USER->id,
					arrGet($entityDataA,$ASIDX_SAVE->N_INHERIT,0),
					0, arrGet($entityDataA,$ASIDX_SAVE->N_VER, $CORE_VERSION->INIT),
					arrGet($entityDataA,$ASIDX_SAVE->N_STYLE,'')
				 );
				$curNote->forSave= $SAVE_STATES->READY;
//				$curNote->rightGrps= explode($ASYGN->D_LIST,arrGet($entityDataA,$ASIDX_SAVE->R_RIGHTS,''));
				$notesA->add($curId,$curNote);
				break;
			case $ASYGN->NDATA:
				$curData= new NData(
					$curId,
					$USER->id,
					arrGet($entityDataA,$ASIDX_SAVE->D_DTYPE,0),
					arrGet($entityDataA,$ASIDX_SAVE->D_DATA,''),
					arrGet($entityDataA,$ASIDX_SAVE->D_VER, $CORE_VERSION->INIT),
					0, arrGet($entityDataA,$ASIDX_SAVE->D_PLACE,'')
				);
				$curData->forSave= $SAVE_STATES->READY;
				if ($curData->version==$CORE_VERSION->INIT)
				  $curData->rootNote = arrGet($entityDataA,$ASIDX_SAVE->D_PARENT,0);
				$dataA->add($curId,$curData);
				break;
		} 
	}
}



function svFetchData($_dataA,$_notesA){
	global $SAVE_RES, $SAVE_STATES, $DATA_TYPE;

	//read existent Data from db
	$dataIdA= Array();
	foreach($_dataA->all() as $curData)
	  if ($curData->id>0)
	    $dataIdA[]= $curData->id;
	$rDataA= dataBDById($dataIdA);

	foreach($_dataA->all() as $curData){
		if ($curData->id>0){ //existent Data
			//db-unexistent Data
			if (!array_key_exists($curData->id, $rDataA)){
				$curData->saveRes= $SAVE_RES->DB_ERR;
				$curData->forSave= $SAVE_STATES->IDLE;
				continue;
			}	

			$dbData= $rDataA[$curData->id];

			//misversion
			if ($curData->version>$dbData->version){
				$curData->saveRes= $SAVE_RES->VERSION_ERR;
				$curData->forSave= $SAVE_STATES->IDLE;
				continue;
			}

			//fetch from db
//todo: make increment in locked transaction
			$curData->version= $dbData->version+1;
			$curData->rootNote= $dbData->rootNote;
		} else { //creation mod:
			//new reference Note should be supplied
			if (
				$curData->datatype==$DATA_TYPE->NOTE
				&& $curData->data<1
				&& !$_notesA->get($curData->data)
			){
				$curData->saveRes= $SAVE_RES->PARAM_ERR;
				$curData->forSave= $SAVE_STATES->IDLE;
				continue;
			}

			//Parent Note should exist or be supplied.
			if ($curData->rootNote<0 && !$_notesA->get($curData->rootNote)){
				$curData->saveRes= $SAVE_RES->PARAM_ERR;
				$curData->forSave= $SAVE_STATES->IDLE;
				continue;
			}

		}
		//Data's root for rights; won't overwrite if exists
		$_notesA->add($curData->rootNote,new Note($curData->rootNote));


		//deletion mod: Deletes binded Note (if any) in case Data's Note is binded Note's root
		
	}
}



function svFetchNotes($_notesA){
	global $SAVE_RES, $SAVE_STATES, $NOTA_RIGHTS;

	//read Notes
	$noteIdA= Array();
	foreach($_notesA->all() as $curNote)
	  if ($curNote->id>0)
	    $noteIdA[]= $curNote->id;
	  else if ($curNote->inherit>0) //parents of new notes
	  	$noteIdA[]= $curNote->inherit;
	$rNoteA= notesBDById($noteIdA);
	notesGetRights($rNoteA);

	foreach($_notesA->all() as $curNote){
		if ($curNote->id>0){ //existent Note
			//db-unexistent Note
			if (!array_key_exists($curNote->id, $rNoteA)){
				$curNote->saveRes= $SAVE_RES->DB_ERR;
				$curNote->forSave= $SAVE_STATES->IDLE;
				continue;
			}	

			$dbNote= $rNoteA[$curNote->id];

			//misversion
			if ($curNote->version>$dbNote->version){
				$curNote->saveRes= $SAVE_RES->VERSION_ERR;
				$curNote->forSave= $SAVE_STATES->IDLE;
				continue;
			}

			//fetch from db
			$curNote->rights= $dbNote->rights;
//todo: make increment in locked transaction
			$curNote->version= $dbNote->version+1;
			$curNote->ownerId= $dbNote->ownerId;
			$curNote->inherit= $dbNote->inherit;
		} else { //creation mod:
			//Ancestor should exist or be supplied.
			if ($curNote->inherit<1 && !array_key_exists($curNote->inherit, $rNoteA)){
				$curNote->saveRes= $SAVE_RES->PARAM_ERR;
				$curNote->forSave= $SAVE_STATES->IDLE;
				continue;
			}

			$curNote->rights=
			  $curNote->inherit>0
			  ? $rNoteA[$curNote->inherit]->rights
			  : $NOTA_RIGHTS->OWN;
		}

		//deletion mod: Deletes all Data binded Notes whose root is this Note.
		// (get db; append to $rNoteA)
	}
}


function svSaveNotes($_notesA){
	global $NOTA_RIGHTS, $SAVE_RES, $SAVE_STATES, $CORE_VERSION;
	global $DB, $USER;

	foreach($_notesA as $curNote)
	  if ($curNote->forSave == $SAVE_STATES->READY){
		$curNote->forSave= $SAVE_STATES->IDLE;

		if ($curNote->rights<=$NOTA_RIGHTS->RO){ //no rights
			$curNote->saveRes= $SAVE_RES->SECURITY_ERR;
			continue;
		}

		if ($curNote->version==$CORE_VERSION->INIT){ //create
			$sqRes= $DB->apply('saveNoteAdd',$USER->id,$curNote->name,$curNote->style,$curNote->inherit,$USER->id);
			$curNote->saveRes= $DB->lastInsertId();
		} else { //update
			$sqRes= $DB->apply('saveNoteUpdate',$curNote->id,$curNote->version,$curNote->isDeleted,$curNote->ownerId,$curNote->name,$curNote->style,$curNote->inherit,$USER->id);
			$curNote->saveRes= $curNote->version;
		}

		if (!$sqRes)
		  $curNote->saveRes= $SAVE_RES->SQL_ERR;
	  }

//		if ($curNote->forSave){
//			//todo: do saving rights
//		}
}

function svSaveData($_dataA,$_notesA){
	global $NOTA_RIGHTS, $SAVE_RES, $SAVE_STATES, $CORE_VERSION, $DATA_TYPE;
	global $DB, $USER;

	foreach($_dataA as $curData)
	  if ($curData->forSave == $SAVE_STATES->READY){
		$curData->forSave= $SAVE_STATES->IDLE;

		$curRoot= $_notesA->get($curData->rootNote);
		if (!$curRoot){ //no parent
			$curData->saveRes= $SAVE_RES->PARAM_ERR;
			continue;
		}
		if ($curRoot->rights<=$NOTA_RIGHTS->RO){ //no rights
			$curData->saveRes= $SAVE_RES->SECURITY_ERR;
			continue;
		}

		if ($curData->datatype==$DATA_TYPE->NOTE){ //correct referenced ID
			$refNote= $_notesA->get($curData->data);
			if ($curData->data<1){
				if ($refNote->saveRes<1){ //invalid ref note
					$curData->saveRes= $SAVE_RES->REFERENCE_ERR;
					continue;
				}
				$curData->data= $refNote->saveRes;
			}
		}

		$tPlace= explode(',',$curData->place);
		if ($curData->version==$CORE_VERSION->INIT){ //create
			$sqRes= $DB->apply('saveDataAdd',$curData->rootNote,$curData->datatype,$curData->data,$tPlace[0],$tPlace[1],$tPlace[2],$tPlace[3],$USER->id);
			$curData->saveRes= $DB->lastInsertId();
		} else { //update
			$sqRes= $DB->apply('saveDataUpdate',$curData->id,$curData->version,$curData->isDeleted,$curData->rootNote,$curData->datatype,$curData->data,$tPlace[0],$tPlace[1],$tPlace[2],$tPlace[3],$USER->id);
			$curData->saveRes= $curData->version;
		}

		if (!$sqRes)
		  $curData->saveRes= $SAVE_RES->SQL_ERR;
	  }
}


/*
Function compares and saves list of changes separately to Notes and to Data.
Every update to each entity is done incrementally, every time increasing entity's version.
Rights are updated instantly. In case of updating ONLY rights, old Note version is returned.

Arguments:
	n(id)= [
		0: saveMode
		1: version
		2: rootNoteId
		3: name
		4: style
		5: rightsList
	]:
		';'-separated Note contents to be saved, where...

		saveMode &1:
			Incrementally save Note
//		saveMode &2:
//			Directly set rights using supplied Right array;
//			Note entity is not really updated

		version =-1:
			Create new Note;
			mod: Ancestor should exist or be supplied.
		version =0:
			Delete Note; No more arguments needed
			mod: Deletes all Data binded Notes whose root is this Note.
		version >0:
			Change Note normally

		rootNoteId =0:
			Created Note is toplevel.
		rootNoteId >0:
			Created Note is derived.

		name:
			String

		style:
			String

		rightsList[groupId] =right:
			Right list, where -1 stands for removing right


	d(id)= [
		0: version
		1: noteId
		2: position
		3: dataType
		4: data
	]:
		';'-separated Data contents to be saved, where...

		version =-1:
			Create new Data;
			mod: Parent Note should exist or be supplied.
		version =0:
			Delete Data and link, if any;
			mod: Deletes binded Note (if any) in case Data's Note is binded Note's root.
		version >0:
			Change Data normally

		noteId:
			Note to bind created Data to.

		position:
			xy hint

		dataType:
			As defined in constants

		data:
			Raw data, based on dataType


	Return format:
		"(n|d)ID,($SAVE_RES|newVersion|newId);..."

*/

/*
Macro:
	-fillup Notes and Data objects
	read actual Data
		check missing Notes referenced from Data
			Data's root for rights
			creation mod: Data's root for save
			deletion mod: Data's binded Note (if it's root is Data's root)
	read actual Notes and assign rights
		check Note's references
			creation mod: Ancestor
			deletion mod: Data binded Notes (if it's root is Note's root)
	save entities
*/


$notesA= new Collect();
$dataA= new Collect();

svParseInput($_POST,$notesA,$dataA);

svFetchData($dataA,$notesA);

svFetchNotes($notesA);

svSaveNotes($notesA->all());
svSaveData($dataA->all(),$notesA);


$res= Array();
foreach ($notesA->all() as $oldId=>$note)
  if ($note->saveRes!=$SAVE_RES->INIT)
    $res[]= implode($ASYGN->D_LIST, Array($ASYGN->NBREEF, $oldId, $note->saveRes));
foreach ($dataA->all() as $oldId=>$nData)
  if ($nData->saveRes!=$SAVE_RES->INIT)
    $res[]= implode($ASYGN->D_LIST, Array($ASYGN->NDATA, $oldId, $nData->saveRes));

echo implode($ASYGN->D_ITEM,$res);

?>
