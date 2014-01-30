<?

/*URL parsing:

New URL is parsed and passed as validated.
Changing URL internally first validates it then fills URL without reaction.
URL is in on form of
: /file[id]
	download file
: (/Username/Board)|(/idNumber)[?[&embed=x][&lang=string][&filter=string]]
	load board. Splitted to:
	reqWHO - desired user name
	reqWhat - desired user board name
		or
	reqId - desired board ID.
		ID is later used to be rather derect ID or invite code

	reqEmbed - flag to embed board
	reqLanguage - interface language
	reqFilter - filter for making implicits
*/

/*
Test list:
Apache, iis
	/name/name, + in locale
	/id
	_GET (?embed=x)
*/


if ($_SERVER['REQUEST_METHOD']=='GET'){

	$_uriA= explode("?",$_SERVER["REQUEST_URI"]);
	$_queryReqA= array_slice( explode("/",$_uriA[0]) ,1);
	
	if (isset($_uriA[1]))
	  foreach(explode("&",$_uriA[1]) as $x){ //Make GET, not need on Iis
		$xSpl= explode("=",$x);
		$_GET[$xSpl[0]]= $xSpl[1];
	  }
	
	
	//todo: switch on direct boardId request
	//	if (count($_queryReqA)>0 && ("".(int)$_queryReqA[0])==$_queryReqA[0])
	//	  $reqId= $_queryReqA[0];

	$_POST['mode']= '';

	$_POST['rId']= -1;
	
	$_POST['rWho']= count($_queryReqA)>0?
	  urldecode($_queryReqA[0])
	  : '';
	$_POST['rWhat']= count($_queryReqA)>1?
	  urldecode($_queryReqA[1])
	  : '';
	$_POST['rEmbed']= array_key_exists("embed", $_GET)?
	  ($_GET["embed"]==1)
	  : 0;
	$_POST['rLang']= array_key_exists("lang", $_GET)?
	  '.'. urldecode($_GET["lang"])
	//todo:change default
	  : '.ru';
	$_POST['rFilter']= array_key_exists("filter", $_GET)?
	  urldecode($_GET["filter"])
	  : '';
}

if (array_key_exists($UPLOAD->LEGACY_MODESIGN, $_POST))
  $_POST['mode']= $ASYNC_MODE->UPLOAD_LEGACY;

?>