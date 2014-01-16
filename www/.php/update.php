<?

include('class-note.php');
include('class-nData.php');
include('class-uData.php');
include('sqTmpl/SQLTUpdate.php');

$notesA= new Collect();
$usersA= new Collect();


$_profile= array('i;SQL;' .$DB->callsCnt .$ASYGN->D_UNIT);
$_profile[]= "t;start;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
$__startTime= microtime(true);


//todo: //Macro:	0) Parse requests other than xxx/yyy

$DB->apply('dbStamp');
$dbStamp= (int)$DB->fetch(0);

//Macro:	1) Get requested Note (full) and User

if (
	array_key_exists('rId',$_POST)
	&& $_POST['rId']>0
) { //use supplied exact Note by ID; fetch Who, What and whoId for non-NativeImps.
	$brA= notesById(Array($_POST['rId']));
	$boardReq= $brA[$_POST['rId']];
	$whoId= $boardReq->ownerId;
} else if (
	array_key_exists('rWho',$_POST) && $_POST['rWho']!=''
	&& array_key_exists('rWhat',$_POST) && $_POST['rWhat']!=''
) { //using both user/notename, get Note and User Id's
	$brA= noteByNamed($_POST['rWho'],$_POST['rWhat']);
	$boardReq= $brA[0];
	$whoId= $brA[1];
} else { //partial request; entry for full imps
	$brA= noteByImp(array_key_exists('rWho',$_POST)?$_POST['rWho']:'');
	$boardReq= $brA[0];
	$whoId= $brA[1];
}
if (array_key_exists('rId',$_POST))
  $boardReq->clientId= $_POST['rId'];

notesUnbreef(Array($boardReq));

//init return data
$notesA->add($boardReq->id,$boardReq); //fill root requested Note
$usersA->add($USER->id, new User($USER->id,'',0,0)); //fill you
$usersA->add($whoId, new User($whoId,'',0,0));

$_profile[]= "t;request;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
$__startTime= microtime(true);


//Macro:	2) Get list of derived Notes (full); ONLY for datatype==note

$leafNotesReq= Array();
foreach ($boardReq->data as $leaf) //form leaf notes list from first $notesA note
  if (
	$leaf->datatype==$DATA_TYPE->NOTE
	&& !$notesA->get($leaf->data)
  ) //make sure leaf points to other unfetched note
    $leafNotesReq[]= $leaf->data;

$leafNotesA= notesById($leafNotesReq);
foreach ($leafNotesA as $noteP) //reveal leaf notes
  $notesA->add($noteP->id,$noteP);

//make implicit leafs Notes implicit
foreach ($boardReq->data as $leaf){
	if (
		$leaf->datatype!=$DATA_TYPE->NOTE
		|| !$leaf->isImplicit
	)
	  continue;
	$noteIn= $notesA->get($leaf->data);
	$noteIn->inherit=
	  $noteIn->ownerId=
	  0;
	$noteIn->isImplicit= 1;
}
notesUnbreef($leafNotesA);

$_profile[]= "t;notes;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
$__startTime= microtime(true);

//todo:  make inherits be gathered back from notesFillRights()

//Macro:	2b) Get list of all parent Notes to be inherited [once] with implicit forking (breef)

$boardsLstA= Array(); //to fetch
foreach ($notesA->all() as $noteP) { //all Notes
	if (
		!$noteP->isImplicit
		&& $noteP->inherit>0
		&& !$notesA->get($noteP->inherit)
	)
	  $boardsLstA[]= $noteP->inherit;
}

//append permitted notes at usersA and form user's allowed boardlist
$boardA= notesById($boardsLstA);
foreach ($boardA as $boardP)
  if (!$boardP->isImplicit) //not fetched yet
    $notesA->add($boardP->id,$boardP);

$_profile[]= "t;inherit;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
$__startTime= microtime(true);


//Macro:	3) Get list of personal Contacts (breef)

//list all related to user (if not guest). Store any at contactlist. Set other relation
if ($USER->id && $DB->apply('contactsByUser', $USER->id, $USER->id)){
	while ($rowC= $DB->fetch()){
		$id_contact= 0;
		if ($USER->id == $rowC['id_me'])
		  $id_contact= $rowC['id_who'];
		if ($USER->id == $rowC['id_who'])
		  $id_contact= $rowC['id_me'];
		if ($id_contact){
			$usersA->add($id_contact, new User($id_contact));
			$_him= $usersA->get($id_contact); //get back reused
			$_you= $usersA->get($USER->id);
			if ($id_contact == $rowC['id_who'])
			  $_him->stateOut= $rowC['state'];
			else
			  $_him->stateIn= $rowC['state'];
			if (!array_key_exists($id_contact,$_you->contactLst)) //skip duplicate
			  $_you->contactLst[$id_contact]= $id_contact;
		}
	}
	
	//restore relations for all but userself and anon
	foreach ($usersA->all() as $contactP)
	  if ($contactP->id>0 && $contactP->id!=$USER->id)
	    $contactP->relations();
}

$_profile[]= "t;contacts;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
$__startTime= microtime(true);


//Macro:	3a) Get User/Owner board Notes list and Notes (breef)

$lstBoardA= Array();
if ($USER->id>0)
  $lstBoardA[]= $USER->id;
if ($whoId>0 && $USER->id!=$whoId)
  $lstBoardA[]= $whoId;

if (count($lstBoardA)>0) { //not for system/guest
	//get all boards list
	$boardsLstA= Array(); //to fetch
	$boardsListA= Array(); //entire list
//todo: without deleted
	$DB->apply('noteListByUsers', $lstBoardA);
	while ($rowVId= $DB->fetch('id',0)) {
		$boardsListA[]= $rowVId;
		if (!$notesA->get($rowVId)) //not fetched yet
		  $boardsLstA[]= $rowVId;
	}

	//append permitted notes at usersA and form user's allowed boardlist
	$boardA= notesById($boardsLstA);
	foreach ($boardA as $boardP) //fill up unexistent and unsubstituted  at first
	  if (!$boardP->isImplicit) //not fetched yet
	    $notesA->add($boardP->id,$boardP);

	foreach ($boardsListA as $boardId) //fill boardlist for You and User at once
	  if (
		($noteIn= $notesA->get($boardId))
		&& !$noteIn->isImplicit
	  )
	    $usersA->get($noteIn->ownerId)->boardLst[]= $boardId;
}

$_profile[]= "t;boards;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
$__startTime= microtime(true);





//Macro:	4) Get list of Note Contacts (breef), without anon
//Macro:	4b) fill all unreferencing Data

foreach ($notesA->all() as $noteP){ //all Notes
	if ($noteP->ownerId)
	  $usersA->add($noteP->ownerId, new User($noteP->ownerId));

	foreach ($noteP->data as $leafP) //and all leafs
	  if (
	  	$leafP->editorId
	  	&& $leafP->datatype==$DATA_TYPE->NOTE
	  )
		$usersA->add($leafP->editorId, new User($leafP->editorId));
}




//fill users breef (names and relations)
$idLstA= Array();
foreach ($usersA->all() as $userP)
  $idLstA[]= $userP->id;
$DB->apply('usersByIds', $idLstA);
while ($rowU= $DB->stmt->fetch()){
	$usersA->get($rowU['user_id'])->name= $rowU['first_name'];
	$usersA->get($rowU['user_id'])->stamp= $rowU['stamp'];
//todo: move version check elswhere for incrementals
	$usersA->get($rowU['user_id'])->version= $rowU['version'];
}

$_profile[]= "t;users;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
$__startTime= microtime(true);

?>