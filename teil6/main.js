(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const read = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(location.search);
  const requestedVariant = params.get('variante') || read('rocketlight:variant');
  let variant = requestedVariant === 'B' ? 'B' : 'A';
  const motionPreference = read('rocketlight:motion');
  let reduced = motionPreference === 'reduced' || (motionPreference !== 'full' && media.matches);
  let revealObserver = null;
  let countObserver = null;
  let raf = 0;
  let needsMeasure = true;
  let activeGate = -1;
  let activeChapter = '';
  let layout = {};
  const hero = $('#vision');
  const flight = $('#path');
  const header = $('#site-header');
  const menuButton = $('.menu-button');
  const mobileNav = $('#mobile-nav');
  const questions = [
    {key:'was', number:'01', title:'Was wir schaffen.'},
    {key:'wer', number:'02', title:'Wer es möglich macht.'},
    {key:'wann', number:'03', title:'Wann es beginnt.'},
    {key:'wie', number:'04', title:'Wie wir es umsetzen.'}
  ];

  function capturePosition() {
    const y = window.scrollY;
    const markers = $$('main section[id], .site-footer');
    let selected = markers[0];
    for (const marker of markers) {
      if (marker.getBoundingClientRect().top <= header.offsetHeight + 30) selected = marker;
    }
    return selected ? {id: selected.id || 'footer', offset: y - (selected.getBoundingClientRect().top + y)} : null;
  }

  function restorePosition(position) {
    if (!position) return;
    const marker = position.id === 'footer' ? $('.site-footer') : document.getElementById(position.id);
    if (marker) window.scrollTo({top:Math.max(0, marker.getBoundingClientRect().top + window.scrollY + position.offset), behavior:'instant'});
  }

  function renderVariant(keepPosition = false) {
    const position = keepPosition ? capturePosition() : null;
    const data = window.ROCKET_DATA[variant];
    const meta = window.ROCKET_META[variant];
    const metrics = [
      {value:meta.budget, label:meta.budgetLabel, count:true},
      {value:meta.revenue, label:'Mio USD Umsatz in fünf Jahren', count:true},
      {value:meta.firstDinner, label:meta.firstDinnerLabel},
      {value:'20', label:'Gäste. Ein außergewöhnlicher Moment.', count:true}
    ];
    $('#metric-strip').innerHTML = metrics.map(metric => `<div class="metric" data-reveal><div class="metric-value" ${metric.count ? `data-count="${escape(metric.value)}"` : ''}>${escape(metric.value)}</div><div class="metric-label">${escape(metric.label)}</div></div>`).join('');
    $('#mission-questions').innerHTML = questions.map(question => `<article class="mission-question" data-reveal><div class="question-top"><span class="question-number">${question.number} / ${escape(question.key.toUpperCase())}</span><span class="question-cross" aria-hidden="true">+</span></div><h3>${question.title}</h3><ul>${data.w4[question.key].map(item => `<li>${escape(item)}</li>`).join('')}</ul></article>`).join('');
    $('#gate-deck').innerHTML = meta.gates.map((gate, i) => `<article class="gate-panel${i === 0 ? ' is-active' : ''}" id="gate-${i}" data-gate-panel="${i}"><div class="gate-kicker"><strong>${escape(gate.id)}</strong><span>${escape(gate.date)}</span></div><h3>${escape(gate.title)}</h3><p>${escape(gate.description)}</p><div class="gate-number">ENTSCHEIDUNG ${String(i + 1).padStart(2,'0')} / 05</div></article>`).join('');
    $('#gate-jumps').innerHTML = meta.gates.map((gate, i) => `<button type="button" data-gate="${i}" aria-pressed="${i === 0}" aria-label="${escape(gate.id)}: ${escape(gate.title)}, ${escape(gate.date)}">${escape(gate.id)}</button>`).join('');
    window.RocketDetails.destroy();
    $('#detail-sections').innerHTML = window.RocketDetails.render(variant);
    window.RocketDetails.mount();
    $('#presentation-link').href = '../praesentation/' + data.file;
    $('#presentation-link').setAttribute('aria-label', `Präsentation für ${meta.short} herunterladen`);
    $('[data-scene-caption]').textContent = variant === 'A' ? 'MOBILER PAVILLON' : 'LOUNGE TITUSVILLE';
    $('[data-concept-label]').textContent = `${variant === 'A' ? 'VARIANTE A / MOBILER PAVILLON' : 'VARIANTE B / LOUNGE TITUSVILLE'}`;
    $$('[data-variant]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.variant === variant)));
    $$('[data-scene]').forEach(image => image.classList.toggle('is-active', image.dataset.scene === variant));
    $$('[data-concept-scene]').forEach(image => {
      const active = image.dataset.conceptScene === variant;
      image.classList.toggle('is-active', active);
      image.setAttribute('aria-hidden', String(!active));
    });
    activeGate = -1;
    installReveals();
    measure();
    restorePosition(position);
    requestFrame();
  }

  function selectVariant(next) {
    if (!window.ROCKET_DATA[next] || next === variant) return;
    variant = next;
    write('rocketlight:variant', variant);
    const url = new URL(location.href);
    if (variant === 'B') url.searchParams.set('variante', 'B');
    else url.searchParams.delete('variante');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
    renderVariant(true);
    $('#variant-announcement').textContent = `${window.ROCKET_META[variant].short} ausgewählt. Alle Planungsinhalte wurden aktualisiert.`;
    if (!reduced && typeof $('#metric-strip').animate === 'function') {
      $('#metric-strip').animate([{opacity:.2,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}], {duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
    }
  }

  function animateNumber(element) {
    const original = element.dataset.count;
    const value = Number(original.replace(/\./g,'').replace(',','.'));
    if (!Number.isFinite(value) || reduced) return;
    const decimals = original.includes(',') ? original.split(',')[1].length : 0;
    const format = new Intl.NumberFormat('de-DE', {minimumFractionDigits:decimals,maximumFractionDigits:decimals});
    const started = performance.now();
    function tick(now) {
      if (!element.isConnected) return;
      if (reduced) { element.textContent = original; return; }
      const progress = clamp((now - started) / 1100);
      element.textContent = format.format(value * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
      else element.textContent = original;
    }
    requestAnimationFrame(tick);
  }

  function installReveals() {
    revealObserver?.disconnect();
    countObserver?.disconnect();
    const elements = $$('[data-reveal]');
    if (reduced || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }, {rootMargin:'0px 0px -5% 0px',threshold:.08});
    elements.forEach((element, i) => {
      element.style.setProperty('--reveal-delay', `${element.classList.contains('metric') ? (i % 4) * 75 : 0}ms`);
      revealObserver.observe(element);
    });
    countObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animateNumber(entry.target);
        countObserver.unobserve(entry.target);
      }
    }, {threshold:.7});
    $$('[data-count]').forEach(element => countObserver.observe(element));
  }

  function measure() {
    const y = window.scrollY;
    const height = window.innerHeight;
    const headerHeight = header.offsetHeight;
    layout = {
      heroStart:hero.getBoundingClientRect().top + y,
      heroRange:Math.max(1, hero.offsetHeight - height),
      flightStart:flight.getBoundingClientRect().top + y - headerHeight,
      flightRange:Math.max(1, flight.offsetHeight - height + headerHeight),
      pinned:!reduced && getComputedStyle($('.flight-stage')).position === 'sticky',
      pageRange:Math.max(1, document.documentElement.scrollHeight - height),
      chapters:$$('[data-nav]').map(link => ({id:link.dataset.nav, top:document.getElementById(link.dataset.nav).getBoundingClientRect().top + y})).sort((a,b)=>a.top-b.top)
    };
    needsMeasure = false;
    activeGate = -1;
  }

  function selectGate(index) {
    if (index === activeGate) return;
    activeGate = index;
    const gate = window.ROCKET_META[variant].gates[index];
    $$('[data-gate-panel]').forEach((panel, i) => {
      panel.classList.toggle('is-active', i === index);
      if (layout.pinned) panel.setAttribute('aria-hidden', String(i !== index));
      else panel.removeAttribute('aria-hidden');
    });
    $$('[data-gate]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    const year = gate.date.slice(-4);
    if ($('#flight-year').textContent !== year) {
      $('#flight-year').textContent = year;
      if (!reduced && typeof $('#flight-year').animate === 'function') $('#flight-year').animate([{opacity:.4,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}], {duration:600,easing:'cubic-bezier(.16,1,.3,1)'});
    }
    $('#flight-date').textContent = gate.date;
  }

  function frame() {
    raf = 0;
    if (document.hidden) return;
    if (needsMeasure) measure();
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    $('#scroll-meter-fill').style.transform = `scaleX(${clamp(y / layout.pageRange)})`;
    const heroProgress = reduced ? 0 : clamp((y - layout.heroStart) / layout.heroRange);
    hero.style.setProperty('--hero-progress', heroProgress.toFixed(4));
    // Faded controls must not remain reachable by pointer or keyboard.
    $('.hero-copy').toggleAttribute('inert', heroProgress >= .5);
    $('.hero-bottom').toggleAttribute('inert', heroProgress >= .5);
    const flightProgress = reduced ? 1 : clamp((y - layout.flightStart) / layout.flightRange);
    flight.style.setProperty('--flight-progress', flightProgress.toFixed(4));
    selectGate(layout.pinned ? Math.min(4, Math.floor(flightProgress * 5)) : 0);
    let current = layout.chapters[0]?.id || 'vision';
    for (const chapter of layout.chapters) if (chapter.top <= y + window.innerHeight * .3) current = chapter.id;
    if (current !== activeChapter) {
      activeChapter = current;
      $$('[data-nav]').forEach(link => {
        if (link.dataset.nav === current) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }
  }

  function requestFrame() { if (!raf) raf = requestAnimationFrame(frame); }
  function requestMeasure() { needsMeasure = true; requestFrame(); }

  function setMotion(next, persist = true) {
    const position = capturePosition();
    reduced = next;
    root.classList.toggle('motion-ready', !reduced);
    root.classList.toggle('reduced-motion', reduced);
    $('#motion-toggle').setAttribute('aria-pressed', String(reduced));
    $('#motion-toggle').innerHTML = `${reduced ? 'Bewegung aktivieren' : 'Bewegung reduzieren'} <span aria-hidden="true">◐</span>`;
    if (persist) write('rocketlight:motion', reduced ? 'reduced' : 'full');
    installReveals();
    measure();
    restorePosition(position);
    requestFrame();
  }

  function closeMenu(returnFocus = false) {
    menuButton.setAttribute('aria-expanded','false');
    mobileNav.hidden = true;
    if (returnFocus) menuButton.focus();
  }

  function moveTo(id, behavior = reduced ? 'instant' : 'smooth') {
    const target = document.getElementById(id);
    if (!target) return;
    target.closest('[data-reveal]')?.classList.add('is-visible');
    const top = id === 'vision' ? 0 : target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 22;
    window.scrollTo({top:Math.max(0,top),behavior});
  }

  document.addEventListener('click', event => {
    const variantButton = event.target.closest('[data-variant]');
    if (variantButton) { selectVariant(variantButton.dataset.variant); return; }
    const gateButton = event.target.closest('[data-gate]');
    if (gateButton) {
      const index = Number(gateButton.dataset.gate);
      if (layout.pinned) {
        const progress = index === 4 ? .94 : (index + .5) / 5;
        window.scrollTo({top:layout.flightStart + progress * layout.flightRange,behavior:reduced ? 'instant' : 'smooth'});
      } else moveTo(`gate-${index}`);
      return;
    }
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = anchor.getAttribute('href').slice(1);
    if (!id || !document.getElementById(id)) return;
    event.preventDefault();
    closeMenu();
    history.pushState(null,'',`#${id}`);
    moveTo(id);
    if (event.detail === 0) {
      const target = document.getElementById(id);
      target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
    }
  });
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded',String(open));
    mobileNav.hidden = !open;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
  });
  document.addEventListener('focusin', event => event.target.closest('[data-reveal]')?.classList.add('is-visible'));
  document.addEventListener('toggle', event => { if (event.target.tagName === 'DETAILS') requestMeasure(); }, true);
  $('#motion-toggle').addEventListener('click', () => setMotion(!reduced));
  media.addEventListener?.('change', event => { if (!read('rocketlight:motion')) setMotion(event.matches,false); });
  window.addEventListener('scroll',requestFrame,{passive:true});
  window.addEventListener('resize',requestMeasure,{passive:true});
  window.addEventListener('hashchange', () => moveTo(location.hash.slice(1)));
  window.addEventListener('popstate', () => moveTo(location.hash.slice(1) || 'vision'));
  window.addEventListener('pageshow',requestMeasure);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestFrame(); });

  renderVariant();
  setMotion(reduced,false);
  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(requestMeasure);
    resizeObserver.observe($('#main'));
  }
  requestAnimationFrame(() => {
    measure();
    if (location.hash) moveTo(location.hash.slice(1),'instant');
    requestFrame();
  });
})();
