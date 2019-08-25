<?
//these constants are also read into js

$CONSTANTS= array(
		'NOPROFILE'=>	0 //1= clean all unneccessary info
);

include('c-engine.php');
include('c-ui.php');

//unwrap constants into individual variables
foreach ($CONSTANTS as $cName=>$cCont)
  ${$cName}= is_array($cCont)?(object)$cCont:$cCont;

?>