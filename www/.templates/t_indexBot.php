<html>
<head>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
	<meta name='Keywords' content='nota,board,webboard,sticker,note,personal,individual,nickside,space,virtual,online,remote,information,wall,mind,map,mindmap,collaborative,writing,remark,hold,representation,home,homepage,own,together,share,map,scheme'>
	<meta name='Description' content='Personal shared mindmap'>
	<title>Nota Нота</title>
</head>

<body>

<div>Board owner: <?$u= $usersA->all(); echo $u[$whoId]->name?></div>

<?
	foreach ($notesA->all() as $noteP){
		$toOut= 0; $maxStamp= 0;
		foreach ($noteP->data as $dataP)
		  if ($dataP->datatype==$DATA_TYPE->TEXT){ $toOut= 1; $maxStamp= $dataP->stamp>$maxStamp? $dataP->stamp :$maxStamp; }
		if (!$toOut) continue;
?>
	<hr>
	<?= date("Y-m-d H:i",time()-$maxStamp); ?>:
	<? foreach ($noteP->data as $dataP){ ?><p>
			<?= $dataP->datatype==$DATA_TYPE->TEXT? decode64($dataP->data) :''; ?>
	</p><? } ?>
<?
	}
?>


</body>
</html>
