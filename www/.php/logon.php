<?
include('sqTmpl/SQLTLogon.php');
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
echo "{$_POST['logMode']}", $ASYGN->D_ITEM;

switch ($_POST['logMode']){
	case $SESSION_STATES->STAY:
		$USER->getCookie();
		return;
	case $SESSION_STATES->LOGOUT:
		if ($USER->signed)
		  $USER->logout();
		break;
	case $SESSION_STATES->UPDATE:
		echo '0'; //todo: reserved
		return;
	case $SESSION_STATES->VALIDATE:
		$DB->apply('logonRegisterCheck', $_POST['username']);
		echo !!$DB->fetch(0);
		return;
	case $SESSION_STATES->REGISTER: //with subsequent LOGIN
		if(!$USER->signed && $_POST['username']!="" && $_POST['password']!=""){
			$USER->addValidation("first_name","0-15","/\w+/");
			$USER->addValidation("last_name","0-15","/\w+/");
			$USER->addValidation("website","0-50","@((https?://)?([-\w\.]+)+(:\d+)?(/([\w/_\.]*(\?\S+)?)?)?)@");
			$USER->register(Array('username'=>$_POST['username'], 'password'=>$_POST['password']));

			if ($USER->error())
			  break;
		}
	case $SESSION_STATES->LOGIN:
		if (!$USER->signed && $_POST['username']!='' && $_POST['password']!='')
		  $USER=new uFlex($_POST['username'], $_POST['password'], 1);
		break;
}
if ($USER->error())
  foreach($USER->error() as $i=>$x)
    echo "$x";

?>
