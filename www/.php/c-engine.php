<?

$CONSTANTS= array_merge($CONSTANTS, array(

////////Engine
	'CLIENT_TYPE'=>	array(
		'DEFAULT'=>	0,
		'MINI'=>	1,
		'LEGACY'=>	2,
		'DUMB'=>	3,
		'BOT'=>	4,
		'SCANNER'=>	5
	),

	'ARGS_PLACE'=>	array(
		'USERID'=>	0,
		'USERNAME'=>	1,
		'REQWHO'=>	2,
		'REQWHAT'=>	3,
		'REQNOTEID'=>	4,
		'REQFILTER'=>	5,
		'EMBED'=>	6
	),

	'SESSION_STATES'=>	array(
		'NONE'=>	0,
		'LOGOUT'=>	1,
		'UPDATE'=>	2,
		'VALIDATE'=>	3,
		'REGISTER'=>	4,
		'LOGIN'=>	5,
		'STAY'=>	6,
		'LEAVE'=>	7,

		'PROCCEED_REGISTER'=>15
	),

	'UPDATE_STATE'=>	array(
		'NORMAL'=>	0,
		'STEADY'=>	1,
		'UPDATE'=>	2,
		'ERROR'=>	3,
		'STOP'=>	4
	),

	'USER_RELATION'=>	array(
		'UNAVAILABLE'=>	-2,
		'NEUTRAL'=>	-1, //unconnected
		'NORMAL'=>	0, //connected
		'OUT'=>	1, //relative to logged user
		'IN'=>	2 //same
	),

	'CORE_VERSION'=>	array(
		'INIT'=>	-1,
		'DEL'=>	0
	),

	'NOTA_RIGHTS'=>	array(
		'INIT'=>	-1,
		'RO'=>	0,
		'ADD'=>	1,
		'RW'=>	2,
		'OWN'=>	3,

		'INHERITED'=>	-1
	),

	'SAVE_STATES'=>	array( //used separately in js/php
		'IDLE'=>	0,
		'READY'=>	1,
		'HOLD'=>	2,
	),

	'DATA_TYPE'=>	array( 
		'UNKNOWN'=>	0,
		'TEXT'=>	1,
		'NOTE'=>	2
	),

	'SAVE_RES'=>	array(
		'INIT'=>	-1,
		'SECURITY_ERR'=>	-2,
		'SQL_ERR'=>	-3,
		'VERSION_ERR'=>	-4,
		'NOTHIS_ERR'=>	-5,
		'NOREFERENCE_ERR'=>	-6,
		'NOPARENT_ERR'=>	-7
	),

	'ASYGN'=>	array(
		'MODE'=>	'mode',
		'MODE_SRV'=>	'HTTP_MODE',
		'NFULL'=>	'N',
		'NBREEF'=>	'n',
		'NDATA'=>	'd',
		'NRIGHTS'=>	'r',
		'USER'=>	'u',
		'YOU'=>	'U',
		'STAMP'=>	'T',
		'D_UNIT'=>	'\\',
		'D_ITEM'=>	';',
		'D_LIST'=>	','
	),

	'ASYNC_MODE'=>	array( 
		'DEFAULT'=>	'',
		'UPDATE'=>	1,
		'SAVE'=>	2,
		'LOGON'=>	3,
		'LOGVALIDATE'=>	4,
		'UPLOAD_LEGACY'=>	5,
		'UPLOADPROGRESS_LEGACY'=>	6,
		'UPLOAD_BLOB'=>	7,
		'DOWNLOAD'=>	8
	),

	'ASIDX_UPDCB'=>	array( 
		'SIGN'=>	0,
		
		'N_OLDID'=>	1,
		'N_ID'=>	2,
		'N_VER'=>	3,
		'N_NAME'=>	4,
		'N_STYLE'=>	5,
		'N_OWNER'=>	6,
		'N_EDITOR'=>	7,
		'N_RIGHTS'=>	8,
		'N_RIGHTGRPA'=>	9,
		'N_INHERIT'=>	10,
		'N_STAMP'=>	11,

		'D_ID'=>	1,
		'D_VER'=>	2,
		'D_ROOT'=>	3,
		'D_DTYPE'=>	4,
		'D_DATA'=>	5,
		'D_EDITOR'=>	6,
		'D_STAMP'=>	7,
		'D_PLACE'=>	8,

		'U_ID'=>	1,
		'U_VER'=>	2,
		'U_NAME'=>	3,
		'U_RELATION'=>	4,
		'U_GROUPID'=>	5,
		'U_BOARDLIST'=>	6,
		'U_CONTACTSLIST'=>	7,
	),

	'ASIDX_SAVE'=>	array( 
		'N_VER'=>	0,
		'N_INHERIT'=>	1,
		'N_NAME'=>	2,
		'N_STYLE'=>	3,

		'R_RIGHTS'=>	0,

		'D_VER'=>	0,
		'D_PARENT'=>	1,
		'D_PLACE'=>	2,
		'D_DTYPE'=>	3,
		'D_DATA'=>	4,

	),

	'ASIDX_SAVECB'=>	array( 
		'SIGN'=>	0,
		'ID'=>	1,
		'RES'=>	2
	),

	'UPSET'=>	array( 
		'LEGACY_MODESIGN'=>	'legUpMode',
		'LEGACY_FILESIGN'=>	'legUpFiles',
		'BLOB_SIZE'=>	1024*1024, //1mb chunk defaults
		'MAX_RETRIES'=>	2,
		'RESTRICTED'=>	-1
	),

	'MIME'=>	array( 
		'm0'=>	'application/octet-stream',
		'm1'=>	'image/jpeg'
	),

	'DEFAULT'=>	array(
	)
));


?>