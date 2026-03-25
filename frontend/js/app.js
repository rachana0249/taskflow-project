/* ════════════════════════════════════════
   app.js — App Initialization
   TaskFlow | 24BIT0441 Rachana P
   ════════════════════════════════════════ */

(async function init() {
  // 1. Detect if backend is running
  await detectBackend();

  if (!state.useBackend) {
    // 2a. Standalone mode: load from localStorage
    load();

    // Seed demo data on first run
    if (state.projects.length === 0) {
      const pid = 'demo_proj';
      state.projects.push({
        id: pid, name: 'TaskFlow Demo',
        desc: 'Starter project — try adding, editing, moving tasks!',
        createdAt: new Date().toISOString(),
      });
      state.tasks.push(
        { id:'t1', projectId:pid, title:'Design Kanban UI', desc:'Responsive board with CSS3.', priority:'high', assignee:'Rachana', due:'2025-04-10', status:'done', createdAt: new Date().toISOString() },
        { id:'t2', projectId:pid, title:'Implement Auth API', desc:'Login & register endpoints.', priority:'high', assignee:'Dev Team', due:'2025-04-15', status:'progress', createdAt: new Date().toISOString() },
        { id:'t3', projectId:pid, title:'Write Unit Tests', desc:'Test all REST endpoints.', priority:'medium', assignee:'', due:'', status:'todo', createdAt: new Date().toISOString() },
        { id:'t4', projectId:pid, title:'Setup MongoDB Atlas', desc:'Configure cloud database.', priority:'medium', assignee:'Rachana', due:'2025-04-20', status:'todo', createdAt: new Date().toISOString() },
        { id:'t5', projectId:pid, title:'Deploy to Vercel', desc:'CI/CD pipeline setup.', priority:'low', assignee:'', due:'', status:'todo', createdAt: new Date().toISOString() }
      );
      save();
    }
  }
  // 2b. Backend mode: session-check happens on login
})();
