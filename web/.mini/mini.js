/** @const */ var NOPROFILE= 0;
/** @const */ var CLIENT_TYPE= {DEFAULT:0,MINI:1,LEGACY:2,DUMB:3,BOT:4,SCANNER:5};
/** @const */ var ARGS_PLACE= {USERID:0,USERNAME:1,REQWHO:2,REQWHAT:3,REQNOTEID:4,REQFILTER:5,EMBED:6};
/** @const */ var SESSION_STATES= {NONE:0,LOGOUT:1,UPDATE:2,VALIDATE:3,REGISTER:4,LOGIN:5,STAY:6,LEAVE:7,PROCCEED_REGISTER:15};
/** @const */ var UPDATE_STATE= {NORMAL:0,STEADY:1,UPDATE:2,ERROR:3,STOP:4};
/** @const */ var USER_RELATION= {UNAVAILABLE:-2,NEUTRAL:-1,NORMAL:0,OUT:1,IN:2};
/** @const */ var CORE_VERSION= {INIT:-1,DEL:0};
/** @const */ var NOTA_RIGHTS= {INIT:-1,RO:0,ADD:1,RW:2,OWN:3,INHERITED:-1};
/** @const */ var SAVE_STATES= {IDLE:0,READY:1,HOLD:2};
/** @const */ var DATA_TYPE= {UNKNOWN:0,TEXT:1,NOTE:2};
/** @const */ var SAVE_RES= {INIT:-1,SECURITY_ERR:-2,SQL_ERR:-3,VERSION_ERR:-4,NOTHIS_ERR:-5,NOREFERENCE_ERR:-6,NOPARENT_ERR:-7};
/** @const */ var ASYGN= {MODE:'mode',MODE_SRV:'HTTP_MODE',NFULL:'N',NBREEF:'n',NDATA:'d',NRIGHTS:'r',USER:'u',YOU:'U',STAMP:'T',D_UNIT:'\\',D_ITEM:';',D_LIST:','};
/** @const */ var ASYNC_MODE= {DEFAULT:'',UPDATE:1,SAVE:2,LOGON:3,LOGVALIDATE:4,UPLOAD_LEGACY:5,UPLOADPROGRESS_LEGACY:6,UPLOAD_BLOB:7,DOWNLOAD:8};
/** @const */ var ASIDX_UPDCB= {SIGN:0,N_OLDID:1,N_ID:2,N_VER:3,N_NAME:4,N_STYLE:5,N_OWNER:6,N_EDITOR:7,N_RIGHTS:8,N_RIGHTGRPA:9,N_INHERIT:10,N_STAMP:11,D_ID:1,D_VER:2,D_ROOT:3,D_DTYPE:4,D_DATA:5,D_EDITOR:6,D_STAMP:7,D_PLACE:8,U_ID:1,U_VER:2,U_NAME:3,U_RELATION:4,U_GROUPID:5,U_BOARDLIST:6,U_CONTACTSLIST:7};
/** @const */ var ASIDX_SAVE= {N_VER:0,N_INHERIT:1,N_NAME:2,N_STYLE:3,R_RIGHTS:0,D_VER:0,D_PARENT:1,D_PLACE:2,D_DTYPE:3,D_DATA:4};
/** @const */ var ASIDX_SAVECB= {SIGN:0,ID:1,RES:2};
/** @const */ var UPSET= {LEGACY_MODESIGN:'legUpMode',LEGACY_FILESIGN:'legUpFiles',BLOB_SIZE:1048576,MAX_RETRIES:2,RESTRICTED:-1};
/** @const */ var MIME= {m0:'application/octet-stream',m1:'image/jpeg'};
/** @const */ var DEFAULT= {};
/** @const */ var USER_REACTION= {POINTER_DEAD_SPOT:10};
/** @const */ var TIMER_LENGTH= {UPDATE_DELAY_ERROR:10000,UPDATE_DELAY_STOP:3000,UPDATE_PULSE:5000,SAVE_DELAY:2000,VALIDATE_DELAY:300,LOGPASS_FIX_DELAY:100,BROWSE_DELAY:1500,TIP_DELAY:500,LOGO_DELAY:500,FLASH_DELAY:300,LOGO2NORMAL_DELAY:200,OVERVIEW_LAZY_DELAY:100,LEAF_CREATION_PERIOD:10,LEAF_FADETRAIL:250,LEAF_FADEOUT:1000,TOOLFADEIN_DELAY:1500,MIN:60,HOUR:3600,DAY:86400,MONTH:2635200,YEAR:31557600};
/** @const */ var AUTHORIZE= {COOKIENAME:'notaCook',COOKIETIME:30};
/** @const */ var PROFILE= {NONE:0,GENERAL:1,BREEF:2,VERBOSE:3,LIMIT:50};
/** @const */ var CSS= {MAIN_BG:'#ddd',MAIN_BORDER:'#ddd',DECORDARK:'#444',FIELD_REQUIRED_HILITE:'#f44',UPDATEMARKER_UPDATE:'#7f0',UPDATEMARKER_ERROR:'#f30',UPDATEMARKER_STOP:'#000',GREENLIGHT:'#0f0',TOOL_TRANSITIONTIME:0.20000000000000001};
/** @const */ var PERF= {IMAGEBG:1,GRADIENTS:2,ANIMATE:4,LEVEL:7};
/** @const */ var STYLE= {MAIN_CC_TINT:'black',MAIN_CC_MIX:0.25,BOARD_MARGIN:150,BOARD_MARGIN_EDITABLE:0.67000000000000004,TIP_PREPOSITION:20,NOTESHADOW_DECAY_EXP:0.29999999999999999,NOTESHADOW_TOP_RATE:10,NOTESHADOW_BOTTOM_RATE:8,NOTESHADOW_LEFT_RATE:15,NOTESHADOW_RIGHT_RATE:7.5,NOTESHADOW_INIT_OFFSET:1,NOTESHADOW_OPACITY_MAX:0.29999999999999999,OVERVIEW_TINT:'white',OVERVIEW_MIX:0.25,OVERVIEW_BASESIZE:150,OVERVIEW_MAXSIZE:500,CURSOR_MOVE:'move'};
/** @const */ var STR= {BOLD:1,ITALIC:2,IDENT:4,QUOTE:8,DIV:16};
/** @const */ var RES_BOARDRIGHTS= {0:'x',1:'R',2:'W',3:'F',4:'!'};
/*
	warp-in methods are:
		-IS definition
		-STYLES definition
		-DIC definition
		-DOM definition
*/

//global substs for minimize
var DOCUMENT= document;
var WINDOW= window;

var ALERT= NOPROFILE?
  function(){}:
  function(v1,v2,v3){
	__PROFILE.pAlert(v1,v2,v3);
  }

//dictionary
var DIC= DOCUMENT['dic'];

var DOM= function(_id,_root){
	var allSib= (_root||DOCUMENT).getElementsByTagName('*');
	for (var i= 0; i<allSib.length; i++)
	  if (allSib.item(i).id==_id)
	  	return allSib.item(i);
}

var NOID= !NOPROFILE?
  function(){}:
  function(_root){
	var allSib= _root.getElementsByTagName('*');
	_root.removeAttribute('id');
	for (var i= 0; i<allSib.length; i++)
	  allSib.item(i).removeAttribute('id');
}

////Compatibility collection definition
var IS= {};
IS.dnd= (
	'undefined'!==typeof File
	&&(
		'undefined'!==typeof File.prototype.slice
		||'undefined'!==typeof File.prototype.webkitSlice
		||'undefined'!==typeof File.prototype.mozSlice
	)
	&&'undefined'!==typeof FileReader
	&&'undefined'!==typeof FileList
	&&'undefined'!==typeof Blob
)? 1:0;
//todo: update url without reload
IS.popurl=
  0;
//todo: mouse or finger
IS.hover=
  1;
IS.scrollW=
  100 -DOM('testEl').clientWidth;

IS.fn= function(_test){
	return 'function' == typeof _test;
}
IS.instance= function(_test,_class){
	return (_test instanceof _class);
}



//cache stylesheets
var STYLES= {};
for (var si=0; si<DOCUMENT.styleSheets.length; si++){
	var mysheet= DOCUMENT.styleSheets[si];
	var myrules= mysheet.cssRules ?mysheet.cssRules: mysheet.rules;
	for (var i=0; i<myrules.length; i++)
	  switch (myrules[i].selectorText){
	  	case '.freezeIn':
	  		STYLES.freezein= myrules[i].style;
	  		break;
	  	case '.freezeOut':
	  		STYLES.freezeout= myrules[i].style;
	  		break;
	  	case '*':
	  		STYLES.ALL= myrules[i].style;
	  		break;
	  }
}

//String additions

if(!Array.prototype.forEach)
  Array.prototype.forEach= function(_fn){
	for (var i in this)
	  _fn(this[i]);
  }

if(!String.prototype.trim)
  String.prototype.trim= function() {
	return this.replace(/^\s+|\s+$/g, '');
  }

var tmpB64= [];
[[65,91],[97,123],[48,58]].forEach(function(range){
	for(var i=range[0]; i<range[1]; i++)
	  tmpB64.push(String.fromCharCode(i));
});
String.BASE64= tmpB64.join('')+'-/_';

String.prototype.utf8_encode= function () {
	var utftext= '';

	for (var n= 0; n<this.length; n++) {
		var c= this.charCodeAt(n);
		if (c<128)
		  utftext+= String.fromCharCode(c);
		else if (c>127 && c<2048) {
			utftext+= String.fromCharCode((c >> 6) | 192);
			utftext+= String.fromCharCode((c & 63) | 128);
		} else {
			utftext+= String.fromCharCode((c >> 12) | 224);
			utftext+= String.fromCharCode(((c >> 6) & 63) | 128);
			utftext+= String.fromCharCode((c & 63) | 128);
		}
	}
	return utftext;
}
String.prototype.base64_encode= function() {   
	var output= '';
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i= 0;

	var input= this.utf8_encode();

	while (i<input.length) {
		chr1= input.charCodeAt(i++);
		chr2= input.charCodeAt(i++);
		chr3= input.charCodeAt(i++);

		enc1= chr1 >> 2;
		enc2= ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3= ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4= chr3 & 63;

		if (isNaN(chr2))
		  enc3 = enc4 = 64;
		else if (isNaN(chr3))
		  enc4 = 64;

		output= output+
		  String.BASE64[enc1]+ String.BASE64[enc2]+
		  String.BASE64[enc3]+ String.BASE64[enc4];
	}
	return output;
} 
String.prototype.utf8_decode= function() {
	var string= '';
	var i= 0;
	var c= 0, c3= c, c2= c;

	while (i<this.length ) {
		c= this.charCodeAt(i);
		if (c<128) {
			string+= String.fromCharCode(c);
			i++;
		} else if(c>191 && c<224) {
			c2= this.charCodeAt(i+1);
			string+= String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i+= 2;
		} else {
			c2= this.charCodeAt(i+1);
			c3= this.charCodeAt(i+2);
			string+= String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i+= 3;
		}
	}
	return string;
}
String.prototype.base64_decode= function() {
	var output= '';
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i= 0;

	while (i<this.length) {
		enc1= String.BASE64.indexOf(this[i++]);
		enc2= String.BASE64.indexOf(this[i++]);
		enc3= String.BASE64.indexOf(this[i++]);
		enc4= String.BASE64.indexOf(this[i++]);
		chr1= (enc1 << 2) | (enc2 >> 4);
		chr2= ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3= ((enc3 & 3) << 6) | enc4;
		output += String.fromCharCode(chr1);

		if (enc3!=64)
		  output += String.fromCharCode(chr2);
		if (enc4!=64)
		  output += String.fromCharCode(chr3);
	}
	return output.utf8_decode();
}

String.prototype.decorateHTML= function(_mode,_size,_color) {
	_mode= _mode ||0;
	_size= _size ||100;

	return (_mode &STR.DIV? '<div' : '<span')
	    +" style=font-size:" +_size+'%;'
	    +(_mode &STR.ITALIC? 'font-style:italic;' :'')
	    +(_mode &STR.BOLD? 'font-weight:bold;' :'')
	    +(_color? 'color:' +new Color(_color).hex() +';' :'')
	  +">"
	  	+(_mode &STR.QUOTE? '&laquo' : '')
	  	+((_mode &STR.QUOTE) || (_mode &STR.IDENT)? '<div style=margin-left:1em;>' :'')
	  		+this
	  	+((_mode &STR.QUOTE) || (_mode &STR.IDENT)? '</div>' :'')
	  	+(_mode &STR.QUOTE? '&raquo' : '')
	  +(_mode &STR.DIV? '</div>' : '</span>');
}

/*
subst '$' signs in string with supplied array values
*/
String.prototype.subst= function(_valuesA,_startI) {
	_startI= _startI ||0;
	var outTxtA= this.split('$');
	
	var cleanValuesA= _valuesA.slice(_startI);
	cleanValuesA.unshift('');
	var _outTxt= '';
	for (var iT in outTxtA)
	  _outTxt+= cleanValuesA[iT] +outTxtA[iT];

	return _outTxt;
}
//flash HTML element
HTMLElement.prototype.flash= function(_hex,_num,_delay){
	_num= _num ||1;
	_delay= _delay ||TIMER_LENGTH.FLASH_DELAY;

	if (!this.style || !IS.instance(this.style,CSSStyleDeclaration))
	  return;
	var _this= this;
	for (var i= 0; i<_num; i++){
		setTimeout(function(){_this.style.color= _hex},_delay*i);
		setTimeout(function(){_this.style.color= ''},_delay*(i+.5));
	}
}
//todo 45 (xxx) +0: so what11
//todo 1 (xxx) +0: oka?
//todo 2 (xxx) +0: yoyo22
//todo 44 (xxx) +0: hohoyo!! 
//todo: use instead of direct assignment
//todo 46 (xxx) +0: qqqqq

HTMLElement.prototype.addEvent= function(_ev,_fn){
	if (this.addEventListener)
	  this.addEventListener(_ev, _fn, false);
	else if (this.attachEvent)
	  this.attachEvent('on'+_ev, _fn);
}

HTMLElement.prototype.elementText= function(_new,_htext){
	var textNode;
	var it;

	if (_new === undefined){
		var outTxt= [];
		for (it in this.childNodes){
			textNode= this.childNodes[it];
			if (IS.instance(textNode,Text))
			  outTxt.push(textNode.nodeValue);
		}
		return outTxt.join('');
	}

 //deal with growing ammount of textNodes afted editmode add text in better way
 	for (it= this.childNodes.length-1; it>=0; it--){
		textNode= this.childNodes[it];
		if (IS.instance(textNode,Text) && it!=0){
			this.removeChild(textNode);
			textNode= undefined;
		}
	}

//todo: make own formatting
	if (_htext)
	  this.innerHTML= _new;
	else {
		if (!IS.instance(textNode,Text))
		  this.appendChild(textNode= DOCUMENT.createTextNode(''));
		textNode.nodeValue= _new;
	}

	return _new;
}

DOCUMENT.bodyEl= DOM('body'); //depricated: DOCUMENT.documentElement || DOCUMENT.body.parentNode || DOCUMENT.body;

//todo: get scrollbarless sizes without helper element
DOCUMENT.scrollVBarWidth= function(){return DOCUMENT.bodyEl.scrollHeight>DOCUMENT.bodyEl.clientHeight? 0: IS.scrollW}
DOCUMENT.scrollHBarHeight= function(){return DOCUMENT.bodyEl.scrollWidth>DOCUMENT.bodyEl.clientWidth? 0: IS.scrollW}

DOCUMENT.clientWidthF= function(_ignoreScroll){return DOCUMENT.bodyEl.clientWidth-(_ignoreScroll? 0: DOCUMENT.scrollVBarWidth())}
DOCUMENT.clientHeightF= function(_ignoreScroll){return DOCUMENT.bodyEl.clientHeight-(_ignoreScroll? 0: DOCUMENT.scrollHBarHeight())}

DOCUMENT.scrollWidthF= function(){return DOCUMENT.bodyEl.scrollWidth-DOCUMENT.scrollVBarWidth()}
DOCUMENT.scrollHeightF= function(){return DOCUMENT.bodyEl.scrollHeight-DOCUMENT.scrollHBarHeight()}

DOCUMENT.scrollLeftF= function(){return WINDOW.pageXOffset}
DOCUMENT.scrollTopF= function(){return WINDOW.pageYOffset}

DOCUMENT.scrollXY= function(_x,_y,_speed){
	WINDOW.scrollTo(_x,_y);
//todo: smooth scroll
/*	if (DOCUMENT.scrollXY.timers)
	  for (ct in DOCUMENT.scrollXY.timers)
	    clearTimeout(DOCUMENT.scrollXY.timers[ct]);
	DOCUMENT.scrollXY.timers= [];

	_speed= _speed || 10000; //default pixel/sec
	var
	  x1= DOCUMENT.scrollLeft(),
	  y1= DOCUMENT.scrollTop(),
	  dist= Math.sqrt( (x1-_x)*(x1-_x)+(y1-_y)*(y1-_y) );

var step=10;
var totalTime= 1000*dist/_speed;

	var ritCnt= 0;
	var rit= [];
	for (var it= 0; it<totalTime; it+=step){
		rit[rit.length]= 1.*it/totalTime;
		DOCUMENT.scrollXY.timers[DOCUMENT.scrollXY.timers.length]= setTimeout(function(){
		  	var p= rit[ritCnt++];
			WINDOW.scrollTo(x1*(1-p)+_x*p,y1*(1-p)+_y*p);
		},it);
	}
*/
}


function eKeyCode(_e){
	_e= _e||WINDOW.event;
	return _e? (_e.keyCode ?_e.keyCode :_e.which) :0;
}
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

	_this.r= 0;
	_this.g= 0;
	_this.b= 0;
	_this.a= 0;

	_this.valid= _this.build(_v1,_v2,_v3,_v4);
}

Color.prototype.build= function(_v1,_v2,_v3,_v4){
	var tmp0RGBa= null;

	if (_v1==undefined){} //none
	else if (IS.instance(_v1,Color)) //instance
	  tmp0RGBa= [_v1.r,_v1.g,_v1.b,_v1.a];
	else if (IS.instance(_v1,Array) && _v1.length>2) //array
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

		return true;
	}
}


Color.prototype.hex= function(_defaultTransStr){
	return this.a? (
		"#"
		+(this.r<16.?"0":"") +Math.floor(this.r).toString(16)
		+(this.g<16.?"0":"") +Math.floor(this.g).toString(16)
		+(this.b<16.?"0":"") +Math.floor(this.b).toString(16)
	) : (_defaultTransStr!=undefined? _defaultTransStr : 'transparent');
}
Color.prototype.rgb= function(_joinBy){
	return _joinBy? [this.r,this.g,this.b].join(_joinBy) : [this.r,this.g,this.b];
}
Color.prototype.rgbi= function(_joinBy){
	return _joinBy? [Math.round(this.r),Math.round(this.g),Math.round(this.b)].join(_joinBy) : [Math.round(this.r),Math.round(this.g),Math.round(this.b)];
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
/*
	style parser
	default css values should be the same as ''-style result
*/
//todo: make proper defaults: same as initial HTML. Do it by declaring default constants
//at current, invalid style results in invalid colors, resulting in .hex()=='' (blank)
var Style= function(_styleStr){
	var _this= this;

	_this.main=
	_this.mainDark=

	_this.noteBG=
	_this.noteBorder=

	_this.borderActive=
	_this.signActive=

	_this.editfieldActive=

	  null;

	_this.bg= {
		imgName:null
	}


	_this.build(new Color(_styleStr));
}
	
//cache
Style.colorMainBG= new Color(CSS.MAIN_BG);

//todo: unify color names
Style.prototype.build= function(_rootColor){
	this.main=
	  _rootColor.valid? new Color(_rootColor) : Style.colorMainBG;
	this.mainDark= this.main.mix(STYLE.MAIN_CC_TINT,STYLE.MAIN_CC_MIX);

//todo: make proper colors
	this.borderActive= new Color(
		(this.main.gray()>127)? 'white':'black'
	);
	this.signActive= new Color(
		(this.main.gray()>127)? 'black':'white'
	);

	this.editfieldActive= new Color('#eed');

	this.bg.imgName= "/.images/bg6.jpg";
}

//todo: finish
Style.prototype.makeString= function(){
	return(
		this.main.rgb()
	);
}

/////helpers

//Executes Fn within Timeout in single context.
/*
	set _fn to be executed after _timeout.
	given a _context, each subsequent call resets timeout,
	 but totally not more than _stopFactor x _timeout from very first call
*/
function lazyRun(_fn,_timeout,_context,_stopFactor){
	_stopFactor= _stopFactor ||5;
	if (_context.timer!=undefined){
		var dt= _context.stopTime -new Date();
		if (_timeout>dt)
		  _timeout= dt>0 ?dt:0;

		clearTimeout(_context.timer);
	} else 
	  _context.stopTime= new Date(new Date()-(-_stopFactor*_timeout));

	_context.timer= setTimeout(function(){_fn();_context.timer= undefined},_timeout);
}


function noBubbles(_e){
	_e= _e||WINDOW.event;
	if (_e.stopPropagation)
	 _e.stopPropagation();
	else
	  _e.cancelBubble = 1;
}


//section: library
function formatMeasures(_in,_base,_precision,_suffix){
	var inProc= _in;
	if (inProc<_base)
	  return inProc +_suffix;

	inProc /= _base;
	if (inProc<_base)
	  return formatPrecision(inProc,_precision) +'K' +_suffix;

	inProc /= _base;
	if (inProc<_base)
	  return formatPrecision(inProc,_precision) +'M' +_suffix;

	inProc /= _base;
	if (inProc<_base)
	  return formatPrecision(inProc,_precision) +'G' +_suffix;

	inProc /= _base;
	  return formatPrecision(inProc,_precision) +'T' +_suffix;
}
function formatPrecision(_in,_precision){
	return ((_in/_precision) |0)/(1/_precision); //(1/) avoids FP rounding error
}

/*
Return first match of input value within supplied comma-separated regexp list.
*/
function switchReg(_ctx,_rulzA,_templateA){
	for (var iR= 0; iR<_rulzA.length; iR++)
	  if (new RegExp(_rulzA[iR]).test(_ctx))
	    break;

	return _templateA[iR].replace('$', _ctx);
}


//section: time
/*
  return {stamp,delay}, where:
	stamp is stamp text
	delay is number of seconds till stamp is neccessary to update
*/

function stampDiff(_stamp,_limitSeconds,_minDelay){
	_minDelay= _minDelay ||5;
	var cts= new Date();
	var ddif=parseInt(cts -_stamp)/1000. |0;

	if (_limitSeconds && ddif>_limitSeconds) return{stamp:'',delay:0};
	if (ddif<TIMER_LENGTH.MIN) return{stamp:
		switchReg(Math.floor(ddif), DIC.timeAgoSecsRulz.split(','), DIC.timeAgoSecs.split(','))
		,delay: (TIMER_LENGTH.MIN-ddif)<_minDelay? TIMER_LENGTH.MIN-ddif:_minDelay
	};
	if (ddif<TIMER_LENGTH.HOUR) return{stamp:
		switchReg(Math.floor(ddif/TIMER_LENGTH.MIN), DIC.timeAgoMinsRulz.split(','), DIC.timeAgoMins.split(','))
		,delay: TIMER_LENGTH.MIN-ddif%TIMER_LENGTH.MIN
	};
	if (ddif<TIMER_LENGTH.DAY) return{stamp:
		switchReg(Math.floor(ddif/TIMER_LENGTH.HOUR), DIC.timeAgoHoursRulz.split(','), DIC.timeAgoHours.split(','))
		,delay: TIMER_LENGTH.HOUR-ddif%TIMER_LENGTH.HOUR
	};
	var ddifD= ddif/TIMER_LENGTH.DAY;
	if (ddifD<8) return{stamp:
		switchReg(Math.floor(ddifD), DIC.timeAgoDaysRulz.split(','), DIC.timeAgoDays.split(','))
		,delay: TIMER_LENGTH.DAY-ddif%TIMER_LENGTH.DAY
	};
	return{stamp:
		_stamp.getDate() +' '
		+[DIC.timeJan,DIC.timeFeb,DIC.timeMar,DIC.timeApr,DIC.timeMay,DIC.timeJun,DIC.timeJul,DIC.timeAug,DIC.timeSep,DIC.timeOct,DIC.timeNov,DIC.timeDec][_stamp.getMonth()]
		+(_stamp.getFullYear()==cts.getFullYear() ?'' :' '+_stamp.getFullYear())
		,delay: 0
	};
}

/*
Nota have following entity types, updated accordingly:
	1.	Board,
		Owner contact (breef, relation, boardlist),
		Notes, data:
			main cycle (adjustable 1-10s?)
	2.	//todo:make more clear this point
		User contact (breef, boardlist),
		Contactlist (contacts, breef, relations):
			logon/start,
			contactlist request,
			lazy cycle (1min?)
	todo:	Notes contacts breef:
			after updating board, only absent,
			lazy cycle

	
Main logics are:
	Core(main cycle)
	Logon
	Contacts
	BoardNav
	Notes

Support logics:
	+Popup
	+Log cookie
	Palette
	Timestamps
	Notifiers
	Uploads
	Pin
	Offline

---
Core logic.
 - Page is painted respecting userlogon related states
 - Globals are filled with <request> from URL/DB:
	- SESSION
	- BOARD
	- UI
 - Main cycle started:
	- Board requested
	- Update Notes
	- Update UI
*/




var SESSION= new function(){


////ASYNC
this.asyncStatusString= function(_code){
	var verbMsg= '';
	switch (_code){
		case 0: verbMsg= DIC.popStateVAsync0; break;
		case 500: verbMsg= DIC.popStateVAsync500; break;
	}
	return DIC.popStateVAsyncHead
	  +_code
	  +(verbMsg!=''? ' ('+ verbMsg +')' :'');
}

this.asyncInit= function(){
	this.httpRequest= null;

	if (WINDOW.XMLHttpRequest) { // Mozilla, Safari, ...
		this.httpRequest= new XMLHttpRequest();
		if (this.httpRequest.overrideMimeType)
		  this.httpRequest.overrideMimeType('text/plain');
	} else if (WINDOW.ActiveXObject) { // IE
		try {this.httpRequest= new ActiveXObject("Msxml2.XMLHTTP");}
		catch (e) {
			try {this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");}
			catch (e){return}
		}
	}

	return true;
}
/*
_saveMode:	request identifier; see ASYNC_MODE
_saveData:	Array of POST data passed; SHOULD REMAIN ARRAY TYPE DUE TO MINIFYING
_cbOk:		normal callback
_cbErr:		error callback
_sync:		1 for blocked call
_binary:	send as binary
_headersA:	additional headers
*/
this.async= function(_saveMode, _saveData, _cbOk, _cbError, _sync, _binary, _headersA) {
	if (this.inAsync){
		this.asyncQueue.push(arguments);
		return;
	}
	if (!this.httpRequest && !this.asyncInit())
	  UI.popW.up(DIC.errrAsyncNA);

	this.inAsync= true;

	this.httpRequest.onreadystatechange = function(_e) {
		if (_e.target.readyState != 4)
		  return;

		if (_e.target.status == 200)
		  _cbOk(_e.target.responseText);
		else if (_cbError)
		  _cbError(_e.target.status, this.asyncStatusString(_e.target.status), _e.target.responseText);

		this.inAsync= false;

		if (this.asyncQueue.length)
		  this.async.apply(this,this.asyncQueue.shift());
	}.bind(this);

	this.httpRequest.open('POST', '/', !_sync)
	this.httpRequest.setRequestHeader('Content-type', _binary? 'application/x-binary; charset=x-user-defined' : 'application/x-www-form-urlencoded');
	this.httpRequest.setRequestHeader(ASYGN.MODE, _saveMode);
	for (var iH in _headersA)
	  this.httpRequest.setRequestHeader(_headersA[iH][0], _headersA[iH][1]);

	if (_binary)
	  this.httpRequest.sendAsBinary(_saveData);
	else{
		var saveData= [];
		for (var dName in _saveData)
		  saveData.push([dName,_saveData[dName]].join('='));

		this.httpRequest.send(saveData.join('&'));
	}

	return this.httpRequest;
}




////COOKIE

this.cookieSet= function(_inStr,_inName,_inTime){
	var time= _inTime ||AUTHORIZE.COOKIETIME;

	var cookStr= _inName+ '=';
	if (_inStr){
		cookStr+= encodeURI(_inStr);
		if (time){
			var exdate=new Date();
			exdate.setDate(exdate.getDate()+time);
			cookStr+= '; expires='+exdate.toUTCString();
		}
	}
	cookStr+= ';path=/'
	DOCUMENT.cookie= cookStr;
}

this.cookieGet= function(_inName) {
	var cA= DOCUMENT.cookie.split(';');
	for (var i=0;i < cA.length;i++) {
		var c = cA[i].trim();
		if (c.indexOf(_inName+'=') == 0)
		  return c.substr(_inName.length+1);
	}
	return '';
}

this.reload= IS.popurl?
  function(_user,_board){
	this.update.coreCycle(false);
//todo: and go on
  }
  : function(_user,_board){
	var newLoc= '/' +(
		!_user? ''
		: (_user +(
			!_board? ''
			: ('/' +_board)
		))
	);
	DOCUMENT.location= newLoc;
  }


this.onWindowHashChanged= function(){
    pAlert(WINDOW.location.hash);
}

this.onWindowUnload= function(_e){
	_e= _e||WINDOW.event;

	SESSION.board.uiA[0].nFrontUI.saveBrowse();

//todo: catch update http err
	this.update.coreCycle(false);

	var lastSave= SESSION.save.saveGo(true);
	if (lastSave.status!=200){
//dic:
 		_e.returnValue= "Changes are NOT saved!";
		return _e.returnValue;
	}

	__PROFILE.close();
}

this.bindEvt= function(){
	WINDOW.onhashchange= this.onWindowHashChanged.bind(this);
	WINDOW.onbeforeunload= this.onWindowUnload.bind(this);
}


this.owner= function(_newid, _name){
	if (_newid===undefined)
	  return this.ownerId===null? undefined: Ucore(this.ownerId);

	var newUser= new Ucore(_newid)
	this.ownerId= newUser.id;
	newUser.set({uname:_name});
}

this.reqWho= '';
this.reqWhat= '';
this.reqFilter= '';
this.dbStamp= 0;

this.inAsync= false;
this.asyncQueue= [];
this.httpRequest= null;
//todo: make use of .updated in contacts and UI.update
//todo: ref; use objects, make .changed(obj) reactor
this.ownerId= null;
//todo: split to .boardObj and board(), as with .user
//todo: ref; use objects, make .changed(obj) reactor
this.board= null; //UI painting and interaction.

this.bindEvt();

}





if (IS.DnD){
	if (!XMLHttpRequest.prototype.sendAsBinary)
	  XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
		function byteValue(x) {
			return x.charCodeAt(0) & 0xff;
		}
		var ords = Array.prototype.map.call(datastr, byteValue);
		var ui8a = new Uint8Array(ords);
		this.send(ui8a.buffer);
	 }

	if (!File.prototype.slice){
		if (File.prototype.webkitSlice)
		  File.prototype.slice= File.prototype.webkitSlice;
		else if (File.prototype.mozSlice)
		  File.prototype.slice= File.prototype.mozSlice;
	}
}
/*
	Holds login, logout, register, validation

*/
SESSION.logon= new function(){


this.login= function(_mode,_username,_password) {
	var saveData= [];
	saveData['logMode']= _mode || SESSION_STATES.NONE;
	var asyncMode= ASYNC_MODE.LOGON;
	switch (_mode) {
		case SESSION_STATES.LEAVE:
			SESSION.cookieSet(null,AUTHORIZE.COOKIENAME);
			return;
		case SESSION_STATES.REGISTER:
		case SESSION_STATES.LOGIN:
			saveData['password']= _password;
		case SESSION_STATES.VALIDATE:
			if (!_username){
				this.loginCB(''+_mode+';');
				return;
			}
			saveData['username']= _username;
			if (_mode==SESSION_STATES.VALIDATE){
				asyncMode= ASYNC_MODE.LOGVALIDATE;
				break;
			}
		case SESSION_STATES.LOGOUT:
			SESSION.update.coreCycle(false);
	}
	SESSION.async(asyncMode, saveData, this.loginCB, function(_code, _err,_txt){
ALERT(PROFILE.GENERAL, 'Login error: ' +saveData, _err +': ' +_txt);
//todo: expand
		console.log('Login error: ' +_err +': ' +_txt);
		UI.popW.up('Login server unavailable');
	}.bind(this));
};



//------Callback

//logCookie logic:
//	- login without cookie request from server
//	- request session cookie only by toggling STAY switch while logged
//	- logout deletes cookie anyway
//todo: long term: make unreloadable login/register/logout
this.loginCB= function(_res){
	var resA= _res.split(ASYGN.D_ITEM);
	var responce= resA[1];
	var fReg= 0;
	switch (resA[0] |0) {
		case SESSION_STATES.VALIDATE:
			UI.loginW.DOM.submit.value= (responce==1) ?DIC.labLogIn :DIC.labLogRegister;
			return;
		case SESSION_STATES.STAY:
			UI.youW.DOM.stayLab.flash(CSS.GREENLIGHT);
			SESSION.cookieSet(responce,AUTHORIZE.COOKIENAME);
			return;
		case SESSION_STATES.LOGOUT:
			SESSION.cookieSet(null,AUTHORIZE.COOKIENAME);
			SESSION.reload();
			return;
		case SESSION_STATES.REGISTER:
			fReg= 1;
		case SESSION_STATES.LOGIN:
			if (responce==SESSION_STATES.PROCCEED_REGISTER){
				UI.loginW.registerCheck();
				return;
			}
			if (!responce || responce==''){ //no errors, logged in/out
				if (fReg)
				  SESSION.reload();
				else
				  SESSION.reload(SESSION.reqWho, SESSION.reqWhat);
			} else {
				var logErrsA= [
					DIC.logErrRegister,
					DIC.logErrChange,
					DIC.logErrActivate,
					DIC.logErrRestore,
					DIC.logErrRepass,
					DIC.logErrCookie,
					DIC.logErrProvided,
					DIC.logErrActivated,
					DIC.logErrDeactivated,
					DIC.logErrBadpass,
					DIC.logErrHash,
					DIC.logErrConfirm,
					DIC.logErrSave,
					DIC.logErrReset,
					DIC.logErrUnregistered
				];
				UI.popW.up((parseInt(responce)>0)?logErrsA[responce-1]:responce);
			}
	}
}.bind(this);


}
//todo: GC for Ucore/Ncore
/*
	Global update class.

	Holds all server updates:
		-requested note with data
		-contained notes with data
		-current user with contact references and boardlist
		-requested user with boardlist
		-all referenced boards from boardlists as breef (no data)
		-all referenced contacts - from user contacts and from all notes and data
*/
SESSION.update= new function(){


//State change
/*
	 - UPDATE: periodically set from coreCycle(),
	 - ERROR: server responce is delayed ar server returns error.
	 	Non-critical, just trying to call over without returning to NORMAL.
	 - STEADY: start of client-side update routine
	 - STOP client-side update routine is delayed. Update is stopped at all.
	 - NORMAL is successfull end of update cycle, 
*/
this.setState= function(_newState, _msgVerb){
	switch (_newState) {
		case UPDATE_STATE.UPDATE:
			//async sent, UPDATE_STATE_ERROR is charged
			if (this.updateState == UPDATE_STATE.UPDATE || this.updateState == UPDATE_STATE.STOP)
			  return;

			clearTimeout(this.timeOut);
			var _this= this;
			  this.timeOut= setTimeout( function(){
			  	_this.setState(UPDATE_STATE.ERROR,DIC.popStateVDelayed);
			  }, TIMER_LENGTH.UPDATE_DELAY_ERROR); 

			this.update();
			if (this.updateState != UPDATE_STATE.NORMAL) //no visual updates 
			  return;
			break;
		case UPDATE_STATE.ERROR:
			clearTimeout(this.timeOut);

			//Server error, non-critical: async was not returned in timeout (or explicitely set by returning error, see updateCBErr())
			this.HTTPReq && this.HTTPReq.abort();
			break;

		case UPDATE_STATE.STEADY:
			//UPDATE_STATE_STOP is silently charged
			clearTimeout(this.timeOut);
			var _this= this;
			  this.timeOut= setTimeout( function(){
			  	_this.setState(UPDATE_STATE.STOP,DIC.popStateVDelayed);
			  }, TIMER_LENGTH.UPDATE_DELAY_STOP);
			return;
		case UPDATE_STATE.STOP:
			//board update callback was hang, CRITICAL
			this.coreCycle(false);
			UI.popW.up(DIC.popStateStopALERT);
			break;
		case UPDATE_STATE.NORMAL:
			//callback finished normally
			clearTimeout(this.timeOut);
	}
	this.updateState= _newState;
	if (this.active)
	  UI.drawState(_newState, _msgVerb);
}


//	Update notes from server.
/*
	Called periodically from setState()
*/
//todo change update to hash+data 2-step call.
this.update= function() {
__PROFILE.profileTime(); //profile
ALERT();

	var _board= SESSION.board;

	var saveData= [];
	saveData['last']= SESSION.dbStamp;
	saveData['rId']= _board.PUB.id; //lock onto original id
	if (_board.PUB.id<0){ //freeform request, prioritized
		saveData['rWho']= SESSION.reqWho;
		saveData['rWhat']= SESSION.reqWhat;
		saveData['rFilter']= SESSION.reqFilter;
	}

//checklist: used only for deletion
//todo: depricate block
	this.completeRequest= true; //depricate too
	var checkNotes= [];
	var allNotes= Ncore.all();
	for (var iN in allNotes)
	  if (allNotes[iN].PUB.forSave == SAVE_STATES.IDLE)
	    checkNotes.push(iN);
	  else
	  	this.completeRequest= false;
	saveData['chkN']= checkNotes.join(ASYGN.D_LIST);

	var checkData= [];
	var allData= Ndata.all();
	for (var iD in allData)
	  if (allData[iD].forSave == SAVE_STATES.IDLE)
	    checkData.push(iD);
	  else
	  	this.completeRequest= false;
	saveData['chkD']= checkData.join(ASYGN.D_LIST);

	var checkUsers= [];
	var allUsers= Ucore.all;
	for (var iU in allUsers)
	  if (allUsers[iU].forSave == SAVE_STATES.IDLE)
	    checkUsers.push(iU);
	  else
	  	this.completeRequest= false;
	saveData['chkU']= checkUsers.join(ASYGN.D_LIST);


ALERT(PROFILE.VERBOSE, 'Request', saveData);
	this.HTTPReq= SESSION.async(ASYNC_MODE.UPDATE, saveData, this.updateCB, this.updateCBErr);
}

this.updateCBErr= function(_code, _err,_txt){
//todo: catch update http err

	var resTxt= (_err+(_txt!=''? ': ' :'')).decorateHTML(STR.DIV |STR.BOLD)+ _txt;
	this.setState(UPDATE_STATE.ERROR,resTxt);
}.bind(this)



/*
	infinite update calls, starting instantly
*/
//todo: make flexible pulse, based on update complexity and response time/timeout
this.coreCycle= function(_state){
	if (!(this.active= (this.active && _state))){
		this.HTTPReq && this.HTTPReq.abort();
		return;
	}

	var _this= this;
	  setTimeout(function(){
	  	_this.coreCycle(_this.active)
	  }, this.pulse);

	this.setState(UPDATE_STATE.UPDATE);
} 


//UPDATE CALLBACKS
/*
	incremental update of everything
	->remember, index and booleans are string!<-

	Everything is fetched as plain list of Notes, Data and Users each by one ";"-separated string.

	Assignment of Notes and Users to any particular list is holded by prefix and elsewhere.
	All used Notes and Users are listed once, with full-form in priority.
	
	Notes:
		1a. full/requested Note
			Prefix "R"
			goes first
		1b. full/all children
			Prefix "N"
			goes subsequentally after "R"
		1c. inherit Notes list
			temp formed. Notes that are parents to 1a and 1b Notes (i.e. their home Board)
		3a. breef/Your boardlist
			the List itself is located at "You" User
		3b. breef/User boardlist
			the List itself is located at "User" User
	Users:
		2a. You
			Prefix "Y" or "YU"
			Current user. If Anon, then id=0
		2b. User
			Prefix "U" or "YU"
			requested Note's owner. If Note is NativeImp then User is Anon (id=0)
		4a. Your contactlist
			List itself is located at "You" User
		4b. all Notes owners
			temp formed.
			
	Due to lot of possible cross-references, it's unable (?) to delete existing Notes/Users
	on fly as data is read. In that cause deletion is done as bulk afted everything is read.
	
	Macro:
		Read everything
			update Note/User
			create Note/User
			form Requested list
			form Inherit list
			form Owners list
		Delete existing Notes/Users based on difference with read data

	Data recieved is:
		-N:	full Note: requested or leaf, data (d) follows
		-n:	breef Note, basically for user board list and ancestors. No data applied.
		-d:	NData for non-breef Notes. NData supplied is sent serially next to Note
		-U:	active User. Holds boardlist and contacts list. Corresponds to SESSION.owner()
		-u:	breef Users, basically active user's contacts and all Note's and NData owners
		-t:	debug, time profile
*/

//...continued

this.updateCB= function(_bData){
	//start waiting for fuckup. removed at end of routine.
	this.setState(UPDATE_STATE.STEADY); //hanging update routine will set STOP mode
	var splitData= _bData.split(ASYGN.D_UNIT);

	var profTime= __PROFILE.profileTime();
	var profSize= formatMeasures(_bData.length,1024,.1,'b');
	var profTimeA= splitData[splitData.length>1?splitData.length-2:0].split(ASYGN.D_ITEM);
	var profTimeMsg= profTimeA[0]=='t'?
	  DIC.popStateProfTime.subst([profTimeA[2]*1000, profTime-profTimeA[2]*1000])
	  : '';

var ALERTFLAG= 1;
if (ALERTFLAG) {	//profile request +CBtime +responce
	ALERT(PROFILE.VERBOSE, 'Reloaded in', profTime/1000 +'s' +(profTimeMsg!=''? '(' +profTimeMsg +')' :''));
	ALERT(PROFILE.VERBOSE, 'FPS', UI.fps);
	ALERT(PROFILE.VERBOSE, DIC._got.subst([profSize]) +': ', splitData.join("\n"));
//	ALERTFLAG= 0; //do once
}

	var newDbStamp= 0; //if server dont return stamp, then ALL be updated next time
	var updSuccess= true;

	//Update all changes prior to any redraw
	for (var splitI in splitData){
		var splitDStr= splitData[splitI].split(ASYGN.D_ITEM);
		var sign= splitDStr[ASIDX_UPDCB.SIGN];

		//class proccessing
		switch (sign) {
			case ASYGN.STAMP:
				newDbStamp= splitDStr[1];
				break;
			case ASYGN.NFULL: case ASYGN.NBREEF:
			 	updSuccess= this.respondN(
					sign,
				 	splitDStr[ASIDX_UPDCB.N_OLDID] |0,
					splitDStr[ASIDX_UPDCB.N_ID] |0,
					splitDStr[ASIDX_UPDCB.N_VER] |0,
					splitDStr[ASIDX_UPDCB.N_NAME],
					splitDStr[ASIDX_UPDCB.N_STYLE],
					splitDStr[ASIDX_UPDCB.N_OWNER] |0,
					splitDStr[ASIDX_UPDCB.N_EDITOR] |0,
					splitDStr[ASIDX_UPDCB.N_RIGHTS] |0,
					splitDStr[ASIDX_UPDCB.N_RIGHTGRPA],
					splitDStr[ASIDX_UPDCB.N_INHERIT] |0,
					splitDStr[ASIDX_UPDCB.N_STAMP] |0
				) &&updSuccess;
				break;
			case ASYGN.NDATA:
				updSuccess= this.respondD(
					splitDStr[ASIDX_UPDCB.D_ID] |0,
					splitDStr[ASIDX_UPDCB.D_VER] |0,
					splitDStr[ASIDX_UPDCB.D_ROOT] |0,
					splitDStr[ASIDX_UPDCB.D_DTYPE] |0,
					splitDStr[ASIDX_UPDCB.D_DATA],
					splitDStr[ASIDX_UPDCB.D_EDITOR] |0,
					splitDStr[ASIDX_UPDCB.D_STAMP] |0,
					splitDStr[ASIDX_UPDCB.D_PLACE]
				) &&updSuccess;
				break;
			case ASYGN.USER: case ASYGN.YOU:
				updSuccess= this.respondU(
					sign,
					splitDStr[ASIDX_UPDCB.U_ID] |0,
					splitDStr[ASIDX_UPDCB.U_VER] |0,
					splitDStr[ASIDX_UPDCB.U_NAME],
					splitDStr[ASIDX_UPDCB.U_RELATION] |0,
					splitDStr[ASIDX_UPDCB.U_GROUPID] |0,
					splitDStr[ASIDX_UPDCB.U_BOARDLIST],
					splitDStr[ASIDX_UPDCB.U_CONTACTSLIST]
				) &&updSuccess;
				break;
		}
	}	
	if (updSuccess && this.completeRequest) //else should retry update
	  SESSION.dbStamp= newDbStamp;

//todo: make condition to call; see UI.drawWindow definition
	UI.drawWindow();
	UI.youW.draw();

	if (SESSION.board.owner().forRedraw)
	  UI.ownerW.draw(SESSION.board);
	if (SESSION.board.owner().forRedrawBoards)
	  UI.ownerW.boardlistW.draw(SESSION.board);
	UI.ownerW.drawBRight(SESSION.board.PUB.rights);

//todo: mantain cached Ncore/Ndata .redrawList[]
	clearTimeout(this.drawTimeout);
	this.drawTimeout= setTimeout(function(){
		SESSION.board.draw(true);
//todo: move elsewhere
		for (var nU in Ucore.all){ //reset redraw flag for Users
			var curUcore= Ucore.all[nU];
			curUcore.forRedraw= 0;
			curUcore.forRedrawBoards= 0;
			curUcore.forRedrawContacts= 0;
		}

		var nn=0;
		var nd=0;
		var nnu=0;
		var ndu=0;
		for (var i in Ncore.allNotes) {
			var n=Ncore.allNotes[i];
			nn++;
			for (var ii in n.PUB.ndata) nd++;
			for (var iii in n.uiA){
				nnu++;
				for (var iiii in n.uiA[iii].dUI) ndu++;
			}
		}
		console.log('notes: ' +nn);
		console.log('data: ' +nd);
		console.log('NUI: ' +nnu);
		console.log('DUI: ' +ndu);
	},0);


	//no errors, fuckup is canceled and error state is reset
	var profBreef= DIC._in.subst([
		profSize, profTime/1000,
			DIC._proccessed.subst([profTimeMsg, __PROFILE.profileTime()]).decorateHTML(STR.IDENT),
		UI.fps
	]);
	this.setState(UPDATE_STATE.NORMAL,profBreef);
}.bind(this);


/*
checklist:

- update implicits on/off (foreign note with/no rights)
- update unit which id changed before callback (note created, [update], saved, [updateCB])

*/

this.respondN= function(_sign, _oldId, _id, _ver, _name, _style, _owner, _editor, _rights, _rightA, _inherit, _stamp){
//todo: MAKE normal deletion
	if (!_ver){

		//return delete success
		return true;
	}

	var unit= {
		ver: _ver,
		name: _name,
		style: _style,
		owner: _owner,
		editor: _editor,
		rights: _rights,
		rightA: _rightA.split(ASYGN.D_LIST),
		inherit: _inherit,
		stamp: new Date(new Date() -_stamp*1000)
	};

	var ctxNote= new Ncore(_oldId || _id); //use existing or CREATE appropriate

//todo: deal with error
	ctxNote.setId(_id); //resolve ID for found named request

	//set grabbed; _name,_ver,_style,_rights,_rightA,_inherit,_stamp,_owner; _in.ver=0 for deletion
//todo: Unit .set() should return VARIOUR errorcodes
	return ctxNote.set(unit);
}


this.respondD= function(_id, _ver, _root, _dtype, _content, _editor, _stamp, _place){
//todo: MAKE normal deletion
	if (!_ver){ //delete
		var curData= Ndata.all(_id);
		if (!curData) //deleted already
		  return true;
		return curData.kill()? true:false;
	}

	var unit= {
		ver: _ver,
		root: _root,
		dtype: _dtype,
		content: _content,
		editor: _editor,
		stamp: new Date(new Date() -_stamp*1000),
		place: _place.split(ASYGN.D_LIST)
	};

	var ctxNote= Ncore.all(unit.root);
	if (!ctxNote)
	  return false;

	if (unit.dtype==DATA_TYPE.TEXT)
	  unit.content= unit.content.base64_decode();

	return ctxNote.dataSet(_id, unit)? true:false;
}


this.respondU= function(_sign, _id, _ver, _uname, _relation, _groupId, _boardList, _contactsList){
//todo: MAKE normal deletion
	if (!_ver){

		//return delete success
		return true;
	}

	var unit= {
		ver: _ver,
		uname: _uname,
		relation: _relation,
		groupId: _groupId,
		boardList: _boardList.split(ASYGN.D_LIST),
		contactsList: _contactsList.split(ASYGN.D_LIST)
	}



	if (_sign == ASYGN.YOU && _id != SESSION.owner().id){ //YOU changed, relogon
//todo: proper user relogon reaction
		alert(DIC.errrUserOutdated);
		SESSION.reload(SESSION.reqWho, SESSION.reqWhat);
	}

	var curUser= new Ucore(_id);

	return curUser.set(unit);
}

this.pulse= TIMER_LENGTH.UPDATE_PULSE;
this.active= true;
this.HTTPReq= null;

this.updateState= UPDATE_STATE.NORMAL;
this.timeOut= null;

this.drawTimeout= null;
}
/*
	Global save class.

	Holds all saves to server:
		-notes and rights
		-data
//todo: -users
		-requested user with boardlist
		-all referenced boards from boardlists as breef (no data)
		-all referenced contacts - from user contacts and from all notes and data
*/
SESSION.save= new function(){

this.save= function(){
	lazyRun(
		this.saveGo.bind(this)
		, TIMER_LENGTH.SAVE_DELAY
		, this.lazyCtx
	);

	SESSION.board.uiA[0].nFrontUI.draw();

ALERT(PROFILE.BREEF, 'SAVE attempt', '');
}

this.saveGo= function(_sync){
	var saveData= [];

	for(var iN in Ncore.all()){
		var curNote= Ncore.all(iN);
		var nId= iN; //test: and remove //curNote.PUB.id;

		if (curNote.canSave(true)==SAVE_STATES.READY){
			var noteBlock= [];
			noteBlock[ASIDX_SAVE.N_VER]= curNote.PUB.ver;
			noteBlock[ASIDX_SAVE.N_INHERIT]= curNote.inherit()? curNote.inherit().PUB.id :0;
			noteBlock[ASIDX_SAVE.N_NAME]= curNote.PUB.name;
			noteBlock[ASIDX_SAVE.N_STYLE]= encodeURIComponent(curNote.PUB.style.makeString());

			saveData[ASYGN.NBREEF+nId]= noteBlock.join(ASYGN.D_ITEM);
		}

//		var canSaveRts= curNote.canSaveRts(true);
//		if (canSaveRts==SAVE_STATES.IDLE){
//			var rightsBlock= [];
//			rightsBlock[ASIDX_SAVE.R_RIGHTS]= curNote.PUB.rightsA.join(ASYGN.D_LIST);
//
//			saveData[ASYGN.NRIGHTS+nId]= rightsBlock.join(ASYGN.D_ITEM);
//		}

		var allData= curNote.dataForSave(true);
		for (var iD in allData){
			var curData= allData[iD];

			var dataBlock= [];
			if (curData.forDelete){
				dataBlock[ASIDX_SAVE.D_VER]= 0;
			} else {
				dataBlock[ASIDX_SAVE.D_VER]= curData.ver;
				if (curData.id<0) dataBlock[ASIDX_SAVE.D_PARENT]= nId;
				dataBlock[ASIDX_SAVE.D_PLACE]= [curData.place.x,curData.place.y,curData.place.w,curData.place.h].join(ASYGN.D_LIST);
				dataBlock[ASIDX_SAVE.D_DTYPE]= curData.dtype;
				dataBlock[ASIDX_SAVE.D_DATA]= curData.dtype==DATA_TYPE.TEXT? curData.content.base64_encode() : curData.content;
			}
			
			saveData[ASYGN.NDATA+curData.id]= dataBlock.join(ASYGN.D_ITEM);
		}
	}

ALERT(PROFILE.GENERAL, 'SAVE', saveData);

	return SESSION.async(ASYNC_MODE.SAVE, saveData, this.saveCB, this.saveCBErr, _sync);
} 

this.saveCB= function(_sData){
ALERT(PROFILE.BREEF, 'SAVE RES', _sData);

//todo: reset timestamp HERE
//todo: handle errors
	var sDataA= _sData.split(ASYGN.D_ITEM);

	var resNotesA= [];
	var resDataA= [];
	for (var iN in sDataA){ //Notes should be reacted first to have available possible later Ndata redraw
		var res= sDataA[iN].split(ASYGN.D_LIST);
		var resId= res[ASIDX_SAVECB.ID];
		var resRes= res[ASIDX_SAVECB.RES];
		switch (res[ASIDX_SAVECB.SIGN]){
			case ASYGN.NBREEF:
				var cNote= resNotesA[resId]= Ncore.all(resId);
				if (cNote && resRes>=0)
				  cNote.saved(resRes)
				else
				  console.log('Error saving Note ' +resId +': ' +(cNote? resRes :'undefined'));

				break;
			case ASYGN.NRIGHTS:
				break;
			case ASYGN.NDATA: //cache
				resDataA[resId]= resRes |0;
				break;
		}
	}

	for (var iD in resDataA){ //phase two, Data
		var cData= Ndata.all(iD);
		if (cData && resDataA[iD]>=0)
		  cData.saved(resDataA[iD], resNotesA);
		else
		  console.log('Error saving Data ' +iD +': ' +(cData? resDataA[iD] :'undefined'));
	}

	SESSION.board.draw(true);

//todo: deal with accidentally unsaved
}.bind(this);

this.saveCBErr= function(_code, _err,_txt){
alert(_err +': ' +_txt);
ALERT(PROFILE.GENERAL,'Save error',_err +': ' +_txt);
	this.save();
}.bind(this);


this.lazyCtx= {};

}
//! NOT USED YET !


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
/*
	User object.
	_id must be provided anyway.
	Ucore object is added to Ucore.all[_id] without overwrite.
	If duplicated, existing Ucore is updated and returned.
*/

var Ucore= function(_id){
	var _this= this;

//todo: decide what to return instead of undefined to be adequate
	if (!IS.instance(_this,Ucore) && !Ucore.all[_id]) //static call
	  return undefined;

//todo: decide what to return instead of undefined to be adequate
//todo:	error handling
	if (!arguments.length || !(_id>=0))
	  return undefined;

	if (Ucore.all[_id]) //reuse
	  return Ucore.all[_id];

	//Procceed New

	//dbase data
	_this.id= _id;
	_this.ver= CORE_VERSION.INIT;
	_this.uname= '';
	_this.relation= USER_RELATION.UNAVAILABLE;
	_this.groupId= 0; //relative to You
//todo: ref; use objects, make .changed(obj) reactor
	_this.boardIds= []; //for logged user and board owner.
//todo: ref; use objects, make .changed(obj) reactor
	_this.contactIds= []; //contactlist, basically for logged user.

	//operating
	_this.forRedraw= 0;
	_this.forRedrawBoards= 0;
	_this.forRedrawContacts= 0;
	_this.forSave= SAVE_STATES.IDLE;

	Ucore.all[_id]= _this;
ALERT(PROFILE.GENERAL, "Nuser new", 'id: ' +_id, 1);
}

Ucore.all= []; //global users array

//destructor, holds global list
Ucore.prototype.kill= function(){
	delete Ucore.all[this.id];
}


//incoming update
Ucore.prototype.set= function(_setA){ //{groupId: , relation: , ver: , uname: , bList: , cList: }
	if (this.forSave!= SAVE_STATES.IDLE) //unsaved
	  return false;

	if (
		(_setA.ver |0)>this.ver
	){ //validated
//todo: maybe change to comparing with key existance, not to being undefined
		if (_setA.groupId!=undefined)
		  this.groupId= _setA.groupId;
		if (_setA.relation!=undefined)
		  this.relation= _setA.relation;
		if (_setA.ver!=undefined)
		  this.ver= _setA.ver;
		if (_setA.uname!=undefined)
		  this.uname= _setA.uname;
		if (_setA.boardList!=undefined && _setA.boardList!=this.boardIds){
			this.boardIds= _setA.boardList;
			this.forRedrawBoards= 1;
		}
		if (_setA.contactsList!=undefined && _setA.contactsList!=this.contactIds){
			this.contactIds= _setA.contactsList;
			this.forRedrawContacts= 1;
		}

		this.forRedraw= this.forRedraw || (Object.keys(_setA).length>0);
//todo: update sets redraw to 0

ALERT(PROFILE.BREEF, "Nuser "+ this.id +" set ", 'ver: ' +this.ver +'; ' +'name: ' +this.uname +'; ' +'rel: ' +this.relation +'; ' +'group: ' +this.groupId +'; ' +'boards: ' +this.boardIds +'; ' +'contacts: ' +this.contactIds +'; ');
	}
	
	return true;
}


Ucore.prototype.boards= function(){
	var outBoards= [];
	var curN;
	for (var bId in this.boardIds)
	  if (curN= Ncore(this.boardIds[bId]))
	    outBoards[bId]= curN;
	return outBoards;
}


Ucore.prototype.contacts= function(){
	var outContacts= [];
	var curU;
	for (var cId in this.contactIds)
	  if (curU= Ucore(this.contactIds[cId]))
	    outContacts[cId]= curU;
	return outContacts;
}
/*
	Ncore object.
	Performs Note+Ndata holding and saving.
	Ncore acts as Note core for several referers and holds mantainance of referers mechanics.
	Ncore thus shoudn't be called directly. Instead there's NUI object to be called or build other Notes from.

	Creation:
		Ncore is created with specified _id.
		If no _id supported, new blank Ncore created with unique negative id.
                Zero _id set 'implicit' and are replaced by normal auto-negative.

	Resulting negative id should be interpreted that Ncore is not linked (yet) to dbase.

	Ncore object is added to NOTES[_id] without override.


	Ncore stores array of UI's attached and provide methods using it.
*/

var Ncore= function(_id){
	var _this= this;

	if (!IS.instance(_this,Ncore) && !Ncore.all(_id)) //static call
	  return undefined;

	_id= _id |0;
//todo: check: id shouldn't be <0
	if (!_id) //get new auto-decrement id
	  _id= Ncore.newId--;


	var oldN= Ncore.all(_id);
	if (oldN) //reuse existing Ncore
	  return oldN;

	//Procceed New
ALERT(PROFILE.GENERAL,"Ncore new", 'id: ' +_id, 1);

	//Public shared container
	_this.PUB= {
		//dbase data
		id:			_id,
		ver:		CORE_VERSION.INIT,
		name:		'',
		style:		new Style(),
//todo: ref; use objects, make .changed(obj) reactor
		ownerId:	0,
//todo: ref; use objects, make .changed(obj) reactor
		editorId:	0,
		rights:		NOTA_RIGHTS.INIT,  //Substituted Notes remain INIT, virtually not RO.
		  rightsA:	[], //[gId]= [0=ro|1=add|2=rw]
//todo: ref; use objects, make .changed(obj) reactor
		inheritId:	NOTA_RIGHTS.INHERITED,
		stamp:		0,

		ndata:		[], //[id]= Ndata;

		//operating
		forRedraw: true,
		forSave: SAVE_STATES.IDLE,
		forSaveRts: SAVE_STATES.IDLE,
		saveCB: null
	};

	//Array of UI instances.
	//Each instance holds set of ndata UI instances as well
	//nData itself DONT hold its UI, but refers to by NCore->NUI->DUI(id)
	_this.uiA= [];

	Ncore.cache(_id, _this);
//todo: do also something with data Ndata additional storage properties
}


//todo: move out
Ncore.newId= -1;
////cache
/*
	global notes array.
	Positive indices holds normal and Subst Notes (referenced directly).
	Negative indices holds Imps and unsaved Notes, that also only have different rights (0|3). 
	Notes automatically set unsupplied id to negative (-1,-2,-3...)
*/	
Ncore.allNotes= [];
Ncore.cache= function(_id, _note){
	if (Ncore.allNotes[_id]){ //stop at duplicating Ncore
//todo: react properly (how?)
		console.error('reID\'ing Ncore into existing, skipped');
		return false;
	}
	Ncore.allNotes[_id]= _note;
	return true;
}
Ncore.uncache= function(_id){
	delete Ncore.allNotes[_id];
}
//todo: return filtered sets (unsaved, undrawed etc)
//todo: handle and return UnitLink
Ncore.all= function(_id, _filter){
	if (arguments.length==0)
	  return Ncore.allNotes;

	for (var iN in Ncore.allNotes){
		var curNote= Ncore.allNotes[iN];
		if (curNote.PUB.id==_id)
		  return curNote;
	}
}
/////-cache



/*
	Public destructor, holds global list
	Called to wipe out all Note referers
*/
Ncore.prototype.kill= function(){
	for (var ir in this.uiA)
	  if (this.uiA[ir]){
		this.uiA[ir].doKill();
		this.uiA[ir]= undefined; //unlink here instead of calling multiple unlink()
	  }
	Ncore.uncache(this.PUB.id);
}



/*
	!!!transparent functions (from ui)
*/

//change .id
//replaces existing Ncore.all[_id]
//todo: meke sure killing existing Ncore.all[_id] will not make garbage
Ncore.prototype.setId= function(_id){
	_id= _id |0;
	if (!_id || _id==this.PUB.id)
	  return;

ALERT(PROFILE.BREEF, "Ncore "+ this.PUB.id +' re-id ', 'id: '+ _id);

	if (!Ncore.cache(_id, this))
	  return;
	Ncore.uncache(this.PUB.id);
	this.PUB.id= _id; //change id of provided Ncore

	return true;
}

/*
	Incoming set

	_rightsA is supplied only for owner as array or "group=[right]" strings and is parsed into existing rights group.
*/
Ncore.prototype.set= function(_setA){ //{name: , ver: , style: , rights: , rightsA: , inherit: , stamp: , owner: , editor: }
	if (this.PUB.forSave!= SAVE_STATES.IDLE) //unsaved
	  return false;

	if (
		this.PUB.id<=0 //subst notes
		|| (_setA.ver |0)>this.PUB.ver
		|| (_setA.rights |0)!=this.PUB.rights
		|| (_setA.inherit |0)!=this.PUB.inheritId
	){ //validated
		if (_setA.name!=undefined)
		  this.PUB.name= _setA.name;
		if (_setA.ver!=undefined)
		  this.PUB.ver= _setA.ver |0;
		if (_setA.style!=undefined)
		  this.PUB.style= new Style(_setA.style);
		if (_setA.inherit!=undefined)
		  this.PUB.inheritId= _setA.inherit |0;
		if (_setA.stamp!=undefined)
		  this.PUB.stamp= _setA.stamp;
		if (_setA.owner!=undefined)
		  this.PUB.ownerId= _setA.owner |0;
		if (_setA.editor!=undefined)
		  this.PUB.editorId= _setA.editor |0;

		if (_setA.rights!=undefined)
		  this.PUB.rights= this.PUB.inheritId==NOTA_RIGHTS.INHERITED? NOTA_RIGHTS.INIT : (_setA.rights |0);
//fix: _setA.rightsA!='' due to getting here '' instead of []
		if (_setA.rightsA!=undefined && _setA.rightsA!='')
		  for (var rt in _setA.rightsA){
			var rtA= _setA.rightsA[rt].split("=");
			this.PUB.rightsA[rtA[0] |0]= rtA[1]!=''? (rtA[1] |0) : undefined;
		  }

if (!this.PUB.forRedraw) ALERT(PROFILE.BREEF, "Ncore "+ this.PUB.id +"("+ this.PUB.inheritId +") set ", 'ver: ' +_setA.ver);
  
		this.PUB.forRedraw= this.PUB.forRedraw || (Object.keys(_setA).length>0);
	}
	
	return true;
}





Ncore.prototype.owner= function(){
	return Ucore(this.PUB.ownerId);
}

Ncore.prototype.editor= function(){
	return Ucore(this.PUB.editorId);
}

Ncore.prototype.inherit= function(){
	if (this.PUB.inheritId>0)
	  return Ncore(this.PUB.inheritId);
}

//todo: mantain list of .forSave==1 notes
Ncore.prototype.save= function(_vals, _okCB, _immediate){
//todo: use .set()

	if (IS.fn(_okCB))
	  this.saveCB= _okCB;

	if (!Object.keys(_vals).length)
	  return;

	if (_vals.rights)
	  this.PUB.rightsA[_vals.rights.group]= _vals.rights.right;

	if (_vals.style)
	  this.PUB.style= _vals.style;

	if (_vals.name)
	  this.PUB.name= _vals.name;

	if (_vals.inherit!=this.PUB.inheritId && this.PUB.ver==CORE_VERSION.INIT)
	  this.PUB.inheritId= _vals.inherit |0;


//todo: dedicate rights
	if (_vals.rights)
	  this.PUB.forSaveRts= SAVE_STATES.READY;
	if (_vals.style || _vals.name || _vals.inherit){
		this.PUB.editorId= SESSION.owner().id;
		this.PUB.stamp= new Date();
		this.PUB.forSave= SAVE_STATES.READY;

		this.PUB.forRedraw= true;
	}


	if (_immediate)
	  SESSION.save.saveGo();
	else
	  SESSION.save.save();
}

Ncore.prototype.saved= function(_res){
	if (this.PUB.ver==CORE_VERSION.INIT){ //CREATED
//todo: deal with error
		this.setId(_res);
		this.PUB.ver= 1;
		this.PUB.ownerId= SESSION.owner().id;
		this.PUB.rights= NOTA_RIGHTS.OWN;
	} else
	  this.PUB.ver= _res;

//todo: hold case when Ncore is changed to save WHILE IN save
	this.PUB.forSave=
	  this.PUB.forSaveRts=
	  SAVE_STATES.IDLE;

	if (this.saveCB)
	  this.saveCB(_res);
	this.saveCB= null;

	this.uiSaved();
}


//todo: check for being edited
Ncore.prototype.canSave= function(_enum){
	var curState= this.PUB.forSave;
	if (_enum && curState==SAVE_STATES.READY)
		this.PUB.forSave= SAVE_STATES.HOLD;
	return(curState);
}

Ncore.prototype.canSaveRts= function(_enum){
	var curState= this.PUB.forSaveRts;
	if (_enum && curState==SAVE_STATES.READY)
		this.PUB.forSaveRts= SAVE_STATES.HOLD;
	return(curState);
}

//todo: make ndata a collection object
Ncore.prototype.dataSet= function(_id, _setA){ //{ver: , dtype: , content: , editor: , stamp: , place: }
//todo: Data core should be same as Note core
	_id= _id |0;
//todo: check: id shouldn't be <0
	if (!_id) //get new auto-decrement id
	  _id= Ndata.newId--;

	var curData= this.PUB.ndata[_id];
	if (!curData)
	  curData= this.PUB.ndata[_id]= new Ndata(this,_id);

	return curData.set(_setA)? curData :false;
}

Ncore.prototype.dataForSave= function(_enum){
	var outDataA= [];
	for (var d in this.PUB.ndata)
	  if (this.PUB.ndata[d].canSave(_enum)==SAVE_STATES.READY)
	  	outDataA.push(this.PUB.ndata[d]);

	return outDataA;
}



//ui

Ncore.prototype.uiLink= function(_ui){
	if (!_ui)
	  return;
	var flag= false;
	for (var ir in this.uiA) //check for existing
	  if (this.uiA[ir]==_ui){
		flag= true;
		break;
	  }
else console.log('trying to link multiple UI');

	if (!flag)
	  this.uiA.push(_ui);

if (this.uiA.length!=1) ALERT(PROFILE.VERBOSE,'instances for ' +this.PUB.id +':', this.uiA.length);
}


Ncore.prototype.uiUnlink= function(_ui){
	var flag= false;
	for (var ir in this.uiA){ //seek and destroy
		if (this.uiA[ir]==_ui)
		  this.uiA[ir]= undefined;
		if (this.uiA[ir]!=undefined)
		  flag= true;
	}
	if (!flag) //cleanup Ncore itself
	  Ncore.uncache(this.PUB.id);
}


Ncore.prototype.uiSaved= function(){
	for (var ir in this.uiA)
	  if (this.uiA[ir])
		this.uiA[ir].doSaved();
}

/*
	Recursively walks through note hierarchy
	 and create/draw UI mesh.

	Instanced UI's are not poked in a queue, but instead are called
	 on-demand at their natural places in hierarchy fly-by.

macro:
	get UI for _parentUI
	  create if none
	draw children within UI
	draw (correct) UI
*/
//_parentUI provides parent data UI of TRUE for topmost (board)
Ncore.prototype.draw= function(_parentUI){
	if (!_parentUI)
	  return;

	var thisUI= false;
	for (var ir in this.uiA)
	  if (this.uiA[ir].parentUI == _parentUI){
	  	thisUI= this.uiA[ir];
	  	break;
	  }

	if (!thisUI){ //must create
		var uiLevel= _parentUI===true? 1:(_parentUI.level+1);

		switch (uiLevel) {
			case 1:
//todo: change to NUI(); remove NUI_* derived classes
				thisUI= new NUI_board(this, UI.DOM.workField);
				break;
			case 2:
				thisUI= new NUI_note(this, _parentUI.DOM.context);
		}
		this.uiLink(thisUI);

		thisUI.parentUI= _parentUI;
		thisUI.level= uiLevel;
	}


//todo: define limit
	if (thisUI.level <= 2){
		//update Data at its own condition
		var curDI= 1;
		var dataDrawed= false;
		for(var iD in this.PUB.ndata){
			var cData= this.PUB.ndata[iD];

			dataDrawed= dataDrawed || cData.forRedraw;
			if (cData.draw(thisUI, thisUI.level==1?curDI:0)) //only toplevel should bind sequentaly delayed
			  curDI++;
		}
	}
	else console.log('stop!');


	var success= true;
	if (dataDrawed || this.PUB.forRedraw)
	  success= thisUI.doDraw();
		
	this.PUB.forRedraw= !success;
}




//////////////////////////////


/*
	Root Note UI container

	NUI should be called only within NUI_<instance> construction.

	*No explicit NoteUi-DataUi link is used,
	 while everithing is redrawed from root
*/
var NUI= function(_rootN){
	this.Ncore= _rootN;

//todo: get rid
	this.PUB= this.Ncore.PUB;

	this.nFrontUI= {};
	this.level= 0;
	this.parentUI= false; //will be TRUE for topmost (board)
	//Each Note UI instance holds its Data instances referenced by ID.
	//Mantaining changing ID's (e.g. while first saving)
	// is propagated from Ncore and is called from Data:
	//<Data>.parent.setUiId(newId)
	this.dUI= [];
}

/*
	Public functions.
*/
NUI.prototype.kill= function(){
	this.Ncore.uiUnlink(this);
	this.doKill();
}

NUI.prototype.doKill= function(){
	this.nFrontUI.kill && this.nFrontUI.kill();
}


/*
	!!!private functions
*/

//Should be leaved blank at NUI to be safely overriden
NUI.prototype.doDraw= function(){
	if (!this.PUB.forRedraw)
	  return;

ALERT(PROFILE.BREEF, "NUI "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
}
/*
	Placed Note UI, inherits NUI
*/
var NUI_note= function(_rootN, _ctx){
	var thisNote= new NUI(_rootN);

	thisNote.doDraw= NUI_note.prototype.doDraw;
	thisNote.doSaved= NUI_note.prototype.doSaved;

	thisNote.nFrontUI= new NUI_noteFUI(thisNote, _ctx);

	return thisNote;
}


NUI_note.prototype.doDraw= function(){
//	UI.ownerW.draw(this);
	this.nFrontUI.style();
	this.parentUI.dFrontUI.style(); //parent holder influenced

ALERT(PROFILE.BREEF, "Note "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
	return true;
}


NUI_note.prototype.doSaved= function(){
	if (!this.parentUI.dFrontUI)
	  return;

//todo: inspect, obsolete code?
/*
	var childDataSave= 0;
	for (var c in this.PUB.ndata)
	  if (this.PUB.ndata[c].forSave>0){
	  	childDataSave= 1;
	  	break;
	  }
*/

	rootData.dFrontUI.setState(this.PUB.forSave!=SAVE_STATES.IDLE ||  this.parentUI.rootNdata.forSave!=SAVE_STATES.IDLE);
}
/*
	Note UI
	called at NUI_note.draw() after bulk Notes update to guarantee parent UI element is defined
*/
var NUI_noteFUI= function(_note,_rootW){
	var _this= this;

	_this.note= _note;
	_this.rootW= _rootW;

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();
}


NUI_noteFUI.prototype.place= function(){
}

//todo: make stilyze affecting only own UI elements
NUI_noteFUI.prototype.style= function(){
	var _style= this.note.PUB.style;

	this.DOM.bg.style.background= _style.main.hex();
	this.DOM.bg.style.borderColor= _style.mainDark.hex();
	this.DOM.overbg.style.background= _style.main.hex(false)? '' :'transparent';

	var thisData= this.note.PUB.ndata;
	for (var i in thisData)
	  if (thisData[i].ui) //skip for nonexistent (yet) leafs
	    thisData[i].ui.style();
}

NUI_noteFUI.prototype.bindEvt= function(_parentEl){
}

NUI_noteFUI.tmpl= DOM('plateNoteTmpl');
NUI_noteFUI.prototype.build= function(_parentEl){
	var cRoot= NUI_noteFUI.tmpl.cloneNode(true);
	var cBg= DOM('plateNoteBg',cRoot);
	var cObg= DOM('plateNoteOverbg',cRoot);
	var cCtx= DOM('plateNoteContext',cRoot);
	NOID(cRoot);

	cObg.style.display= (UI.perfLevel &PERF.GRADIENTS)? '' :'none';

	_parentEl.appendChild(cRoot);

	return {
		root:cRoot,
		bg:cBg,
		overbg:cObg,
		context:cCtx
	};
}

NUI_noteFUI.prototype.kill= function(){
	this.rootW.removeChild(this.DOM.root);
}/*
	Global board UI class, inherits NUI
*/
var NUI_board= function(_rootN, _ctx){
	var thisNote= new NUI(_rootN);

	thisNote.doDraw= NUI_board.prototype.doDraw;
	thisNote.doSaved= NUI_board.prototype.doSaved;

	thisNote.nFrontUI= new NUI_boardFUI(thisNote, _ctx);

	return thisNote;
}


NUI_board.prototype.doDraw= function(){
	this.nFrontUI.correct();
	this.nFrontUI.style();
	UI.style(); //parent holder influenced

//todo: set point of interest
	if (!this.nFrontUI.lookat.done){
		var coords= SESSION.cookieGet('bpos' +this.PUB.id).split('_');
		if (coords!=''){
			this.nFrontUI.lookat(coords[0], coords[1]);
			this.nFrontUI.lookat.done= true;
		} else {

		}
	}

//todo:	redraw preview if need

ALERT(PROFILE.BREEF,"Board "+ this.PUB.id +"("+ this.PUB.inheritId +") draw ", 'ver: ' +this.PUB.ver);
}


NUI_board.prototype.doSaved= function(){
}
/*
	Board UI.
 	called at Board.draw() to guarantee parent UI element is defined
*/
var NUI_boardFUI= function(_note,_rootW){
	var _this= this;

	_this.note= _note;

	_this.DOM= _this.build(_rootW);
	_this.overview= new BoardOverviewUI(_this.note,_rootW);

	_this.bound= {
		xmin: null,	xmax: null, width: null,
		ymin: null,	ymax: null, height: null,
		dirty: true
	}
	_this.lastHilite= null; //data.ui with mouseover
	_this.mouseInitialX= 0;
	_this.mouseInitialY= 0;

	_this.lazyCtx= {};

	_this.bindEvt();
}


NUI_boardFUI.prototype.place= function(_data,_uiRoot){
	_uiRoot.style.left= _data.place.x +"px";
	_uiRoot.style.top= _data.place.y +"px";
	_uiRoot.style.width= _data.place.w +"px";
	_uiRoot.style.height= _data.place.h +"px";
}

////PRIVATE
NUI_boardFUI.prototype.bindEvt= function(){
	var _this= this;
	this.DOM.root.onmousedown= function(_e){UI.mouseContext(_e,_this,_this.mouseDown,_this.mouseMove,undefined,USER_REACTION.POINTER_DEAD_SPOT)};
	this.DOM.root.onmouseup= function(_e){if (!_e.toolFlag && _this.note.PUB.rights>=NOTA_RIGHTS.RW) UI.toolSet.make(ToolBoard,_this.DOM.tool,_this.note)};

	UI.bindDeep(this.onWndScroll.bind(this),this.onWndResize.bind(this));
}

NUI_boardFUI.prototype.mouseDown= function(_e){
	this.mouseInitialX= DOCUMENT.scrollLeftF() +_e.clientX;
	this.mouseInitialY= DOCUMENT.scrollTopF() +_e.clientY;
}

NUI_boardFUI.prototype.mouseMove= function(_e){
	DOCUMENT.scrollXY(
		this.mouseInitialX -_e.clientX,
		this.mouseInitialY -_e.clientY
	);
}


NUI_boardFUI.tmpl= DOM('plateBoardTmpl');
NUI_boardFUI.prototype.build= function(_parentEl){
	var cRoot= NUI_boardFUI.tmpl.cloneNode(true);
	var cBG= DOM('plateBoardBG',cRoot);
	var cCanvas= DOM('plateBoardCanvas',cRoot);
	var cRootover= DOM('plateBoardRoot',cRoot);
	var cCtx= DOM('plateBoardContext',cRoot);
	var cTool= DOM('plateBoardToolHolder',cRoot);
	NOID(cRoot);

	cCanvas.style.display= (UI.perfLevel &PERF.IMAGEBG)? '' :'none';

	_parentEl.appendChild(cRoot);

	return {
		root:cRootover,
		context:cCtx,
		bg:cBG,
		canvas:cCanvas,
		tool:cTool
	};
}

NUI_boardFUI.prototype.canvasSet= function(){
	var canvas= this.DOM.canvas;
	if ((canvas.width == canvas.offsetWidth) && (canvas.height == canvas.offsetHeight))
	  return;

	canvas.width= canvas.offsetWidth;
	canvas.height= canvas.offsetHeight;

	var cStyle= this.note.PUB.style;

	var canvasImgRepaint= function(_img){
		var cctx= canvas.getContext('2d');
		cctx.globalAlpha= 0.05;
		cctx.drawImage(_img,0,0,canvas.width,canvas.height);
		_img.isLoaded= true;
	}

	if (!this.bgimg){
		this.bgimg= new Image();
		var _this= this;
		  this.bgimg.onload= function(){canvasImgRepaint(_this.bgimg)};
		this.bgimg.src= cStyle.bg.imgName;
//todo: make normal animating bg
		if (UI.perfLevel &PERF.ANIMATE)
		  paintC(canvas);
	} else if (this.bgimg.isLoaded)
	  canvasImgRepaint(this.bgimg);
}

NUI_boardFUI.prototype.style= function() {
	var curStyle= this.note.PUB.style;

	this.canvasSet();

	this.DOM.bg.style.backgroundColor= curStyle.main.hex('');

//todo: usa: overview should be auto-hidden for implicits not larger than screen
	this.overview.DOM.root.style.display= ((this.note.PUB.rights<NOTA_RIGHTS.RO || UI.embed)? 'none' : '');
	this.overview.DOM.bg.style.backgroundColor= curStyle.main.mix(STYLE.OVERVIEW_TINT,STYLE.OVERVIEW_MIX).hex('');

	var thisData= this.note.PUB.ndata;
	for (var i in thisData)
	  if (thisData[i].ui) //skip for nonexistent (yet) leafs
	    thisData[i].ui.style();
}


//todo: unify full and partial redraw
NUI_boardFUI.prototype.onWndScroll= function(){
	this.overview.correct();
	this.canvasMove();

	lazyRun(
		this.saveBrowse.bind(this)
		, TIMER_LENGTH.BROWSE_DELAY
		, this.lazyCtx
	);
}

NUI_boardFUI.prototype.onWndResize= function(){
	this.canvasMove();
	this.correct(1);
}


/*
*/
NUI_boardFUI.prototype.canvasMove= function() {
	var  canvasGapW= this.DOM.canvas.clientWidth-DOCUMENT.clientWidthF(1)
		,canvasGapH= this.DOM.canvas.clientHeight-DOCUMENT.clientHeightF(1)
		,frameGapW= DOCUMENT.scrollWidthF()-DOCUMENT.clientWidthF()
		,frameGapH= DOCUMENT.scrollHeightF()-DOCUMENT.clientHeightF();

	if (canvasGapW<=0 || canvasGapH<=0)
	  return;

//	Moving range is canvasGap, but no more than frameGap/2
	this.DOM.canvas.style.left= -DOCUMENT.scrollLeftF() *Math.min(canvasGapW/frameGapW,.5) +'px';
	this.DOM.canvas.style.top= -DOCUMENT.scrollTopF() *Math.min(canvasGapH/frameGapH,.5) +'px';
}


//0-1 range of ENTIRE workfield span
NUI_boardFUI.prototype.lookXY= function(_x,_y){
	DOCUMENT.scrollXY(
		1.*_x*DOCUMENT.scrollWidthF() -DOCUMENT.clientWidthF()*.5
		,1.*_y*DOCUMENT.scrollHeightF() -DOCUMENT.clientHeightF()*.5
	);
}

//0-1 range inside notes block ONLY
//todo: need at all?
NUI_boardFUI.prototype.lookat= function(_lookX,_lookY){
	var bound= this.getBound();
	DOCUMENT.scrollXY(
		bound.width*(_lookX*2-1)*.5
		 +DOCUMENT.scrollWidthF()*.5
		 -DOCUMENT.clientWidthF()*.5
		,bound.height*(_lookY*2-1)*.5
		 +DOCUMENT.scrollHeightF()*.5
		 -DOCUMENT.clientHeightF()*.5
	);
}
NUI_boardFUI.prototype.blocksXY= function(){
	var bound= this.getBound();
	return {
		x:
		((DOCUMENT.scrollLeftF()+DOCUMENT.clientWidthF()*.5)/DOCUMENT.scrollWidthF()-.5)
		*DOCUMENT.scrollWidthF()/bound.width
		+.5,
		y:
		((DOCUMENT.scrollTopF()+DOCUMENT.clientHeightF()*.5)/DOCUMENT.scrollHeightF()-.5)
		*DOCUMENT.scrollHeightF()/bound.height
		+.5
	};
}


//todo: remove f'n redrawdelay
NUI_boardFUI.prototype.correct= function(redrawDelay){
	this.canvasSet();
	this.correctField();

	this.overview.draw(redrawDelay |0);
}

//todo: maybe: check for real changes, before applying
//todo: issue: Board.BG moved out from Board.context and placed earlier. POSSIBLE correctField errors.
NUI_boardFUI.prototype.correctField= function(){
	if (this.note.PUB.ndata.length==0) { //blank field
		this.DOM.root.style.width=
		  this.DOM.root.style.height= '100%';
		return;
	}

	var bound= this.getBound();
	var mainMargins= (this.note.PUB.rights>=NOTA_RIGHTS.RW? 0: STYLE.BOARD_MARGIN);

	//Horisontal
	var wClient= DOCUMENT.clientWidthF();
	var wClientEditable= wClient *(this.note.PUB.rights>=NOTA_RIGHTS.RW? STYLE.BOARD_MARGIN_EDITABLE :.0) +mainMargins;
	var wFocus= bound.width +wClientEditable*2;
	var wExcess= wClient>wFocus? wClient-wFocus :0;
	this.DOM.root.style.width= (wExcess>0?wClient:wFocus) +"px";
	this.DOM.context.style.left= -bound.xmin +wClientEditable +wExcess/2 +"px";

	//Vertical
	var hClient= DOCUMENT.clientHeightF();
	var hClientEditable= hClient *(this.note.PUB.rights>=NOTA_RIGHTS.RW? STYLE.BOARD_MARGIN_EDITABLE :.0) +mainMargins;
	var hFocus= bound.height +hClientEditable*2;
	var hExcess= hClient>hFocus? hClient-hFocus :0;
	this.DOM.root.style.height= (hExcess>0?hClient:hFocus) +"px";
	this.DOM.context.style.top= -bound.ymin +hClientEditable +hExcess/2 +"px";
}


NUI_boardFUI.prototype.getBound= function(){
//todo: bound should be updated as leafs changed, use dirtyBound()
//	if (0 &&  !this.bound.dirty)
//	  return this.bound;

	var f; 
	for (var i in this.note.PUB.ndata){
		var curPlace= this.note.PUB.ndata[i].place;

		if (f){
			var xm= curPlace.x+curPlace.w;
			var ym= curPlace.y+curPlace.h;
			if (curPlace.x<this.bound.xmin)
			  this.bound.xmin= curPlace.x;
			if (xm>this.bound.xmax)
			  this.bound.xmax= xm;
			if (curPlace.y<this.bound.ymin)
			  this.bound.ymin= curPlace.y;
			if (ym>this.bound.ymax)
			  this.bound.ymax= ym;
		} else {
			this.bound.xmin= curPlace.x;
			this.bound.xmax= this.bound.xmin+curPlace.w;
			this.bound.ymin= curPlace.y;
			this.bound.ymax= this.bound.ymin+curPlace.h;

			f= true;
		}
	}

	this.bound.width= this.bound.xmax -this.bound.xmin;
	this.bound.height= this.bound.ymax -this.bound.ymin;
	this.bound.dirty= false;

	return this.bound;
}

NUI_boardFUI.prototype.dirtyBound= function(){
	this.bound.dirty= true;
}

NUI_boardFUI.prototype.saveBrowse= function(){
	var xy= this.blocksXY();
	SESSION.cookieSet(xy.x +'_' +xy.y, 'bpos' +this.note.PUB.id);
}
var BoardOverviewUI= function(_board,_rootW){
	var _this= this;

	_this.board= _board;

	_this.redrawTimeout= undefined;
	_this.atoms= [];

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();

}


BoardOverviewUI.prototype.bindEvt= function(){
	var _this= this;
	this.DOM.root.onmousedown=	function(e){UI.mouseContext(e,_this,_this.mouseMove,_this.mouseMove)};
	this.DOM.root.ondblclick=	noBubbles;
}

BoardOverviewUI.prototype.mouseMove= function(_e){
	this.board.nFrontUI.lookXY(
		(_e.clientX -this.DOM.root.offsetLeft)/this.DOM.root.offsetWidth,
		(_e.clientY -this.DOM.root.offsetTop)/this.DOM.root.offsetHeight
	);
}

BoardOverviewUI.tmpl= DOM('overviewTmpl');
BoardOverviewUI.prototype.build= function(_parentEl){
	var cRoot= BoardOverviewUI.tmpl.cloneNode(true);
	var cBG= DOM('overViewBG',cRoot);
	var cFrame= DOM('overViewFrame',cRoot);
	NOID(cRoot);

	_parentEl.appendChild(cRoot);

	return {
		root:cRoot,
		bg:cBG,
		frame:cFrame
	};
}

////functions

//resize overview window itself
BoardOverviewUI.prototype.resize= function(){
	var aspect= DOCUMENT.scrollWidthF()/DOCUMENT.scrollHeightF();
	var ovw= aspect>1?STYLE.OVERVIEW_BASESIZE*aspect:STYLE.OVERVIEW_BASESIZE;
	var ovh= aspect>1?STYLE.OVERVIEW_BASESIZE:STYLE.OVERVIEW_BASESIZE/aspect;
	if (ovw>STYLE.OVERVIEW_MAXSIZE) {
		ovh= ovh*STYLE.OVERVIEW_MAXSIZE/ovw;
		ovw= STYLE.OVERVIEW_MAXSIZE;
	}
	if (ovh>STYLE.OVERVIEW_MAXSIZE) {
		ovw= ovw*STYLE.OVERVIEW_MAXSIZE/ovh;
		ovh= STYLE.OVERVIEW_MAXSIZE;
	}
	this.DOM.root.style.width= ovw +'px';
	this.DOM.root.style.height= ovh +'px';
}

BoardOverviewUI.prototype.correct= function(){
//todo: +make also for non-html5 scroll
	var curWidth= DOCUMENT.scrollWidthF()/100;
	var curHeight= DOCUMENT.scrollHeightF()/100;

	this.DOM.frame.style.top=	DOCUMENT.scrollTopF()/curHeight +'%';
	this.DOM.frame.style.height=	DOCUMENT.clientHeightF()/curHeight +'%';
	this.DOM.frame.style.left=	DOCUMENT.scrollLeftF()/curWidth +'%';
	this.DOM.frame.style.width=	DOCUMENT.clientWidthF()/curWidth +'%';
}


//re-paint overview nodes 
//onresize, resize() used instead
//todo: use arbitrary nId to update only one note.
//todo: make update lazy
BoardOverviewUI.prototype.draw= function(_redrawDelay){
	clearTimeout(this.redrawTimeout);
//todo: validate context (???)
	var _this= this;
	setTimeout(function(){
		_this.drawField();
		_this.resize();
		_this.correct();
	},_redrawDelay*TIMER_LENGTH.OVERVIEW_LAZY_DELAY);
}



////PRIVATE
//todo: add one atom redrawing
BoardOverviewUI.prototype.drawField= function(){
	this.atoms= [];
	while (this.DOM.bg.childNodes.length>0)
	  this.DOM.bg.removeChild(this.DOM.bg.lastChild);

	var curLeft= this.board.nFrontUI.DOM.context.offsetLeft;
	var curTop= this.board.nFrontUI.DOM.context.offsetTop;
	var curWidth= DOCUMENT.scrollWidthF()/100;
	var curHeight= DOCUMENT.scrollHeightF()/100;

	for (var i in this.board.PUB.ndata){ //paint overview
		var curLeaf= this.board.PUB.ndata[i];
		if (curLeaf.dtype!=DATA_TYPE.NOTE)
		  continue;
		var atomStyle= curLeaf.sibling().PUB.style;
		if (!atomStyle.main.a)
		  continue;

		var newAtomBG= this.atoms[i]= DOCUMENT.createElement('span');
		  newAtomBG.className= 'overViewAtomBG';

		  //desc: floor/cell used to show maximum used space
		  newAtomBG.style.left= Math.floor((curLeaf.place.x +curLeft)/curWidth) +'%';
		  newAtomBG.style.top= Math.floor((curLeaf.place.y +curTop)/curHeight) +'%';
		  newAtomBG.style.width= Math.ceil(curLeaf.place.w /curWidth) +'%';
		  newAtomBG.style.height= Math.ceil(curLeaf.place.h /curHeight) +'%';

		var newAtom= DOCUMENT.createElement('span');
		  newAtom.className= 'overViewAtom';

		  newAtom.style.backgroundColor= atomStyle.main.mix(STYLE.OVERVIEW_TINT,STYLE.OVERVIEW_MIX).hex();
		  newAtom.style.borderColor= atomStyle.mainDark.mix(STYLE.OVERVIEW_TINT,STYLE.OVERVIEW_MIX).hex();

		newAtomBG.appendChild(newAtom);
		this.DOM.bg.appendChild(newAtomBG);
	}
}

/*
//todo: make parent Unit class for all units to mantain flat lists;

Unit: root external interface; creation, reparent, reid, kill
	(Unit.DB) NoteDB, NdataDB, UserDB: implements save/update/set
	(Unit.UI[]) NUI, NdataUI: UI placeholter, Tool Context
		(NUI.nFrontUI) NUI_noteFUI, NUI_boardFUI
		(NdataUI.dFrontUI) DUIUnknown, DUIText, DUINote, DUIFile, DUIPaint
*/


/*
Class hierarchy:

0. ndataList[id]
1. Ndata +vals
2. .rootNote.ui[].dUI[id]
2.1.	.frontUI

0. notesList[id]
1. Ncore
1.1.	.PUB (db slice)
1.2.	.ui[] (.referrence[])
1.2.1.		.frontUI

!!!-> so Ndata doesnt contain its multiple UIs, but instead they
 stored within respective Note multiple UIs

*/

/*
	Data atom for notes.
	One Data belongs exactly to one Note, so there's no existence check logic
*/
var Ndata= function(_root,_id)
{
	var _this= this;

	_this.id= _id;
	_this.ver= CORE_VERSION.INIT;
	_this.place= {x:null,y:null,w:null,h:null};
	_this.dtype= null;
//todo: ref; use objects, make .changed(obj) reactor
	_this.content= null;
//todo: ref; use objects, make .changed(obj) reactor
	_this.editorId= null;
	_this.stamp= null;

//todo: ref; use objects, make .changed(obj) reactor
	_this.rootNote= _root;
	_this.forRedraw= 0;
	_this.forSave= SAVE_STATES.IDLE;
	_this.forDelete= false;

ALERT(PROFILE.BREEF,"Data new", 'id: ' +_id);
}

Ndata.newId= -1;

//spike: replace with all[] later; Bruteforce is evil
Ndata.all= function(_id){
	if (arguments.length==0){
		var outDataA= [];
		for (var iN in Ncore.all()){
			var allD= Ncore.all(iN).PUB.ndata;
			for (var iD in allD)
		  	  outDataA[iD]=allD[iD];
		}
		return outDataA;
	}

	for (var iN in Ncore.all()){
		var allD= Ncore.all(iN).PUB.ndata;
		for (var iD in allD)
		  if (allD[iD].id==_id)
		    return allD[iD];
	}
}

Ndata.prototype.set= function(_setA){ //{ver: , dtype: , content: , editor: , stamp: , place: }
	if (this.forSave!= SAVE_STATES.IDLE) //unsaved
	  return false;

	if (
		(_setA.ver |0)>this.ver
	){ //validaved
		if (_setA.ver!=undefined)
		  this.ver= _setA.ver |0;
		if (_setA.dtype!=undefined)
		  this.dtype= _setA.dtype |0;
		if (_setA.content!=undefined)
		  this.content= _setA.content;
		if (_setA.editor!=undefined)
		  this.editorId= _setA.editor |0;
		if (_setA.stamp!=undefined)
		  this.stamp= _setA.stamp;
		if (_setA.place!=undefined)
		  this.place= {
		  	x:_setA.place[0] |0,
		  	y:_setA.place[1] |0,
		  	w:_setA.place[2] |0,
		  	h:_setA.place[3] |0
		  };

if (!this.forRedraw) ALERT(PROFILE.VERBOSE, "Data "+ this.id +"("+ this.rootNote.PUB.id +") set ", 'ver: ' +_setA.ver +(_setA.dtype==DATA_TYPE.NOTE? ('; link: ') : ('; data: ') +_setA.content));
	  
		this.forRedraw= this.forRedraw || (Object.keys(_setA).length>0);
	}

	return true;
}


Ndata.prototype.kill= function(){
	if (this.forSave!= SAVE_STATES.IDLE) //unsaved
	  return false;

	this.ui.kill();
//kill:	this.ui && this.ui.kill();

//todo: this is alien call for future Unit object
	if (this.dtype==DATA_TYPE.NOTE)
	  this.sibling() && this.sibling().kill();

	delete this.rootNote.PUB.ndata[this.id];

	return true;
}

//change .id
//replaces parent's .data[_id]
//todo: meke sure killing existing parent's .data[_id] will not make garbage
Ndata.prototype.setId= function(_id){
	_id= _id |0;
	if (!_id || _id==this.id)
	  return;

ALERT(PROFILE.BREEF, "Ndata "+ this.id +' re-id ', 'id: '+ _id);

	var parentCollection= this.rootNote.PUB.ndata;
	if (parentCollection[_id]){
//todo: react properly (how?)
		console.error('reID\'ing nData into existing, skipped');
		return;
	}

	parentCollection[_id]= this; //fill in existent Ncore
	delete parentCollection[this.id];

//re-id ndata UI
	for (var dui in this.rootNote.uiA){
		var curUiRoot= this.rootNote.uiA[dui];
		if (curUiRoot[this.id]){
			curUiRoot[_id]= curUiRoot[this.id];
			delete curUiRoot[this.id];
		}
	}
	this.id= _id; //change id

	return true;
}

Ndata.prototype.sibling= function(){
	if (this.dtype!=DATA_TYPE.NOTE)
	  return undefined;
	
	return Ncore(this.content |0);
}

Ndata.prototype.editor= function(){
	return Ucore(this.editorId);
}


//uiTemplateA varies dependent to context Data is in.
Ndata.prototype.draw= function(_parentUI, _curDI){
	var thisUI= _parentUI.dUI[this.id];
	if (!thisUI){
		thisUI= _parentUI.dUI[this.id]= new NdataUI(this, _parentUI, _curDI); //link ui instance to root data ui array
		thisUI.level= _parentUI.level;
	}

	if (this.forRedraw)
	  thisUI.draw();

	if (this.dtype==DATA_TYPE.NOTE) //go deeper
	  Ncore.all(this.content) && Ncore.all(this.content).draw(thisUI);

	var forRedraw_= this.forRedraw;
	this.forRedraw= 0;
	return forRedraw_;
}


//in reverse for Note, saving Data assumes visual changes are ALREADY made
//todo: mantain list of .forSave==1 data
Ndata.prototype.save= function(_vals){
//todo: use .set()

	if (!Object.keys(_vals).length)
	  return;

	if (_vals.del){
		if (this.ver == CORE_VERSION.INIT) //shorthand for unsaved yet
		  return this.saved(0);

		this.ui.unbind();
//		this.ui && this.ui.unbind();
		this.forDelete= true;
	}

	if (_vals.content!=undefined)
	  this.content= _vals.content;

	if (_vals.place!=undefined) 
	  this.place= {
	  	x:_vals.place.x,
	  	y:_vals.place.y,
//todo: remove (autosize)
	  	w:this.place.w ||300,
	  	h:this.place.h ||100
	  };

	this.editorId= SESSION.owner().id;
	this.stamp= new Date();
	this.forSave= SAVE_STATES.READY;

//todo: completely move to set()
	this.forRedraw= true;

	SESSION.save.save();
}

Ndata.prototype.saved= function(_res, _resNotesA){
	this.forSave= SAVE_STATES.IDLE;
	this.forRedraw= true;

	if (_res==0){ //DELETED
		return this.kill();
	} else if (this.ver==CORE_VERSION.INIT){ //CREATED
//todo: deal with error
		this.setId(_res)
		this.ver= 1;
	} else
	  this.ver= _res;

//todo: will be simplified after dedication of Unit
	//affect uplink
	this.rootNote.uiSaved();
	//affect downlink
	if (this.dtype==DATA_TYPE.NOTE){
		var curN= _resNotesA[this.content] || Ncore.all(this.content);
		this.content= curN.PUB.id;
		curN.uiSaved();
	}
}

//todo: check for being edited
Ndata.prototype.canSave= function(_enum){
	var curState= this.forSave;
	if (_enum && curState==SAVE_STATES.READY)
		this.forSave= SAVE_STATES.HOLD;
	return(curState);
}


////////////////////////////////





/*
Leafs are drawn at separate path

*/

var NdataUI= function(_rootD, _parentUI, _curDI){
	this.rootNdata= _rootD;

	this.rootUI= _parentUI;
	this.level= 0;

	this.DOM= this.build(_curDI);
	this.dFrontUI= new (NdataUI.newTemplate[this.rootNdata.dtype] || NdataUI.newTemplate[DATA_TYPE.UNKNOWN])(this);
}

NdataUI.newTemplate= [];

//todo: _resizeSpot to be removed at all
//todo: make complex leafSign
//todo: redesign comments
NdataUI.tmpl= DOM('leafTmpl');
NdataUI.prototype.build= function(_curDI){
	var cClone= NdataUI.tmpl.cloneNode(true);
	var cRoot= {
		root:	cClone,
		sign:	DOM('leafSign',cClone),
		shadow:	DOM('leafSignShadow',cClone),
		mark:	DOM('leafSignMark',cClone),
		stamp:	DOM('leafSignStamp',cClone),
		ref:	DOM('leafSignCustom',cClone),
		context:	DOM('leafContext',cClone),
		tool:	DOM('leafToolHolder',cClone),
		cover:	DOM('leafFrameCover',cClone)
	};
	NOID(cClone);

//cClone.style.transform= 'rotate('+(Math.random()-.5)*5+'deg)';

	var cCtx= this.rootUI.nFrontUI.DOM.context; //link created ui to parents' ui

//todo: make internally managed grain adding instead of supplied _curDI
	setTimeout(function(){
		cCtx.appendChild(cClone);
		cClone.focus();
		cClone.style.opacity= 1;
	}, _curDI*TIMER_LENGTH.LEAF_CREATION_PERIOD);

	return cRoot;
}


NdataUI.prototype.draw= function(){
	this.dFrontUI.draw();
	this.rootUI.nFrontUI.place(this.rootNdata, this.DOM.root); //container decides how to arrange in fact
}


NdataUI.prototype.style= function(){}


NdataUI.prototype.unbind= function(){
	if (!this.dFrontUI)
	  return;

	this.dFrontUI.unbind();
}

NdataUI.prototype.kill= function(){
//	this.dFrontUI && this.dFrontUI.kill();

	this.rootUI.nFrontUI.DOM.context.removeChild(this.DOM.root);
}

/*
	ui class for unknown Note data
*/
var DataUIUnknown=
 NdataUI.newTemplate[DATA_TYPE.UNKNOWN]=
 function(_UI){
	this.UI= _UI;
	this.DOM= this.build(_UI.DOM.context);
}

DataUIUnknown.prototype.draw = function() {
	this.DOM.root.elementText(this.UI.rootNdata.content);
}

DataUIUnknown.prototype.style= function(){}


////PRIVATE
DataUIUnknown.prototype.build= function(_parentEl){
	var elRoot= DOCUMENT.createElement("div");
	
	_parentEl.appendChild(elRoot);

	return {
		root: elRoot
	};
}

DataUIUnknown.prototype.setState= function(_state){}

DataUIUnknown.prototype.unbind= function(){
	
}

DataUIUnknown.prototype.kill= function(){
}
//todo: delegate D.UI class (and NRoot -> N.UI)

/*
	ui class for framed Note data
*/
var DataUIText=
 NdataUI.newTemplate[DATA_TYPE.TEXT]=
 function(_UI){
	this.UI= _UI;
	this.DOM= this.build(_UI.DOM.context);

	this.bindEvt();
}

DataUIText.prototype.draw = function() {
	this.DOM.content.elementText(this.UI.rootNdata.content, true);

//todo: reduce multicall; called for every data within Note
//	this.setState();


//todo: introduce parents visual modifiers
	if (this.UI.level==1)
	  this.DOM.content.style.fontSize= '20pt';
}

DataUIText.prototype.style= function(){}

DataUIText.prototype.bindEvt= function(){
	var _this= this;
	var rts= this.UI.rootNdata.rootNote.PUB.rights;

//todo: different behaviors for different user rights

//todo: dont allow to react with implicit referers
 	if (rts>= NOTA_RIGHTS.RO){
//todo: replace with mouseContext
		this.DOM.plate.onmouseup= function(e){e.toolFlag=1; _this.toolShow(1)};
	}

}
////PRIVATE
DataUIText.tmpl= DOM('leafTextTmpl');
DataUIText.prototype.build= function(_parentCtx){
	var cClone= DataUIText.tmpl.cloneNode(true);
	var cRoot= {
		root:		cClone,
		plate:		DOM('leafTextPlate',cClone),
		content:	DOM('leafTextContext',cClone),
		tool:		DOM('leafTextToolHolder',cClone)
	};
	NOID(cClone);

	_parentCtx.appendChild(cClone);

	return cRoot;
}

DataUIText.prototype.content= function(_newValue){
	return this.DOM.root.elementText(_newValue);
}

DataUIText.prototype.editMode= function(_edit,_onkeypress){
	var editField= this.DOM.root;

	if (_edit){
		editField.contentEditable= 'true';
		editField.style.background= this.UI.rootNdata.rootNote.PUB.style.editfieldActive.hex();
		editField.focus();
	
		//place cursor at end
		if (DOCUMENT.createRange) {
			var range= DOCUMENT.createRange();
			range.selectNodeContents(editField);
			range.collapse(false);
			var sel= WINDOW.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else {
			var range= DOCUMENT.bodyEl.createTextRange();
			range.moveToElementText(editField);
			range.collapseToEnd();
			range.select();
		}

		editField.onkeypress= _onkeypress;
		this.UI.dFrontUI.DOM.context.onmousedown= noBubbles;
		return this.content();
  	} else {
		editField.contentEditable= 'false';
		editField.style.background= '';
		editField.blur();

		editField.onkeypress=
		this.UI.dFrontUI.DOM.context.onmousedown=
		  null;
	}
}

DataUIText.prototype.toolShow= function(_show){
	if (_show && UI.mouseButton!=-1)
	  return;
	if (UI.toolSet.tool && UI.toolSet.tool.sticky)
	  return;

	if (_show){
		if (!UI.toolSet.tool || this.tool!=UI.toolSet.tool)
		  this.tool= UI.toolSet.make(ToolBoardLeaf,this.DOM.tool,this.UI.rootNdata);
	} else {
		UI.toolSet.kill(this.tool);
		this.tool= null;
	}

//+++constant
	this.DOM.root.style.zIndex= _show?2:'';
}

DataUIText.prototype.setState= function(_state){}

DataUIText.prototype.unbind= function(){
	
}

DataUIText.prototype.kill= function(){
}
/*
	ui class for toplevel Note stickers
*/

var DataUINote=
 NdataUI.newTemplate[DATA_TYPE.NOTE]=
 function(_UI){
	this.UI= _UI;
	this.DOM= this.build(_UI.DOM.context);
//todo 41 (xixi) +0: xoxo
	this.stampTimeout= null;

	this.actualMouseOver= 0;
	this.captionTimeout= null;
	this.hoverToolTimeout= null;

	this.tool= null;
	
//	this.bindEvt();




/*
//todo: check if version is important here
	if (rights>=2 && _dver.split(",")[0]!=0) { //for write permissions and not marked for deletion
		var iFdoc= _this._noteFrame.contentDocument;
		iFdoc.ondblclick= _this.dblClick;
		addEvent(iFdoc, 'keypress', _this.keyPress);
	}
	if (rights>=1 && _dver.split(",")[0]!=0) { //for comment permissions and not marked for deletion
		_this._noteComment.onkeypress= _this.commentKeyPress;
	}
	_this._noteRef.innerHTML= _ref; //ref is set only once as it can't change

	_this.updateNote(_ver, _x, _y, _w, _h, _style);
	_this.updateData(_dver,_src,_editor,_stamp);
*/
}

DataUINote.prototype.draw= function () {
//todo: move to dui
//	this.sign();
}

//support method for Data's derived Note draw() (same as UI.style() for NUI_board.draw())
//todo: lolwut? - ^^
DataUINote.prototype.style= function(){}


//only custom
DataUINote.prototype.setState= function(_msg){}




////PRIVATE

DataUINote.tmpl= DOM('leafNoteTmpl');
DataUINote.prototype.build= function(_parentEl,_curDI){
//todo: _resizeSpot to be removed at all
//todo: append _noteSign _noteRef to noteInfo (wat)
//todo: redesign comments
	var cClone= DataUINote.tmpl.cloneNode(true);
	var cRoot= {
		root:		cClone,
		shadow: 	DOM('leafNoteShadow',cRoot),
		context:	DOM('leafNoteContext',cRoot)

/*
		mark:		DOM('leafNoteMark',cRoot),
		stamp:		DOM('leafNoteStamp',cRoot),
		ref:		DOM('leafNoteRef',cRoot),
		sign:		DOM('leafNoteSign',cRoot),
*/
/*
		plate:		DOM('leafNotePlate',cRoot),
		tool:		DOM('leafNoteToolHolder',cRoot),
		cover:		DOM('leafNoteFrameCover',cRoot)
*/	}
	
	NOID(cClone);

	_parentEl.appendChild(cClone);

	return cRoot;
}

DataUINote.prototype.shadow= function () {
	var sFract= 1;

	var sibPUB= this.UI.rootNdata.sibling().PUB;
	for (var iD in sibPUB.UI.rootNdata) break;
	if (iD && sibPUB.rights>NOTA_RIGHTS.INIT && sibPUB.style.main.a){
//todo: get first element in better manner
		var sibData= sibPUB.UI.rootNdata[iD];

		var sFract= (new Date()-sibData.stamp)/(TIMER_LENGTH.MONTH*1000);
		sFract= sFract>1? 1 : sFract;
		sFract= Math.pow(sFract,STYLE.NOTESHADOW_DECAY_EXP);

		this.DOM.shadow.style.top= (sFract*STYLE.NOTESHADOW_TOP_RATE +STYLE.NOTESHADOW_INIT_OFFSET) +'px';
		this.DOM.shadow.style.bottom= -(sFract*STYLE.NOTESHADOW_BOTTOM_RATE +STYLE.NOTESHADOW_INIT_OFFSET)+'px';
		this.DOM.shadow.style.left= (sFract*STYLE.NOTESHADOW_LEFT_RATE +STYLE.NOTESHADOW_INIT_OFFSET) +'px';
		this.DOM.shadow.style.right= -(sFract*STYLE.NOTESHADOW_RIGHT_RATE +STYLE.NOTESHADOW_INIT_OFFSET) +'px';
		this.DOM.shadow.style.opacity= STYLE.NOTESHADOW_OPACITY_MAX*(1-sFract);
	}

	this.DOM.shadow.style.display= sFract==1? 'none' :'';
}

DataUINote.prototype.sign= function () {
	var sibParent= this.UI.rootNdata.sibling().inherit();
	var sibPUB= this.UI.rootNdata.sibling().PUB;
//todo: get first element in better manner
	for (var io in sibPUB.UI.rootNdata) break;
	var sibData= sibPUB.UI.rootNdata[io];

	if (sibPUB.style.main.a){
//todo: manage ref for restricted note
		if (sibPUB.rights==NOTA_RIGHTS.INIT) {
			this.DOM.ref.elementText(SESSION.owner().name);
			this.DOM.ref.style.display= '';
			return;
		}

		var okRef=
		  sibParent && (sibParent!= this.UI.rootNdata.rootNote);
//???4 times
		this.DOM.ref.elementText(
			okRef? sibParent.PUB.name :''
		);
		this.DOM.ref.style.display=
		  okRef? '':'none';

		var okSign=
		  sibData && sibParent && sibData.editorId!=sibParent.PUB.ownerId;
		this.DOM.sign.elementText(
			okSign? (
				(!sibData.editor() || sibData.editor().uname=='')?
				  DIC.stampSomebody
				  : sibData.editor().uname
			) :''
		);
		this.DOM.sign.style.display=
		  okSign? '':'none';

		this.DOM.mark.style.display=
		  (
		  	this.UI.rootNdata.forSave!=SAVE_STATES.IDLE
		  	|| sibPUB.forSave!=SAVE_STATES.IDLE
		  )? '': 'none';
	}

	this.signStamp();
}

DataUINote.prototype.signStamp= function(){
	clearTimeout(this.stampTimeout);

	var sibParent= this.UI.rootNdata.sibling().inherit();
	var sibPUB= this.UI.rootNdata.sibling().PUB;
//todo: get first element in better manner
	for (var iD in sibPUB.UI.rootNdata) break;

	if (!iD || !sibPUB.style.main.a)
	  return;

	var sibData= sibPUB.UI.rootNdata[iD];
	var okSign= sibParent && sibData.editorId!=sibParent.PUB.ownerId;

	var stamp= stampDiff(sibData? sibData.stamp :sibPUB.stamp,TIMER_LENGTH.MONTH*2);
	this.DOM.stamp.elementText(
		((okSign && okSign!='')? ', ': '') +stamp.stamp
	);
	this.DOM.stamp.style.display=
	  stamp.stamp!=''? '':'none';

	this.shadow();

	if (stamp.delay==0)
	  return;

	var _this= this;
	this.stampTimeout= setTimeout(function(){
		_this.signStamp();
	}, stamp.delay*1000);
}





DataUINote.prototype.bindEvt= function(){
	var _this= this;
	var rts= this.UI.rootNdata.rootNote.PUB.rights;

//todo: different behaviors for different user rights

//todo: dont allow to react with implicit referers
 	if (rts>= NOTA_RIGHTS.RO){
		this.DOM.plate.onmouseover= function(){_this.mouseOver()};
		this.DOM.plate.onmouseout= function(){_this.mouseOut()};
//todo: replace with mouseContext
		this.DOM.plate.onmouseup= function(e){e.toolFlag=1; _this.toolShow(1)};
	}

}






////interaction

DataUINote.prototype.mouseOver= function(){
	//switch previous hilite off instantly
	var prevHilite= this.UI.rootUI.lastHilite;
	if (prevHilite && prevHilite!=this){
		clearTimeout(prevHilite.captionTimeout);
		prevHilite.hiliteSet();
	}

	clearTimeout(this.captionTimeout);

	this.actualMouseOver= 1;
	this.hiliteSet();

	this.UI.rootUI.lastHilite= this;
}
DataUINote.prototype.mouseOut= function(){
	clearTimeout(this.captionTimeout);

	var _this= this;
	this.actualMouseOver= 0;
	this.captionTimeout=
	  setTimeout(function(){_this.hiliteSet()},TIMER_LENGTH.LEAF_FADEOUT);
}


//todo: constantly review rights effects
DataUINote.prototype.hiliteSet= function(){
	var mouseState= this.actualMouseOver;
	var _this= this;

	setTimeout(function(){ //small trail
		_this.DOM.root.style.borderColor=
		  _this.actualMouseOver? _this.UI.rootNdata.rootNote.PUB.style.borderActive.hex():'';
		_this.DOM.sign.style.color=
		  _this.DOM.stamp.style.color=
		  _this.DOM.ref.style.color=
		  _this.actualMouseOver? _this.UI.rootNdata.rootNote.PUB.style.signActive.hex():'';
	}, mouseState? 0:TIMER_LENGTH.LEAF_FADETRAIL);

	if (IS.hover){
		clearTimeout(this.hoverToolTimeout);
		if (mouseState){
			this.hoverToolTimeout= setTimeout(function(){ //
				_this.toolShow(1);
			}, TIMER_LENGTH.TOOLFADEIN_DELAY);
		} else {
			this.hoverToolTimeout= null;
			_this.toolShow();
		}
	}
}


DataUINote.prototype.toolShow= function(_show){
	if (_show && UI.mouseButton!=-1)
	  return;
	if (UI.toolSet.tool && UI.toolSet.tool.sticky)
	  return;

	if (_show){
		if (!UI.toolSet.tool || this.tool!=UI.toolSet.tool)
		  this.tool= UI.toolSet.make(ToolBoardLeaf,this.DOM.tool,this.UI.rootNdata);
	} else {
		UI.toolSet.kill(this.tool);
		this.tool= null;
	}

//+++constant
	this.DOM.root.style.zIndex= _show?2:'';
}

DataUINote.prototype.toolShowEdit= function(){
	var rRoot= this.UI.rootNdata.rootNote.PUB.rights;
	var rNote= this.UI.rootNdata.sibling().PUB.rights;
	if (rRoot || rNote)
	  this.tool= UI.toolSet.make(ToolBoardLeafEdit,this.DOM.tool,this.UI.rootNdata);
}

DataUINote.prototype.unbind= function(){
	clearTimeout(this.stampTimeout);

	this.DOM.plate.onmouseover=
	 this.DOM.plate.onmouseout=
	 this.DOM.plate.onmouseup= undefined;

	this.DOM.root.style.opacity= .33;
}

DataUINote.prototype.kill= function(){
}
/*
UI has
  explicit:
	- User login area
	- Logged User tools
	- Contacts list
	- Board area
	- Target User tools (relations, boardlist)
	- Board tools (make, del, rights)
	- Overview
  implicits:
	- Contacts users
	- Notes
	- Note's assigned users

  which are updated by callbacks from:
	- Board update
	- Notes update
	- UI xform
	- Self info
	- Cookie managing
	- Users/contacts change
*/

var UI= new function(){

//UI.updated;
//todo: should be called only when Board is changed or it changes implicit state
this.drawWindow= function(){
	this.DOM.toolbar.style.display= (this.embed? 'none' : '');


	var _owner= SESSION.owner();
	if (_owner && _owner.forRedraw){
		UI.youW.DOM.bar.style.display= (!_owner.id? 'none': '');
		UI.loginW.DOM.bar.style.display= (_owner.id? 'none' : '');
	}
}


//display update state
this.drawState= function(_state, _msgVerb){
	var stateMsg= '';
	var newColor='';
	switch (_state) {
		case UPDATE_STATE.UPDATE:
			newColor= CSS.UPDATEMARKER_UPDATE;
			stateMsg= DIC.popStateUpdating;
			break;
		case UPDATE_STATE.ERROR:
			newColor= CSS.UPDATEMARKER_ERROR;
			stateMsg= DIC.popStateError;
			break;
		case UPDATE_STATE.STOP:
			newColor= CSS.UPDATEMARKER_STOP;
			stateMsg= DIC.popStateStop;
			break;
		case UPDATE_STATE.NORMAL:
			stateMsg= DIC.popStateOkay;
	}
	this.popW.tipSet(
		stateMsg +(
			(!NOPROFILE && _msgVerb && _msgVerb!='')?
			_msgVerb.decorateHTML(STR.DIV |STR.ITALIC |STR.QUOTE,75,[96,96,192])
			:''
		)
	);

	var _this= this;
	setTimeout(
		function(){
			_this.logoW.draw(new Color(newColor))
		}, _state==UPDATE_STATE.NORMAL? TIMER_LENGTH.LOGO2NORMAL_DELAY:0 //normal state is delayed for avoid too fast responce
	);
}





//Globally change style
this.style= function(){
	var style= SESSION.board.PUB.style;

	this.DOM.toolbar.style.backgroundColor= style.mainDark.hex('');
	
//todo: style out everything else
}



this.freeze= function(_mode){
	this.DOM.body.style.cursor= _mode?STYLE.CURSOR_MOVE:'';

//	STYLES.freezein.display= _mode?'':'none'; //cover with lids globally
//	STYLES.freezeout.display= _mode?'none':''; //hide globally

	if (_mode){
		if (WINDOW.getSelection)
		  WINDOW.getSelection().removeAllRanges();
		else if (DOCUMENT.selection)
		  DOCUMENT.selection.clear();
  	}

	DOCUMENT.onselectstart= function(){return _mode};
}


//get and store fps tick counter every second
this.fpsTick= function(){
	if (this._fpsTick>this.fps)
	  this.fps= this._fpsTick;
	this._fpsTick=0;
	var _this= this;
	clearTimeout(this._fpsTickTimeout);
	this._fpsTickTimeout= setTimeout(function(){_this.fpsTick()},1000);
}

//switch to global context using mouse -move and -out functions. Should be called within mouseover
//todo: monitor noBubbles() behavior
this.mouseContext= function(_e,_that,_fnDown,_fnMove,_fnUp,_gap){
	_e= _e||WINDOW.event;
	if (_e.button>0)
	  return;
	this.fpsTick();

/* original no-gap behaviour
	_this.mouseX= _e.clientX;
	_this.mouseY= _e.clientY;
	_this.freeze(1);
*/
	var _this= this;
	if (_fnMove)
	  this.DOM.body.onmousemove= function(_e2){
		_e2= _e2||WINDOW.event;
		_this._fpsTick+= 1;

		if (!_this.moved){ //called really once at gap broke
			_this.moved=
			 (Math.pow(_this.mouseX-_e2.clientX, 2) +Math.pow(_this.mouseY-_e2.clientY, 2))
			 >((_gap|0)*(_gap|0)); //^2 px radius
//new-style gap behavior in
			if (_this.moved){
				if (_gap>0 && _fnDown)
				  _fnDown.call(_that,_e2);

				_this.mouseX= _e2.clientX;
				_this.mouseY= _e2.clientY;
				_this.freeze(1);
				if
				 (_this.mouseButton==-1) //initial move
				  _this.mouseButton= _e2.button;
			}
//new-style gap behavior in
		}

		if (_this.moved && _fnMove)
		  _fnMove.call(_that,_e2)
	  };
	  this.DOM.body.onmouseup= function(_e2){
		_this.mouseContextRelease(_e2);
		if (_fnUp)
		  _fnUp.call(_that,_e2||WINDOW.event);
	  };

//original no-gap behaviour
//	if (_fnDown)
	if (!_gap && _fnDown)
	  _fnDown.call(_that,_e);

	noBubbles(_e);
	_e.preventDefault();
}

////private
this.mouseContextRelease= function(_e){
	this.DOM.body.onmousedown=
	 this.DOM.body.onmouseup=
	 null;
	this.DOM.body.onmousemove= this.mouseContextNop;

	this.moved= false;
	this.mouseButton= -1;
	this.freeze(0);
}

this.mouseContextNop= function(_e){
	_e= _e||WINDOW.event;
	UI.mouseX= _e.clientX;
	UI.mouseY= _e.clientY;
}


this.bindEvt= function(){
	this.DOM.body.onmousemove= this.mouseContextNop;
}

this.bindDeep= function(_scrollFn, _resizeFn){
	if (_scrollFn)
	  WINDOW.onscroll= _scrollFn;
	if (_resizeFn)
	  WINDOW.onresize= _resizeFn;
}

this.embed=	0;
this.perfLevel= PERF.LEVEL;

//operating
this.mouseButton= -1;
this.mouseX= null;
this.mouseY= null;
this.moved= false;

//state
this._fpsTickTimeout= null;
this._fpsTick= 0; //self profiling
this.fps= 0;


this.DOM= {
	body: DOCUMENT.bodyEl,
	toolbar: DOM('workToolbar'),

	workField: DOM('workField')
};


this.bindEvt();

}


UI.loginW= new function(){

//minimal validation, to unload server abit
this.validateUname= function(){
	var username= this.DOM.uname.value.trim();
	if (username.length>1)
	  return username;
}

this.validatePass= function(){
	var password= this.DOM.pass.value;
	if (password.length>0)
	  return password;
}

this.registerCheck= function(){
	this.DOM.regUName.elementText(this.DOM.uname.value);
	this.DOM.regPass.value= '';
	var _this= this;
	UI.popW.up(this.DOM.reg,
		function(){
			if (_this.DOM.regPass.value==_this.DOM.pass.value)
			  _this.login(true);
			else
			  setTimeout(function(){UI.popW.up(DIC.errrPrePassMismatch)},0);
		},
		null,
		"regPass"
	);
}

this.login= function(_doRegister){
	var username= this.validateUname();
	if (!username){
		UI.popW.up(DIC.errrPreNoUsername);
		return;
	}
	var password= this.validatePass();
	if (!password){
		UI.popW.up(DIC.errrPreNoPassword);
		return;
	}
	SESSION.logon.login(
		_doRegister? SESSION_STATES.REGISTER : SESSION_STATES.LOGIN,
		username,
		password
	);
};

//this validate is called delayed for keypress, to have current field values
//server validate is actually called one per <time>
this.validateLogin= function(){
	if (this.validateTimeout!=undefined)
	  return;

	var _this= this;
	this.validateTimeout= setTimeout(function(){
		var username= _this.validateUname();
		var password= _this.validatePass();
		_this.DOM.unameCover.style.color= password? CSS.FIELD_REQUIRED_HILITE:'';
		_this.DOM.passCover.style.color= username? CSS.FIELD_REQUIRED_HILITE:'';
		_this.DOM.submit.disabled= (!username || !password)? 'disabled':'';
		SESSION.logon.login(SESSION_STATES.VALIDATE,username);
		_this.validateTimeout= undefined;
	},TIMER_LENGTH.VALIDATE_DELAY);
};


this.bindEvt= function(){
	var _this= this;
	this.DOM.form.onsubmit= function(){
		_this.login();
		return false;
	};

	this.DOM.uname.onkeypress= this.DOM.uname.onkeyup= function(_e){
	 	_this.DOM.unameCover.style.display= (eKeyCode(_e)>=28 || this.value!='')? 'none' :'';

		_this.validateLogin();
	};
	this.DOM.unameCover.onclick= function(){_this.DOM.uname.focus()};
	
	this.DOM.pass.onkeypress= this.DOM.pass.onkeyup= function(_e){
	 	_this.DOM.passCover.style.display= (eKeyCode(_e)>=28 || this.value!='')? 'none' :'';

		_this.validateLogin();
	};
	this.DOM.passCover.onclick= function(){_this.DOM.pass.focus()};

	setTimeout(function(){_this.DOM.uname.onkeypress(); _this.DOM.pass.onkeypress();},TIMER_LENGTH.LOGPASS_FIX_DELAY);
}


////DOM
this.DOM= {
	bar: DOM('barLogon'),

	form: DOM('logForm'),
	submit: DOM('logSubmit'),
	uname: DOM('logUname'),
	unameCover: DOM('logUnameCover'),
	pass: DOM('logPass'),
	passCover: DOM('logPassCover'),

	reg: DOM('regTmpl')
};

this.DOM.regUName= DOM('regUname', this.DOM.reg);
this.DOM.regPass= DOM('regPass', this.DOM.reg);

this.bindEvt();

}
UI.youW= new function(){

this.logout= function(){
	SESSION.logon.login(SESSION_STATES.LOGOUT);
};

//todo: feature: if staying after being logged in for a while, ask pass again 
this.stayLogged= function(_tryStay){
	var _this= this;
	if (_tryStay){ //confirm staying
		UI.popW.up(
			DIC.popStayConfirm
			,function(){SESSION.logon.login(SESSION_STATES.STAY)}
			,function(){_this.DOM.stay.checked= 0}
		);
	} else //instant off
	  SESSION.logon.login(SESSION_STATES.LEAVE);
};


//SESSION.owner().updated
this.draw= function(){
	var _owner= SESSION.owner();
	if (!_owner || !_owner.forRedraw)
	  return;

	this.DOM.self.elementText(_owner.uname);

	//contactsNum - off
//todo: move contact board to contact object

/*
//contactlist
	DOM//todo.contactsContent.innerHTML= "";

//todo: contactlist updated
//todo: library
	var cBlockIn= this.cListAddBlock(2,DIC.contWaitingYou);
	var cBlockOut= this.cListAddBlock(1,DIC.contYouWait);
	var cBlockNorm= this.cListAddBlock(0,DIC.contLab);

	if (cBlockIn.children.length>0)
	  DOM//todo.contactsContent.appendChild(cBlockIn);
	if (cBlockOut.children.length>0)
	  DOM//todo.contactsContent.appendChild(cBlockOut);
	if (cBlockNorm.children.length>0)
	  DOM//todo.contactsContent.appendChild(cBlockNorm);

	DOM//todo.notifyContactsLab.innerHTML= (cBlockNorm.children.length==0 ?"No" :cBlockNorm.children.length);
	DOM//todo.notifyContactReqsLab.innerHTML= (cBlockIn.children.length==0 ?"" :"+"+cBlockIn.children.length);
	DOM//todo.notifyContactReqsLab.style.display= (cBlockIn.children.length==0 ?"none" :"");

//todo: user's (hidden) boardlist updated
	var bs= DOM//todo.tempUserBoardsList;
	while (bs.childNodes.length>0)
	  bs.removeChild(bs.childNodes[0])
	for (var ib in _owner.boards){
		var bsItem= DOCUMENT.createElement("option");
		  bsItem.value= _owner.boards[ib].id;
		  bsItem.innerHTML= _owner.boards[ib].name;
		bs.appendChild(bsItem);
	}

*/

ALERT(PROFILE.BREEF, "You draw",'',1);
}

//draw contact Block
/*
UI.cListAddBlock= function(relation,blockName){
	var _owner= SESSION.owner();

	var _tmpBin= DOCUMENT.createElement("div");
	  _tmpBin.innerHTML= blockName;
	for (var iu in _owner.contacts){
		var addUser= _owner.contacts[iu];
		if (addUser.relation==relation){
			var _tmpe= _tmpBin.appendChild(DOCUMENT.createElement("div"));
			  _tmpe.className= "toolWidget"; //contactItemUser
			var _tmpx= _tmpe.appendChild(DOCUMENT.createElement("a"));
			  _tmpx.innerHTML= addUser.name+ (addUser.relation!=USER_RELATION.NORMAL ?"..." :"");
			  _tmpx.href= "/" +addUser.name;

			if (addUser.relation==USER_RELATION.NEUTRAL || addUser.relation==USER_RELATION.IN) {
				_tmpx= _tmpe.appendChild(DOCUMENT.createElement("span")); //
				  _tmpx.className= "knobAdd";
				  _tmpx.innerHTML= "+";
				  _tmpx.onclick= function(){contactMake(addUser.id,1)};
			}

			if (
				addUser.relation==USER_RELATION.NORMAL
				|| addUser.relation==USER_RELATION.IN
				|| addUser.relation==USER_RELATION.OUT
			){
				_tmpx= _tmpe.appendChild(DOCUMENT.createElement("span")); //
				  _tmpx.className= "knobDel";
				  _tmpx.innerHTML= "-";
				  _tmpx.onclick= function(){contactMake(addUser.id,-1)};
			}
		}
	}
	return _tmpBin;
}
*/

this.bindEvt= function(){
	var _this= this;
	this.DOM.out.onclick= function(e){
		_this.logout();
	};
	this.DOM.stay.onchange= function(){
		_this.stayLogged(this.checked);
	};
	this.DOM.stayLab.onclick= function(){
		_this.DOM.stay.click();
	};

//todo:
	//this.DOM.self.onClick=?
}


this.validateTimeout= null;


this.DOM= {
	bar: DOM('barUser'),

	self: DOM('barUserSelf'),
	out: DOM('youOut'),

	stay: DOM('youStay'),
	stayLab: DOM('youStayLab')
};

this.bindEvt();

}
UI.ownerW= new function(){

this.draw= function(_noteIn){
	var ownerIn= _noteIn.owner();

	DOCUMENT.title= DIC.labTitle +(!ownerIn.id? '' : (' - ' +ownerIn.uname +(_noteIn.PUB.name!=''? (', ' +_noteIn.PUB.name) : '')));
	this.DOM.bar.style.display= (!ownerIn.id? 'none' : '');
//todo: improve: move to unified contact drawing (minimized/normal)
	  this.DOM.whoName.elementText(ownerIn.uname);
	  this.DOM.whoAdd.style.display= (
		ownerIn.relation == USER_RELATION.NEUTRAL
		|| ownerIn.relation == USER_RELATION.IN
		? '' :'none'
	  );
	  this.DOM.whoDel.style.display= (
		ownerIn.relation == USER_RELATION.NORMAL
		|| ownerIn.relation == USER_RELATION.OUT
		|| ownerIn.relation == USER_RELATION.IN
		? '' : 'none'
	  );
	this.DOM.toolbar.style.display= (_noteIn.PUB.rights != NOTA_RIGHTS.OWN? 'none' :'');

ALERT(PROFILE.BREEF, "Owner draw",'',1);
}

this.drawBRight= function(_right){
	this.DOM.notifyRight.elementText(RES_BOARDRIGHTS[_right+1]);
}

this.bindEvt= function(){
//todo: contacts minimal ON
	this.DOM.whoAdd.onclick= function(){
	//	contactMake(SESSION.ownerId,1);
	};
	this.DOM.whoDel.onclick= function(){
	//	contactMake(SESSION.ownerId,-1);
	};
}


////DOM
this.DOM= {
	bar: DOM('barBoardOwner'),
	whoName: DOM('idWhoName'),
	whoAdd: DOM('idWhoAdd'),
	whoDel: DOM('idWhoDel'),

	toolbar: DOM('barBoardTools'),
	notifyRight: DOM('boardNotifyRight')
};

this.bindEvt();

}
//todo: make class with ownerW.boardlistW instance
UI.ownerW.boardlistW= new function(){

//todo: draw incremental (sure?)
this.draw= function(_noteIn){
	var boardListA= _noteIn.owner().boards();
	
	var bs= this.DOM.selector;
	while (bs.childNodes.length>0)
	  bs.removeChild(bs.childNodes[0])
	for (var iN in boardListA){
		var bsItem= DOCUMENT.createElement('option');
		  bsItem.value= boardListA[iN].PUB.id;
		  bsItem.elementText(boardListA[iN].PUB.name);
		  if (boardListA[iN].PUB.id==_noteIn.PUB.id)
		    bsItem.selected= 'selected';
		bs.appendChild(bsItem);
	}

	if (_noteIn.PUB.id<0){
		var bsItem= DOCUMENT.createElement('option');
		  bsItem.value= '';
		  bsItem.elementText('');
		  bsItem.selected= 'selected';
		bs.appendChild(bsItem);
	}
}


this.bindEvt= function(){
	this.DOM.selector.onchange= function(){
		SESSION.reload(SESSION.reqWho, this.children[this.selectedIndex].elementText());
	};
}

////DOM
this.DOM= {
	selector: DOM('boardSwitch')
};

this.bindEvt();

}
//todo: change to tools context
UI.boardToolsW= new function(){

this.bindEvt= function(){
	var _this= this;

	this.DOM.boardCreate.onchange= function(){
		//validate
		var newName= this.value;
		for(var iN in Ncore.all())
			if (Ncore.all(iN).PUB.name == newName)
//todo: ask to switch
		    	return;

		//create
		var newNote= new Ncore();
		newNote.save({name:newName}, function(_res){
			SESSION.owner().set({boardList:SESSION.owner().boardIds.concat([_res])});
			SESSION.reload(SESSION.reqWho,newName)
		}, true);
	};

}

this.DOM= {
	bar: DOM('barBoardTools'),

	boardCreate: DOM('boardCreate')
};

this.bindEvt();


}
UI.logoW= new function(){

this.draw= function(_newColor){
	this.DOM.logo.style.backgroundColor= _newColor.hex();
}

this.bindEvt= function(){
	var _this= this;
	this.DOM.logo.onmouseover= function(){
		_this.tipTimeout= setTimeout(
	  		function(){UI.popW.tip();}
	  		, TIMER_LENGTH.LOGO_DELAY
	  	);
	};

	this.DOM.logo.onmouseout= function(){
		clearTimeout(_this.tipTimeout);
	};
}


this.tipTimeout= null;

this.DOM= {
	logo: DOM('notaLogo')
};

this.bindEvt();

}
//todo: dynamically create instead of reuse
//		- decide how to (re)use cover
//		- check use of tipSet
//		- as created with constructor, rearrange arguments
//			ex:(_msg,{okCode:{},noCode:{},focusOn:'',isTip:bool})
//		- formalize Bar logic
//		- deal with previously focused elements

UI.popW= new function(){

this.tip= function(_src){
	this.up(this.tipMsg);
	this.DOM.upBar.style.display= 'none';
	this.DOM.upWindow.style.left= (
		UI.mouseX>STYLE.TIP_PREPOSITION?UI.mouseX-STYLE.TIP_PREPOSITION:0
	) +'px';
	this.DOM.upWindow.style.top= (
		UI.mouseY>STYLE.TIP_PREPOSITION?UI.mouseY-STYLE.TIP_PREPOSITION:0
	) +'px';

	this.isTool= 1;
	if (_src)
	  tipSet(_src);
}

this.tipSet= function(_src){
	this.tipMsg= _src;

//todo: change to lazy
	if (this.tipMsgTimeout)
	  clearTimeout(this.tipMsgTimeout);
	var _this= this;
	this.tipMsgTimeout= setTimeout( function(){
		if (_this.isTool){
//todo: remove duplicate 1
			if (_src instanceof Array)
			  var putTxt= _src[0].subst(_src, 1);
			else
			  var putTxt= _src;
			_this.DOM.upContent.elementText(putTxt.split("\n").join('<br>'),true);
		}
	}, TIMER_LENGTH.TIP_DELAY);
}

//todo: alternative buttons
/*
	src can be:
		text 			just inlined
		[text,v1,...] 	text's '$' substituted by v1 etc.
		HTMLElement 	inlined
*/
this.up= function(_src,_okCode,_notCode,_focusOn){
	this.isTool= 0;
	this.focus= DOCUMENT.activeElement;

	while (this.DOM.upContent.firstChild)
      this.DOM.upContent.removeChild(this.DOM.upContent.firstChild);
	if (IS.instance(_src,HTMLElement))
	  this.DOM.upContent.appendChild(_src);
	else {
//todo: remove duplicate 2
		if (_src instanceof Array)
		  var putTxt= _src[0].subst(_src, 1);
		else
		  var putTxt= _src;
		this.DOM.upContent.elementText(putTxt.split("\n").join('<br>'),true);
	}

	this.okCode= IS.fn(_okCode)? _okCode :undefined;
	this.notCode= IS.fn(_notCode)? _notCode :undefined;
	this.DOM.ok.style.display= (!_okCode? 'none':'');

	this.DOM.upCover.style.display= '';
	this.DOM.upWindow.style.display= '';
	this.DOM.upWindow.style.left= this.DOM.upCover.offsetWidth/2 -this.DOM.upWindow.offsetWidth/2 +'px';
	this.DOM.upWindow.style.top= this.DOM.upCover.offsetHeight/2 -this.DOM.upWindow.offsetHeight/2 +'px';
    this.DOM.upBar.style.display= '';

	if (_focusOn){
		DOM(_focusOn,this.DOM.upContent).focus();
		return;
	}

	if (_okCode)
	  this.DOM.ok.focus();
	else
	  this.DOM.no.focus();
}

this.down= function(_skipNotCode){
	this.DOM.upCover.style.display='none';
	this.DOM.upWindow.style.display= 'none';

	if (this.notCode && !_skipNotCode)
	  this.notCode();
	this.notCode= undefined;
	this.focus.focus();
}


this.bindEvt= function(){
	var _this= this;
	this.DOM.upWindow.onsubmit= //try submit
	  function(){_this.okCode();_this.down(1);return false;};
	this.DOM.upWindow.onkeypress= //ESC filter to close
	  function(_e){if(eKeyCode(_e)==27) _this.down();};
	this.DOM.upWindow.onreset= //cancel
	  function(){_this.down()};
//reserve: switch on if still blinking
//	this.DOM.upCover.onmouseover=
//	  function(){_this.lockTool= 1};
//	this.DOM.upCover.onmouseout=
//	  function(){_this.lockTool= 0};
	this.DOM.upCover.onmouseover= //tip mouseout to close
	  function(){
	  	setTimeout(function(){
	  		if (_this.isTool && !_this.lockTool) _this.down();
	    }, TIMER_LENGTH.TIP_DELAY)
	  };
	this.DOM.upCover.onclick= //click outside popup to close
	  function(){_this.down()};
}

this.focus= null;
this.notCode= null;
this.okCode= null;
this.isTool= 0;
this.lockTool= 0;
this.tipMsg= '';
this.tipMsgTimeout= null;


this.DOM= {
	upCover: DOM('popUpCover'),
	upWindow: DOM('popUpWindow'),
	upContent: DOM('popUpContent'),
	upBar: DOM('popUpBar'),
	ok: DOM('popOk'),
	no: DOM('popNo')
};

this.bindEvt();

}
/*
	color picker

	.show((bool)isPop,(fn)cb) shows Palette;
	If isPop, palette is shown with pop.up() and cb(style) is
	 passed as okCode.
	Else Palette is only inited and its instance is returned to
	 parent elsewhere.
*/
UI.paletteW= new function(){

this.show= function(_isPop,_cb){
	this.DOM.paletteSample.style.background= this.style.main.hex();

	var _this= this;

	var okCode= function(){
		  _cb(_this.style)
	};
	if (_isPop)
	  UI.popW.up(this.DOM.palette, IS.fn(_cb)? okCode :undefined);

	return this.DOM.palette;
}


this.bindEvt= function(){
	var _this= this;
	this.DOM.paletteSample.onclick= function(){
		_this.style= new Style(
			new Color([
				Math.random()*255,
				Math.random()*255,
				Math.random()*255
			]).hex()
		);
		_this.DOM.paletteSample.style.background= _this.style.main.hex();
	}

}


this.style= new Style('#888');


this.DOM= {
	palette: DOM('palette'),
	paletteSample: DOM('paletteSample')
};

this.bindEvt();
}
/*
	toolSet mantains the only visible tool within several conexts and tool templates
*/
UI.toolSet= new function(){


this.tool= null; //current and only

this.make= function(_template,_rootW,_entity){
	this.kill();
	if (UI.mouseButton!=-1)
	  return;

	this.tool= new _template(_rootW,_entity);
	if (this.tool.DOM && UI.mouseX!==null && UI.mouseY!==null){
		this.tool.DOM.root.style.left= UI.mouseX +"px";
		this.tool.DOM.root.style.top= UI.mouseY +"px";
	}

	return this.tool;
}

this.kill= function(_focus){
	if (_focus && _focus!=this.tool)
	  return;

	if (this.tool)
	  this.tool.kill();
	this.tool= null;
}


}
var ToolBoardLeaf= function(_rootW,_ndata){
	var _this= this;

	_this.rootW= _rootW;
	_this.ndata= _ndata;

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();
}

ToolBoardLeaf.prototype.bindEvt= function(){
	var _this= this;

	this.DOM.context.onmousedown= noBubbles;

	this.DOM.tDel.onmouseup= function(){_this.opDel()};
	this.DOM.tMove.onmousedown= function(_e){UI.mouseContext(_e,_this,_this.mouseDown,_this.mouseMove,_this.opMouseUp)};
	this.DOM.tInner.onmouseup= function(){_this.opInnerTool()};
}

ToolBoardLeaf.tmpl= DOM('toolBLeafTmpl')
ToolBoardLeaf.prototype.build= function(_parentEl){
	var cClone= ToolBoardLeaf.tmpl.cloneNode(true);
	var cRoot= {
		root: cClone,
		context: DOM('toolBLeafContext',cClone),

		tOuter: DOM('toolBLeafOuter',cClone),
		tDel: DOM('toolBLeafDelete',cClone),
		tMove: DOM('toolBLeafEditMove',cClone),

		tInner: DOM('toolBLeafInner',cClone)
	};
	NOID(cClone);

//tmp
	cRoot.tInner.elementText('Leaf ' +this.ndata.id);

	_parentEl.appendChild(cClone);

	cRoot.context.focus(); //focus prior to set size to allow in-transition
	var ctx= cRoot.context.style;
//todo: classname
	  ctx.top= '-30px';
	  ctx.left= '-30px';
	  ctx.width= '200px';
	  ctx.height= '24px';
	  ctx.padding= '14px';
	  ctx.borderColor= '#aad';

	return cRoot;
}

ToolBoardLeaf.prototype.kill= function(){
	var ctx= this.DOM.context.style;
//todo: classname
	  ctx.top= '';
	  ctx.left= '';
	  ctx.width= '';
	  ctx.height= '';
	  ctx.padding= '';
	  ctx.borderColor= '';

	var _this= this;
	setTimeout(function(){
	  _this.rootW.removeChild(_this.DOM.root);
	}, CSS.TOOL_TRANSITIONTIME*1000);
}


ToolBoardLeaf.prototype.mouseDown= function(_e){
	this.mouseHit= {
		x: this.ndata.ui.DOM.root.offsetLeft -_e.clientX,
		y: this.ndata.ui.DOM.root.offsetTop -_e.clientY,
//todo: remove
		toolx: this.DOM.root.offsetLeft -_e.clientX,
		tooly: this.DOM.root.offsetTop -_e.clientY
	}

}
ToolBoardLeaf.prototype.mouseMove= function(_e){
	this.ndata.ui.DOM.root.style.left= this.mouseHit.x +_e.clientX +'px';
	this.ndata.ui.DOM.root.style.top= this.mouseHit.y +_e.clientY +'px';
//todo:remove
	this.DOM.root.style.left= this.mouseHit.toolx +_e.clientX +'px';
	this.DOM.root.style.top= this.mouseHit.tooly +_e.clientY +'px';
}
ToolBoardLeaf.prototype.opMouseUp= function(){
	this.ndata.save({place:{
		x:this.ndata.ui.DOM.root.offsetLeft,
		y:this.ndata.ui.DOM.root.offsetTop
	}});
	SESSION.board.uiA[0].nFrontUI.correct(1);
}

ToolBoardLeaf.prototype.opInnerTool= function(){
	var _this= this;
	setTimeout(function(){
		_this.ndata.ui.toolShowEdit();
	},0);
}


ToolBoardLeaf.prototype.opDefault= function(){
	var _this= this;
	setTimeout(function(){
		UI.toolSet.kill(_this)
	},0);
}

ToolBoardLeaf.prototype.opDel= function() {
	UI.popW.up(DIC.popEditRemove,function(){
		this.ndata.save({del:true});
		this.opDefault();
	}.bind(this));
}
var ToolBoardLeafEdit= function(_rootW,_ndata){
	var _this= this;

	_this.sticky= 1; //static
	_this.rootW= _rootW;
	_this.ndata= _ndata;

	_this.mouseHit= null;
	_this.shadow= null;
	_this.canceled= 0;


	_this.DOM= _this.build(_rootW);
	_this.bindEvt();
}

ToolBoardLeafEdit.prototype.bindEvt= function(){
	var _this= this;
	this.DOM.context.onmousedown= noBubbles;

	this.DOM.tStyle.onmouseup= function(_e){_this.opStyle(_e)};
	this.DOM.tNewData.onmouseup= function(){_this.opNewData()};
}


ToolBoardLeafEdit.tmpl= DOM('toolBLeafEditTmpl')
ToolBoardLeafEdit.prototype.build= function(_parentEl){
	var cClone= ToolBoardLeafEdit.tmpl.cloneNode(true);
	var cRoot= {
		root: cClone,
		context: DOM('toolBLeafEditContext',cClone),

		tOuter: DOM('toolBLeafEditOuter',cClone),
		tNewData: DOM('toolBLeafNewData',cClone),

		tInner: DOM('toolBLeafEditInner',cClone),
		tStyleSample: DOM('toolBLeafEditStyleSample',cClone),
		tStyle: DOM('toolBLeafEditStyle',cClone)
	};
	NOID(cClone);

	cRoot.tStyleSample.appendChild(UI.paletteW.show());
	this.assignRights(cRoot);
	
	_parentEl.appendChild(cClone);

	cRoot.context.focus();
	var ctx= cRoot.context.style;
//+++classname
	  ctx.top= '-30px';
	  ctx.left= '-30px';
	  ctx.width= '200px';
	  ctx.height= '24px';
	  ctx.padding= '14px';
	  ctx.borderColor= '#aad';

	return cRoot;
}

ToolBoardLeafEdit.prototype.assignRights= function(_DOM){
	var contentNote= this.ndata.sibling();

	var rRoot= this.ndata.rootNote.PUB.rights;
	var rNote= contentNote? contentNote.PUB.rights :null;

	_DOM.tOuter.style.display= rRoot<NOTA_RIGHTS.RW? 'none' :'';
	_DOM.tInner.style.display= rNote<NOTA_RIGHTS.RW? 'none' :'';
	if (rNote>=NOTA_RIGHTS.RW)
	  this.editMode(1);
}

ToolBoardLeafEdit.prototype.kill= function(){
	if (!this.DOM)
	  return;

	var ctx= this.DOM.context.style;
//+++classname
	  ctx.top= '';
	  ctx.left= '';
	  ctx.width= '';
	  ctx.height= '';
	  ctx.padding= '';
	  ctx.borderColor= '';

	this.editMode(0);

	var _this= this;
	setTimeout(function(){
	  _this.rootW.removeChild(_this.DOM.root);
	},CSS.TOOL_TRANSITIONTIME*1000);
}



//calls data save indirectly, from self destructor (default behavior)
ToolBoardLeafEdit.prototype.opDefault= function(){
	var _this= this;
	setTimeout(function(){
		UI.toolSet.kill(_this)
	},0);
}

ToolBoardLeafEdit.prototype.opCancel= function() {
	//remove newly created but unused
/*	if (thisNote.id<0 && thisNote.ndata[0].isChanged==0) {
		thisNote._note_.parentNode.removeChild(thisNote._note_);
		delete BOARD.notes[thisNote.id];
		BOARD.noteFieldCorrect(0);
		return;
	}
*/

	this.editContext().ui.content(this.shadow);
	this.canceled= 1;
	this.opDefault();
}


ToolBoardLeafEdit.prototype.opNewData= function(){
	var _this= this;
	var dTarget= this.ndata.sibling();

	var newPlace= {
		x: UI.mouseX +DOCUMENT.scrollLeftF() -dTarget.uiA[0].nFrontUI.DOM.context.offsetLeft,
		y: UI.mouseY +DOCUMENT.scrollTopF() -dTarget.uiA[0].nFrontUI.DOM.context.offsetTop
//depricated
		,w:300,h:100
	}

	var newData= dTarget.dataSet(0,{
		dtype:DATA_TYPE.TEXT,
		place:[newPlace.x,newPlace.y,newPlace.w,newPlace.h]
	});
	newData.draw();

//todo: make in-place (confirm save)
	newData.save({content:'test',place:newPlace});


	setTimeout(function(){
		UI.toolSet.kill(_this)
	},0);
}

ToolBoardLeafEdit.prototype.opStyle= function() {
	var dTarget= this.ndata.sibling();
//popup, if need
//UI.paletteW.show(1,function(_style){dTarget.save({style:_style})});
	dTarget.save({style:UI.paletteW.style})
}


ToolBoardLeafEdit.prototype.editMode= function(_edit){
	var sibData= this.editContext();
	if (!sibData)
	  return;

	var _this= this;
	if (_edit)
	  this.shadow= sibData.ui.editMode(1,function(e){_this.keyPress(e)});
	else {
		sibData.ui.editMode(0);
		if (!this.canceled){
			if (sibData && sibData.ui.content()!=this.shadow)
			  sibData.save({content:sibData.ui.content()});
		}
		this.shadow= '';
	}
}

ToolBoardLeafEdit.prototype.keyPress= function(_e){
	_e= _e||WINDOW.event;
	var code= eKeyCode(_e);

	var _this= this;
	if ((code==13 && _e.ctrlKey) || code==10) this.opDefault();
//todo: feature; replace cancel with non-public store
	if (code==27) UI.popW.up(DIC.popEditCancel,function(){
		_this.opCancel();
	});
}


ToolBoardLeafEdit.prototype.editContext= function(){
	var sibNote= this.ndata.sibling();
//todo: get first element in better manner
	for (var rootData in sibNote.PUB.ndata)
	  return sibNote.PUB.ndata[rootData];
}
var ToolBoard= function(_rootW,_board){
	var _this= this;

	_this.rootW= _rootW;
	_this.board= _board;

	_this.DOM= _this.build(_rootW);

	_this.bindEvt();
}

ToolBoard.prototype.bindEvt= function(){
	var _this= this;
	this.DOM.tNewNote.onmouseup= function(){_this.opNewNote()};
	this.DOM.tNewData.onmouseup= function(){_this.opNewData()};
	this.DOM.tStyle.onmouseup= function(_e){_this.opStyle(_e)};

	this.DOM.rtsR[1].onclick=	function(){_this.opRights(this,1,0)};
	this.DOM.rtsR[2].onclick=	function(){_this.opRights(this,2,0)};
	this.DOM.rtsR[4].onclick=	function(){_this.opRights(this,4,0)};
	this.DOM.rtsA[1].onclick=	function(){_this.opRights(this,1,1)};
	this.DOM.rtsA[2].onclick=	function(){_this.opRights(this,2,1)};
	this.DOM.rtsA[4].onclick=	function(){_this.opRights(this,4,1)};
	this.DOM.rtsE[1].onclick=	function(){_this.opRights(this,1,2)};
	this.DOM.rtsE[2].onclick=	function(){_this.opRights(this,2,2)};
	this.DOM.rtsE[4].onclick=	function(){_this.opRights(this,4,2)};
}


ToolBoard.tmpl= DOM('toolBoardTmpl')
ToolBoard.prototype.build= function(_parentEl){
	var cClone= ToolBoard.tmpl.cloneNode(true);
	var cRoot= {
		root: cClone,
		context: DOM('toolBoardContext',cClone),
		tNewNote: DOM('toolBoardNewNote',cClone),
		tNewData: DOM('toolBoardNewData',cClone),
		tStyleSample: DOM('toolBoardStyleSample',cClone),
		tStyle: DOM('toolBoardStyle',cClone),
		setOwner: DOM('toolBoardSetOwner',cClone),
		rtsR: [0,DOM('rights1_R',cClone),DOM('rights2_R',cClone),0,DOM('rights4_R',cClone)],
		rtsA: [0,DOM('rights1_A',cClone),DOM('rights2_A',cClone),0,DOM('rights4_A',cClone)],
		rtsE: [0,DOM('rights1_E',cClone),DOM('rights2_E',cClone),0,DOM('rights4_E',cClone)]
	};
	NOID(cClone);

	cRoot.tStyleSample.appendChild(UI.paletteW.show());
	this.assignRights(cRoot);

	for (var i in this.board.PUB.rightsA)
	  this.draw1rt(i,this.board.PUB.rightsA[i],cRoot);

	_parentEl.appendChild(cClone);

	cRoot.context.focus();
	var ctx= cRoot.context.style;
//+++classname
	  ctx.top= '-30px';
	  ctx.left= '-30px';
	  ctx.width= '200px';
	  ctx.height= '24px';
	  ctx.padding= '14px';
	  ctx.borderColor= '#aad';

	return cRoot;
}
ToolBoard.prototype.draw1rt= function(_grp,_rts,_DOM){
	_DOM= _DOM || this.DOM;
	_DOM.rtsE[_grp].style.background= _rts==2? "#6a6" : "#aca";
	_DOM.rtsA[_grp].style.background= _rts==1? "#aa6" : "#cca";
	_DOM.rtsR[_grp].style.background= _rts==0? "#aaa" : "#ccc";
}
ToolBoard.prototype.assignRights= function(_DOM){
	var rRoot= this.board.PUB.rights;

	_DOM.setOwner.style.display= rRoot==NOTA_RIGHTS.OWN? '': 'none';
}

ToolBoard.prototype.kill= function(){
	var ctx= this.DOM.context.style;
//+++classname
	  ctx.top= '';
	  ctx.left= '';
	  ctx.width= '';
	  ctx.height= '';
	  ctx.padding= '';
	  ctx.borderColor= '';

	var _this= this;
	setTimeout(function(){
	  _this.rootW.removeChild(_this.DOM.root);
	},CSS.TOOL_TRANSITIONTIME*1000);
}


ToolBoard.prototype.opNewNote= function(){
	var _this= this;

	var newPlace= {
		x: UI.mouseX +DOCUMENT.scrollLeftF() -this.board.nFrontUI.DOM.context.offsetLeft,
		y: UI.mouseY +DOCUMENT.scrollTopF() -this.board.nFrontUI.DOM.context.offsetTop
//depricated
		,w:300,h:100
	}


	var newNote= new NUI_note();
	newNote.save({inherit:this.board.PUB.id});

	var newData= this.board.dataSet(0,{
		dtype:DATA_TYPE.NOTE,
		place:[newPlace.x,newPlace.y,newPlace.w,newPlace.h]
	});

//todo: make in-place (confirm save)
	newData.save({content:newNote.PUB.id,place:newPlace});





	setTimeout(function(){
		UI.toolSet.kill(_this)
	},0);
}

ToolBoard.prototype.opNewData= function(){
	var _this= this;

	var newPlace= {
		x: UI.mouseX +DOCUMENT.scrollLeftF() -this.board.nFrontUI.DOM.context.offsetLeft,
		y: UI.mouseY +DOCUMENT.scrollTopF() -this.board.nFrontUI.DOM.context.offsetTop
//depricated
		,w:300,h:100
	}

	var newData= this.board.dataSet(0,{
		dtype:DATA_TYPE.TEXT,
		place:[newPlace.x,newPlace.y,newPlace.w,newPlace.h]
	});
	newData.draw();

//todo: make in-place (only confirm save)
	newData.save({content:'test',place:newPlace});


	setTimeout(function(){
		UI.toolSet.kill(_this)
	},0);
}


ToolBoard.prototype.opStyle= function() {
	var dTarget= this.board;
//popup if need
	//UI.paletteW.show(1,function(_newStyle){dTarget.save({style:_newStyle})});
	dTarget.save({style:UI.paletteW.style})
}

ToolBoard.prototype.opRights= function(_el,_grp,_rt){
	if (_rt==this.board.PUB.rightsA[_grp])
	  _rt= NOTA_RIGHTS.INIT;

	this.draw1rt(_grp,_rt);

	this.board.save({rights:{group:_grp,right:_rt}});
}
/*
	legacy upload engine.

	Interface:
		byForm(_onPickedCB) initiates file selection.
		New hidden form is added for each selection to hold queued files.
		As files picked, supplied _onPickedCB(files[]) called,
		 returning upload container notes

	macro:

		-new form created from template
		-its pickFiles() called
		-on picked:
			-form put into form queue
			-blank notes are created for each file
			-submit queued form
			-on uploaded iFrame.onLoad() called
				-continue queue
*/
	


//todo: define at loading js
if (!IS.dnd){


var UPLOAD= new function(){
	var UploadFiles= function(_uploadForm,_notesA){
		this.uploadForm= _uploadForm;
		this.notesA= _notesA;
	}

	this.onPickedCB;

	this.queueA= []; //forms/associated_notes
	this.queueNow;
	
	this.isUploading;
	this.timeoutUpProgress;

	//called every time upload is complete;
	//notice: context is UPLOAD, arg is iFrame
 	var _this= this;
 	DOM('legacyUploadFrame').onload= function(){_this.formUploadCB(this)};

	/*
		Select files into individual form.
		One/several files accepted.

		New Form is created from template and queued for uploading

		_onPickedCB([file,...]) is supplied callback
		returning array of notes for upload into
	*/
//todo: set final filename at start of upload, rather than end.
//PUBLIC
	this.byForm= function(_onPickedCB){
		if (SESSION.board.PUB.rights<NOTA_RIGHTS.RW)
		  return;

		this.onPickedCB= _onPickedCB;
		//make new form and choose files
		var cClone= UPLOAD.tmplForm.cloneNode(true);;
		var formTry= {
			form: cClone,
			pick: DOM('filePick', cClone),
			submit: DOM('upSubmit', cClone)
		};

		formTry.pick.onchange= function(){this.filesSelected(formTry)}.bind(this);
		formTry.pick.click();
	};
	
	this.byDnD= function(){
//dic:
		UI.popW.up('unsupported dnd');
		return;
	}

	/*
		Queue Form after files are selected.
		
		macro:
		-Check size,
		-Create template notes,
		-Append form to queue,
		-Procceed with form queue.
	*/
	this.filesSelected= function(_formTry){
		var formUpFname= _formTry.pick;
		
//todo: should move to tool's callback .(files[])
		//create associated notes
		var filesA= [];
		if (formUpFname.files){ //multi
			//check total length
			var tl=0;
			for (var f=0; f<formUpFname.files.length; f++)
			  tl+= formUpFname.files[f].size;
			if (tl>1480000000) {
				UI.popW.up(DIC.uploadLimit);
				return;
			}

			for (var f=0; f<formUpFname.files.length; f++)
			  filesA.push({name:formUpFname.files[f].name, size:formUpFname.files[f].size});
		} else //veeeeery legacy, no multi-file
		  filesA.push({name:formUpFname.value, size:0});

		//add to queue and go if not yet
		this.queueA.push( new UploadFiles(_formTry, this.onPickedCB(filesA)) );
		if (!this.isUploading)
		  this.nextInQueue();
	};
	
	
	/*
		Form queue procceeded here

		macro:
		-Setup progress request
		-Start upload
		
	*/
	this.nextInQueue= function(){
		clearTimeout(this.timeoutUpProgress);
		if (!(this.queueNow= this.queueA.shift())){ //queue empty, stop
			this.isUploading= false;
			return;
		}
		this.isUploading= true;

		//set progress check
		var _this= this;
		this.timeoutUpProgress= setInterval(
			function(){
				SESSION.async(ASYNC_MODE.UPLOADPROGRESS_LEGACY, [], _this.fileProgressCB)
			}, 500
		);
		this.fileProgressCB();

		var thisForm= this.queueNow.uploadForm;
//check: should click() call work in some browsers?
		//should be in DOM for submit clicks to work
		DOCUMENT.body.appendChild(thisForm.form);
		thisForm.submit.click(); //fired and forgot
		DOCUMENT.body.removeChild(thisForm.form);
	};




	/*
		macro:
		-Update all notes with Complete state,
		-Procceed form queue
		
		resA= [[guidS|'']\n..]
	*/
	this.formUploadCB= function(_frame){
		var result= _frame.contentDocument.firstChild.lastChild.innerHTML;
		this.fileProgressCB(result,true);

		this.nextInQueue();
	}

	
	/*
		Update Progress for uploading files.
		When uploading files with forms, files are actually proccessed at once,
		so some of files can be set to 100% but yet not be available.
	
		res= '' returned by out-of-scope progress request, skipped
		res= [[uid|bytes|-1=err],..]
	*/
	this.fileProgressCB= function(res,_stop){
		if (res=='') //blank when called after upload, skip
		  return;
		if (!res) //filters out start of upload
		  res= '';

		var resA= res.split("\n");
		for (var iN in this.queueNow.notesA){
			var thisNote= this.queueNow.notesA[iN];
			var resOne= resA[iN];
//todo: constant
			if (resOne==-1)
			  thisNote.uploadError();
			else {
				if (_stop) //filters out end of upload
				  thisNote.uploadFinish(resOne);
				else
				  thisNote.uploadSetPos((resOne |0) || 0);  //unlisted are assumed be at 0 pos
			}
		}
	}.bind(this);

};

UPLOAD.tmplForm= DOM('uploadTmpl').children[0];


}
/*
	HTML5 upload engine.

	Interface:
		byForm(_onPickedCB) initiates file selection.
		As files picked, supplied _onPickedCB(files[]) called,
		 returning upload container notes

		filesSelected() should be binded to 'filePick'.onchange.
		 It's called as files ARE selectes with form to add corresponding Notes
		 and start upload queue.

		for dnd: filesSelected() should be binded to 'ondrop' property of desired element


	macro:

		-new form created from template
		-its pickFiles() called
		-on picked or DnD:
			-files are put into file queue
			-blank notes are created for each file
			-procceed file queue
*/

if (IS.dnd) {

var UPLOAD= new function(){
	var UploadFile= function(_file, _note){
		this.file= _file;
		this.note= _note;
		this.retries= 0;
		this.fileGuid= '';	//server-side file guid
	}

  /*
		New style, sliced blob mode
  */
	this.onPickedCB;

	this.queueA= []; //UploadFile,..
	this.queueNow;
	
	this.isUploading= 0;
	this.timeoutUpProgress;
	

	this.sliceOffset;
	this.blobSize;
	
	this.fReader= new FileReader();


	/*
		Select files into individual form.
		One/several files accepted.

		New Form is created from template and queued for uploading

		_onPickedCB([file,...]) is supplied callback
		returning array of notes for upload into
	*/
//todo: set final filename at start of upload, rather than end.
//PUBLIC
	this.byForm= function(_onPickedCB){
		if (SESSION.board.PUB.rights<NOTA_RIGHTS.RW)
		  return;

		this.onPickedCB= _onPickedCB;

		//choose files
		//form's .pushQueue assigned globally, as form is reused
		UPLOAD.formTry.pick.click();
	};


	this.byDnD= function(_filesA, _onPickedCB){
		if (SESSION.board.PUB.rights<NOTA_RIGHTS.RW)
		  return;

		this.onPickedCB= _onPickedCB;

		this.pushQueue(_filesA);
	}


	//add to queue and go if not yet
	this.pushQueue= function(_filesToUpload){
		var filesA= [];
		for (var f=0; f<_filesToUpload.length; f++)
		  filesA.push({name:_filesToUpload[f].name, size:_filesToUpload[f].size});

		var notesA= this.onPickedCB(filesA);
		for (var f=0; f<_filesToUpload.length; f++)
		  this.queueA.push( new UploadFile(_filesToUpload[f], notesA[f]) );
		if (!this.isUploading)
		  this.nextInQueue();
	}

	/*
		Files queue procceeded here
	*/
	this.nextInQueue= function(){
		if (!(this.queueNow= this.queueA.shift())){ //queue empty, stop
			this.isUploading= false;
			return;
		}
		this.isUploading= true;

		this.sliceOffset= 0;
		this.blobSize= UPSET.BLOB_SIZE;
		this.blobCut();
	};


	/*
		repeatedly cut and (automatically) send slice
	*/
	this.blobCut= function(){
		var thisFile= this.queueNow.file;

		//progress
		this.fileProgressCB();

		if (thisFile.size-this.sliceOffset < this.blobSize) //final slice
		  this.blobSize= thisFile.size-this.sliceOffset;

		var blob= thisFile.slice(this.sliceOffset, this.sliceOffset +this.blobSize);
		this.fReader.readAsBinaryString(blob);
	}

	
	/*
		Send file slice actually readed.
	*/
	this.fReader.onloadend= function(_e){
		if (_e.target.readyState != FileReader.DONE)
		  return;

		var thisFile= this.queueNow.file;

//todo: threat: check what is uploaded and where
		SESSION.async(ASYNC_MODE.UPLOAD_BLOB, _e.target.result, this.blobSentCB, this.blobSentErrCB, false, true, [
			['Filename', thisFile.name],
			['File-guid', this.sliceOffset==0? 0: this.queueNow.fileGuid], //reuse
			['Filesize', thisFile.size],
			['Slice-From', this.sliceOffset],
			['Slice-Size', this.blobSize]
		]);
	}.bind(this);

	/*
		One slice is sent.
		
		Check for error, and retry if need
		Procceed to next slice or next file in queue
	*/
	this.blobSentCB= function(_res) {
		if (_res==UPSET.RESTRICTED){
			UI.popW.up([DIC.uploadRestricted, this.queueNow.file.name]);
			this.nextInQueue();
			return;			
		}

		//OK at least

		if (this.sliceOffset==0) //first slice, store file names
		  this.queueNow.fileGuid= _res;
		  
		this.sliceOffset+= this.blobSize;

		//that was last
		if (this.sliceOffset>=this.queueNow.file.size){
			this.fileProgressCB(); //ensure 100% progress is called

			//procceed
			this.nextInQueue();
			return;
		}

		this.blobCut();
	}.bind(this);


	this.blobSentErrCB= function() {
		this.queueNow.retries+= 1;
		if (this.queueNow.retries>UPSET.MAX_RETRIES){
			this.queueNow.note.uploadError();
			this.isUploading= false;
		} else
		  this.blobCut();
	}.bind(this);

	/*
		update upload progress value
	*/
	this.fileProgressCB= function(){
		var filePerc= this.sliceOffset;

		this.queueNow.note.uploadSetPos(this.sliceOffset);
		if (this.sliceOffset==this.queueNow.file.size)
		  this.queueNow.note.uploadFinish(this.queueNow.fileGuid);
	}
};


var tmplForm= DOM('uploadTmpl').children[0];
UPLOAD.formTry= {
	form: tmplForm,
	pick: DOM('filePick', tmplForm),
	submit: DOM('upSubmit', tmplForm)
};

//bind
UPLOAD.formTry.pick.onchange= function(){
	UPLOAD.pushQueue(UPLOAD.formTry.pick.files)
};


}

















var nnn= function(_file){
	this.pos= -1;
	this.finished= false;
	this.err= false;
	this.name= _file.name;
	this.size= _file.size;

console.log('added: '+ _file.name);

	this.uploadSetPos= function(_filePos){
		if (this.err || _filePos<=this.pos)
		  return;

		this.pos= _filePos;
		console.log(this.name +': '+ (this.size? _filePos/this.size :0));
	}

	this.uploadFinish= function(_targ){
		if (this.err || this.finished)
		  return;
		this.uploadSetPos(this.size);

		this.finished= true;
		console.log(this.name +' set to '+ _targ);
	}

	this.uploadError= function(){
		if (this.err)
		  return;
		this.err= true;
		console.log(this.name +' ERROR!');
	}
}


var ccbb= function(_filesA,_place){
console.log('at '+ _place.x +'x' +_place.y +':');
	var fileNotesA= [];
	for (var f=0; f<_filesA.length; f++){
		fileNotesA.push(
			new nnn(_filesA[f])
		);
//		var tmpN= workFieldDbl(	{clientX:100+f*5, clientY:100+f*50}, _filesA.base64_encode() );
	}

//	SESSION.board.nFrontUI.correct();
	return fileNotesA;
}

var uplBtn= function(){
	UPLOAD.byForm(function(_filesInA){
		return ccbb(_filesInA,{x:'_e.clientX', y:'_e.clientX'});
	})
}


var xxx= DOCUMENT.bodyEl.appendChild(DOCUMENT.createElement('span'));
 xxx.innerHTML= 'upload';
 xxx.style.position= 'fixed';
 xxx.style.top= '100px';
 xxx.onclick= uplBtn;

if (IS.dnd) {
	UI.DOM.workField.ondragover=	function(){return false}; //need to be declared
	UI.DOM.workField.ondragleave=	function(){return false}; //need to be declared
	UI.DOM.workField.ondrop=	function(_e){
		UPLOAD.byDnD(_e.dataTransfer.files,function(_filesInA){
			return ccbb( _filesInA, {x:_e.clientX, y:_e.clientY} );
		});
		return false;
	}
}

//joke--------------
var paintC = function(_canvas){
	var context = _canvas.getContext("2d");

	var branches = [];

	setInterval(loop, 1000/20);

	function loop(){
//		var prev = context.globalCompositeOperation;
//		context.globalCompositeOperation = "destination-in";
//		context.fillStyle= "rgba(0, 0, 0, 0.9)";
//		context.fillRect(0,0,_canvas.offsetWidth,_canvas.offsetHeight);
//		context.globalCompositeOperation = prev;

		if (branches.length < 500)
			branches.push(new Branch(UI.mouseX -_canvas.offsetLeft, UI.mouseY -_canvas.offsetTop));

		for (var i = 0; i < branches.length; i++){
			var branch = branches[i];
			branch.life++;

			if (branch.life > branch.lifeTo){
				branches.shift();
				continue;
			}

			context.beginPath();
			context.moveTo(branch.x, branch.y);

			branch.rw += branch.life/1000*branch.rwRate +Math.random()*.2-.1;
			branch.x += Math.cos(branch.rw);
			branch.y += Math.sin(branch.rw);

			context.strokeStyle = "rgba(0,0,0,"+250+Math.min(branch.life,100)/100+")";
			context.lineTo(branch.x, branch.y);

			context.stroke();
		}

		context.closePath();

	}

	var Branch = function(x, y){
		this.lifeTo = (Math.random())*100000;
		this.life = 0;
		this.x = x;
		this.y = y;
		this.rw = Math.random()*360;
		this.rwRate = -Math.pow(Math.random(),5);
	}
}
var __PROFILE= new function(){

/*
	pAlert() throw new blank div
	pAlert(args) adds new text block

	_level must be >= compared to defined .level
*/
this.pAlert= function(_level, _txtTitle, _txtBody, _delimiter){
	if (!this.profileW || this.level<_level)
	  return;
	var _this= this;
	setTimeout(function(){
		if (_this.profileW.document.body.firstChild.children[0].checked)
		  return;
		var els= _this.profileW.document.body.lastChild;
		if (!_txtTitle){
			if (els.firstChild && els.firstChild.innerHTML=='')
			  return;
			while (els.childNodes.length>PROFILE.LIMIT)
			  els.removeChild(els.lastChild);
			var newE= _this.profileW.document.createElement('div');
			  newE.style.padding= '10px';
			  newE.style.borderBottom= '1px solid';
			  newE.style.whiteSpace= 'nowrap';
			  newE.style.background= new Color((Math.random()*63 |0) +192,  (Math.random()*63 |0) +192,  (Math.random()*63 |0) +192).hex();
			els.insertBefore(newE, els.firstChild);
			return;
		}
		if (typeof(_txtBody)=='object'){
			var txtBody= [];
			for (var itb in _txtBody)
			  txtBody.push([itb,_txtBody[itb]].join(': '));
			var valsA= txtBody;
		} else
		  var valsA= (''+_txtBody).split("\n");
		els.firstChild.innerHTML+= 
		  (els.firstChild.innerHTML==''? '' : (
				_delimiter?
				'<div style="border-top:1px solid #888;padding-top:4px;margin-top:4px">'
				: '<div style="border-top:1px solid #bbb">'
		  ))
		  +'<span style=color:red;margin-right:10px>'
		  +_txtTitle
		  +'</span><span>'
		  +(((''+_txtBody).split("<br>").length>1 || valsA.length>1)? '<br>' : '')
		  +valsA.join('<br>')
		  +"</span></div>";
	}, 0);
}

this.profileTime= function(){
	var out= this.checkTime;
	this.checkTime= new Date().getTime();
	return new Date().getTime()-out;
}

this.close= function(){
	if (this.profileW)
	  this.profileW.close();
}


this.level= 0;
this.checkTime= 0;
this.coords= SESSION.cookieGet('notaProfLoc').split('_');
this.profileW= (!this.level || NOPROFILE)? null : window.open(
	'about:blank',
	'notaProfile',
	'left=' +this.coords[0] +',top=' + this.coords[1]+',width=300,height='+ window.screen.availHeight +',toolbar=0,location=0,menubar=0,scrollbars=1'
);

if (this.profileW){
	window.focus();
	this.profileW.moveTo(this.coords[0],this.coords[1]);

	var _this= this;
	setTimeout(function(){
		_this.profileW.document.body.style.margin= 0;
		_this.profileW.document.body.innerHTML= '<div><input type=checkbox name=000></input><button style=border:0; onclick="this.parentElement.children[0].checked=!this.parentElement.children[0].checked">Freeze</button></div><div></div>';
	}, 0);

	setTimeout(function(){
		SESSION.cookieSet(_this.profileW.screenX +'_' +_this.profileW.screenY, 'notaProfLoc');
	}, 5000);

	this.pAlert();
}


}
//SHOULD BE CALLED LAST



//todo: wut? seems to be reference board choser; 
//DOM .tempUserBoardsList.onchange=	function(e){UI.popW.DOMUpWindow.onsubmit()};

//window to BOARD
//todo: ON

//cleanup DOM
DOCUMENT.bodyEl.removeChild(DOM('templates'));

//window['argsA']= [0 |0,'','ki','ss',-1 |0,'',0 |0];

var argsA= DOCUMENT['argsA'];

SESSION.owner(argsA[ARGS_PLACE.USERID], argsA[ARGS_PLACE.USERNAME]);

SESSION.board= new Ncore(argsA[ARGS_PLACE.REQNOTEID]>0? argsA[ARGS_PLACE.REQNOTEID] :0);

SESSION.reqWho= argsA[ARGS_PLACE.REQWHO];
SESSION.reqWhat= argsA[ARGS_PLACE.REQWHAT];
SESSION.reqFilter= argsA[ARGS_PLACE.REQFILTER];

UI.embed= argsA[ARGS_PLACE.EMBED];

setTimeout(function(){SESSION.update.coreCycle(true)},0); //start updating after others browser requests start (icon etc); mainly to optimize logging
