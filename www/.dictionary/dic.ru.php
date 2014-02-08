<?
/*
php usage:	<?=$DIC->x?>
js usage:	DIC.x
*/
$DICLOC= array(
	'labOk'=>	"Далее",
	'labNotok'=>	"Отмена",
	'labContacts'=>	"Контакты",
	'labTitle'=>	"Нота",
	'labLogOut'=>	"Выйти",
	'labLogName'=>	"Имя",
	'labLogPass'=>	"Пароль",
	'labLogHold'=>	"дома",
	'labLogIn'=>	"Войти",
	'labLogRegister'=>	"Новый",
	'labDeleted'=>	"удалено",

	'popRegisterTitle'=>	"Новый пользователь",
	'popRegisterConfirm'=>	"Подтвердите код",
	'popStayConfirm'=>	"В следующий раз входить автоматически",
	'popEditCancel'=>	"Отменить редактирование?",
	'popEditRemove'=>	"Удалить ноту?",
	'popContactReq'=>	"Запросить контакт?",
	'popContactKill'=>	"Забыть контакт?",
	'popPin'=>	"Прибить ноту к..",

	'popStateUpdating'=>	"В процессе обновления",
	'popStateError'=>	"Ошибка обновления, проблемы с сервером",
	'popStateStop'=>	"Обновление остановлено<br>проблемы в броузере",
	'popStateStopALERT'=>	"<span class=bigTxt>Проблемы с обновлением доски!</span><br><br>Сервер отсылает фигню<br><br><span class=smallTxt>Обновление остановлено, но ноты можно редактировать<br>(но лучше не надо)</span>",
	'popStateOkay'=>	"Все нормально",
	'popStateVDelayed'=>	'Долго ждем',
	'popStateVAsyncHead'=>	'Ошибка соединения ',
	'popStateVAsync0'=>	'сервер недоступен',
	'popStateVAsync500'=>	'внутренняя ошибка сервера',
	'popStateProfTime'=>	'$:сервер, $:передача',

	'boardTools'=>	"Инструменты",
	'boardToolsUpload'=>	"Загрузить",
	'boardToolsNew'=>	"Новая",
	'boardToolsStyle'=>	"Раскрасить",
	'boardToolsRename'=>	"Переименовать",
	'boardToolsCopy'=>	"Копировать",
	'boardToolsClear'=>	"Очистить",
	'boardToolsDel'=>	"Удалить",
	'boardToolsColor'=>	"Цвет",
	'boardRtsEdit'=>	"Запись",
	'boardRtsAdd'=>	"Комментарии",
	'boardRtsRo'=>	"Чтение",

	'contWaitingYou'=>	"Ждут вас",
	'contYouWait'=>	"Вы ждете",
	'contLab'=>	"Контакты",

	'uploadLimit'=>	"Нельзя:<br><br>Ваш броузер не загрузит<br>более 14Гбайт за один раз",
	'uploadError'=>	"Ошибка загрузки",
	'uploadComplete'=>	"Готово",

	'timeAgoSecs'=>	"$ сек. назад",
	'timeAgoSecsRulz'=>	"",
	'timeAgoMins'=>	"$ мин. назад",
	'timeAgoMinsRulz'=>	"",
	'timeAgoHours'=>	"час назад,$ час назад,$ часа назад,$ часов назад",
	'timeAgoHoursRulz'=>	"^1$,[^1]1$,(^|[^1])[2-4]$",
	'timeAgoDays'=>	"сегодня,вчера,позавчера,$ день назад,$ дня назад,$ дней назад",
	'timeAgoDaysRulz'=>	"^0$,^1$,^2$,[^1]1$,(^|[^1])[2-4]$",
	'timeJan'=>	"Янв.",
	'timeFeb'=>	"Фев.",
	'timeMar'=>	"Мар.",
	'timeApr'=>	"Апр.",
	'timeMay'=>	"Мая",
	'timeJun'=>	"Июня",
	'timeJul'=>	"Июля",
	'timeAug'=>	"Авг.",
	'timeSep'=>	"Сент.",
	'timeOct'=>	"Окт.",
	'timeNov'=>	"Нояб.",
	'timeDec'=>	"Дек.",

	'stampSomebody'=>	'кто-то',

	'warr'=>	"Внимание",
	'warrBoardChanged'=>	"Изменения доски не сохранены!",
	'warrNotesChanged'=>	"Некоторые изменения нот не сохранены, при перегрузке данные могут быть потеряны!",

	'errr'=>	"Проблема",
	'errrBoardUpdate'=>	"Обновление доски странное",
	'errrNoteMisver'=> "Несоответствие версии стикера",
	'errrRtsSave'=>	"Ошибка при сохранении прав",
	'errrContactMake'=>	"Ошибка при запросе контактов",
	'errrContactUpdate'=>	"Ошибка при обновлении контактов",
	'errrNoteSave'=>	"Ошибка при сохранении ноты",
	'errrBoardSave'=>	"Ошибка при сохранении доски",
	'errrLogonCB'=>	"Ошибка при входе",
	'errrAsyncNA'=>	"Обновления не поддерживаются броузером",

	'errrPreNoUsername'=>	"Имя пользователя не может быть пустое",
	'errrPreNoPassword'=>	"Код не может быть пустой",
	'errrPrePassMismatch'=>	"Код должен совпадать, проверьте",

	'errrUserOutdated'=>	"Вы перелогонились где-то, перегружаемся...",

	'logErrRegister'=> "Пользователь не зарегистрирован",
	'logErrChange'=> "Невозможно изменить сведения пользователя",
	'logErrActivate'=> "Не получается активировать пользователя",
	'logErrRestore'=> "Пользователь с таким емейлом не существут",
	'logErrRepass'=> "Код не получается изменить",
	'logErrCookie'=> "Код не запомнен для последующих входов",
	'logErrProvided'=> "Имя или код пусты",
	'logErrActivated'=> "Пользователь не активен, посмотрите почту",
	'logErrDeactivated'=> "Пользователь отключен, обратитесь в поддержку",
	'logErrBadpass'=> "Неправильный код",
	'logErrHash'=> "Неправильное подтверждение",
	'logErrConfirm'=> "Вы не опознаны",
	'logErrSave'=> "Невозможно подтвердить",
	'logErrReset'=> "Вам требуется изменить код для входа",
	'logErrUnregistered'=> "Такого пользователя не существует",

	'preCss'=> "один момент...",

	'_got'=> 'Получено: $',
	'_in'=> 'Получено: $ за $сек\n$FPS: $',
	'_proccessed'=> '$\n$ms: обработано',

	'msgNoProfile'=> 'нет измерений'

);
?>