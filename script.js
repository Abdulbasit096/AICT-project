// script.js
let draggedTask;

function drag(event) {
  draggedTask = event.target;
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const targetBoard = event.target.closest(".board");
  targetBoard.appendChild(draggedTask);
}
