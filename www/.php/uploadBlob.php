<?

include('sqTmpl/SQLTUpload.php');

set_time_limit(0);

$upFileA= pathinfo ($_SERVER["HTTP_FILENAME"]);
  $fileName= $upFileA['filename'];
  $fileExt= $upFileA['extension'];


$outStr= '';
if ($_SERVER["HTTP_FILE_GUID"]==0){ //first slice
	$guidString= uniqid("",true) .rand();
	  $guidString[14]="0"; //remove '.'
	$outStr= $guidString;

	$DB->apply('logUploadInit',
		$guidString, $fileName, $USER->id, 1, $_SERVER["HTTP_FILESIZE"], $fileExt,0
	);

	$fout= fopen("$UPLOAD_DIR/$guidString.$fileExt","wb");
} else { //sequent slice
	$guidString= $_SERVER["HTTP_FILE_GUID"];

	$fout= fopen("$UPLOAD_DIR/$guidString.$fileExt","ab");
	fseek($fout,$_SERVER["HTTP_SLICE_FROM"]);
}

$fin = fopen("php://input", "rb");
while (!feof($fin))
  fwrite($fout,fread($fin, $_SERVER["HTTP_SLICE_SIZE"]));
fclose($fin);

fclose($fout);

if ($_SERVER["HTTP_SLICE_FROM"]+$_SERVER["HTTP_SLICE_SIZE"]==$_SERVER["HTTP_FILESIZE"])
  $DB->apply('logUploadComplete', $guidString);

//todo: handle upload error
//todo: handle user restriction

echo $outStr; //	$UPSET->RESTRICTED

?>
