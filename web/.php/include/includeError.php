<?

//todo: make output message go only through stderr
//todo: check with login.php

error_reporting(0);
ob_start();

function kiErr () {
	global $NOPROFILE;

	$error = error_get_last();
	if ($error['type']){
		ob_clean();
		header("HTTP/1.0 500");
		if (!$NOPROFILE)
		  echo 'E', $error['type'], ':', $error['message'], '<br>', $error['file'], ':',$error['line'];
		else
		  echo 'E', $error['type'];
		exit;
	}

	ob_flush();
}
register_shutdown_function('kiErr');

?>