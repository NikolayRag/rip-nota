<?

class User {
	var $id, $version= 1, $name, $relation, $groupId= 0, $isBreef, $boardLst= Array(), $contactLst= Array(), $forSave= 0, $saveRes;
	var $stateIn= -1, $stateOut= -1; //tmp
		
	function User($_id= 0, $_name= '', $_isBreef= 1) {
		global $USER_RELATION;
		$this->relation= $USER_RELATION->UNAVAILABLE;

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
		global $USER_RELATION;

		if ($this->stateIn==1 && $this->stateOut==1){ //normal
			$this->relation= $USER_RELATION->NORMAL;
			return;
		}
		if ($this->stateIn==0 && $this->stateOut==-1){ //incoming
			$this->relation= $USER_RELATION->IN;
			return;
		}
		if ($this->stateIn==-1 && $this->stateOut==0){ //outgoing
			$this->relation= $USER_RELATION->OUT;
			return;
		}
		$this->relation= $USER_RELATION->NEUTRAL; //none
	}
}


?>