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
