<?
include('.php/include/includeAll.php');
include('.php/include/filterClient.php');
include('.php/include/filterUrl.php');


//todo: move to stored proc
$DB->apply('logHttpAgent', $_SERVER['HTTP_USER_AGENT']);
$agentId= $DB->lastInsertId();
$DB->apply('logHttpLast', $_SERVER['REMOTE_ADDR'], $_SERVER['REMOTE_PORT'], $agentId, $USER->id);
$lastHttpLog= $DB->fetch();
if ($lastHttpLog && $_SERVER['REQUEST_URI']==$lastHttpLog['request'] && $_POST['mode']==$lastHttpLog['mode']){
	$DB->apply('logHttpRe', $lastHttpLog['id']);
	$httpId= $agentId;
} else {
	$DB->apply('logHttp', $_SERVER['REMOTE_ADDR'], $_SERVER['REMOTE_PORT'], $agentId, $_SERVER['REQUEST_URI'], $USER->id, $_POST['mode']?$_POST['mode']:0);
	$httpId= $DB->lastInsertId();
}

////FILTER DIFFERENT REQUEST BRANCHES

//branch: restricted
if (clientType()== $CLIENT_TYPE->SCANNER){
	header('HTTP/1.1 403 Forbidden');
	exit;
}


//branch: crawler
if (clientType()== $CLIENT_TYPE->BOT){
	include('.php/update.php');
	include('.templates/t_indexBot.php');
	exit;
}


//branch: legacy upload
if ($_POST['mode']== $ASYNC_MODE->UPLOAD_LEGACY){
//todo: make normal upload restrictions
	include('.php/uploadLegacy.php');
	exit;
}

//branch: legacy upload progress
if ($_POST['mode']== $ASYNC_MODE->UPLOADPROGRESS_LEGACY){
	include('.php/uploadProgressLegacy.php');
	exit;
}

//branch: async update
if ($_POST['mode']== $ASYNC_MODE->UPDATE){
	include('.php/update.php');
	include('.php/updateOutAsync.php');
	exit;
}


//branch: async save
if ($_POST['mode']== $ASYNC_MODE->SAVE){
	include('.php/save.php');
	exit;
}


//branch: async logon
if ($_POST['mode']== $ASYNC_MODE->LOGON || $_POST['mode']==$ASYNC_MODE->LOGVALIDATE){
	include('.php/logon.php');
	exit;
}

//branch: get file; /?=xxx
if ($_queryReqA[0]=='' && isSet($_GET[''])){
	include('.php/grab.php');
	exit;
}


//branch: blank-redirect-to-homepage
//todo:	check for HTML5 compatibility
if ($_POST['rWho']=='' && $_POST['rId']==-1 && $_POST['rFilter']=='' && $USER->signed){
	header( 'Location: /'. $USER->username .($_POST['rEmbed']==1?'#embed=1':'') );
	exit;
}


//branch: main
include('.php/include/includeDic.php');
include('.templates/t_index.php');

if (!$NOPROFILE) echo '<!--', round((microtime(true) -$__startTime)*1000)/1000, 'sec; ', $DB->callsCnt, ' SQLs -->';

include('.php/include/compact.php');

?>
