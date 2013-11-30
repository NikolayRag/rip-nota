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