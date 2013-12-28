<?

/*
	Form prepared update data for Async responce
*/

if (!$NOPROFILE) foreach ($_profile as $curProfile) echo $curProfile;

//todo:	document over return values
//todo: exclude delimiters from values: \n ; , =

foreach ($notesA->all() as $noteP){
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
		$ASIDX_UPDCB->N_RIGHTGRPA=> implode($ASYGN->D_LIST, $noteP->rightGrps),
		$ASIDX_UPDCB->N_INHERIT=> $noteP->inherit, //-1 for implicit of any sort
		$ASIDX_UPDCB->N_STAMP=> $noteP->stamp
	)) .$ASYGN->D_UNIT;

	if (!$noteP->isBreef)
	  foreach ($noteP->data as $dataP)
	    echo implode($ASYGN->D_ITEM, Array(
			$ASIDX_UPDCB->SIGN=> $ASYGN->NDATA,
			$ASIDX_UPDCB->D_ID=> $dataP->id,
			$ASIDX_UPDCB->D_VER=> $dataP->version,
			$ASIDX_UPDCB->D_DTYPE=> $dataP->datatype,
			$ASIDX_UPDCB->D_DATA=> $dataP->data,
			$ASIDX_UPDCB->D_EDITOR=> $dataP->editorId,
			$ASIDX_UPDCB->D_STAMP=> $dataP->stamp,
			$ASIDX_UPDCB->D_PLACE=> $dataP->place
	    )) .$ASYGN->D_UNIT;
}
	
foreach ($usersA->all() as $userP)
  echo implode($ASYGN->D_ITEM,Array(
	$ASIDX_UPDCB->SIGN=> $userP->id==$USER->id? $ASYGN->YOU : $ASYGN->USER,
	$ASIDX_UPDCB->U_ID=> $userP->id,
	$ASIDX_UPDCB->U_VER=> $userP->version,
	$ASIDX_UPDCB->U_NAME=> $userP->name,
	$ASIDX_UPDCB->U_RELATION=> $userP->relation,
	$ASIDX_UPDCB->U_GROUPID=> $userP->groupId,
	$ASIDX_UPDCB->U_BOARDLIST=> implode($ASYGN->D_LIST, $userP->boardLst),
	$ASIDX_UPDCB->U_CONTACTSLIST=> implode($ASYGN->D_LIST, $userP->contactLst)
  )) .$ASYGN->D_UNIT;


if (!$NOPROFILE){
	echo "t;output;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
	echo "t;;". round((microtime(true) -$___startTime)*1000)/1000 .$ASYGN->D_UNIT;
}

?>