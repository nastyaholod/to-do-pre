let items = [
    "Сделать проектную работу",
    "Полить цветы",
    "Пройти туториал по Реакту",
    "Сделать фронт для своего проекта",
    "Прогуляться по улице в солнечный день",
    "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
    const storedTasks = localStorage.getItem('todoTasks');
    if (storedTasks) {
        return JSON.parse(storedTasks);
    } else {
        return items;
    }
}

function createItem(itemText) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);
    const textElement = clone.querySelector(".to-do__item-text");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");
    
    textElement.textContent = itemText;
    
    // Обработчик для кнопки удаления
    deleteButton.addEventListener('click', () => {
        clone.remove();
        const items = getTasksFromDOM();
        saveTasks(items);
    });
    
    // Обработчик для кнопки копирования
    duplicateButton.addEventListener('click', () => {
        const itemName = textElement.textContent;
        const newItem = createItem(itemName);
        listElement.prepend(newItem);
        const items = getTasksFromDOM();
        saveTasks(items);
    });
    
    // Обработчик для кнопки редактирования - делает элемент редактируемым
    editButton.addEventListener('click', () => {
        // Устанавливаем атрибут contenteditable="true" и переводим фокус
        textElement.contentEditable = true;
        textElement.focus();
    });
    
    // Обработчик события blur (потеря фокуса) для элемента с текстом задачи
    textElement.addEventListener('blur', () => {
        // Отключаем возможность редактирования
        textElement.contentEditable = false;
        
        // Получаем список текущих задач и сохраняем
        const items = getTasksFromDOM();
        saveTasks(items);
    });
    
    // Дополнительно: обработка нажатия клавиши Enter при редактировании
    textElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Предотвращаем перенос строки
            textElement.blur(); // Снимаем фокус, что вызовет обработчик blur
        }
    });
    
    return clone;
}

function getTasksFromDOM() {
    const itemsNamesElements = listElement.querySelectorAll('.to-do__item-text');
    const tasks = [];
    
    itemsNamesElements.forEach(element => {
        tasks.push(element.textContent);
    });
    
    return tasks;
}

function saveTasks(tasks) {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Инициализация при загрузке страницы
function init() {
    items = loadTasks();
    
    listElement.innerHTML = '';
    
    items.forEach(item => {
        const newItem = createItem(item);
        listElement.append(newItem);
    });
    
    formElement.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const taskText = inputElement.value.trim();
        
        if (taskText) {
            const newItem = createItem(taskText);
            listElement.prepend(newItem);
            
            const items = getTasksFromDOM();
            saveTasks(items);
            
            inputElement.value = '';
        } else {
            alert('Пожалуйста, введите текст задачи!');
        }
    });
}

// Запускаем приложение при загрузке страницы
document.addEventListener('DOMContentLoaded', init);