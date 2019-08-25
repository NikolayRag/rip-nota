<?
$notesImpId= -1; //implicit autodec id; would be replaced with client-requested id at output
$notesImpCache= new collect();

/*
	Substitute supplied Note with template or make new Note.
	All Id's are impersonated, except of .id which can be leaved original if requested directly
	Note returned is unbreefed with setting all it data to isImplicit.
	  This is used later (and outside) to anonimize leaf Notes and their data owners
*/
//todo: compact thrown error substitutions.
//todo: should subst only data, without building reference to other Notes
function formSubst($_template){
	global $notesImpId, $notesImpCache, $DATA_TYPE, $DB;

	if ($notesImpCache->get($_template))
	  return $notesImpCache->get($_template);

	$DB->apply('substNoteId',$_template);
	$fillNote= new Note($DB->fetch('id',0),1);
	$fillNote->rights= 0;
	$fillNote->inherit= -1;
	notesUnbreef(Array($fillNote));
	$imDId= 1;
	foreach ($fillNote->data as $nData){ //Attached Notes should be impersonated later: inherit, ownerId
		if ($nData->datatype!=$DATA_TYPE->NOTE)
		  continue;
		$nData->id= $imDId++;
		$nData->editorId= 0;
		$nData->isImplicit= 1;
	}
	$fillNote->id= $notesImpId--;

	$notesImpCache->add($_template,$fillNote);
	return $fillNote;
}


/*
	Create implicit ro Note using supplied string rules
	for $you user looking at $owner
*/
//todo: make both homePrivate and homePublic
function formImplicit($_rule,$youId,$ownerId=0){
	global $notesImpId, $DATA_TYPE, $DB;


	$DB->apply('substNoteId',$_rule);
	$fillNote= new Note($DB->fetch('id',0),1);
	$fillNote->rights= 0;
	$fillNote->inherit= -1;
	notesUnbreef(Array($fillNote));
	$imDId= 1;
	foreach ($fillNote->data as $nData){ //Attached Notes should be impersonated later: inherit, ownerId
		if ($nData->datatype!=$DATA_TYPE->NOTE)
		  continue;
		$nData->id= $imDId++;
		$nData->editorId= 0;
		$nData->isImplicit= 1;
	}

	$fillNote->id= $notesImpId--;
	return $fillNote;
}

?>