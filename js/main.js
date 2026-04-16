// ─── Navigation & Page Routing ───
const navLinks = document.querySelectorAll('.nav-links a');
const pageSections = document.querySelectorAll('.page-section');

function showPage(pageId) {
  pageSections.forEach(s => s.classList.remove('active'));
  navLinks.forEach(a => a.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  navLinks.forEach(a => {
    if (a.dataset.page === pageId) a.classList.add('active');
  });
  // Close mobile menu
  document.querySelector('.nav-links').classList.remove('open');
  // Start animations
  animateOnShow(pageId);
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinksEl = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
  });
}

// ─── Live Dashboard Simulation ───
const doorStates = ['CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'OPEN', 'LOOSE'];
const lockStates = ['LOCKED', 'LOCKED', 'LOCKED', 'UNLOCKED', 'UNLOCKED'];
const vibLevels = ['NORMAL', 'NORMAL', 'NORMAL', 'ELEVATED', 'HIGH'];
let alertHistory = [];
let simInterval = null;
let tickCount = 0;
let currentVibHz = 12;
let currentDoorState = 'CLOSED';
let currentLockState = 'LOCKED';

const alertTemplates = {
  normal: [
    { icon: '✅', title: 'Door Secure', cls: 'normal' },
    { icon: 'ℹ️', title: 'System Check Passed', cls: 'normal' },
    { icon: '🔒', title: 'Lock Status: Verified', cls: 'normal' },
  ],
  warning: [
    { icon: '⚠️', title: 'Vibration Level Elevated', cls: 'warning' },
    { icon: '⚠️', title: 'Door Latch May Be Loose', cls: 'warning' },
    { icon: '⚡', title: 'Sensor Noise Detected', cls: 'warning' },
  ],
  critical: [
    { icon: '🚨', title: 'Door Open While Moving!', cls: 'critical' },
    { icon: '🚨', title: 'Critical: Lock Disengaged', cls: 'critical' },
    { icon: '🚨', title: 'Abnormal Vibration Detected', cls: 'critical' },
  ]
};

function formatTime(d) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateClock() {
  const el = document.getElementById('live-clock');
  if (el) el.textContent = formatTime(new Date());
  const el2 = document.getElementById('last-update');
  if (el2) el2.textContent = formatTime(new Date());
}

function addAlert(level) {
  const templates = alertTemplates[level];
  const t = templates[Math.floor(Math.random() * templates.length)];
  alertHistory.unshift({ ...t, time: formatTime(new Date()) });
  if (alertHistory.length > 15) alertHistory.pop();
  renderAlerts();
}

function renderAlerts() {
  const list = document.getElementById('alert-list');
  if (!list) return;
  list.innerHTML = alertHistory.map(a => `
    <div class="alert-item ${a.cls}">
      <span class="alert-icon">${a.icon}</span>
      <div class="alert-text">
        <div class="alert-title">${a.title}</div>
        <div class="alert-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

function setDoorStatus(state) {
  currentDoorState = state;
  const el = document.getElementById('door-status-val');
  const card = document.getElementById('door-card');
  const icon = document.getElementById('door-icon');
  if (!el) return;
  el.textContent = state;
  if (card) card.className = 'status-card-big ' + (state === 'CLOSED' ? 'green' : state === 'LOOSE' ? 'yellow' : 'red');
  if (icon) icon.textContent = state === 'CLOSED' ? '🔒' : state === 'LOOSE' ? '⚠️' : '🔓';
}

function setLockStatus(state) {
  currentLockState = state;
  const el = document.getElementById('lock-status-val');
  const card = document.getElementById('lock-card');
  if (!el) return;
  el.textContent = state;
  if (card) card.className = 'status-card-big ' + (state === 'LOCKED' ? 'green' : 'red');
}

function setVibLevel(level, hz) {
  const el = document.getElementById('vib-level-val');
  const hzEl = document.getElementById('vib-hz');
  const bar = document.getElementById('vib-bar');
  const card = document.getElementById('vib-card');
  if (!el) return;
  el.textContent = level;
  if (hzEl) hzEl.textContent = hz + ' Hz';
  let pct = level === 'NORMAL' ? 20 : level === 'ELEVATED' ? 55 : 90;
  let cls = level === 'NORMAL' ? 'fill-green' : level === 'ELEVATED' ? 'fill-orange' : 'fill-red';
  if (bar) { bar.style.width = pct + '%'; bar.className = 'progress-fill ' + cls; }
  if (card) card.className = 'status-card-big ' + (level === 'NORMAL' ? 'green' : level === 'ELEVATED' ? 'yellow' : 'red');
}

function simulateTick() {
  tickCount++;
  const now = new Date();
  updateClock();

  // Randomize vibration slightly
  currentVibHz = Math.max(8, Math.min(38, currentVibHz + (Math.random() - 0.48) * 3));
  const roundHz = Math.round(currentVibHz * 10) / 10;

  // Occasional events
  const roll = Math.random();
  if (roll < 0.03) {
    setDoorStatus('OPEN');
    setLockStatus('UNLOCKED');
    setVibLevel('HIGH', roundHz);
    addAlert('critical');
  } else if (roll < 0.1) {
    setDoorStatus('LOOSE');
    setLockStatus('LOCKED');
    setVibLevel('ELEVATED', roundHz);
    addAlert('warning');
  } else {
    setDoorStatus('CLOSED');
    setLockStatus('LOCKED');
    let lvl = roundHz > 25 ? 'HIGH' : roundHz > 18 ? 'ELEVATED' : 'NORMAL';
    setVibLevel(lvl, roundHz);
    if (tickCount % 8 === 0) addAlert('normal');
    if (lvl !== 'NORMAL' && tickCount % 5 === 0) addAlert('warning');
  }

  // Update conn counter
  const pingEl = document.getElementById('wifi-ping');
  if (pingEl) pingEl.textContent = Math.round(10 + Math.random() * 30) + ' ms';
}

function startSimulation() {
  // Seed initial alerts
  addAlert('normal');
  addAlert('normal');
  addAlert('warning');
  updateClock();
  setDoorStatus('CLOSED');
  setLockStatus('LOCKED');
  setVibLevel('NORMAL', 12);
  if (simInterval) clearInterval(simInterval);
  simInterval = setInterval(simulateTick, 2500);
}

// ─── Animate page content on show ───
function animateOnShow(pageId) {
  if (pageId === 'page-dashboard') {
    setTimeout(startSimulation, 100);
  }
  // Trigger progress bars
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-width]').forEach(b => {
      b.style.width = b.dataset.width;
    });
  }, 200);
}

// ─── Vibration Chart (Canvas) ───
let chartCanvas, chartCtx, chartData = [];
const CHART_POINTS = 60;

function initVibChart() {
  chartCanvas = document.getElementById('vib-chart');
  if (!chartCanvas) return;
  chartCtx = chartCanvas.getContext('2d');
  for (let i = 0; i < CHART_POINTS; i++) chartData.push(12 + Math.random() * 3);
  drawChart();
  setInterval(() => {
    if (document.getElementById('page-dashboard').classList.contains('active')) {
      chartData.push(currentVibHz);
      if (chartData.length > CHART_POINTS) chartData.shift();
      drawChart();
    }
  }, 2500);
}

function drawChart() {
  if (!chartCtx) return;
  const w = chartCanvas.width, h = chartCanvas.height;
  chartCtx.clearRect(0, 0, w, h);

  // Grid lines
  chartCtx.strokeStyle = 'rgba(26,58,92,0.5)';
  chartCtx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = (h / 4) * i;
    chartCtx.beginPath();
    chartCtx.moveTo(0, y);
    chartCtx.lineTo(w, y);
    chartCtx.stroke();
  }

  // Gradient fill
  const grad = chartCtx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(0,229,255,0.3)');
  grad.addColorStop(1, 'rgba(0,229,255,0)');

  const min = 0, max = 45;
  const pts = chartData.map((v, i) => ({
    x: (i / (CHART_POINTS - 1)) * w,
    y: h - ((v - min) / (max - min)) * h
  }));

  // Fill
  chartCtx.beginPath();
  chartCtx.moveTo(pts[0].x, h);
  pts.forEach(p => chartCtx.lineTo(p.x, p.y));
  chartCtx.lineTo(pts[pts.length - 1].x, h);
  chartCtx.closePath();
  chartCtx.fillStyle = grad;
  chartCtx.fill();

  // Line
  chartCtx.beginPath();
  chartCtx.moveTo(pts[0].x, pts[0].y);
  pts.forEach(p => chartCtx.lineTo(p.x, p.y));
  chartCtx.strokeStyle = '#00e5ff';
  chartCtx.lineWidth = 2;
  chartCtx.shadowColor = '#00e5ff';
  chartCtx.shadowBlur = 8;
  chartCtx.stroke();
  chartCtx.shadowBlur = 0;

  // Danger threshold line
  const dangerY = h - ((25 - min) / (max - min)) * h;
  chartCtx.beginPath();
  chartCtx.setLineDash([6, 4]);
  chartCtx.moveTo(0, dangerY);
  chartCtx.lineTo(w, dangerY);
  chartCtx.strokeStyle = 'rgba(255,45,85,0.5)';
  chartCtx.lineWidth = 1;
  chartCtx.stroke();
  chartCtx.setLineDash([]);
}

// ─── Page Buttons ───
document.addEventListener('DOMContentLoaded', () => {
  // Hero CTA buttons
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.goto));
  });

  // Show home by default
  showPage('page-home');

  // Init chart
  initVibChart();

  // Clock tick
  setInterval(updateClock, 1000);
  updateClock();

  // Seed alerts for first render
  addAlert('normal');
  addAlert('normal');
});
