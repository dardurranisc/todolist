const input = document.getElementById('btn-input');
const buttonAdd = document.getElementById('btn-add');
let tasks = [];

//Вешаем событие при клике на кнопку
buttonAdd.addEventListener('click' , addNewTask);
//Вешаем событие при клике на Enter
input.addEventListener('keydown' , function(press){
	if(press.key === 'Enter'){
		addNewTask();
	}
});
// Счетчик
function updateCount(){
	const activeTasks = tasks.filter(function(task){
		return !task.completed;
	}).length;
	document.getElementById('todo-count').textContent = `${activeTasks} : items lefs`;
}
// Функция добавления задачи
function addNewTask(){
	if(input.value === ""){
		alert('Введите задачу');
		return;
	}
	let newTask = {
		id:Date.now(),
		text:input.value,
		completed:false
	}
	tasks.push(newTask);
	input.value = '';
	updateCount();
	showFilteredTask();
}
//Дефолтный статус ALL
let filterStatus = 'all';

//Отрисовка задач 
function showFilteredTask(){
	const ul = document.getElementById('add-list');
	ul.innerHTML = '';
	let filteredTasks = [];
	if(filterStatus === 'active'){
		filteredTasks = tasks.filter(function(task){
			 if (task.completed === false) {
			    return true;
			  } else {
			    return false;
			  };
		})
	}else if(filterStatus === 'completed'){
		filteredTasks = tasks.filter(function(task){
			 if (task.completed === true) {
			    return true;
			  } else {
			    return false; 
			  }
		})
	}else{
		filteredTasks = tasks;
	}
	filteredTasks.forEach(function(task){
		//Создание тега li
		const li = document.createElement('li');
		ul.appendChild(li);
		
		//Чек бокс
		const checkList = document.createElement('input');
		li.appendChild(checkList);
		checkList.setAttribute('type','checkbox');
		checkList.setAttribute('class' , 'checkbox');
		checkList.checked = task.completed;

		//Изменение состояния чек бокса
		checkList.addEventListener('change',function(){
			task.completed = this.checked;
			updateCount();
			showFilteredTask();
		});

		//Текст задач 
		const label = document.createElement('label');
		li.appendChild(label);
		label.innerHTML = task.text;
		if(task.completed === true) {
			label.style.textDecoration = 'line-through';
			updateCount();
		};

		//Кнопка удаления
		const buttonRemove = document.createElement('button');
		li.appendChild(buttonRemove);
		buttonRemove.innerHTML = 'Удалить';
		buttonRemove.addEventListener('click' , function(){
			tasks = tasks.filter(function(deleted){
				if (deleted.id !== task.id) {
				    return true;
				  } else {
				    return false; 
				  };
			});
			updateCount();
			showFilteredTask();
		});
	});
	updateCount();
}


//Получение элементов кнопки
const filterButtons = document.querySelectorAll('.filter__link > a');

filterButtons.forEach(function(button){
	button.addEventListener('click' , function(){
		//Удаления класса selected у всех кнопок
		filterButtons.forEach(function(buttonSelected){
			buttonSelected.classList.remove('selected');
		});
		//Добавление класса selected на кликнутую кнопку
		this.classList.add('selected');
		filterStatus = this.id;
		updateCount();
		showFilteredTask();
	});
})

updateCount();