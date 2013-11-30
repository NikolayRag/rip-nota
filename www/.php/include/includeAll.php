<?

$___startTime= $__startTime= microtime(true);

header("Content-type: text/html; charset=UTF-8");
//ob_start('ob_gzhandler'); //gzip output, conflicts with zlib

include('includeError.php');
include('.php/c.php');
include('includeSupport.php');
include('class-SQL.php');
include('.php/sqTmpl/SQLTMain.php');
include('class-authorize.php');

include('init.php');

?>