<?

$sqlTemplate= array_merge($sqlTemplate, array(
	'dataByNotesIds'=> "
		SELECT ndata.*,UNIX_TIMESTAMP(stamp) stamp FROM (
			SELECT id maxi,max(version) maxv FROM ndata WHERE id_note IN (?) GROUP by id
		) maxv INNER JOIN ndata ON id=maxi AND version=maxv AND isdeleted=0
	",

	'dataByIds'=> "
		SELECT ndata.*,UNIX_TIMESTAMP(stamp) stamp FROM (
			SELECT id maxi,max(version) maxv FROM ndata WHERE id IN (?) GROUP by id
		) maxv INNER JOIN ndata ON id=maxi AND version=maxv AND isdeleted=0
	",

	'rightsByGrp1'=> "
		SELECT rights FROM boardcontacts WHERE id_boards=? AND id_contactgroups=?
	"

));

?>