<!doctype html>
<html>
<head>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
	<title>Nota error / Нота недоступна</title>
</head>
<body style="font:20pt sans-serif;margin:50px;color:<?=$CSS->DECORDARK?>;text-align:center;position:fixed;top:0;bottom:0;left:0;right:0;">

	<table style=width:100%;height:100%><tr><td>
		<p>Nota internal error</p>
		<p>Внутренняя ошибка Ноты</p>
		<p style=color:white><?=$DB->dbErr?>: <?=$DB->dbErrText?></p>
	</td></tr></table>

</body>
</html>
