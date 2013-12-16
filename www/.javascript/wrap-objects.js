
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

String.prototype.decorateHTML= function(mode,size,color) {
	mode= mode ||0;
	size= size ||100;

	return (mode &STR.DIV? '<div' : '<span')
	    +" style=font-size:" +size+'%;'
	    +(mode &STR.ITALIC? 'font-style:italic;' :'')
	    +(mode &STR.BOLD? 'font-weight:bold;' :'')
	    +(color? 'color:' +new Color(color).hex() +';' :'')
	  +">"
	  	+(mode &STR.QUOTE? '&laquo' : '')
	  	+((mode &STR.QUOTE) || (mode &STR.IDENT)? '<div style=margin-left:1em;>' :'')
	  		+this
	  	+((mode &STR.QUOTE) || (mode &STR.IDENT)? '</div>' :'')
	  	+(mode &STR.QUOTE? '&raquo' : '')
	  +(mode &STR.DIV? '</div>' : '</span>');
}

