/* ════════════════════════════════════════
   projects.js — Project CRUD + Sidebar
   TaskFlow | 24BIT0441 Rachana P
   jQuery-enhanced DOM manipulation
   ════════════════════════════════════════ */

function openProjectModal() {
  $('#project-modal').addClass('open');
  setTimeout(() => $('#project-name-input').focus(), 50);
}

function closeProjectModal() {
  $('#project-modal').removeClass('open');
  $('#project-name-input').val('');
  $('#project-desc-input').val('');
  $('#project-err').text('');
}

async function saveProject() {
  const name = $('#project-name-input').val().trim();
  const desc = $('#project-desc-input').val().trim();
  if (!name) { $('#project-err').text('Project name is required.'); return; }

  if (state.useBackend) {
    try {
      const data = await api('POST', '/projects', { name, desc });
      const proj = { ...data.project, id: data.project._id };
      state.projects.push(proj);
      closeProjectModal();
      renderSidebar();
      selectProject(proj.id);
      toast('Project "' + name + '" created! 🚀', 'success');
    } catch (e) { $('#project-err').text(e.message); }
  } else {
    const proj = { id: Date.now().toString(), name, desc, createdAt: new Date().toISOString() };
    state.projects.push(proj);
    save();
    closeProjectModal();
    renderSidebar();
    selectProject(proj.id);
    toast('Project "' + name + '" created! 🚀', 'success');
  }
}

async function deleteProject(id, e) {
  e.stopPropagation();
  if (!confirm('Delete this project and all its tasks?')) return;
  if (state.useBackend) {
    try { await api('DELETE', '/projects/' + id); }
    catch (e) { toast(e.message, 'err'); return; }
  }
  state.projects = state.projects.filter(p => (p._id || p.id) !== id);
  state.tasks    = state.tasks.filter(t => t.projectId !== id);
  if (state.activeProject === id) state.activeProject = null;
  if (!state.useBackend) save();
  renderSidebar();
  if (state.projects.length > 0) selectProject(state.projects[0]._id || state.projects[0].id);
  else renderEmptyBoard();
  toast('Project deleted.', 'success');
}

async function selectProject(id) {
  state.activeProject = id;
  if (state.useBackend) {
    try {
      const data = await api('GET', '/projects/' + id + '/tasks');
      state.tasks = state.tasks.filter(t => String(t.projectId) !== String(id));
      const mapped = data.tasks.map(t => ({ ...t, id: t._id, projectId: id }));
      state.tasks.push(...mapped);
    } catch (_) {}
  }
  renderSidebar();
  renderBoard();
}

function renderSidebar() {
  const $list = $('#project-list').empty();
  state.projects.forEach(p => {
    const pid = p._id || p.id;
    const isActive = state.activeProject === pid;
    // jQuery-built element for better interactivity
    const $item = $('<div>')
      .addClass('project-item' + (isActive ? ' active' : ''))
      .attr({ role: 'link', tabindex: '0', 'aria-current': isActive ? 'page' : 'false' });

    const $name = $('<span>').addClass('project-item-name').text('📁 ' + p.name);
    const $del  = $('<span>')
      .addClass('project-item-del')
      .attr({ title: 'Delete project', 'aria-label': 'Delete project ' + p.name })
      .html('<i class="bi bi-trash3"></i>')
      .on('click', function(e) { deleteProject(pid, e); });

    $item.append($name, $del)
         .on('click', function(e) {
           if (!$(e.target).closest('.project-item-del').length) selectProject(pid);
         })
         .on('keydown', function(e) {
           if (e.key === 'Enter') selectProject(pid);
         });

    $list.append($item);
  });
}
