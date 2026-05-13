// ═══════════════════════════════════════════════════════
//  Vault Pro — Advanced Application Logic
// ═══════════════════════════════════════════════════════

const $ = id => document.getElementById(id);
const navLinks = document.querySelectorAll('.nav-link');
const tabPanels = document.querySelectorAll('.tab-panel');

// ── STATE MANAGEMENT ──
// 'state' is the single source of truth for our app's data.
// Everything the user does (logging food, changing settings, completing workouts) is stored here.
let state = {
    // User profile information
    user: { name: 'User', role: 'Member', avatar: 'https://ui-avatars.com/api/?name=User&background=6c5ce7&color=fff' },
    
    // Application settings (dark mode, kg vs lbs, macro targets)
    settings: { unit: 'metric', theme: 'default', sound: true, notify: false, targets: { cal: 2500, pro: 180, carb: 300, fat: 80 } },
    
    // An array of completed workout objects
    history: [
        {
            name: "Push A",
            date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
            volume: 8500,
            reps: 120,
            sets: 15,
            duration: 3600,
            exercises: [
                { id: 1, name: "Barbell Bench Press", sets: [{weight: "80", reps: "8", done: true}, {weight: "80", reps: "8", done: true}] },
                { id: 2, name: "Incline Dumbbell Press", sets: [{weight: "30", reps: "10", done: true}] }
            ]
        },
        {
            name: "Legs A",
            date: new Date(Date.now() - 3 * 86400000).toLocaleDateString(), // 3 days ago
            volume: 12000,
            reps: 90,
            sets: 12,
            duration: 4100,
            exercises: [
                { id: 9, name: "Squat (Barbell)", sets: [{weight: "100", reps: "5", done: true}, {weight: "100", reps: "5", done: true}, {weight: "105", reps: "5", done: true}] },
                { id: 10, name: "Leg Press", sets: [{weight: "200", reps: "12", done: true}] }
            ]
        },
        {
            name: "Pull A",
            date: new Date(Date.now() - 5 * 86400000).toLocaleDateString(), // 5 days ago
            volume: 9200,
            reps: 110,
            sets: 14,
            duration: 3800,
            exercises: [
                { id: 5, name: "Deadlift", sets: [{weight: "120", reps: "5", done: true}, {weight: "130", reps: "5", done: true}] },
                { id: 8, name: "Pull-ups", sets: [{weight: "0", reps: "10", done: true}, {weight: "0", reps: "8", done: true}] }
            ]
        }
    ],
    
    // An array of bodyweight logs over time
    bodyweight: [
        { date: '2026-04-01', weight: 83.0 },
        { date: '2026-04-10', weight: 82.5 },
        { date: '2026-04-20', weight: 82.2 },
        { date: '2026-05-01', weight: 81.8 },
        { date: '2026-05-08', weight: 81.5 }
    ],
    
    // The current workout being tracked (if any)
    activeWorkout: null,
    
    // Daily food logs (cleared daily in a real app)
    dailyFood: [
        { id: 1, name: "Chicken Breast (Grilled)", serving: "200g", calories: 330, protein: 62, carbs: 0, fats: 7.2 },
        { id: 11, name: "White Rice (Cooked)", serving: "2 cups", calories: 412, protein: 8.6, carbs: 89, fats: 0.8 },
        { id: 26, name: "Whey Protein Shake", serving: "1 scoop", calories: 120, protein: 24, carbs: 3, fats: 1.5 }
    ],
    
    // Water intake in glasses
    water: 0,
    
    // Member system
    memberTier: 'Rookie', // Rookie, Pro, Elite
    workoutsCompleted: 0
};

// ── PERSISTENCE (Local Storage) ──
// Saves our 'state' object to the browser's memory so data isn't lost on refresh.
function saveState() { localStorage.setItem('vault_pro_state', JSON.stringify(state)); }

// Loads the 'state' from memory when the app starts.
function loadState() {
    try {
        const saved = localStorage.getItem('vault_pro_state');
        if (saved) {
            // Merge the saved data with our default state safely
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
            state.settings = { ...state.settings, ...(parsed.settings || {}) };
            state.settings.targets = { ...state.settings.targets, ...(parsed.settings?.targets || {}) };
            if (state.water === undefined) state.water = 0;
            
            // Update the UI toggles to match the loaded settings
            if ($('setting-sound')) $('setting-sound').checked = state.settings.sound;
            if ($('setting-notify')) $('setting-notify').checked = state.settings.notify;
            
            // Update the UI inputs for nutrition targets
            if ($('target-cal')) $('target-cal').value = state.settings.targets.cal || 2500;
            if ($('target-pro')) $('target-pro').value = state.settings.targets.pro || 180;
            if ($('target-carb')) $('target-carb').value = state.settings.targets.carb || 300;
            if ($('target-fat')) $('target-fat').value = state.settings.targets.fat || 80;
        }
    } catch(e) {
        console.error('Failed to load state from local storage', e);
    }
}

// ── UTILITIES ──
// Formats seconds into MM:SS (e.g., 65 -> "01:05")
const formatTime = s => {
    const m = Math.floor(s / 60);
    return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

// Converts weight between kg and lbs (1 kg = 2.20462 lbs)
const conv = (val, to) => {
    if (!val) return 0;
    if (to === 'imperial') return Math.round(val * 2.20462); // kg to lbs
    return Math.round(val / 2.20462); // lbs to kg
};

// Displays a small pop-up notification at the bottom of the screen
function toast(msg, type = 'info') {
    const c = $('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`; // Add CSS classes for color styling
    t.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'circle-info'}"></i>${msg}`;
    c.appendChild(t);
    
    // Automatically hide and remove the toast after 3 seconds
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ── THEMES & UNITS ──
// Changes the CSS class on the <body> tag to swap themes
window.setTheme = (theme, el) => {
    document.body.className = theme === 'default' ? '' : `theme-${theme}`;
    state.settings.theme = theme;
    
    // Update the active state on the color swatches
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
    if (el) el.classList.add('active');
    saveState();
};

// Switches the global measurement unit
window.setUnit = (unit) => {
    if (state.settings.unit === unit) return;
    state.settings.unit = unit;
    
    // Toggle active classes on unit buttons
    document.querySelectorAll('.unit-btn').forEach(b => {
        b.classList.toggle('active', b.textContent.toLowerCase().includes(unit));
    });
    
    // Change all "kg" or "lb" text labels across the app
    document.querySelectorAll('.unit-text').forEach(t => t.textContent = unit === 'metric' ? 'kg' : 'lb');
    
    // If a workout is running, convert all the weights they've entered so far
    if (state.activeWorkout) {
        state.activeWorkout.exercises.forEach(ex => {
            ex.sets.forEach(s => {
                if (s.weight) s.weight = conv(s.weight, unit);
            });
        });
        renderWorkout();
    }
    
    // Re-render components that rely on weights
    renderPRs();
    renderHistory();
    updateBodyweightDisplay();
    saveState();
};

// ── NEW FEATURES ──
window.addWater = () => {
    if(state.water >= 8) {
        toast("Goal reached! Great hydration today 💧", "success");
        return;
    }
    state.water += 1;
    saveState();
    updateWaterUI();
};

function updateWaterUI() {
    const level = $('water-level');
    const text = $('water-text');
    if(level && text) {
        const pct = Math.min((state.water / 8) * 100, 100);
        level.style.height = `${pct}%`;
        text.textContent = `${state.water} / 8`;
    }
}

window.applyDietPlan = (plan) => {
    let targets = {};
    if (plan === 'bulk') targets = { cal: 3200, pro: 160, carb: 400, fat: 100 };
    if (plan === 'cut') targets = { cal: 2100, pro: 180, carb: 150, fat: 60 };
    if (plan === 'keto') targets = { cal: 2400, pro: 140, carb: 30, fat: 180 };
    if (plan === 'balanced') targets = { cal: 2600, pro: 150, carb: 280, fat: 80 };
    
    state.settings.targets = targets;
    saveState();
    
    // Update inputs
    if ($('target-cal')) $('target-cal').value = targets.cal;
    if ($('target-pro')) $('target-pro').value = targets.pro;
    if ($('target-carb')) $('target-carb').value = targets.carb;
    if ($('target-fat')) $('target-fat').value = targets.fat;
    
    updateNutrition();
    toast(`${plan.charAt(0).toUpperCase() + plan.slice(1)} macros applied! 🎯`, "success");
};

// ── NAVIGATION ──
function setupNav() {
    navLinks.forEach(l => {
        l.addEventListener('click', () => {
            const t = l.dataset.tab;
            if (!t) return;
            
            // Switch tabs
            navLinks.forEach(n => n.classList.remove('active'));
            l.classList.add('active');
            
            tabPanels.forEach(p => p.classList.remove('active'));
            const panel = $(t + '-tab') || $(t);
            if (panel) panel.classList.add('active');
            
            // Refresh logic
            if (t === 'dashboard' || t === 'stats') { updateCharts(); updateStatCards(); }
            if (t === 'history') renderFullHistory();
            if (t === 'nutrition') updateNutrition();
            
            saveState();
        });
    });
}

window.switchTab = (id) => {
    // Check if it's a direct panel ID or a nav-link data-tab
    const link = document.querySelector(`.nav-link[data-tab="${id}"]`);
    if (link) {
        link.click();
    } else {
        // Handle panels without direct nav links (like ai-coach)
        navLinks.forEach(n => n.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        const panel = $(id + '-tab') || $(id);
        if (panel) panel.classList.add('active');
        window.scrollTo(0, 0);
    }
};

function renderFullHistory() {
    const list = $('history-list-full');
    if (!list) return;
    
    if (state.history.length === 0) {
        list.innerHTML = `<div class="food-log-empty"><i class="fa-solid fa-clock-rotate-left"></i><p>No workouts recorded yet.</p></div>`;
        return;
    }
    
    list.innerHTML = state.history.map(w => `
        <div class="history-card anim-stagger">
            <div class="history-card-top">
                <span class="history-card-name">${w.name}</span>
                <span class="history-card-date">${w.date}</span>
            </div>
            <div class="history-card-meta">
                <span class="history-meta-item">Volume: <strong>${w.volume.toLocaleString()}</strong></span>
                <span class="history-meta-item">Sets: <strong>${w.sets}</strong></span>
                <span class="history-meta-item">Time: <strong>${Math.floor(w.duration / 60)}m</strong></span>
            </div>
            <div class="history-exercises">
                ${w.exercises.slice(0, 3).map(ex => `<span>${ex.name}</span>`).join('')}
                ${w.exercises.length > 3 ? `<span>+${w.exercises.length - 3} more</span>` : ''}
            </div>
        </div>
    `).join('');
}
// ── CHARTS ──
let progressChart, bwChart, historyVolumeChart;
function initCharts() {
    const pCtx = $('progressChart');
    if (pCtx) {
        progressChart = new Chart(pCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Intensity',
                    data: [65, 78, 72, 85, 90, 88, 95],
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108,92,231,0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }, {
                    label: 'Volume',
                    data: [40, 55, 48, 62, 70, 68, 75],
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } }, 
                scales: { 
                    y: { display: false }, 
                    x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } } 
                } 
            }
        });
    }
    
    const bCtx = $('bwChart');
    if (bCtx) {
        bwChart = new Chart(bCtx, {
            type: 'line',
            data: {
                labels: state.bodyweight.map(b => b.date.slice(5)),
                datasets: [{
                    data: state.bodyweight.map(b => b.weight),
                    borderColor: '#e17055',
                    pointBackgroundColor: '#e17055',
                    borderWidth: 2,
                    tension: 0.3
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { display: false } } }
        });
    }

    const hvCtx = $('historyVolumeChart');
    if (hvCtx) {
        historyVolumeChart = new Chart(hvCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Volume',
                    data: [],
                    backgroundColor: 'rgba(108,92,231,0.8)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
                    x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } }
                }
            }
        });
    }
    
    const waCtx = $('weeklyActivityChart');
    if (waCtx) {
        window.weeklyActivityChart = new Chart(waCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Activity',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(108,92,231,0.5)',
                    hoverBackgroundColor: 'var(--accent)',
                    borderRadius: 5,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } }
                }
            }
        });
    }
}

function updateCharts() {
    if (bwChart) {
        bwChart.data.labels = state.bodyweight.map(b => b.date.slice(5));
        bwChart.data.datasets[0].data = state.bodyweight.map(b => b.weight);
        bwChart.update();
    }
    if (historyVolumeChart && state.history.length > 0) {
        const chronHistory = [...state.history].reverse();
        historyVolumeChart.data.labels = chronHistory.map(w => w.date.slice(0, 5));
        historyVolumeChart.data.datasets[0].data = chronHistory.map(w => w.volume);
        historyVolumeChart.update();
    }
    
    updateActivityChart();
    updateMemberSystem();
}

function updateActivityChart() {
    if (!window.weeklyActivityChart) return;
    
    // Simple logic: count intensity (volume/1000) per day of week for current week
    const activity = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)));
    startOfWeek.setHours(0,0,0,0);

    state.history.forEach(w => {
        const wDate = new Date(w.date);
        if (wDate >= startOfWeek) {
            let day = wDate.getDay(); // 0=Sun, 1=Mon...
            let chartIdx = day === 0 ? 6 : day - 1; // Map to Mon-Sun (0-6)
            activity[chartIdx] += (w.volume / 1000) || 5; // Use 5 as base points per session
        }
    });

    window.weeklyActivityChart.data.datasets[0].data = activity;
    window.weeklyActivityChart.update();
}

function updateMemberSystem() {
    const workouts = state.history.length;
    state.workoutsCompleted = workouts;
    
    let tier = 'Rookie';
    let sub = 'Free Member';
    let pct = (workouts / 10) * 100;
    
    if (workouts >= 5) { tier = 'Pro'; sub = 'Pro Athlete'; pct = ((workouts - 5) / 10) * 100; }
    if (workouts >= 15) { tier = 'Elite'; sub = 'Elite Master'; pct = 100; }
    
    state.memberTier = tier;
    
    if ($('member-tier')) {
        $('member-tier').textContent = tier;
        $('member-tier').className = 'member-badge ' + tier.toLowerCase();
    }
    if ($('member-sub')) $('member-sub').textContent = sub;
    if ($('member-progress')) $('member-progress').style.width = Math.min(100, pct) + '%';
    
    if ($('tier-glow')) {
        if (tier === 'Elite') $('tier-glow').classList.add('active');
        else $('tier-glow').classList.remove('active');
    }
}

// ── DASHBOARD LOGIC ──
function updateStatCards() {
    const workouts = state.history.length;
    let totalVol = 0, totalReps = 0;
    state.history.forEach(w => {
        totalVol += w.volume;
        totalReps += w.reps;
    });
    
    const vDisplay = state.settings.unit === 'metric' ? (totalVol / 1000).toFixed(1) + 't' : (totalVol).toLocaleString() + 'lb';
    
    if ($('stat-workouts')) $('stat-workouts').textContent = workouts;
    if ($('stat-volume')) $('stat-volume').textContent = vDisplay;
    if ($('stat-reps')) $('stat-reps').textContent = totalReps;
    if ($('stat-time')) $('stat-time').textContent = state.activeWorkout ? 'Active' : 'Start';
}

function renderPRs() {
    const prList = $('pr-list');
    if (!prList) return;
    
    const prs = {};
    state.history.forEach(w => {
        w.exercises.forEach(ex => {
            ex.sets.forEach(s => {
                const weight = parseFloat(s.weight) || 0;
                if (!prs[ex.id] || weight > prs[ex.id].weight) {
                    prs[ex.id] = { weight, name: ex.name };
                }
            });
        });
    });

    const prArray = Object.values(prs).sort((a, b) => b.weight - a.weight).slice(0, 4);
    
    if (prArray.length === 0) {
        prList.innerHTML = `<div style="color:var(--text-dim); font-size:12px; padding:10px 0;">No records set yet.</div>`;
        return;
    }

    prList.innerHTML = prArray.map(pr => `
        <div class="pr-item">
            <span>${pr.name}</span>
            <strong>${pr.weight} ${state.settings.unit === 'metric' ? 'kg' : 'lb'} <i class="fa-solid fa-trophy" style="color:var(--yellow); font-size:12px; margin-left:4px;"></i></strong>
        </div>
    `).join('');
}

function renderHeatmap() {
    const heatmap = $('week-heatmap');
    if (!heatmap) return;
    
    let html = '';
    const days = 7 * 12; // 12 weeks
    for (let i = 0; i < days; i++) {
        // Randomly simulate past activity, or use real history dates in a full app
        const intensity = Math.random();
        let colorClass = 'lvl-0';
        if (intensity > 0.8) colorClass = 'lvl-3';
        else if (intensity > 0.5) colorClass = 'lvl-2';
        else if (intensity > 0.2) colorClass = 'lvl-1';
        
        // Ensure some guaranteed spots are filled based on mock history
        if (i > days - 10 && i % 3 === 0) colorClass = 'lvl-3'; 
        
        html += `<div class="heat-box ${colorClass}"></div>`;
    }
    heatmap.innerHTML = html;
}

window.exportData = () => {
    window.exportToCSV();
};

function updateClock() {
    const now = new Date();
    if ($('live-clock')) {
        $('live-clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
setInterval(updateClock, 1000);

window.updateORM = () => {
    const w = parseFloat($('orm-w').value) || 0;
    const r = parseFloat($('orm-r').value) || 0;
    const res = w * (1 + r / 30);
    $('orm-res').textContent = Math.round(res) + (state.settings.unit === 'metric' ? 'kg' : 'lb');
};

$('orm-w').oninput = updateORM;
$('orm-r').oninput = updateORM;

window.logBodyWeight = () => {
    const val = parseFloat($('bw-input').value);
    if (!val) return;
    const today = new Date().toISOString().split('T')[0];
    state.bodyweight.push({ date: today, weight: val });
    if (state.bodyweight.length > 10) state.bodyweight.shift();
    updateCharts();
    updateBodyweightDisplay();
    saveState();
    $('bw-input').value = '';
    toast('Weight logged!', 'success');
};

function updateBodyweightDisplay() {
    const last = state.bodyweight[state.bodyweight.length - 1];
    if (last && $('current-bw')) $('current-bw').textContent = last.weight;
}

// ── WORKOUT LOGIC ──
let workoutInterval = null;
let workoutSeconds = 0;

window.startEmptyWorkout = () => {
    state.activeWorkout = {
        name: 'Free Workout',
        startTime: Date.now(),
        exercises: [],
        seconds: 0
    };
    initWorkoutUI();
};

window.repeatLastWorkout = () => {
    if (state.history.length === 0) {
        toast('No history found');
        return;
    }
    const last = state.history[0];
    state.activeWorkout = {
        name: last.name,
        startTime: Date.now(),
        exercises: last.exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            sets: ex.sets.map(s => ({ weight: s.weight, reps: s.reps, done: false }))
        })),
        seconds: 0
    };
    initWorkoutUI();
    toast('Template loaded');
};

function initWorkoutUI() {
    $('active-workout-area').classList.remove('hidden');
    if ($('workout-quickstart')) $('workout-quickstart').style.display = 'none';
    if ($('recent-section')) $('recent-section').style.display = 'none';
    
    workoutSeconds = 0;
    if (workoutInterval) clearInterval(workoutInterval);
    workoutInterval = setInterval(() => {
        workoutSeconds++;
        $('workout-timer').textContent = formatTime(workoutSeconds);
    }, 1000);
    
    renderWorkout();
    toast('Workout started!', 'success');
}

window.addExerciseToWorkout = (id) => {
    const ex = exercisesList.find(e => e.id === id);
    if (!ex) return;
    if (!state.activeWorkout) startEmptyWorkout();
    
    // Get last performance for this exercise
    const prevData = getPreviousPerformance(ex.id);
    
    state.activeWorkout.exercises.push({
        id: ex.id,
        name: ex.name,
        sets: prevData ? prevData.sets.map(s => ({ weight: s.weight, reps: s.reps, done: false })) : [{ weight: '', reps: '', done: false }],
        prevMax: prevData ? prevData.maxWeight : 0
    });
    
    closeExerciseSelector();
    renderWorkout();
    toast(`${ex.name} added`);
};

function getPreviousPerformance(exId) {
    for (let w of state.history) {
        const found = w.exercises.find(e => e.id === exId);
        if (found) {
            const maxWeight = Math.max(...found.sets.map(s => parseFloat(s.weight) || 0));
            return { sets: found.sets, maxWeight };
        }
    }
    return null;
}

function renderWorkout() {
    const container = $('workout-exercises-container');
    if (!container) return;
    
    if (state.activeWorkout.exercises.length === 0) {
        container.innerHTML = `<div class="food-log-empty"><i class="fa-solid fa-dumbbell"></i><p>Add exercises to begin.</p></div>`;
        return;
    }
    
    container.innerHTML = state.activeWorkout.exercises.map((ex, exIdx) => {
        const prevPerformance = getPreviousPerformance(ex.id);
        const prevMax = prevPerformance ? prevPerformance.maxWeight : 0;

        return `
        <div class="workout-exercise-card anim-stagger">
            <div class="workout-ex-header">
                <div style="display:flex; align-items:center; gap:8px;">
                    <h3>${ex.name}</h3>
                    ${prevMax ? `<span class="prev-best-pill" title="Previous Best">PB: ${prevMax}${state.settings.unit === 'metric' ? 'kg' : 'lb'}</span>` : ''}
                </div>
                <div class="workout-ex-icons">
                    <i class="fa-solid fa-trash" onclick="removeExercise(${exIdx})"></i>
                </div>
            </div>
            <div class="set-table">
                ${ex.sets.map((s, sIdx) => {
                    const isImproved = prevMax && parseFloat(s.weight) > prevMax;
                    return `
                    <div class="set-row">
                        <div class="set-num">${sIdx + 1}</div>
                        <div class="set-input-wrap">
                            <input type="number" class="set-input ${isImproved ? 'glow-green' : ''}" placeholder="0" value="${s.weight}" oninput="updateSet(${exIdx}, ${sIdx}, 'weight', this.value)">
                            <span class="set-unit">${state.settings.unit === 'metric' ? 'kg' : 'lb'}</span>
                            ${isImproved ? '<i class="fa-solid fa-arrow-trend-up overload-up"></i>' : ''}
                        </div>
                        <div class="set-input-wrap">
                            <input type="number" class="set-input" placeholder="0" value="${s.reps}" oninput="updateSet(${exIdx}, ${sIdx}, 'reps', this.value)">
                            <span class="set-unit">reps</span>
                        </div>
                        <button class="set-check ${s.done ? 'completed' : ''}" onclick="toggleSet(${exIdx}, ${sIdx})">
                            <i class="fa-solid fa-check"></i>
                        </button>
                    </div>
                `}).join('')}
            </div>
            <button class="add-set-btn" onclick="addSet(${exIdx})">+ Add Set</button>
        </div>
    `}).join('');
}

window.updateSet = (exIdx, sIdx, field, val) => {
    state.activeWorkout.exercises[exIdx].sets[sIdx][field] = val;
};

window.addSet = (exIdx) => {
    state.activeWorkout.exercises[exIdx].sets.push({ weight: '', reps: '', done: false });
    renderWorkout();
};

window.toggleSet = (exIdx, sIdx) => {
    const s = state.activeWorkout.exercises[exIdx].sets[sIdx];
    s.done = !s.done;
    renderWorkout();
    if (s.done) startRestTimer();
};

window.removeExercise = (idx) => {
    state.activeWorkout.exercises.splice(idx, 1);
    renderWorkout();
};

window.finishWorkout = () => {
    if (!state.activeWorkout || state.activeWorkout.exercises.length === 0) {
        toast('Please add at least one exercise to finish!', 'info');
        return;
    }
    
    // Check if at least one set is completed
    const hasSets = state.activeWorkout.exercises.some(ex => ex.sets.some(s => s.done));
    if (!hasSets) {
        toast('Mark at least one set as complete!', 'info');
        return;
    }

    let volume = 0, reps = 0, setsCount = 0;
    state.activeWorkout.exercises.forEach(ex => {
        ex.sets.forEach(s => {
            if (s.done && s.weight && s.reps) {
                volume += parseFloat(s.weight) * parseInt(s.reps);
                reps += parseInt(s.reps);
                setsCount++;
            }
        });
    });
    
    const summary = {
        name: state.activeWorkout.name,
        date: new Date().toLocaleDateString(),
        volume: volume,
        reps: reps,
        sets: setsCount,
        duration: workoutSeconds,
        exercises: state.activeWorkout.exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            sets: ex.sets.filter(s => s.done)
        }))
    };
    
    state.history.unshift(summary);
    if (state.history.length > 20) state.history.pop();
    
    cancelWorkout(false);
    toast(`Workout Complete! Total Volume: ${volume}${state.settings.unit === 'metric' ? 'kg' : 'lb'}`, 'success');
    renderHistory();
    updateCharts();
    updateStatCards();
    saveState();
};

window.cancelWorkout = (confirm = true) => {
    if (confirm && !window.confirm('Are you sure you want to cancel? Progress will be lost.')) return;
    
    state.activeWorkout = null;
    if (workoutInterval) clearInterval(workoutInterval);
    
    // Defensive hiding
    if ($('active-workout-area')) $('active-workout-area').classList.add('hidden');
    if ($('workout-quickstart')) $('workout-quickstart').style.display = '';
    if ($('recent-section')) $('recent-section').style.display = '';
    
    saveState();
    toast('Workout cancelled');
};

// ── REST TIMER ──
let restInterval = null;
let restTime = 90;

function startRestTimer() {
    if (restInterval) clearInterval(restInterval);
    let time = 90;
    $('rest-timer-bar').classList.remove('hidden');
    $('rest-play-btn').classList.add('running');
    
    restInterval = setInterval(() => {
        time--;
        $('rest-time-display').textContent = formatTime(time);
        if (time <= 0) {
            clearInterval(restInterval);
            $('rest-play-btn').classList.remove('running');
            toast('Rest finished!', 'info');
            if (state.settings.sound) new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3').play().catch(()=>{});
            if (state.settings.notify && Notification.permission === 'granted') new Notification('Vault Pro', { body: 'Rest time over! Next set.' });
        }
    }, 1000);
}

window.adjustRest = (d) => {
    // Basic adjustment logic could go here
};

window.toggleRestTimer = () => {
    if (restInterval) {
        clearInterval(restInterval);
        restInterval = null;
        $('rest-play-btn').classList.remove('running');
    } else {
        startRestTimer();
    }
};

// ── HISTORY ──
function renderHistory() {
    const list = $('workout-history-list');
    if (!list) return;
    
    if (state.history.length === 0) {
        list.innerHTML = `<div class="food-log-empty"><i class="fa-solid fa-clock-rotate-left"></i><p>No workouts recorded yet.</p></div>`;
        return;
    }
    
    list.innerHTML = state.history.map(w => `
        <div class="history-card">
            <div class="history-card-top">
                <span class="history-card-name">${w.name}</span>
                <span class="history-card-date">${w.date}</span>
            </div>
            <div class="history-card-meta">
                <span class="history-meta-item">Volume: <strong>${w.volume.toLocaleString()}</strong></span>
                <span class="history-meta-item">Sets: <strong>${w.sets}</strong></span>
                <span class="history-meta-item">Time: <strong>${Math.floor(w.duration / 60)}m</strong></span>
            </div>
        </div>
    `).join('');
}

window.clearHistory = () => {
    if (!window.confirm('Delete all history?')) return;
    state.history = [];
    renderHistory();
    saveState();
};

// ── PROGRAMS ──
function renderPrograms() {
    const list = $('programs-list');
    if (!list) return;
    
    const activeFilterBtn = document.querySelector('#programs-filters .filter-pill.active');
    const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'All';
    
    const filtered = programsList.filter(p => {
        if (filter === 'All') return true;
        return p.level === filter || p.type === filter;
    });
    
    list.innerHTML = filtered.map(p => `
        <div class="program-card anim-stagger glow-border" onclick="openProgramDetail(${p.id})">
            <div class="program-color" style="background:${p.color || '#6c5ce7'}"></div>
            <div class="program-info">
                <div class="program-name">${p.name}</div>
                <div class="program-meta-text">${p.frequency || p.daysPerWeek + ' Days/Week'} • ${p.level || p.difficulty}</div>
            </div>
            <div class="program-badge ${p.type ? p.type.toLowerCase() : ''}">${p.type || p.category}</div>
            <i class="fa-solid fa-chevron-right program-card-arrow"></i>
        </div>
    `).join('');
}

window.openProgramDetail = (id) => {
    const p = programsList.find(x => x.id === id);
    if (!p) return;
    
    $('prog-title').textContent = p.name;
    $('prog-meta').textContent = `${p.level} • ${p.goal}`;
    
    const splitContainer = $('prog-split-container');
    splitContainer.innerHTML = Object.entries(p.split).map(([day, exIds]) => `
        <div class="prog-detail-day">
            <h4>${day}</h4>
            ${exIds.length > 0 ? exIds.map(eid => {
                const ex = exercisesList.find(e => e.id === eid);
                return `<div class="prog-detail-ex">${ex ? ex.name : 'Unknown Exercise'} <span>3 sets</span></div>`;
            }).join('') : '<div style="font-size:12px; color:var(--text-dim);">Rest Day</div>'}
        </div>
    `).join('');
    
    $('program-detail-modal').classList.add('open');
};

window.closeProgramDetail = () => $('program-detail-modal').classList.remove('open');

window.startProgramWorkout = (pid) => {
    const id = pid || 1; // Default to PPL
    const p = programsList.find(x => x.id === id);
    if (!p) return;
    
    // Pick current day
    const days = Object.keys(p.split);
    const dayIndex = new Date().getDay(); // 0 is Sunday
    const actualDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Map Mon-Sun to 0-6
    const todayLabel = days[actualDayIndex] || days[0];
    const exIds = p.split[todayLabel];

    if (!exIds || exIds.length === 0) {
        toast('Today is a rest day!');
        return;
    }

    state.activeWorkout = {
        name: todayLabel,
        startTime: Date.now(),
        exercises: exIds.map(eid => {
            const ex = exercisesList.find(e => e.id === eid);
            const prev = getPreviousPerformance(eid);
            return {
                id: eid,
                name: ex.name,
                sets: prev ? prev.sets.map(s => ({ weight: s.weight, reps: s.reps, done: false })) : [{ weight: '', reps: '', done: false }]
            };
        }),
        seconds: 0
    };

    initWorkoutUI();
    closeProgramDetail();
    navLinks.forEach(l => { if (l.dataset.tab === 'workout') l.click(); });
};

// ── EXERCISES ──
function renderExercises() {
    const list = $('exercise-list-container');
    if (!list) return;
    
    const activeFilterBtn = document.querySelector('#exercises-filters .filter-pill.active');
    const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : 'All';
    const searchInput = $('ex-search');
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filtered = exercisesList.filter(e => {
        const matchesFilter = filter === 'All' || e.category === filter;
        const matchesSearch = e.name.toLowerCase().includes(search);
        return matchesFilter && matchesSearch;
    });
    
    if (filtered.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--text-dim);">No exercises found matching "${search}".</div>`;
        return;
    }
    
    list.innerHTML = filtered.map(e => `
        <div class="exercise-row" onclick="openExDetail(${e.id})">
            <div class="exercise-info">
                <div class="exercise-name">${e.name}</div>
                <div class="exercise-equip">${e.equipment} • ${e.difficulty}</div>
            </div>
            <span class="exercise-cat-tag">${e.category}</span>
        </div>
    `).join('');
}

window.openExDetail = (id) => {
    const ex = exercisesList.find(e => e.id === id);
    if (!ex) return;
    
    $('exd-title').textContent = ex.name;
    $('exd-cat').textContent = ex.category;
    $('exd-equip').textContent = ex.equipment;
    $('exd-muscles').innerHTML = ex.highlightMuscles.map(m => `<span class="muscle-tag">${m.replace('_', ' ')}</span>`).join('');
    $('exd-instructions').innerHTML = ex.instructions.map(i => `<li>${i}</li>`).join('');
    
    $('exercise-detail-modal').classList.add('open');
};

window.closeExDetail = () => $('exercise-detail-modal').classList.remove('open');

window.addFromDetail = () => {
    const exName = $('exd-title').textContent;
    const ex = exercisesList.find(e => e.name === exName);
    if (ex) {
        addExerciseToWorkout(ex.id);
        toast(`${ex.name} added to workout!`, 'success');
        closeExDetail();
    }
};

// ── NUTRITION ──
function updateNutrition() {
    let cal = 0, pro = 0, carb = 0, fat = 0;
    state.dailyFood.forEach(f => {
        cal += f.calories; pro += f.protein; carb += f.carbs; fat += f.fats;
    });
    
    const targets = state.settings.targets;
    
    if ($('cal-consumed')) $('cal-consumed').textContent = Math.round(cal);
    if ($('protein-val')) $('protein-val').textContent = Math.round(pro) + 'g';
    if ($('carbs-val')) $('carbs-val').textContent = Math.round(carb) + 'g';
    if ($('fats-val')) $('fats-val').textContent = Math.round(fat) + 'g';
    
    const calPct = Math.min((cal / targets.cal) * 100, 100);
    const ring = $('cal-ring-progress');
    if (ring) ring.setAttribute('stroke-dasharray', `${calPct * 2.64} ${264 - calPct * 2.64}`);
    
    if ($('protein-bar')) $('protein-bar').style.width = Math.min((pro / targets.pro) * 100, 100) + '%';
    if ($('carbs-bar')) $('carbs-bar').style.width = Math.min((carb / targets.carb) * 100, 100) + '%';
    if ($('fats-bar')) $('fats-bar').style.width = Math.min((fat / targets.fat) * 100, 100) + '%';
    
    updateWaterUI();
}

window.saveMacroTargets = () => {
    state.settings.targets = {
        cal: parseInt($('target-cal').value),
        pro: parseInt($('target-pro').value),
        carb: parseInt($('target-carb').value),
        fat: parseInt($('target-fat').value)
    };
    updateNutrition();
    saveState();
};

function renderFoodLog() {
    const log = $('food-log');
    if (!log) return;
    
    if (state.dailyFood.length === 0) {
        log.innerHTML = `<div class="food-log-empty"><i class="fa-solid fa-utensils"></i><p>No food logged yet today.</p></div>`;
        return;
    }
    
    log.innerHTML = state.dailyFood.map((f, i) => `
        <div class="food-log-item anim-stagger">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:600;">${f.name}</div>
                <div style="font-size:12px; font-weight:700; color:var(--accent);">${f.calories} kcal</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                <div style="font-size:11px; color:var(--text-dim);">${f.serving} • P:${f.protein}g C:${f.carbs}g F:${f.fats}g</div>
                <i class="fa-solid fa-trash" style="font-size:10px; color:var(--muted); cursor:pointer;" onclick="removeFood(${i})"></i>
            </div>
        </div>
    `).join('');
}

window.removeFood = (idx) => {
    state.dailyFood.splice(idx, 1);
    updateNutrition();
    renderFoodLog();
    saveState();
};

// ── MODALS ──
window.openExerciseSelector = () => {
    $('exercise-selector-modal').classList.add('open');
    renderModalExercises();
};
window.closeExerciseSelector = () => $('exercise-selector-modal').classList.remove('open');

function renderModalExercises() {
    const list = $('modal-exercises-list');
    if (!list) return;
    
    const searchInput = $('modal-ex-search');
    const search = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filtered = exercisesList.filter(e => e.name.toLowerCase().includes(search));
    
    if (filtered.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-dim);">No exercises found.</div>`;
        return;
    }
    
    list.innerHTML = filtered.map(e => `
        <div class="modal-ex-row" onclick="addExerciseToWorkout(${e.id})">
            <div class="modal-ex-info">
                <div class="modal-ex-icon"><i class="fa-solid fa-dumbbell"></i></div>
                <div><div class="modal-ex-name">${e.name}</div><div class="modal-ex-cat">${e.category}</div></div>
            </div>
            <button class="modal-ex-add"><i class="fa-solid fa-plus"></i></button>
        </div>
    `).join('');
}

window.openFoodSelector = () => {
    $('food-selector-modal').classList.add('open');
    renderModalFood();
};
window.closeFoodSelector = () => $('food-selector-modal').classList.remove('open');

function renderModalFood() {
    const list = $('modal-food-list');
    const search = ($('modal-food-search')?.value || '').toLowerCase();
    
    // assuming foodDatabase exists in data.js
    const filtered = (typeof foodDatabase !== 'undefined' ? foodDatabase : []).filter(f => f.name.toLowerCase().includes(search));
    
    list.innerHTML = filtered.map(f => `
        <div class="modal-ex-row" onclick="addFood(${f.id})">
            <div class="modal-ex-info">
                <div class="modal-ex-icon" style="background:rgba(253, 203, 110, 0.1); color:var(--yellow);"><i class="fa-solid fa-utensils"></i></div>
                <div>
                    <div class="modal-ex-name">${f.name}</div>
                    <div class="modal-ex-cat">${f.serving} • ${f.calories} kcal</div>
                </div>
            </div>
            <button class="modal-ex-add" style="background:var(--yellow);"><i class="fa-solid fa-plus"></i></button>
        </div>
    `).join('');
}

window.addFood = (id) => {
    const food = foodDatabase.find(f => f.id === id);
    if (!food) return;
    
    state.dailyFood.unshift({ ...food }); // Add to top
    toast(`${food.name} logged!`, 'success');
    closeFoodSelector();
    updateNutrition();
    renderFoodLog();
    saveState();
};

if ($('modal-food-search')) {
    $('modal-food-search').addEventListener('input', renderModalFood);
}

// ── SETTINGS ──
window.requestNotifyPermission = () => {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    state.settings.notify = $('setting-notify').checked;
    saveState();
};

window.exportToCSV = () => {
    let csv = 'Type,Name,Date,Volume,Reps,Duration\n';
    state.history.forEach(w => {
        csv += `Workout,${w.name},${w.date},${w.volume},${w.reps},${w.duration}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vault_pro_data.csv';
    a.click();
    toast('Data exported!', 'success');
};

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('DOMContentLoaded', init);

// Background logic extracted to 3d-background.js for easier learning!

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        navLinks.forEach(l => { if (l.dataset.tab === 'workout') l.click(); });
        startEmptyWorkout();
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    }
});

// ── INTERACTIVE EFFECTS (God-Tier) ──
function initInteractions() {
    // Magnetic Buttons (Icons/Buttons only)
    document.querySelectorAll('.btn-ripple, .btn-chip, .quickstart-card').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // 3D Tilt Parallax for Cards
    document.querySelectorAll('.card, .stat-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const posX = (e.clientX - centerX) / (rect.width / 2);
            const posY = (e.clientY - centerY) / (rect.height / 2);
            
            const tiltX = posY * -10; // tilt up/down
            const tiltY = posX * 10;  // tilt left/right

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Text Scramble
    const scramble = (el) => {
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        const target = el.dataset.value || el.innerText;
        let iteration = 0;
        let interval = setInterval(() => {
            el.innerText = target.split('').map((char, index) => {
                if (index < iteration) return target[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            if (iteration >= target.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    };
    
    document.querySelectorAll('.scramble').forEach(el => scramble(el));
}

// ── INITIALIZATION ──
function init() {
    loadState();
    setupNav();
    initCharts();
    renderPrograms();
    renderExercises();
    renderHistory();
    updateBodyweightDisplay();
    updateNutrition();
    renderFoodLog();
    updateStatCards();
    renderPRs();
    renderHeatmap();
    initInteractions();
    updateWaterUI();
    updateCharts();
    
    // Listeners
    if ($('ex-search')) $('ex-search').addEventListener('input', renderExercises);
    if ($('modal-ex-search')) $('modal-ex-search').addEventListener('input', renderModalExercises);
    
    document.querySelectorAll('#exercises-filters .filter-pill').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('#exercises-filters .filter-pill').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            renderExercises();
        });
    });

    document.querySelectorAll('#programs-filters .filter-pill').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('#programs-filters .filter-pill').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            renderPrograms();
        });
    });
}

init();

