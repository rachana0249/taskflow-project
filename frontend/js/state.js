/* ════════════════════════════════════════
   state.js — Global App State + API Layer
   TaskFlow | 24BIT0441 Rachana P
   ════════════════════════════════════════
   Detects if backend is running.
   If YES  → REST API (MongoDB)
   If NO   → localStorage fallback
   ════════════════════════════════════════ */

const state = {
  users:         [{ name: 'Demo User', email: 'demo@taskflow.com', password: 'demo123' }],
  currentUser:   null,
  projects:      [],
  tasks:         [],
  activeProject: null,
  editingTask:   null,
  useBackend:    false,
};

const API = '/api';   // relative — works whether served via Express or file://

/* ── Detect backend ── */
async function detectBackend() {
  try {
    const res = await fetch(API + '/health', { signal: AbortSignal.timeout(1800) });
    state.useBackend = res.ok;
  } catch {
    state.useBackend = false;
  }
  console.log(state.useBackend ? '🟢 Backend mode (MongoDB)' : '🟡 Standalone mode (localStorage)');
}

/* ── localStorage ── */
function save() {
  localStorage.setItem('taskflow_state', JSON.stringify({
    users:    state.users,
    projects: state.projects,
    tasks:    state.tasks,
  }));
}

function load() {
  const raw = localStorage.getItem('taskflow_state');
  if (raw) {
    const s = JSON.parse(raw);
    state.users    = s.users    || state.users;
    state.projects = s.projects || [];
    state.tasks    = s.tasks    || [];
  }
}

/* ── Generic API fetch ── */
async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}
