/* ==============================================
   EXPENSE TRACKER — script.js
   Akshit Gaur Portfolio
   ============================================== */

'use strict';

/* ─── Constants ────────────────────────────────── */
const STORAGE_KEY = 'ag_expenses';

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

/* ─── State ─────────────────────────────────────── */
let expenses = []; // { id, amount, category, desc, date }
let activeFilter = 'All';
let searchQuery  = '';
let pendingDeleteId = null;

/* ─── DOM refs ──────────────────────────────────── */
const $ = id => document.getElementById(id);
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

/* ─── Init ──────────────────────────────────────── */
function init() {
  loadData();
  setDefaultDate();
  renderAll();

  form.addEventListener('submit', handleAdd);
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase();
    renderList();
  });
  filterPills.addEventListener('click', e => {
    const pill = e.target.closest('.fpill');
    if (!pill) return;
    activeFilter = pill.dataset.cat;
    document.querySelectorAll('.fpill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderList();
  });
  btnReset.addEventListener('click', () => {
    if (expenses.length === 0) return showToast('Nothing to reset.');
    openModal('Delete ALL expenses? This cannot be undone.', '__all__');
  });
  modalConfirm.addEventListener('click', confirmDelete);
  modalCancel.addEventListener('click',  closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
}

/* ─── Data ──────────────────────────────────────── */
function loadData() {
  try { expenses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { expenses = []; }
}
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

/* ─── Add ───────────────────────────────────────── */
function handleAdd(e) {
  e.preventDefault();
  const amount   = parseFloat(fAmount.value);
  const category = fCategory.value;
  const desc     = fDesc.value.trim() || category;
  const date     = fDate.value;

  if (!amount || amount <= 0) { shakeEl(fAmount); return; }
  if (!category) { shakeEl(fCategory); return; }
  if (!date) { shakeEl(fDate); return; }

  const entry = {
    id: Date.now() + Math.random(),
    amount, category, desc, date,
  };
  expenses.unshift(entry);
  saveData();
  renderAll();
  showToast(`₹${fmt(amount)} added to ${category}`);
  form.reset();
  setDefaultDate();
  fCategory.value = '';
}

/* ─── Delete ────────────────────────────────────── */
function openModal(msg, id) {
  modalMsg.textContent  = msg;
  pendingDeleteId       = id;
  modalOverlay.classList.add('show');
}
function closeModal() {
  modalOverlay.classList.remove('show');
  pendingDeleteId = null;
}
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

/* ─── Render ────────────────────────────────────── */
function renderAll() {
  renderList();
  renderStats();
  renderChart();
}

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

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

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
    li.querySelector('.txn-del').addEventListener('click', () => {
      openModal(`Delete "${esc(exp.desc)}"?`, exp.id);
    });
    txnItems.appendChild(li);
  });
}

function renderStats() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  totalAmount.textContent = `₹${fmt(total)}`;

  // This month
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonth = expenses
    .filter(e => e.date.startsWith(monthStr))
    .reduce((s, e) => s + e.amount, 0);
  animateStatVal(statMonth, `₹${fmt(thisMonth)}`);

  // Avg per day (distinct dates)
  const dates = new Set(expenses.map(e => e.date));
  const avg = dates.size > 0 ? total / dates.size : 0;
  animateStatVal(statAvg, `₹${fmt(avg)}`);

  animateStatVal(statCount, expenses.length);

  // Top category
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const top = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  animateStatVal(statTop, top ? top[0] : '—');
}

function animateStatVal(el, newVal) {
  if (el.textContent !== String(newVal)) {
    el.classList.add('bump');
    el.textContent = String(newVal);
    setTimeout(() => el.classList.remove('bump'), 400);
  }
}

/* ─── Donut Chart ───────────────────────────────── */
function renderChart() {
  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const total = Object.values(catTotals).reduce((s, v) => s + v, 0);

  const data = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => ({
      cat, amt, pct: total > 0 ? amt / total : 0,
      color: CATEGORY_META[cat]?.color || '#6b7280',
    }));

  drawDonut(data, total);
  renderLegend(data, total);
}

function drawDonut(data, total) {
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const outerR = Math.min(W, H) / 2 - 10;
  const innerR = outerR * 0.58;

  ctx.clearRect(0, 0, W, H);

  if (data.length === 0) {
    // placeholder ring
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = outerR - innerR;
    ctx.stroke();
    chartCenterVal.textContent = '—';
    return;
  }

  let startAngle = -Math.PI / 2;
  const gap = 0.035; // radians gap between slices

  data.forEach(slice => {
    const sliceAngle = slice.pct * (Math.PI * 2 - gap * data.length);
    const endAngle   = startAngle + sliceAngle;

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

  chartCenterVal.textContent = data.length > 0 ? data[0].cat : '—';
}

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

/* ─── Helpers ───────────────────────────────────── */
function fmt(n) {
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function setDefaultDate() {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  fDate.value = `${yyyy}-${mm}-${dd}`;
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
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function shakeEl(el) {
  el.style.animation = 'none';
  el.getBoundingClientRect(); // reflow
  el.style.animation = 'shake .35s var(--trans)';
  setTimeout(() => el.style.animation = '', 400);
}

// Shake keyframe injected via JS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(3px)}
}`;
document.head.appendChild(shakeStyle);

/* ─── Kick off ──────────────────────────────────── */
init();
