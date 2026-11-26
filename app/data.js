// NusaStat — Statistik Nusantara. Data pack Indonesia.
// Every figure below carries its source and year, in the data and on the page.
// Sources: BPS (Statistics Indonesia), World Bank WDI 2025, IMF WEO Oct 2025.
// Values are published aggregates; where a figure is rounded, the page says so.
// See the Metodologi page for definitions, rounding notes and full source list.

export const META = {
  country: 'Indonesia',
  brand: 'NusaStat',
  tagline: 'Statistik Nusantara',
  coverage: '2019–2025',
  provincesCovered: 10,
  provincesTotal: 38,
  indicators: 24,
  updated: '26 November 2026',
};

// Real GDP growth, % year-on-year (IMF WEO Oct 2025; BPS agrees to 0.1 pp)
export const GDP_GROWTH = [
  { year: 2019, v: 5.0 }, { year: 2020, v: -2.1 }, { year: 2021, v: 3.7 },
  { year: 2022, v: 5.3 }, { year: 2023, v: 5.0 }, { year: 2024, v: 5.0 },
  { year: 2025, v: 5.1 },
];

// Consumer-price inflation, % annual average (World Bank WDI 2025)
export const INFLATION = [
  { year: 2019, v: 2.8 }, { year: 2020, v: 2.0 }, { year: 2021, v: 1.6 },
  { year: 2022, v: 4.2 }, { year: 2023, v: 3.7 }, { year: 2024, v: 2.3 },
  { year: 2025, v: 1.9 },
];

// Population, millions, mid-year (World Bank WDI 2025)
export const POPULATION = [
  { year: 2019, v: 270.6 }, { year: 2020, v: 274.5 }, { year: 2021, v: 276.4 },
  { year: 2022, v: 278.7 }, { year: 2023, v: 281.2 }, { year: 2024, v: 283.5 },
  { year: 2025, v: 285.7 },
];

// Open unemployment rate, % (IMF WEO; BPS Aug 2025: 4,85%)
export const UNEMPLOYMENT = [
  { year: 2019, v: 5.2 }, { year: 2020, v: 7.1 }, { year: 2021, v: 6.5 },
  { year: 2022, v: 5.9 }, { year: 2023, v: 5.3 }, { year: 2024, v: 4.9 },
  { year: 2025, v: 4.9 },
];

// Poverty rate, % of population, national line (BPS; Mar 2026: 8,07%)
export const POVERTY = [
  { year: 2019, v: 9.2 }, { year: 2020, v: 10.2 }, { year: 2021, v: 10.1 },
  { year: 2022, v: 9.6 }, { year: 2023, v: 9.4 }, { year: 2024, v: 9.0 },
  { year: 2025, v: 8.5 },
];

// Life expectancy at birth, years (World Bank WDI)
export const LIFE = [
  { year: 2019, v: 71.7 }, { year: 2020, v: 71.5 }, { year: 2021, v: 70.2 },
  { year: 2022, v: 71.2 }, { year: 2023, v: 71.3 }, { year: 2024, v: 71.3 },
];

// Labour-force participation rate, % of population 15+ (World Bank WDI)
export const LFPR = [
  { year: 2019, v: 68.3 }, { year: 2020, v: 67.4 }, { year: 2021, v: 67.9 },
  { year: 2022, v: 68.6 }, { year: 2023, v: 68.9 }, { year: 2024, v: 68.2 },
  { year: 2025, v: 68.0 },
];

// General government gross debt, % of GDP (IMF WEO Oct 2025)
export const DEBT = [
  { year: 2019, v: 30.6 }, { year: 2020, v: 39.4 }, { year: 2021, v: 41.1 },
  { year: 2022, v: 39.6 }, { year: 2023, v: 39.1 }, { year: 2024, v: 39.9 },
  { year: 2025, v: 40.9 },
];

// GDP by sector, % of GDP (BPS 2024; shares rounded, sum 100)
export const SECTORS = [
  { name: 'Pertanian, kehutanan & perikanan', v: 12.5 },
  { name: 'Industri pengolahan', v: 18.7 },
  { name: 'Perdagangan besar & eceran', v: 13.0 },
  { name: 'Konstruksi', v: 9.9 },
  { name: 'Jasa lainnya', v: 45.9 },
];

// Exports of goods, US$ billion (BPS / World Bank WDI)
export const EXPORTS = [
  { year: 2019, v: 167.7 }, { year: 2020, v: 163.2 }, { year: 2021, v: 231.6 },
  { year: 2022, v: 291.9 }, { year: 2023, v: 258.8 }, { year: 2024, v: 264.7 },
  { year: 2025, v: 271.0 },
];

// Six key indicators for the home dashboard: value, period, change, source.
export const KEY_INDICATORS = [
  { id: 'pop', label: 'Penduduk', value: '285,7 jt', period: '2025', change: '+0,8% per tahun', dir: 'up', source: 'World Bank WDI 2025', spark: POPULATION.map(d => d.v), href: '#/penduduk' },
  { id: 'gdp', label: 'PDB nominal', value: 'US$ 1,45 T', period: '2025', change: '+5,1% riil', dir: 'up', source: 'IMF WEO 2025', spark: GDP_GROWTH.map(d => d.v), href: '#/ekonomi' },
  { id: 'gdppc', label: 'PDB per kapita', value: 'US$ 5.060', period: '2025', change: 'PPP US$ 17.660', dir: 'up', source: 'IMF WEO 2025', spark: [4380, 4170, 4400, 4800, 4900, 4980, 5060], href: '#/ekonomi' },
  { id: 'cpi', label: 'Inflasi (IHK)', value: '1,9%', period: '2025', change: '−0,4 pp dari 2024', dir: 'down-good', source: 'World Bank WDI 2025', spark: INFLATION.map(d => d.v), href: '#/harga' },
  { id: 'unemp', label: 'Pengangguran', value: '4,9%', period: 'Agu 2025', change: 'BPS: 4,85%', dir: 'down-good', source: 'BPS 2025', spark: UNEMPLOYMENT.map(d => d.v), href: '#/ketenagakerjaan' },
  { id: 'pov', label: 'Kemiskinan', value: '8,07%', period: 'Mar 2026', change: '−0,4 pp dari 2025', dir: 'down-good', source: 'BPS 2026', spark: POVERTY.map(d => d.v), href: '#/kemiskinan' },
];

// Latest releases, dated (BPS Berita Resmi Statistik and WDI/WEO releases)
export const RELEASES = [
  { date: '5 Nov 2025', title: 'PDB triwulan III 2025 tumbuh 5,04% (yoy)', source: 'BPS' },
  { date: '3 Nov 2025', title: 'Inflasi Oktober 2025 sebesar 2,86% (yoy)', source: 'BPS' },
  { date: '5 Nov 2025', title: 'Tingkat pengangguran Agustus 2025: 4,85%', source: 'BPS' },
  { date: 'Mar 2026', title: 'Kemiskinan turun ke 8,07% dari 8,47% (Mar 2025)', source: 'BPS' },
  { date: '2025', title: 'Indeks Pembangunan Manusia 2024: 75,02', source: 'BPS' },
];

// Provinces (10 largest by population): population 2024 (millions, BPS),
// poverty Mar 2024 % (BPS), unemployment Aug 2024 % (BPS),
// GRDP per capita 2024, Rp million (BPS). Figures rounded; see Metodologi.
export const PROVINCES = [
  { name: 'DKI Jakarta', pop: 10.6, poverty: 4.30, unemp: 6.03, gdpPc: 322.0 },
  { name: 'Kalimantan Timur', pop: 4.0, poverty: 6.11, unemp: 5.78, gdpPc: 289.0 },
  { name: 'Riau', pop: 6.9, poverty: 6.67, unemp: 4.35, gdpPc: 184.0 },
  { name: 'Banten', pop: 12.4, poverty: 5.84, unemp: 6.84, gdpPc: 70.0 },
  { name: 'Jawa Timur', pop: 41.8, poverty: 10.35, unemp: 4.05, gdpPc: 68.0 },
  { name: 'Sulawesi Selatan', pop: 9.5, poverty: 8.23, unemp: 4.38, gdpPc: 66.0 },
  { name: 'Sumatera Selatan', pop: 9.0, poverty: 11.76, unemp: 4.35, gdpPc: 62.0 },
  { name: 'Sumatera Utara', pop: 15.6, poverty: 8.15, unemp: 5.68, gdpPc: 62.0 },
  { name: 'Jawa Barat', pop: 49.9, poverty: 7.46, unemp: 7.44, gdpPc: 52.0 },
  { name: 'Jawa Tengah', pop: 37.9, poverty: 10.77, unemp: 4.78, gdpPc: 52.0 },
];

// Searchable indicator index: keywords -> result label + route
export const INDICATOR_INDEX = [
  { q: 'penduduk populasi jumlah orang', label: 'Penduduk — 285,7 juta (2025)', href: '#/penduduk' },
  { q: 'pdb ekonomi pertumbuhan gdp', label: 'PDB — US$ 1,45 triliun, tumbuh 5,1% (2025)', href: '#/ekonomi' },
  { q: 'inflasi harga ihk cpi', label: 'Inflasi — 1,9% (2025)', href: '#/harga' },
  { q: 'pengangguran kerja tpt', label: 'Pengangguran — 4,9% (Agu 2025)', href: '#/ketenagakerjaan' },
  { q: 'kemiskinan miskin garis kemiskinan', label: 'Kemiskinan — 8,07% (Mar 2026)', href: '#/kemiskinan' },
  { q: 'pendidikan sekolah lama sekolah ipm', label: 'Pendidikan & Kesehatan — IPM 75,02 (2024)', href: '#/pendidikan' },
  { q: 'provinsi daerah jawa jakarta perbandingan', label: 'Perbandingan provinsi — 10 provinsi', href: '#/provinsi' },
  { q: 'metodologi sumber cara hitung definisi', label: 'Metodologi & sumber data', href: '#/metodologi' },
  { q: 'gini ketimpangan', label: 'Rasio Gini — 34,4 (2025)', href: '#/kemiskinan' },
  { q: 'harapan hidup umur', label: 'Harapan hidup — 71,3 tahun (2024)', href: '#/pendidikan' },
  { q: 'ekspor dagang', label: 'Ekspor barang — US$ 271 miliar (2025)', href: '#/ekonomi' },
  { q: 'utang pemerintah', label: 'Utang pemerintah — 40,9% PDB (2025)', href: '#/ekonomi' },
];

// Education & health facts (BPS 2024, World Bank WDI, SSGI/Kemenkes 2024)
export const EDU_HEALTH = [
  { label: 'Indeks Pembangunan Manusia', value: '75,02', period: '2024', source: 'BPS' },
  { label: 'Harapan hidup', value: '71,3 tahun', period: '2024', source: 'World Bank WDI' },
  { label: 'Rata-rata lama sekolah', value: '9,2 tahun', period: '2024', source: 'BPS' },
  { label: 'Angka melek huruf (15+)', value: '96,0%', period: '2024', source: 'BPS' },
  { label: 'Prevalensi stunting balita', value: '19,8%', period: '2024', source: 'SSGI / Kemenkes' },
  { label: 'Fertilitas total', value: '2,12 anak/wanita', period: '2024', source: 'World Bank WDI' },
  { label: 'Usia median', value: '29,8 tahun', period: '2023', source: 'World Bank WDI' },
  { label: 'Rasio Gini', value: '34,4', period: '2025', source: 'World Bank WDI' },
];
