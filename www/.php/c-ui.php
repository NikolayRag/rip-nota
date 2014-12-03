<?

$CONSTANTS= array_merge($CONSTANTS, array(
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
	'CSS'=>	array( //values could be used in css as $NAME
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
		'ANIMATE'=>	4,

		'LEVEL'=>	0|0|0
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
	)
));


?>