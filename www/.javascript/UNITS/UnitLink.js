/*
	This used as Units junction point at all Unit holders
	with ability to delete Unit itself at once.
*/

var UnitLink= function(_unit){
	var _this= this;

	_this.unitHolder= _unit;
}

UnitLink.prototype.unit= function(_newUnit){
	if (_newUnit)
	  this.unitHolder= _newUnit;

	return this.unitHolder;
}
