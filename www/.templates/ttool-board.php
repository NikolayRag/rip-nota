
<?=$NOPROFILE? '': "<!-- in template toolBoard -->\n"?>
<div id='toolBoardTmpl' class='tool'>
<<<<<<< HEAD
	<span id='toolBoardContext' class='toolContext'>
		<span id='toolBoardOuter'>
			<span id='toolBoardNew' class='toolItem'>new</span>
=======
	<span id='toolContext' class='toolContext'>
		<span id='toolOuter'>
			<span id='toolNewNote' class='toolItem'>note</span>
			<span id='toolNewData' class='toolItem'>data</span>
>>>>>>> save-basic
		</span>
<<<<<<< HEAD
		<span id='toolBoardInner'>
			<span id='toolBoardStyle' class='toolItem'>style</span>
=======
		<span id='toolInner'>
			<span id='toolStyleSample' class='toolItem'></span>
			<span id='toolStyle' class='toolItem'>style</span>
>>>>>>> ui-colorPicker
		</span>
	</span>

	<br>
	<span id='toolBoardSetOwner'>
		<span class='toolWidget'>
			<?=$DIC->boardRtsEdit?> 
			<span id='rights1_E' class='notifier' style='background:#aca;'>anon</span>
			<span id='rights2_E' class='notifier' style='background:#aca;'>guest</span>
			<span id='rights4_E' class='notifier' style='background:#aca;'>contact</span>
		</span>
		<span class='toolWidget'>
			<?=$DIC->boardRtsAdd?> 
			<span id='rights1_A' class='notifier' style='background:#cca;'>a</span>
			<span id='rights2_A' class='notifier' style='background:#cca;'>g</span>
			<span id='rights4_A' class='notifier' style='background:#cca;'>c</span>
		</span>
		<span class='toolWidget'>
			<?=$DIC->boardRtsRo?> 
			<span id='rights1_R' class='notifier' style='background:#ccc;'>a</span>
			<span id='rights2_R' class='notifier' style='background:#ccc;'>g</span>
			<span id='rights4_R' class='notifier' style='background:#ccc;'>c</span>
		</span>
	</span>
</div>
<?=$NOPROFILE? '': "<!-- out template toolBoard -->\n"?>
