let addNewBtn = document.getElementById("addNew");
let taskInput = document.getElementById("newTask");
let taskDate = document.getElementById("newTaskDate");
let taskPrio = document.getElementById("newTaskPrio");
let notification = document.getElementById("notification");
let notificationTitle = document.getElementById("notification-title");

window.onload = () => {
  if (!localStorage.getItem("tasks")) {
    let tasksList = [];
    localStorage.setItem("tasks", JSON.stringify(tasksList));
  } else {
    let existingTasksList = JSON.parse(localStorage.getItem("tasks"));
    for (task of existingTasksList) {
      addTaskToBoard(task);
    }
  }
};

var draggedTask = null;

function allowDrop(event) {
  if (event.target.classList.contains("tasks")) {
    event.preventDefault();
  }
}

function drag(event) {
  draggedTask = event.target;
  document.querySelectorAll(".tasks").forEach((item) => {
    item.classList.add("dragging");
  });
}

function drop(event) {
  event.preventDefault();
  if (event.target.contains(draggedTask)) {
    return;
  }
  if (event.target.id === draggedTask.parentElement.id) {
    return;
  }
  draggedTask.parentElement.removeChild(draggedTask);
  event.target.appendChild(draggedTask);
  let task = getFromLocalStorage(draggedTask.getAttribute("data-uuid"));
  task.task.board = event.target.id;
  updateInLocalStorage(task.uuid, task);
  document.querySelectorAll(".tasks").forEach((item) => {
    item.classList.remove("dragging");
  });
}

function addNewTask(e) {
  let title = taskInput.value;
  let date = taskDate.value;
  let prio = taskPrio.value;
  if (title === "") {
    notificationTitle.textContent = "Title should not be empty";
    notification.classList.add("show-notification");
    setTimeout(() => {
      notification.classList.remove("show-notification");
    }, 3000);

    return;
  }
  if (date === "") {
    notificationTitle.textContent = "Date should not be empty";
    if (!notification.classList.contains("show-notification")) {
      notification.classList.add("show-notification");
    }

    setTimeout(() => {
      notification.classList.remove("show-notification");
    }, 3000);
    return;
  }

  taskInput.value = "";
  taskDate.value = null;
  taskPrio.value = "Low";
  let task = {
    title,
    date,
    priority: prio,
    board: "todo",
  };
  const newTaskId = addToLocalStorage(task);
  const newTask = getFromLocalStorage(newTaskId);
  addTaskToBoard(newTask);
}

function createEditIcon(divToAppend) {
  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  iconSvg.setAttribute("fill", "none");
  iconSvg.setAttribute("viewBox", "0 0 24 24");
  iconSvg.setAttribute("stroke", "black");
  iconSvg.setAttribute("stroke-width", "1.5");
  iconSvg.classList.add("icon");

  iconPath.setAttribute(
    "d",
    "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
  );
  iconPath.setAttribute("stroke-linecap", "round");
  iconPath.setAttribute("stroke-linejoin", "round");

  iconSvg.appendChild(iconPath);

  return divToAppend.appendChild(iconSvg);
}

function createDeleteIcon(divToAppend) {
  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  iconSvg.setAttribute("fill", "none");
  iconSvg.setAttribute("viewBox", "0 0 24 24");
  iconSvg.setAttribute("stroke", "black");
  iconSvg.setAttribute("stroke-width", "1.5");
  iconSvg.classList.add("icon");
  iconPath.setAttribute(
    "d",
    "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
  );
  iconPath.setAttribute("stroke-linecap", "round");
  iconPath.setAttribute("stroke-linejoin", "round");

  iconSvg.appendChild(iconPath);

  return divToAppend.appendChild(iconSvg);
}

function addToLocalStorage(task) {
  let tasksList = JSON.parse(localStorage.getItem("tasks")) || [];
  let uuid = crypto.randomUUID();
  let newTask = {
    uuid,
    task,
  };
  tasksList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasksList));
  return newTask.uuid;
}

function getFromLocalStorage(uuid) {
  let tasksList = JSON.parse(localStorage.getItem("tasks"));
  for (task of tasksList) {
    if (task.uuid === uuid) {
      return task;
    }
  }
  return null;
}

function updateInLocalStorage(uuid, newTask) {
  let tasksList = JSON.parse(localStorage.getItem("tasks"));

  for (task of tasksList) {
    if (task.uuid === uuid) {
      task.task.title = newTask.task.title;
      task.task.date = newTask.task.date;
      task.task.priority = newTask.task.priority;
      task.task.board = newTask.task.board;
      break;
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasksList));
  window.location.reload();
}

function addTaskToBoard(task) {
  let uuid = task.uuid;
  let { title, date, priority, board } = task.task;

  let boardToAdd = document.getElementById(board);
  let newTaskDiv = document.createElement("div");
  newTaskDiv.ondragover = function (e) {
    allowDrop(e);
  };
  newTaskDiv.setAttribute("data-uuid", uuid);
  newTaskDiv.draggable = true;
  newTaskDiv.ondragstart = function (event) {
    drag(event);
  };
  newTaskDiv.className = "task";
  let taskTitleSpan = document.createElement("span");
  taskTitleSpan.className = "task-title";
  taskTitleSpan.textContent = title;
  let taskInfoActionsDiv = document.createElement("div");
  taskInfoActionsDiv.className = "task-info-actions";
  let taskInfoDiv = document.createElement("div");
  // taskInfoActionsDiv.parentElement;
  taskInfoDiv.className = "task-info";
  let taskPrioSpan = document.createElement("span");
  let taskDueDateSpan = document.createElement("span");
  taskPrioSpan.className = "task-prio";
  taskDueDateSpan.className = "task-due-date";
  let taskActionsDiv = document.createElement("div");
  taskActionsDiv.className = "task-actions";
  let editDiv = document.createElement("div");
  let deleteDiv = document.createElement("div");
  editDiv.className = "edit-icon";
  editDiv.onclick = function (e) {
    editTask(e);
  };
  deleteDiv.className = "del-icon";
  deleteDiv.onclick = function (e) {
    deleteTask(e);
  };
  createEditIcon(editDiv);
  createDeleteIcon(deleteDiv);
  taskActionsDiv.append(editDiv);
  taskActionsDiv.append(deleteDiv);
  if (priority === "Low") {
    taskPrioSpan.classList.add("green");
  } else if (priority === "Medium") {
    taskPrioSpan.classList.add("yellow");
  } else {
    taskPrioSpan.classList.add("red");
  }
  if (board === "completed") {
    newTaskDiv.classList.add("completed");
  }
  taskPrioSpan.textContent = priority;
  taskDueDateSpan.textContent = date;
  newTaskDiv.append(taskTitleSpan);
  taskInfoDiv.append(taskPrioSpan);
  taskInfoDiv.append(taskDueDateSpan);
  taskInfoActionsDiv.append(taskInfoDiv);
  taskInfoActionsDiv.append(taskActionsDiv);
  newTaskDiv.append(taskInfoActionsDiv);
  if (boardToAdd.firstChild) {
    boardToAdd.insertBefore(newTaskDiv, boardToAdd.firstChild);
  } else {
    // If the board is empty, just append the task
    boardToAdd.append(newTaskDiv);
  }
  setTimeout(() => {
    newTaskDiv.classList.add("show-animation");
  }, 100);
  // newTaskDiv.style.transform = "translateY(0)";
}

function createAddIcon(divToAppend) {
  const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const iconPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  iconSvg.setAttribute("fill", "none");
  iconSvg.setAttribute("viewBox", "0 0 24 24");
  iconSvg.setAttribute("stroke", "black");
  iconSvg.setAttribute("stroke-width", "1.5");
  iconSvg.classList.add("icon");
  iconSvg.onclick = function (e) {
    editTask(e);
  };

  iconPath.setAttribute("d", "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z");
  iconPath.setAttribute("stroke-linecap", "round");
  iconPath.setAttribute("stroke-linejoin", "round");

  iconSvg.appendChild(iconPath);

  return divToAppend.appendChild(iconSvg);
}

function editTask(e) {
  let taskDiv =
    e.target.parentElement.parentElement.parentElement.parentElement;
  let taskUuid = taskDiv.getAttribute("data-uuid");
  if (taskUuid != null || taskUuid != undefined) {
    let task = getFromLocalStorage(taskUuid);
    let { title, date, priority, board } = task.task;
    taskInput.value = title;
    taskDate.value = date;
    taskPrio.value = priority;
    addNewBtn.textContent = "Edit task";
    createEditIcon(addNewBtn);
    addNewBtn.onclick = function (e) {
      updateTask(taskUuid, board);
    };
  }
}

function updateTask(uuid, board) {
  let title = taskInput.value;
  let date = taskDate.value;
  let prio = taskPrio.value;
  taskInput.value = "";
  taskDate.value = null;
  taskPrio.value = "Low";
  let task = {
    uuid,
    task: {
      title,
      date,
      priority: prio,
      board,
    },
  };
  updateInLocalStorage(uuid, task);
}

function deleteTask(e) {
  let taskDiv =
    e.target.parentElement.parentElement.parentElement.parentElement;
  let uuid = taskDiv.getAttribute("data-uuid");
  let tasksList = JSON.parse(localStorage.getItem("tasks"));
  tasksList = tasksList.filter((task) => task.uuid !== uuid);

  localStorage.setItem("tasks", JSON.stringify(tasksList));

  taskDiv.classList.remove("show-animation");

  setTimeout(() => {
    window.location.reload();
  }, 1000);
}
