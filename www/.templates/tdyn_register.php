
<!-- in template Register -->
<span id='regTmpl'>
	<?=$DIC->popRegisterTitle?><br>
	<span id='regUname' class='bigTxt'></span><br><br>
	<?=$DIC->popRegisterConfirm?> 
	<input name='regPass' id='regPass' value='' type='password'>

	<span style='display:none'>
		<br><input name='first_name' type='text'>
		<br><input name='last_name' type='text'>
		<br><input name='email' type='text'>
		<br><input name='website' type='text'>
		<br><select name='group_id'>
			<option value=1 selected='selected'>
		</select>
	</span>
</span>
<!-- out template Register -->
