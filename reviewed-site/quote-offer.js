/* Presentation only: this offer does not calculate or alter request pricing. */
(() => {
  const actions = document.querySelector('.quote-hero-actions');
  if (!actions || document.querySelector('.quote-rotary-offer')) return;
  const box = document.createElement('aside');
  box.className = 'quote-rotary-offer';
  box.setAttribute('aria-label', 'All rotary files: $39.95 plus GST. Until 31 December 2026.');
  box.innerHTML = '<span class="quote-offer-label">All rotary files</span><span class="quote-offer-price">$39.95 <small>plus GST</small></span><span class="quote-offer-date">Until 31 December 2026</span><span class="quote-offer-swipe" aria-hidden="true"></span>';
  actions.append(box);
})();
