// NusaStat views — one function per page, all rendered from data.js.
// Every number on a page is followed by its source and year.

import {
  META, GDP_GROWTH, INFLATION, POPULATION, UNEMPLOYMENT, POVERTY, LIFE, LFPR,
  DEBT, SECTORS, EXPORTS, KEY_INDICATORS, RELEASES, PROVINCES, EDU_HEALTH,
} from './data.js';
import { lineChart, barChart, donutChart, hbarChart, sparkline } from './charts.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function srcLine(text) {
  return '<p class="source-note">Sumber: ' + esc(text) + '</p>';
}

function head(crumb, title, lede) {
  return '<div class="topic-head"><p class="crumb"><a href="#/">Beranda</a> › ' + esc(crumb) + '</p>' +
    '<h1>' + esc(title) + '</h1><p class="lede">' + esc(lede) + '</p></div>';
}

function chartBox(title, sub, svg, source) {
  return '<div class="chart-box"><p class="chart-title">' + esc(title) + '</p>' +
    '<p class="chart-sub">' + esc(sub) + '</p>' + svg + srcLine(source) + '</div>';
}

// Sortable table: headers carry data-key; main.js does the sorting.
function dataTable(id, columns, rows) {
  let h = '<div class="table-wrap"><table class="data" id="' + id + '"><thead><tr>';
  columns.forEach(c => {
    h += '<th class="sortable" data-key="' + c.key + '" data-type="' + (c.type || 'num') + '">' + esc(c.label) + ' <span class="arrow">↕</span></th>';
  });
  h += '</tr></thead><tbody>';
  rows.forEach(r => {
    h += '<tr>';
    columns.forEach(c => { h += '<td class="num">' + esc(r[c.key]) + '</td>'; });
    h += '</tr>';
  });
  return h + '</tbody></table></div>';
}

function csvButton(tableId, filename) {
  return '<button class="btn ghost" type="button" data-csv="' + tableId + '" data-filename="' + filename + '">Unduh CSV</button>';
}

function kpiCard(k) {
  return '<a class="kpi" href="' + k.href + '">' +
    '<span class="kpi-label">' + esc(k.label) + '</span>' +
    '<span class="kpi-value">' + esc(k.value) + '</span>' +
    '<span class="kpi-meta">' + esc(k.period) + ' · <span class="kpi-change ' + k.dir + '">' + esc(k.change) + '</span></span>' +
    sparkline(k.spark) +
    '<span class="kpi-source">Sumber: ' + esc(k.source) + '</span></a>';
}

export function renderHome() {
  const gdpYears = GDP_GROWTH.map(d => d.year);
  let h = '<section class="hero"><p class="kicker">Indonesia · ' + META.coverage + ' · 24 indikator · 10 provinsi</p>' +
    '<h1>Indonesia dalam angka: <span class="headline-num">285,7 juta penduduk</span>, PDB tumbuh <span class="headline-num">5,1%</span>, inflasi <span class="headline-num">1,9%</span></h1>' +
    '<p class="lede">NusaStat mengumpulkan angka resmi Indonesia — penduduk, ekonomi, harga, kerja, kemiskinan, pendidikan — ' +
    'dalam satu tempat. Setiap angka disertai sumber dan tahunnya, setiap grafik bisa diunduh datanya.</p></section>';
  h += '<div class="kpi-grid">' + KEY_INDICATORS.map(kpiCard).join('') + '</div>';
  h += '<p class="small">Angka kunci di atas: nilai terbaru tiap indikator. Klik kartu untuk halaman topiknya.</p>';

  h += '<section class="section split"><div>' +
    chartBox('Pertumbuhan PDB riil, 2019–2025', 'Persen per tahun. Geser untuk memotong rentang tahun.',
      '<div id="gdp-chart">' + lineChart(GDP_GROWTH, { label: 'Pertumbuhan PDB riil Indonesia 2019 sampai 2025', unit: '%' }) + '</div>',
      'IMF World Economic Outlook, Okt 2025; BPS') +
    '<div class="controls"><label for="gdp-from">Dari tahun <select id="gdp-from">' +
    gdpYears.map(y => '<option value="' + y + '"' + (y === 2019 ? ' selected' : '') + '>' + y + '</option>').join('') +
    '</select></label><label for="gdp-to">sampai <select id="gdp-to">' +
    gdpYears.map(y => '<option value="' + y + '"' + (y === 2025 ? ' selected' : '') + '>' + y + '</option>').join('') +
    '</select></label></div></div>' +
    '<div><div class="panel"><h2>Rilis terbaru</h2><ul class="release-list">' +
    RELEASES.map(r => '<li><span class="r-date">' + esc(r.date) + '</span> · <span class="r-src">' + esc(r.source) + '</span><br>' + esc(r.title) + '</li>').join('') +
    '</ul><p><a href="#/rilis">Semua rilis →</a></p></div>' +
    '<div class="panel"><h3>Paling dicari</h3><ul class="link-list">' +
    '<li><a href="#/harga">Inflasi 1,9% (2025) — turun dari 2,3%</a></li>' +
    '<li><a href="#/provinsi">Provinsi mana yang paling kaya per kapita?</a></li>' +
    '<li><a href="#/kemiskinan">Kemiskinan 8,07% (Mar 2026)</a></li>' +
    '<li><a href="#/pendidikan">IPM 75,02 (2024)</a></li></ul></div></div></section>';

  h += '<section class="section"><h2>Apa yang berubah tahun ini</h2><div class="split">' +
    '<div class="panel"><h3>Inflasi mereda ke 1,9%</h3><p>Inflasi rata-rata 2025 sebesar 1,9% (World Bank WDI), turun dari 2,3% pada 2024 ' +
    'dan 4,2% pada 2022. Ini laju inflasi terendah Indonesia sejak 2021.</p><p><a href="#/harga">Lihat halaman Harga →</a></p></div>' +
    '<div class="panel"><h3>Kemiskinan di bawah 8,1%</h3><p>Pada Maret 2026, 8,07% penduduk hidup di bawah garis kemiskinan nasional (BPS), ' +
    'turun dari 8,47% pada Maret 2025 — penurunan 0,4 poin dalam setahun.</p><p><a href="#/kemiskinan">Lihat halaman Kemiskinan →</a></p></div></div></section>';

  h += '<section class="section split"><div>' +
    chartBox('PDB menurut sektor, 2024', 'Persen dari PDB. Jasa mendominasi hampir separuh ekonomi.',
      donutChart(SECTORS, { label: 'Komposisi PDB Indonesia menurut sektor 2024' }),
      'BPS 2024; pangsa dibulatkan, jumlah 100%') +
    '<ul class="fact-list">' + SECTORS.map(s => '<li><span>' + esc(s.name) + '</span><span class="f-val">' + s.v + '%</span></li>').join('') + '</ul></div>' +
    '<div class="panel"><h2>Enam topik, satu negara</h2><ul class="link-list">' +
    '<li><a href="#/ekonomi">Ekonomi — PDB, ekspor, utang</a></li>' +
    '<li><a href="#/penduduk">Penduduk — 285,7 juta jiwa (2025)</a></li>' +
    '<li><a href="#/ketenagakerjaan">Ketenagakerjaan — pengangguran 4,9%</a></li>' +
    '<li><a href="#/harga">Harga — inflasi &amp; kalkulator daya beli</a></li>' +
    '<li><a href="#/kemiskinan">Kemiskinan — 8,07% &amp; Gini 34,4</a></li>' +
    '<li><a href="#/pendidikan">Pendidikan &amp; Kesehatan — IPM 75,02</a></li></ul>' +
    '<p class="small">Semua halaman dirender dari data yang sama dan bisa dibuka lewat tautan di atas atau menu di atas halaman.</p></div></section>';
  return h;
}

function yearRows(seriesList) {
  const years = GDP_GROWTH.map(d => d.year);
  return years.map((y, i) => {
    const row = { year: String(y) };
    seriesList.forEach(s => { row[s.key] = s.data[i] ? String(s.data[i].v) : '—'; });
    return row;
  });
}

export function renderEkonomi() {
  let h = head('Ekonomi', 'Ekonomi', 'PDB US$ 1,45 triliun (IMF WEO 2025) dengan pertumbuhan riil 5,1% — ekonomi terbesar di Asia Tenggara. Ekspor US$ 271 miliar, utang pemerintah 40,9% PDB.');
  h += '<section class="section split"><div>' +
    chartBox('Pertumbuhan PDB riil, 2019–2025', 'Persen per tahun. Kontraksi 2020 (−2,1%) adalah satu-satunya tahun negatif.',
      lineChart(GDP_GROWTH, { label: 'Pertumbuhan PDB riil 2019 sampai 2025', unit: '%' }), 'IMF WEO Okt 2025; BPS') +
    chartBox('Ekspor barang, 2019–2025', 'Miliar dolar AS.',
      barChart(EXPORTS, { label: 'Ekspor barang Indonesia 2019 sampai 2025', unit: '' }), 'BPS; World Bank WDI 2025') +
    '</div><div>' +
    chartBox('Utang pemerintah, 2019–2025', 'Persen dari PDB. Melonjak saat pandemi, lalu stabil di sekitar 40%.',
      lineChart(DEBT, { label: 'Utang pemerintah persen PDB 2019 sampai 2025', unit: '%', color: '#c77f0a' }), 'IMF WEO Okt 2025') +
    '<div class="callout"><p><strong>Apa artinya:</strong> ekonomi tumbuh di atas 5% empat tahun berturut-turut (2022–2025) ' +
    'sambil menjaga utang di bawah 41% PDB — ruang fiskal yang masih longgar untuk belanja negara.</p></div></div></section>';
  const cols = [
    { key: 'year', label: 'Tahun', type: 'num' },
    { key: 'gdp', label: 'PDB riil (%)' },
    { key: 'cpi', label: 'Inflasi (%)' },
    { key: 'exp', label: 'Ekspor (US$ M)' },
    { key: 'debt', label: 'Utang (% PDB)' },
  ];
  h += '<section class="section"><h2>Tabel: ekonomi 2019–2025</h2><p class="lede">Klik judul kolom untuk mengurutkan. Unduh tabel sebagai CSV.</p>' +
    '<div class="controls">' + csvButton('tbl-ekonomi', 'ekonomi-indonesia-2019-2025.csv') + '</div>' +
    dataTable('tbl-ekonomi', cols, yearRows([
      { key: 'gdp', data: GDP_GROWTH }, { key: 'cpi', data: INFLATION },
      { key: 'exp', data: EXPORTS }, { key: 'debt', data: DEBT },
    ])) + srcLine('IMF WEO Okt 2025; World Bank WDI 2025; BPS. Ekspor 2025 angka sementara.') + '</section>';
  return h;
}

export function renderPenduduk() {
  let h = head('Penduduk', 'Penduduk', '285,7 juta jiwa pada 2025 (World Bank WDI) — negara berpenduduk terbesar keempat di dunia, dengan usia median 29,8 tahun (2023).');
  h += '<section class="section split"><div>' +
    chartBox('Penduduk, 2019–2025', 'Juta jiwa, pertengahan tahun. Tumbuh sekitar 0,8% per tahun.',
      lineChart(POPULATION, { label: 'Penduduk Indonesia 2019 sampai 2025', unit: ' jt' }), 'World Bank WDI 2025') +
    '</div><div><div class="panel"><h2>Dalam sekejap</h2><ul class="fact-list">' +
    '<li><span>Penduduk (2025)</span><span class="f-val">285,7 jt<span class="f-src">World Bank WDI</span></span></li>' +
    '<li><span>Pertumbuhan penduduk</span><span class="f-val">0,8%/thn<span class="f-src">World Bank WDI 2025</span></span></li>' +
    '<li><span>Usia median</span><span class="f-val">29,8 thn<span class="f-src">World Bank WDI 2023</span></span></li>' +
    '<li><span>Fertilitas total</span><span class="f-val">2,12<span class="f-src">World Bank WDI 2024</span></span></li>' +
    '<li><span>Harapan hidup</span><span class="f-val">71,3 thn<span class="f-src">World Bank WDI 2024</span></span></li></ul></div>' +
    '<div class="callout"><p><strong>Apa artinya:</strong> Jawa menampung sekitar 56% penduduk di 7% luas daratan — ' +
    'kepadatan Jawa di atas 1.100 jiwa/km² berbanding Papua di bawah 15 jiwa/km². Lihat <a href="#/provinsi">perbandingan provinsi</a>.</p></div></div></section>';
  h += '<section class="section"><h2>Tabel: penduduk &amp; harapan hidup</h2>' +
    dataTable('tbl-penduduk', [
      { key: 'year', label: 'Tahun', type: 'num' },
      { key: 'pop', label: 'Penduduk (jt)' },
      { key: 'life', label: 'Harapan hidup (thn)' },
    ], yearRows([{ key: 'pop', data: POPULATION }, { key: 'life', data: LIFE }])) +
    srcLine('World Bank WDI 2025 (penduduk); WDI 2024 (harapan hidup). Harapan hidup 2025 belum diterbitkan.') + '</section>';
  return h;
}

export function renderKerja() {
  let h = head('Ketenagakerjaan', 'Ketenagakerjaan', 'Pengangguran 4,9% pada Agustus 2025 (BPS: 4,85%) — terendah dalam satu dekade — dengan partisipasi angkatan kerja 68,0% (World Bank WDI 2025).');
  h += '<section class="section split"><div>' +
    chartBox('Pengangguran, 2019–2025', 'Persen angkatan kerja. Lonjakan 2020 (7,1%) adalah dampak pandemi.',
      barChart(UNEMPLOYMENT, { label: 'Tingkat pengangguran 2019 sampai 2025', unit: '%' }), 'IMF WEO; BPS 2025') +
    '</div><div>' +
    chartBox('Partisipasi angkatan kerja, 2019–2025', 'Persen penduduk usia 15 tahun ke atas.',
      lineChart(LFPR, { label: 'Partisipasi angkatan kerja 2019 sampai 2025', unit: '%' }), 'World Bank WDI 2025') +
    '<div class="callout"><p><strong>Apa artinya:</strong> pengangguran turun 2,2 poin dari puncak pandemi, tapi partisipasi ' +
    'masih di bawah 2019 (68,3%) — sebagian pekerja belum kembali ke angkatan kerja.</p></div></div></section>';
  h += '<section class="section"><h2>Tabel: ketenagakerjaan 2019–2025</h2><div class="controls">' +
    csvButton('tbl-kerja', 'ketenagakerjaan-indonesia-2019-2025.csv') + '</div>' +
    dataTable('tbl-kerja', [
      { key: 'year', label: 'Tahun', type: 'num' },
      { key: 'unemp', label: 'Pengangguran (%)' },
      { key: 'lfpr', label: 'Partisipasi (%)' },
    ], yearRows([{ key: 'unemp', data: UNEMPLOYMENT }, { key: 'lfpr', data: LFPR }])) +
    srcLine('IMF WEO Okt 2025; BPS Agustus 2025; World Bank WDI 2025.') + '</section>';
  return h;
}

export function renderHarga() {
  let h = head('Harga', 'Harga &amp; Inflasi', 'Inflasi rata-rata 1,9% pada 2025 (World Bank WDI) — turun dari 4,2% pada 2022. Hitung sendiri berapa nilai uang Anda hari ini dengan kalkulator di bawah.');
  h += '<section class="section split"><div>' +
    chartBox('Inflasi (IHK), 2019–2025', 'Persen, rata-rata tahunan.',
      barChart(INFLATION, { label: 'Inflasi Indonesia 2019 sampai 2025', unit: '%' }), 'World Bank WDI 2025') +
    '</div><div><div class="panel"><h2>Kalkulator daya beli</h2>' +
    '<p>Berapa nilai uang dari tahun lalu dalam rupiah hari ini?</p>' +
    '<div class="controls"><label for="calc-amount">Rp <input id="calc-amount" type="number" value="1000000" min="1000" step="1000"></label>' +
    '<label for="calc-year">tahun <select id="calc-year">' +
    INFLATION.map(d => '<option value="' + d.year + '"' + (d.year === 2020 ? ' selected' : '') + '>' + d.year + '</option>').join('') +
    '</select></label><button class="btn" type="button" id="calc-go">Hitung</button></div>' +
    '<p class="calc-result" id="calc-result">Rp 1.000.000 tahun 2020 ≈ Rp 1.122.000 hari ini</p>' +
    '<p class="small">Dihitung dari inflasi tahunan kumulatif (World Bank WDI 2021–2025). Perkiraan — bukan angka resmi BPS.</p></div>' +
    '<div class="callout"><p><strong>Apa artinya:</strong> Rp 1 juta pada 2020 membeli barang yang kini berharga sekitar Rp 1,12 juta. ' +
    'Inflasi kumulatif 2021–2025 sekitar 12,2%.</p></div></div></section>';
  h += '<section class="section"><h2>Tabel: inflasi 2019–2025</h2><div class="controls">' +
    csvButton('tbl-harga', 'inflasi-indonesia-2019-2025.csv') + '</div>' +
    dataTable('tbl-harga', [
      { key: 'year', label: 'Tahun', type: 'num' },
      { key: 'cpi', label: 'Inflasi (%)' },
    ], yearRows([{ key: 'cpi', data: INFLATION }])) +
    srcLine('World Bank WDI 2025. Inflasi Oktober 2025 (yoy, BPS): 2,86%.') + '</section>';
  return h;
}

export function renderKemiskinan() {
  let h = head('Kemiskinan', 'Kemiskinan', '8,07% penduduk hidup di bawah garis kemiskinan nasional pada Maret 2026 (BPS) — turun dari 10,2% pada 2020. Rasio Gini 34,4 (World Bank WDI 2025).');
  h += '<section class="section split"><div>' +
    chartBox('Kemiskinan, 2019–2025', 'Persen penduduk, garis kemiskinan nasional. Puncak pandemi 2020, lalu turun tiap tahun.',
      lineChart(POVERTY, { label: 'Tingkat kemiskinan 2019 sampai 2025', unit: '%' }), 'BPS; Mar 2026: 8,07%') +
    '</div><div><div class="panel"><h2>Dalam sekejap</h2><ul class="fact-list">' +
    '<li><span>Kemiskinan (Mar 2026)</span><span class="f-val">8,07%<span class="f-src">BPS</span></span></li>' +
    '<li><span>Kemiskinan (Mar 2025)</span><span class="f-val">8,47%<span class="f-src">BPS</span></span></li>' +
    '<li><span>Kemiskinan ekstrem ($3/hari, PPP 2021)</span><span class="f-val">3,7%<span class="f-src">World Bank WDI 2025</span></span></li>' +
    '<li><span>Rasio Gini</span><span class="f-val">34,4<span class="f-src">World Bank WDI 2025</span></span></li></ul></div>' +
    '<div class="callout"><p><strong>Apa artinya:</strong> penurunan 0,4 poin dalam setahun (Mar 2025 → Mar 2026) ' +
    'berarti sekitar 1,1 juta orang keluar dari kemiskinan. Lihat provinsi mana yang masih di atas 10% di <a href="#/provinsi">perbandingan provinsi</a>.</p></div></div></section>';
  h += '<section class="section"><h2>Tabel: kemiskinan 2019–2025</h2>' +
    dataTable('tbl-miskin', [
      { key: 'year', label: 'Tahun', type: 'num' },
      { key: 'pov', label: 'Kemiskinan (%)' },
    ], yearRows([{ key: 'pov', data: POVERTY }])) +
    srcLine('BPS. Seri memakai angka September/Maret yang diterbitkan tiap tahun; 2025 = 8,5% (angka tahunan BPS).') + '</section>';
  return h;
}

export function renderPendidikan() {
  let h = head('Pendidikan & Kesehatan', 'Pendidikan &amp; Kesehatan', 'Indeks Pembangunan Manusia 75,02 pada 2024 (BPS) — kategori tinggi. Harapan hidup 71,3 tahun; rata-rata lama sekolah 9,2 tahun.');
  h += '<section class="section split"><div>' +
    chartBox('Harapan hidup, 2019–2024', 'Tahun. Penurunan 2021 (70,2) adalah dampak pandemi.',
      lineChart(LIFE, { label: 'Harapan hidup 2019 sampai 2024', unit: ' thn' }), 'World Bank WDI 2024') +
    '</div><div class="panel"><h2>Delapan angka pendidikan &amp; kesehatan</h2><ul class="fact-list">' +
    EDU_HEALTH.map(f => '<li><span>' + esc(f.label) + '</span><span class="f-val">' + esc(f.value) + '<span class="f-src">' + esc(f.source) + ' ' + esc(f.period) + '</span></span></li>').join('') +
    '</ul></div></section>';
  h += '<section class="section"><div class="callout"><p><strong>Apa artinya:</strong> stunting balita 19,8% (SSGI 2024) masih hampir satu dari lima anak — ' +
    'angka yang paling jauh dari target di halaman ini, dan alasan gizi anak menjadi program prioritas nasional.</p></div></section>';
  return h;
}

export function renderProvinsi() {
  const byPop = PROVINCES.slice().sort((a, b) => b.pop - a.pop);
  let h = head('Provinsi', 'Perbandingan Provinsi', '10 provinsi terbesar menurut penduduk (BPS 2024). Urutkan tabelnya, atau bandingkan dua provinsi secara langsung.');
  h += '<section class="section split"><div>' +
    chartBox('Penduduk 10 provinsi terbesar, 2024', 'Juta jiwa. Jawa Barat sendiri hampir 50 juta jiwa.',
      hbarChart(byPop.map(p => ({ name: p.name, v: p.pop })), { label: 'Penduduk provinsi 2024', unit: ' jt' }), 'BPS 2024') +
    '</div><div><div class="panel"><h2>Bandingkan dua provinsi</h2>' +
    '<div class="controls"><label for="cmp-a">Provinsi A <select id="cmp-a">' +
    PROVINCES.map((p, i) => '<option value="' + i + '"' + (i === 0 ? ' selected' : '') + '>' + esc(p.name) + '</option>').join('') +
    '</select></label><label for="cmp-b">Provinsi B <select id="cmp-b">' +
    PROVINCES.map((p, i) => '<option value="' + i + '"' + (i === 8 ? ' selected' : '') + '>' + esc(p.name) + '</option>').join('') +
    '</select></label></div>' +
    '<div id="cmp-out"></div>' +
    '<p class="small">PDRB per kapita dalam juta rupiah (BPS 2024, dibulatkan). Kemiskinan Maret 2024; pengangguran Agustus 2024.</p></div></div></section>';
  const cols = [
    { key: 'name', label: 'Provinsi', type: 'text' },
    { key: 'pop', label: 'Penduduk (jt)' },
    { key: 'poverty', label: 'Kemiskinan (%)' },
    { key: 'unemp', label: 'Pengangguran (%)' },
    { key: 'gdpPc', label: 'PDRB/kapita (Rp jt)' },
  ];
  h += '<section class="section"><h2>Tabel: 10 provinsi</h2><p class="lede">Klik judul kolom untuk mengurutkan — mis. urutkan menurut kemiskinan untuk melihat provinsi termiskin.</p>' +
    '<div class="controls">' + csvButton('tbl-provinsi', 'provinsi-indonesia-2024.csv') + '</div>' +
    dataTable('tbl-provinsi', cols, PROVINCES.map(p => ({
      name: p.name, pop: String(p.pop), poverty: p.poverty.toFixed(2),
      unemp: p.unemp.toFixed(2), gdpPc: p.gdpPc.toFixed(1),
    }))) + srcLine('BPS 2024. Angka dibulatkan dari publikasi BPS; lihat Metodologi untuk catatan pembulatan.') + '</section>';
  return h;
}

export function renderMetodologi() {
  let h = head('Metodologi', 'Metodologi &amp; Sumber', 'Bagaimana angka di situs ini dibuat, apa definisinya, dan dari mana asalnya — supaya setiap angka bisa diperiksa ulang.');
  h += '<section class="section"><h2>Definisi indikator</h2><div class="table-wrap"><table class="data"><thead><tr>' +
    '<th>Indikator</th><th>Definisi</th><th>Sumber</th></tr></thead><tbody>' +
    '<tr><td>PDB riil</td><td>Nilai tambah barang dan jasa, harga konstan; pertumbuhan year-on-year</td><td>IMF WEO; BPS</td></tr>' +
    '<tr><td>Inflasi (IHK)</td><td>Perubahan rata-rata tahunan Indeks Harga Konsumen</td><td>World Bank WDI</td></tr>' +
    '<tr><td>Pengangguran</td><td>Persen angkatan kerja yang tidak bekerja dan mencari kerja (TPT)</td><td>BPS; IMF WEO</td></tr>' +
    '<tr><td>Kemiskinan</td><td>Persen penduduk di bawah garis kemiskinan nasional</td><td>BPS</td></tr>' +
    '<tr><td>Rasio Gini</td><td>Ukuran ketimpangan 0–100; 0 berarti semua sama</td><td>World Bank WDI</td></tr>' +
    '<tr><td>IPM</td><td>Indeks Pembangunan Manusia 0–100 (kesehatan, pendidikan, penghasilan)</td><td>BPS</td></tr>' +
    '<tr><td>PDRB per kapita</td><td>Produk domestik regional bruto dibagi penduduk, rupiah</td><td>BPS</td></tr>' +
    '</tbody></table></div></section>';
  h += '<section class="section"><h2>Sumber data</h2><ul class="link-list">' +
    '<li><strong>BPS — Statistics Indonesia.</strong> Berita Resmi Statistik, publikasi provinsi, dan IPM 2024. Rilis bulanan dan tahunan.</li>' +
    '<li><strong>World Bank — World Development Indicators 2025.</strong> Penduduk, inflasi, harapan hidup, fertilitas, Gini, partisipasi kerja.</li>' +
    '<li><strong>IMF — World Economic Outlook, Oktober 2025.</strong> PDB nominal dan PPP, pertumbuhan riil, pengangguran, utang pemerintah.</li>' +
    '<li><strong>SSGI / Kementerian Kesehatan 2024.</strong> Prevalensi stunting balita 19,8%.</li></ul>' +
    '<h2>Catatan pembulatan</h2><p>Angka provinsi dibulatkan dari publikasi BPS (satu desimal untuk PDRB per kapita, dua desimal untuk persen). ' +
    'Angka ekspor 2025 adalah angka sementara. Bila sebuah seri belum diterbitkan untuk 2025 (mis. harapan hidup), tabel berhenti di tahun terakhir yang tersedia ' +
    'dan halaman mengatakannya — tidak ada angka yang ditebak.</p>' +
    '<h2>Tentang situs ini</h2><p>NusaStat adalah situs independen yang dibuat untuk menunjukkan statistik Indonesia. ' +
    'Bukan situs resmi pemerintah dan tidak berafiliasi dengan BPS. Semua grafik digambar sebagai SVG dari data di situs ini sendiri; ' +
    'situs berjalan tanpa jaringan dan tanpa pelacakan.</p></section>';
  return h;
}

export function renderRilis() {
  let h = head('Rilis', 'Rilis Terbaru', 'Angka-angka terbaru yang diterbitkan BPS, World Bank dan IMF — dengan tanggal rilisnya.');
  h += '<section class="section"><div class="panel"><ul class="release-list">' +
    RELEASES.map(r => '<li><span class="r-date">' + esc(r.date) + '</span> · <span class="r-src">' + esc(r.source) + '</span><br>' + esc(r.title) + '</li>').join('') +
    '<li><span class="r-date">Okt 2025</span> · <span class="r-src">IMF</span><br>World Economic Outlook Oktober 2025: PDB Indonesia US$ 1,45 triliun, utang 40,9% PDB</li>' +
    '<li><span class="r-date">2025</span> · <span class="r-src">World Bank</span><br>World Development Indicators 2025: populasi 285,7 juta, inflasi 1,9%, Gini 34,4</li>' +
    '</ul></div>' + srcLine('BPS Berita Resmi Statistik; IMF WEO Okt 2025; World Bank WDI 2025.') + '</section>';
  return h;
}

export const ROUTES = {
  '': renderHome,
  'ekonomi': renderEkonomi,
  'penduduk': renderPenduduk,
  'ketenagakerjaan': renderKerja,
  'harga': renderHarga,
  'kemiskinan': renderKemiskinan,
  'pendidikan': renderPendidikan,
  'provinsi': renderProvinsi,
  'metodologi': renderMetodologi,
  'rilis': renderRilis,
};
