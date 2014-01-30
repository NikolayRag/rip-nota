<?

set_time_limit(0);

$uploaddir= '//Ki-master0/Inetpub$/nota/www/.upload';

$upFileA= pathinfo ($_SERVER["HTTP_FILENAME"]);
  $fileName= $upFileA['filename'];
  $fileExt= $upFileA['extension'];


if ($_SERVER["HTTP_FILE_GUID"]==0){ //first slice
	$guidString= uniqid("",true) .rand();
	  $guidString[14]="0"; //remove '.'

//..			mysql_query("INSERT INTO uploads (guid,filename,id_user,public,size,ext,enabled) VALUES ('$guidString','$fileName',$USER->id,1,{$_SERVER["HTTP_FILESIZE"]},'$fileExt',0)" );

	$fout= fopen("$uploaddir/$guidString.$fileExt","wb");
} else { //sequent slice
	$guidString= $_SERVER["HTTP_FILE_GUID"];

	$fout= fopen("$uploaddir/$guidString.$fileExt","ab");
	fseek($fout,$_SERVER["HTTP_SLICE_FROM"]);
}

$fin = fopen("php://input", "rb");
while (!feof($fin))
  fwrite($fout,fread($fin, $_SERVER["HTTP_SLICE_SIZE"]));
fclose($fin);

fclose($fout);

//..		if ($_SERVER["HTTP_SLICE_FROM"]+$_SERVER["HTTP_SLICE_SIZE"]==$_SERVER["HTTP_FILESIZE"])
//..		  mysql_query("UPDATE uploads SET enabled=1 WHERE guid='$guidString'");
echo $guidString;

?>
