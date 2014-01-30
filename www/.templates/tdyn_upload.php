
<!-- in Upload Instruments -->
<div id='uploadTmpl' style='display:none'>
	<form enctype='multipart/form-data' target=loadForm action='/' method='POST' style='display:none'>
        <input type='hidden' name='<?= $UPSET->LEGACY_MODESIGN ?>'>
		<input type='hidden' name='PHP_SESSION_UPLOAD_PROGRESS' value=1>
		<input type='hidden' name='MAX_FILE_SIZE' value=1480000000>
		<input type='file' id='filePick' multiple='multiple' name='<?= $UPSET->LEGACY_FILESIGN ?>[]'>
		<input type='submit' id='upSubmit'>
	</form>
</div>
<!-- out Upload Instruments -->
