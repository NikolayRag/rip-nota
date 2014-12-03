<?

/*
	Site-specific constants are stored in "www.privateCfg" file
	ABOVE www root to make it more secure.
	It is described as colon-separated key:value.
	Fields used are:

	salt: xx
	db_host: xx
	db_user: xx
	db_pass: xx
	db_name: xx

*/

class SiteCfg {
	var $salt=	'',
	 $db_host=	'',
	 $db_user=	'',
	 $db_pass=	'',
	 $db_name=	'',
	 $upload_dir=	'',
	 $lang_remap=	'',
	 $lang_default=	'',
	 $languages=	'';

	function SiteCfg(){
		$cfgFile= './../www.privateCfg';
		$localCfg= Array();

		preg_match_all(
			'/(\S+)\s*:([^\n\r]*)/',
			file_get_contents($cfgFile),
			$localCfg
		);

		foreach($localCfg[1] as $key=>$sscName)
		  $this->$sscName= trim($localCfg[2][$key]);
	}
}

$SITECFG= new SiteCfg();


$DB = new kiSQL($SITECFG->db_host, $SITECFG->db_name, $SITECFG->db_user, $SITECFG->db_pass);
if ($DB->dbErr){
	include('.templates/t_dbError.php');
	exit;
}

session_start();
$USER = new uFlex();

?>