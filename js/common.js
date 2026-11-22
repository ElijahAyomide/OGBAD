'use strict';
/* Shared helpers for the home page and the update page. */
window.OG = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  function el(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach((c) => { if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(String(c))); });
    return e;
  }
  let store = {};
  const money = (n) => (store.currency_symbol || '₦') + Number(n || 0).toLocaleString('en-NG');
  async function load() {
    const r = await fetch('updates.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error('updates.json missing');
    const d = await r.json();
    store = d.store || {};
    return d;
  }
  function chrome() {
    $$('[data-store-name]').forEach((n) => { n.textContent = store.name || 'Store'; });
    $$('[data-tagline]').forEach((n) => { n.textContent = store.tagline || ''; });
    $$('[data-mail]').forEach((a) => { if (store.email) a.href = 'mailto:' + store.email; });
    $$('[data-year]').forEach((n) => { n.textContent = new Date().getFullYear(); });
    if (store.name) document.title = document.title.replace('OGBAD', store.name);
  }
  const updateUrl = (b) => 'update.html?u=' + encodeURIComponent(b.slug);
  function card(b) {
    const href = updateUrl(b);
    return el('article', { class: 'card' },
      el('a', { class: 'card-img', href, 'aria-label': b.title }, el('img', { src: b.images[0], alt: '', loading: 'lazy' })),
      el('div', { class: 'card-body' },
        el('p', { class: 'cat', text: b.category || '' }),
        el('h3', {}, el('a', { href, text: b.title })),
        el('p', { class: 'short', text: b.short || '' }),
        el('div', { class: 'card-foot' },
          el('span', { class: 'price', text: money(b.price) }),
          el('a', { class: 'btn-dark arr', href, text: 'View update ' }))));
  }
  return { $, $$, el, load, money, chrome, card, updateUrl };
})();
