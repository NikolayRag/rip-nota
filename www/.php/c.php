<?
//these constants are also read into js

$CONSTANTS= array(
////////Engine
	'CLIENT_TYPE'=> array(
		'MODERN'=>	0,
		'MINI'=>	1,
		'LEGACY'=>	2,
		'DUMB'=>	3,
		'BOT'=>	4,
		'SCANNER'=> 5
	),

	'ARGS_PLACE'=> array(
		'USERID'=>	0,
		'USERNAME'=>	1,
		'REQWHO'=>	2,
		'REQWHAT'=>	3,
		'REQNOTEID'=>	4,
		'REQFILTER'=>	5,
		'EMBED'=>	6
	),

	'SESSION_STATES'=> array(
		'LOGOUT'=>	1,
		'UPDATE'=>	2,
		'VALIDATE'=>	3,
		'REGISTER'=>	4,
		'LOGIN'=>	5,
		'STAY'=>	6,
		'LEAVE'=>	7,

		'PROCCEED_REGISTER'=>15
	),

	'UPDATE_STATE'=> array(
		'NORMAL'=>	0,
		'STEADY'=>	1,
		'UPDATE'=>	2,
		'ERROR'=>	3,
		'STOP'=>	4
	),

	'USER_RELATION'=> array(
		'UNAVAILABLE'=>	-2,
		'NEUTRAL'=>	-1,
		'NORMAL'=>	0,
		'OUT'=>	1, //relative to logged user
		'IN'=>	2 //same
	),

	'CORE_VERSION'=> array(
		'INIT'=>	-1,
		'DEL'=>	0
	),

	'NOTA_RIGHTS'=> array(
		'INIT'=>	-1,
		'RO'=>	0,
		'ADD'=>	1,
		'RW'=>	2,
		'OWN'=>	3,

		'INHERITED'=>	-1
	),

	'SAVE_STATES'=> array( //used separately in js/php
		'IDLE'=>	0,
		'READY'=>	1,
		'HOLD'=>	2,
	),

	'DATA_TYPE'=> array( 
		'UNKNOWN'=>	0,
		'TEXT'=>	1,
		'NOTE'=>	2
	),

	'SAVE_RES'=> array(
		'INIT'=>	-1,
		'SECURITY_ERR'=>	-2,
		'SQL_ERR'=>	-3,
		'VERSION_ERR'=>	-4,
		'DB_ERR'=> -5,
		'PARAM_ERR'=> -6,
		'REFERENCE_ERR'=> -7
	),

	'ASYGN'=> array(
		'MODE'=>	'mode',
		'NFULL'=>	'N',
		'NBREEF'=>	'n',
		'NDATA'=>	'd',
		'NRIGHTS'=>	'r',
		'USER'=>	'u',
		'YOU'=>	'U',
		'D_UNIT'=>	'\\',
		'D_ITEM'=>	';',
		'D_LIST'=>	','
	),

	'ASYNC_MODE'=> array( 
		'UPDATE'=>	1,
		'SAVE'=>	2,
		'LOGON'=>	3,
		'LOGVALIDATE'=>	4
	),

	'ASYNC_PLACE'=> array( 
		'SIGN'=> 0,
		
		'UPN_OLDID'=> 1,
		'UPN_ID'=> 2,
		'UPN_VER'=> 3,
		'UPN_NAME'=> 4,
		'UPN_STYLE'=> 5,
		'UPN_OWNER'=> 6,
		'UPN_EDITOR'=> 7,
		'UPN_RIGHTS'=> 8,
		'UPN_RIGHTGRPA'=> 9,
		'UPN_INHERIT'=> 10,
		'UPN_STAMP'=> 11,

		'UPD_ID'=> 1,
		'UPD_VER'=> 2,
		'UPD_DTYPE'=> 3,
		'UPD_DATA'=> 4,
		'UPD_EDITOR'=> 5,
		'UPD_STAMP'=> 6,
		'UPD_PLACE'=> 7,

		'UPU_ID'=> 1,
		'UPU_VER'=> 2,
		'UPU_NAME'=> 3,
		'UPU_RELATION'=> 4,
		'UPU_GROUPID'=> 5,
		'UPU_BOARDLIST'=> 6,
		'UPU_CONTACTSLIST'=> 7,

		'SVN_VER'=> 0,
		'SVN_INHERIT'=> 1,
		'SVN_NAME'=> 2,
		'SVN_STYLE'=> 3,

		'SVR_RIGHTS'=> 0,

		'SVD_VER'=> 0,
		'SVD_PARENT'=> 1,
		'SVD_PLACE'=> 2,
		'SVD_DTYPE'=> 3,
		'SVD_DATA'=> 4
	),






////////Known values
	'USER_REACTION'=> array( 
		'POINTER_DEAD_SPOT'=>	10
	),

	'TIMER_LENGTH'=> array(
		'UPDATE_DELAY_ERROR'=>	10000,
		'UPDATE_DELAY_STOP'=>	3000,
		'UPDATE_PULSE'=>	5000,

		'SAVE_DELAY'=>	2000,

		'VALIDATE_DELAY'=>	300,
		'LOGPASS_FIX_DELAY'=>	100,

		'BROWSE_DELAY'=>	1500,

		'TIP_DELAY'=>	500,
		'LOGO_DELAY'=>	500,
		'FLASH_DELAY'=>	300,

		'LOGO2NORMAL_DELAY'=>	200,

		'OVERVIEW_LAZY_DELAY'=>	100,

		'LEAF_CREATION_PERIOD'=>	10,
		'LEAF_FADETRAIL'=>	250,
		'LEAF_FADEOUT'=>	1000,

		'TOOLFADEIN_DELAY'=>	1500,

		'MIN'=>	60,
		'HOUR'=>	3600,
		'DAY'=>	86400,
		'MONTH'=>	2635200,
		'YEAR'=>	31557600
	),

	'AUTHORIZE'=> array( 
		'COOKIENAME'=>	'notaCook',
		'COOKIETIME'=>	30
	),

	'PROFILE'=> array( 
		'NONE'=>	0,
		'GENERAL'=>	1,
		'BREEF'=>	2,
		'VERBOSE'=>	3,
		'LIMIT'=> 50
	),

////////Style
	'CSS'=> array( //values could be used in css
		'MAIN_BG'=>	'#ddd',
		'MAIN_BORDER'=>	'#ddd',
		'DECORDARK'=> '#444',

		'NOTE_BG'=>	'#fed',
		'NOTE_BORDER'=>	'#ba9',

		'FIELD_REQUIRED_HILITE'=>	'#f44',

		'UPDATEMARKER_UPDATE'=> '#7f0',
		'UPDATEMARKER_ERROR'=> '#f30',
		'UPDATEMARKER_STOP'=> '#000',

		'GREENLIGHT'=> '#0f0',

		'TOOL_TRANSITIONTIME'=> .2
	),

	'PERF'=> array(
		'IMAGEBG'=> 1,
		'GRADIENTS'=> 2,

		'LEVEL'=> 0|2
	),

	'STYLE'=> array(
		'MAIN_CC_TINT'=>	'black',
		'MAIN_CC_MIX'=>	.25,

		'BOARD_MARGIN'=>	150,
		'BOARD_MARGIN_EDITABLE'=>	.67,

		'TIP_PREPOSITION'=>	20,

		'NOTESHADOW_DECAY_EXP'=>	.3,
		'NOTESHADOW_TOP_RATE'=>	10,
		'NOTESHADOW_BOTTOM_RATE'=>	8,
		'NOTESHADOW_LEFT_RATE'=>	15,
		'NOTESHADOW_RIGHT_RATE'=>	7.5,
		'NOTESHADOW_INIT_OFFSET'=>	1,
		'NOTESHADOW_OPACITY_MAX'=>	.3,

		'OVERVIEW_TINT'=>	'white',
		'OVERVIEW_MIX'=>	.25,
		'OVERVIEW_BASESIZE'=>	150,
		'OVERVIEW_MAXSIZE'=>	500,

		'CURSOR_MOVE'=>	'move'
	),

	'STR'=> array(
		'BOLD'=>	1,
		'ITALIC'=>	2,
		'IDENT'=>	4,
		'QUOTE'=>	8,
		'DIV'=>	16
	),

	'RES_BOARDRIGHTS'=> array( 
		0=>	'x',
		1=>	'R',
		2=>	'W',
		3=> 'F',
		4=> '!'
	),

	'NOPROFILE'=> 0 //1= clean all unneccessary info
);


foreach ($CONSTANTS as $cName=>$cCont)
  ${$cName}= is_array($cCont)?(object)$cCont:$cCont;

?>