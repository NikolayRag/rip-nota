//class: Color
/*
construct color from choise of:
	-void
	-other Color
	-rgb array
	-rgb ints
	-grayscale int
	-color hash (#rgb/#rrggbb)
	-color rgb as sting with numbers splitted however
	-color aliases
*/
var Color= function(_v1,_v2,_v3,_v4)//noinspection UnterminatedStatementJS
{
	var _this= this;

	_this.valid= 0;

	_this.r= 0;
	_this.g= 0;
	_this.b= 0;
	_this.a= 0;

	_this.build(_v1,_v2,_v3,_v4);
}

Color.prototype.build= function(_v1,_v2,_v3,_v4){
	var tmp0RGBa= null;

	if (_v1==undefined){} //none
	else if (_v1 instanceof Color) //instance
	  tmp0RGBa= [_v1.r,_v1.g,_v1.b,_v1.a];
	else if ((_v1 instanceof Array) && _v1.length>2) //array
	  tmp0RGBa= [parseInt(_v1[0]),parseInt(_v1[1]),parseInt(_v1[2]),(_v1[3]===undefined?1:parseInt(_v1[3]))];
	else if (parseInt(_v1)==_v1 && parseInt(_v2)==_v2 && parseInt(_v3)==_v3) //three ints
	  tmp0RGBa= [_v1,_v2,_v3,(_v4===undefined?1:parseInt(_v4))];
	else if (parseInt(_v1)==_v1) //grayscale (alpha)
	  tmp0RGBa= [_v1,_v1,_v1,(_v2===undefined?1:parseInt(_v2))];
	else if (_v1.charAt(0)=="#") {//hash
//change to valuable digits collecting
		if (_v1.length==4 || _v1.length==5){ //short form
			var intRgb= [parseInt(_v1[1],16), parseInt(_v1[2],16), parseInt(_v1[3],16), parseInt(_v1[4],16)];
			tmp0RGBa= [intRgb[0]*16+intRgb[0], intRgb[1]*16+intRgb[2], intRgb[2]*16+intRgb[2], _v1.length==5?(intRgb[3]*16+intRgb[3]):1];
		} else if (_v1.length==7 || _v1.length==9) //long form
		  tmp0RGBa= [parseInt(_v1.substring(1,3),16), parseInt(_v1.substring(3,5),16), parseInt(_v1.substring(5,7),16), _v1.length==9?parseInt(_v1.substring(7,9),16):1];
	} else { //text
		switch (_v1){
			case "red":	tmp0RGBa= [255,0,0,1]; break;	
			case "maroon":	tmp0RGBa= [128,0,0,1]; break;
			case "green":	tmp0RGBa= [0,128,0,1]; break;
			case "lime":	tmp0RGBa= [0,255,0,1]; break;
			case "blue":	tmp0RGBa= [0,0,255,1]; break;
			case "navy":	tmp0RGBa= [0,0,128,1]; break;
			case "aqua": case "cyan":
					tmp0RGBa= [0,255,255,1]; break;
			case "teal":	tmp0RGBa= [0,128,128,1]; break;
			case "fuchsia": case"magenta":
					tmp0RGBa= [255,0,255,1]; break;
			case "purple":	tmp0RGBa= [128,0,128,1]; break;
			case "yellow":	tmp0RGBa= [255,255,0,1]; break;
			case "olive":	tmp0RGBa= [128,128,0,1]; break;
			case "black":	tmp0RGBa= [0,0,0,1]; break;
			case "grey": case "gray":
					tmp0RGBa= [128,128,128,1]; break;
			case "silver":	tmp0RGBa= [192,192,192,1]; break;
			case "white":	tmp0RGBa= [255,255,255,1]; break;

			default:
				var rgbVal= _v1.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})(?:\D+(\d{1,3}))?/i); //any way splitted rgb
				if (rgbVal)
				  tmp0RGBa= [parseInt(rgbVal[1]),parseInt(rgbVal[2]),parseInt(rgbVal[3]),parseInt(rgbVal[4])==rgbVal[4]?parseInt(rgbVal[4]):1];
		}
		if (_v1.indexOf('transparent')>=0){
			if (!tmp0RGBa)
			  tmp0RGBa= [0,0,0,0];
			tmp0RGBa[3]= 0;
		}
	}

	if (tmp0RGBa){
		this.r= tmp0RGBa[0];
		this.g= tmp0RGBa[1];
		this.b= tmp0RGBa[2];
		this.a= tmp0RGBa[3];
	}
	this.valid= tmp0RGBa?1:0;
}


Color.prototype.hex= function(_defaultTransStr){
	return this.a? (
		"#"
		+(this.r<16.?"0":"") +Math.floor(this.r).toString(16)
		+(this.g<16.?"0":"") +Math.floor(this.g).toString(16)
		+(this.b<16.?"0":"") +Math.floor(this.b).toString(16)
	) : (_defaultTransStr!=undefined? _defaultTransStr : 'transparent');
}
Color.prototype.rgb= function(){
	return [this.r,this.g,this.b];
}
Color.prototype.gray= function(_int){
	var mean= (this.r +this.g +this.b)/3;
	return (_int|0)?Math.floor(mean):mean;
}
//if this is invalid, return new invalid
Color.prototype.mix= function(_c2,_a){
	if (typeof(_a)!="number")
	  return new Color(this);

	_c2= new Color(_c2);
if (_a!=1){
	_c2.r= _c2.r*_a +this.r*(1-_a);
	_c2.g= _c2.g*_a +this.g*(1-_a);
	_c2.b= _c2.b*_a +this.b*(1-_a);
}	_c2.a= this.a;
	return _c2;
}
