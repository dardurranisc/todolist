//Поле "Введите задачу"
const inputButton = document.getElementById('btn-input');
//Кнопка "Добавить задачу"
const addButton = document.getElementById('btn-add');
//Создание кнопки "Выбрать все"
const selectAllButton = document.createElement('button');
//Кнопка "Удалить выполненные"
const deletedAllButton = document.createElement('button');
deletedAllButton.classList.add('delete-all');
deletedAllButton.textContent = "Удалить выполненные";
//Получение блока с заданиями
const ul = document.getElementById('add-list');
//Получение элементов кнопки
const filterButtons = document.querySelectorAll('.filter__link > a');
//Получение Футера
const footer = document.getElementById('footer');
//Массив заданий
let tasks = [];
//Массив отфильтрованных задач
let filteredTasks = [];
//Начальное значение задач
let activeTasksCount = 0;
//Дефолтный статус ALL
let filterStatus = 'all';
//Фильтр для кнопки "Выбрать все"
let isAllSelected = false;
// Состояние для функции saveEditTask
let isSaveEditTask = false;
//Сохраненные задачи
const savedTasks = localStorage.getItem('tasks');


//Сохранения задач в локальном хранилище 
function saveTasks(){
	localStorage.setItem('tasks',JSON.stringify(tasks));
}


//Загрузка задач
function loadTasks(){
	if(savedTasks){
		tasks = JSON.parse(savedTasks);
		showFilteredTask();
	}
}


// Счетчик
function updateCount(){
	const activeTasks = tasks.filter(task => !task.completed).length;
	document.getElementById('todo-count').textContent = `${activeTasks} : items left`;
	activeTasksCount = activeTasks;
}


// Функция добавления задачи
function addNewTask(){
	if(inputButton.value.trim() === ""){
		alert('Введите задачу');
		return;
	}
	let newTask = {
		id:Date.now(),
		text:inputButton.value,
		completed:false
	}
	tasks.unshift(newTask);
	inputButton.value = '';
	saveTasks();
	updateCount();
	showFilteredTask();
}
function getFilteredTasks() {
	if(filterStatus === 'active'){
		filteredTasks = tasks.filter( task => !task.completed === true );
	}else if(filterStatus === 'completed'){
		filteredTasks = tasks.filter( task => task.completed === true )
	}else{
		filteredTasks = tasks;
	}
}
//Отрисовка задач 
function showFilteredTask(){
	let filteredTask = getFilteredTasks();
	ul.innerHTML = '';
	filteredTasks.forEach(task => {
		//Создание тега li
		const li = document.createElement('li');
		ul.appendChild(li);
		
		//Чек бокс
		const checkBox = document.createElement('input');
		li.appendChild(checkBox);
		checkBox.setAttribute('type','checkbox');
		checkBox.setAttribute('class' , 'checkbox');
		checkBox.checked = task.completed;

		//Изменение состояния чек бокса
		checkBox.addEventListener('change',() => {
			task.completed = checkBox.checked;
			saveTasks();
			updateCount();
			showFilteredTask();
		});

		//Текст задач checkBox
		const label = document.createElement('label');
		li.appendChild(label);
		label.innerHTML = task.text;
		if(task.completed === true) {
			label.style.textDecoration = 'line-through';
		};


		//Изменение label по двойному нажатию
		label.addEventListener('dblclick' , () => {
			const editTask = document.createElement('input');
			editTask.setAttribute('type','text');
			editTask.value = task.text;
			li.replaceChild(editTask,label);
			//Сохранение изменений 
			function saveEditTask(){
				const newText = editTask.value.trim();

				if(newText !== task.text){
					task.text = newText;
					saveTasks();
				}
				label.textContent = task.text;
				li.replaceChild(label,editTask);
			};

			// Фокус на инпуте
			editTask.focus();
			// Сохранение при нажатии Esc и Enter при изменении 
			editTask.addEventListener('keydown' , press => {
				if(press.key === 'Enter' || press.key === 'Escape'){
					saveEditTask();
				}
			});
			editTask.addEventListener('blur' , saveEditTask);

		});


		//Кнопка удаления
		const buttonRemove = document.createElement('button');
		li.appendChild(buttonRemove);
		buttonRemove.innerHTML = 'Удалить';
		buttonRemove.addEventListener('click' , () => {
			tasks = tasks.filter(deleted => deleted.id !== task.id);
			console.log(tasks);
			saveTasks();
			updateCount();
			showFilteredTask();
		});
	});
	updateCount();
}



// Создание кнопки "Выбрать все"
function selectAll(){
	footer.appendChild(selectAllButton);
	selectAllButton.classList.add('select-all');
	selectAllButton.textContent = "Выбрать все";

	selectAllButton.addEventListener('click' , () => {

		isAllSelected = !isAllSelected;

		tasks.forEach(task => task.completed = isAllSelected);
		saveTasks();
		showFilteredTask();
	});
}

//Создание кнопки (Удалить задание с выделенным checkbox)
function deletedAll (){
	footer.appendChild(deletedAllButton);

	deletedAllButton.addEventListener('click' ,() => {
		let deletedAllActives = tasks.filter(task => task.completed).length;

		if(deletedAllActives > 0){
			tasks = tasks.filter(task => !task.completed);
		};
		saveTasks();
		showFilteredTask();
	}); 

}

// Кнопки фильтрации
filterButtons.forEach(button => {
	button.addEventListener('click' , () => {
		//Удаления класса selected у всех кнопок
		filterButtons.forEach( buttonSelected => buttonSelected.classList.remove('selected'));
		//Добавление класса selected на кликнутую кнопку
		button.classList.add('selected');
		filterStatus = button.id;
		updateCount();
		showFilteredTask();
	});
})

//Вешаем событие при клике на кнопку
addButton.addEventListener('click' , addNewTask);

//Вешаем событие при клике на Enter
inputButton.addEventListener('keydown' , press => {
	if(press.key === 'Enter'){
		addNewTask();
	}
});


selectAll();
deletedAll();
updateCount();
loadTasks();