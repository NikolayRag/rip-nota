
<?=$NOPROFILE? '': "<!-- in Bar User -->\n"?>
<span class='toolWidget'>
	<a id='barUserSelf'><? echo $USER->data['first_name']; ?></a>
</span>

<span class='toolWidget'>
	<input id='youStay' type='checkbox' <?=( (array_key_exists('notaCook',$_COOKIE) && $_COOKIE['notaCook']!='') && $USER->id>0)?'checked="checked"':'';?>>
	<span  id='youStayLab'><?=$DIC->labLogHold?></span>
</span>

<span class='toolWidget' id='contactsOpen'>
	<span id='notifyContactsLab'></span>
	<?=$DIC->labContacts?> 
	<span id='notifyContactReqsLab' class='notifier' style='display:none'></span>
</span>

<span class='toolWidget'>
	<a id='youOut'><?=$DIC->labLogOut?></a>
</span>
<?=$NOPROFILE? '': "<!-- out Bar User -->\n"?>
