/* ════════════════════════════════════════
   ui.js — UI Utilities (Toast, Keyboard, Sidebar)
   TaskFlow | 24BIT0441 Rachana P
   jQuery-powered interactions
   ════════════════════════════════════════ */

/**
 * Show a toast notification using jQuery
 * @param {string} msg   - Message text
 * @param {string} type  - 'success' | 'err'
 */
function toast(msg, type) {
  type = type || 'success';
  const icon = type === 'success' ? '✅' : '⚠️';
  const $el = $('<div>')
    .addClass('toast-msg toast-' + type)
    .html(icon + ' ' + msg);
  $('#toast').append($el);
  setTimeout(() => $el.fadeOut(300, function() { $(this).remove(); }), 3000);
}

/** Toggle sidebar open/close on mobile */
function toggleSidebar() {
  $('#sidebar').toggleClass('open');
  $('#sidebar-backdrop').toggleClass('active');
}

/** Global keyboard shortcuts (jQuery) */
$(document).on('keydown', function(e) {
  // Escape closes any open modal
  if (e.key === 'Escape') {
    closeTaskModal();
    closeProjectModal();
    closeConfirmModal();
    if ($('#sidebar').hasClass('open')) toggleSidebar();
  }
  // Enter submits focused form fields
  if (e.key === 'Enter') {
    const id = $(document.activeElement).attr('id');
    if (id === 'project-name-input') saveProject();
    if (id === 'login-password')     doLogin();
    if (id === 'reg-password')       doRegister();
    if (id === 'task-title-input')   saveTask();
  }
});

/** Close sidebar when clicking outside on mobile */
$(document).on('click', function(e) {
  if ($(window).width() <= 768) {
    if (!$(e.target).closest('#sidebar, #sidebar-toggle').length && $('#sidebar').hasClass('open')) {
      toggleSidebar();
    }
  }
});

/** jQuery input validation feedback */
$(document).on('input', '.form-group input, .form-group textarea', function() {
  if ($(this).val().trim()) {
    $(this).css('border-color', 'var(--border)');
  }
});
