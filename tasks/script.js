// // script.js
// let draggedTask;

// function drag(event) {
//   draggedTask = event.target;
// }

// function allowDrop(event) {
//   event.preventDefault();
// }

// function drop(event) {
//   event.preventDefault();
//   const targetBoard = event.target.closest(".board");
//   targetBoard.appendChild(draggedTask);
// }

let createBtn = document.getElementById("createBtn");
let taskInput = document.getElementById("taskInput");
let taskLists = document.getElementById("tasksList");

// onchange event trigger

createBtn.addEventListener("click",function (e) {
  let task = taskInput.value;
  taskInput.value = "";
  let listItem = document.createElement("li");
  listItem.textContent = task;
  taskLists.appendChild(listItem);
});
