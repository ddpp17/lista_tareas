const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");



// ELEMENTOS BLOQUE 1
const input1 = document.getElementById("input1");
const btn1 = document.getElementById("btn1");
const list1 = document.getElementById("list1");

// ELEMENTOS BLOQUE 2
const input2 = document.getElementById("input2");
const btn2 = document.getElementById("btn2");
const list2 = document.getElementById("list2");

// ARRAYS
let tasks1 = [];
let tasks2 = [];

// CARGAR
window.addEventListener("DOMContentLoaded", () => {
    const data1 = localStorage.getItem("tasks1");
    const data2 = localStorage.getItem("tasks2");

    if (data1) {
        tasks1 = JSON.parse(data1);
        tasks1.forEach(t => createTask(t, list1, tasks1, "tasks1"));
    }

    if (data2) {
        tasks2 = JSON.parse(data2);
        tasks2.forEach(t => createTask(t, list2, tasks2, "tasks2"));
    }
});

// GUARDAR
function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// AGREGAR
function handleAdd(input, list, tasks, key) {
    const text = input.value.trim();
    if (text === "") return;

    const task = {
        id: Date.now(),
        text,
        completed: false
    };

    tasks.push(task);
    save(key, tasks);

    createTask(task, list, tasks, key);
    input.value = "";
}

// EVENTOS CLICK
btn1.onclick = () => handleAdd(input1, list1, tasks1, "tasks1");
btn2.onclick = () => handleAdd(input2, list2, tasks2, "tasks2");

// ENTER
input1.addEventListener("keypress", e => {
    if (e.key === "Enter") handleAdd(input1, list1, tasks1, "tasks1");
});

input2.addEventListener("keypress", e => {
    if (e.key === "Enter") handleAdd(input2, list2, tasks2, "tasks2");
});

// CREAR TAREA
function createTask(taskObj, list, tasks, key) {

    const task = document.createElement("div");
    task.className = "task";
    if (taskObj.completed) task.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = taskObj.text;

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    // COMPLETAR
    const btnComplete = document.createElement("button");
    btnComplete.className = "complete";
    btnComplete.innerHTML = '<i class="bi bi-check-circle"></i>';

    btnComplete.onclick = () => {
        task.classList.add("completed");
        update(taskObj.id, { completed: true }, tasks, key);
    };

    // DESMARCAR
    const btnUndo = document.createElement("button");
    btnUndo.className = "undo";
    btnUndo.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';

    btnUndo.onclick = () => {
        task.classList.remove("completed");
        update(taskObj.id, { completed: false }, tasks, key);
    };

    // EDITAR
    const btnEdit = document.createElement("button");
    btnEdit.className = "edit";
    btnEdit.innerHTML = '<i class="bi bi-pencil"></i>';

    btnEdit.onclick = () => {
        const newText = prompt("Editar tarea:", taskObj.text);
        if (newText && newText.trim() !== "") {
            span.textContent = newText;
            update(taskObj.id, { text: newText }, tasks, key);
        }
    };

// ELIMINAR
const btnDelete = document.createElement("button");
btnDelete.className = "delete";
btnDelete.innerHTML = '<i class="bi bi-trash"></i>';

btnDelete.onclick = () => {

    const currentText = span.textContent;

    // mostrar modal
    modal.classList.remove("hidden");
    modalText.textContent = `¿Eliminar la tarea "${currentText}"?`;

    // confirmar eliminación
    confirmBtn.onclick = () => {
        task.remove();
        tasks = tasks.filter(t => t.id !== taskObj.id);
        save(key, tasks);

        modal.classList.add("hidden");
    };

    // cancelar
    cancelBtn.onclick = () => {
        modal.classList.add("hidden");
    };
};

buttons.append(btnComplete, btnUndo, btnEdit, btnDelete);
task.append(span, buttons);
list.appendChild(task);
}

// ACTUALIZAR
function update(id, changes, tasks, key) {
    tasks = tasks.map(t => t.id === id ? { ...t, ...changes } : t);
    save(key, tasks);
}