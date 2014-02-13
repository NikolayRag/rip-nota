<?

$nId = ini_get('session.upload_progress.prefix') ."1"; //only one session
$outPerc= Array();
if (isSet($_SESSION[$nId])){
	foreach ($_SESSION[$nId]['files'] as $iUp)
      $outPerc[]= ($iUp['error']==1? -1: $iUp['bytes_processed']); //individual
}
	
//???args
echo implode($outPerc,"\n");

?>
