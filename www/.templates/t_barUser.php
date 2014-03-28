
<!-- in Bar User -->
<span class='toolWidget'>
	<a id='barUserSelf'><? echo $USER->data['first_name']; ?></a>
</span>

<span class='toolWidget'>
	<input id='youStay' type='checkbox' <?= (arrGet($_COOKIE,'notaCook','')!='' && $USER->id>0)?'checked="checked"':''; ?>>
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
<!-- out Bar User -->
