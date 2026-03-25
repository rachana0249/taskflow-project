/* ════════════════════════════════════════
   drag.js — Drag & Drop (HTML5 API)
   TaskFlow | 24BIT0441 Rachana P
   ════════════════════════════════════════ */

let dragId = null;

/** Called when a task card starts being dragged */
function dragStart(e) {
  dragId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

/** Called when dragging ends */
function dragEnd(e) {
  e.currentTarget.classList.remove('dragging');
}

/** Allow dropping by preventing default behavior */
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

/** Remove drag-over highlight when leaving a column */
function dragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

/** Handle drop — move the task to the target column */
function drop(e, status) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!dragId) return;
  moveTask(dragId, status);
  dragId = null;
}
