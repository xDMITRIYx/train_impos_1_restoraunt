window.onload = function(e){
// ПЛАВНЫЙ СКРОЛЛ
	(function(){
	var anchors = document.querySelectorAll(".anchor"); //получение ссылок на якоря
	for (var i = 0; i < anchors.length; i++) {
		anchors[i].onclick = AnchorsScroll; //установка функции прокрутки по клику 
	}
	
	function AnchorsScroll(e){ 					//функция прокрутки с установкой сетИнтервал
		e.preventDefault();						//отмена перехода по умолчанию
			var x = this.href.indexOf("#");		//получение позиции символа id из адреса целевого объекта-якоря
			var id = this.href.substring(x); 	//извлечение id
		var adress = document.querySelector(id);//поиск целевого якоря
		var distance = adress.offsetTop;		//определение расстояния от начала страницы до якоря
		var time = 1000;						//время анимации

		var frame=100;							//количество кадров анимации
		var segm_dist = 100;					//шаг(отрезки) прокрутки
		var segm_time = Math.round(time/frame);	//интервал анимации

			var scroll=function(segm_dist, distance){		//функции прокрутки с остановкой сетИнтервал
				var wind_sY = window.scrollY;				//текущее расстоянието верха окна
					var sw=segm_dist/(distance-wind_sY);	//вспом.переменная для проверки напраления движения и оставшегося расстояния
				switch (true) {  //проверяем выше или ниже мы нужного якоря и куда двигаться (segm_dist - положит.-вниз, отрицат - вверх)
								 // switch (true) == case ... (к примеру switch (true) == (sw > 1)) "правда ли что sw больше чем 1?"
					case (sw > 1):
						segm_dist = distance-wind_sY;   //шаг уже больше оставшегося расстояния при движении ВНИЗ
						break;
					case ((0 <= sw)&&(sw <= 1)):
						segm_dist = segm_dist; 			//шаг еще меньше оставшегося расстояния при движении ВНИЗ
						break;
					case (sw==0):
						segm_dist = 0; 					//мы в нужной точке
						break;
					case ((-1 <= sw)&&(sw < 0)):
						segm_dist = -segm_dist; 		//шаг еще меньше оставшегося расстояния при движении ВВЕРХ
						break;
					case (sw < -1):
						segm_dist = distance-wind_sY;   //шаг уже больше оставшегося расстояния при движении ВВЕРХ
						break;
					default:
														// statements_def не нужно
						break;
				}

				var distance = distance;					//полное расстояние до якоря
				window.scrollBy(0, segm_dist);				//переместиться к якорю ан один шаг
				var wind_sY2 = window.scrollY;				//проверка координат верха страницы после шага прокрутки
				var wind_sMY = getScrollMaxY();				//получение координат верха конца страницы
				var flag = (wind_sY==distance)||(wind_sY2==wind_sMY);				//проверка "не проехали ли якорь?" или доехали до конца страницы
				// console.log(wind_sY, window.scrollMaxY);
				if (flag) clearInterval(timer);				//если доехали, то отменить сетИнтервал и остановить анимацию

				function getScrollMaxY(){					//функция получения координат верха конца страницы (для Google Chrome и Webkit - они свойство window.scrollMaxY не поддерживают)
   					 return(('scrollMaxY' in window ) ? window.scrollMaxY : (document.documentElement.scrollHeight - document.documentElement.clientHeight));
				}			//вернуть либо window.scrollMaxY если есть либо ('полный размер с учетом прокрутки' - 'видимая часть страницы')
			}

		var timer = setInterval(function(){scroll(segm_dist, distance)},segm_time);	//установка сетИнтервал и запуска анимации
	}

	})();			//*****END*****ПЛАВНЫЙ СКРОЛЛ

//ФИКСИРОВАННОЕ МЕНЮ
	(function(){
			var head = document.querySelector(".header_1");		//получение элемента .header_1
			var s_head = getComputedStyle(head);			//получение конечных стилей для .header_1
			var h_head = parseInt(s_head.height);			//получение высоты .header_1 (и отсечение едениц измерения)
			var time_show = 10;								//интервал анимации (100 кадров за 10 мс итого анимация за 1 с)
			var timer_menu;									//объявление переменной таймера сетИнтервал
			var start_t_menu;								//объявление переменной начального смещения top фикс меню

		window.addEventListener("scroll", fixMenu);			//подписка функции fixMenu на событие скролл
			function fixMenu(e){										//функция вкл./выкл. анимации меню
			if ((window.scrollY > h_head)&&(timer_menu==undefined)) {	//если прокрутка от верха больше высоты .header_1 и таймер не запущен
				timer_menu = setInterval(showMenu, time_show)};			//повесить ф-цию fixMenu в сетИнтервал
			if (window.scrollY==0) hideMenu();							//если прокрутка в самом верху - скрыть меню
		};

			function showMenu(){												//функция показа меню
				var menu = document.querySelector(".fixed_top_menu");			//получаем объект , содержащий меню
				var s_menu = getComputedStyle(menu);							//получаем его стили
				var h_menu = parseInt(s_menu.top);								//получение смещения top (и отсечение едениц измерения)
				    start_t_menu = start_t_menu || h_menu;						//вспомог.переменная для сохранения изначального смещения между вызовами функции
				var fr = 100;													//количество шагов(кадров) анимации появления
				if (h_menu < 0) {menu.style.top = h_menu - start_t_menu/fr + "px"}	//если меню еще смещено - сдвинуть его на один шаг
				else {															//иначе, если уже на экране и смещения не осталось
					clearInterval(timer_menu);									//остановить сетИнтервал
					// window.removeEventListener("scroll",fixMenu);			//отписывает функцию от события скролл и меню больше не исчезает
				return start_t_menu;											//замыкание для сохранения начального смещения в переменной
				};
			}

			function hideMenu(){												//функция скрытия меню при прокрутке в начало
				var menu = document.querySelector(".fixed_top_menu");			//получаем объект, содержащий меню 
				menu.style.top = '-100%';										//устанавливаем смещение вверх за экран
				timer_menu = undefined;											//сбрасываем функцию timer_menu для возможности повторного запуска
			}

	})();			//*****END*****ФИКСИРОВАННОЕ МЕНЮ

//ВАЛИДАТОР EMAIL
	(function(){
		var form_email = document.querySelector('#form_email');					//получаем элемент формы
		//form_email.addEventListener("submit", validForm);						//вешаем обработчик validForm на событие формы submit (нужно e.preventDefault())
		form_email.onsubmit = validForm;										//а так работает флаг valid

			function validForm(e){									//функция проверки формы
				//e.preventDefault();									//отменяем действие по умолчанию при событии submit
				var valid;											//переменная-флаг успеха проверки
				var valid_reg = /^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/i;		//регулярное выражение валидации формы
				var mail = form_email.querySelector('[name="email"]');//получаем элемент (текстовое поле) с введенным адресом почты
				if (valid_reg.test(mail.value)) {					//сверяем с регулярным выражением
					mailGood();										//если верно то выполняем mailGood()
					valid = true;									//ставим флаг в true
				}
				else {
					//e.preventDefault();								//отменяем действие по умолчанию при событии submit
					mailBad();										//если не верно то выполняем mailBad()
					valid = false;									//ставим флаг в false
				}
				return valid;										//возвращаем флаг из функции (при подписке функции через .addEventListener бесполезно)
			}														//form.onsubmit = function(){return false} - чтобы флаг работал

			function mailGood(){										//выводит сообщение о успехе проверки
				var divB = document.querySelector('.message_mail_bad'); //ищем тег с класом неудачи
				if (divB) {												//если он есть
					form_email.removeChild(divB);						//тогда удаляем его
				}
				var divG = document.querySelector('.message_mail_good');//ищем тег с классом успеха
				if (!divG){												//если его еще не было тогда создаем
				divG = document.createElement("div");					//создаем div
				divG.className = 'message_mail_good';						//добавляем класс 'message_mail_good'
				divG.innerHTML = 'Good MAIL';							//вставляем текст сообщения
				divG.style.fontSize = 2+'rem';							//размер шрифта сообщения
				divG.style.color = 'green';								//зеленый цвет сообщения
				form_email.appendChild(divG);							//добавляем его на страницу в форму
				}
			}

			function mailBad(){											//выводит сообщение о неудаче проверки
				var divG = document.querySelector('.message_mail_good');//ищем тег с классом удачи
				if (divG) {												//если он есть
					form_email.removeChild(divG);						//тогда удаляем его
				}
				var divB = document.querySelector('.message_mail_bad');	//ищем тег с классом неудачи
				if (!divB){												//если его нет тогда создаем его
				divB = document.createElement("div");					//создаем div
				divB.className = 'message_mail_bad';						//добавляем класс 'message_mail_bad'
				divB.innerHTML = 'Bad MAIL';							//вставляем текст сообщения
				divB.style.fontSize = 2+'rem';							//размер шрифта сообщения
				divB.style.color = 'red';								//красный цвет сообщения
				form_email.appendChild(divB);							//добавляем его на страницу в форму
				}
			}


	})();			//*****END*****ВАЛИДАТОР EMAIL

//ВЕРХНЕЕ МЕНЮ ДЛЯ СЕНСОРНЫХ ЭКРАНОВ
	(function(){
		var img_menu = document.querySelector('#header_1_menu__image');	//получаем элемент картинки, из которой выплывает меню
		img_menu.onmouseover = testMenu;								//вешаем функцию testMenu при наведении мыши на картинку
		img_menu.onclick = testMenu;									//вешаем функцию testMenu при клике мыши на картинке

		function addClass(){											//функция добавления класса .header_1_menu__image к картинке меню (и соответственно эффекта :hover)
			img_menu.classList.add('header_1_menu__image');
		}

		function delClass(){											//функция удаления класса .header_1_menu__image из картинки меню (и соответственно эффекта :hover)
			img_menu.classList.remove('header_1_menu__image');
		}

		function testMenu(){											//функция проверки состояния меню (свернуто/развернуто)
			var div_menu = document.querySelector('.header_1_menu');	//получаеем элемент div, содержащий меню
			var ul_menu = div_menu.querySelector('ul');					//получаем список ul, содержащий меню
			var li_menu = ul_menu.querySelectorAll('li');				//получаем все пункты списка меню
			// var style_ul_menu = getComputedStyle(ul_menu);				//тут можно получить стили списка ul
			// var left_ul_menu = parseInt(style_ul_menu.left);
			var slyle_li_menu = getComputedStyle(li_menu[2]);			//получаем конечный стиль второго пункта списка меню
			var left_li_menu = parseInt(slyle_li_menu.marginTop);		//получаем его значение marginTop
			if (left_li_menu==0) delClass();							//если ==0 (список развернут), то убрать класс .header_1_menu__image и, соответственно :hover на нем (т.е. свернуть)
			else if (left_li_menu < 0) addClass();						//если <0 (список свернут), то добавть класс .header_1_menu__image и, соответственно :hover на нем (т.е. развернуть)
			// console.log('li',left_li_menu);
		}
		
	})();			//*****END*****ВЕРХНЕЕ МЕНЮ ДЛЯ СЕНСОРНЫХ ЭКРАНОВ

//СЛАЙДЕР FOOD
	(function(){																//функция слайдера еды
				var fast_food = 'img/04_slider_food/1_fast_food/';				//4 переменные соответствующие папкам с фото
				var drinks = 'img/04_slider_food/2_drinks/';					//фото должны лежать по этим адресам
				var chicken = 'img/04_slider_food/3_chicken/';					//в формате img/04_slider_food/NN_имяТипаЕды/
				var rise = 'img/04_slider_food/4_rice/';						//а файлы в них /NN_имя.расширение

			var nav = document.querySelectorAll('.category');					//класс табов (соответствуют категориям еды(папкам))
			var activeClass = 'active';											//класс активного таба
			var sourсeImgs = fast_food;											//переменная папки-источника
			var figGalleryClass = '.gal_content';								//класс фигур галереи, содержащих картинки и надписи
			var timeOpasity = 50;												//время шага анимации исчезновения (и появления) при смене таба
			var timer_hide;														//таймер исчезновения (50мс * 10кадров = 0,5с)
			var timer_show;														//таймер появления

			for (let i = 0; i < nav.length; i++){								//вещаем обработчики на табы
				nav[i].onclick = function(){									//функция перезагрузки картинок из папок
					if (!this.classList.contains(activeClass)){					//проверка "активен ли уже этот таб?"
						activeTab.call(nav[i], nav, activeClass);				//если нет - вызов функции активации activeTab в контексте элементов nav[i]
						switch (i){												//определяем нужную папку по номеру таба
							case (0): sourсeImgs = fast_food; break;
							case (1): sourсeImgs = drinks; break;
							case (2): sourсeImgs = chicken; break;
							case (3): sourсeImgs = rise; break;
							default: break;
						}
						ajaxPostTab(sourсeImgs, figGalleryClass, timeOpasity);	//делаем AJAX-запрос с указанием (папки-источника, класса фигур галереиб времени анимации)
					}
				}
			}

			var btnLeft = document.querySelector('.gal_p_left');				//кнопка прокрутки влево
			var btnRight = document.querySelector('.gal_p_right');				//кнопка прокрутки вправо
			var timeMove = 20;													//время шага анимации прокрутки (20мс * 20кадров = 0,4с)
			var course;															//переменаня направления прокрутки ('next'/'previous') (можно true/false, но так понятнее)
			var timer_move;														//таймер анимации прокрутки

			btnLeft.onclick = function(){										//назначаем обработчик прокрутки на клик по левой кнопке
				var figsGallery = document.querySelectorAll(figGalleryClass);	//выбираем массив фигур на странице (.gal_content)
				if (figsGallery.length < 4){									//если фигуры 3 (т.е. предыдущая прокрутка закончилась) тогда запускаем функцию прокрутки
					course = 'previous';										//прокрутка назад
					sourсeImgs = detectFonder(figGalleryClass);					//функция определения из какой папки сейчас фигуры на странице (класс фигур)
					ajaxPostImg(sourсeImgs, figGalleryClass, timeMove, course);	//ajax-запрос подгрузки следующей фигуры (папка-источник, класс фигур на странице, время анимации, направление)
				}
			}

			btnRight.onclick = function(){										//назначаем обработчик прокрутки на клик по правой кнопке
				var figsGallery = document.querySelectorAll(figGalleryClass);	//выбираем массив фигур на странице (.gal_content)
				if (figsGallery.length < 4){									//если фигуры 3 (т.е. предыдущая прокрутка закончилась) тогда запускаем функцию прокрутки
					course = 'next';											//прокрутка вперед
					sourсeImgs = detectFonder(figGalleryClass);					//функция определения из какой папки сейчас фигуры на странице (класс фигур)
					ajaxPostImg(sourсeImgs, figGalleryClass, timeMove, course);	//ajax-запрос подгрузки следующей фигуры (папка-источник, класс фигур на странице, время анимации, направление)
				}
			}

			var gallery = document.querySelector('.box_gallery_content');		//переменная - контейнер фигур с изображениями

			gallery.onclick = function (event){				//назначаем обработчик клика по изображению через делегацию
				var target = event.target;					//получаем объект, на котором произошло событие
				while (target != this) {					//проверка "всплытия события" если клик не на самом контейнере
					if (target.tagName == 'IMG') {			//если клик на картинке
						bigImage.call(target);				//вызвать функцию bigImage в контексте this = img (инициатор события)
						return;								//возврат из функции если клик на картинке
					}
					target = target.parentNode;				//если на вложенных элементах перейти на уровень выше иерархии по циклу проверки
				}
			}

			function bigImage(){														//функция развертывания фигуры с изображением на весь экран
				var targetImgAbs = decodeURIComponent(this.src);						//получаем абсолютный адрес изображения
				var targetImg = relativeAdressImg(targetImgAbs);						//получаем относительный адрес
				var targetImgFC = parseAnswerFC(targetImg);								//получаем подпись к изображению
				createImg(targetImg, targetImgFC);										//создаем фигуру изображения
				var bigFixedDiv = document.querySelector('.big_image');					//получаем созданное изображение
					
				bigFixedDiv.onclick = function(){										//назначаем обработчик по клику на развернутое изображение
					bigFixedDiv.parentNode.removeChild(bigFixedDiv);					//удаляем развернутое изображенеи
					bigFixedDiv.onclick = null;											//удаляем обработчик
				}
				window.onkeydown = function(e){											//назначаем обработчик на нажатие клавиши ESC
					if (e.keyCode == 27) bigFixedDiv.parentNode.removeChild(bigFixedDiv); //если нажато ESC удалить развернутое изображение
					window.onkeydown = null;											//удалить обработчик
				}
			}
					
			function activeTab(tabs, activeClass){							//функция активации выбранного таба и деактивации остальных
					this.classList.add(activeClass);						//добавляем в выбранный таб класс activeClass
					for (let i = 0; i < tabs.length; i++){					//проверяем все табы по очереди
						if (tabs[i] === this) continue;						//если это "кликнутый" таб пропускаем его
						tabs[i].classList.remove(activeClass);				//с других табов убираем activeClass
					}
			}

			function parseAnswerImg(answer){								//функция преобразует строку ответа POST-запроса в массив ссылок (answer - строка ответа) (возвращает массив)
				var arrayAnswerI = answer.split('|');						//преобразуем в массив по разделителю |
				var reg = /^img.+[(\.jpg)(\.jpeg)(\.png)]$/i;				//регулярное выражение по выбору только ссылок из ответа
				for (let i = 0; i < arrayAnswerI.length; i++){				//обход полученного массива
					if (reg.test(arrayAnswerI[i])) continue;				//если удовлетворяет регулярн.выражению перейти к следующей строке массива
					arrayAnswerI.splice(i, 1);								//если не удовлетвряет удалить строку из массива
					i--;													//вернуться на шаг назад чтобы проверить повторно
					if (arrayAnswerI.length == 0) break;					//если массив пуст - остановить проверку
				}
				return arrayAnswerI;										//вернуть массив результата
			}

			function typeOfArray(Arr){										//функция проверки входных данных "массив это или нет?"
				if (!Array.isArray) {										//если функцию Array.isArray броузер не поддерживает
  					Array.isArray = function(arg) {							//тогда следующее выраженеи определяет её
   					return Object.prototype.toString.call(arg) === '[object Array]'; //взято с developer.mozilla.org WEB API
 					};
				}
				var isArr = Array.isArray(Arr);								//проверка входных данных на массив
				return isArr;												//возврат результата (true или false)
			}

			function parseAnswerFC(answerFC){								//функция выбирает из ссылок имена картинок и возвращает их (массив или строку, в зависимости от входного типа данных)
			 // var reg = /^(img.+)(\d\d_)(.*)((\.jpg)|(\.jpeg)|(\.png))$/i;//тоже рабочее выражение
				var reg = /^(img.+)(\d\d_)(.*)\.(jpg|jpeg|png)$/i;			//регулярное выражение по выбору только имена файла из строки ссылки 
				if (typeOfArray(answerFC)){									//функция проверяет массив на входе или нет
					var arrayAnswerFc = [];									//переменная результирующего массива
					for (let i = 0; i < answerFC.length; i++){				//обходим входной массив для проверки
						var nameFood = answerFC[i].replace(reg, '$3');		//выбираем только имя файла без номера и расширения по регул.выраж.
						arrayAnswerFc[i] = nameFood;						//ложим результат в результирующий массив
					}
				}
					else if (typeof(answerFC) == 'string'){					//если на входе строка
						var arrayAnswerFc = answerFC.replace(reg, '$3');	//выбираем только имя файла без номера и расширения
					}
						else arrayAnswerFc = 'f() parseAnswerFC, answerFC - Undefined data type...думай!'; //если тип данных не массив и не строка гдето в программе ошибка
				return arrayAnswerFc;										//вернуть результат (массив или строка)
			}

			function loadTabImgs(figGalleryClass, arrayAnswerImg, arrayAnswerFC){		 //функция загрузки изображений из папки (целевые фигуры, массив адресов картинок, массив подписей к ним)
				var figsGallery = document.querySelectorAll(figGalleryClass); 			 //выбираем массив фигур на странице (.gal_content)
				var figsImg = document.querySelectorAll(figGalleryClass + ' div img');	 //выбираем массив изображений в фигурах на странице
				var figsFC = document.querySelectorAll(figGalleryClass + ' figcaption'); //выбираем массивподписей к ним
				for (let i = 0; i < figsGallery.length; i++){							 //перебираем фигуры
					figsImg[i].src = arrayAnswerImg[i];									 //загружаем изображение из массива адрессов
					figsFC[i].innerHTML = arrayAnswerFC[i];								 //загружаем подписи к изображениям
				}
			}

			function hideFigGallery(figGalleryClass, arrayAnswerImg, arrayAnswerFC, timeOpasity){	//скрываем текущие картинки (целевые фигуры, массив адресов картинок, массив подписей к ним, время анимации)
				var figsGallery = document.querySelectorAll(figGalleryClass); 						//выбираем массив фигур на странице (.gal_content)
				var figsImg = document.querySelectorAll(figGalleryClass + ' div img');				//выбираем массив изображений в фигурах на странице
				var figsFC = document.querySelectorAll(figGalleryClass + ' figcaption');			//выбираем массивподписей к ним
				for (let i=0;  i < figsGallery.length; i++){										//обходим массив фигур
					var fIMGstyle = getComputedStyle(figsImg[i]);									//получаем стили текущего изображения
					figsImg[i].style.opacity = parseFloat(fIMGstyle.opacity) - 0.1;					//уменьшаем прозрачность на 10%
					var fFCstyle = getComputedStyle(figsFC[i]);										//получаем стили подписи к изображениям
					figsFC[i].style.opacity = parseFloat(fFCstyle.opacity) - 0.1;					//увеличиваем прозрачность на 10%
				}
				if ((figsImg[figsGallery.length - 1].style.opacity <= 0)&&(figsFC[figsGallery.length - 1].style.opacity <= 0)) { //если изображение и надпись полностью прозрачны
					if (timer_hide) clearInterval(timer_hide);										//если существует таймер скрытия - остановить его
					loadTabImgs(figGalleryClass, arrayAnswerImg, arrayAnswerFC);					//запустить функцию загрузки других изображений из папки (целевые фигуры, массив адресов картинок, массив подписей к ним)
					timer_show = setInterval(showFigGallery, timeOpasity, figsGallery, figsImg, figsFC); //запускаем таймер показа картинок (функция показа, время анимации, фигуры на странице, изображения, подписи)
				}
			}

			function showFigGallery(figsGallery, figsImg, figsFC){						//функция показа после загрузки изображений (фигуры на странице, изображения, подписи)
				for (let i=0;  i < figsGallery.length; i++){							//обходим массив фигур
					var fIMGstyle = getComputedStyle(figsImg[i]);						//получаем текущий стиль изображения
					figsImg[i].style.opacity = parseFloat(fIMGstyle.opacity) +0.1;		//уменьшаем прозрачность на 10%
					var fFCstyle = getComputedStyle(figsFC[i]);							//получаем текущий стиль подписи
					figsFC[i].style.opacity = parseFloat(fFCstyle.opacity) +0.1;		//уменьшаем прозрачность на 10%
				}
				if ((figsImg[figsGallery.length - 1].style.opacity >= 1)&&(figsFC[figsGallery.length - 1].style.opacity >= 1)) { //если изображение и надпись полностью непрозрачны
					if (timer_show) clearInterval(timer_show);							//если существует таймер показа - остановить его
				}
			}

			function ajaxPostTab(sourсeImgs, figGalleryClass, timeOpasity){						//ajax-запрос смены таба(папки-источника) f(источник. целевая фигураб время анимации)
				var request = new XMLHttpRequest();												//создаем новый запрос
				var params = 'fonder=' + sourсeImgs;											//параметры запроса "fonder=[папка-источник]"
				request.onreadystatechange = function(){										//когда прийдет ответ на запрос
					if ((request.readyState == 4)&&(request.status == 200)){					//readyState - фаза ответа (0-создан, 1-открыт. 2 отправлен, 3-получаю(многократно), 4-получен полностью)
																								//status - статус(код) ответа, 200 - успешный ответ
						var answerAllImages = request.responseText;								//сохраняем в переменную текст ответа (строка)
						var arrayAnswerImg = parseAnswerImg(answerAllImages);					//преобразуем в массив ссылок текст ответа
						var arrayAnswerFC = parseAnswerFC(arrayAnswerImg);						//формируем массив подписей к картинкам по адресам
						if (timer_hide) clearInterval(timer_hide);								//отменяем таймер скрытия если он работает
						if (timer_show) clearInterval(timer_show);								//отменяем таймер показа если он работает	
						timer_hide = setInterval(hideFigGallery, timeOpasity, figGalleryClass, arrayAnswerImg, arrayAnswerFC, timeOpasity);//таймер скрытия текущих изображений с вложенными функциями
					}															//перезагружаем табы из другой папки (целевые фигуры, массив адресов картинок, массив подписей к ним, время анимации)
				}
				request.open('POST', 'images.php', true);										//открываем запрос (тип:POST, скрипт-обработчик:images.php, асинхронно)
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');	//HTTP заголовок запроса
				request.send(params);															//отправляем запрос с параметром (params)
			}

			function detectFonder(figGalleryClass){										//функция определения из какой папки фигуры на странице (класс фигур)
				var figsImg = document.querySelectorAll(figGalleryClass + ' div img');	//массив изображений на странице
				var reg = /^(.*\/)(img.+)(\d\d_)(.*)((\.jpg)|(\.jpeg)|(\.png))$/i;		//регулярное выражение выбора пути к файлу
				var fonderFood = figsImg[0].src.replace(reg, '$2');						//выбираем по рег.выраж. только относительный путь к файлу (без имена файла)
				return fonderFood;														//возвращаем переменную с адресом папки
			}

			function relativeAdressImg(absAdressImg){									//функция возвращает абсолютный адрес из относительного
				var reg = /^(.*\/)(img.+)((\.jpg)|(\.jpeg)|(\.png))$/i;					//регулярное выражение поиска относительного адреса
				var relativeSrc = absAdressImg.replace(reg, '$2$3');					//выбираем относительный адрес по регул.выраж.
				return relativeSrc;														//возвращаем относительный адрес
			}

			function findAddImgSrc(arrayAnswerImg, figGalleryClass, course){			//возвращает адрес изображения, которое необходимо добавить (массив адресов всех изображений, класс фигур на странице, направление)
				var figsImg = document.querySelectorAll(figGalleryClass + ' div img');	//получаем массив всех изображений на странице
				var imgSrcAbs;															//переменная, которая будет хранить абсолютный адрес изображения
				var imgSrc;																//переменная, которая будет хранить относительный адрес изображения
				var addImgSrc;															//переменная, которая будет хранить относительный адрес добавляемого изображения
				if (course == 'next'){													//если направление прокрутки "вперед"
					imgSrcAbs = decodeURIComponent(figsImg[2].src);						//получаем абсолютный адрес третьего изображения на странице (с декодерированием символов(пробел и т.д.))
					imgSrc = relativeAdressImg(imgSrcAbs);								//получаем относительный адрес (абсолютный адрес)
					for (let i = 0; i < arrayAnswerImg.length; i++){					//перебираем массив всех адресов изображений в папке
						if (imgSrc != arrayAnswerImg[i]) continue;						//если это не третье изображение пропускаем его
						if (imgSrc == arrayAnswerImg[arrayAnswerImg.length - 1]) addImgSrc = arrayAnswerImg[0];	//если это последнее изображение в папке, тогда addImgSrc присваеваем адрес первого
							else addImgSrc = arrayAnswerImg[i + 1];						//иначе возвращаем адрес следующего изображения
					}
				}
				if (course == 'previous'){												//если направление прокрутки "назад"
					var imgSrcAbs = decodeURIComponent(figsImg[0].src);					//получаем абсолютный адрес первого изображения на странице (с декодерированием символов(пробел и т.д.))
					var imgSrc = relativeAdressImg(imgSrcAbs);							//получаем относительный адрес (абсолютный адрес)
					for (let i = 0; i < arrayAnswerImg.length; i++){					//перебираем массив всех адресов изображений в папке
						if (imgSrc != arrayAnswerImg[i]) continue;						//если это не первое изображение пропускаем его
						if (imgSrc == arrayAnswerImg[0]) addImgSrc = arrayAnswerImg[arrayAnswerImg.length - 1];	//если это первое изображение в папке, тогда addImgSrc присваеваем адрес последнего
							else addImgSrc = arrayAnswerImg[i - 1];						//иначе возвращаем адрес предидущего изображения
					}
				}
			return addImgSrc;															//возвращаем переменную с относительным адресом добавляемого изображения
			}

			function getWidthFig(elem){												//возвращает ширину фигуры (фигура)
				var styleEl = getComputedStyle(elem);								//получаем текущие стили фигуры
				var elW = parseFloat(styleEl.width);								//получаем ширину
				var elM = parseFloat(styleEl.marginLeft) + parseFloat(styleEl.marginRight); //получаем margin'ы
				// var elB = parseFloat(styleEl.borderLeftWidth) + parseFloat(styleEl.borderRightWidth);	//если нужно то и border'ы
				// var elP = parseFloat(styleEl.paddingLeft) + parseFloat(styleEl.paddingRight);			//и padding'и
				var fullWidthEl = Math.round(elW + elM);							//складываем размеры и получаем полную ширину
				return fullWidthEl;													//возвращаем ширину
			}

			function factoryFigure(figGalleryClass, srcImg, innerFC, course){		//создает и добавляет фигуру с изображением и подписью на страницу (класс фигур на странице, адрес изображения, подпись к изображению, направление)
				var fig = document.createElement('figure');							//создаем элемент figure
				fig.classList.add('gal_content');									//добавляем ему класс gal_content
				var figDiv = document.createElement('div');							//создаем элемент div
				fig.appendChild(figDiv);											//добавляем div в figure
				var figImg = document.createElement('img');							//создаем элемент img
				figImg.src = srcImg;												//устанавливаем его адрес по srcImg
				figDiv.appendChild(figImg);											//добавляем img в div
				var figFC = document.createElement('figcaption');					//создаем элемент figcaption
				figFC.innerHTML = innerFC;											//вставляем в него подпись к картинке
				fig.appendChild(figFC);												//добавляем figcaption в figure
				var figOnPage = document.querySelector(figGalleryClass);			//получаем первую фигуру на странице
				var fullWidthFig = getWidthFig(figOnPage);							//получаем ширину фигуры (фигура)
				var boxGallery = figOnPage.parentNode;								//получаем родительский контейнер фигур с изображениями
				if (course == 'next') boxGallery.appendChild(fig)					//если направление "вперед" добавляем созданную фигуру в конец ряда
					else if (course == 'previous') {								//иначе если анправление "назад"
						var offsetLeftFigs = -fullWidthFig + 'px';					//устанавливаем смещение фигур как отрицательную ширину
						boxGallery.insertBefore(fig, boxGallery.firstChild);		//добавляем созданную фигуру в начало ряда
						var figsOnPage = document.querySelectorAll(figGalleryClass);//получаем массив фигур на странице
						for (let i = 0; i < figsOnPage.length; i++){				//обходим массив фигур
							figsOnPage[i].style.left = offsetLeftFigs;				//устанавливаем каждой фигруре отрицательное смещение влево на ширину
						}
					}
				return fullWidthFig;												//возвращаем из функции ширину фигуры
			}

			function destroyFigure(figGalleryClass, fullWidthFig, course){			// функция удаления крайней фигуры (класс фигур, ширина, направление)
				 clearInterval(timer_move);											//останавливаем таймер
				 var figsOnPage = document.querySelectorAll(figGalleryClass);		//получаем массив фигур на странице
				 if (course == 'next') {											//если прокрутка "вперед"
				 	figsOnPage[0].parentNode.removeChild(figsOnPage[0]);			//удаляем первую фигуру в ряду
				 	for (let i = 1; i < figsOnPage.length; i++){					//обходим массив фигур
				 		figsOnPage[i].style.left = (parseFloat(getComputedStyle(figsOnPage[i]).left) + fullWidthFig) + 'px';	//смещаем оставшиеся фигуры на одну ширину
				 	}
				 } else if (course == 'previous') {									//если прокрутка "назад"
				 	figsOnPage[figsOnPage.length - 1].parentNode.removeChild(figsOnPage[figsOnPage.length - 1]);	//удаляем последнюю фигуру в ряду
				 }
			}

			function moveFigure(figGalleryClass, fullWidthFig, course){							//функция анимации прокрутки (класс фигур на странице, добавляемая фигура, направление)
				var figsOnPage = document.querySelectorAll(figGalleryClass);					//получаем массив фигур на странице
				var frameOffset = fullWidthFig/20;												//величина смещения за один кадр
				if (course == 'next') {															//если прокрутка "вперед"
					for (let i = 0; i < figsOnPage.length; i++){								//обходим массив фигур на странице
						figsOnPage[i].style.left = (parseFloat(getComputedStyle(figsOnPage[i]).left) - frameOffset) + 'px';	//получаем текущее смещение фигур left и уменьшаем на кадр влево
						if (parseFloat(figsOnPage[figsOnPage.length - 1].style.left) <= -fullWidthFig) destroyFigure(figGalleryClass, fullWidthFig, course);
					}														//если смещение фигуры на величину ширины произошло тогда запустить функцию удаления крайней фигуры destroyFigure(класс фигур, ширина, направление)
				} else if (course == 'previous') {												//если прокрутка "назад"
					for (let i = 0; i < figsOnPage.length; i++){								//обходим массив фигур на странице
						figsOnPage[i].style.left = (parseFloat(getComputedStyle(figsOnPage[i]).left) + frameOffset) + 'px';	//получаем текущее смещение фигур left и увеличиваем на кадр вправо
						if (parseFloat(figsOnPage[figsOnPage.length - 1].style.left) >= 0) destroyFigure(figGalleryClass, fullWidthFig, course);
					}														//если смещение фигуры на величину ширины произошло тогда запустить функцию удаления крайней фигуры destroyFigure(класс фигур, ширина, направление)
				}
			}

			function ajaxPostImg(sourсeImgs, figGalleryClass, timeMove, course){					//ajax-запрос подгрузки следующей фигуры (папка-источник, класс фигур на странице, время анимации, направление)
				var request = new XMLHttpRequest();													//создаем объект запроса
				var params = 'fonder=' + sourсeImgs;												//параметры запроса "fonder=[папка-источник]"
				request.onreadystatechange = function(){											//когда будет получен ответ
					if ((request.readyState == 4)&&(request.status == 200)){						//readyState - фаза ответа (0-создан, 1-открыт. 2 отправлен, 3-получаю(многократно), 4-получен полностью)
																									//status - статус(код) ответа, 200 - успешный ответ
						var answerAllImages = request.responseText;									//сохраняем в переменную строку ответа
						var arrayAnswerImg = parseAnswerImg(answerAllImages);						//преобразуем в массив ссылок текст ответа
						var addImgSrc = findAddImgSrc(arrayAnswerImg, figGalleryClass, course);		//получаем адрес изображения, которое необходимо добавить (массив адресов всех изображений, класс фигур на странице, направление)
						var addImgFC = parseAnswerFC(addImgSrc);									//получаем подпись к изображению (адрес изображения)
						var fullWidthFig = factoryFigure(figGalleryClass, addImgSrc, addImgFC, course);	//добавляем фигуру с изображением и подписью на страницу (класс фигур на странице, адрес изображения, подпись к изображению, направление)
						timer_move = setInterval(moveFigure, timeMove, figGalleryClass, fullWidthFig, course);	//запускаем таймер анимации прокрутки через функцию moveFigure(класс фигур на странице, добавляемая фигура, направление)
					}
				}
				request.open('POST', 'images.php', true);											//открываем запрос (тип:POST, скрипт-ответчик, асинхронно)
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');		//заголовки запроса
				request.send(params);																//отправляем запрос с параметрами
			}

			function createImg(targetImg, targetImgFC){					//функция создания изображения во весь экран (адрес целевой картинки, надпись под ней)
				var bigDiv = document.createElement('div');				//создаем элемент div
				bigDiv.classList.add('big_image');						//добавляем ему класс big_image
				var fig = document.createElement('figure');				//создаем элемент figure
				fig.classList.add('gal_content');						//добавляем ему класс gal_content
				bigDiv.appendChild(fig);								//добавляем figure в div
				var figDiv = document.createElement('div');				//создаем вложенный div в figure
				fig.appendChild(figDiv);								//добавляем вложенный div в figure
				var figImg = document.createElement('img');				//создаем элемент img
				figImg.src = targetImg;									//устанавливаем адрес картинки targetImg
				figDiv.appendChild(figImg);								//добавляем img в div
				var figFC = document.createElement('figcaption');		//создаем элемент figcaption
				figFC.innerHTML = targetImgFC;							//добавляем в него подпись targetImgFC
				fig.appendChild(figFC);									//добавляем figcaption в figure
				document.querySelector('body').insertBefore(bigDiv, document.querySelector('body').firstChild);	//вставляем на страницу (в body) всю итоговую конструкцию
			}

	})();			//*****END*****СЛАЙДЕР FOOD

//СЛАЙДЕР CUSTOMERS
	(function(){
		var btnleft = document.querySelector('.cust_p_left');			//получаем кнопку прокрутки влево
		var btnRight = document.querySelector('.cust_p_right');			//получаем нопку прокрутки вправо
		var fonderCust = 'img/05_customers/';							//папка с изображениями и отзывами посетителей
		var course;														//направление вращения слайдера
		var timer_hide_cust;											//таймер увеличения прозрачности
		var timer_show_cust;											//таймер уменьшения прозрачности
		var timeHideShow = 50;											//время кадра анимации

		btnleft.onclick = function(){									//назначаем обработчик левой кнопке слайдера
			if ((!timer_hide_cust)&&(!timer_show_cust)){				//если таймеры сейчас не работают
				course = 'previous';									//нарпвление вращения - "назад"
				ajaxPostImg(fonderCust, course, timeHideShow);			//функция ajax-запрос (папка с посетителями, направление, время анимации)
			}
		}

		btnRight.onclick = function(){									//назначаем обработчик левой кнопке слайдера
			if ((!timer_hide_cust)&&(!timer_show_cust)){				//если таймеры сейчас не работают
				course = 'next';										//нарпвление вращения - "вперед"
				ajaxPostImg(fonderCust, course, timeHideShow);			//функция ajax-запрос (папка с посетителями, направление, время анимации)
			}
		}

		function parseAnswerImg(answer){								//функция выделения массива адресов изображений из теста ответа (текст ответа)
			var reg = /^(.*)(img.*)(\d\d_)(.+)((\.jpg)|(\.jpeg)|(\.png))$/i;	//рег.выражение
			var arrayAnswer = answer.split('|');						//разбить ответ в массив по разделителю "|"
			for (let i = 0; i < arrayAnswer.length; i++){				//обойти массив
				if (reg.test(arrayAnswer[i])) continue;					//если элемент массива соотв. рег.выражению пропустить дальнейшие действия и перейти к следующему
				arrayAnswer.splice(i, 1);								//если нет - удалить элемент
				i--;													//проверить повторно эту ячейку
				if (arrayAnswer.length == 0) break;						//если массив опустел - остановиться
			}
			return arrayAnswer;											//вернуть разельтирующий  массив
		}

		function getTextSrc(imgSrc){										//функция получения адреса отзыва посетителя (адрес изображения)
			var reg = /(\.jpg)|(\.jpeg)|(\.png)/i;							//рег.выражение
			var textSrc = imgSrc.replace(reg, '.txt')						//меняем в адресе изображения расширение на .txt
			return textSrc;													//возвращаем адрес отзыва
		}

		function getTextFC(imgSrc){											//функция получения имени-заголовка (адрес-изображения)
			var reg = /^(.*)(img.*)(\d\d_)(.+)((\.jpg)|(\.jpeg)|(\.png))$/i;//рег.выражение
			var textFC = imgSrc.replace(reg, '$4');							//получаем имя посетитяля из имени файла
			return textFC;													//возвращаем имя
		}

		function cutAnswer(answer){											//функция получеия текст отзыва без возможной лишней информации от сервера (текст ответа)
			var arrayAnswer = answer.split('|');							//разбиваем ответ в массив по разделителю "|"
			var resultAnswer = arrayAnswer[0];								//берем тольео первый элемент массива
			return resultAnswer;											//возвращаем его
		}


		function reloadFigText(textFC, cleanAnswer, timeHideShow){			//функция загрузки отзыва посетителя (заголовок - имя посетителя, текст отзыва, время анимации)
			var name = document.querySelector('.sl_cust_caption figcaption h5');	//получаем заголовок с именем
			var text = document.querySelector('.sl_cust_caption figcaption div');	//получаем контейнер с текстом отзыва
			name.innerHTML = textFC;										//меняем имя в заголовке
			text.innerHTML = cleanAnswer;									//меняем текст отзыва
			timer_show_cust = setInterval(showCust, timeHideShow);			//запускаем таймер с функцией показа [уменьшением прозрачности] элементов
		}

		function ajaxPostLoadText(imgSrc, timeHideShow){						//функцию ajax-запроса с загрузкой текста отзыва посетителя (адрес второго изображения, время анимации)
			var imgSrc = decodeURIComponent(imgSrc);							//декодируем адрес изображения
			var textSrc = getTextSrc(imgSrc);									//получаем адрес отзыва (адрес изображения)
			var textFC = getTextFC(imgSrc);										//получаем имя-заголовок (адрес изображения)

			var request = new XMLHttpRequest();									//создаем объект запроса
			var params = 'txt=' + textSrc;										//параметры зароса с адресом текста отзыва
			request.onreadystatechange = function(){							//когда получен отзыв
				if ((request.readyState == 4)&&(request.status == 200)){		//если отзыв успешный
					if ((!timer_hide_cust)&&(!timer_show_cust)){				//если в данный момент не работают таймеры
						var answer = request.responseText;						//тест ответа
						var cleanAnswer = cutAnswer(answer);					//получаем текст отзыва без возможной лишней информации от сервера (текст ответа)
						reloadFigText(textFC, cleanAnswer, timeHideShow);		//запускаем функцию загрузки отзыва посетителя (заголовок - имя посетителя, текст отзыва, время анимации)
					}
				}
			}
			request.open('POST', 'text_from_notepad.php', true);				//открываем ajax-запрос
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');//заголовки запроса
			request.send(params);												//отправляем запрос
		}

		function relativeAdress(absSrc){											//функция получения относительного адреса из абсолютного
			var reg = /^(.*)(img.*)(\d\d_)(.+)((\.jpg)|(\.jpeg)|(\.png))$/i;		//рег.выражение
			var relSrc = absSrc.replace(reg, '$2$3$4$5');							//убираем из адреса все, что до img
			return relSrc;															//возвращаем результат
		}

		function loadNextImg(arrayAnswerImg, course, timeHideShow){					//функция загрузки других изображений (массив адресов изображений, направление, время анимации)
			var people = document.querySelectorAll('.c_ims img');					//получаем все фотографии посетителей на странице
			if (course == 'next'){													//если направение вращения - "вперед"
				var absSrc = decodeURIComponent(people[2].src);						//декодируем адрес последнего изображения
				var relSrcPeople = relativeAdress(absSrc);							//получаем из абсолютного адреса - относительный
				for (let i = 0; i < arrayAnswerImg.length; i++){					//обходим массив изображений
					if (relSrcPeople != arrayAnswerImg[i]) continue;				//если последнее фото на странице не совпадает с элементом массива переходим к проверке следующего
						people[0].src = people[1].src;								//если найдено фото, то первому присваем адрес второго
						people[1].src = people[2].src;								//второму - третьего
					if (relSrcPeople == arrayAnswerImg[arrayAnswerImg.length - 1]) {	//если это адрес последнего изображения в массиве
						people[2].src = arrayAnswerImg[0];							//тогда последнему адрес первого
					} else{
						people[2].src = arrayAnswerImg[i + 1];						//иначе - адрес следующего
					}
				}
			}
			if (course == 'previous'){												//если направление вращения - "назад"
				var absSrc = decodeURIComponent(people[0].src);						//декодируем адрес первого изображения
				var relSrcPeople = relativeAdress(absSrc);							//получаем из абсолютного адреса - относительный
				for (let i = 0; i < arrayAnswerImg.length; i++){					//обходим массив изображений
					if (relSrcPeople != arrayAnswerImg[i]) continue;				//если первое фото на странице не совпадает с элементом массива переходим к проверке следующего
						people[2].src = people[1].src;								//если найдено фото, то последнему фото присваем адрес второго
						people[1].src = people[0].src;								//второму - первого
					if (relSrcPeople == arrayAnswerImg[0]) {						//если это адрес первого изображения в массиве
						people[0].src = arrayAnswerImg[arrayAnswerImg.length - 1];	//тогда первому адрес последнего
					} else{
						people[0].src = arrayAnswerImg[i - 1];						//иначе - адрес предидущего
					}
				}
			}
			ajaxPostLoadText(people[1].src, timeHideShow);							//запускаем функцию ajax-запроса с загрузкой текста отзыва посетителя (адрес второго изображения, время анимации)
		}

		function showCust(){														//функцией показа [уменьшением прозрачности] элементов
			var people = document.querySelectorAll('.c_ims img');					//массив изображений посетителей на странице
			var name = document.querySelector('.sl_cust_caption figcaption h5');	//заголовок с именем посетителя
			var text = document.querySelector('.sl_cust_caption figcaption div');	//отзыв посетителя
			var nameStyle = getComputedStyle(name);									//получаем стили заголовка
			name.style.opacity = parseFloat(nameStyle.opacity) + 0.1;				//уменьшем прозрачность заголовка на 10%
			var textStyle = getComputedStyle(text);									//получаем стили отзыва
			text.style.opacity = parseFloat(textStyle.opacity) + 0.1;				//уменьшем прозрачность заголовка на 10%
			for (let i = 0; i < people.length; i++){								//обходим массив изображений
				if ((i == 1)&&(parseFloat(getComputedStyle(people[i]).opacity) >= 0.6)) continue;	//если у второго изображения прозрачность уже 60% пропускаем его (дальше не увеличиваем)
				var style = getComputedStyle(people[i]);							//получаем стили изображения посетителя
				people[i].style.opacity = parseFloat(style.opacity) + 0.1;			//уменьшаем прозрачность на 10%
				if  (parseFloat(getComputedStyle(people[1]).opacity) >= 0.3) people[1].parentNode.classList.add('active_c_ims');	//если прозрачность 2-го изображения упала до 30% добавить класс "активный"
			}
			if ((timer_show_cust)&&(getComputedStyle(people[people.length - 1]).opacity >= 1)&&(getComputedStyle(name).opacity >= 1)&&(getComputedStyle(text).opacity >= 1)){	//если таймер существует и все элементы уже непрозрачны
				clearInterval(timer_show_cust);										//останавливаем таймер
				timer_show_cust = undefined;										//удаляем таймер
			}
		}

		function hideCust(arrayAnswerImg, course, timeHideShow){					//функция скрытия (массив адресов изображений, направление, время анимации)
			var people = document.querySelectorAll('.c_ims img');					//массив изображений посетителей на странице
			var name = document.querySelector('.sl_cust_caption figcaption h5');	//заголовок с именем посетителя
			var text = document.querySelector('.sl_cust_caption figcaption div');	//отзыв посетителя
			var nameStyle = getComputedStyle(name);									//получаем стили заголовка
			name.style.opacity = parseFloat(nameStyle.opacity) - 0.1;				//увеличиваем прозрачность заголовка на 10%
			var textStyle = getComputedStyle(text);									//получаем стили отзыва
			text.style.opacity = parseFloat(textStyle.opacity) - 0.1;				//увеличиваем прозрачность отзыва на 10%
			for (let i = 0; i < people.length; i++){								//обходим массив изображений
				var style = getComputedStyle(people[i]);							//получаем стили изображения посетителя
				people[i].style.opacity = parseFloat(style.opacity) - 0.1;			//увеличиваем прозрачность на 10%
			}
			if (parseFloat(getComputedStyle(people[1]).opacity) <= 0.3) people[1].parentNode.classList.remove('active_c_ims');	//если прозрачность 2-го изображения увеличилась до 30% убрать класс "активный"
			if ((timer_hide_cust)&&(getComputedStyle(people[people.length - 1]).opacity <= 0)&&(getComputedStyle(name).opacity <= 0)&&(getComputedStyle(text).opacity <= 0)){	//если таймер существует и все элементы уже прозрачны
				clearInterval(timer_hide_cust);										//остановить таймер
				timer_hide_cust = undefined;										//удалить таймер
				loadNextImg(arrayAnswerImg, course, timeHideShow);					//функция загрузки других изображений (массив адресов изображений, направление, время анимации)
			}
		}

		function ajaxPostImg(fonderCust, course, timeHideShow){					//функция ajax-запрос (папка с посетителями, направление, время анимации)
			var request = new XMLHttpRequest();									//создаем новый объект запроса
			var params = 'fonder=' + fonderCust;								//параметры запроса
			request.onreadystatechange = function(){							//когда прийдет отзыв
				if ((request.readyState == 4)&&(request.status == 200)){		//если отзыв успешный
					var answer = request.responseText;							//содержимое ответа
					var arrayAnswerImg = parseAnswerImg(answer);				//выделяем массив адресов изображений с ответа (текст ответа)
					if ((!timer_hide_cust)&&(!timer_show_cust)){				//если таймеры в данный момент не работают
						timer_hide_cust = setInterval(hideCust, timeHideShow, arrayAnswerImg, course, timeHideShow); //запустить таймер с функцией скрытия (массив адресов изображений, направление, время анимации)
					}
				}
			}
			request.open('POST', 'images.php', true);							//открываем запрос
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded') //заголовки запроса
			request.send(params);												//отправляем запрос
		}
	})();			//*****END*****СЛАЙДЕР CUSTOMERS
}
