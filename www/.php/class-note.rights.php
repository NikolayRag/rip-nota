<?

//todo: forceReown
function notesSecA($_idMe, $_noteInA, $forceReown=0){
	global $DB;

	//1: get all implied owners
	$noteCheck= Array();
	$userIds= Array();
	foreach ($_noteInA as $noteIn)
	  if ($noteIn->ownerId>-1 && !$noteIn->isImplicit){
		$userIds[$noteIn->id]= $noteIn->ownerId;
		$noteCheck[$noteIn->id]= $noteIn; //and valid notes
	  }
	else
	  $noteIn->rights= 0;

	if (!count($noteCheck))
	  return;

	//2: the Groups YOU are in for all note's owner
	$youAreGFor= Array();
	$grpA= 1; $grpG= 2; $grpO= 3;
	foreach ($userIds as $id_him) //init group-to-owner array with anon/guest. Owner(you) is checked explicitely later
	  $youAreGFor[$id_him]= $_idMe>0 ? Array($grpA,$grpG) : Array($grpA); //default groups assignment
	
	$DB->apply('groupsByMe', $_idMe, $userIds);
	while ($userRow= $DB->fetch()) //fetch group-to-owner array
	  if (!array_key_exists($userRow['id_group'], $youAreGFor[$userRow['id_me']]))
		$youAreGFor[$userRow['id_me']][]= $userRow['id_group'];

	//3: get rights
	$noteCheckList= Array();
	foreach ($noteCheck as $noteIn)
	  if ($noteIn->ownerId==$_idMe) //as told, explicitely defined owner
	    $noteIn->rights= 3;
	  else
		$noteCheckList[]= $noteIn->id;

	if (!count($noteCheckList)) //all is owned
	  return;

	$DB->apply('boardRightsById',$noteCheckList);
	while ($rightsRow= $DB->fetch()){ //compare each rights-for-group with valuable Notes
		$testNote= $noteCheck[$rightsRow['id_boards']];
	    foreach ($youAreGFor[$testNote->ownerId] as $testGrp) //all groups user is assigned to
		  if (
		   	$testGrp==$rightsRow['id_contactgroups']
			&& $rightsRow['rights']>$testNote->rights
		  )
		    $testNote->rights= $rightsRow['rights'];
	}
//todo: try to get all by one sql call:
//todo: (add a/g/o implicit group assignment to users) and somehow INNER JOIN it with (boardcontacts added implicit owner rights)
}
?>