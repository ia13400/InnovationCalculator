/* RocketLight — Teil 6. Detailed content and accessible roadmap controls.
   All figures, milestones and sources come from the supplied project data. */
(function () {
  'use strict';

  const CHART = { width: 1600, labelWidth: 280, startX: 294, scale: 95, rowHeight: 88, top: 62 };
  const COLORS = {
    gate: '#f4b38b', qg: '#a9c7d9', ms: '#8cbaa5', link: '#a1afd1',
    start: '#d69a92', end: '#8cbaa5', background: '#0b0d11'
  };
  const STATUS = {
    g: { label: 'Grün', color: '#8cbaa5' },
    y: { label: 'Gelb', color: '#e0bc7d' },
    r: { label: 'Rot', color: '#d69a92' }
  };
  const KIND = { gate: 'Gate', qg: 'Genehmigung, Vertrag, Abnahme', ms: 'Kunden-Meilenstein' };
  const HEX = { FFD400: COLORS.gate, F2A900: '#e0bc7d', '3DDC5A': COLORS.ms };
  const state = {
    variant: 'A', selected: 0, zoom: 1, abort: null, dialog: null,
    bodyOverflow: null, focusReturn: null
  };

  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const number = value => Number(String(value).replace(/\./g, '').replace(',', '.')) || 0;
  const date = value => {
    const parts = String(value).split('-');
    return parts.length === 3 ? parts[2] + '.' + parts[1] + '.' + parts[0] : String(value);
  };
  const currentData = () => window.ROCKET_DATA[state.variant];
  const currentMeta = () => window.ROCKET_META[state.variant];
  const reducedMotion = () => document.documentElement.classList.contains('reduced-motion') ||
    Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const rowTop = index => CHART.top + index * CHART.rowHeight;
  const rowCenter = index => rowTop(index) + 46;
  const position = value => {
    const parts = value.split('-').map(Number);
    const year = parts[0], month = parts[1], day = parts[2];
    const months = (year - 2026) * 12 + (month - 10) + (day - 1) / new Date(year, month, 0).getDate();
    return CHART.startX + (months <= 27
      ? months * .35 * CHART.scale
      : 27 * .35 * CHART.scale + (months - 27) * 1.4 / 12 * CHART.scale);
  };
  const sourcePosition = value => CHART.startX + (value - 4.85) * CHART.scale;
  const arrow = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const downloadIcon = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/></svg>';
  const expandIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/></svg>';
  const status = code => {
    const value = STATUS[code] || STATUS.y;
    return '<span class="rd-status"><i aria-hidden="true" style="background:' + value.color + '"></i>' + value.label + '</span>';
  };
  const sectionHead = (eyebrow, heading, lead) =>
    '<header class="rd-section-head" data-reveal><p class="rd-eyebrow">' + escape(eyebrow) +
    '</p><h2 class="rd-heading">' + heading + '</h2><p class="rd-lead">' + escape(lead) + '</p></header>';

  function projects(data) {
    return '<section class="rd-section rd-projects-section" id="projects" aria-labelledby="rd-projects-title"><div class="rd-wrap">' +
      sectionHead('03 / Verantwortung', '<span id="rd-projects-title">Sechs Teilprojekte.<br>Ein gemeinsames Ziel.</span>', data.titles.t1) +
      '<div class="rd-project-list">' + data.t1.map((project, index) =>
        '<details class="rd-project" data-reveal><summary><span class="rd-project-number">' +
        String(index + 1).padStart(2, '0') + '</span><h3>' + escape(project.name) + '</h3>' +
        status(data.t2[index + 1].st) + '<span class="rd-plus" aria-hidden="true">+</span></summary>' +
        '<div class="rd-project-content"><div><span class="rd-kicker">Der Auftrag</span><p>' +
        escape(project.inhalt) + '</p></div><div><span class="rd-kicker">Das Ziel</span><p>' +
        escape(project.ziel) + '</p><button type="button" class="rd-text-link" data-rd-project="' +
        (index + 1) + '">In der Roadmap ansehen ' + arrow + '</button></div></div></details>'
      ).join('') + '</div></div></section>';
  }

  function budget(data, meta) {
    const rows = data.t2.filter(row => !row.sum);
    const sum = data.t2.find(row => row.sum);
    const total = number(sum.bud);
    const finance = ['SpaceX', 'Partner', 'Kunde'];
    const flag = (value, label) => '<span class="rd-table-check' + (value ? ' is-on' : '') +
      '" aria-label="' + escape(label) + ': ' + (value ? 'ja' : 'nein') + '">' + (value ? '✓' : '—') + '</span>';
    const table = '<div class="rd-table-scroll" tabindex="0" role="region" aria-label="Vollständige Budget- und Verantwortungstabelle">' +
      '<table class="rd-table"><caption class="rd-sr-only">Projektzusammenfassung Teil 2, ' + escape(data.short) +
      '. Budget in Tausend USD; Umsatzpotenzial in Millionen USD.</caption><thead><tr>' +
      '<th rowspan="2" scope="col">Teilprojekt</th><th colspan="3" scope="colgroup">Pipeline</th>' +
      '<th colspan="3" scope="colgroup">Finanzierung</th><th rowspan="2" scope="col">PL</th>' +
      '<th rowspan="2" scope="col">Collab.</th><th rowspan="2" scope="col">Cust.</th>' +
      '<th rowspan="2" scope="col">Status</th><th rowspan="2" scope="col">Potential<br><small>Mio USD</small></th>' +
      '<th rowspan="2" scope="col">Budget<br><small>T. USD</small></th></tr><tr>' +
      data.pipeHeads.map(label => '<th scope="col">' + escape(label) + '</th>').join('') +
      finance.map(label => '<th scope="col">' + label + '</th>').join('') + '</tr></thead><tbody>' +
      rows.map((row, index) => '<tr><th scope="row"><button type="button" class="rd-table-project" data-rd-project="' +
        index + '">' + escape(row.tp) + '</button></th>' +
        row.pipe.map((value, column) => '<td class="rd-table-center">' + flag(value, data.pipeHeads[column]) + '</td>').join('') +
        row.fin.map((value, column) => '<td class="rd-table-center">' + flag(value, finance[column]) + '</td>').join('') +
        '<td>' + escape(row.pl) + '</td><td>' + escape(row.col) + '</td><td>' + escape(row.cust) + '</td><td>' +
        status(row.st) + '</td><td class="rd-table-number">' + escape(row.pot) + '</td><td class="rd-table-number">' +
        escape(row.bud) + '</td></tr>').join('') +
      '<tr class="rd-table-total"><th scope="row">Summe</th><td colspan="10"></td><td class="rd-table-number">' +
      escape(sum.pot) + '</td><td class="rd-table-number">' + escape(sum.bud) + '</td></tr></tbody></table></div>';

    return '<section class="rd-section rd-budget-section" id="budget" aria-labelledby="rd-budget-title"><div class="rd-wrap">' +
      sectionHead('04 / Investition', '<span id="rd-budget-title">Der Plan hinter<br>jedem Dollar.</span>', data.titles.t2) +
      '<div class="rd-budget-layout"><div class="rd-budget-figure" data-reveal><p class="rd-budget-total">' +
      escape(meta.budget) + '<span class="rd-budget-unit">Mio USD</span></p><p class="rd-budget-label">' +
      escape(meta.budgetLabel.replace(/^Mio USD\s*/, '')) + '</p><div class="rd-budget-potential"><span>' +
      escape(sum.pot) + '</span><p>Mio USD<br>Umsatzpotenzial in fünf Jahren</p></div>' +
      '<p class="rd-budget-caption">Budget und Aufteilung sind Planannahmen. Die vollständige Herleitung steht unter der Grafik.</p></div>' +
      '<ol class="rd-allocation" aria-label="Verteilung des Projektbudgets">' + rows.map((row, index) => {
        const share = total ? (number(row.bud) / total * 100) : 0;
        return '<li class="rd-allocation-row" data-reveal><div class="rd-allocation-label"><span>' +
          escape(row.tp) + '</span><span class="rd-allocation-value">' + escape(row.bud) +
          '<small> T. USD</small></span></div><div class="rd-allocation-track" aria-hidden="true"><span class="rd-allocation-fill" style="--allocation:' +
          share.toFixed(2) + '%;width:' + share.toFixed(2) + '%;--allocation-delay:' + (index * 55) +
          'ms"></span></div><span class="rd-sr-only">' + share.toFixed(1).replace('.', ',') +
          ' Prozent des Gesamtbudgets</span></li>';
      }).join('') + '</ol></div>' +
      '<details class="rd-accordion rd-budget-breakdown" data-reveal><summary><span>Die vollständige Kalkulation</span>' +
      '<span class="rd-accordion-meta">Budget · Partner · Verantwortung</span><span class="rd-plus" aria-hidden="true">+</span></summary>' +
      '<div class="rd-accordion-content">' + table + '<p class="rd-note">' + escape(data.t2note) + '</p></div></details>' +
      '</div></section>';
  }

  function labelLines(value) {
    if (value.includes(' & ')) {
      const parts = value.split(' & ');
      return [parts[0] + ' &', parts.slice(1).join(' & ')];
    }
    if (value.length > 19 && value.includes(' ')) {
      const at = value.lastIndexOf(' ');
      return [value.slice(0, at), value.slice(at + 1)];
    }
    return [value];
  }

  function chartStyle() {
    return '<style>' +
      '.rd-roadmap-svg text{font-family:inherit;font-size:14px;fill:#b8b7b4}' +
      '.rd-roadmap-svg .rd-chart-axis{font-size:12px;letter-spacing:1.8px;fill:#a09f9c}' +
      '.rd-roadmap-svg .rd-chart-year{fill:#ede9e3;font-size:16px;font-weight:600;letter-spacing:1px}' +
      '.rd-roadmap-svg .rd-chart-year-bg{fill:#ffffff04}' +
      '.rd-roadmap-svg .rd-chart-quarter{fill:#969a9e;font-size:12px;letter-spacing:1px}' +
      '.rd-roadmap-svg .rd-chart-row{cursor:pointer;outline:none}' +
      '.rd-roadmap-svg .rd-chart-band{fill:#ffffff02;transition:fill .3s}' +
      '.rd-roadmap-svg .rd-chart-row:nth-of-type(even) .rd-chart-band{fill:#ffffff04}' +
      '.rd-roadmap-svg .rd-chart-row:hover .rd-chart-band{fill:#ffffff09}' +
      '.rd-roadmap-svg .rd-chart-row.is-selected .rd-chart-band{fill:#f4b38b0c}' +
      '.rd-roadmap-svg .rd-chart-row:focus-visible .rd-chart-band{stroke:#f4b38b;stroke-width:2}' +
      '.rd-roadmap-svg .rd-selection-rail{fill:#f4b38b;opacity:0;transition:opacity .3s}' +
      '.rd-roadmap-svg .rd-chart-row.is-selected .rd-selection-rail{opacity:1}' +
      '.rd-roadmap-svg .rd-chart-index{fill:#c0a28e;font-size:12px;font-variant-numeric:tabular-nums;letter-spacing:1px}' +
      '.rd-roadmap-svg .rd-chart-name{fill:#eeebe6;font-size:16px;font-weight:500;letter-spacing:0}' +
      '.rd-roadmap-svg .rd-grid-quarter{stroke:#ffffff0b;stroke-width:1}' +
      '.rd-roadmap-svg .rd-grid-year{stroke:#ffffff17;stroke-width:1}' +
      '.rd-roadmap-svg .rd-grid-divider{stroke:#ffffff2d;stroke-width:1;stroke-dasharray:3 6}' +
      '.rd-roadmap-svg .rd-today{stroke:#f4b38b;stroke-width:1.4;stroke-dasharray:3 5;opacity:.6}' +
      '.rd-roadmap-svg .rd-phase.p1{fill:#515459}.rd-roadmap-svg .rd-phase.p2{fill:#a6a49f}' +
      '.rd-roadmap-svg .rd-phase.p3{fill:#e8e1d6}.rd-roadmap-svg .rd-phase.dot{fill:#ffffff02;stroke:#a8a19a;stroke-dasharray:5 4;stroke-width:1.2}' +
      '.rd-roadmap-svg .rd-phase-title{font-size:15px;font-weight:500}' +
      '.rd-roadmap-svg .rd-phase-title.p1{fill:#faf8f5}.rd-roadmap-svg .rd-phase-title.p2,.rd-roadmap-svg .rd-phase-title.p3{fill:#17191d}' +
      '.rd-roadmap-svg .rd-phase-title.dot{fill:#d8d3cd}' +
      '.rd-roadmap-svg .rd-chart-track{stroke:#9b9d9b;stroke-width:1.3;stroke-dasharray:4 5}' +
      '.rd-roadmap-svg .rd-diamond-number{font-size:11px;font-weight:700}' +
      '.rd-roadmap-svg .rd-chart-label{fill:#a9aaa8;font-size:13px}' +
      '.rd-roadmap-svg .rd-chart-label.is-bold{font-weight:600}' +
      '.rd-roadmap-svg .rd-chart-element:hover{filter:brightness(1.2)}' +
      '.rd-roadmap-svg .rd-chart-dependency{pointer-events:none}' +
      '.rd-roadmap-svg .rd-chart-dependency path{fill:none;stroke:#a1afd1;stroke-width:2;opacity:.8}' +
      '.rd-roadmap-svg .rd-chart-dependency circle{fill:#a1afd1}' +
      '.rd-roadmap-svg .rd-chart-dependency text{fill:#a1afd1;font-size:13px;font-style:italic}' +
      '@media(prefers-reduced-motion:reduce){.rd-roadmap-svg .rd-chart-band,.rd-roadmap-svg .rd-selection-rail{transition:none}}' +
      '</style>';
  }

  function milestoneTip(item, row) {
    const label = (row.items || []).find(other => other.t === 'lab' && other.d === item.d && !/^Gelb/.test(other.text));
    return (label ? label.text + ' · ' : '') +
      (item.t === 'dia' ? KIND[item.kind] : item.dir === 'start' ? 'Start' : 'Ende') +
      ' · ' + date(item.d) + (item.planned ? ' (erwartet)' : '');
  }

  function rowItems(row, index) {
    const center = rowCenter(index);
    const items = row.items || [];
    let result = '';
    items.forEach(item => {
      if (item.t === 'bar') {
        const from = position(item.s), to = position(item.e), y = rowTop(index) + 33;
        const height = 26, tip = Math.min(11, (to - from) / 3);
        result += '<g class="rd-chart-element"><title>' +
          escape((item.text ? item.text + ' · ' : '') + date(item.s) + ' bis ' + date(item.e) +
          (item.style === 'dot' ? ' (erwartet, nach Gate)' : '')) + '</title>' +
          '<path d="M' + from + ' ' + y + 'H' + (to - tip) + 'L' + to + ' ' + (y + height / 2) +
          'L' + (to - tip) + ' ' + (y + height) + 'H' + from + 'Z" class="rd-phase ' + escape(item.style) + '"/>' +
          (item.text ? '<text x="' + ((from + to - tip) / 2 + 1) + '" y="' + (y + 18) +
          '" text-anchor="middle" class="rd-phase-title ' + escape(item.style) + '"' +
          (item.fs ? ' style="font-size:' + Math.min(item.fs * 1.2, 18) + 'px"' : '') + '>' + escape(item.text) + '</text>' : '') + '</g>';
      } else if (item.t === 'track') {
        result += '<line x1="' + position(item.s) + '" x2="' + position(item.e) + '" y1="' + center +
          '" y2="' + center + '" class="rd-chart-track"/>';
      }
    });
    items.forEach(item => {
      if (item.t === 'dia') {
        const color = COLORS[item.kind], x = position(item.d) + (item.dx || 0) * CHART.scale, size = 10;
        result += '<g class="rd-chart-element"><title>' + escape(milestoneTip(item, row)) + '</title><path d="M' +
          x + ' ' + (center - size) + 'L' + (x + size) + ' ' + center + 'L' + x + ' ' + (center + size) +
          'L' + (x - size) + ' ' + center + 'Z" fill="' + (item.planned ? COLORS.background : color) +
          '" stroke="' + (item.planned ? color : COLORS.background) + '" stroke-width="' +
          (item.planned ? 1.7 : 1) + '"' + (item.planned ? ' stroke-dasharray="3 2"' : '') + '/>' +
          (item.num ? '<text x="' + x + '" y="' + (center + 4) + '" text-anchor="middle" class="rd-diamond-number" style="fill:' +
          (item.planned ? color : COLORS.background) + '">' + escape(item.num) + '</text>' : '') + '</g>';
      } else if (item.t === 'tri') {
        const color = item.dir === 'start' ? COLORS.start : COLORS.end;
        const x = position(item.d) + (item.dx || 0) * CHART.scale, width = 9, height = 11;
        const path = item.dir === 'start'
          ? 'M' + (x - width) + ' ' + (center - height) + 'L' + (x + width) + ' ' + center + 'L' + (x - width) + ' ' + (center + height) + 'Z'
          : 'M' + (x + width) + ' ' + (center - height) + 'L' + (x - width) + ' ' + center + 'L' + (x + width) + ' ' + (center + height) + 'Z';
        result += '<g class="rd-chart-element"><title>' + escape(milestoneTip(item, row)) + '</title><path d="' + path +
          '" fill="' + (item.planned ? COLORS.background : color) + '" stroke="' + color + '" stroke-width="' +
          (item.planned ? 1.7 : 1) + '"' + (item.planned ? ' stroke-dasharray="3 2"' : '') + '/></g>';
      } else if (item.t === 'lab') {
        const x = item.x !== undefined ? sourcePosition(item.x) : position(item.d) + (item.dx || 0) * CHART.scale;
        const anchor = item.align === 'l' ? 'start' : item.align === 'r' ? 'end' : 'middle';
        const adjustedX = item.align === 'l' ? x - 9 : item.align === 'r' ? x + 9 : x;
        const y = item.pos === 'above' ? rowTop(index) + 22 : rowTop(index) + 78;
        const color = item.color ? (HEX[item.color] || '#' + item.color) : '';
        result += '<text x="' + adjustedX + '" y="' + y + '" text-anchor="' + anchor +
          '" class="rd-chart-label' + (item.bold ? ' is-bold' : '') + '"' +
          (color ? ' style="fill:' + color + (item.fs ? ';font-size:' + Math.min(item.fs * 1.15, 14) + 'px' : '') + '"' :
            item.fs ? ' style="font-size:' + Math.min(item.fs * 1.15, 14) + 'px"' : '') + '>' + escape(item.text) + '</text>';
      }
    });
    return result;
  }

  function chart(data, scope) {
    const bottom = rowTop(data.rows.length);
    const years = [
      ['2026', '2026-10-01', '2027-01-01'], ['2027', '2027-01-01', '2028-01-01'],
      ['2028', '2028-01-01', '2029-01-01'], ['2029', '2029-01-01', '2030-01-01'],
      ['2030', '2030-01-01', '2031-01-01'], ['2031', '2031-01-01', '2032-01-01']
    ];
    const quarters = [['Q4', '2026-10-01', '2027-01-01']];
    ['2027', '2028'].forEach(year => ['01', '04', '07', '10'].forEach((month, index) => {
      quarters.push(['Q' + (index + 1), year + '-' + month + '-01',
        index < 3 ? year + '-' + ['04', '07', '10'][index] + '-01' : (Number(year) + 1) + '-01-01']);
    }));
    let markup = chartStyle() + '<text x="18" y="30" class="rd-chart-axis">TEILPROJEKT / STATUS</text>';
    years.forEach(([label, from, to]) => {
      const start = position(from), end = position(to);
      markup += '<rect x="' + start + '" y="0" width="' + (end - start - 2) + '" height="31" rx="3" class="rd-chart-year-bg"/>' +
        '<text x="' + (label === '2026' ? start + 10 : (start + end) / 2) + '" y="22" text-anchor="' +
        (label === '2026' ? 'start' : 'middle') + '" class="rd-chart-year">' + label + '</text>';
    });
    quarters.forEach(([label, from, to], index) => {
      markup += '<text x="' + (index ? (position(from) + position(to)) / 2 : position(from) + 10) +
        '" y="51" text-anchor="' + (index ? 'middle' : 'start') + '" class="rd-chart-quarter">' + label + '</text>';
    });
    markup += '<text x="' + ((position('2029-01-01') + CHART.width) / 2) +
      '" y="51" text-anchor="middle" class="rd-chart-quarter">JAHRESRASTER</text>';
    quarters.slice(1).forEach(([label, from]) => {
      markup += '<line x1="' + position(from) + '" x2="' + position(from) + '" y1="60" y2="' +
        bottom + '" class="' + (label === 'Q1' ? 'rd-grid-year' : 'rd-grid-quarter') + '"/>';
    });
    ['2030-01-01', '2031-01-01'].forEach(from => {
      markup += '<line x1="' + position(from) + '" x2="' + position(from) + '" y1="60" y2="' + bottom + '" class="rd-grid-year"/>';
    });
    markup += '<line x1="' + position('2029-01-01') + '" x2="' + position('2029-01-01') +
      '" y1="60" y2="' + bottom + '" class="rd-grid-divider"/>';
    data.rows.forEach((row, index) => {
      const y = rowTop(index), lines = labelLines(row.name);
      markup += '<g class="rd-chart-row' + (state.selected === index ? ' is-selected' : '') +
        '" data-rd-row="' + index + '" tabindex="0" role="button" aria-pressed="' + (state.selected === index) +
        '" aria-controls="rd-detail-' + scope + '" aria-label="' + escape(row.name) + ': Details zeigen">' +
        '<rect x="0" y="' + y + '" width="' + CHART.width + '" height="' + CHART.rowHeight + '" rx="3" class="rd-chart-band"/>' +
        '<rect x="0" y="' + (y + 10) + '" width="3" height="' + (CHART.rowHeight - 20) + '" rx="1.5" class="rd-selection-rail"/>' +
        '<text x="18" y="' + (y + 51) + '" class="rd-chart-index">' + String(index).padStart(2, '0') + '</text>' +
        '<circle cx="54" cy="' + (y + 46) + '" r="5" fill="' + (STATUS[row.st] || STATUS.y).color + '"><title>Status: ' +
        (STATUS[row.st] || STATUS.y).label + '</title></circle><text x="72" y="' +
        (y + (lines.length > 1 ? 40 : 52)) + '" class="rd-chart-name">' +
        lines.map((line, lineIndex) => '<tspan x="72" dy="' + (lineIndex ? 20 : 0) + '">' + escape(line) + '</tspan>').join('') +
        '</text>' + rowItems(row, index) + '</g>';
    });
    const today = new Date().toISOString().slice(0, 10);
    if (today >= '2026-10-01' && today < '2032-01-01') {
      const x = position(today);
      markup += '<g pointer-events="none"><line x1="' + x + '" x2="' + x + '" y1="30" y2="' + (bottom + 4) +
        '" class="rd-today"/><text x="' + x + '" y="' + (bottom + 22) + '" text-anchor="middle" class="rd-chart-quarter">HEUTE</text></g>';
    }
    (data.links || []).forEach(link => {
      const fromX = position(link.from.d), fromY = rowCenter(link.from.row);
      const toX = position(link.to.d), toY = rowCenter(link.to.row);
      markup += '<g class="rd-chart-dependency"><path d="M' + fromX + ' ' + fromY + 'V' + toY + 'H' + toX +
        '"/><circle cx="' + fromX + '" cy="' + fromY + '" r="4"/><circle cx="' + toX + '" cy="' + toY + '" r="4"/>' +
        (link.text ? '<text x="' + sourcePosition(link.textX) + '" y="' + (rowTop(link.textRow) + 22) + '">' +
        escape(link.text) + '</text>' : '') + '</g>';
    });
    return '<svg class="rd-roadmap-svg" viewBox="0 0 ' + CHART.width + ' ' + (bottom + 32) +
      '" role="group" aria-label="Interaktive Roadmap, ' + escape(data.short) + ', Oktober 2026 bis Dezember 2031" ' +
      'data-rd-chart="' + scope + '" style="display:block;width:100%;min-width:1200px;height:auto">' + markup + '</svg>';
  }

  function legend() {
    const diamond = color => '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 1 13 7 7 13 1 7Z" fill="' + color + '"/></svg>';
    return '<div class="rd-legend" aria-label="Legende der Roadmap">' +
      '<span>' + diamond(COLORS.gate) + 'Gate / Budgetfreigabe</span>' +
      '<span>' + diamond(COLORS.qg) + 'Genehmigung · Vertrag · Abnahme</span>' +
      '<span>' + diamond(COLORS.ms) + 'Kunden-Meilenstein</span>' +
      '<span><svg width="29" height="12" viewBox="0 0 29 12" aria-hidden="true"><path d="M2 6h25" stroke="' +
      COLORS.link + '" stroke-width="2"/><circle cx="2" cy="6" r="2" fill="' + COLORS.link +
      '"/><circle cx="27" cy="6" r="2" fill="' + COLORS.link + '"/></svg>Fachübergreifende Abhängigkeit</span>' +
      '<span><svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true"><path d="M1 1h18l6 6-6 6H1Z" fill="none" stroke="#a8a19a" stroke-dasharray="3 2"/></svg>Erwartet, nach Gate-Entscheid</span>' +
      '<span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 1 13 7 2 13Z" fill="' +
      COLORS.start + '"/></svg>Projektstart</span><span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M12 1 1 7 12 13Z" fill="' +
      COLORS.end + '"/></svg>Projektende</span>' +
      '<span><svg width="36" height="14" viewBox="0 0 36 14" aria-hidden="true"><path d="M1 2h9v10H1Z" fill="#515459"/><path d="M13 2h9v10h-9Z" fill="#a6a49f"/><path d="M25 2h9v10h-9Z" fill="#e8e1d6"/></svg>Phase · Budgetstufe 1 frei</span>' +
      '<span>' + status('g') + status('y') + status('r') + '</span></div>';
  }

  function schedule(row) {
    const items = (row.items || []).filter(item => ['bar', 'tri', 'dia'].includes(item.t));
    return '<details class="rd-accordion rd-schedule"><summary><span>Alle Zeiträume und Termine</span>' +
      '<span class="rd-accordion-meta">' + items.length + ' Einträge</span><span class="rd-plus" aria-hidden="true">+</span></summary>' +
      '<ol class="rd-schedule-list">' + items.map(item => '<li>' +
        (item.t === 'bar'
          ? '<span>' + escape(item.text || 'Projektphase') + (item.style === 'dot' ? ' · erwartet, nach Gate' : '') +
            '</span><span class="rd-schedule-date"><time datetime="' + item.s + '">' + date(item.s) +
            '</time> – <time datetime="' + item.e + '">' + date(item.e) + '</time></span>'
          : '<span>' + escape(milestoneTip(item, row)) + '</span>') + '</li>').join('') +
      '</ol></details>';
  }

  function detail(data, meta, scope) {
    const index = Math.min(Math.max(state.selected, 0), data.rows.length - 1);
    const row = data.rows[index];
    const tableRow = data.t2[index];
    const warning = (row.items || []).find(item => item.t === 'lab' && /^Gelb/.test(item.text));
    const milestones = (row.items || []).filter(item => item.t === 'dia').map(item => {
      const label = (row.items || []).find(other => other.t === 'lab' && other.d === item.d && !/^Gelb/.test(other.text));
      return { item: item, label: label ? label.text : KIND[item.kind] };
    });
    let content;
    if (index === 0) {
      content = '<div><p class="rd-eyebrow">Gesamtprojekt</p><h3 id="rd-detail-title-' + scope + '">' +
        escape(data.titles.rm) + '</h3><p class="rd-detail-lead">' + escape(meta.critical) + '</p></div>' +
        '<div><p class="rd-kicker">Die fünf Entscheidungen</p><ol class="rd-milestones">' +
        meta.gates.map(gate => '<li><span class="rd-milestone-symbol" style="--milestone-color:' + COLORS.gate +
          '" aria-hidden="true"></span><div><span class="rd-milestone-date">' + escape(gate.id) + ' · ' +
          escape(gate.date) + '</span><h4>' + escape(gate.title) + '</h4><p>' + escape(gate.description) + '</p></div></li>').join('') +
        '</ol></div>';
    } else {
      const project = data.t1[index - 1];
      content = '<div><div class="rd-detail-caption"><p class="rd-eyebrow">Teilprojekt ' + String(index).padStart(2, '0') +
        '</p>' + status(tableRow.st) + '</div><h3 id="rd-detail-title-' + scope + '">' + escape(project.name) + '</h3>' +
        (warning ? '<p class="rd-detail-warning">' + escape(warning.text) + '</p>' : '') +
        '<dl class="rd-detail-facts"><div><dt>Inhalt</dt><dd>' + escape(project.inhalt) + '</dd></div>' +
        '<div><dt>Ziel</dt><dd>' + escape(project.ziel) + '</dd></div><div><dt>Projektleitung</dt><dd>' +
        escape(tableRow.pl) + '</dd></div><div><dt>Partner</dt><dd>' + escape(tableRow.col) +
        '</dd></div><div><dt>Budget</dt><dd>' + escape(tableRow.bud) + ' T. USD' +
        (tableRow.pot !== '–' ? ' · Potential ' + escape(tableRow.pot) + ' Mio USD' : '') + '</dd></div></dl></div>' +
        '<div><p class="rd-kicker">Meilensteine</p><ol class="rd-milestones">' +
        (milestones.map(({ item, label }) => '<li><span class="rd-milestone-symbol' + (item.planned ? ' is-planned' : '') +
          '" style="--milestone-color:' + COLORS[item.kind] + '" aria-hidden="true"></span><div><span class="rd-milestone-date">' +
          date(item.d) + (item.planned ? ' · erwartet' : '') + '</span><h4>' + escape(label) + '</h4><p>' +
          escape(KIND[item.kind]) + '</p></div></li>').join('') || '<li><p>Keine Meilensteine in dieser Zeile.</p></li>') + '</ol></div>';
    }
    return '<div class="rd-detail-grid">' + content + '</div>' + schedule(row);
  }

  function tools(expanded) {
    return '<div class="rd-timeline-tools" role="group" aria-label="Roadmap-Ansicht">' +
      '<button type="button" class="rd-tool-button" data-rd-zoom="out" aria-label="Roadmap verkleinern" disabled>−</button>' +
      '<button type="button" class="rd-tool-button rd-zoom-reset" data-rd-zoom="reset" aria-label="Zoom auf 100 Prozent zurücksetzen"><span data-rd-zoom-label>100 %</span></button>' +
      '<button type="button" class="rd-tool-button" data-rd-zoom="in" aria-label="Roadmap vergrößern">+</button>' +
      (expanded ? '' : '<button type="button" class="rd-tool-button rd-expand-button" data-rd-expand aria-label="Roadmap in Großansicht öffnen" aria-haspopup="dialog" aria-expanded="false" aria-controls="rd-roadmap-dialog">' +
        expandIcon + '<span>Großansicht</span></button>') + '</div>';
  }

  function viewport(data, scope) {
    return '<div class="rd-timeline-scroll" data-rd-viewport tabindex="0" role="region" aria-label="Roadmap ' +
      escape(data.short) + '; zum Verschieben Pfeiltasten links und rechts verwenden">' + chart(data, scope) + '</div>';
  }

  function timeline(data, meta) {
    return '<section class="rd-section rd-timeline-section" id="timeline" aria-labelledby="rd-timeline-title"><div class="rd-wrap">' +
      sectionHead('05 / Roadmap', '<span id="rd-timeline-title">Eine Roadmap.<br>Das ganze Bild.</span>', data.titles.rm) +
      '<div class="rd-timeline-shell" data-reveal><div class="rd-timeline-toolbar"><div><p class="rd-kicker">2026 — 2031</p><p class="rd-timeline-variant">' +
      escape(data.short) + '</p></div>' + tools(false) + '</div>' + viewport(data, 'inline') +
      '<p class="rd-timeline-hint">Eine Zeile wählen, um den Plan zu vertiefen. Vergrößern für einzelne Termine. Bis Ende 2028 Quartalsraster, danach Jahresraster.</p>' +
      legend() + '</div><div class="rd-detail" id="rd-detail-inline" data-rd-detail="inline" role="region" aria-labelledby="rd-detail-title-inline">' +
      detail(data, meta, 'inline') + '</div><span class="rd-sr-only" data-rd-announcement aria-live="polite" aria-atomic="true"></span>' +
      '<dialog class="rd-roadmap-dialog" id="rd-roadmap-dialog" aria-labelledby="rd-dialog-title"><div class="rd-dialog-top"><div><p class="rd-eyebrow">Mission Roadmap</p>' +
      '<h2 id="rd-dialog-title">' + escape(data.short) + '</h2></div><button type="button" class="rd-tool-button rd-dialog-close" data-rd-close aria-label="Großansicht schließen">' +
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="rd-dialog-body"><div class="rd-timeline-toolbar"><p class="rd-kicker">Oktober 2026 — Dezember 2031</p>' + tools(true) +
      '</div>' + viewport(data, 'dialog') + legend() + '<div class="rd-detail" id="rd-detail-dialog" data-rd-detail="dialog" role="region" aria-labelledby="rd-detail-title-dialog">' +
      detail(data, meta, 'dialog') + '</div><span class="rd-sr-only" data-rd-announcement aria-live="polite" aria-atomic="true"></span></div></dialog>' +
      '</div></section>';
  }

  function sources(data) {
    return '<section class="rd-section rd-sources-section" id="sources" aria-labelledby="rd-sources-title"><div class="rd-wrap">' +
      sectionHead('06 / Transparenz', '<span id="rd-sources-title">Nachvollziehbar.<br>Bis zur Quelle.</span>', data.titles.src) +
      '<div class="rd-sources-layout"><div class="rd-source-disclosures"><details class="rd-accordion" data-reveal><summary>' +
      '<span>Recherche zur Durchführung</span><span class="rd-accordion-meta">' + data.sources.length +
      ' Belege</span><span class="rd-plus" aria-hidden="true">+</span></summary><ol class="rd-sources-list">' +
      data.sources.map(source => '<li><p>' + escape(source.fact) + '</p><div class="rd-source-links">' +
        source.links.map(link => link.url
          ? '<a href="' + escape(link.url) + '" target="_blank" rel="noopener noreferrer">' + escape(link.by) +
            '<span aria-hidden="true"> ↗</span><span class="rd-sr-only"> (neuer Tab)</span></a>'
          : '<span class="rd-source-note">' + escape(link.by) + '</span>').join('') + '</div></li>').join('') +
      '</ol></details><details class="rd-accordion" data-reveal><summary><span>Annahmen und Abgleich</span><span class="rd-accordion-meta">' +
      data.assumptions.length + ' Hinweise</span><span class="rd-plus" aria-hidden="true">+</span></summary><ul class="rd-assumptions">' +
      data.assumptions.map(assumption => '<li>' + escape(assumption) + '</li>').join('') +
      '</ul></details></div><div class="rd-download-area" data-reveal><p class="rd-kicker">Zum Weiterdenken.</p><h3>Die Vision.<br>Zum Mitnehmen.</h3>' +
      '<div class="rd-downloads">' + ['A', 'B'].map(variant =>
        '<a class="rd-download' + (variant === state.variant ? ' is-current' : '') + '" href="../praesentation/' +
        encodeURI(window.ROCKET_DATA[variant].file) + '" download><span class="rd-download-icon">' + downloadIcon +
        '</span><span><small>Variante ' + variant + ' · PowerPoint</small><strong>' +
        escape(window.ROCKET_META[variant].name) + '</strong></span><span class="rd-download-arrow" aria-hidden="true">↗</span></a>'
      ).join('') + '</div><p class="rd-note">Je sechs Folien im Design der Gruppenpräsentation, mit Sprechernotizen.</p></div></div></div></section>';
  }

  function restoreBody() {
    if (state.bodyOverflow !== null) {
      document.body.style.overflow = state.bodyOverflow;
      state.bodyOverflow = null;
    }
  }

  function destroy() {
    if (state.abort) state.abort.abort();
    state.abort = null;
    if (state.dialog && state.dialog.open) {
      if (typeof state.dialog.close === 'function') state.dialog.close();
      else state.dialog.removeAttribute('open');
    }
    state.dialog = null;
    state.focusReturn = null;
    restoreBody();
  }

  function render(variant) {
    destroy();
    const next = window.ROCKET_DATA[variant] ? variant : 'A';
    if (next !== state.variant) state.selected = 0;
    state.variant = next;
    state.zoom = 1;
    const data = currentData(), meta = currentMeta();
    return projects(data) + budget(data, meta) + timeline(data, meta) + sources(data);
  }

  function mount() {
    destroy();
    const timelineRoot = document.getElementById('timeline');
    if (!timelineRoot) return;
    state.abort = new AbortController();
    const signal = state.abort.signal;
    const dialog = document.getElementById('rd-roadmap-dialog');
    state.dialog = dialog;

    function syncZoom() {
      timelineRoot.querySelectorAll('[data-rd-chart]').forEach(svg => {
        svg.style.width = (state.zoom * 100) + '%';
        svg.style.minWidth = (1200 * state.zoom) + 'px';
      });
      timelineRoot.querySelectorAll('[data-rd-zoom-label]').forEach(label => {
        label.textContent = Math.round(state.zoom * 100) + ' %';
      });
      timelineRoot.querySelectorAll('[data-rd-zoom="out"]').forEach(button => { button.disabled = state.zoom <= 1; });
      timelineRoot.querySelectorAll('[data-rd-zoom="in"]').forEach(button => { button.disabled = state.zoom >= 2.5; });
    }

    function zoom(action) {
      const positions = Array.from(timelineRoot.querySelectorAll('[data-rd-viewport]')).map(view => ({
        view: view, center: view.scrollWidth ? (view.scrollLeft + view.clientWidth / 2) / view.scrollWidth : .5
      }));
      state.zoom = action === 'reset' ? 1 : Math.min(2.5, Math.max(1, state.zoom + (action === 'in' ? .25 : -.25)));
      syncZoom();
      positions.forEach(({ view, center }) => {
        view.scrollLeft = action === 'reset' ? 0 : center * view.scrollWidth - view.clientWidth / 2;
      });
    }

    function select(index) {
      const data = currentData(), meta = currentMeta();
      if (!Number.isInteger(index) || index < 0 || index >= data.rows.length) return;
      state.selected = index;
      timelineRoot.querySelectorAll('[data-rd-row]').forEach(row => {
        const selected = Number(row.dataset.rdRow) === index;
        row.classList.toggle('is-selected', selected);
        row.setAttribute('aria-pressed', String(selected));
      });
      timelineRoot.querySelectorAll('[data-rd-detail]').forEach(panel => {
        panel.innerHTML = detail(data, meta, panel.dataset.rdDetail);
        if (!reducedMotion() && typeof panel.animate === 'function') {
          panel.animate([{ opacity: .3, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 300, easing: 'cubic-bezier(.2,.7,.2,1)' });
        }
      });
      timelineRoot.querySelectorAll('[data-rd-announcement]').forEach(output => {
        output.textContent = 'Details: ' + data.rows[index].name;
      });
    }

    function closeDialog() {
      if (!dialog || !dialog.open) return;
      if (typeof dialog.close === 'function') dialog.close();
      else {
        dialog.removeAttribute('open');
        restoreBody();
        const trigger = timelineRoot.querySelector('[data-rd-expand]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (state.focusReturn) state.focusReturn.focus();
      }
    }

    timelineRoot.addEventListener('click', event => {
      const target = event.target.closest('[data-rd-row],[data-rd-zoom],[data-rd-expand],[data-rd-close]');
      if (!target || !timelineRoot.contains(target)) return;
      if (target.hasAttribute('data-rd-row')) select(Number(target.dataset.rdRow));
      else if (target.hasAttribute('data-rd-zoom')) zoom(target.dataset.rdZoom);
      else if (target.hasAttribute('data-rd-close')) closeDialog();
      else if (target.hasAttribute('data-rd-expand') && dialog && !dialog.open) {
        state.focusReturn = target;
        state.bodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
        target.setAttribute('aria-expanded', 'true');
        const closer = dialog.querySelector('[data-rd-close]');
        if (closer) closer.focus();
      }
    }, { signal: signal });

    timelineRoot.addEventListener('keydown', event => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const row = event.target.closest('g[data-rd-row]');
      if (row && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        select(Number(row.dataset.rdRow));
        return;
      }
      if (row && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        event.preventDefault();
        const all = Array.from(row.closest('svg').querySelectorAll('[data-rd-row]'));
        const next = Math.min(all.length - 1, Math.max(0, Number(row.dataset.rdRow) + (event.key === 'ArrowDown' ? 1 : -1)));
        all[next].focus();
        select(next);
        return;
      }
      if (event.key === 'Escape' && dialog && dialog.open) {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (!event.target.matches('[data-rd-viewport]')) return;
      const view = event.target;
      const delta = Math.max(120, view.clientWidth * .45);
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const left = event.key === 'Home' ? 0 : event.key === 'End' ? view.scrollWidth - view.clientWidth :
          view.scrollLeft + (event.key === 'ArrowRight' ? delta : -delta);
        view.scrollTo({ left: left, behavior: reducedMotion() ? 'auto' : 'smooth' });
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoom('in');
      } else if (event.key === '-') {
        event.preventDefault();
        zoom('out');
      } else if (event.key === '0') {
        event.preventDefault();
        zoom('reset');
      }
    }, { signal: signal });

    if (dialog) {
      dialog.addEventListener('close', () => {
        restoreBody();
        const trigger = timelineRoot.querySelector('[data-rd-expand]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (state.focusReturn && state.focusReturn.isConnected) state.focusReturn.focus();
      }, { signal: signal });
      dialog.addEventListener('click', event => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
      }, { signal: signal });
    }

    ['projects', 'budget'].forEach(id => {
      const root = document.getElementById(id);
      if (!root) return;
      root.addEventListener('click', event => {
        const target = event.target.closest('[data-rd-project]');
        if (!target || !root.contains(target)) return;
        select(Number(target.dataset.rdProject));
        timelineRoot.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      }, { signal: signal });
    });
    ['projects', 'budget', 'timeline', 'sources'].forEach(id => {
      const root = document.getElementById(id);
      if (!root) return;
      root.addEventListener('toggle', event => {
        if (!event.target.open || reducedMotion()) return;
        const content = event.target.querySelector('.rd-project-content,.rd-accordion-content,.rd-sources-list,.rd-assumptions');
        if (content && typeof content.animate === 'function') {
          content.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 360, easing: 'cubic-bezier(.2,.7,.2,1)' });
        }
      }, { signal: signal, capture: true });
    });
    syncZoom();
  }

  window.RocketDetails = Object.freeze({ render: render, mount: mount, destroy: destroy });
}());
