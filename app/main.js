// NusaStat main — hash router, search, sortable tables, CSV download,
// GDP year-range filter, inflation calculator, province comparison, dark mode.
// No network: every control reads the data already shipped in data.js.

import { ROUTES } from './views.js';
import { GDP_GROWTH, INFLATION, PROVINCES, INDICATOR_INDEX } from './data.js';
import { lineChart } from './charts.js';

const app = document.getElementById('app');
const searchInput = document.getElementById('search');
const searchBox = document.getElementById('search-results');
const themeBtn = document.getElementById('theme-toggle');

// --- Dark mode (persisted locally; default light) ---
function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  themeBtn.textContent = dark ? '☀ Terang' : '◐ Gelap';
  try { localStorage.setItem('nusastat-theme', dark ? 'dark' : 'light'); } catch (e) { /* storage unavailable */ }
}
let savedTheme = 'light';
try { savedTheme = localStorage.getItem('nusastat-theme') || 'light'; } catch (e) { /* ignore */ }
applyTheme(savedTheme === 'dark');
themeBtn.addEventListener('click', () => applyTheme(!document.documentElement.classList.contains('dark')));

// --- Search: live filter over the indicator index ---
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 2) { searchBox.hidden = true; searchBox.innerHTML = ''; return; }
  const hits = INDICATOR_INDEX.filter(d => d.q.includes(q) || d.label.toLowerCase().includes(q)).slice(0, 6);
  searchBox.hidden = false;
  searchBox.innerHTML = hits.length
    ? '<ul class="search-list">' + hits.map(d => '<li><a href="' + d.href + '">' + d.label + '</a></li>').join('') + '</ul>'
    : '<ul class="search-list"><li class="none">Tidak ada indikator yang cocok dengan “' + q.replace(/</g, '&lt;') + '”. Coba “inflasi”, “pdb”, atau “provinsi”.</li></ul>';
});
searchBox.addEventListener('click', e => { if (e.target.closest('a')) { searchBox.hidden = true; searchInput.value = ''; } });
document.addEventListener('click', e => {
  if (!e.target.closest('#search-results') && e.target !== searchInput) searchBox.hidden = true;
});

// --- Sortable tables: click a header to sort that column ---
function sortTable(table, key, type, dir) {
  const body = table.querySelector('tbody');
  const rows = Array.from(body.querySelectorAll('tr'));
  rows.sort((a, b) => {
    const ia = Array.from(table.querySelectorAll('thead th')).findIndex(th => th.dataset.key === key);
    const va = a.children[ia].textContent.trim();
    const vb = b.children[ia].textContent.trim();
    let cmp;
    if (type === 'num') cmp = parseFloat(va.replace(/[^0-9.,-]/g, '').replace(',', '.')) - parseFloat(vb.replace(/[^0-9.,-]/g, '').replace(',', '.'));
    else cmp = va.localeCompare(vb, 'id');
    return dir * cmp;
  });
  rows.forEach(r => body.appendChild(r));
  table.querySelectorAll('thead th').forEach(th => {
    th.querySelector('.arrow').textContent = th.dataset.key === key ? (dir === 1 ? '▲' : '▼') : '↕';
  });
}

function wireTables() {
  app.querySelectorAll('table.data').forEach(table => {
    table.querySelectorAll('th.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const cur = th.querySelector('.arrow').textContent;
        sortTable(table, th.dataset.key, th.dataset.type || 'num', cur === '▲' ? -1 : 1);
      });
    });
  });
}

// --- CSV download: the table as a real file, via a Blob ---
function tableToCsv(table) {
  const lines = [];
  table.querySelectorAll('tr').forEach(tr => {
    const cells = Array.from(tr.querySelectorAll('th, td')).map(c => '"' + c.textContent.trim().replace(/"/g, '""') + '"');
    lines.push(cells.join(','));
  });
  return lines.join('\n');
}

function wireCsv() {
  app.querySelectorAll('[data-csv]').forEach(btn => {
    btn.addEventListener('click', () => {
      const table = document.getElementById(btn.dataset.csv);
      if (!table) return;
      const blob = new Blob([tableToCsv(table)], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = btn.dataset.filename || 'data.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  });
}

// --- Home: GDP chart year-range filter ---
function wireGdpRange() {
  const from = document.getElementById('gdp-from');
  const to = document.getElementById('gdp-to');
  const box = document.getElementById('gdp-chart');
  if (!from || !to || !box) return;
  const redraw = () => {
    let a = parseInt(from.value, 10), b = parseInt(to.value, 10);
    if (a > b) { const t = a; a = b; b = t; }
    const slice = GDP_GROWTH.filter(d => d.year >= a && d.year <= b);
    box.innerHTML = lineChart(slice, { label: 'Pertumbuhan PDB riil ' + a + ' sampai ' + b, unit: '%' });
  };
  from.addEventListener('change', redraw);
  to.addEventListener('change', redraw);
}

// --- Harga page: inflation calculator (cumulative CPI, WDI 2021–2025) ---
function wireCalculator() {
  const amount = document.getElementById('calc-amount');
  const year = document.getElementById('calc-year');
  const go = document.getElementById('calc-go');
  const out = document.getElementById('calc-result');
  if (!amount || !year || !go || !out) return;
  const calc = () => {
    const base = parseFloat(amount.value) || 0;
    const y0 = parseInt(year.value, 10);
    let factor = 1;
    INFLATION.forEach(d => { if (d.year > y0) factor *= 1 + d.v / 100; });
    const fmt = n => 'Rp ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    out.textContent = fmt(base) + ' tahun ' + y0 + ' ≈ ' + fmt(base * factor) + ' hari ini';
  };
  go.addEventListener('click', calc);
  amount.addEventListener('change', calc);
  year.addEventListener('change', calc);
  calc();
}

// --- Provinsi page: compare two provinces side by side ---
function wireCompare() {
  const aSel = document.getElementById('cmp-a');
  const bSel = document.getElementById('cmp-b');
  const out = document.getElementById('cmp-out');
  if (!aSel || !bSel || !out) return;
  const render = () => {
    const a = PROVINCES[parseInt(aSel.value, 10)];
    const b = PROVINCES[parseInt(bSel.value, 10)];
    if (!a || !b) return;
    const richer = a.gdpPc >= b.gdpPc ? a : b;
    const poorer = a.poverty >= b.poverty ? a : b;
    const row = (label, va, vb, unit) =>
      '<tr><td>' + label + '</td><td class="num">' + va + unit + '</td><td class="num">' + vb + unit + '</td></tr>';
    out.innerHTML = '<div class="table-wrap"><table class="data"><thead><tr><th></th><th>' + a.name + '</th><th>' + b.name + '</th></tr></thead><tbody>' +
      row('Penduduk', a.pop, b.pop, ' jt') +
      row('Kemiskinan', a.poverty.toFixed(2), b.poverty.toFixed(2), '%') +
      row('Pengangguran', a.unemp.toFixed(2), b.unemp.toFixed(2), '%') +
      row('PDRB/kapita', a.gdpPc.toFixed(0), b.gdpPc.toFixed(0), ' Rp jt') +
      '</tbody></table></div>' +
      '<p class="small" style="margin-top:8px"><strong>' + richer.name + '</strong> lebih kaya per kapita; ' +
      '<strong>' + poorer.name + '</strong> kemiskinannya lebih tinggi. Sumber: BPS 2024.</p>';
  };
  aSel.addEventListener('change', render);
  bSel.addEventListener('change', render);
  render();
}

// --- Router ---
function route() {
  const hash = location.hash.replace(/^#\/?/, '').split('?')[0];
  const render = ROUTES[hash] || ROUTES[''];
  app.innerHTML = render();
  document.querySelectorAll('.mainnav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#/' + hash);
  });
  wireTables();
  wireCsv();
  wireGdpRange();
  wireCalculator();
  wireCompare();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
