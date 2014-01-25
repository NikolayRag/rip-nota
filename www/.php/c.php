<?
//these constants are also read into js

$CONSTANTS= array(
////////Engine
	'CLIENT_TYPE'=>	array(
		'MODERN'=>	0,
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
		'NEUTRAL'=>	-1,
		'NORMAL'=>	0,
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
		'UPDATE'=>	1,
		'SAVE'=>	2,
		'LOGON'=>	3,
		'LOGVALIDATE'=>	4
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






////////Known values
	'USER_REACTION'=>	array( 
		'POINTER_DEAD_SPOT'=>	10
	),

	'TIMER_LENGTH'=>	array(
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

	'AUTHORIZE'=>	array( 
		'COOKIENAME'=>	'notaCook',
		'COOKIETIME'=>	30
	),

	'PROFILE'=>	array( 
		'NONE'=>	0,
		'GENERAL'=>	1,
		'BREEF'=>	2,
		'VERBOSE'=>	3,
		'LIMIT'=>	50
	),

////////Style
	'CSS'=>	array( //values could be used in css
		'MAIN_BG'=>	'#ddd',
		'MAIN_BORDER'=>	'#ddd',
		'DECORDARK'=>	'#444',

		'FIELD_REQUIRED_HILITE'=>	'#f44',

		'UPDATEMARKER_UPDATE'=>	'#7f0',
		'UPDATEMARKER_ERROR'=>	'#f30',
		'UPDATEMARKER_STOP'=>	'#000',

		'GREENLIGHT'=>	'#0f0',

		'TOOL_TRANSITIONTIME'=>	.2
	),

	'PERF'=>	array(
		'IMAGEBG'=>	1,
		'GRADIENTS'=>	2,

		'LEVEL'=>	1|2
	),

	'STYLE'=>	array(
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

	'STR'=>	array(
		'BOLD'=>	1,
		'ITALIC'=>	2,
		'IDENT'=>	4,
		'QUOTE'=>	8,
		'DIV'=>	16
	),

	'RES_BOARDRIGHTS'=>	array( 
		0=>	'x',
		1=>	'R',
		2=>	'W',
		3=> 'F',
		4=> '!'
	),

	'NOPROFILE'=>	0 //1= clean all unneccessary info
);


foreach ($CONSTANTS as $cName=>$cCont)
  ${$cName}= is_array($cCont)?(object)$cCont:$cCont;

?>