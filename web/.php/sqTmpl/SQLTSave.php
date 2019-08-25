<?

$sqlTemplate= array_merge($sqlTemplate, array(
	'saveNoteAdd'=> "
		INSERT INTO note (id_owner,name,style,inherit,id_editor) values (?,?,?,?,?)
	",

	'saveNoteUpdate'=> "
		INSERT INTO note (id,version,isdeleted,id_owner,name,style,inherit,id_editor) values (?,?,?,?,?,?,?,?)
	",

	'saveDataAdd'=> "
		INSERT INTO ndata (id_note,datatype,data,x,y,w,h,id_editor) values (?,?,?,?,?,?,?,?)
	",

	'saveDataUpdate'=> "
		INSERT INTO ndata (id,version,isdeleted,id_note,datatype,data,x,y,w,h,id_editor) values (?,?,?,?,?,?,?,?,?,?,?)
	"

));

?>