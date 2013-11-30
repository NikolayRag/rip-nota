<?

$sqlTemplate= array_merge($sqlTemplate, array(
	'saveNote'=> "
		INSERT INTO note (id,version,isdeleted,id_owner,name,style,inherit,id_editor) values (?,?,?,?,?,?,?,?)
	",

	'saveData'=> "
		INSERT INTO ndata (id,version,id_note,isdeleted,datatype,data,x,y,w,h,id_editor) values (?,?,?,?,?,?,?,?,?,?,?)
	"

));

?>