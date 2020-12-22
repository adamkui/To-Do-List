//localStorage.clear();

//Classes
class htmlElement {
    constructor(type, className = "") {
      this.type = type;
      this.className = className;
    }
    createElement(){
        let element = document.createElement(this.type);
        element.classList.add(this.className);
        return element;
    }
};

class toDoItem {
    constructor(value, status){
        this.value = value;
        this.status = status;
    }
};

//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo');

//Event Listeners
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', (event) => filterTodo(event.target.value));

//Functions
function addTodo(event){
    //Prevent form from submitting
    event.preventDefault();
    reUseAddTodo(todoInput.value, true);
    //Clear todo input value
    todoInput.value = "";
};

function reUseAddTodo(newTodoVal, saveToLocalStorage, status = 'initial'){
    //Todo DIV
    const todoDiv = new htmlElement('div', 'todo').createElement();
    if (status === 'completed'){todoDiv.classList.add('completed')};
    //Create LI
    const newTodo = new htmlElement('li', 'todo-item').createElement();
    newTodo.innerText = newTodoVal;
    todoDiv.appendChild(newTodo);
    //Add todo to local storage
    if (saveToLocalStorage){saveLocalTodos(todoInput.value, 'initial')};
    //Check mark button
    const completedButton = new htmlElement('button', 'complete-btn').createElement();
    completedButton.innerHTML = '<i class="fas fa-check">';
    todoDiv.appendChild(completedButton);
    //Trash button
    const trashButton = new htmlElement('button', 'trash-btn').createElement();
    trashButton.innerHTML = '<i class="fas fa-trash">';
    todoDiv.appendChild(trashButton);
    //Append to list
    todoList.appendChild(todoDiv);
};

function deleteCheck(event){
    const item = event.target;
    //Delete todo
    if (item.classList[0] === 'trash-btn'){
        const todo = item.parentElement;
        todo.classList.add('fall');
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', () => todo.remove());
    };

    //Check mark
    if (item.classList[0] === "complete-btn"){
        const todo = item.parentElement;
        todo.classList.toggle("completed");
        if (todo.classList.contains("completed")){
            saveLocalTodos(todo, "completed");
        } else {
            saveLocalTodos(todo, "reuse");
        }
    };

    refreshFilter();
};

function filterTodo(category){
    const todos = todoList.childNodes;
    todos.forEach(element => {
        switch(category){
            case "all":
                element.style.display = "flex";
                break;
            case "completed":
                if(element.classList.contains('completed')){
                    element.style.display = "flex";
                } else {
                    element.style.display = "none";
                }
                break;
            case "uncompleted":
                if (!element.classList.contains('completed')){
                    element.style.display = "flex";
                } else {
                    element.style.display = "none";
                }
                break;
        }
    })
};

function refreshFilter(){
    const select = document.getElementsByTagName('select')[0];
    filterTodo(select.value);
};

function saveLocalTodos(todo, status){
    let todos = checkLocalStorage('todos');
    let todoIndex;
    switch (status){
        case "initial":
            todoitem = new toDoItem(todo, 'initial');
            todos.push(todoitem);
            break;
        case "completed":
            todoIndex = todos.map(e => {return e.value}).indexOf(todo.children[0].innerText);
            todos[todoIndex].status = 'completed';
            break;
        case "reuse":
            todoIndex = todos.map(e => {return e.value}).indexOf(todo.children[0].innerText);
            todos[todoIndex].status = 'initial';
            break;
    }
    localStorage.setItem('todos', JSON.stringify(todos));
};

function getTodos(){
    let todos = checkLocalStorage('todos');
    todos.forEach(element => reUseAddTodo(element.value, false, element.status));
};

function removeLocalTodos(todo){
    let todos = checkLocalStorage('todos');
    const todoIndex = todos.map(e => {return e.value}).indexOf(todo.children[0].innerText);
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
};

function checkLocalStorage(key){
    if (localStorage.getItem(key) === null){
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem(key));
    };
    return todos;
};