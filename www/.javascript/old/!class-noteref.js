/*
Noteref
	is a virtual note for creating references.
	It's created without displaying anything and saves itself immediatelly.
	At noteSave ref is proccessed separately.
	_src in this case is reference Note ID and _b is used as board target when saving.
*/
//todo: delete itself after successful save
var Noteref= function(_b,_x,_y,_w,_h,_src){
	this.isRef= 1;
	this._b= _b;
	this._x= _x;
	this._y= _y;
	this._w= _w;
	this._h= _h;
	this._src= _src;

	this.ver= -1;

//helpers
	this.canSaveNote= function(){
		return 1;
	}
	this.canSaveData= function(){
		return 1;
	}
	this.canSaveComment= function(){
		return 1;
	}

	this.getVer= function(){
		return -1;
	}
	this.getBoard= function(){
		return _b;
	}
	this.getX= function(){
		return _x;
	}
	this.getY= function(){
		return _y;
	}
	this.getW= function(){
		return _w;
	}
	this.getH= function(){
		return _h;
	}
	this.getName= function(){
		return "";
	}
	this.getStyle= function(){
		return "";
	}
	
//todo: move to Board method completely
	if (BOARD.noteChangeTimeout!=undefined) //restart countdown
	  clearTimeout(BOARD.noteChangeTimeout);		
	BOARD.noteChangeTimeout= setTimeout(asyncSaveNote,20);
}
