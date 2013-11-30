<?

$sqlTemplate= array_merge($sqlTemplate, array(
	'noteByName1'=> "
		SELECT note.*,UNIX_TIMESTAMP(NOW())-UNIX_TIMESTAMP(stamp) stamp FROM (
			SELECT id maxi,max(version) maxv FROM note WHERE id_owner=? AND name=? GROUP by id
		) maxv INNER JOIN note ON id=maxi AND version=maxv
	",

	'noteListByUsers'=> "
		SELECT id FROM note WHERE id_owner IN (?) AND inherit=0 GROUP BY id
	",

	'userByName1'=> "
		SELECT user_id FROM users WHERE username=?
	",

	'usersByIds'=> "
		SELECT user_id,username,first_name,version FROM users WHERE user_id in (?)
	",

	'contactsByUser'=> "
		SELECT * FROM usercontacts WHERE id_me=? OR id_who=?
	",

	'substNoteId'=> "
		SELECT id FROM implicits WHERE name=?
	"

));

?>