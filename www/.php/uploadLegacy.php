<?

include('sqTmpl/SQLTUpload.php');

set_time_limit(0);

$outA= Array();

$filesDone= $_FILES[$UPLOAD->LEGACY_FILESIGN];

foreach ($filesDone['name'] as $fIndex=>$fName){
	$err= $filesDone['error'][$fIndex];
	if ($err)
		unlink( $filesDone['tmp_name'][$fIndex] );
	else {
		$upFileA= pathinfo($fName);
		  $fileName= $upFileA['filename'];
		  $fileExt= $upFileA['extension'];

		$guidString= uniqid("",true) .rand();
		  $guidString[14]="0"; //remove '.'

//todo: move this to individual proccess
		$uploaddir= '//Ki-master0/Inetpub$/nota/www/.upload';
		if (!move_uploaded_file(
			$filesDone['tmp_name'][$fIndex]
			, "$uploaddir/$guidString.$fileExt"
		))
		  $err= 1;
	}

	if ($err)
	  $guidString= '';

	$outA[]= $guidString;

//todo: make bulk
	$DB->apply('logUploadLegacy',
		$guidString, $fileName, $USER->id, 1, $filesDone['size'][$fIndex], $fileExt,1
	);
}


//???args
echo implode($outA,"\n");

?>

