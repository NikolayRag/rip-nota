<?

$sqlTemplate= array(

	'logHttpAgent'=> "
		INSERT logagents (agent) VALUES (?) ON DUPLICATE KEY UPDATE count=count+1;
	",
	
	'logHttpLast'=> "
		SELECT id,mode,request FROM loghttp WHERE ip=? AND port=? AND id_agent=? AND id_user=? ORDER BY id DESC LIMIT 1
	",

	'logHttpRe'=> "
		UPDATE loghttp SET count=count+1 WHERE id=?
	",

	'logHttp'=> "
		INSERT INTO loghttp (ip,port,id_agent,request,id_user,mode,stampfrom) VALUES (?,?,?,?,?,?,NOW())
	"
);

?>