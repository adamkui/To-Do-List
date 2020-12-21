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
}

//Selectors
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');

//Event Listeners
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);

//Functions
function addTodo(event){
    //Prevent form from submitting
    event.preventDefault();
    //Todo DIV
    const todoDiv = new htmlElement('div', 'todo').createElement();
    //Create LI
    const newTodo = new htmlElement('li', 'todo-item').createElement();
    newTodo.innerText = todoInput.value;
    todoDiv.appendChild(newTodo);
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
    //Clear todo input value
    todoInput.value = "";
}

function deleteCheck(event){
    const item = event.target;
    //Delete todo
    if (item.classList[0] === 'trash-btn'){
        const todo = item.parentElement;
        todo.classList.add('fall');
        todo.addEventListener('transitionend', function(){
            todo.remove();
        });
    };

    //Check mark
    if (item.classList[0] === "complete-btn"){
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}