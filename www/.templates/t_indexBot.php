<html>
<head>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
	<meta name='Keywords' content='nota,board,webboard,sticker,note,personal,individual,nickside,space,virtual,online,remote,information,wall,mind,map,mindmap,collaborative,writing,remark,hold,representation,home,homepage,own,together,share,map,scheme'>
	<meta name='Description' content='Personal shared mindmap'>
	<title>Nota Нота</title>

	<style>
*{
	background:#eef;
	margin:0;
	padding:0;
	font:12pt sans-serif;
}
.botHead{
	background:#def;
	padding:10px;
}
.botNote{
	padding:10px;
	border-bottom:1px solid #ddf;
}
.botCaption{
	color:#666;
	font-size:10pt;
}
.botLeaf{
	padding-left:20px;
}

	</style>
</head>

<body>

	<div class='botHead'>Board owner: <?$u= $usersA->all(); echo $u[$whoId]->name?></div>

<?
	foreach ($notesA->all() as $noteP){
		$toOut= 0; $maxStamp= 0;
		foreach ($noteP->data as $dataP)
		  if ($dataP->datatype==$DATA_TYPE->TEXT){ $toOut= 1; $maxStamp= $dataP->stamp>$maxStamp? $dataP->stamp :$maxStamp; }
		if (!$toOut) continue;
?>
	<div class='botNote'>
		<div class='botCaption'><?= date("Y-m-d H:i",$maxStamp); ?>:</div>
		<? foreach ($noteP->data as $dataP){ ?><div class='botLeaf'>
				<?= $dataP->datatype==$DATA_TYPE->TEXT? decode64($dataP->data) :''; ?>
		</div><? } ?>
	</div>
<?
	}
?>


</body>
</html>
