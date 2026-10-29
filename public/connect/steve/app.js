/* No analytics, cookies, external scripts, or background form submissions. */
const canonicalCard = 'https://endotechnz.com/connect/steve/';
const isHostedCard = location.protocol === 'https:' && ['endotechnz.com', 'www.endotechnz.com'].includes(location.hostname);
const shareUrl = isHostedCard ? canonicalCard : null;
const qrDialog = document.getElementById('qr-dialog');
const toast = (message) => { const el = document.querySelector('.toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => el.classList.remove('visible'), 3500); };
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.open).showModal()));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => { dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } }); dialog.addEventListener('close', () => { document.body.classList.remove('stand-active'); document.getElementById('stand-mode').childNodes[0].textContent = 'Exhibition display '; }); });
function setQR(type) {
  if (type === 'web' && !shareUrl) { toast('The online card QR will activate at the published card address. Use Save contact now.'); return; }
  const contact = type === 'contact';
  const src = contact ? 'assets/qr-contact.png' : 'assets/qr-card.png';
  const img = document.getElementById('active-qr'); img.src = src; img.alt = contact ? "QR code containing Steve Shepherd's EndoTechNZ contact details" : "QR code opening Steve Shepherd's online EndoTechNZ card";
  document.getElementById('qr-download').href = src;
  document.getElementById('qr-description').textContent = contact ? 'Scan to open my contact details.' : 'Scan to open my digital card.';
  document.getElementById('qr-note').textContent = contact ? 'Contact QR works without an internet connection.' : 'An internet connection opens the online card.';
  document.querySelectorAll('[data-qr]').forEach(b => { const active = b.dataset.qr === type; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
}
document.querySelectorAll('[data-qr]').forEach(button => button.addEventListener('click', () => setQR(button.dataset.qr)));
if (shareUrl) setQR('web');
else { document.getElementById('qr-web').disabled = true; document.getElementById('qr-web').title = 'Available once this card is published'; }
document.getElementById('stand-mode').addEventListener('click', () => { const active = document.body.classList.toggle('stand-active'); document.getElementById('stand-mode').childNodes[0].textContent = active ? 'Return to card ' : 'Exhibition display '; });
document.querySelectorAll('[data-share]').forEach(button => button.addEventListener('click', async () => {
  if (!shareUrl) { qrDialog.showModal(); setQR('contact'); return; }
  const data = { title: 'Steve Shepherd | EndoTechNZ', text: "Good to meet you. Here are my contact details.", url: shareUrl };
  if (navigator.share) { try { await navigator.share(data); return; } catch (error) { if (error.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(shareUrl); toast('Card link copied.'); } catch { qrDialog.showModal(); }
}));
document.getElementById('exchange-form').addEventListener('submit', event => {
  event.preventDefault(); const data = new FormData(event.target);
  const name = String(data.get('name')).trim(); const company = String(data.get('company')).trim(); const message = String(data.get('message')).trim();
  const body = `Hi Steve,\n\nGood to meet you at the exhibition.\n\nName: ${name}\n${company ? `Practice / company: ${company}\n` : ''}\n${message || 'Please follow up with me.'}\n\nRegards,\n${name}`;
  window.location.href = `mailto:steveshepherdnz@gmail.com?subject=${encodeURIComponent('Exhibition follow-up from ' + name)}&body=${encodeURIComponent(body)}`;
  toast('Review and send the message in your email app.');
});
