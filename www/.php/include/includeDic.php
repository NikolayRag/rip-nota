<?

include(".dictionary/dic.php");

switch ($REQA->lang){
	case 'ru':
		include(".dictionary/dic.$REQA->lang.php");
		break;
	default:
	  $REQA->lang= '';
}
if ($REQA->lang != '')
  $DIC= array_merge($DIC, $DICLOC); 

$DIC= (object) $DIC;

?>