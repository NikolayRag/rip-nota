<?

include('sqTmpl/SQLTNData.php');


class NData {
	var $id, $editorId, $datatype, $data, $version, $stamp, $place; //constructor arguments
	var $isDeleted=0, $isImplicit=0, $forSave= 0, $forDel= 0, $saveRes, $rootNote;
		
	function NData($_id=0, $_editorId=0, $_datatype=0, $_data='', $_version=0, $_stamp=0, $_place='') {
		global $SAVE_RES;

		$this->id= $_id;
		$this->editorId= $_editorId;
		$this->datatype= $_datatype;
		$this->data= $_data;
		$this->version= $_version;
		$this->stamp= $_stamp;
		$this->place= $_place;

		$this->saveRes= $SAVE_RES->INIT;
	} 
}


/*
	Fill .data of given notes array and set their .isBreef=0.
	Notes that are not breef, skipped.
	return: errorcode.
		0= ok
		1= any
		
	args:
		noteInA= notes array
	
*/
function notesUnbreef($_noteInA){
	global $DB, $NOTA_RIGHTS;

	//make list of interest
	$noteInLstA= Array();
	$noteBrA= Array();
 	foreach ($_noteInA as $noteIn)
	 if ($noteIn->isBreef){ //get only breef
		$noteBrA[$noteIn->id]= $noteIn;
		$noteInLstA[]= $noteIn->id;
	 }

	$dataA= dataBDById($noteInLstA,true);

	foreach ($noteBrA as $noteIn) {
		//fill back every breef Note's data[]
		$noteIn->data= Array();
		foreach ($dataA as $dataIn) //search all Data related TO Note
		  if ($dataIn->rootNote==$noteIn->id) {
			$noteIn->data[$dataIn->id]= new NData(
				$dataIn->id,
				$noteIn->isImplicit? 0 : $dataIn->editorId, //impersonate implicit leaf owner
				$dataIn->datatype,
				$dataIn->data,
				$dataIn->version,
				$dataIn->stamp,
				$dataIn->place
			);
		  }
		$noteIn->isBreef= 0;
	}

	//get rights list
	$DB->apply('rightsByNotesIds',$noteInLstA);
	while ($rowRts= $DB->fetch()){
		$noteIn= $noteBrA[$rowRts['id_boards']];
		if ($noteIn->rights!=$NOTA_RIGHTS->OWN)
		  continue;

		  $noteIn->rightGrps[]= $rowRts['id_contactgroups'] . '=' .$rowRts['rights'];
	}

	return 0;
}


function dataBDById($_idWhatA, $_useNotes=false){
	global $DB;

	$rDataA= Array();
	if ($DB->apply($_useNotes?'dataByNotesIds':'dataByIds',$_idWhatA))
	  while ($qD= $DB->fetch()){
		$curD= $rDataA[$qD['id']]= new NData(
			$qD['id'],
			$qD['id_editor'],
			$qD['datatype'],
			$qD['data'],
			$qD['version'],
			$qD['stamp'],
			implode(',', Array($qD['x'], $qD['y'], $qD['w'], $qD['h']))
	    );
	    $curD->rootNote= $qD['id_note'];
	  }

	return $rDataA;
}

?>