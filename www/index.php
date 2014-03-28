<?
include('.php/include/includeAll.php');
include('.php/include/filterClient.php');
include('.php/include/filterUrl.php');

//todo: move to stored proc
$DB->apply('logHttpAgent', $_SERVER['HTTP_USER_AGENT']);
$agentId= $DB->lastInsertId();
$DB->apply('logHttpLast', $_SERVER['REMOTE_ADDR'], $_SERVER['REMOTE_PORT'], $agentId, $USER->id);
$lastHttpLog= $DB->fetch();
if ($lastHttpLog && $_SERVER['REQUEST_URI']==$lastHttpLog['request'] && $REQA->mode==$lastHttpLog['mode']){
	$DB->apply('logHttpRe', $lastHttpLog['id']);
	$httpId= $agentId;
} else {
	$DB->apply('logHttp', $_SERVER['REMOTE_ADDR'], $_SERVER['REMOTE_PORT'], $agentId, $_SERVER['REQUEST_URI'], $USER->id, $REQA->mode?$REQA->mode:0);
	$httpId= $DB->lastInsertId();
}



switch (clientType()){
	case $CLIENT_TYPE->SCANNER: //branch: restricted
		header('HTTP/1.1 403 Forbidden');
		exit;
	case $CLIENT_TYPE->BOT: //branch: crawler
		include('.php/update.php');
		include('.templates/t_indexBot.php');
		exit;
}


switch ($REQA->mode){
	case $ASYNC_MODE->UPLOAD_BLOB: //branch: blob upload
		include('.php/uploadBlob.php');
		exit;
	case $ASYNC_MODE->UPLOAD_LEGACY: //branch: legacy upload
//todo: make preventive upload restrictions
		include('.php/uploadLegacy.php');
		exit;
	case $ASYNC_MODE->UPLOADPROGRESS_LEGACY: //branch: legacy upload progress
		include('.php/uploadProgressLegacy.php');
		exit;
	case $ASYNC_MODE->UPDATE: //branch: async update
		include('.php/update.php');
		include('.php/updateOutAsync.php');
		exit;
	case $ASYNC_MODE->SAVE: //branch: async save
		include('.php/save.php');
		exit;
	case $ASYNC_MODE->LOGON: //branch: async logon
	case $ASYNC_MODE->LOGVALIDATE:
		include('.php/logon.php');
		exit;
	case $ASYNC_MODE->DOWNLOAD: //branch: get file; /?=xxx
		include('.php/include/kiGrab.php');
		exit;
	case $ASYNC_MODE->DEFAULT:
		break;
	default:
//todo: errorpage
		echo 'Wrong request';
		exit;
}


//branch: blank-redirect-to-homepage
//todo:	check for HTML5 compatibility
if ($REQA->who=='' && $REQA->rId==-1 && $REQA->filter=='' && $USER->signed){
	header( 'Location: /'. $USER->username .($REQA->embed==1?'#embed=1':'') );
	exit;
}


//branch: main
include('.php/include/includeDic.php');
include('.templates/t_index.php');

if (!$NOPROFILE) echo '<!--', round((microtime(true) -$__startTime)*1000)/1000, 'sec; ', $DB->callsCnt, ' SQLs -->';

include('.php/include/compact.php');

?>
