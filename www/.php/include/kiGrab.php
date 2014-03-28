<?
include('.php/sqTmpl/SQLTFile.php');

function grabEnd($_data){
	if (!$_data->dlId)
	  return;

	$_data->DB->apply('logDlFin',$_data->dlDone,$_data->dlId);
}


/*
	Used to send dbased file requests
	
	deploy setting:
	To avoid timeout on time consuming downloading, set
	  fCGIext.ini: ActivityTimeout=xxx 
*/
$_reqId= $REQA->getFname;
$_isAttach= $REQA->getDload;

//depricated out from function:
//global $DB, $USER, $TIMER_LENGTH;
$userId= $USER->id;
session_write_close();

ob_end_flush();
set_time_limit($TIMER_LENGTH->DAY);
ignore_user_abort(true);
header_remove();

$endData= (object)Array(
	'dlId'=> 0,
	'dlDone'=> 0,
	'DB'=> $DB
);
register_shutdown_function('grabEnd',$endData);



$DB->apply('fileById1',$_reqId);
$qOrig= $DB->fetch();

$fileOrig= arrGet($qOrig,'filename',0);
$fileExt= arrGet($qOrig,'ext',0);
$fullName= ".upload/$_reqId.$fileExt";

if (
	!$fileOrig
	|| !file_exists($fullName)
	|| !($fileH = fopen($fullName, "rb"))
){
	header("HTTP/1.1 404 Not Found");
	header('Content-Disposition: filename=" ";');
	header('Content-Length: 0');
	return;
}

$BIGfStart= 0;
fseek($fileH,0,SEEK_END);
$BIGfEnd= ftell($fileH); //file size>MAXINT will disable downloading

if (!isset($_SERVER['HTTP_RANGE']) || !$BIGfEnd) {
	header("HTTP/1.1 200 OK");
	if ($BIGfEnd)
	  header('Accept-Ranges: bytes');
} else {
	$_tmpSize= $BIGfEnd;

	$m= explode('=', $_SERVER['HTTP_RANGE']);
	$m= explode('-', $m[1]);
	if ($m[0]!='')
	  $BIGfStart= $m[0];
	if ($m[1]!='')
	  $BIGfEnd= bcadd($m[1],1);

	header("HTTP/1.1 206 Partial Content");
	header("Content-Range: bytes $BIGfStart-" .bcadd($BIGfEnd,-1) ."/$_tmpSize");
	header('Accept-Ranges: bytes');
}
if (!$BIGfEnd)
  $BIGfEnd= arrGet($qOrig,'size',0);

$DB->apply('logDl', arrGet($qOrig,'id',0), $_SERVER['REMOTE_ADDR'], $userId, floatval($BIGfStart), floatval($BIGfEnd));
$endData->dlId= $DB->lastInsertId();

$BIGfEnd= bcsub($BIGfEnd,$BIGfStart);
$mtype= arrGet($qOrig,'mime',0);

header("Connection: close");
header('Content-Length: ' .$BIGfEnd);
header('Content-Type: ' .$MIME->{"M$mtype"} );
header("Content-Disposition: " .($_isAttach?'attachment;':''). " filename=\"$fileOrig.$fileExt\"");
	header('Last-Modified: ' .date('D, d M Y H:i:s T', filemtime($fullName)) );
header('Pragma: public'); 
header('Content-Transfer-Encoding: binary');

$chunk= 256*1024;
fseek($fileH, $BIGfStart);

while(!feof($fileH) && $BIGfEnd>0) {
	print fread($fileH, $BIGfEnd>$chunk?$chunk:$BIGfEnd);
	flush();
	$BIGfEnd= bcsub($BIGfEnd,$chunk);
}

fclose($fileH);
$endData->dlDone= 1;

?>