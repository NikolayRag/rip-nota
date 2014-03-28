<?
/*
All-purpose logon async.

Module perform:
 UPDATE,
 REGISTER,
 LOGIN,
 VALIDATE,
 STAY and
 LOGOUT
depending on "logMode" argument

 *REGISTER: "username" and "password" are required, [other crap] - while available.
After successfull register, LOGIN is autodone.

 *LOGIN: "username" and "password" are required; If username doesn't exist, it's telled.
Cookies are returned anyway to allow client to use them or not.

 *VALIDATE: "username" is required;

 *UPDATE: available user fields are updated. see [other crap] list;

 *STAY: requests cookie sid for storing it at client side

 *LOGOUT: nothing is requested.

Arguments:

	logMode:
		One of UPDATE, REGISTER, LOGIN, VALIDATE, STAY, WALK and LOGOUT.
		Password matching must be done at client side before registering.

	username:
		Name for check, logon or register

	password:
		Password for logon or register

	[other crap for filling register form]

Return:

	"<SRCMODE>;<errorCode>;"

	<errorCode>
		Return code. 0= no errors.
		For VALIDATE 0 is "no specified user".
		For STAY it is cookie sid	
*/
	//synchronized with object-session.js
class LogArgs {
	var $logMode=0, $username='', $password='';

	function LogArgs($_logMode, $_username, $_password){
		global $SESSION_STATES;

		$this->logMode= $_logMode? (int)$_logMode : $SESSION_STATES->NONE;
		if ($_username)
		  $this->username= $_username;
		if ($_password)
		  $this->password= $_password;
	}
}

$args= new LogArgs(
	arrGet($_POST, 'logMode', false),
	arrGet($_POST, 'username', false),
	arrGet($_POST, 'password', false)
);


echo $args->logMode, $ASYGN->D_ITEM;

switch ($args->logMode){
	case $SESSION_STATES->STAY:
		$USER->getCookie();
		return;
	case $SESSION_STATES->LOGOUT:
		if ($USER->signed)
		  $USER->logout();
		break;
	case $SESSION_STATES->UPDATE:
//todo: reserved
		echo '0';
		return;
	case $SESSION_STATES->VALIDATE:
		$DB->apply('logonRegisterCheck', $args->username);
		echo $DB->fetch(0)? 1:0;
		return;
	case $SESSION_STATES->REGISTER: //with subsequent LOGIN
		if(!$USER->signed && $args->username!='' && $args->password!=''){
			$USER->addValidation("first_name","0-15","/\w+/");
			$USER->addValidation("last_name","0-15","/\w+/");
			$USER->addValidation("website","0-50","@((https?://)?([-\w\.]+)+(:\d+)?(/([\w/_\.]*(\?\S+)?)?)?)@");
			$USER->register(Array('username'=>$args->username, 'password'=>$args->password));

			if ($USER->error())
			  break;
		}
	case $SESSION_STATES->LOGIN:
		if (!$USER->signed && $args->username!='' && $args->password!='')
		  $USER=new uFlex($args->username, $args->password, 1);
		break;
	default:
//todo: arg error handling
}
if ($USER->error())
  foreach($USER->error() as $i=>$x)
    echo "$x";

?>
