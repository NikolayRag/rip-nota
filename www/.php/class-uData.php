<?

class User {
	var $id, $version= 1, $name, $relation= -2, $groupId= 0, $isBreef, $boardLst= Array(), $contactLst= Array(), $forSave= 0, $saveRes;
	var $stateIn= -1, $stateOut= -1; //tmp
		
	function User($_id= 0, $_name= '', $_isBreef= 1) {
		$this->id= $_id;
		$this->name= $_name;
		$this->isBreef= $_isBreef;
	} 


/*
	Restore user relations based on stateIn/stateOut supplied.
	Relations restored:
		-2=unavailable:	no changes (not called)
		-1=none| 0=normal| 1=outgoing| 2=incoming

		return: errorcode

*/
	function relations(){
		if ($this->stateIn==1 && $this->stateOut==1){ //normal
			$this->relation= 0;
			return;
		}
		if ($this->stateIn==0 && $this->stateOut==-1){ //incoming
			$this->relation= 2;
			return;
		}
		if ($this->stateIn==-1 && $this->stateOut==0){ //outgoing
			$this->relation= 1;
			return;
		}
		$this->relation= -1; //none
	}
}


?>