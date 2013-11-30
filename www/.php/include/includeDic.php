<?

include(".dictionary/dic.php");

switch ($_POST['rLang']){
	case '.ru':
		include(".dictionary/dic". $_POST['rLang'] .".php");
		break;
	default:
	  $_POST['rLang']= '';
}
if ($_POST['rLang'] != '')
  $DIC= array_merge($DIC, $DICLOC); 

$DIC= (object) $DIC;

?>