<?

/*
	Form prepared update data for Async responce
*/

if (!$NOPROFILE) foreach ($_profile as $curProfile) echo $curProfile;

//todo:	document over return values
//todo: exclude delimiters from values: \n ; , =

$lastDbStamp= arrGet($_POST, 'last', 0);

//checklist: used only for deletion
//todo: depricate, replace with timestamp compare, hash, whatever
$checkNotesA= Array();
if (arrGet($_POST, 'chkN', false))
  foreach (explode($ASYGN->D_LIST, $_POST['chkN']) as $tmpI=>$chkNote)
    $checkNotesA[$chkNote]= true;

$checkDataA= Array();
if (arrGet($_POST, 'chkD', false))
  foreach (explode($ASYGN->D_LIST, $_POST['chkD']) as $tmpI=>$chkData)
    $checkDataA[$chkData]= true;

$checkUsersA= Array();
if (arrGet($_POST, 'chkU', false))
  foreach (explode($ASYGN->D_LIST, $_POST['chkU']) as $tmpI=>$chkUsers)
    $checkUsersA[$chkUsers]= true;



echo implode($ASYGN->D_ITEM, Array($ASYGN->STAMP,$dbStamp)), $ASYGN->D_UNIT;

foreach ($notesA->all() as $noteP){
	$nIdCheck= $noteP->clientId!=0? $noteP->clientId : $noteP->id;
	unset($checkNotesA[$nIdCheck]);
	if (
//		|| !array_key_exists($nIdCheck, $checkNotesA) //new
		$noteP->stamp>=$lastDbStamp //probably changed
		|| $noteP->id<0 //implicit
//todo: check if Note is set-unset implicit
//todo: check rights changed
	)
	  echo implode($ASYGN->D_ITEM, Array(
		$ASIDX_UPDCB->SIGN=> $noteP->isBreef? $ASYGN->NBREEF : $ASYGN->NFULL,
		$ASIDX_UPDCB->N_OLDID=> $noteP->clientId,
		$ASIDX_UPDCB->N_ID=> $noteP->id,
		$ASIDX_UPDCB->N_VER=> $noteP->version,
		$ASIDX_UPDCB->N_NAME=> $noteP->name,
		$ASIDX_UPDCB->N_STYLE=> $noteP->style,
		$ASIDX_UPDCB->N_OWNER=> $noteP==$boardReq? $whoId : $noteP->ownerId, //force return boards owner if any
		$ASIDX_UPDCB->N_EDITOR=> $noteP->editorId,
		$ASIDX_UPDCB->N_RIGHTS=> $noteP->rights>0? $noteP->rights : 0,
//todo: handle inherited rights and only for one requested Note
		$ASIDX_UPDCB->N_RIGHTGRPA=> implode($ASYGN->D_LIST, $noteP->rightGrps),
		$ASIDX_UPDCB->N_INHERIT=> $noteP->inherit, //-1 for implicit of any sort
		$ASIDX_UPDCB->N_STAMP=> $dbStamp-$noteP->stamp
	  )), $ASYGN->D_UNIT;
}

foreach ($notesA->all() as $noteP){
	if (!$noteP->isBreef)
	  foreach ($noteP->data as $dataP){
		unset($checkDataA[$dataP->id]);
	    if (
//			!array_key_exists($dataP->id, $checkDataA) //new
			$dataP->stamp>=$lastDbStamp //probably changed
		)
	      echo implode($ASYGN->D_ITEM, Array(
			$ASIDX_UPDCB->SIGN=> $ASYGN->NDATA,
			$ASIDX_UPDCB->D_ID=> $dataP->id,
			$ASIDX_UPDCB->D_VER=> $dataP->version,
			$ASIDX_UPDCB->D_ROOT=> $noteP->id,
			$ASIDX_UPDCB->D_DTYPE=> $dataP->datatype,
			$ASIDX_UPDCB->D_DATA=> $dataP->data,
			$ASIDX_UPDCB->D_EDITOR=> $dataP->editorId,
			$ASIDX_UPDCB->D_STAMP=> $dbStamp-$dataP->stamp,
			$ASIDX_UPDCB->D_PLACE=> $dataP->place
	      )), $ASYGN->D_UNIT;
	  }
}
	
foreach ($usersA->all() as $userP){
	unset($checkUsersA[$userP->id]);
	if (
//		!array_key_exists($userP->id, $checkUsersA) //new
		$userP->stamp>=$lastDbStamp //probably changed
	)
      echo implode($ASYGN->D_ITEM,Array(
		$ASIDX_UPDCB->SIGN=> $userP->id==$USER->id? $ASYGN->YOU : $ASYGN->USER,
		$ASIDX_UPDCB->U_ID=> $userP->id,
		$ASIDX_UPDCB->U_VER=> $userP->version,
		$ASIDX_UPDCB->U_NAME=> $userP->name,
		$ASIDX_UPDCB->U_RELATION=> $userP->relation,
		$ASIDX_UPDCB->U_GROUPID=> $userP->groupId,
		$ASIDX_UPDCB->U_BOARDLIST=> implode($ASYGN->D_LIST, $userP->boardLst),
		$ASIDX_UPDCB->U_CONTACTSLIST=> implode($ASYGN->D_LIST, $userP->contactLst)
      )), $ASYGN->D_UNIT;
}

//deleted shorthand
foreach ($checkNotesA as $delNote=>$tmpv)
  echo implode($ASYGN->D_ITEM,Array(
	$ASIDX_UPDCB->SIGN=> $ASYGN->NBREEF,
	$ASIDX_UPDCB->N_OLDID=> $delNote,
	$ASIDX_UPDCB->N_VER=> 0
  )), $ASYGN->D_UNIT;

foreach ($checkDataA as $delData=>$tmpv)
  echo implode($ASYGN->D_ITEM, Array(
	$ASIDX_UPDCB->SIGN=> $ASYGN->NDATA,
	$ASIDX_UPDCB->D_ID=> $delData,
	$ASIDX_UPDCB->D_VER=> 0
  )), $ASYGN->D_UNIT;

foreach ($checkUsersA as $delUser=>$tmpv)
  echo implode($ASYGN->D_ITEM,Array(
	$ASIDX_UPDCB->SIGN=> $ASYGN->USER,
	$ASIDX_UPDCB->U_ID=> $delUser,
	$ASIDX_UPDCB->U_VER=> 0
  )), $ASYGN->D_UNIT;


if (!$NOPROFILE){
	echo 'i;SQL;', $DB->callsCnt, $ASYGN->D_UNIT;
	echo "t;;". round((microtime(true) -$___startTime)*1000)/1000, $ASYGN->D_UNIT;
}

?>