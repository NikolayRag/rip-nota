<?

$sqlTemplate= array(

	'logUploadInit'=> "
		INSERT INTO uploads (guid,filename,id_user,public,size,ext,enabled) VALUES (?,?,?,?,?,?,?)
	",

	'logUploadComplete'=> "
		UPDATE uploads SET enabled=1 WHERE guid=?
	"
	
);

?>