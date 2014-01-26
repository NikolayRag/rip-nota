
<!-- in Bar Board Tools -->
<div class='menu'><ul>
  <li><a><?=$DIC->boardTools?></a><ul>
    <li><p><INPUT type='text' id='boardCreate' style='width:100%;color:#888;'><?=$DIC->boardToolsNew?></p></li>
    <li><hr></li>
    <li><a id='boardUpload'><?=$DIC->boardToolsUpload?></a></li>
    <li><a id='boardStylize'><?=$DIC->boardToolsStyle?></a></li>
    <li><p><?=$DIC->boardToolsRename?></p></li>
    <li><p><?=$DIC->boardToolsCopy?></p></li>
    <li><hr></li>
    <li><p><?=$DIC->boardToolsClear?></p></li>
    <li><p><?=$DIC->boardToolsDel?></p></li>
  </ul></li>
</ul></div>
<br>



<div id='templateUpload' style='display:none'>
	<form enctype='multipart/form-data' target=loadForm action='../.async/asyncUploadFiles.php' method='POST' style='display:none'>
		<input type='hidden' name='PHP_SESSION_UPLOAD_PROGRESS' value=1>
		<input type='hidden' name='MAX_FILE_SIZE' value=1480000000>
		<input type='file' id='filePick' multiple='multiple' name='upload[]'>
		<input type='submit' id='upSubmit'>
	</form>
</div>
<!-- out Bar Board Tools -->
