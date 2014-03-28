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

	var $salt='', $db_host='', $db_user='', $db_pass='', $db_name='', $upload_dir='';

	function SiteCfg(){
		$cfgFile= './../www.privateCfg';
		$siteSpecificConfig= Array();

		preg_match_all(
			'/(\S+)\s*:([^\n\r]+)/',
			file_get_contents($cfgFile),
			$siteSpecificConfig
		);

		foreach($siteSpecificConfig[1] as $key=>$sscName){
			$sscValue= trim($siteSpecificConfig[2][$key]);
			switch ($sscName){
				case 'salt':
					$this->salt= $sscValue;
					break;
				case 'db_host':
					$this->db_host= $sscValue;
					break;
				case 'db_user':
					$this->db_user= $sscValue;
					break;
				case 'db_pass':
					$this->db_pass= $sscValue;
					break;
				case 'db_name':
					$this->db_name= $sscValue;
					break;
				case 'upload_dir':
					$this->upload_dir= $sscValue;
					break;
			}
		}

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