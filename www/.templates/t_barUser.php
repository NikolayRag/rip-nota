
<?=$NOPROFILE? '': "<!-- in Bar User -->\n"?>
<div class='menu'><ul>
  <li><a id='barUserSelf'><? echo $USER->data['first_name']; ?></a></li>
</ul></div>

<div class='menu'><ul>
  <li><a id='youOut'><?=$DIC->labLogOut?></a></li>
</ul></div>

<br><span id='youStayLab'>
<?=$DIC->labLogHold?><input id='youStay' type='checkbox' <?=( (array_key_exists('notaCook',$_COOKIE) && $_COOKIE['notaCook']!='') && $USER->id>0)?'checked="checked"':'';?>>
</span>
<span class='toolWidget' id='contactsOpen'>
	<span id='notifyContactsLab'></span>
	<?=$DIC->labContacts?> 
	<span id='notifyContactReqsLab' class='notifier' style='display:none'></span>
</span>

<span id='templatePinList' style=display:none>
	<?=$DIC->popPin?>:<br><br>
	<SELECT id='tempUserBoardsList' size=10></SELECT>
</span>
<?=$NOPROFILE? '': "<!-- out Bar User -->\n"?>
