const blocks = document.querySelectorAll('.block');
const grid = document.querySelector('.grid');
let draggedElement = null;

blocks.forEach(block => {
  block.addEventListener('dragstart', handleDragStart);
  block.addEventListener('dragend', handleDragEnd);
});

grid.addEventListener('dragover', handleDragOver);
grid.addEventListener('drop', handleDrop);

function handleDragStart(event) {
  draggedElement = event.target;
  setTimeout(() => {
    draggedElement.classList.add('dragging');
  }, 0);
}

function handleDragEnd() {
  draggedElement.classList.remove('dragging');
  draggedElement = null;
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  if (event.target.classList.contains('block')) {
    const target = event.target;
    const draggedIndex = Array.from(grid.children).indexOf(draggedElement);
    const targetIndex = Array.from(grid.children).indexOf(target);

    if (isValidMove(draggedIndex, targetIndex)) {
      grid.insertBefore(draggedElement, target);
    }
  }
}

function isValidMove(draggedIndex, targetIndex) {
  // Implement the logic to determine if the move is valid
  // For simplicity, this example allows any move
  return true;
}
