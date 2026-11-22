'use strict';
(async () => {
  const { $, $$, el, load, chrome, card } = OG;
  let data;
  try { data = await load(); } catch (e) {
    $('#grid').replaceChildren(el('p', { class: 'empty', text: 'The updates could not be loaded. Please refresh the page.' }));
    return;
  }
  chrome();
  const s = data.store, updates = data.updates;

  /* hero */
  const lines = (t) => String(t || '').split(/\r?\n/);
  const setLines = (node, t) => { node.replaceChildren(...lines(t).flatMap((l, i) => (i ? [el('br'), l] : [l]))); };
  $('#h-eyebrow').textContent = s.hero_eyebrow || '';
  setLines($('#h-title'), s.hero_title);
  setLines($('#h-text'), s.hero_text);
  $('#h-note').textContent = s.hero_note || '';
  const heroImg = s.hero_image || (updates[0] && updates[0].images[0]);
  if (heroImg) { $('#h-img').src = heroImg; $('#h-fig').classList.remove('hidden'); }

  /* carousel (latest 8) */
  const track = $('#track'), latest = updates.slice(0, 8);
  if (!latest.length) $('#shelf').classList.add('hidden');
  latest.forEach((b) => track.append(card(b)));
  const step = () => { const c = track.querySelector('.card'); return c ? c.offsetWidth + 20 : 300; };
  const inView = () => { const c = track.querySelector('.card'); return c ? Math.max(1, Math.round(track.clientWidth / (c.offsetWidth + 20))) : 0; };
  const refreshArrows = () => {
    $('#prev').disabled = track.scrollLeft < 4;
    $('#next').disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    $('#count').textContent = `${latest.length} ${latest.length === 1 ? 'update' : 'updates'} · ${Math.min(inView(), latest.length)} in view`;
  };
  $('#prev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#next').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', refreshArrows, { passive: true });
  window.addEventListener('resize', refreshArrows);
  refreshArrows();

  /* search + category filter */
  const cats = [...new Set(updates.map((b) => (b.category || '').trim()).filter(Boolean))];
  let cat = '', query = '';
  const chips = $('#chips');
  const drawChips = () => {
    chips.replaceChildren(...['', ...cats].map((c) => el('button', {
      class: 'chip', type: 'button', 'aria-pressed': String(c === cat), text: c || 'All updates',
      onclick: () => { cat = c; drawChips(); drawGrid(); },
    })));
    chips.classList.toggle('hidden', !cats.length);
  };
  const drawGrid = () => {
    const q = query.trim().toLowerCase();
    const list = updates.filter((b) => (!cat || b.category === cat) && (!q || [b.title, b.author, b.category, b.short].join(' ').toLowerCase().includes(q)));
    $('#grid').replaceChildren(...(list.length ? list.map(card) : [el('p', { class: 'empty', text: updates.length ? 'No updates match that search. Try another word.' : 'No updates yet. Please check back soon.' })]));
  };
  $('#search').addEventListener('submit', (e) => { e.preventDefault(); query = $('#q').value; drawGrid(); });
  $('#q').addEventListener('input', (e) => { query = e.target.value; drawGrid(); });
  drawChips(); drawGrid();

  /* newsletter (sent to your email by Netlify Forms) */
  $('#news').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, btn = f.querySelector('button'), note = $('#news-note');
    btn.disabled = true;
    try {
      const preview = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
      if (!preview) {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() });
      if (!r.ok) throw new Error();
      }
      note.textContent = 'Thank you. You are on the list.'; f.reset();
    } catch (err) { note.textContent = 'That did not go through. Please try again.'; }
    btn.disabled = false;
  });
})();
