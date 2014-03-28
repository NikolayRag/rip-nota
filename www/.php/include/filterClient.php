<?

function clientType() {
	global $CLIENT_TYPE;

	$scannerNames= 'nmap|nikto|wikto|sf|sqlmap|bsqlbf|w3af|acunetix|havij|appscan|morfeus|zmeu';
	if (preg_match("/$scannerNames/i", $_SERVER['HTTP_USER_AGENT']))
	  return $CLIENT_TYPE->SCANNER;

	$crawlerNames= 'bot|archiver|slurp|teoma|yandex|google|rambler|yahoo|accoona|aspseek|crawler|lycos|scooter|altavista|estyle|scrubby';
	if (preg_match("/$crawlerNames/i", $_SERVER['HTTP_USER_AGENT']))
	  return $CLIENT_TYPE->BOT;

	return $CLIENT_TYPE->DEFAULT;
}

?>