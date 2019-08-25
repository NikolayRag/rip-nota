<?

$sqlTemplate= array_merge($sqlTemplate, array(
	'fileById1'=> "
		SELECT id,filename,size,ext,mime FROM uploads WHERE guid=?
	",

	'logDl'=> "
		INSERT INTO logdl (id_upload,ip,id_user,seek,seekout) VALUES (?,?,?,?,?)
	",

	'logDlFin'=> "
		UPDATE logdl SET finished=CURRENT_TIMESTAMP, completed=?, stamp=stamp WHERE id=?
	"

));

?>