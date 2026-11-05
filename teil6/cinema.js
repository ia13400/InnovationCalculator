/* RocketLight — a native-scroll landscape and its source-backed project plan. */
(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const root = document.documentElement;
  const cinema = $('#cinema');
  const stage = $('#cinema-stage');
  const world = $('#cinema-world');
  const landscape = $('#landscape') || stage;
  const sourceImage = $('#scene-image');
  const disclosure = $('#details-disclosure');
  const detailsRoot = $('#details-root');
  const staticStory = $('#story-static');
  const laneList = $('#lane-list');
  const connections = $('#scene-connections');
  const connectionPaths = $('#connection-paths') || connections;
  const sitePin = $('#site-pin');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const abort = new AbortController();
  const signal = abort.signal;
  const PHASES = ['intro', 'scan', 'concept', 'permit', 'build', 'pilot', 'launch', 'horizon'];
  const STARTS = [0, .105, .235, .37, .50, .665, .80, .92];
  const DETAIL_HASHES = new Set(['plan', 'mission', 'mission-details', 'projects', 'budget', 'timeline', 'sources']);
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (start, end, value) => {
    const t = clamp((value - start) / (end - start));
    return t * t * (3 - 2 * t);
  };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const read = key => { try { return localStorage.getItem(key); } catch (_) { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch (_) {} };
  const text = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = value ?? ''; };
  const show = (node, visible) => {
    if (!node) return false;
    const changed = node.classList.contains('is-visible') !== visible;
    node.classList.toggle('is-visible', visible);
    node.toggleAttribute('inert', !visible);
    node.setAttribute('aria-hidden', String(!visible));
    return changed;
  };
  const activate = (selector, active) => $(selector)?.classList.toggle('is-active', active);
  const params = new URLSearchParams(location.search);
  let variant = (params.get('variante') || read('rocketlight:variant')) === 'B' ? 'B' : 'A';
  const motionPreference = read('rocketlight:motion');
  let preferredReduced = motionPreference === 'reduced' || (motionPreference !== 'full' && media.matches);
  let compact = window.innerHeight < 560;
  let reduced = preferredReduced || compact;
  let destroyed = false;
  let raf = 0;
  let dirty = true;
  let needsMeasure = true;
  let inView = true;
  let progress = 0;
  let activePhase = -1;
  let ambientTime = 0;
  let lastAmbient = 0;
  let lastFrameTime = 0;
  let lastConnectionDraw = 0;
  let connectionRefreshPending = false;
  let connectionRefreshUntil = 0;
  let layout = { start: 0, range: 1, stageWidth: 1, stageHeight: 1, worldWidth: 1, landscapeWidth: 1, siteRatio: .405, originRatio: .405, portrait: false };
  let rowRanges = [];
  let variantAnimations = [];
  let resizeObserver;
  let visibilityObserver;
  const header = $('#site-header') || $('header');
  const water = $('#water-canvas');
  const stars = $('#stars-canvas');
  const context2D = canvas => { try { return canvas?.getContext('2d', { alpha: true, desynchronized: true }) || null; } catch (_) { return null; } };
  const waterContext = context2D(water);
  const starsContext = context2D(stars);
  const starField = Array.from({ length: 42 }, (_, index) => ({
    x: ((index * 137.508 + 23) % 997) / 997,
    y: .04 + ((index * 71.37 + 19) % 521) / 521 * .43,
    radius: .45 + (index % 4) * .17,
    phase: index * 2.39996,
    speed: .19 + (index % 5) * .037
  }));

  if (!cinema || !stage || !world || !disclosure || !detailsRoot || !staticStory || !laneList ||
      !window.ROCKET_DATA || !window.ROCKET_STORY?.A?.phases || !window.ROCKET_STORY?.B?.phases || !window.RocketDetails) {
    console.error('RocketLight: the cinematic page or its planning data is incomplete.');
    return;
  }

  const story = () => window.ROCKET_STORY[variant];
  const data = () => window.ROCKET_DATA[variant];
  const phaseIndex = value => {
    let index = 0;
    for (let i = 1; i < STARTS.length; i++) if (value >= STARTS[i]) index = i;
    return index;
  };
  const phaseProgress = (value, index) => clamp((value - STARTS[index]) / ((STARTS[index + 1] ?? 1) - STARTS[index]));
  const headerHeight = () => header?.offsetHeight || 0;
  const documentTop = node => node.getBoundingClientRect().top + window.scrollY;
  const scrollToNode = (node, focus = false, behavior = reduced || focus ? 'instant' : 'smooth') => {
    if (!node) return;
    window.scrollTo({ top: Math.max(0, documentTop(node) - headerHeight() - 18), behavior });
    if (focus) { node.setAttribute('tabindex', '-1'); node.focus({ preventScroll: true }); }
  };

  function currentPosition() {
    if (!reduced && window.scrollY <= layout.start + layout.range + 2) return { cinema: true, progress };
    const nodes = reduced
      ? $$('#story-static article[id], #plan, #mission-details, #details-root section[id]')
      : $$('#plan, #mission-details, #details-root section[id]');
    let selected = nodes[0];
    for (const node of nodes) if (node.getBoundingClientRect().top <= headerHeight() + 30) selected = node;
    return selected ? { id: selected.id, offset: window.scrollY - documentTop(selected) } : { cinema: true, progress };
  }

  function restorePosition(position) {
    if (!position) return;
    if (position.cinema) {
      if (reduced) scrollToNode(document.getElementById('chapter-' + PHASES[phaseIndex(position.progress)]), false, 'instant');
      else window.scrollTo({ top: layout.start + position.progress * layout.range, behavior: 'instant' });
    } else {
      const node = document.getElementById(position.id);
      if (node) window.scrollTo({ top: Math.max(0, documentTop(node) + position.offset), behavior: 'instant' });
    }
  }

  function laneMarkup(id, phase, compact = false) {
    const row = data().rows[id];
    if (!row) return '';
    return `<button type="button" class="cinema-lane${compact ? ' is-static' : ''}" data-lane-id="${id}" data-status="${escape(row.st)}" aria-label="Details zu ${escape(row.name)}">` +
      `<span class="lane-heading"><span class="lane-dot" aria-hidden="true"></span><span class="lane-name">${escape(row.name)}</span></span>` +
      `<span class="lane-note">${escape(phase.laneNotes?.[id] || '')}</span>` +
      '<span class="lane-progress-track" aria-hidden="true"><span class="lane-progress-fill"></span></span></button>';
  }

  function renderPlan() {
    const mission = $('#mission-details');
    if (mission) {
      const questions = [['was', 'Was wir schaffen.'], ['wer', 'Wer es möglich macht.'], ['wann', 'Wann es beginnt.'], ['wie', 'Wie wir es umsetzen.']];
      mission.innerHTML = '<header class="rd-section-head"><p class="rd-eyebrow">Der Auftrag</p><h2>Vier Fragen. Ein vollständiger Plan.</h2><p class="rd-lead">' + escape(data().titles.w4) + '</p></header>' +
        '<div class="mission-facts">' + questions.map(([key, title]) =>
          `<article class="mission-fact"><h3>${title}</h3><ul>${(data().w4[key] || []).map(item => `<li>${escape(item)}</li>`).join('')}</ul></article>`
        ).join('') + '</div>';
    }
    detailsRoot.innerHTML = window.RocketDetails.render(variant);
    window.RocketDetails.mount();
    $$('[data-reveal]', detailsRoot).forEach(node => node.classList.add('is-visible'));
    const download = $('#presentation-link');
    if (download) {
      download.href = '../praesentation/' + data().file;
      download.setAttribute('aria-label', `Präsentation für Variante ${variant} herunterladen`);
    }
  }

  function renderStaticStory() {
    staticStory.innerHTML = story().phases.map((phase, index) =>
      `<article class="story-static-chapter" id="chapter-${escape(phase.key)}" data-static-chapter="${index}">` +
      `<p class="story-static-eyebrow">${escape(phase.eyebrow)}</p><h2>${escape(phase.title)}</h2><p>${escape(phase.copy)}</p>` +
      `<p class="story-static-date"><time datetime="${escape(phase.dateISO)}">${escape(phase.date)}</time>${phase.gate ? ` · ${escape(phase.gate)}` : ''} · ${escape(phase.master)}</p>` +
      `<div class="story-static-lanes">${phase.laneIds.map(id => laneMarkup(id, phase, true)).join('')}</div>` +
      (phase.chef.state === 'off' ? '' : `<aside class="story-static-chef"><h3>${escape(phase.chef.title)}</h3><p>${escape(phase.chef.copy)}</p><p>${escape(phase.chef.date)}</p></aside>`) +
      '</article>'
    ).join('');
    staticStory.hidden = !reduced;
  }

  function syncVariantURL() {
    const url = new URL(location.href);
    if (variant === 'B') url.searchParams.set('variante', 'B');
    else url.searchParams.delete('variante');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  function renderVariant(keepPosition = false) {
    const position = keepPosition ? currentPosition() : null;
    rowRanges = data().rows.map(row => {
      const dates = row.items.flatMap(item => [item.d, item.s, item.e])
        .filter(value => /^\d{4}-\d{2}-\d{2}$/.test(value || '')).map(value => Date.parse(value + 'T00:00:00Z'));
      return { start: Math.min(...dates), end: Math.max(...dates) };
    });
    renderPlan();
    renderStaticStory();
    const dots = $('#chapter-dots');
    if (dots) dots.innerHTML = story().phases.map((phase, index) =>
      `<button type="button" class="chapter-dot" data-chapter="${index}" aria-label="${index + 1}. ${escape(phase.title)} – ${escape(phase.date)}" aria-controls="story-caption">` +
      `<span aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></button>`
    ).join('');
    $$('button[data-variant]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.variant === variant)));
    $$('[data-building]').forEach(node => {
      const active = node.dataset.building === variant;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-hidden', String(!active));
    });
    $$('[data-blueprint]').forEach(node => node.classList.toggle('is-active', node.dataset.blueprint === variant));
    cinema.dataset.variant = variant;
    text('site-label', story().location.name);
    activePhase = -1;
    measure();
    restorePosition(position);
    requestFrame();
  }

  function renderPhase(index) {
    if (index === activePhase) return;
    activePhase = index;
    connectionRefreshPending = true;
    const phase = story().phases[index];
    cinema.dataset.phase = phase.key;
    text('story-eyebrow', phase.eyebrow);
    text('story-title', phase.title);
    text('story-copy', phase.copy);
    text('story-date', phase.date);
    text('master-date', phase.date);
    text('master-label', (phase.gate ? phase.gate + ' · ' : '') + phase.master);
    $('#story-date')?.setAttribute('datetime', phase.dateISO);
    laneList.innerHTML = phase.laneIds.map(id => laneMarkup(id, phase)).join('');
    text('chef-title', phase.chef.title);
    text('chef-copy', phase.chef.copy);
    text('chef-date', phase.chef.date);
    const chef = $('#chef-panel');
    if (chef) {
      chef.dataset.chefState = phase.chef.state;
      $$('[data-chef-state]', chef).forEach(node => { node.dataset.chefState = phase.chef.state; });
    }
    $$('[data-chapter]').forEach(button => {
      const active = Number(button.dataset.chapter) === index;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }

  function resizeCanvas(canvas, width) {
    if (!canvas) return;
    const height = Math.round(width * 9 / 16);
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  }

  function measure() {
    const rect = stage.getBoundingClientRect();
    const frame = landscape.getBoundingClientRect();
    const worldRect = world.getBoundingClientRect();
    const pin = sitePin?.getBoundingClientRect();
    const worldWidth = world.clientWidth || worldRect.width || 1;
    const origin = getComputedStyle(world).transformOrigin.split(/\s+/)[0];
    const originRatio = origin.endsWith('%') ? parseFloat(origin) / 100 : parseFloat(origin) / worldWidth;
    layout = {
      start: documentTop(cinema),
      range: Math.max(1, cinema.offsetHeight - stage.offsetHeight),
      stageWidth: stage.clientWidth || rect.width || 1,
      stageHeight: stage.clientHeight || rect.height || 1,
      worldWidth,
      landscapeWidth: frame.width || 1,
      siteRatio: pin && worldRect.width ? clamp((pin.left + pin.width / 2 - worldRect.left) / worldRect.width) : .405,
      originRatio: Number.isFinite(originRatio) ? clamp(originRatio) : .405,
      portrait: frame.height > frame.width || window.innerWidth <= 760
    };
    if (!visibilityObserver) inView = rect.bottom > 0 && rect.top < window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    resizeCanvas(water, Math.round(Math.min(1600, Math.max(320, layout.worldWidth * dpr))));
    resizeCanvas(stars, Math.round(Math.min(1200, Math.max(320, layout.worldWidth * dpr))));
    needsMeasure = false;
  }

  function drawAmbient(time) {
    if (starsContext && stars) {
      const width = stars.width, height = stars.height;
      starsContext.clearRect(0, 0, width, height);
      for (const star of starField) {
        const alpha = .16 + .20 * (.5 + .5 * Math.sin(time * star.speed + star.phase));
        const x = (star.x * width + Math.sin(time * .012 + star.phase) * 1.8 + width) % width;
        starsContext.fillStyle = `rgba(228,232,235,${alpha.toFixed(3)})`;
        starsContext.beginPath();
        starsContext.arc(x, star.y * height, star.radius * Math.min(1.5, width / 1000), 0, Math.PI * 2);
        starsContext.fill();
      }
    }
    if (!waterContext || !water || !sourceImage?.complete || !sourceImage.naturalWidth) return;
    const width = water.width, height = water.height;
    const sourceRatio = sourceImage.naturalWidth / sourceImage.naturalHeight;
    const cropWidth = sourceRatio > 16 / 9 ? sourceImage.naturalHeight * 16 / 9 : sourceImage.naturalWidth;
    const cropHeight = sourceRatio > 16 / 9 ? sourceImage.naturalHeight : sourceImage.naturalWidth * 9 / 16;
    const cropX = (sourceImage.naturalWidth - cropWidth) / 2;
    const cropY = (sourceImage.naturalHeight - cropHeight) / 2;
    const start = Math.floor(height * .575);
    const strip = Math.max(2, Math.round(height / 200));
    waterContext.clearRect(0, 0, width, height);
    for (let y = start; y < height; y += strip) {
      const depth = (y - start) / (height - start);
      const displacement = Math.sin(y * .057 + time * .46) * (.45 + depth * 1.3) + Math.sin(y * .019 - time * .27) * .55;
      const stripHeight = Math.min(strip + 1, height - y);
      waterContext.drawImage(sourceImage, cropX, cropY + y / height * cropHeight,
        cropWidth, stripHeight / height * cropHeight,
        displacement - 2, y, width + 4, stripHeight);
    }
  }

  function clearAmbient() {
    if (waterContext) waterContext.clearRect(0, 0, water.width, water.height);
    if (starsContext) starsContext.clearRect(0, 0, stars.width, stars.height);
  }

  function drawConnections() {
    if (!connections || !connectionPaths || !sitePin) return;
    lastConnectionDraw = lastFrameTime;
    if (reduced || progress <= .09) { connectionPaths.replaceChildren(); return; }
    const stageRect = stage.getBoundingClientRect();
    const pinRect = sitePin.getBoundingClientRect();
    const sx = pinRect.left + pinRect.width / 2 - stageRect.left;
    const sy = pinRect.top + pinRect.height / 2 - stageRect.top;
    const master = $('.master-lane', $('#lane-panel'));
    const targets = [...(master ? [master] : []), ...$$('.cinema-lane', laneList)];
    const chef = $('#chef-panel');
    if (chef?.classList.contains('is-visible')) targets.push(chef);
    connections.setAttribute('viewBox', `0 0 ${layout.stageWidth} ${layout.stageHeight}`);
    while (connectionPaths.children.length > targets.length) connectionPaths.lastElementChild.remove();
    targets.forEach((target, index) => {
      let path = connectionPaths.children[index];
      if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'scene-connector');
        path.setAttribute('fill', 'none');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        connectionPaths.appendChild(path);
      }
      const box = target.getBoundingClientRect();
      const cx = box.left + box.width / 2 - stageRect.left;
      const cy = box.top + box.height / 2 - stageRect.top;
      const vertical = Math.abs(cy - sy) > Math.abs(cx - sx);
      const ex = vertical ? cx : (cx > sx ? box.left : box.right) - stageRect.left;
      const ey = vertical ? (cy > sy ? box.top : box.bottom) - stageRect.top : cy;
      const dx = ex - sx, dy = ey - sy;
      const control = vertical
        ? `${sx},${sy + dy * .48} ${ex},${ey - dy * .48}`
        : `${sx + dx * .45},${sy} ${ex - dx * .35},${ey}`;
      path.setAttribute('d', `M${sx.toFixed(1)},${sy.toFixed(1)} C${control} ${ex.toFixed(1)},${ey.toFixed(1)}`);
      path.setAttribute('data-connection', target === master ? 'master' : target.dataset.laneId || 'chef');
    });
  }

  function updateScene() {
    if (reduced) {
      let index = 0;
      $$('[data-static-chapter]').forEach(node => {
        if (node.getBoundingClientRect().top < window.innerHeight * .40) index = Number(node.dataset.staticChapter);
      });
      progress = STARTS[index];
      renderPhase(index);
    } else {
      progress = clamp((window.scrollY - layout.start) / layout.range);
      renderPhase(phaseIndex(progress));
    }
    const p = reduced ? 0 : progress;
    const phase = story().phases[activePhase];
    const local = phaseProgress(progress, activePhase);
    const zoom = 1 + .14 * smooth(.08, .30, p) - .07 * smooth(.82, .99, p);
    const panBlend = smooth(.055, .24, p);
    const focusRatio = .760 + (layout.siteRatio - .760) * panBlend;
    const centerOffset = layout.worldWidth * (layout.originRatio - .5) * (1 - zoom);
    const coverSlack = Math.max(0, (layout.worldWidth * zoom - layout.landscapeWidth) / 2);
    const targetPan = layout.worldWidth * (.5 - layout.originRatio + (layout.originRatio - focusRatio) * zoom);
    const pan = layout.portrait ? clamp(targetPan, -coverSlack - centerOffset, coverSlack - centerOffset) : 0;
    const scan = smooth(.035, .09, p) * (1 - smooth(.22, .29, p));
    const blueprint = smooth(.20, .245, p) * (1 - smooth(.56, .69, p));
    const building = smooth(.49, .56, p);
    const permit = smooth(.35, .40, p) * (1 - smooth(.48, .54, p));
    const launch = smooth(.80, .89, p);
    const caption = smooth(.04, .075, p);
    const values = {
      '--progress': p, '--phase-progress': local, '--scan-opacity': scan,
      '--scan-angle': `${(p * 1050).toFixed(2)}deg`, '--blueprint-progress': smooth(.21, .40, p),
      '--blueprint-opacity': blueprint, '--building-progress': smooth(.49, .69, p), '--building-opacity': building,
      '--permit-opacity': permit, '--crane-opacity': smooth(.48, .53, p) * (1 - smooth(.64, .70, p)),
      '--camera-zoom': zoom, '--camera-x': `${pan.toFixed(2)}px`, '--caption-opacity': caption,
      '--rocket-opacity': launch, '--rocket-progress': smooth(.80, .98, p),
      '--water-opacity': reduced ? 0 : .42, '--stars-opacity': reduced ? 0 : .7,
      '--connections-opacity': reduced ? 0 : smooth(.09, .13, p)
    };
    for (const [key, value] of Object.entries(values)) cinema.style.setProperty(key, typeof value === 'number' ? value.toFixed(4) : value);
    activate('#scene-scan', scan > .01);
    activate('#building', blueprint > .01 || building > .01);
    activate('#permit-seal', permit > .01);
    activate('#rocket-glow', launch > .01);
    show($('#story-caption'), !reduced && p > .04);
    const laneVisibilityChanged = show($('#lane-panel'), !reduced && p > .09);
    const chefVisibilityChanged = show($('#chef-panel'), !reduced && p > .09 && phase.chef.state !== 'off');
    if (laneVisibilityChanged || chefVisibilityChanged) connectionRefreshPending = true;
    show($('#cinema-finish'), !reduced && phase.key === 'horizon');
    show($('#opening-label'), reduced || p < .065);
    show($('#scroll-cue'), !reduced && p < .045);
    const currentDate = Date.parse(phase.dateISO + 'T00:00:00Z');
    const nextDate = Date.parse((story().phases[activePhase + 1]?.dateISO || phase.dateISO) + 'T00:00:00Z');
    const visualDate = currentDate + (nextDate - currentDate) * local;
    $$('.cinema-lane', laneList).forEach(node => {
      const range = rowRanges[Number(node.dataset.laneId)];
      const fraction = range && range.end > range.start ? clamp((visualDate - range.start) / (range.end - range.start)) : 0;
      $('.lane-progress-fill', node)?.style.setProperty('transform', `scaleX(${fraction.toFixed(4)})`);
    });
    for (const id of ['master-progress', 'story-progress']) {
      const fill = document.getElementById(id);
      if (fill) fill.style.transform = `scaleX(${progress.toFixed(4)})`;
    }
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    drawConnections();
  }

  function frame(timestamp) {
    raf = 0;
    if (destroyed || document.hidden) return;
    lastFrameTime = timestamp;
    if (needsMeasure) { measure(); dirty = true; }
    if (dirty) {
      if (!visibilityObserver) {
        const rect = stage.getBoundingClientRect();
        inView = rect.bottom > 0 && rect.top < window.innerHeight;
      }
      updateScene();
      dirty = false;
    }
    if (connectionRefreshPending) {
      // Includes the chef panel's 120ms delay after its 900ms entrance transition.
      connectionRefreshUntil = !reduced && inView ? timestamp + 1050 : 0;
      connectionRefreshPending = false;
    }
    const trackConnections = !reduced && inView && timestamp < connectionRefreshUntil;
    if (trackConnections && timestamp - lastConnectionDraw >= 1000 / 30) drawConnections();
    const animate = !reduced && inView && Boolean(waterContext || starsContext);
    cinema.classList.toggle('is-running', animate);
    if (animate) {
      if (!lastAmbient || timestamp - lastAmbient >= 1000 / 30) {
        if (lastAmbient) ambientTime += Math.min(100, timestamp - lastAmbient) / 1000;
        lastAmbient = timestamp;
        drawAmbient(ambientTime);
      }
    } else lastAmbient = 0;
    if (animate || trackConnections) raf = requestAnimationFrame(frame);
  }

  function requestFrame(measureAgain = false) {
    dirty = true;
    if (measureAgain) needsMeasure = true;
    if (!destroyed && !document.hidden && !raf) raf = requestAnimationFrame(frame);
  }

  function stopFrame() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastAmbient = 0;
    connectionRefreshUntil = 0;
    cinema.classList.remove('is-running');
  }

  function setMotion(next, persist = true) {
    const position = currentPosition();
    const previousReduced = reduced;
    const previousCompact = compact;
    const previousPhase = activePhase;
    preferredReduced = Boolean(next);
    compact = window.innerHeight < 560;
    reduced = preferredReduced || compact;
    root.classList.toggle('reduced-motion', reduced);
    root.classList.toggle('motion-ready', !reduced);
    cinema.classList.toggle('is-reduced', reduced);
    cinema.classList.toggle('is-compact', compact);
    staticStory.hidden = !reduced;
    const toggle = $('#motion-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(reduced));
      toggle.disabled = compact;
      toggle.textContent = compact ? 'Statische Ansicht' : reduced ? 'Bewegung aktivieren' : 'Bewegung reduzieren';
    }
    if (persist) write('rocketlight:motion', preferredReduced ? 'reduced' : 'full');
    variantAnimations.forEach(animation => animation.cancel());
    variantAnimations = [];
    stopFrame();
    if (reduced) clearAmbient();
    measure();
    if (previousReduced !== reduced || previousCompact !== compact) {
      if (position?.id?.startsWith('chapter-') && !reduced) {
        const index = previousCompact ? Math.max(0, previousPhase) : Math.max(0, PHASES.indexOf(position.id.slice(8)));
        restorePosition({ cinema: true, progress: index === 0 ? 0 : STARTS[index] + .002 });
      } else restorePosition(position);
    }
    requestFrame();
  }

  function closeMenu(returnFocus = false) {
    const menu = $('#mobile-menu'), button = $('#menu-toggle');
    if (menu) menu.hidden = true;
    button?.setAttribute('aria-expanded', 'false');
    if (returnFocus) button?.focus();
  }

  function updateHash(hash) {
    if (location.hash === '#' + hash) return;
    history.pushState(null, '', location.pathname + location.search + '#' + hash);
  }

  function goChapter(index, focus = false, instant = false) {
    index = clamp(index, 0, PHASES.length - 1);
    if (reduced) {
      scrollToNode(document.getElementById('chapter-' + PHASES[index]), focus, 'instant');
    } else {
      if (needsMeasure) measure();
      const value = index === 0 ? 0 : STARTS[index] + .004;
      window.scrollTo({ top: layout.start + value * layout.range, behavior: instant || focus ? 'instant' : 'smooth' });
      if (focus) {
        renderPhase(index);
        const title = $('#story-title');
        show($('#story-caption'), index > 0);
        if (index > 0 && title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
        else $('#chapter-dots [data-chapter="0"]')?.focus();
      }
    }
    requestFrame();
  }

  function openPlan(id = 'plan', focus = false, instant = false) {
    disclosure.open = true;
    const targetId = id === 'mission' ? 'mission-details' : id;
    requestFrame(true);
    scrollToNode(document.getElementById(targetId) || disclosure, focus, instant || reduced || focus ? 'instant' : 'smooth');
  }

  function followHash(hash, focus = false, instant = false) {
    const id = hash.replace(/^#/, '');
    if (DETAIL_HASHES.has(id)) { openPlan(id, focus, instant); return true; }
    if (!id || id === 'cinema' || id === 'vision') { goChapter(0, focus, instant); return true; }
    const key = id === 'path' ? 'scan' : id.replace(/^chapter-/, '');
    const index = PHASES.indexOf(key);
    if (index >= 0) { goChapter(index, focus, instant); return true; }
    return false;
  }

  function selectVariant(next, persist = true) {
    if (!window.ROCKET_STORY[next] || next === variant) return;
    variant = next;
    if (persist) write('rocketlight:variant', variant);
    syncVariantURL();
    renderVariant(true);
    renderPhase(phaseIndex(progress));
    variantAnimations.forEach(animation => animation.cancel());
    variantAnimations = [];
    if (!reduced && inView) {
      for (const node of [$('#story-caption'), $('#lane-panel'), $('#chef-panel')]) {
        if (node?.classList.contains('is-visible') && typeof node.animate === 'function') {
          variantAnimations.push(node.animate(
            [{ opacity: .35, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }
          ));
        }
      }
    }
    text('variant-status', `Variante ${variant} ausgewählt. Szene und vollständiger Projektplan wurden aktualisiert.`);
  }

  document.addEventListener('click', event => {
    const variantButton = event.target.closest('button[data-variant]');
    if (variantButton) { selectVariant(variantButton.dataset.variant); return; }
    const chapter = event.target.closest('[data-chapter]');
    if (chapter) {
      const index = Number(chapter.dataset.chapter);
      updateHash('chapter-' + PHASES[index]);
      goChapter(index, event.detail === 0);
      return;
    }
    const lane = event.target.closest('[data-lane-id]');
    if (lane) {
      updateHash('timeline');
      disclosure.open = true;
      const row = $(`[data-rd-row="${Number(lane.dataset.laneId)}"]`, detailsRoot);
      row?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      openPlan('timeline', event.detail === 0);
      return;
    }
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const hash = anchor.getAttribute('href');
    const id = hash.slice(1);
    if (!DETAIL_HASHES.has(id) && !['cinema', 'vision', 'path'].includes(id) && !PHASES.includes(id.replace(/^chapter-/, ''))) return;
    event.preventDefault();
    closeMenu();
    updateHash(id);
    followHash(hash, event.detail === 0);
  }, { signal });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('#mobile-menu')?.hidden) { closeMenu(true); return; }
    const chapter = event.target.closest('[data-chapter]');
    if (!chapter || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const old = Number(chapter.dataset.chapter);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 7 : clamp(old + (event.key === 'ArrowRight' ? 1 : -1), 0, 7);
    updateHash('chapter-' + PHASES[next]);
    goChapter(next, false, true);
    $(`#chapter-dots [data-chapter="${next}"]`)?.focus();
  }, { signal });
  $('#motion-toggle')?.addEventListener('click', () => { if (!compact) setMotion(!preferredReduced); }, { signal });
  $('#menu-toggle')?.addEventListener('click', () => {
    const menu = $('#mobile-menu'), button = $('#menu-toggle');
    if (!menu) return;
    menu.hidden = !menu.hidden;
    button.setAttribute('aria-expanded', String(!menu.hidden));
  }, { signal });
  disclosure.addEventListener('toggle', () => requestFrame(true), { signal });
  window.addEventListener('scroll', () => requestFrame(), { passive: true, signal });
  window.addEventListener('resize', () => {
    if ((window.innerHeight < 560) !== compact) setMotion(preferredReduced, false);
    else requestFrame(true);
  }, { passive: true, signal });
  window.addEventListener('pageshow', () => requestFrame(true), { signal });
  window.addEventListener('pagehide', stopFrame, { signal });
  window.addEventListener('hashchange', () => followHash(location.hash, false, true), { signal });
  window.addEventListener('popstate', () => {
    const next = new URLSearchParams(location.search).get('variante') === 'B' ? 'B' : 'A';
    if (next !== variant) selectVariant(next);
    followHash(location.hash, false, true);
  }, { signal });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopFrame();
    else { connectionRefreshPending = true; requestFrame(true); }
  }, { signal });
  const mediaChange = event => { if (!read('rocketlight:motion')) setMotion(event.matches, false); };
  media.addEventListener?.('change', mediaChange, { signal });
  sourceImage?.addEventListener('load', () => requestFrame(true), { signal });
  $$('[data-building]').forEach(image => image.addEventListener('load', () => requestFrame(true), { signal }));

  root.classList.toggle('reduced-motion', reduced);
  root.classList.toggle('motion-ready', !reduced);
  cinema.classList.toggle('is-reduced', reduced);
  cinema.classList.toggle('is-compact', compact);
  renderVariant();
  syncVariantURL();
  setMotion(preferredReduced, false);
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => requestFrame(true));
    for (const node of [stage, landscape, world, laneList, $('#chef-panel'), disclosure]) if (node) resizeObserver.observe(node);
  }
  if ('IntersectionObserver' in window) {
    visibilityObserver = new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? true;
      if (!inView) {
        stopFrame();
        // Static chapters still need one scroll update after the scene leaves view.
        if (dirty) requestFrame();
      }
      else { connectionRefreshPending = true; requestFrame(); }
    }, { threshold: 0 });
    visibilityObserver.observe(stage);
  }
  if (document.fonts?.ready) document.fonts.ready.then(() => { if (!destroyed) requestFrame(true); });
  requestAnimationFrame(() => { if (!destroyed) { measure(); if (location.hash) followHash(location.hash, false, true); requestFrame(); } });
  window.RocketCinema = Object.freeze({
    getState: () => ({ variant, reduced, preferredReduced, compact, progress, phase: PHASES[activePhase], inView }),
    destroy() {
      destroyed = true;
      stopFrame();
      abort.abort();
      variantAnimations.forEach(animation => animation.cancel());
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      window.RocketDetails.destroy();
    }
  });
})();
