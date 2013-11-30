
<?=$NOPROFILE? '': "<!-- in Widget Popup -->\n"?>
<div id='popUpCover' style='display:none'></div>
<form method='post' id='popUpWindow' style='display:none'>
	<span id='popUpContent'></span>
	<div id='popUpBar' class='leftBar'>
		<br><br>
		<input id='popOk' value="<?=$DIC->labOk?>" type='submit'>
		<input id='popNo' value="<?=$DIC->labNotok?>" type='reset'>
	</div>
</form>
<?=$NOPROFILE? '': "<!-- out Widget Popup -->\n"?>
