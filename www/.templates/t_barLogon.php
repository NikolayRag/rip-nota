
<?=$NOPROFILE? '': "<!-- in Bar Logon -->\n"?>
<form class='loginForm' method='post' id='logForm'>
	<table><tr><td>
	  <table><tr>
	    <td><div>
	  	  <input id='logUname' name='logUname' type='text'>
		  <span id='logUnameCover' style='display:none'><?=$DIC->labLogName?></span>
	    </div></td>
	  </tr><tr>
	    <td><div>
	  	  <input id='logPass' name='logPass' type='password'>
		  <span id='logPassCover' style='display:none'><?=$DIC->labLogPass?></span>
	    </div></td>
	  </tr></table>
	</td><td>
	  <input id='logSubmit' name='logSubmit' type='submit' value='<?=$DIC->labLogRegister?>' disabled=disabled>
	</td></tr></table>
</form>
<?=$NOPROFILE? '': "<!-- out Bar Logon -->\n"?>
