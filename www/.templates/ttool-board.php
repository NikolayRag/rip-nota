
<?=$NOPROFILE? '': "<!-- in template toolBoard -->\n"?>
<div id='toolBoardTmpl' class='tool'>
	<span id='toolContext' class='toolContext'>
		<span id='toolOuter'>
			<span id='toolNew' class='toolItem'>new</span>
		</span>
		<span id='toolInner'>
			<span id='toolStyleSample' class='toolItem'></span>
			<span id='toolStyle' class='toolItem'>style</span>
		</span>
	</span>

	<br>
	<span id='toolsetOwner'>
		<div class='toolWidget'>
			<?=$DIC->boardRtsEdit?> 
			<span id='rights1_E' class='notifier' style='background:#aca;'>anon</span>
			<span id='rights2_E' class='notifier' style='background:#aca;'>guest</span>
			<span id='rights4_E' class='notifier' style='background:#aca;'>contact</span>
		</div>
		<div class='toolWidget'>
			<?=$DIC->boardRtsAdd?> 
			<span id='rights1_A' class='notifier' style='background:#cca;'>a</span>
			<span id='rights2_A' class='notifier' style='background:#cca;'>g</span>
			<span id='rights4_A' class='notifier' style='background:#cca;'>c</span>
		</div>
		<div class='toolWidget'>
			<?=$DIC->boardRtsRo?> 
			<span id='rights1_R' class='notifier' style='background:#ccc;'>a</span>
			<span id='rights2_R' class='notifier' style='background:#ccc;'>g</span>
			<span id='rights4_R' class='notifier' style='background:#ccc;'>c</span>
		</div>
	</span>
</div>
<?=$NOPROFILE? '': "<!-- out template toolBoard -->\n"?>
