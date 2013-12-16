<?

$sqlTemplate= array_merge($sqlTemplate, array(
	'saveNoteAdd'=> "
		INSERT INTO note (isdeleted,id_owner,name,style,inherit,id_editor) values (0,?,?,?,?,?)
	",

	'saveNoteUpdate'=> "
		INSERT INTO note (id,version,isdeleted,id_owner,name,style,inherit,id_editor) values (?,?,?,?,?,?,?,?)
	",

//todo: change default 'isdeleted' to '0'
	'saveDataAdd'=> "
		INSERT INTO ndata (isdeleted,id_note,datatype,data,x,y,w,h,id_editor) values (0,?,?,?,?,?,?,?,?)
	",

	'saveDataUpdate'=> "
		INSERT INTO ndata (id,version,isdeleted,id_note,datatype,data,x,y,w,h,id_editor) values (?,?,?,?,?,?,?,?,?,?,?)
	"

));

?>