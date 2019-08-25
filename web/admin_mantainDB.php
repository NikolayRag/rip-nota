notes owner split<Br>
<?
exit;
	set_time_limit(0);
	include("/.php/include/includeAll.php");


	$query = mysql_query("SELECT * FROM note INNER JOIN (SELECT id as i1 FROM note GROUP BY id asc) n ON id=i1 ORDER BY id,version");
	while($row = mysql_fetch_object($query)) {
		$qStr= "UPDATE note SET id_editor=$row->id_owner WHERE id=$row->id AND version=$row->version";
		echo "<br>", implode(',',[$row->id, $row->version, $row->id_owner]), "<br>";
		mysql_query($qStr);
	}

  	$id= 0;
	$query = mysql_query("SELECT * FROM note INNER JOIN (SELECT id as i1 FROM note GROUP BY id asc) n ON id=i1 ORDER BY id,version");
	while($row = mysql_fetch_object($query)) {
		if ($row->id==$id)
		  continue;
		$id= $row->id;
		$qStr= "UPDATE note SET id_owner=$row->id_owner WHERE id=$row->id";
		echo "<br>", implode(',',[$row->id, $row->version, $row->id_owner]), "<br>";
		mysql_query($qStr);
	}

	echo "ok<br>";
?>
