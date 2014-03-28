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

class ReqURI {
	var $mode, $rId=-1, $who='', $what='', $embed=0, $lang='en', $filter='';

	function ReqURI($_get, $_mode, $_lang){
		global $ASYNC_MODE;

		$this->mode= $_mode;
		$this->lang= $_lang;

		if (!$_get){
			  $this->rId= arrGet($_POST, 'rId', $this->rId);
			  $this->who= arrGet($_POST, 'rWho', $this->who);
			  $this->what= arrGet($_POST, 'rWhat', $this->what);
			  $this->embed= arrGet($_POST, 'rEmbed', $this->embed);
			  $this->filter= arrGet($_POST, 'rFilter', $this->filter);
			  $this->lang= arrGet($_POST, 'rLang', $this->lang);
		} else {

			$_uriA= explode("?",$_SERVER["REQUEST_URI"]);
			$_queryReqA= array_slice( explode("/",$_uriA[0]) ,1);
			
//spike:
			if (isset($_uriA[1]))
			  foreach(explode("&",$_uriA[1]) as $x){ //Make GET, not need on Iis
				$xSpl= explode("=",$x);
				$_GET[$xSpl[0]]= $xSpl[1];
			  }
			
			
			//todo: switch on direct boardId request
			//	if (count($_queryReqA)>0 && ("".(int)$_queryReqA[0])==$_queryReqA[0])
			//	  $reqId= $_queryReqA[0];

			if (count($_queryReqA)>0)
			  $this->who= urldecode($_queryReqA[0]);

			if (count($_queryReqA)>1)
			  $this->what= urldecode($_queryReqA[1]);

			if (!empty($_GET['embed']))
			  $this->embed= ($_GET['embed']==1);

			if (!empty($_GET['lang']))
			  $this->lang= urldecode($_GET['lang']);

			if (!empty($_GET['filter']))
			  $this->filter= urldecode($_GET['filter']);


			if ($_queryReqA[0]=='' && isSet($_GET[''])){
				$this->mode= $ASYNC_MODE->DOWNLOAD;
				$this->getFname= $_GET[''];
				$this->getDload= isSet($_GET['dl'])?(int)$_GET['dl']:0;
			}

		}
	}
};

$mode= arrGet($_SERVER, $ASYGN->MODE_SRV, $ASYNC_MODE->DEFAULT);

//legacy:
if (!empty($_POST[$UPSET->LEGACY_MODESIGN])) //legacy upload
  $mode= $ASYNC_MODE->UPLOAD_LEGACY;

$REQA= new ReqURI(
	$_SERVER['REQUEST_METHOD']=='GET',
	$mode,
	$DEFAULT->LANG
);

?>