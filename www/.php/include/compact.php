<?

function kiMiniDictionary($_reqLanguage=''){
	$dicEdited= filemtime(".php/c.php");

	$dicEdited= max($dicEdited, filemtime(".dictionary/dic.php"));
	include(".dictionary/dic.php");

	if ($_reqLanguage){
		$dicEdited= max($dicEdited, filemtime(".dictionary/dic". $_reqLanguage .".php"));
		include(".dictionary/dic". $_reqLanguage .".php");
		$DIC= array_merge($DIC, $DICLOC); 
	}

	if (file_exists(".mini/dic". $_reqLanguage .".js") && $dicEdited<=filemtime(".mini/dic". $_reqLanguage .".js"))
	  return;

	$LibFlatA= Array();
	foreach($DIC as $n=>$v)
	  $LibFlatA[]= "$n:\"{$v}\"";

	$outDict= "document['dic']= {\n\t". implode(",\n\t", $LibFlatA) ."\n};";

	file_put_contents(".mini/dic". $_reqLanguage .".js",$outDict);
}


function kiMiniCss($_renameA=false){
	$cssEdited= filemtime(".php/c.php");

	$d = dir(".css");
	while ($entry = $d->read())
	  $cssEdited= max($cssEdited, filemtime(".css/". $entry));
	$d->close();

	//check for html edited too - id's might change
	$d = dir(".templates");
	while ($entry = $d->read())
	  $cssEdited= max($cssEdited, filemtime(".templates/". $entry));
	$d->close();

	if (file_exists(".mini/mini.css") && $cssEdited<=filemtime(".mini/mini.css"))
	  return;

	$outCss= 
	 file_get_contents(".css/all.css").
	 file_get_contents(".css/menu.css").
	 file_get_contents(".css/popup.css").
	 file_get_contents(".css/overview.css").
	 file_get_contents(".css/notify.css").
	 file_get_contents(".css/note.css").
	 file_get_contents(".css/contacts.css").
	 file_get_contents(".css/ndata.css").
	 file_get_contents(".css/w-login.css").
	 file_get_contents(".css/tool.css");

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
				$substV= ((array_key_exists($_in[3],$_renameA) && $_renameA[$_in[3]]!='')? $_renameA[$_in[3]] : $_in[3]);
				return $_in[1] .$_in[2] .$substV .$_in[4];
			},
			$outCss
	  );

	file_put_contents(".mini/mini.css",$outCss);
}	


function kiMiniJs($_renameA=false){
	$jsEdited= filemtime(".php/c.php");

	$d = dir(".javascript");
	while ($entry = $d->read())
	  $jsEdited= max($jsEdited, filemtime(".javascript/". $entry));
	$d->close();
	$d = dir(".javascript/UI");
	while ($entry = $d->read())
	  $jsEdited= max($jsEdited, filemtime(".javascript/UI/". $entry));
	$d->close();
	$d = dir(".javascript/UNITS");
	while ($entry = $d->read())
	  $jsEdited= max($jsEdited, filemtime(".javascript/UNITS/". $entry));
	$d->close();
	$d = dir(".javascript/Adds");
	while ($entry = $d->read())
	  $jsEdited= max($jsEdited, filemtime(".javascript/Adds/". $entry));
	$d->close();

	//check for html edited too - id's might change
	$d = dir(".templates");
	while ($entry = $d->read())
	  $jsEdited= max($jsEdited, filemtime(".templates/". $entry));
	$d->close();

	if (file_exists(".mini/mini.js") && $jsEdited<=filemtime(".mini/mini.js"))
	  return;

	//fetch constants from php
	global $CONSTANTS;
	$constsA= array();

	foreach ($CONSTANTS as $cName=>$cCont){
		if (!is_array($cCont)){
			$constsA[]= '/** @const */ var ' .$cName .'= ' .$cCont;
			continue;
		}

		$constVars= array();
		foreach ($cCont as $cVar=>$cVal)
		  $constVars[]= $cVar .':'. var_export($cVal,true); 
	
		$constsA[]= '/** @const */ var ' .$cName .'= {' .implode(',', $constVars) .'}';
	}
	$constsA[]= '';
	file_put_contents(".javascript/wrap-c-auto.js",implode(";\n", $constsA));

	//collect js
	$outJs=
	 file_get_contents(".javascript/wrap-c-auto.js").
	 file_get_contents(".javascript/wrap-in.js").
	 file_get_contents(".javascript/wrap-objects.js").
	 file_get_contents(".javascript/wrap-ui.js").

	 //libraries
	 file_get_contents(".javascript/class-color.js").
	 file_get_contents(".javascript/class-style.js").

	 file_get_contents(".javascript/helpers.js").

	 //core
//		 file_get_contents(".javascript/object-upload_legacy.js").
//		 file_get_contents(".javascript/object-upload.js").

	 file_get_contents(".javascript/object-session.js").
	 file_get_contents(".javascript/object-session.logon.js").
	 file_get_contents(".javascript/object-session.update.js").
	 file_get_contents(".javascript/object-session.save.js").	

	 file_get_contents(".javascript/UNITS/U.js").
	 file_get_contents(".javascript/UNITS/N.js").

	 file_get_contents(".javascript/UNITS/N-note.js").
	 file_get_contents(".javascript/UNITS/N-note.ui.js").

	 file_get_contents(".javascript/UNITS/N-board.js").
	 file_get_contents(".javascript/UNITS/N-board.ui.js").
	 file_get_contents(".javascript/UNITS/N-board.ui.overview.js").

	 file_get_contents(".javascript/UNITS/D.js").
	 //data ui
	 file_get_contents(".javascript/UNITS/D.ui-board-.js").
	 file_get_contents(".javascript/UNITS/D.ui-board-el.js").
	 file_get_contents(".javascript/UNITS/D.ui-board-note.js").
	 file_get_contents(".javascript/UNITS/D.ui-note-.js").
	 file_get_contents(".javascript/UNITS/D.ui-note-el.js").

	 //ui
	 file_get_contents(".javascript/UI/ui.js").
	 file_get_contents(".javascript/UI/W.login.js").
	 file_get_contents(".javascript/UI/W.you.js").
	 file_get_contents(".javascript/UI/W.owner.js").
	 file_get_contents(".javascript/UI/W.boardlist.js").
	 file_get_contents(".javascript/UI/W.tools.js").
	 file_get_contents(".javascript/UI/W.logo.js").
	 file_get_contents(".javascript/UI/W.pop.js").
	 file_get_contents(".javascript/UI/W.palette.js").

	 file_get_contents(".javascript/UI/tool.js").
	 file_get_contents(".javascript/UI/tool.leafNote.js").
	 file_get_contents(".javascript/UI/tool.leafNoteEdit.js").
	 file_get_contents(".javascript/UI/tool.board.js").

//		 file_get_contents(".javascript/object-ui.wrap-contacts.js").

     //adds
     file_get_contents(".javascript/Adds/canvas0.js").

	 file_get_contents(".javascript/object-__profile.js").

	 file_get_contents(".javascript/wrap-out.js");


	if ($_renameA)
	  $outJs= preg_replace_callback(
			'/(?:(DOM\(\'|case \'\.)([\d\w]+)\')/',
			function ($_in) use ($_renameA) {
				$substV= ((array_key_exists($_in[2],$_renameA) && $_renameA[$_in[2]]!='')? $_renameA[$_in[2]] : $_in[2]);
				return $_in[1] .$substV .'\'';
			},
			$outJs
	  );

	file_put_contents(".mini/mini.js",$outJs);

	//closure compiler
//	if (isset($_GET["gcc"]) && $_GET["gcc"]==1);
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
    	'/(?:(class|id)=\'([\d\w]+)\')/',
    	function ($_matches) use (&$substI,&$HTMLDic) {
    		if (!array_key_exists($_matches[2], $HTMLDic))
    		  $HTMLDic[$_matches[2]]= base_convert($substI++,10,36);;
    		return $_matches[1] .'=\'' .$HTMLDic[$_matches[2]] .'\'';
    	},
    	$html
    );
}


$HTMLDic= false;
if ($NOPROFILE)
  echo kiMiniHTML($HTMLDic);

kiMiniCss($HTMLDic);
kiMiniDictionary();
kiMiniDictionary('.ru');
kiMiniJs($HTMLDic);

?>