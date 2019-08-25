<?

function arrGet($_arr, $_field, $_default=false){
	if (
		!is_array($_arr)
		|| empty($_arr[$_field])
	)
	  return $_default;
	return $_arr[$_field];
}

function encode64($_val){
 	$_val= base64_encode($_val); 
 	return str_replace(array('+','='), array('-','_'), $_val);
}

function decode64($_val){
 	$_val= str_replace(array('-','_'), array('+','='), $_val); 
 	return base64_decode($_val);
}

class Collect{
	var $collection= array();
	function add($_id,$_itemIn,$_force=false) {
		if ($_force || empty($this->collection[$_id]))
		  $this->collection[$_id]= $_itemIn;
	}
	function get($_id,$_def=false) {
		return arrGet($this->collection, $_id, $_def);
	}
	function count() {
		return count($this->collection);
	}
	function all(){
		return $this->collection;
	}
}

?>