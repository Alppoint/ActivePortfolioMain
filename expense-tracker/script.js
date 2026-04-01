// expense tracker app
// i store everything in localStorage so it doesn't disappear on refresh

'use strict';

// key name used to save data in the browser
const STORAGE_KEY = 'ag_expenses';

// each category has an emoji and a color for the chart
const CATEGORY_META = {
  Food:          { emoji: '🍔', color: '#f97316' },
  Transport:     { emoji: '🚌', color: '#3b82f6' },
  Shopping:      { emoji: '🛍️', color: '#ec4899' },
  Entertainment: { emoji: '🎮', color: '#a855f7' },
  Health:        { emoji: '💊', color: '#22c55e' },
  Education:     { emoji: '📚', color: '#eab308' },
  Bills:         { emoji: '💡', color: '#06b6d4' },
  Other:         { emoji: '📦', color: '#6b7280' },
};

// all the expenses - loaded from storage when page opens
let expenses = [];

// which category pill is selected right now
let activeFilter = 'All';

// what the user typed in the search box
let searchQuery = '';

// id of the expense waiting to be deleted
let pendingDeleteId = null;

// helper - gets an element by id (shorter to type)
const $ = id => document.getElementById(id);

// get all the elements i need from the page
const form         = $('expenseForm');
const fAmount      = $('expAmount');
const fCategory    = $('expCategory');
const fDesc        = $('expDesc');
const fDate        = $('expDate');
const txnItems     = $('txnItems');
const emptyState   = $('emptyState');
const txnCount     = $('txnCount');
const totalAmount  = $('totalAmount');
const statMonth    = $('statMonth');
const statAvg      = $('statAvg');
const statCount    = $('statCount');
const statTop      = $('statTop');
const legend       = $('legend');
const chartCenterVal = $('chartCenterVal');
const searchInput  = $('searchInput');
const filterPills  = $('filterPills');
const btnReset     = $('btnReset');
const toast        = $('toast');
const modalOverlay = $('modalOverlay');
const modalMsg     = $('modalMsg');
const modalConfirm = $('modalConfirm');
const modalCancel  = $('modalCancel');
const canvas       = $('donutCanvas');
const ctx          = canvas.getContext('2d');

// runs everything when the page first loads
function init() {
  loadData();
  setDefaultDate();
  renderAll();

  // when the form is submitted, add the expense
  form.addEventListener('submit', handleAdd);

  // filter list as user types in the search box
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase();
    renderList();
  });

  // when a category pill is clicked, filter by that category
  filterPills.addEventListener('click', e => {
    const pill = e.target.closest('.fpill');
    if (!pill) return;
    activeFilter = pill.dataset.cat;
    document.querySelectorAll('.fpill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderList();
  });

  // reset button - ask user before clearing everything
  btnReset.addEventListener('click', () => {
    if (expenses.length === 0) return showToast('Nothing to reset.');
    openModal('Delete ALL expenses? This cannot be undone.', '__all__');
  });

  modalConfirm.addEventListener('click', confirmDelete);
  modalCancel.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
}

// load saved data from browser storage
function loadData() {
  try {
    expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    expenses = [];
  }
}

// save data to browser storage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// runs when user submits the add expense form
function handleAdd(e) {
  e.preventDefault();

  const amount   = parseFloat(fAmount.value);
  const category = fCategory.value;
  const desc     = fDesc.value.trim() || category;
  const date     = fDate.value;

  // check all fields are filled in correctly
  if (!amount || amount <= 0) { shakeEl(fAmount); return; }
  if (!category) { shakeEl(fCategory); return; }
  if (!date) { shakeEl(fDate); return; }

  // build the new expense object
  const entry = {
    id: Date.now() + Math.random(),
    amount,
    category,
    desc,
    date,
  };

  // add it to the top of the list
  expenses.unshift(entry);
  saveData();
  renderAll();
  showToast(`₹${fmt(amount)} added to ${category}`);

  // clear the form after adding
  form.reset();
  setDefaultDate();
  fCategory.value = '';
}

// open the delete confirmation popup
function openModal(msg, id) {
  modalMsg.textContent = msg;
  pendingDeleteId = id;
  modalOverlay.classList.add('show');
}

// close the popup without doing anything
function closeModal() {
  modalOverlay.classList.remove('show');
  pendingDeleteId = null;
}

// user clicked confirm in the popup - now actually delete
function confirmDelete() {
  if (pendingDeleteId === '__all__') {
    expenses = [];
    showToast('All expenses cleared.');
  } else {
    expenses = expenses.filter(e => e.id !== pendingDeleteId);
    showToast('Expense deleted.');
  }
  saveData();
  renderAll();
  closeModal();
}

// re-render the list, stats and chart together
function renderAll() {
  renderList();
  renderStats();
  renderChart();
}

// show the expense list (filtered by search and category)
function renderList() {
  const filtered = expenses.filter(exp => {
    const catMatch  = activeFilter === 'All' || exp.category === activeFilter;
    const textMatch = !searchQuery ||
      exp.desc.toLowerCase().includes(searchQuery) ||
      exp.category.toLowerCase().includes(searchQuery) ||
      String(exp.amount).includes(searchQuery);
    return catMatch && textMatch;
  });

  txnCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'}`;
  txnItems.innerHTML = '';

  // show the empty state message if nothing to show
  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  // create a row for each expense
  filtered.forEach(exp => {
    const meta = CATEGORY_META[exp.category] || CATEGORY_META['Other'];
    const li   = document.createElement('li');
    li.className = 'txn-item';
    li.style.setProperty('--cat-color', meta.color);
    li.innerHTML = `
      <span class="txn-emoji">${meta.emoji}</span>
      <div class="txn-info">
        <p class="txn-desc">${esc(exp.desc)}</p>
        <p class="txn-meta">${exp.category} · ${formatDate(exp.date)}</p>
      </div>
      <span class="txn-amount">₹${fmt(exp.amount)}</span>
      <button class="txn-del" title="Delete" data-id="${exp.id}">✕</button>
    `;
    // clicking the delete button opens the confirm popup
    li.querySelector('.txn-del').addEventListener('click', () => {
      openModal(`Delete "${esc(exp.desc)}"?`, exp.id);
    });
    txnItems.appendChild(li);
  });
}

// update the 4 stat cards at the top
function renderStats() {
  // add up all expenses
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  totalAmount.textContent = `₹${fmt(total)}`;

  // total just for this month
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonth = expenses
    .filter(e => e.date.startsWith(monthStr))
    .reduce((s, e) => s + e.amount, 0);
  animateStatVal(statMonth, `₹${fmt(thisMonth)}`);

  // average per day (based on unique dates)
  const dates = new Set(expenses.map(e => e.date));
  const avg = dates.size > 0 ? total / dates.size : 0;
  animateStatVal(statAvg, `₹${fmt(avg)}`);

  animateStatVal(statCount, expenses.length);

  // find the most-spent category
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const top = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  animateStatVal(statTop, top ? top[0] : '—');
}

// briefly flash a stat value when it changes
function animateStatVal(el, newVal) {
  if (el.textContent !== String(newVal)) {
    el.classList.add('bump');
    el.textContent = String(newVal);
    setTimeout(() => el.classList.remove('bump'), 400);
  }
}

// draw the donut chart and the legend below it
function renderChart() {
  // group all expenses by category
  const catTotals = {};
  expenses.forEach(e => {
    catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
  });
  const total = Object.values(catTotals).reduce((s, v) => s + v, 0);

  // sort biggest category first
  const data = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => ({
      cat,
      amt,
      pct: total > 0 ? amt / total : 0,
      color: CATEGORY_META[cat]?.color || '#6b7280',
    }));

  drawDonut(data, total);
  renderLegend(data, total);
}

// actually draw the donut on the canvas element
function drawDonut(data, total) {
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const outerR = Math.min(W, H) / 2 - 10;
  const innerR = outerR * 0.58;

  ctx.clearRect(0, 0, W, H);

  // draw a grey ring if there's no data yet
  if (data.length === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = outerR - innerR;
    ctx.stroke();
    chartCenterVal.textContent = '—';
    return;
  }

  let startAngle = -Math.PI / 2;
  const gap = 0.035; // small gap between slices so they look separate

  data.forEach(slice => {
    const sliceAngle = slice.pct * (Math.PI * 2 - gap * data.length);
    const endAngle   = startAngle + sliceAngle;

    // draw one arc slice
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle + gap / 2, endAngle - gap / 2);
    ctx.arc(cx, cy, innerR, endAngle - gap / 2, startAngle + gap / 2, true);
    ctx.closePath();

    ctx.fillStyle = slice.color;
    ctx.shadowColor = slice.color;
    ctx.shadowBlur  = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    startAngle = endAngle;
  });

  // show the top category name in the middle
  chartCenterVal.textContent = data.length > 0 ? data[0].cat : '—';
}

// draw the small legend under the chart
function renderLegend(data, total) {
  legend.innerHTML = '';
  data.slice(0, 5).forEach(slice => {
    const li = document.createElement('li');
    li.className = 'legend-item';
    li.innerHTML = `
      <span class="legend-dot-label">
        <span class="legend-dot" style="background:${slice.color}"></span>
        <span class="legend-name">${slice.cat}</span>
      </span>
      <span class="legend-pct">${Math.round(slice.pct * 100)}% · ₹${fmt(slice.amt)}</span>
    `;
    legend.appendChild(li);
  });
  if (data.length === 0) {
    legend.innerHTML = '<li style="color:var(--muted);font-size:.8rem;text-align:center">No data yet</li>';
  }
}

// format a number like Indian currency (e.g. 1,23,456.00)
function fmt(n) {
  return Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// turn a date string into something readable like "01 Apr 2026"
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// set today's date in the date input by default
function setDefaultDate() {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  fDate.value = `${yyyy}-${mm}-${dd}`;
}

// escape text so it doesn't break the HTML
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// show a small popup message at the bottom of the screen
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// shake an input field to show there's an error
function shakeEl(el) {
  el.style.animation = 'none';
  el.getBoundingClientRect(); // force the browser to reset the animation
  el.style.animation = 'shake .35s var(--trans)';
  setTimeout(() => el.style.animation = '', 400);
}

// inject the shake keyframe animation into the page
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-6px); }
  40%      { transform: translateX(6px); }
  60%      { transform: translateX(-4px); }
  80%      { transform: translateX(3px); }
}`;
document.head.appendChild(shakeStyle);

// start the app
init();
