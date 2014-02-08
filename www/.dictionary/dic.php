<? 
/*
php usage:	<?=$DIC->x?>
js usage:	DIC.x
*/
$DIC= array(
	'labOk'=>	"Accept",
	'labNotok'=>	"Cancel",
	'labContacts'=>	"Contacts",
	'labTitle'=>	"Nickside",
	'labLogOut'=>	"Exit",
	'labLogName'=>	"Name",
	'labLogPass'=>	"Pass",
	'labLogHold'=>	"home",
	'labLogIn'=>	"Come in",
	'labLogRegister'=>	"Join",
	'labDeleted'=>	"deleted",

	'popRegisterTitle'=>	"Registering new user",
	'popRegisterConfirm'=>	"Confirm password",
	'popStayConfirm'=>	"You will be already logged in next time",
	'popEditCancel'=>	"Really cancel editions?",
	'popEditRemove'=>	"Remove note?",
	'popContactReq'=>	"Send contact request?",
	'popContactKill'=>	"Forget contact?",
	'popPin'=>	"Pin note to..",

	'popStateUpdating'=>	"Update requested",
	'popStateError'=>	"Update error, \nserver side",
	'popStateStop'=>	"Update stopped, \nbrowser error",
	'popStateStopALERT'=>	"<span class=bigTxt>Error updating board!</span>\n\nServer is returning shit\n\n<span class=smallTxt>Update is stopped, notes can still be edited\n(but not likely to)</span>",
	'popStateOkay'=>	"Everything is Ok",
	'popStateVDelayed'=>	'Waiting too long',
	'popStateVAsyncHead'=>	'Async error ',
	'popStateVAsync0'=>	'server unreachable',
	'popStateVAsync500'=>	'internal server error',
	'popStateProfTime'=>	'$:server, $:transfer',


	'boardTools'=>	"Board tools",
	'boardToolsNew'=>	"New",
	'boardToolsUpload'=>	"Upload",
	'boardToolsStyle'=>	"Stilyze",
	'boardToolsRename'=>	"Rename",
	'boardToolsCopy'=>	"Duplicate",
	'boardToolsClear'=>	"Clear",
	'boardToolsDel'=>	"Delete",
	'boardToolsColor'=>	"Color",
	'boardRtsEdit'=>	"Change",
	'boardRtsAdd'=>	"Comment",
	'boardRtsRo'=>	"Read",

	'contWaitingYou'=>	"Waiting You",
	'contYouWait'=>	"You Waiting",
	'contLab'=>	"Contacts",

	'uploadLimit'=>	"Error:\n\nYour browser is not capable\nof sending more than 14GB at once",
	'uploadError'=>	"Uploading error for\n$",
	'uploadComplete'=>	"Complete",
	'uploadRestricted'=>	"Upload restricted for\n$",

	'timeAgoSecs'=>	"$ sec ago,$ secs ago",
	'timeAgoSecsRulz'=>	"(^|[^1])1$",
	'timeAgoMins'=>	"a min ago,% min ago,mins ago",
	'timeAgoMinsRulz'=>	"^1$,[^1]1$",
	'timeAgoHours'=>	"a hour ago,$ hour ago,$ hours ago",
	'timeAgoHoursRulz'=>	"^1$,[^1]1$",
	'timeAgoDays'=>	"today,yesterday,$ day ago,$ days ago",
	'timeAgoDaysRulz'=>	"^0$,^1$,(^|[^1])1$",
	'timeJan'=>	"Jan",
	'timeFeb'=>	"Feb",
	'timeMar'=>	"Mar",
	'timeApr'=>	"Apr",
	'timeMay'=>	"May",
	'timeJun'=>	"Jun",
	'timeJul'=>	"Jul",
	'timeAug'=>	"Aug",
	'timeSep'=>	"Sep",
	'timeOct'=>	"Oct",
	'timeNov'=>	"Nov",
	'timeDec'=>	"Dec",

	'stampSomebody'=>	'somebody',

	'warr'=>	"Warning",
	'warrBoardChanged'=>	"Board changes aren't saved!",
	'warrNotesChanged'=>	"Some notes aren't saved, reload might loose some unsaved data!",

	'errr'=>	"Problem",
	'errrBoardUpdate'=>	"Board update is invalid",
	'errrNoteMisver'=> "Dbase have older verion of",
	'errrRtsSave'=>	"Error while saving rights",
	'errrContactMake'=>	"Error while requesting contacts",
	'errrContactUpdate'=>	"Error while updating contacts",
	'errrNoteSave'=>	"Error while saving note",
	'errrBoardSave'=>	"Error while saving board",
	'errrLogonCB'=>	"Server error while loging",
	'errrAsyncNA'=>	"Async engine not supported by browser",

	'errrPreNoUsername'=>	"Blank username means nothing to do",
	'errrPreNoPassword'=>	"Blank password not permitted",
	'errrPrePassMismatch'=>	"Password mismatch, reenter",

	'errrUserOutdated'=>	"You relogon elsewhere, reload now...",

	'logErrRegister'=> "New User Registration Failed",
	'logErrChange'=> "The Changes Could not be made",
	'logErrActivate'=> "Account could not be activated",
	'logErrRestore'=> "We don't have an account with this email",
	'logErrRepass'=> "Password could not be changed. The request can't be validated",
	'logErrCookie'=> "Logging with cookies failed",
	'logErrProvided'=> "No Username or Password provided",
	'logErrActivated'=> "Your Account has not been Activated. Check your Email for instructions",
	'logErrDeactivated'=> "Your account has been deactivated. Please contact Administrator",
	'logErrBadpass'=> "Wrong Password",
	'logErrHash'=> "Confirmation hash is invalid",
	'logErrConfirm'=> "Your identification could not be confirmed",
	'logErrSave'=> "Failed to save confirmation request",
	'logErrReset'=> "You need to reset your password to login",
	'logErrUnregistered'=> "No specified User",

	'preCss'=> "wait a bit...",

	'_got'=> 'Got: $',
	'_in'=> 'Got: $ in $sec\n$FPS: $',
	'_proccessed'=> '$\n$ms: proccessed',

	'msgNoProfile'=> 'no profile info'
);
?>