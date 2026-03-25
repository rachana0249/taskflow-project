/* ════════════════════════════════════════
   board.js — Kanban Board Rendering
   TaskFlow | 24BIT0441 Rachana P
   ════════════════════════════════════════ */

/** Render empty board when no project selected */
function renderEmptyBoard() {
  $('#board-area').html(`
    <div class="no-project">
      <div class="no-project-icon" aria-hidden="true">📋</div>
      <h2 class="no-project-text">Select or create a project</h2>
      <p class="no-project-sub">Click "New Project" in the sidebar to get started</p>
    </div>`);
}

/** Render the full Kanban board for the active project */
function renderBoard() {
  const proj = state.projects.find(p => p.id === state.activeProject || p._id === state.activeProject);
  if (!proj) { renderEmptyBoard(); return; }

  const tasks    = state.tasks.filter(t => t.projectId === state.activeProject);
  const todo     = tasks.filter(t => t.status === 'todo');
  const progress = tasks.filter(t => t.status === 'progress');
  const done     = tasks.filter(t => t.status === 'done');
  const overdue  = tasks.filter(t => t.due && new Date(t.due) < new Date() && t.status !== 'done');

  $('#board-area').html(`
    <div class="board-header fade-in">
      <div>
        <div class="board-title">${escHtml(proj.name)}</div>
        <div class="board-meta">
          ${escHtml(proj.desc || 'No description')} &middot;
          ${tasks.length} task${tasks.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div class="board-actions">
        <button class="btn btn-primary btn-sm" onclick="openTaskModal()" aria-label="Add new task">
          <i class="bi bi-plus-lg"></i> Add Task
        </button>
      </div>
    </div>

    <div class="stats-row fade-in" role="region" aria-label="Task statistics">
      <div class="stat-chip"><span aria-hidden="true">📋</span> Total <strong>${tasks.length}</strong></div>
      <div class="stat-chip"><span aria-hidden="true">🔵</span> To Do <strong>${todo.length}</strong></div>
      <div class="stat-chip"><span aria-hidden="true">🟡</span> In Progress <strong>${progress.length}</strong></div>
      <div class="stat-chip"><span aria-hidden="true">✅</span> Done <strong>${done.length}</strong></div>
      ${overdue.length ? `<div class="stat-chip" style="border-color:var(--danger)"><span aria-hidden="true">⚠️</span> Overdue <strong style="color:var(--danger)">${overdue.length}</strong></div>` : ''}
    </div>

    <div class="kanban fade-in" role="region" aria-label="Kanban columns">

      <!-- TO DO column -->
      <article class="kanban-col col-todo" aria-label="To Do column">
        <div class="col-header">
          <span class="col-title" style="color:var(--accent)">To Do</span>
          <span class="col-count" aria-label="${todo.length} tasks">${todo.length}</span>
        </div>
        <div class="col-body" id="col-todo"
          ondragover="dragOver(event)"
          ondrop="drop(event,'todo')"
          ondragleave="dragLeave(event)"
          role="list"
          aria-label="To Do tasks">
          ${todo.length === 0 ? emptyColHTML() : todo.map(taskCardHTML).join('')}
        </div>
      </article>

      <!-- IN PROGRESS column -->
      <article class="kanban-col col-prog" aria-label="In Progress column">
        <div class="col-header">
          <span class="col-title" style="color:var(--warn)">In Progress</span>
          <span class="col-count" aria-label="${progress.length} tasks">${progress.length}</span>
        </div>
        <div class="col-body" id="col-progress"
          ondragover="dragOver(event)"
          ondrop="drop(event,'progress')"
          ondragleave="dragLeave(event)"
          role="list"
          aria-label="In Progress tasks">
          ${progress.length === 0 ? emptyColHTML() : progress.map(taskCardHTML).join('')}
        </div>
      </article>

      <!-- DONE column -->
      <article class="kanban-col col-done" aria-label="Done column">
        <div class="col-header">
          <span class="col-title" style="color:var(--accent3)">Done</span>
          <span class="col-count" aria-label="${done.length} tasks">${done.length}</span>
        </div>
        <div class="col-body" id="col-done"
          ondragover="dragOver(event)"
          ondrop="drop(event,'done')"
          ondragleave="dragLeave(event)"
          role="list"
          aria-label="Done tasks">
          ${done.length === 0 ? emptyColHTML() : done.map(taskCardHTML).join('')}
        </div>
      </article>

    </div>`);

  // Attach drag events to cards via jQuery
  $('.task-card').on('dragstart', dragStart).on('dragend', dragEnd);
}

/** Generate empty column placeholder HTML */
function emptyColHTML() {
  return `<div class="empty-state" role="listitem">
    <div class="empty-icon" aria-hidden="true">✦</div>
    <div class="empty-text">No tasks here yet</div>
  </div>`;
}

/** Generate full task card HTML — priority shown visually with badge + left border */
function taskCardHTML(t) {
  const isOverdue = t.due && new Date(t.due) < new Date() && t.status !== 'done';
  const pClass = { high: 'priority-high', medium: 'priority-medium', low: 'priority-low' }[t.priority] || 'priority-low';
  const pIcon  = { high: '🔴', medium: '🟡', low: '🟢' }[t.priority] || '🟢';
  const pLabel = { high: 'High', medium: 'Medium', low: 'Low' }[t.priority] || 'Low';
  const moves  = moveBtnsHTML(t);

  return `
    <div class="task-card ${pClass}" draggable="true" data-id="${t.id}"
         role="listitem" aria-label="Task: ${escHtml(t.title)}, priority ${pLabel}">

      <div class="task-card-top">
        <div class="task-title">${escHtml(t.title)}</div>
        <div class="task-actions" role="group" aria-label="Task actions">
          <button class="btn-icon" title="Edit task" aria-label="Edit ${escHtml(t.title)}"
                  onclick="editTask('${t.id}')">✏️</button>
          <button class="btn-delete-card" title="Delete task" aria-label="Delete ${escHtml(t.title)}"
                  onclick="confirmDeleteTask('${t.id}')">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>

      <!-- Priority shown visually: coloured badge with dot indicator + card left border -->
      <div class="task-priority ${pClass}" role="img" aria-label="Priority: ${pLabel}">
        <span class="priority-dot" aria-hidden="true"></span>
        ${pIcon} ${pLabel}
      </div>

      ${t.desc ? `<p class="task-desc">${escHtml(t.desc)}</p>` : ''}

      <div class="task-footer">
        <div class="task-assignee">
          ${t.assignee
            ? `<div class="assignee-dot" aria-hidden="true">${t.assignee[0].toUpperCase()}</div>
               <span>${escHtml(t.assignee)}</span>`
            : '<span>Unassigned</span>'}
        </div>
        <div class="task-due ${isOverdue ? 'overdue' : ''}"
             ${isOverdue ? 'aria-label="Overdue"' : ''}>
          ${t.due ? (isOverdue ? '⚠️ ' : '📅 ') + formatDate(t.due) : ''}
        </div>
      </div>

      <div class="task-move-btns" role="group" aria-label="Move task">${moves}</div>
    </div>`;
}

/** Generate move-to-column buttons */
function moveBtnsHTML(t) {
  const all    = ['todo', 'progress', 'done'];
  const labels = { todo: 'To Do', progress: 'In Progress', done: 'Done' };
  return all
    .filter(c => c !== t.status)
    .map(c => `<button class="move-btn" aria-label="Move to ${labels[c]}"
                       onclick="moveTask('${t.id}','${c}')">→ ${labels[c]}</button>`)
    .join('');
}

/** Format a date string to readable format */
function formatDate(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Escape HTML special characters */
function escHtml(s) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
