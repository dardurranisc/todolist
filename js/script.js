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
let activeTasksCount = 0;
function updateCount(){
	const activeTasks = tasks.filter(function(task){
		return !task.completed;
	}).length;
	document.getElementById('todo-count').textContent = `${activeTasks} : items lefs`;
	activeTasksCount = activeTasks;
}

// Функция добавления задачи
function addNewTask(){
	if(input.value.trim() === ""){
		alert('Введите задачу');
		return;
	}
	let newTask = {
		id:Date.now(),
		text:input.value,
		completed:false
	}
	tasks.unshift(newTask);
	input.value = '';
	saveTasks();
	updateCount();
	showFilteredTask();
}
//Дефолтный статус ALL
let filterStatus = 'all';
loadTasks();
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
			saveTasks();
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

		//Изменение label по двойному нажатию
		label.addEventListener('dblclick' , function(){
			const editTask = document.createElement('input');
			editTask.setAttribute('type','text');
			editTask.value = task.text;
			li.replaceChild(editTask,label);

			//Сохранение изменений 
			function saveEditTask(inputFocus){
				const newText = inputFocus.value.trim();
				if(newText !== task.text){
					task.text = newText;
					saveTasks();
				}
				label.textContent = task.text;
				li.replaceChild(label,inputFocus);
			};

			// Фокус на инпуте
			editTask.focus();
			editTask.addEventListener('blur' , function(){
				saveEditTask(this);
			});
			editTask.addEventListener('keydown' , function(press){
				if(press.key === 'Enter'){
					saveEditTask(editTask);
				}
			});

		});


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
			saveTasks();
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

//Сохранения задач в локальном хранилище 
function saveTasks(){
	localStorage.setItem('tasks',JSON.stringify(tasks));
}
function loadTasks(){
	const savedTasks = localStorage.getItem('tasks');
	if(savedTasks){
		tasks = JSON.parse(savedTasks);
		showFilteredTask();
	}
}


// Создание кнопки "Выбрать все"
function selectAll(){
	const selectAllTask = document.createElement('button');
	const footer = document.getElementById('footer');
	footer.appendChild(selectAllTask);
	selectAllTask.classList.add('select-all');
	selectAllTask.textContent = "Выбрать все";

	let allSelected = false;

	selectAllTask.addEventListener('click' , function(){

		allSelected = !allSelected;

		tasks.forEach(function(task){
			task.completed = allSelected;
		});

		showFilteredTask();
	});
}
//Создание кнопки (Удалить задание с выделенным checkbox)
function deletedAll (){
	const deletedAllTasks = document.createElement('button');
	deletedAllTasks.classList.add('delete-all');
	deletedAllTasks.textContent = "Удалить все активные";
	footer.appendChild(deletedAllTasks);

	deletedAllTasks.addEventListener('click' , function(){
		let deletedAllActives = tasks.filter(function(task){
			return task.completed; 
		}).length;

		if(deletedAllActives > 0){
			tasks = tasks.filter(function(task){
				return !task.completed;
			});
		};
		saveTasks();
		showFilteredTask();
	}); 

}

selectAll();
deletedAll();
updateCount();