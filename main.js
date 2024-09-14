let countAdd = document.querySelector(".count-todo");
let countDone = document.querySelector(".count-done");
const text = document.getElementById("text");
const add = document.getElementById("add");
const tasksList = document.querySelector(".list-to-do");
const tasksDone = document.querySelector(".list-done");
const DeleteAllBtn = document.querySelector(".delete-all");
const deleteDoneTask = document.querySelector(".delete");
let arr = [];
countAdd.innerHTML = 0;
countDone.innerHTML = 0;

// Delete all tasks functionality
DeleteAllBtn.onclick = () => {
  arr = [];
  tasksList.innerHTML = "";
  tasksDone.innerHTML = "";
  countAdd.innerHTML = 0;
  countDone.innerHTML = 0;
  DeleteAllBtn.style.display = "none";
  localStorage.clear();
};

// Load data from localStorage if available
if (localStorage.getItem("data")) {
  arr = JSON.parse(localStorage.getItem("data"));
  addToPage(arr);
  addToDonePage();
}

// Add new task functionality
add.onclick = () => {
  if (text.value !== "" && text.value.length > 3) {
    addTaskToTODO(text.value);
    text.value = "";
  }
};

// Add task on Enter key press
text.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    add.onclick();
  }
});

// Add task to the TODO list
function addTaskToTODO(task) {
  const newItem = {
    id: Date.now(),
    title: task,
    completed: false,
  };
  arr.push(newItem);
  addToPage(arr);
  localStorage.setItem("data", JSON.stringify(arr));
}

// Add tasks to the TODO list
function addToPage(arr) {
  tasksList.innerHTML = "";
  arr.forEach((task) => {
    if (!task.completed) {
      const list = document.createElement("li");
      list.innerHTML = `
        ${task.title}
        <div class="icons">
          <i onclick="Done(${task.id})" class="fa-solid fa-check"></i>
          <i onclick="Delete(${task.id})" class="fa-solid fa-trash"></i>
        </div>`;
      tasksList.appendChild(list);
    }
  });
  countAdd.innerHTML = arr.filter((task) => !task.completed).length;
}

// Mark task as done
function Done(id) {
  arr = arr.map((task) => {
    if (task.id === id) {
      return { ...task, completed: true };
    }
    return task;
  });
  localStorage.setItem("data", JSON.stringify(arr));
  addToPage(arr);
  addToDonePage();
}

// Add tasks to the Done list
function addToDonePage() {
  tasksDone.innerHTML = "";
  arr.forEach((task) => {
    if (task.completed) {
      const list = document.createElement("li");
      list.innerHTML = `
        <div class='task-done'>
          ${task.title}
          <div class='delete'>
            <i onclick="Delete(${task.id})" class="fa-solid fa-trash "></i>
          </div>
        </div>`;
      tasksDone.appendChild(list);
    }
  });
  countDone.innerHTML = arr.filter((task) => task.completed).length;

  // Add event listeners to delete icons in the Done list
  document.querySelectorAll(".task-done .delete").forEach((icon) => {
    icon.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      Delete(id);
    });
  });

  // Show the delete all button if there are completed tasks
  if (countDone.innerHTML > 1) {
    DeleteAllBtn.style.display = "block";
  } else {
    DeleteAllBtn.style.display = "none";
  }
}

// Delete individual task
function Delete(id) {
  arr = arr.filter((task) => task.id !== id);
  localStorage.setItem("data", JSON.stringify(arr));
  addToPage(arr);
  addToDonePage();
}
