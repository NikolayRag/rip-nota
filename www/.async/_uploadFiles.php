<?

	set_time_limit(0);
//	include('../.include/includeAll.php');
	
	if($USER->signed) {
		$outA= Array();
		$uploaddir= '\\\\Ki-master0\\Inetpub$\\nota\\.upload';

		foreach ($_FILES['upload']['name'] as $fIndex=>$fName){
			$upFileA= pathinfo ($fName);
			  $fileName= $upFileA['filename'];
			  $fileExt= $upFileA['extension'];

			$guidString= uniqid("",true) .rand();
			  $guidString[14]="0"; //remove '.'

//todo: move this to individual proccess
			if (move_uploaded_file($_FILES['upload']['tmp_name'][$fIndex], "$uploaddir\\$guidString.$fileExt"))
			  mysql_query("INSERT INTO uploads (guid,filename,id_user,public,size,ext,enabled) VALUES ('$guidString','$fileName',$USER->id,1,{$_FILES['upload']['size'][$fIndex]},'$fileExt',1)" );
			else 
			  $guidString= '';
			$outA[]= $guidString;
		}

//???args
//?????!!!minimize		
		echo "<script>window.parent.UPLOAD.formUploadCB(['". implode($outA,"','") ."']);</script>";
	}
?>

