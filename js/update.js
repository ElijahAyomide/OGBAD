'use strict';
(async () => {
  const { $, el, load, money, chrome, card } = OG;
  let data;
  try { data = await load(); } catch (e) { $('#loading').textContent = 'The update could not be loaded. Please refresh the page.'; return; }
  chrome();
  const slug = new URLSearchParams(location.search).get('u');
  const b = data.updates.find((x) => x.slug === slug);
  if (!b) {
    $('#loading').replaceChildren('That update is not available. ', el('a', { href: 'index.html#browse', style: 'text-decoration:underline', text: 'Browse all updates' }), '.');
    return;
  }
  const s = data.store;
  document.title = `${b.title} | ${s.name || 'Updates'}`;
  $('#loading').classList.add('hidden');
  $('#update').classList.remove('hidden');

  /* pictures */
  const imgs = b.images || [];
  $('#cover-img').src = imgs[0];
  const shots = imgs.slice(1);
  $('#shots').replaceChildren(...shots.map((src, i) => el('div', {},
    el('button', { class: 'shot-btn', type: 'button', 'aria-label': `View screen shot ${i + 1} larger`, onclick: () => openLb(i + 1) }, el('img', { src, alt: '', loading: 'lazy' })),
    el('p', { class: 'shot-cap' }, el('span', { text: String(i + 1).padStart(2, '0') }), el('span', { text: 'Screen Shot' })))));
  $('#cover').addEventListener('click', () => openLb(0));

  const lb = $('#lb'); let at = 0;
  const showLb = () => {
    $('#lb-img').src = imgs[at];
    $('#lb-cap').textContent = at === 0 ? 'Cover' : `Screen shot ${at}`;
    $('#lb-prev').disabled = at === 0; $('#lb-next').disabled = at === imgs.length - 1;
  };
  function openLb(i) { at = i; showLb(); lb.showModal(); }
  $('#lb-prev').addEventListener('click', () => { if (at > 0) { at--; showLb(); } });
  $('#lb-next').addEventListener('click', () => { if (at < imgs.length - 1) { at++; showLb(); } });
  $('#lb-close').addEventListener('click', () => lb.close());

  /* text */
  $('#b-title').textContent = b.title;
  $('#b-by').textContent = b.author ? 'By ' + b.author : '';
  $('#b-short').textContent = b.short || '';
  $('#b-tags').replaceChildren(...(b.details || []).map((t) => el('li', { text: t })));
  $('#b-price').textContent = money(b.price);
  $('#b-ticks').replaceChildren(...(b.highlights || []).map((t) => el('li', { text: t })));
  $('#b-fine').textContent = s.delivery_note || '';
  const paras = String(b.description || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paras.length) $('#a-text').replaceChildren(...paras.map((p) => el('p', { text: p })));
  else $('#about-sec').classList.add('hidden');
  const list = (id, items, wrap) => {
    if (!items || !items.length) return;
    $(id).replaceChildren(...items.map((t, i) => el('li', {}, el('span', { class: 'num', text: String(i + 1).padStart(2, '0') }), el('span', { text: t }))));
    $(wrap).classList.remove('hidden');
  };
  list('#take-list', b.takeaways, '#take');
  list('#toc-list', b.contents, '#toc');

  /* more updates */
  const others = data.updates.filter((x) => x.slug !== b.slug).slice(0, 5);
  if (others.length) {
    $('#more-label').textContent = 'More from ' + (s.name || 'the shelf');
    $('#more-grid').replaceChildren(...others.map(card));
    $('#more').classList.remove('hidden');
  }

  /* buying: details > bank transfer > thank you */
  const dlg = $('#dlg');
  const steps = ['#step-form', '#step-pay', '#step-done'];
  const show = (id) => steps.forEach((x) => $(x).classList.toggle('hidden', x !== id));
  const ref = 'OG' + Array.from(crypto.getRandomValues(new Uint8Array(5)), (n) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n % 32]).join('');
  let buyer = { name: '', email: '' };

  $('#buy').addEventListener('click', () => {
    $('#f-note').textContent = s.delivery_note || 'Your update is sent to this email address once your payment is confirmed.';
    $('#f-error').textContent = '';
    show('#step-form'); dlg.showModal(); $('#b-name').focus();
  });
  $('#dlg-close').addEventListener('click', () => dlg.close());
  $('#done-close').addEventListener('click', () => dlg.close());

  $('#step-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#b-name').value.trim(), email = $('#b-email').value.trim();
    if (name.length < 2) { $('#f-error').textContent = 'Please enter your full name.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { $('#f-error').textContent = 'Please enter a valid email address.'; return; }
    buyer = { name, email };
    $('#p-amount').textContent = money(b.price);
    $('#p-bank').textContent = s.bank_name || '';
    $('#p-acname').textContent = s.account_name || '';
    $('#p-acno').textContent = s.account_number || '';
    $('#p-ref').textContent = ref;
    $('#p-error').textContent = '';
    show('#step-pay');
  });
  $('#p-back').addEventListener('click', () => show('#step-form'));
  $('#copy').addEventListener('click', async (e) => {
    try { await navigator.clipboard.writeText(s.account_number || ''); e.target.textContent = 'Copied'; setTimeout(() => { e.target.textContent = 'Copy'; }, 1800); } catch (err) { /* ignore */ }
  });

  // On your own computer (preview) nothing is sent; once the site is live on Netlify the email is sent.
  const preview = /^(localhost|127\.0\.0\.1|\[::1\])$|\.github\.io$/.test(location.hostname) || location.protocol === 'file:';
  $('#paid').addEventListener('click', async (e) => {
    const btn = e.target; btn.disabled = true; $('#p-error').textContent = '';
    try {
      if (preview) console.info('Preview mode: the payment notice is not emailed from your computer.');
      const body = new URLSearchParams({
        'form-name': 'payment-claim', 'bot-field': '', update: b.title, price: money(b.price),
        name: buyer.name, email: buyer.email, reference: ref, sent_at: new Date().toString(),
      });
      if (!preview) {
        const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
        if (!r.ok) throw new Error('failed');
      }
      $('#done-text').textContent = `Thank you, ${buyer.name.split(' ')[0]}. We have been told you made the payment. Once it is confirmed, “${b.title}” will be sent to ${buyer.email}.`;
      show('#step-done');
    } catch (err) {
      $('#p-error').textContent = 'We could not send your notice. Please check your connection and click the button again.';
    }
    btn.disabled = false;
  });
})();
