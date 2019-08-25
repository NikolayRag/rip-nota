<?
//	include('../.include/includeAll.php');

/*
Set user relations.
Each relation is a pair of two independent user1->user2 and user2->user1 values that are:
	1, ``:	Relation is only requested and waiting for reaction.
	0, 0:	Relation is set. Normally either way relations are set.
?	-1:	Relation is set to be cut. This should be used to notify other user.

Input:
	make:	Boolean, telling to set relation or remove it.

Search contact request
	_wave1:
	Remove if requested, return REMOVED
	either state=-1: remove both (set to removed)
	both state!=-1: both state=1, return APPROVE_FIX
	either state=1: state=0 (set to requested)
	! //state==-1 is reserved for delayed remove (if really need)

	_wave2:
	none: my state=0, return REQUEST
	only my state=0: return REQUEST_FIX
	only he state=0: both state=1, return APPROVE

return:
	(-3=SQLError|-2=abnormal|-1=securityError|0=approved|1=approvedFix|2=requested|3=requestedFix|4=removed)
*/

	if (!$USER->signed) {
		echo -1;
		return;
	}

	$query= mysql_query("SELECT id_me,id_who,state,id_group FROM usercontacts WHERE (id_me= {$USER->id} && id_who= {$_POST['who']}) ");
	if (!$query) {
		echo -3;
		return;
	}
	$rowMe=(mysql_affected_rows()!=0
		? mysql_fetch_array($query)
		: 0);

	$query= mysql_query("SELECT id_me,id_who,state,id_group FROM usercontacts WHERE (id_me= {$_POST['who']} && id_who= {$USER->id}) ");
	if (!$query) {
		echo -3;
		return;
	}
	$rowHe=(mysql_affected_rows()!=0
		? mysql_fetch_array($query)
		: 0);

# if requested: remove both, return REMOVED
# either state=-1: remove both (set to removed)
# both state!=-1: both state=1, return APPROVE_FIX
# either state=1: state=0 (set to requested)

	if ($_POST['make']==0 || ($rowMe!=0 && $rowMe['state']==-1) || ($rowHe!=0 && $rowHe['state']==-1)) {
		if ($rowMe!=0)
		  mysql_query("DELETE FROM usercontacts WHERE (id_me= {$USER->id} && id_who= {$_POST['who']}) ");
		if ($rowHe!=0)
		  mysql_query("DELETE FROM usercontacts WHERE (id_me= {$_POST['who']} && id_who= {$USER->id}) ");

		if ($_POST['make']==0) {
			echo 4;
			return;
		}
		$rowMe= $rowHe= 0;
	}
	if ($rowMe!=0 && $rowMe['state']!=-1 && $rowHe!=0 && $rowHe['state']!=-1) {
		mysql_query("UPDATE usercontacts SET state=1 WHERE (id_me= {$USER->id} && id_who= {$_POST['who']}) ");
		mysql_query("UPDATE usercontacts SET state=1 WHERE (id_me= {$_POST['who']} && id_who= {$USER->id}) ");
		echo 1;
		return;
	}
	if ($rowMe!=0 && $rowMe['state']==1)
	  $rowMe['state']=0;
	if ($rowHe!=0 && $rowHe['state']==1)
	  $rowHe['state']=0;

# none: my state=0, return REQUEST
# only my state=0: my state=0, return REQUEST_FIX)
# only he state=0: both state=1, return APPROVE

	if ($rowMe==0 && $rowHe==0) {
		mysql_query("INSERT INTO usercontacts (id_me,id_who,state,id_group) values ({$USER->id},{$_POST['who']},0,4) ");
		echo 2;
		return;
	}
	if ($rowMe!=0 && $rowMe['state']==0) {
		mysql_query("UPDATE usercontacts SET state=0 WHERE (id_me= {$USER->id} && id_who= {$_POST['who']}) ");
		echo 3;
		return;
	}
	if ($rowHe!=0 && $rowHe['state']==0) {
		mysql_query("INSERT INTO usercontacts (id_me,id_who,state,id_group) values ({$USER->id},{$_POST['who']},1,4) ");
		mysql_query("UPDATE usercontacts SET state=1 WHERE (id_me= {$_POST['who']} && id_who= {$USER->id}) ");
		echo 0;
		return;
	}
	echo -2;
	return;
?>
