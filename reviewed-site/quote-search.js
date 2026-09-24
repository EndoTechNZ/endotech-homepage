/* Product search enhancement. No quantities, request data or submission changes. */
(function () {
  function matches(item, value) {
    const query = value.trim().toLowerCase().replace(/\bo(?=\d\b)/g, '0');
    if (!query) return true;
    const sizeLength = query.match(/^(\d+)\s+(\d+)(?:\s*mm)?$/);
    if (sizeLength) {
      const size = item.size.match(/(?:^|\()(\d+)\s*\//);
      return !!size && Number(size[1]) === Number(sizeLength[1]) &&
        Number(item.length.match(/\d+/)?.[0]) === Number(sizeLength[2]);
    }
    const taper = query.match(/^(?:0?\.?(\d{2}))$/);
    // Leading zero or decimal denotes taper; bare 15/17/etc. remain size searches.
    if (taper && /^(?:0|\.)/.test(query)) {
      const wanted = Number(taper[1]) / 100;
      const actual = item.size.match(/(?:\/\s*|^)0?\.(\d+)/);
      return !!actual && Number('0.' + actual[1]) === wanted;
    }
    return query.split(/\s+/).every(term => item.search.toLowerCase().includes(term));
  }
  if (typeof module !== 'undefined') module.exports = matches;
  if (typeof document === 'undefined') return;
  const search = document.querySelector('[data-product-search]');
  if (!search) return;
  search.placeholder = 'Size + length (15 21), taper (04) or SKU';
  function apply() {
    const panel = document.querySelector('[data-family-panel]:not([hidden])');
    if (!panel) return;
    let visible = 0;
    panel.querySelectorAll('[data-catalog-row]').forEach(row => {
      const on = matches({size:row.querySelector('[data-label="Size"]').textContent.trim(),
        length:row.querySelector('[data-label="Length"]').textContent.trim(),search:row.dataset.search || ''}, search.value);
      row.hidden = !on;
      if (on) visible++;
    });
    const empty = panel.querySelector('[data-no-results]');
    if (empty) empty.hidden = visible > 0;
  }
  // Capture replaces only the old literal-phrase search handler.
  search.addEventListener('input', event => {event.stopImmediatePropagation();apply();}, true);
  const observer = new MutationObserver(apply);
  document.querySelectorAll('[data-family-tab]').forEach(tab => observer.observe(tab, {attributes:true,attributeFilter:['aria-selected']}));
  apply();
})();
