import '../scss/app.scss';

/* Your JS Code goes here */

let baseToDo = [
  { content: 'Попить чайку', done: true, importantly: false },
  { content: 'Прочитать, что такое JAVASCRIPT', done: false, importantly: true },
  { content: 'Отправить тестовое задание на курсы SENLA до 1 марта', done: false, importantly: false },
  { content: 'Записаться на курсы по REACT JS от SENLA', done: false, importantly: false },
  { content: 'Проснуться', done: true, importantly: false },
];

const newTask = document.getElementById('newTask');
const addNewTask = document.getElementById('addNewTask');
const listToDo = document.querySelector('.listToDo');
const enterTasks = document.querySelector('.enterTasks');
const searchTasks = document.getElementById('searchTasks');
const btnStatusTasks = document.querySelector('.btnStatus');

//фокус на поле ввода
newTask.focus();

//При прогрузке страницы построить список в соответствии с имеющийся базой
document.addEventListener('DOMContentLoaded', function () {
  //Проверяем наличие хранилища и при наличии переписываем базу.
  if (localStorage.repository){
    let baseJson = JSON.parse(localStorage.getItem('repository'));
    baseToDo = baseJson;
  }
  //Создаём список исходя из базы
  createTasks(baseToDo);
});

//Отрисовка новых элементов на странице
function createTasks(base) {
  for (let i = 0; i < base.length; i++)  {
    listToDo.innerHTML += `
         <div  class="listElem" tabindex="0">
        
                      <span class="star">&#9734;</span>
        
                        <p>${base[i].content}</p>
        
                        <a class="mark" tabindex="0">
                            MARK IMPORTANT
                        </a>
        
                        <img alt='Удаление' src="images/content/Delete.png" class="deleteTask" tabindex="0" />

                    </div>
        `;
    if (base[i].done) {
      document.querySelectorAll('.listElem span')[i].classList.add('done');
      document.querySelectorAll('.listElem p')[i].classList.add('done');
      document.querySelectorAll('.mark')[i].classList.add('hidden');

    }
    if (base[i].importantly) {
      document.querySelectorAll('.mark')[i].innerHTML = 'NOT IMPORTANT';
      document.querySelectorAll('.mark')[i].classList.add('mark_tagged');
      document.querySelectorAll('.star')[i].classList.add('star_visible');
      document.querySelectorAll('.listElem p')[i].classList.add('bold_Task');
    }
  }
}

searchTasks.addEventListener('input', function (e) {
  let searchValue = e.target.value.toUpperCase();
  //фильтруем по выполненным задачам
  // обнуляем действие
  e.preventDefault();
  //удаляем список
  cleanVisualTasks (listToDo);

  let resultSearch = baseToDo.filter(value => value.content.toUpperCase().includes(searchValue));
  createTasks(resultSearch);

  if (e.keyCode === 13) {
    e.preventDefault();
  }
  searchTasks.addEventListener('blur',  (e) => {
    searchTasks.value = '';
  });
});

// при клике на кнопку добавить новую задачу, обрабатываем
addNewTask.addEventListener('click', function (e) {
  addNewTasks(e)
});
//при нажатии enter в инпуте, добавляем новую задачу
newTask.addEventListener('keydown', function (e) {
  if(e.keyCode === 13) {
    addNewTasks(e)
  }
});

//функция отвечающая за приёмку, обработку , контроля и добавлению новых задач
function addNewTasks(e) {
  // обнуляем действие кнопки
  e.preventDefault();
  //проверяем на пустоту
  if (newTask.value.length >=1) {
    // создаём временную переменную для последующей записи
    let push = {content:'', done: false, importantly: false};
    //Записываем значение ввода, предварительно сделав первую букву большую
    push.content = capitalizeFirstLetter (String(newTask.value));
    // добавляем новую задачу в основной список
    baseToDo.unshift(push);
    //отправляем обновлённый архив  в хранилище
    localStorage.setItem('repository',JSON.stringify(baseToDo));
    //удаляем список
    cleanVisualTasks (listToDo);
    //делаем новый
    createTasks(baseToDo);
    //стираем пустое поле
    newTask.value = '';
    //возращаем фокус на поле ввода
    newTask.focus();
    if (document.querySelector('.activeTasks').classList.contains('activStatus')) {
      clickActiveTasks();
    }
  } else newTask.focus();   //добавить предупреждение с просьбой ввода
}

//Обработчик на наведение мыши
listToDo.addEventListener('mouseover', function (event) {
  let target = event.target;
  if (target.closest('.listElem') !== null) {
    let delTask = target.closest('.listElem').querySelector('.deleteTask'),
        mark    = target.closest('.listElem').querySelector('.mark');
    //Находим высплывающие кнопки и делаем видимыми
    mark.classList.add('visable');
    delTask.classList.add('visable');

    //Убираем видимость всплывающих кнопок при отведении мыши
    listToDo.addEventListener('mouseout', function () {
      mark.classList.remove('visable');
      delTask.classList.remove('visable');
    });
  }
} );

//обработчик на клик мыши по кнопкам переключения сортировок
btnStatusTasks.addEventListener('click', (e) => sortTypeTasks(e));

const sortTypeTasks = (e) => {
  let target = e.target;

  e.preventDefault();
  if (target.classList.contains('allTasks')) {
    //очистка задач с экрана
    cleanVisualTasks(listToDo);
    //переношу полосочку над кнопкой
    btnStatusTasks.querySelector('.activeTasks ').classList.remove('activStatus');
    btnStatusTasks.querySelector('.completedTasks ').classList.remove('activStatus');
    btnStatusTasks.querySelector('.allTasks  ').classList.add('activStatus');
    enterTasks.classList.remove('noneDisplay');

    createTasks(baseToDo)
  } else  if (target.classList.contains('activeTasks')) {
    //переношу полосочку над кнопкой
    btnStatusTasks.querySelector('.activeTasks ').classList.add('activStatus');
    btnStatusTasks.querySelector('.completedTasks ').classList.remove('activStatus');
    btnStatusTasks.querySelector('.allTasks  ').classList.remove('activStatus');
    enterTasks.classList.remove('noneDisplay');

    clickActiveTasks();
  } else if (target.classList.contains('completedTasks')) {
    //переношу полосочку над кнопкой
    btnStatusTasks.querySelector('.activeTasks ').classList.remove('activStatus');
    btnStatusTasks.querySelector('.completedTasks ').classList.add('activStatus');
    btnStatusTasks.querySelector('.allTasks  ').classList.remove('activStatus');
    enterTasks.classList.add('noneDisplay');
    clickDoneTasks()
  }
};

//сортируем по не выполненному
const clickActiveTasks = () => {

  //фильтруем по выполненным задачам
  let ActiveTasks = baseToDo.filter(doneTask => doneTask.done === false);
  //очистка задач с экрана
  cleanVisualTasks(listToDo);
  //создаём измененный список
  createTasks(ActiveTasks);
};

//сортируем по выполненному
const clickDoneTasks = () => {
  //фильтруем по выполненным задачам
  let doneTasks = baseToDo.filter(doneTask => doneTask.done === true);
  //очистка задач с экрана
  cleanVisualTasks(listToDo);
  //создаём измененный список
  createTasks(doneTasks)
};

//Обработчик на клик мыши по задачас
listToDo.addEventListener("click", (e) => toggleDone(e));

//Логика редактирования задач
const toggleDone = (e) => {
  let target = e.target,
      list = target.closest('.listElem');

  // кликнули на область задачи
  if (target.closest('.listElem') !== null) {
    if (target.matches("div") || target.matches('p') || target.matches('span')) {
      //переходим к фукции обработчику
      doneTask(list)
    } else if (target.matches("img")) { //кликнули на удаление
      //определяем номер задачи
      let numberTask = serchNumberTask(baseToDo, list);
      //удаляем выбранную задачу из главного массива
      baseToDo.splice(numberTask, 1);
      //отправляем обновлённый архив  в хранилище
      localStorage.setItem('repository',JSON.stringify(baseToDo));
      //Удаляем задачу со страницы
      // list.remove();
      if (list.parentNode) {
        list.parentNode.removeChild(list);
      }

    } else if (target.matches("a")) { //кликнули на ссылку "mark"
      //переходим к фукции обработчику
      markEvent(list)
    }
  }
};

//Функция обработки готовности задачи
function doneTask(context) {
  //определяем номер задачи
  let numberTask = serchNumberTask(baseToDo, context);
  //меняем значения
  if ( baseToDo[numberTask].done){
    baseToDo[numberTask].done = false;
    context.querySelector('.star').classList.remove('done');
    context.querySelector('.listElem p').classList.remove('done');
    context.querySelector('.mark').classList.remove('hidden');


  } else {
    baseToDo[numberTask].done = true;
    context.querySelector('.star').classList.add('done');
    context.querySelector('.listElem p').classList.add('done');
    context.querySelector('.mark').classList.add('hidden');
  }
  //отправляем обновлённый архив  в хранилище
  localStorage.setItem('repository',JSON.stringify(baseToDo));

  if (document.querySelector('.activeTasks').classList.contains('activStatus') || document.querySelector('.completedTasks').classList.contains('activStatus')) {
    if (context.parentNode) {
      context.parentNode.removeChild(context);
    }}
}

//функция обработки "важности " задачи
function markEvent(context) {
  //определяем номер задачи
  let numberTask = serchNumberTask(baseToDo, context);
  //меняем значения
  if ( baseToDo[numberTask].importantly) {

    baseToDo[numberTask].importantly = false;
    context.querySelector('.mark').innerHTML = 'MARK IMPORTANT';
    context.querySelector('.mark').classList.remove('mark_tagged');
    context.querySelector('.star').classList.remove('star_visible');
    context.querySelector('.listElem p').classList.remove('bold_Task');
  } else {
    baseToDo[numberTask].importantly = true;
    context.querySelector('.mark').innerHTML = 'NOT IMPORTANT';
    context.querySelector('.mark').classList.add('mark_tagged');
    context.querySelector('.star').classList.add('star_visible');
    context.querySelector('.listElem p').classList.add('bold_Task');
  }
  //отправляем обновлённый архив  в хранилище
  localStorage.setItem('repository',JSON.stringify(baseToDo));
  //Удаляем визуально в нужных вкладках
 /* if (document.querySelector('.activeTasks').classList.contains('activStatus') || document.querySelector('.completedTasks').classList.contains('activStatus')) {
    if (context.parentNode) {
      context.parentNode.removeChild(context);
    }}*/
}

//функция очистки отображаемых задач
function cleanVisualTasks(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

//Функция делает первую букву ввода большой
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

//Функция ищет порядковый номер нажатой задачи в базе.
const serchNumberTask = (base, choise) => {
  let i = 0;
  for (i; i <= base.length; i++) {
    if (base[i].content === choise.querySelector('p').innerHTML) {
      break;
    }
  }
  return i
};
