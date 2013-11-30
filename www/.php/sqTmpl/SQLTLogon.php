<?

$sqlTemplate= array_merge($sqlTemplate, array(
	'logonRegisterCheck'=> "
		SELECT username FROM users WHERE username=?
	",

	'logonRegister'=> "
		INSERT INTO users (username,password,activated) VALUES(?,?,?)
	",

	'logonRegisterConfirm'=> "
		UPDATE users SET confirmation=?, activated=0 WHERE user_id=?
	",

//inconsistent
	'logonUpdate'=> "
		UPDATE users SET x=?, y=? WHERE user_id=?
	",

	'logonActivate'=> "
		UPDATE users SET activated=1, confirmation='' WHERE confirmation=? AND user_id=?
	",

	'logonPassReset'=> "
		SELECT * FROM users WHERE email=?
	",

	'logonPassNew'=> "
		UPDATE users SET password=?, confirmation='', activated=1 WHERE confirmation=? AND user_id=?
	",

	'logonInById'=> "
		SELECT * FROM users WHERE user_id=?
	",

	'logonInByName'=> "
		SELECT * FROM users WHERE username=? AND password=?
	",

	'logonInByMail'=> "
		SELECT * FROM users WHERE email=? AND password=?
	",

	'logonLog'=> "
		INSERT INTO loglogon (id_user,id_http,come,success) VALUES (?,?,?,?)
	",

	'logonHashPass'=> "
		SELECT * FROM users WHERE user_id=? AND password LIKE ?
	",

	'logonHashConfirm'=> "
		SELECT * FROM users WHERE user_id=? AND confirmation=?
	"
));

?>
