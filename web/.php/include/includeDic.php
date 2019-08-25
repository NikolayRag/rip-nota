<?
/*
	default dictionary is used if not any known override languages are specified.

*/

if (!preg_match("/^($SITECFG->languages)\$/i", $REQA->lang)) //unknown, drop it
  $REQA->lang= $SITECFG->lang_remap; 

if ($REQA->lang == $SITECFG->lang_default)
  $REQA->lang= '';

include(".dictionary/dic.php");
if ($REQA->lang != ''){
	include(".dictionary/dic.$REQA->lang.php"); //load over
	$DIC= array_merge($DIC, $DICLOC);
}

$DIC= (object) $DIC;

?>