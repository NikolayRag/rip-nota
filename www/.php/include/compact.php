<?

function wasEdited($_dirsA, $_mini){
	$timeEdited= filemtime(".php/c.php");

	foreach($_dirsA as $dn){
		$d = dir($dn);
		while ($entry = $d->read())
		  $timeEdited= max($timeEdited, filemtime("$dn/$entry"));
		$d->close();
	}

	return (!file_exists($_mini)) || $timeEdited>filemtime($_mini);
}

function readDirFiles($_dir,$_fileList= null){
	$content_= '';

	if ($_fileList && file_exists("$_dir/$_fileList")){
//todo: remove checking \n twice
		$fileList= Array();
		foreach(explode("\n",file_get_contents("$_dir/$_fileList")) as $entry){
			$entry= explode(chr(13),$entry)[0];
			if (preg_match('/^[^#].+$/',$entry) && is_file("$_dir/$entry"))
			  $content_.= file_get_contents("$_dir/$entry");
		}
	} else {
		$d = dir($_dir);
		while ($entry = $d->read())
		  if (is_file("$_dir/$entry"))
		    $content_.= file_get_contents("$_dir/$entry");
	}

	return $content_;
}

function kiMiniDictionary(){
	include(".dictionary/dic.php");
	$origDic= $DIC;

	foreach (glob(".dictionary/dic*.php") as $entry){
		$lang= array();
		preg_match('/\.dictionary\/dic(.*)\.php/', $entry, $lang);

		if (!wasEdited(
			Array(".dictionary")
			, ".mini/dic$lang[1].js"
		))
		  continue;

		$DIC= $origDic;
		if ($lang[1]){
			include($entry);
			$DIC= array_merge($DIC, $DICLOC); 
		}

		$LibFlatA= Array();
		foreach($DIC as $n=>$v){
		$v= str_replace(Array("\t","\n",chr(13)), Array('\\t','\\n','\\n'), $v);
			$LibFlatA[]= "$n:\"{$v}\"";
		}

		$outDict= "document['dic']= {\n\t". implode(",\n\t", $LibFlatA) ."\n};";

		file_put_contents(".mini/dic$lang[1].js",$outDict);
	}
}


function kiMiniCss($_renameA=false){
	if (!wasEdited(
		Array(".css", ".templates")
		, ".mini/mini.css"
	))
	  return;

	$outCss= readDirFiles('.css');

	global 	$NOPROFILE;
	if ($NOPROFILE)
	  $outCss= str_replace(Array(' {',': ',"\t","\n",chr(13)), Array('{',':'), $outCss);

	//subst $var and ${var} variables with $CSS->var value
	global $CSS;
	$outCss= preg_replace_callback(
		'/\$([\w_]+)|\$\{([\w_]+)\}/',
		function ($_in) use ($CSS) {
			$foundName= $_in[1]!=''? $_in[1]:$_in[2];
			return isset($CSS->$foundName)? $CSS->$foundName : $_in[0];
		},
		$outCss
	);

	//minify
	if ($_renameA)
	  $outCss= preg_replace_callback(
			'/(?:(^|\}|\,)\s*(#|\.)([\d\w]+)([\s\{]))/',
			function ($_in) use ($_renameA) {
				$substV= (arrGet($_renameA, $_in[3], '')!=''? $_renameA[$_in[3]] : $_in[3]);
				return $_in[1] .$_in[2] .$substV .$_in[4];
			},
			$outCss
	  );

	file_put_contents(".mini/mini.css",$outCss);
}	


function kiMiniJs($_renameA=false){
	if (!wasEdited(
		Array(".javascript", ".javascript/UI", ".javascript/UNITS", ".javascript/Adds", ".templates")
		, ".mini/mini.js"
	))
	  return;

	//fetch constants from php
	global $CONSTANTS;
	$constsA= array();

	foreach ($CONSTANTS as $cName=>$cCont){
		if (is_array($cCont)){
			$constVars= array();
			foreach ($cCont as $cVar=>$cVal)
			  $constVars[]= $cVar .':'. var_export($cVal,true);

			$cCont= '{' .implode(',', $constVars) .'}';
		}
	
		$constsA[]= '/** @const */ var ' .$cName .'= ' .$cCont;
	}
	$constsA[]= '';

	//collect js
	$outJs= implode(";\n", $constsA)
	  .readDirFiles('.javascript', '.list');

	if ($_renameA)
	  $outJs= preg_replace_callback(
			'/(?:(DOM\(\'|case \'\.)([\d\w]+)\')/',
			function ($_in) use ($_renameA) {
				$substV= (arrGet($_renameA, $_in[2], '')!=''? $_renameA[$_in[2]] : $_in[2]);
				return $_in[1] .$substV .'\'';
			},
			$outJs
	  );

	file_put_contents(".mini/mini.js",$outJs);
}

/*
    Parse output buffer and replace all matches within $HTMLDic with short aliases
*/

function kiMiniHTML(&$HTMLDic){
	$html= ob_get_contents();
	ob_clean();

	$HTMLDic= Array();
	$substI= 360; //decimal for 'a1' base 36 (0-z) to start from
	return preg_replace_callback(
		'/(?:(class|id)=\'([\d\w]+)\')|(<!--.*-->)/',
		function ($_matches) use (&$substI,&$HTMLDic) {
			if (!empty($_matches[3])) //blank, wipe
			  return;

			if (empty($HTMLDic[$_matches[2]]))
			  $HTMLDic[$_matches[2]]= base_convert($substI++,10,36);;
			return $_matches[1] .'=\'' .$HTMLDic[$_matches[2]] .'\'';
		},
		$html
	);
}


$HTMLDic= false;
if ($NOPROFILE)
  echo kiMiniHTML($HTMLDic);

kiMiniDictionary();
kiMiniCss($HTMLDic);
kiMiniJs($HTMLDic);

?>