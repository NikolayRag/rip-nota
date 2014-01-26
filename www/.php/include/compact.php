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
		foreach($DIC as $n=>$v)
		  $LibFlatA[]= "$n:\"{$v}\"";

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
				$substV= ((array_key_exists($_in[3],$_renameA) && $_renameA[$_in[3]]!='')? $_renameA[$_in[3]] : $_in[3]);
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
	$outJs= implode(";\n", $constsA).
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
	 file_get_contents(".javascript/UNITS/D.ui-unknown.js").
	 file_get_contents(".javascript/UNITS/D.ui-text.js").
	 file_get_contents(".javascript/UNITS/D.ui-note.js").

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
			if (array_key_exists(3, $_matches)) //blank, wipe
			  return;

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

kiMiniDictionary();
kiMiniCss($HTMLDic);
kiMiniJs($HTMLDic);

?>