<?

function boardCreate($dstUser, $dstName){
	if ( !mysql_query("INSERT INTO note (id_owner,name,inherit) VALUES ($dstUser,'$dstName',0)" ) )
	  return 0;
	return mysql_insert_id();
}

function boardCopyData($srcBoard, $dstBoard){
	if (!$srcBoard || !$dstBoard)
	  return 0;

	$dstUser= arrGet_( sqlGet_("SELECT id_owner FROM note WHERE id=$dstBoard" ), 'id_owner', 0);
	if (!$dstUser)
	  return 0;

	//leafs data +notes
	$qSrc= mysql_query( "
		SELECT d.x,d.y,d.w,d.h,d.datatype,d.isdeleted,note.name,note.style,note.id as noteid
		 FROM (SELECT id,version,x,y,w,h,datatype,isdeleted,MAX(version) FROM data WHERE id_note=$srcBoard GROUP BY id) as d
		 INNER JOIN note ON note.id=d.datatype AND d.isdeleted=0;
	" );
	if (!$qSrc)
	  return 0;

	while($rowMain= mysql_fetch_object($qSrc)) {
		mysql_query("INSERT INTO note (id_owner,name,style) values($dstUser,$rowMain->name,$rowMain->style)");
		  $newNote= mysql_insert_id();
		mysql_query("INSERT INTO data (id_owner,id_note,x,y,w,h,datatype) values($dstUser,$dstBoard,$rowMain->x,$rowMain->y,$rowMain->w,$rowMain->h,$newNote)");

		$qData= mysql_query( "
			SELECT datatype,data FROM (
			  SELECT datatype,data,isdeleted,MAX(version) FROM data WHERE id_note=$rowMain->noteid GROUP BY id
			) as d WHERE d.isdeleted=0;
		" );
		while($rowData= mysql_fetch_object($qData)) //final data
		  mysql_query("INSERT INTO data (datatype,data,id_note,id_owner) values ($rowData->datatype,'$rowData->data',$newNote,$dstUser)");
	}
	
	return 1;
}

?>