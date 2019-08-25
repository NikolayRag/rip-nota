<?

$sqlTemplate= array_merge($sqlTemplate, array(
	'notesByIds'=> "
		SELECT note.*,UNIX_TIMESTAMP(stamp) stamp FROM (
			SELECT id maxi,max(version) maxv FROM note WHERE id IN (?) GROUP by id
		) maxv INNER JOIN note ON id=maxi AND version=maxv
	",

	'groupsByMe'=> "
		SELECT id_me,id_group FROM usercontacts WHERE (id_who=? AND id_me IN (?) AND state=1)
	",

	'boardRightsById'=> "
		SELECT id_boards,id_contactgroups,rights FROM boardcontacts WHERE id_boards IN (?)
	"

));

?>