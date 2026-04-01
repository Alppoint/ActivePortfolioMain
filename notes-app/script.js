/* ==============================================
   NOTES APP — script.js
   Akshit Gaur Portfolio
   ============================================== */

'use strict';

/* ─── Constants ──────────────────────────────── */
const NOTES_KEY = 'ag_notes';
const THEME_KEY = 'ag_notes_theme';

const COLOR_MAP = {
  none:   null,
  rose:   '#f43f5e',
  amber:  '#f59e0b',
  teal:   '#14b8a6',
  sky:    '#38bdf8',
  violet: '#a78bfa',
};

/* ─── State ──────────────────────────────────── */
let notes        = [];
let activeId     = null;
let searchQuery  = '';
let saveTimer    = null;
let pendingAction = null; // for modal

/* ─── DOM ─────────────────────────────────────── */
const $ = id => document.getElementById(id);
const html        = document.documentElement;
const noteList    = $('noteList');
const sidebarEmpty = $('sidebarEmpty');
const searchInput = $('searchInput');
const searchClear = $('searchClear');
const btnNew      = $('btnNew');
const btnNewLg    = $('btnNewLg');
const editorEmpty = $('editorEmpty');
const editorInner = $('editorInner');
const noteTitle   = $('noteTitle');
const noteBody    = $('noteBody');
const editorMeta  = $('editorMeta');
const wordCount   = $('wordCount');
const charCount   = $('charCount');
const btnPin      = $('btnPin');
const btnDelete   = $('btnDelete');
const colorTrigger = $('colorTrigger');
const colorDot    = $('colorDot');
const colorPopover = $('colorPopover');
const toast       = $('toast');
const modalOverlay = $('modalOverlay');
const modalConfirm = $('modalConfirm');
const modalCancel  = $('modalCancel');
const sidebar     = $('sidebar');
const mobToggle   = $('mobToggle');

/* ─── Init ───────────────────────────────────── */
function init() {
  loadNotes();
  applyTheme(localStorage.getItem(THEME_KEY) || 'midnight');
  renderList();

  // If notes exist, open the first pinned, else first note
  if (notes.length > 0) {
    const pinned = notes.find(n => n.pinned);
    openNote((pinned || notes[0]).id);
  }

  bindEvents();
}

/* ─── Storage ─────────────────────────────────── */
function loadNotes() {
  try { notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || []; }
  catch { notes = []; }
}
function saveNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

/* ─── Note CRUD ───────────────────────────────── */
function createNote() {
  const note = {
    id:        Date.now() + Math.random(),
    title:     '',
    body:      '',
    pinned:    false,
    color:     'none',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.unshift(note);
  saveNotes();
  renderList();
  openNote(note.id);
  showToast('New note created');
  // Focus title after animation
  setTimeout(() => noteTitle.focus(), 80);
}

function openNote(id) {
  activeId = id;
  const note = getNoteById(id);
  if (!note) return;

  editorEmpty.style.display = 'none';
  editorInner.style.display = 'flex';

  noteTitle.value = note.title;
  noteBody.value  = note.body;
  updateMeta(note);
  updateWordCount();
  updateColorUI(note.color);
  updatePinBtn(note.pinned);

  renderList(); // refresh active state
  closeMobileSidebar();
}

function getNoteById(id) {
  return notes.find(n => n.id === id) || null;
}

function updateActiveNote(field, value) {
  const note = getNoteById(activeId);
  if (!note) return;
  note[field]    = value;
  note.updatedAt = new Date().toISOString();
  saveNotes();
  updateMeta(note);
  renderList();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  if (activeId === id) {
    activeId = null;
    editorInner.style.display = 'none';
    editorEmpty.style.display = 'flex';
  }
  renderList();
  showToast('Note deleted');
}

function togglePin(id) {
  const note = getNoteById(id);
  if (!note) return;
  note.pinned    = !note.pinned;
  note.updatedAt = new Date().toISOString();
  saveNotes();
  renderList();
  updatePinBtn(note.pinned);
  showToast(note.pinned ? 'Note pinned 📌' : 'Note unpinned');
}

/* ─── Render ──────────────────────────────────── */
function renderList() {
  const query = searchQuery.toLowerCase();

  // Sort: pinned first, then by updatedAt desc
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const filtered = query
    ? sorted.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query))
    : sorted;

  noteList.innerHTML = '';

  if (filtered.length === 0) {
    sidebarEmpty.style.display = '';
    noteList.style.display = 'none';
    return;
  }
  sidebarEmpty.style.display = 'none';
  noteList.style.display = '';

  filtered.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item' +
      (note.id === activeId ? ' active' : '') +
      (note.color && note.color !== 'none' ? ' has-color' : '');
    if (note.color && note.color !== 'none') {
      li.dataset.noteColor = note.color;
      li.style.setProperty('--item-color', COLOR_MAP[note.color]);
    }
    const preview = note.body.replace(/\n/g, ' ').trim().slice(0, 60) || 'No content';
    const dateStr = relativeDate(note.updatedAt);

    li.innerHTML = `
      <div class="note-item-top">
        <span class="note-item-title">${esc(note.title) || 'Untitled'}</span>
        ${note.pinned ? '<span class="pin-badge">📌</span>' : ''}
      </div>
      <p class="note-item-preview">${esc(preview)}</p>
      <p class="note-item-date">${dateStr}</p>
    `;
    li.addEventListener('click', () => openNote(note.id));
    noteList.appendChild(li);
  });
}

/* ─── UI helpers ──────────────────────────────── */
function updateMeta(note) {
  editorMeta.textContent = 'Last edited ' + relativeDate(note.updatedAt);
}

function updateWordCount() {
  const text = noteBody.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = noteBody.value.length;
  wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  charCount.textContent = `${chars} char${chars !== 1 ? 's' : ''}`;
}

function updatePinBtn(pinned) {
  btnPin.classList.toggle('pinned', pinned);
  btnPin.title = pinned ? 'Unpin note' : 'Pin note';
}

function updateColorUI(color) {
  const hex = COLOR_MAP[color] || null;
  colorDot.style.background = hex || 'transparent';
  colorDot.style.border = hex ? '2px solid transparent' : '2px dashed var(--muted)';
}

/* ─── Themes ──────────────────────────────────── */
function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === theme);
  });
}

/* ─── Mobile sidebar ──────────────────────────── */
function closeMobileSidebar() {
  sidebar.classList.remove('open');
}

/* ─── Events ──────────────────────────────────── */
function bindEvents() {
  // New note
  btnNew.addEventListener('click', createNote);
  btnNewLg.addEventListener('click', createNote);

  // Title input — autosave
  noteTitle.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => updateActiveNote('title', noteTitle.value), 400);
    renderList(); // optimistic update
  });

  // Body input — autosave + word count
  noteBody.addEventListener('input', () => {
    updateWordCount();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => updateActiveNote('body', noteBody.value), 400);
  });

  // Pin
  btnPin.addEventListener('click', () => {
    if (activeId) togglePin(activeId);
  });

  // Delete
  btnDelete.addEventListener('click', () => {
    if (!activeId) return;
    const note = getNoteById(activeId);
    openModal(`Delete "${note?.title || 'Untitled'}"?`);
  });

  // Modal
  modalConfirm.addEventListener('click', () => {
    if (pendingAction) { pendingAction(); pendingAction = null; }
    closeModal();
  });
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  // Search
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    searchClear.classList.toggle('visible', searchQuery.length > 0);
    renderList();
  });
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.classList.remove('visible');
    renderList();
    searchInput.focus();
  });

  // Theme swatches
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => applyTheme(swatch.dataset.theme));
  });

  // Color picker
  colorTrigger.addEventListener('click', e => {
    e.stopPropagation();
    colorPopover.classList.toggle('open');
  });
  document.querySelectorAll('.cpill').forEach(pill => {
    pill.addEventListener('click', () => {
      const color = pill.dataset.color;
      if (activeId) {
        updateActiveNote('color', color);
        updateColorUI(color);
        colorPopover.classList.remove('open');
      }
    });
  });
  document.addEventListener('click', e => {
    if (!$('colorPicker').contains(e.target)) {
      colorPopover.classList.remove('open');
    }
  });

  // Mobile sidebar toggle
  mobToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    // Ctrl/Cmd + N → new note
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      createNote();
    }
    // Ctrl/Cmd + P → toggle pin
    if ((e.ctrlKey || e.metaKey) && e.key === 'p' && activeId) {
      e.preventDefault();
      togglePin(activeId);
    }
    // Escape → close sidebar on mobile / close color popover
    if (e.key === 'Escape') {
      colorPopover.classList.remove('open');
      closeMobileSidebar();
    }
  });
}

/* ─── Modal ───────────────────────────────────── */
function openModal(msg) {
  document.querySelector('.modal-msg').textContent = msg;
  pendingAction = () => deleteNote(activeId);
  modalOverlay.classList.add('show');
}
function closeModal() {
  modalOverlay.classList.remove('show');
  pendingAction = null;
}

/* ─── Utilities ───────────────────────────────── */
function relativeDate(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ─── Seed demo notes on first launch ─────────── */
function seedDemoNotes() {
  if (notes.length > 0) return;
  const demos = [
    {
      title: '📚 BCA Semester Goals',
      body: 'Things to focus on this semester:\n\n1. Master C pointers and structures\n2. Build at least 2 web projects\n3. Start learning Python for ML\n4. Keep up with GitHub daily\n\nRemember: consistency beats intensity.',
      color: 'violet', pinned: true,
    },
    {
      title: '💡 Project Ideas',
      body: 'Upcoming project ideas to explore:\n\n• Weather app using Open-Meteo API\n• Pomodoro timer with stats\n• Simple markdown editor\n• Portfolio analytics dashboard\n\nPriority: weather app first.',
      color: 'sky', pinned: false,
    },
    {
      title: '🌐 Useful Resources',
      body: 'Quick links I keep coming back to:\n\nMDN Web Docs — best reference\nCSS Tricks — layout tips\nGSAP docs — animation\nThree.js journey — WebGL course\n\nBookmark all of these!',
      color: 'teal', pinned: false,
    },
  ];
  const now = Date.now();
  demos.forEach((d, i) => {
    notes.push({
      id: now + i,
      title: d.title,
      body: d.body,
      pinned: d.pinned,
      color: d.color,
      createdAt: new Date(now - (demos.length - i) * 86400000).toISOString(),
      updatedAt: new Date(now - i * 3600000).toISOString(),
    });
  });
  saveNotes();
}

/* ─── Kick off ────────────────────────────────── */
seedDemoNotes();
init();
