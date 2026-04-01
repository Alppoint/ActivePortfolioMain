// notes app
// everything is saved in localStorage so notes survive a page refresh

'use strict';

// key names for saving to browser storage
const NOTES_KEY = 'ag_notes';
const THEME_KEY = 'ag_notes_theme';

// map of color names to hex codes
const COLOR_MAP = {
  none:   null,
  rose:   '#f43f5e',
  amber:  '#f59e0b',
  teal:   '#14b8a6',
  sky:    '#38bdf8',
  violet: '#a78bfa',
};

// all notes - loaded from storage on startup
let notes = [];

// id of the note currently open in the editor
let activeId = null;

// what the user typed in the search box
let searchQuery = '';

// timer for autosave (so we don't save on every keystroke)
let saveTimer = null;

// stores the function to run when user confirms delete
let pendingAction = null;

// shortcut - get element by id
const $ = id => document.getElementById(id);

// grab all the HTML elements we need
const html         = document.documentElement;
const noteList     = $('noteList');
const sidebarEmpty = $('sidebarEmpty');
const searchInput  = $('searchInput');
const searchClear  = $('searchClear');
const btnNew       = $('btnNew');
const btnNewLg     = $('btnNewLg');
const editorEmpty  = $('editorEmpty');
const editorInner  = $('editorInner');
const noteTitle    = $('noteTitle');
const noteBody     = $('noteBody');
const editorMeta   = $('editorMeta');
const wordCount    = $('wordCount');
const charCount    = $('charCount');
const btnPin       = $('btnPin');
const btnDelete    = $('btnDelete');
const colorTrigger = $('colorTrigger');
const colorDot     = $('colorDot');
const colorPopover = $('colorPopover');
const toast        = $('toast');
const modalOverlay = $('modalOverlay');
const modalConfirm = $('modalConfirm');
const modalCancel  = $('modalCancel');
const sidebar      = $('sidebar');
const mobToggle    = $('mobToggle');

// runs when the page loads
function init() {
  loadNotes();
  applyTheme(localStorage.getItem(THEME_KEY) || 'midnight');
  renderList();

  // open the first pinned note, or just the first note
  if (notes.length > 0) {
    const pinned = notes.find(n => n.pinned);
    openNote((pinned || notes[0]).id);
  }

  bindEvents();
}

// load notes from localStorage
function loadNotes() {
  try {
    notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
  } catch {
    notes = [];
  }
}

// save notes to localStorage
function saveNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// create a brand new empty note
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
  notes.unshift(note); // add to top of list
  saveNotes();
  renderList();
  openNote(note.id);
  showToast('New note created');
  setTimeout(() => noteTitle.focus(), 80); // focus the title after animation
}

// open a note in the editor by its id
function openNote(id) {
  activeId = id;
  const note = getNoteById(id);
  if (!note) return;

  // hide the empty state, show the editor
  editorEmpty.style.display = 'none';
  editorInner.style.display = 'flex';

  // fill in the editor fields
  noteTitle.value = note.title;
  noteBody.value  = note.body;
  updateMeta(note);
  updateWordCount();
  updateColorUI(note.color);
  updatePinBtn(note.pinned);

  renderList(); // refresh so the active note gets highlighted
  closeMobileSidebar();
}

// find a note object by its id
function getNoteById(id) {
  return notes.find(n => n.id === id) || null;
}

// update a field on the currently open note and save
function updateActiveNote(field, value) {
  const note = getNoteById(activeId);
  if (!note) return;
  note[field]    = value;
  note.updatedAt = new Date().toISOString();
  saveNotes();
  updateMeta(note);
  renderList();
}

// delete a note by id
function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  saveNotes();

  // if we deleted the open note, clear the editor
  if (activeId === id) {
    activeId = null;
    editorInner.style.display = 'none';
    editorEmpty.style.display = 'flex';
  }
  renderList();
  showToast('Note deleted');
}

// toggle the pin on a note
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

// rebuild the note list in the sidebar
function renderList() {
  const query = searchQuery.toLowerCase();

  // pinned notes go to the top, then sort by last edited
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // filter by search text if there's a query
  const filtered = query
    ? sorted.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query))
    : sorted;

  noteList.innerHTML = '';

  // show the empty message if nothing to display
  if (filtered.length === 0) {
    sidebarEmpty.style.display = '';
    noteList.style.display = 'none';
    return;
  }
  sidebarEmpty.style.display = 'none';
  noteList.style.display = '';

  // create a list item for each note
  filtered.forEach(note => {
    const li = document.createElement('li');
    li.className = 'note-item' +
      (note.id === activeId ? ' active' : '') +
      (note.color && note.color !== 'none' ? ' has-color' : '');

    if (note.color && note.color !== 'none') {
      li.dataset.noteColor = note.color;
      li.style.setProperty('--item-color', COLOR_MAP[note.color]);
    }

    // show first 60 chars as preview
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

// update the "last edited" text above the editor
function updateMeta(note) {
  editorMeta.textContent = 'Last edited ' + relativeDate(note.updatedAt);
}

// count words and characters in the editor
function updateWordCount() {
  const text  = noteBody.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = noteBody.value.length;
  wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  charCount.textContent = `${chars} char${chars !== 1 ? 's' : ''}`;
}

// update the pin button look based on pin state
function updatePinBtn(pinned) {
  btnPin.classList.toggle('pinned', pinned);
  btnPin.title = pinned ? 'Unpin note' : 'Pin note';
}

// update the small color dot in the toolbar
function updateColorUI(color) {
  const hex = COLOR_MAP[color] || null;
  colorDot.style.background = hex || 'transparent';
  colorDot.style.border = hex ? '2px solid transparent' : '2px dashed var(--muted)';
}

// apply a theme by setting data-theme on the html element
function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  // update the active swatch dot
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === theme);
  });
}

// close the sidebar on mobile
function closeMobileSidebar() {
  sidebar.classList.remove('open');
}

// attach all event listeners
function bindEvents() {
  // new note buttons
  btnNew.addEventListener('click', createNote);
  btnNewLg.addEventListener('click', createNote);

  // autosave title after user stops typing for 400ms
  noteTitle.addEventListener('input', () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => updateActiveNote('title', noteTitle.value), 400);
    renderList(); // update sidebar immediately so title shows
  });

  // autosave body and update word count
  noteBody.addEventListener('input', () => {
    updateWordCount();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => updateActiveNote('body', noteBody.value), 400);
  });

  // pin/unpin the open note
  btnPin.addEventListener('click', () => {
    if (activeId) togglePin(activeId);
  });

  // open delete popup when trash button is clicked
  btnDelete.addEventListener('click', () => {
    if (!activeId) return;
    const note = getNoteById(activeId);
    openModal(`Delete "${note?.title || 'Untitled'}"?`);
  });

  // modal buttons
  modalConfirm.addEventListener('click', () => {
    if (pendingAction) {
      pendingAction();
      pendingAction = null;
    }
    closeModal();
  });
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  // search box
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

  // theme swatches - clicking one applies that theme
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => applyTheme(swatch.dataset.theme));
  });

  // color picker toggle
  colorTrigger.addEventListener('click', e => {
    e.stopPropagation();
    colorPopover.classList.toggle('open');
  });

  // color options inside the picker
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

  // clicking anywhere else closes the color picker
  document.addEventListener('click', e => {
    if (!$('colorPicker').contains(e.target)) {
      colorPopover.classList.remove('open');
    }
  });

  // hamburger button for mobile
  mobToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

  // keyboard shortcuts
  document.addEventListener('keydown', e => {
    // Ctrl+N = new note
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      createNote();
    }
    // Ctrl+P = pin/unpin
    if ((e.ctrlKey || e.metaKey) && e.key === 'p' && activeId) {
      e.preventDefault();
      togglePin(activeId);
    }
    // Escape = close popups/sidebar
    if (e.key === 'Escape') {
      colorPopover.classList.remove('open');
      closeMobileSidebar();
    }
  });
}

// show the delete confirmation modal
function openModal(msg) {
  document.querySelector('.modal-msg').textContent = msg;
  pendingAction = () => deleteNote(activeId);
  modalOverlay.classList.add('show');
}

// close the confirmation modal
function closeModal() {
  modalOverlay.classList.remove('show');
  pendingAction = null;
}

// convert a timestamp to something like "5m ago" or "2d ago"
function relativeDate(iso) {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// safely escape text so it doesn't break HTML
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// show a small notification at the bottom of the screen
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// add 3 example notes the first time the app is opened
function seedDemoNotes() {
  if (notes.length > 0) return; // don't add if notes already exist

  const demos = [
    {
      title: '📚 BCA Semester Goals',
      body: 'Things to focus on this semester:\n\n1. Master C pointers and structures\n2. Build at least 2 web projects\n3. Start learning Python for ML\n4. Keep up with GitHub daily\n\nRemember: consistency beats intensity.',
      color: 'violet',
      pinned: true,
    },
    {
      title: '💡 Project Ideas',
      body: 'Upcoming project ideas to explore:\n\n• Weather app using Open-Meteo API\n• Pomodoro timer with stats\n• Simple markdown editor\n• Portfolio analytics dashboard\n\nPriority: weather app first.',
      color: 'sky',
      pinned: false,
    },
    {
      title: '🌐 Useful Resources',
      body: 'Quick links I keep coming back to:\n\nMDN Web Docs — best reference\nCSS Tricks — layout tips\nGSAP docs — animation\nThree.js journey — WebGL course\n\nBookmark all of these!',
      color: 'teal',
      pinned: false,
    },
  ];

  const now = Date.now();
  demos.forEach((d, i) => {
    notes.push({
      id:        now + i,
      title:     d.title,
      body:      d.body,
      pinned:    d.pinned,
      color:     d.color,
      createdAt: new Date(now - (demos.length - i) * 86400000).toISOString(),
      updatedAt: new Date(now - i * 3600000).toISOString(),
    });
  });
  saveNotes();
}

// start everything
seedDemoNotes();
init();
