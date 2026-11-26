// NusaStat charts — hand-rolled SVG, zero libraries, zero network.
// Every chart labels its axes, units and source; numbers come from data.js.

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function niceTicks(min, max, count) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const size = nice * mag;
  const start = Math.ceil(min / size) * size;
  const out = [];
  for (let v = start; v <= max + 1e-9; v += size) out.push(Math.round(v * 100) / 100);
  return out;
}

// Line chart with labelled axes, dots and end labels.
export function lineChart(series, opts) {
  const o = Object.assign({ width: 640, height: 300, unit: '%', color: '#0f766e', label: '' }, opts || {});
  const padL = 52, padR = 14, padT = 14, padB = 34;
  const w = o.width - padL - padR, h = o.height - padT - padB;
  const vals = series.map(d => d.v);
  let min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
  if (min > 0) min = Math.min(0, min);
  if (max < 0) max = 0;
  const pad = (max - min) * 0.12 || 1;
  min -= pad; max += pad;
  const x = i => padL + (i / (series.length - 1)) * w;
  const y = v => padT + (1 - (v - min) / (max - min)) * h;
  const ticks = niceTicks(min, max, 4);
  let s = '<svg viewBox="0 0 ' + o.width + ' ' + o.height + '" role="img" aria-label="' + esc(o.label) + '">';
  ticks.forEach(t => {
    s += '<line x1="' + padL + '" y1="' + y(t) + '" x2="' + (padL + w) + '" y2="' + y(t) + '" stroke="#d8d0bd" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end" font-size="11" fill="#55635a">' + t + o.unit + '</text>';
  });
  s += '<line x1="' + padL + '" y1="' + (padT + h) + '" x2="' + (padL + w) + '" y2="' + (padT + h) + '" stroke="#55635a" stroke-width="1.2"/>';
  const pts = series.map((d, i) => x(i).toFixed(1) + ',' + y(d.v).toFixed(1)).join(' ');
  s += '<polyline points="' + pts + '" fill="none" stroke="' + o.color + '" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
  series.forEach((d, i) => {
    s += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(d.v).toFixed(1) + '" r="3.6" fill="' + o.color + '"/>';
    s += '<text x="' + x(i).toFixed(1) + '" y="' + (y(d.v) - 9).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#16241e">' + d.v + '</text>';
    s += '<text x="' + x(i).toFixed(1) + '" y="' + (padT + h + 20) + '" text-anchor="middle" font-size="11" fill="#55635a">' + d.year + '</text>';
  });
  return s + '</svg>';
}

// Vertical bar chart with value labels on top of each bar.
export function barChart(series, opts) {
  const o = Object.assign({ width: 640, height: 300, unit: '%', color: '#0f766e', negColor: '#a8341f', label: '' }, opts || {});
  const padL = 52, padR = 10, padT = 22, padB = 34;
  const w = o.width - padL - padR, h = o.height - padT - padB;
  const vals = series.map(d => d.v);
  let min = Math.min(0, Math.min.apply(null, vals)), max = Math.max.apply(null, vals);
  const pad = (max - min) * 0.1 || 1;
  min -= pad; max += pad;
  const bw = w / series.length;
  const y = v => padT + (1 - (v - min) / (max - min)) * h;
  const zero = y(0);
  let s = '<svg viewBox="0 0 ' + o.width + ' ' + o.height + '" role="img" aria-label="' + esc(o.label) + '">';
  niceTicks(min, max, 4).forEach(t => {
    s += '<line x1="' + padL + '" y1="' + y(t) + '" x2="' + (padL + w) + '" y2="' + y(t) + '" stroke="#d8d0bd" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end" font-size="11" fill="#55635a">' + t + o.unit + '</text>';
  });
  s += '<line x1="' + padL + '" y1="' + zero + '" x2="' + (padL + w) + '" y2="' + zero + '" stroke="#55635a" stroke-width="1.2"/>';
  series.forEach((d, i) => {
    const bx = padL + i * bw + bw * 0.18, bwid = bw * 0.64;
    const top = Math.min(y(d.v), zero), bh = Math.abs(y(d.v) - zero);
    const col = d.v < 0 ? o.negColor : o.color;
    s += '<rect x="' + bx.toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bwid.toFixed(1) + '" height="' + Math.max(bh, 2).toFixed(1) + '" rx="3" fill="' + col + '"/>';
    s += '<text x="' + (bx + bwid / 2).toFixed(1) + '" y="' + (top - 6).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#16241e">' + d.v + '</text>';
    s += '<text x="' + (bx + bwid / 2).toFixed(1) + '" y="' + (padT + h + 20) + '" text-anchor="middle" font-size="11" fill="#55635a">' + d.year + '</text>';
  });
  return s + '</svg>';
}

// Donut chart with a side legend carrying exact shares.
export function donutChart(items, opts) {
  const o = Object.assign({ size: 260, label: '' }, opts || {});
  const colors = ['#0c4a42', '#0f766e', '#c77f0a', '#7a9e7e', '#b3402a'];
  const total = items.reduce((a, d) => a + d.v, 0);
  const cx = o.size / 2, cy = o.size / 2, r = o.size / 2 - 14, inner = r * 0.62;
  let s = '<svg viewBox="0 0 ' + o.size + ' ' + o.size + '" role="img" aria-label="' + esc(o.label) + '">';
  let angle = -Math.PI / 2;
  items.forEach((d, i) => {
    const frac = d.v / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    s += '<path d="M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
      ' L' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) + ' A' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ' ' + yi0.toFixed(1) + ' Z" fill="' + colors[i % colors.length] + '"/>';
  });
  s += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#16241e">100%</text>';
  s += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11" fill="#55635a">dari PDB</text></svg>';
  return s;
}

// Horizontal bars for ranked categories (provinces).
export function hbarChart(rows, opts) {
  const o = Object.assign({ width: 640, rowH: 30, unit: '', color: '#0f766e', label: '' }, opts || {});
  const max = Math.max.apply(null, rows.map(r => r.v));
  const height = rows.length * o.rowH + 12;
  const labelW = 150, valW = 64;
  let s = '<svg viewBox="0 0 ' + o.width + ' ' + height + '" role="img" aria-label="' + esc(o.label) + '">';
  rows.forEach((r, i) => {
    const y = 8 + i * o.rowH;
    const bw = (o.width - labelW - valW - 16) * (r.v / max);
    s += '<text x="0" y="' + (y + 15) + '" font-size="12.5" fill="#16241e">' + esc(r.name) + '</text>';
    s += '<rect x="' + labelW + '" y="' + y + '" width="' + Math.max(bw, 2).toFixed(1) + '" height="18" rx="3" fill="' + o.color + '"/>';
    s += '<text x="' + (labelW + bw + 8).toFixed(1) + '" y="' + (y + 15) + '" font-size="12.5" font-weight="700" fill="#16241e">' + r.v + o.unit + '</text>';
  });
  return s + '</svg>';
}

// Tiny sparkline for KPI cards.
export function sparkline(values, opts) {
  const o = Object.assign({ width: 220, height: 36, color: '#0f766e' }, opts || {});
  const min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  const span = (max - min) || 1;
  const x = i => (i / (values.length - 1)) * o.width;
  const y = v => 3 + (1 - (v - min) / span) * (o.height - 8);
  const pts = values.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
  return '<svg class="spark" viewBox="0 0 ' + o.width + ' ' + o.height + '" width="' + o.width + '" height="' + o.height + '" aria-hidden="true">' +
    '<polyline points="' + pts + '" fill="none" stroke="' + o.color + '" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle cx="' + x(values.length - 1).toFixed(1) + '" cy="' + y(values[values.length - 1]).toFixed(1) + '" r="3" fill="' + o.color + '"/></svg>';
}
