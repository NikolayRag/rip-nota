<?

/*
	Site-specific constants are stored in "www.privateCfg" file
	ABOVE www root to make it more secure.
	It is described as colon-separated key:value.
	Fields used are:

	SALT: xx
	DB_HOST: xx
	DB_USER: xx
	DB_PASS: xx
	DB_NAME: xx

*/
$siteSpecificC= Array();

preg_match_all(
	'/(\S+)\s*:([^\n\r]+)/',
	file_get_contents("./../www.privateCfg"),
	$siteSpecificC
);
$SALT=
 $DB_HOST =
 $DB_USER =
 $DB_PASS =
 $DB_NAME =
 '';
foreach($siteSpecificC[1] as $key=>$sscName){
	$sscValue= trim($siteSpecificC[2][$key]);
	switch ($sscName){
		case 'SALT':
			$SALT= $sscValue;
			break;
		case 'DB_HOST':
			$DB_HOST= $sscValue;
			break;
		case 'DB_USER':
			$DB_USER= $sscValue;
			break;
		case 'DB_PASS':
			$DB_PASS= $sscValue;
			break;
		case 'DB_NAME':
			$DB_NAME= $sscValue;
			break;
	}
}

$DB = new kiSQL($DB_HOST, $DB_NAME, $DB_USER, $DB_PASS);

session_start();
$USER = new uFlex();

?>