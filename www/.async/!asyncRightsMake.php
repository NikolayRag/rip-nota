<?
//	include('../.include/includeAll.php');

# return:
#   (-3=SQLError|-1=securityError|0=ok)

	#security
	$rowB=mysql_fetch_array( mysql_query("SELECT id_user FROM boards WHERE id= '{$_POST['what']}'" ), MYSQL_ASSOC );
	if ($USER->id!=$rowB['id_user']) {
		echo '-1';
		return;
	}

	if ($_POST['rights']==-1) {
	  # remove
		$query= mysql_query("DELETE FROM boardcontacts WHERE (id_boards= {$_POST['what']} AND id_contactgroups= {$_POST['group']})");
		if (!$query)
		  echo -3;
		else
		  echo 0;
		return;
	}

	$query= mysql_query("SELECT rights FROM boardcontacts WHERE (id_boards= {$_POST['what']} AND id_contactgroups= {$_POST['group']})");
	if (!$query) {
		echo -3;
		return;
	}

	if (mysql_affected_rows()==0) {
	  #create
		$query= mysql_query("INSERT INTO boardcontacts (id_boards,id_contactgroups,rights) values ({$_POST['what']},{$_POST['group']},{$_POST['rights']})");
		if (!$query) {
			echo -3;
			return;
		}
	} else {
	  #update
		$query= mysql_query("UPDATE boardcontacts SET rights= {$_POST['rights']} WHERE (id_boards= {$_POST['what']} AND id_contactgroups= {$_POST['group']})");
		if (!$query) {
			echo -3;
			return;
		}
	}

	echo 0;
?>
