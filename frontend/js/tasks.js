/* ════════════════════════════════════════
   tasks.js — Task CRUD Operations
   TaskFlow | 24BIT0441 Rachana P
   Uses jQuery for DOM manipulation
   ════════════════════════════════════════ */

function openTaskModal(status) {
  status = status || 'todo';
  state.editingTask = null;
  $('#task-modal-title').text('Add Task');
  $('#task-title-input').val('');
  $('#task-desc-input').val('');
  $('#task-priority-input').val('medium');
  $('#task-assignee-input').val('');
  $('#task-due-input').val('');
  $('#task-status-input').val(status);
  $('#task-err').text('');
  $('#task-modal').addClass('open');
  setTimeout(() => $('#task-title-input').focus(), 50);
}

function editTask(id) {
  const t = state.tasks.find(t => (t._id || t.id) === id);
  if (!t) return;
  state.editingTask = id;
  $('#task-modal-title').text('Edit Task');
  $('#task-title-input').val(t.title);
  $('#task-desc-input').val(t.desc || '');
  $('#task-priority-input').val(t.priority || 'medium');
  $('#task-assignee-input').val(t.assignee || '');
  $('#task-due-input').val(t.due ? t.due.slice(0, 10) : '');
  $('#task-status-input').val(t.status);
  $('#task-err').text('');
  $('#task-modal').addClass('open');
  setTimeout(() => $('#task-title-input').focus(), 50);
}

function closeTaskModal() {
  $('#task-modal').removeClass('open');
  state.editingTask = null;
}

async function saveTask() {
  const title    = $('#task-title-input').val().trim();
  const desc     = $('#task-desc-input').val().trim();
  const priority = $('#task-priority-input').val();
  const assignee = $('#task-assignee-input').val().trim();
  const due      = $('#task-due-input').val();
  const status   = $('#task-status-input').val();

  if (!title) { $('#task-err').text('Task title is required.'); return; }
  if (status === 'done' && (!assignee || !due)) {
    $('#task-err').text('Done tasks require an assignee and a due date.'); return;
  }
  $('#task-err').text('');

  const payload = { title, desc, priority, assignee, due, status, projectId: state.activeProject };

  if (state.useBackend) {
    try {
      if (state.editingTask) {
        const data = await api('PUT', '/tasks/' + state.editingTask, payload);
        const idx = state.tasks.findIndex(t => (t._id || t.id) === state.editingTask);
        if (idx !== -1) state.tasks[idx] = { ...data.task, id: data.task._id, projectId: state.activeProject };
        toast('Task updated! ✅', 'success');
      } else {
        const data = await api('POST', '/tasks', payload);
        state.tasks.push({ ...data.task, id: data.task._id, projectId: state.activeProject });
        toast('Task added! 🎯', 'success');
      }
    } catch (e) { $('#task-err').text(e.message); return; }
  } else {
    if (state.editingTask) {
      const t = state.tasks.find(t => (t._id || t.id) === state.editingTask);
      if (t) Object.assign(t, { title, desc, priority, assignee, due, status, updatedAt: new Date().toISOString() });
      toast('Task updated! ✅', 'success');
    } else {
      state.tasks.push({ id: Date.now().toString(), projectId: state.activeProject, title, desc, priority, assignee, due, status, createdAt: new Date().toISOString() });
      toast('Task added! 🎯', 'success');
    }
    save();
  }
  closeTaskModal();
  renderBoard();
}

/** Show a custom confirm modal instead of browser confirm() */
function confirmDeleteTask(id) {
  const t = state.tasks.find(t => (t._id || t.id) === id);
  const name = t ? escHtml(t.title) : 'this task';
  $('#confirm-msg').html(`Delete <strong>"${name}"</strong>? This action cannot be undone.`);
  $('#confirm-modal').addClass('open');
  $('#confirm-ok').off('click').on('click', async function() {
    closeConfirmModal();
    await deleteTask(id);
  });
}

function closeConfirmModal() {
  $('#confirm-modal').removeClass('open');
}

async function deleteTask(id) {
  if (state.useBackend) {
    try { await api('DELETE', '/tasks/' + id); }
    catch (e) { toast(e.message, 'err'); return; }
  }
  state.tasks = state.tasks.filter(t => (t._id || t.id) !== id);
  if (!state.useBackend) save();
  renderBoard();
  toast('Task deleted.', 'success');
}

async function moveTask(id, newStatus) {
  const t = state.tasks.find(t => (t._id || t.id) === id);
  if (!t) return;
  if (newStatus === 'done' && (!t.assignee || !t.due)) {
    toast('Cannot mark Done: task needs an assignee and due date.', 'err'); return;
  }
  if (state.useBackend) {
    try { await api('PUT', '/tasks/' + id, { ...t, status: newStatus }); }
    catch (e) { toast(e.message, 'err'); return; }
  }
  t.status = newStatus;
  if (!state.useBackend) save();
  renderBoard();
  const label = { todo: 'To Do', progress: 'In Progress', done: 'Done' }[newStatus];
  toast('Moved to ' + label + '!', 'success');
}
