<?

include('class-note.php');
include('class-nData.php');
include('sqTmpl/SQLTSave.php');




function svParseInput($_postIn, $notesA, $dataA) {
	global $ASYNC_PLACE, $ASYGN, $SAVE_RES, $USER;
	foreach ($_postIn as $entityId=> $entityData){
		$entityIdSplit= array();
		if (!preg_match("/^($ASYGN->NBREEF|$ASYGN->NDATA)(-?\\d+)\$/", $entityId, $entityIdSplit))
		  continue;
		$entityDataA= explode($ASYGN->D_ITEM,$entityData);
		switch ($entityIdSplit[1]) {
			case $ASYGN->NBREEF:
				$curNote= new Note(
					$entityIdSplit[2],
					0, arrGet($entityDataA,$ASYNC_PLACE->SVN_NAME,''),
					0, $USER->id,
					arrGet($entityDataA,$ASYNC_PLACE->SVN_INHERIT,0),
					0, arrGet($entityDataA,$ASYNC_PLACE->SVN_VER,-1),
					arrGet($entityDataA,$ASYNC_PLACE->SVN_STYLE,'')
				 );
				$curNote->forSave= arrGet($entityDataA,$ASYNC_PLACE->SVN_CANSAVE,0);
				$curNote->rightGrps= explode($ASYGN->D_LIST,arrGet($entityDataA,$ASYNC_PLACE->SVN_RIGHTS,''));
				$notesA->add($entityIdSplit[2],$curNote);
				break;
			case $ASYGN->NDATA:
				$curData= new NData(
					$entityIdSplit[2],
					$USER->id,
					arrGet($entityDataA,$ASYNC_PLACE->SVD_DTYPE,0),
					arrGet($entityDataA,$ASYNC_PLACE->SVD_DATA,''),
					arrGet($entityDataA,$ASYNC_PLACE->SVD_VER,-1),
					0, arrGet($entityDataA,$ASYNC_PLACE->SVD_PLACE,'')
				);
				$curData->forSave= 1;
				$dataA->add($entityIdSplit[2],$curData);
				break;
		} 
	}
}



function svFetchData($_dataA,$_notesA){
	global $SAVE_RES;

	//read Data
	$dataIdA= Array();
	foreach($_dataA->all() as $nData)
	  if ($nData->id>0)
	    $dataIdA[]= $nData->id;
	$rDataA= dataBDById($dataIdA);

	//todo: deal with db-unexistent Notes
	foreach($rDataA as $nData){
		$curD= $_dataA->get($nData->id);
	
		if ($curD->version>$nData->version){
			$curD->saveRes= $SAVE_RES->VERSION_ERR;
			$curD->forSave= 0;
			continue;
		}

		$curD->version= $nData->version+1;
		$curD->rootNote= $nData->rootNote;
	}

	//check missing Notes referenced from Data
	foreach($_dataA->all() as $nData){
		//Data's root for rights
		$_notesA->add($nData->rootNote,new Note($nData->rootNote));

		//creation mod: Blank root Note created if not exist or supplied
		//deletion mod: Deletes binded Note (if any) in case Data's Note is binded Note's root
		
	}
}



function svFetchNotes($_notesA){
	global $SAVE_RES;

	//read Notes
	$noteIdA= Array();
	foreach($_notesA->all() as $note)
	  if ($note->id>0)
	    $noteIdA[]= $note->id;
	$rNoteA= notesBDById($noteIdA);
	notesGetRights($rNoteA);

	//todo: deal with db-unexistent Notes
	foreach($rNoteA as $note){
		$curN= $_notesA->get($note->id);
		if (!$curN)
		  continue;

		if ($curN->version>$note->version){
			$curN->saveRes= $SAVE_RES->VERSION_ERR;
			$curN->forSave= 0;
			continue;
		}

		$curN->rights= $note->rights;
		$curN->version= $note->version+1;
		$curN->ownerId= $note->ownerId;
		$curN->inherit= $note->inherit;
	}


	//modify Note's references
	foreach($_notesA->all() as $note){
		//creation mod: Skip if ancestor not exist or supplied.
		
		//deletion mod: Deletes all Data binded Notes whose root is this Note.
		// (get db; append to $rNoteA)
	}
}


function svSaveNotes($_notesA){
	global $SAVE_MODE, $NOTA_RIGHTS, $SAVE_RES, $CORE_VERSION;
	global $DB, $USER;

	foreach($_notesA as $note){
		if ($note->forSave &$SAVE_MODE->MAIN){

			if ($note->rights<=$NOTA_RIGHTS->RO){ //no rights
				$note->saveRes= $SAVE_RES->SECURITY_ERR;
				continue;
			}

			if ($note->version==$CORE_VERSION->INIT){ //create
				$sqRes= 0; //todo: creation
				$note->saveRes= $DB->lastInsertId();
			} else { //update
				$sqRes= $DB->apply('saveNote',$note->id,$note->version,$note->isDeleted,$note->ownerId,$note->name,$note->style,$note->inherit,$USER->id);
				$note->saveRes= $note->version;
			}

			if (!$sqRes)
			  $note->saveRes= $SAVE_RES->SQL_ERR;
		}

		if ($note->forSave &$SAVE_MODE->RIGHTS){
			//todo: do saving rights
		}
	}
}

function svSaveData($_dataA,$_notesA){
	global $SAVE_MODE, $NOTA_RIGHTS, $SAVE_RES, $CORE_VERSION;
	global $DB, $USER;

	foreach($_dataA as $nData)
	  if ($nData->forSave){
		if ($_notesA->get($nData->rootNote)->rights<=$NOTA_RIGHTS->RO){ //no rights
			$nData->saveRes= $SAVE_RES->SECURITY_ERR;
			continue;
		}

		if ($nData->version==$CORE_VERSION->INIT){ //create
			$sqRes= 0; //todo: creation
			$nData->saveRes= $DB->lastInsertId();
		} else { //update
			$tPlace= explode(',',$nData->place);
			$sqRes= $DB->apply('saveData',$nData->id,$nData->version,$nData->rootNote,$nData->isDeleted,$nData->datatype,$nData->data,$tPlace[0],$tPlace[1],$tPlace[2],$tPlace[3],$USER->id);
			$nData->saveRes= $nData->version;
		}

		if (!$sqRes)
		  $nData->saveRes= $SAVE_RES->SQL_ERR;
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
		saveMode &2:
			Directly set rights using supplied Right array;
			Note entity is not really updated

		version =-1:
			Create new Note;
			mod: Skip (rootNoteId=0) if ancestor not exist or supplied.
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
			mod: Blank root Note created if not exist or supplied.
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
			creation mod: root
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
