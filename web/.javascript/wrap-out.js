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
