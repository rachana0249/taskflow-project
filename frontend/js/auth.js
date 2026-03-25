/* ════════════════════════════════════════
   auth.js — Login / Register / Logout
   TaskFlow | 24BIT0441 Rachana P
   jQuery-enhanced validation & DOM updates
   ════════════════════════════════════════ */

function switchTab(tab) {
  // jQuery tab switching
  $('#tab-login').toggleClass('active', tab === 'login').attr('aria-selected', tab === 'login');
  $('#tab-register').toggleClass('active', tab === 'register').attr('aria-selected', tab === 'register');
  $('#login-form').toggle(tab === 'login');
  $('#register-form').toggle(tab === 'register');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── LOGIN ── */
async function doLogin() {
  const email = $('#login-email').val().trim().toLowerCase();
  const pass  = $('#login-password').val();

  if (!email || !pass) { $('#login-err').text('Please fill all fields.'); return; }
  if (!isValidEmail(email)) { $('#login-err').text('Invalid email format.'); return; }
  $('#login-err').text('');

  if (state.useBackend) {
    try {
      const data = await api('POST', '/auth/login', { email, password: pass });
      state.currentUser = data.user;
      await loadProjectsFromAPI();
      showApp();
    } catch (e) { $('#login-err').text(e.message); }
  } else {
    const user = state.users.find(u => u.email === email && u.password === pass);
    if (!user) { $('#login-err').text('Invalid email or password.'); return; }
    state.currentUser = user;
    showApp();
  }
}

/* ── REGISTER ── */
async function doRegister() {
  const name  = $('#reg-name').val().trim();
  const email = $('#reg-email').val().trim().toLowerCase();
  const pass  = $('#reg-password').val();

  if (!name || !email || !pass) { $('#reg-err').text('Please fill all fields.'); return; }
  if (!isValidEmail(email))     { $('#reg-err').text('Invalid email format.'); return; }
  if (pass.length < 6)          { $('#reg-err').text('Password must be at least 6 characters.'); return; }
  $('#reg-err').text('');

  if (state.useBackend) {
    try {
      const data = await api('POST', '/auth/register', { name, email, password: pass });
      state.currentUser = data.user;
      state.projects = [];
      state.tasks    = [];
      showApp();
      toast('Account created! Welcome, ' + name + '! 🎉', 'success');
    } catch (e) { $('#reg-err').text(e.message); }
  } else {
    if (state.users.find(u => u.email === email)) {
      $('#reg-err').text('Email already registered.'); return;
    }
    const user = { name, email, password: pass };
    state.users.push(user);
    state.currentUser = user;
    save();
    toast('Account created! Welcome, ' + name + '! 🎉', 'success');
    showApp();
  }
}

/* ── LOGOUT ── */
async function doLogout() {
  if (state.useBackend) {
    try { await api('POST', '/auth/logout'); } catch (_) {}
  }
  state.currentUser   = null;
  state.activeProject = null;
  state.projects = [];
  state.tasks    = [];
  $('#auth-screen').css('display', 'flex');
  $('#app').removeClass('visible');
  toast('Logged out successfully.', 'success');
}

/* ── LOAD PROJECTS AFTER LOGIN (backend) ── */
async function loadProjectsFromAPI() {
  const data = await api('GET', '/projects');
  state.projects = data.projects;
  state.tasks = [];
  for (const p of state.projects) {
    const td = await api('GET', '/projects/' + p._id + '/tasks');
    state.tasks.push(...td.tasks.map(t => ({ ...t, id: t._id, projectId: t.projectId })));
  }
}

/* ── SHOW APP ── */
function showApp() {
  $('#auth-screen').hide();
  $('#app').addClass('visible');
  $('#user-avatar').text((state.currentUser.name || 'U')[0].toUpperCase());
  $('#user-name-display').text((state.currentUser.name || 'User').split(' ')[0]);
  renderSidebar();
  if (state.projects.length > 0) {
    selectProject(state.projects[0]._id || state.projects[0].id);
  }
}
