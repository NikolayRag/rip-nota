<!doctype html>
<html>
	<head>
	<meta content='charset=utf-8'>
	<meta name='Keywords' content='nota,board,webboard,sticker,note,personal,individual,nickside,space,virtual,online,remote,information,wall,mind,map,mindmap,collaborative,writing,remark,hold,representation,home,homepage,own,together,share,map,scheme'>
	<meta name='Description' content='Personal shared mindmap'>
	<title><?=$DIC->labTitle?></title>

	<link rel='stylesheet' type='text/css' href='/.mini/mini.css' />
</head>

<body id='body'>

<!-- Splashscreen; Will auto-hide when css loads -->
<div class='hidden' style='font:20pt sans-serif;z-index:1000;position:fixed;top:0;bottom:0;left:0;right:0;background:<?=$CSS->MAIN_BG?>;color:<?=$CSS->DECORDARK?>;text-align:center'>
	<table style='width:100%;height:100%'><tr><td><?=$DIC->preCss?></td></tr></table>
</div>

<a class='hidden' href='anti-robots.txt'>DON'T browse into! It's a TRAP!</a>
<iframe id='legacyUploadFrame' name='loadForm' class='hidden'></iframe>
<div id='templates' style='display:none'>
	<? include('.templates/tdyn_register.php'); ?>
	<? include('.templates/tdyn_palette.php'); ?>
	<? include('.templates/tdyn_pin.php'); ?>
	<? include('.templates/tdyn_upload.php'); ?>
	<? include('.templates/ttool_boardLeaf.php'); ?>
	<? include('.templates/ttool_boardLeafEdit.php'); ?>
	<? include('.templates/ttool_board.php'); ?>
	<? include('.templates/tunit_plateBoard.php'); ?>
	<? include('.templates/tunit_plateBoardOverview.php'); ?>
	<? include('.templates/tunit_plateNote.php'); ?>
	<? include('.templates/tunit_leaf.php'); ?>
	<? include('.templates/tunit_leafText.php'); ?>
	<? include('.templates/tunit_leafNote.php'); ?>
</div>
<span id='testEl'></span>

<div id='workField'></div>

<table id='workToolbar' <?=($REQA->embed?'style=display:none':'')?>><tr>
	<td id='barLogo'><? include('.templates/t_barLogo.php'); ?></td>
	<td id='barBoardOwner' style='display:none'><? include('.templates/t_barBoardOwner.php'); ?></td>
	<td id='barBoardTools' style='display:none'><? include('.templates/t_barBoardTools.php'); ?></td>
	<td style='width:100%'></td>
	<td id='barUser' <?=($USER->id==0?'style=display:none':'')?>><? include('.templates/t_barUser.php'); ?></td>
	<td id='barLogon' <?=($USER->id>0?'style=display:none':'')?>><? include('.templates/t_barLogon.php'); ?></td>
</tr></table>

<? include('.templates/t_widContactlist.php'); ?>
<? include('.templates/t_widPopup.php'); ?>

<script type='text/javascript'>
	document.argsA= [<?=implode(',',Array(
			$ARGS_PLACE->USERID=> $USER->id,
			$ARGS_PLACE->USERNAME=> "'{$USER->data['first_name']}'",
			$ARGS_PLACE->REQWHO=> "'$REQA->who'",
			$ARGS_PLACE->REQWHAT=> "'$REQA->what'",
			$ARGS_PLACE->REQNOTEID=> $REQA->rId,
			$ARGS_PLACE->REQFILTER=> "'$REQA->filter'",
			$ARGS_PLACE->EMBED=> $REQA->embed,
		))?>];
</script>
<script src='/.mini/dic.<?= $REQA->lang!=''?"$REQA->lang.":'' ?>js'></script>
<script src='/.mini/mini.js'></script>
</body>
</html>
