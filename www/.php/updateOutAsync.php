<?

/*
	Form prepared update data for Async responce
*/

if (!$NOPROFILE) foreach ($_profile as $curProfile) echo $curProfile;

//todo:	document over return values
//todo: exclude delimiters from values: \n ; , =

foreach ($notesA->all() as $noteP){
	echo implode($ASYGN->D_ITEM, Array(
		$ASYNC_PLACE->SIGN=> $noteP->isBreef? $ASYGN->NBREEF : $ASYGN->NFULL,
		$ASYNC_PLACE->UPN_OLDID=> $noteP->clientId,
		$ASYNC_PLACE->UPN_ID=> $noteP->id,
		$ASYNC_PLACE->UPN_VER=> $noteP->version,
		$ASYNC_PLACE->UPN_NAME=> $noteP->name,
		$ASYNC_PLACE->UPN_STYLE=> $noteP->style,
		$ASYNC_PLACE->UPN_OWNER=> $noteP==$boardReq? $whoId : $noteP->ownerId, //force return boards owner if any
		$ASYNC_PLACE->UPN_EDITOR=> $noteP->editorId,
		$ASYNC_PLACE->UPN_RIGHTS=> $noteP->rights>0? $noteP->rights : 0,
		$ASYNC_PLACE->UPN_RIGHTGRPA=> implode($ASYGN->D_LIST, $noteP->rightGrps),
		$ASYNC_PLACE->UPN_INHERIT=> $noteP->inherit, //-1 for implicit of any sort
		$ASYNC_PLACE->UPN_STAMP=> $noteP->stamp
	)) .$ASYGN->D_UNIT;

	if (!$noteP->isBreef)
	  foreach ($noteP->data as $dataP)
	    echo implode($ASYGN->D_ITEM, Array(
			$ASYNC_PLACE->SIGN=> $ASYGN->NDATA,
			$ASYNC_PLACE->UPD_ID=> $dataP->id,
			$ASYNC_PLACE->UPD_VER=> $dataP->version,
			$ASYNC_PLACE->UPD_DTYPE=> $dataP->datatype,
			$ASYNC_PLACE->UPD_DATA=> $dataP->data,
			$ASYNC_PLACE->UPD_EDITOR=> $dataP->editorId,
			$ASYNC_PLACE->UPD_STAMP=> $dataP->stamp,
			$ASYNC_PLACE->UPD_PLACE=> $dataP->place
	    )) .$ASYGN->D_UNIT;
}
	
foreach ($usersA->all() as $userP)
  echo implode($ASYGN->D_ITEM,Array(
	$ASYNC_PLACE->SIGN=> $userP->id==$USER->id? $ASYGN->YOU : $ASYGN->USER,
	$ASYNC_PLACE->UPU_ID=> $userP->id,
	$ASYNC_PLACE->UPU_VER=> $userP->version,
	$ASYNC_PLACE->UPU_NAME=> $userP->name,
	$ASYNC_PLACE->UPU_RELATION=> $userP->relation,
	$ASYNC_PLACE->UPU_GROUPID=> $userP->groupId,
	$ASYNC_PLACE->UPU_BOARDLIST=> implode($ASYGN->D_LIST, $userP->boardLst),
	$ASYNC_PLACE->UPU_CONTACTSLIST=> implode($ASYGN->D_LIST, $userP->contactLst)
  )) .$ASYGN->D_UNIT;


if (!$NOPROFILE){
	echo "t;output;". round((microtime(true) -$__startTime)*1000)/1000 .$ASYGN->D_UNIT;
	echo "t;;". round((microtime(true) -$___startTime)*1000)/1000 .$ASYGN->D_UNIT;
}

?>