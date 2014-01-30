<?

$sqlTemplate= array(

	'logUploadLegacy'=> "
		INSERT INTO uploads (guid,filename,id_user,public,size,ext,enabled) VALUES (?,?,?,?,?,?,?)
	"
	
);

?>