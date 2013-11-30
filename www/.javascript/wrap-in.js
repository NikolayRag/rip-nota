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

var NOID= function(_root){
	var allSib= _root.getElementsByTagName('*');
	_root.removeAttribute('id');
	for (var i= 0; i<allSib.length; i++)
	  allSib.item(i).removeAttribute('id');
}

////Compatibility collection definition
var IS= {};
//todo: replace platform detection with feature flags
IS.safari=
  navigator.userAgent.toLowerCase().indexOf('safari') != -1;
IS.gecko=
  !IS.safari
  &&navigator.userAgent.toLowerCase().indexOf('gecko') != -1;
IS.dnd= (
	'undefined'!==typeof File
	&&(
		'undefined'!==typeof File.prototype.slice
		||'undefined'!==typeof File.prototype.webkitSlice
		||'undefined'!==typeof File.prototype.mozSlice
	)
	&&'undefined'===typeof FileReader
	&&'undefined'===typeof FileList
	&&'undefined'===typeof Blob
)? 1:0;
IS.popurl=
  0;
IS.hover=
  1;
IS.scrollW=
  100 -DOM('testEl').clientWidth;


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
