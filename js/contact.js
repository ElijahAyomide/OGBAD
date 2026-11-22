'use strict';
(async () => {
  const { $, chrome, load } = OG;
  try { await load(); } catch (e) { /* the page still works without store details */ }
  chrome();

  // On your own computer (preview) nothing is sent; once the site is live on Netlify the message is emailed to you.
  const preview = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || location.protocol === 'file:';
  const form = $('#contact'), err = $('#c-error'), btn = $('#c-send');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    err.textContent = '';
    const v = (id) => $(id).value.trim();
    if (!v('#c-first') || !v('#c-last')) { err.textContent = 'Please enter your first and last name.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('#c-email'))) { err.textContent = 'Please enter a valid email address.'; return; }
    if (!$('#c-topic').value) { err.textContent = 'Please choose what we can help with.'; return; }
    if (v('#c-msg').length < 5) { err.textContent = 'Please tell us a little more in the message.'; return; }

    btn.disabled = true;
    try {
      if (preview) console.info('Preview mode: the message is not emailed from your computer.');
      else {
        const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
        if (!r.ok) throw new Error('failed');
      }
      $('#c-sent-text').textContent = `Thank you, ${v('#c-first')}. We have your message and will reply to ${v('#c-email')} soon.`;
      form.classList.add('hidden'); $('#c-sent').classList.remove('hidden');
    } catch (x) {
      err.textContent = 'We could not send your message. Please check your connection and try again.';
    }
    btn.disabled = false;
  });
})();
