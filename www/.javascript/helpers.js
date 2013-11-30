
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

