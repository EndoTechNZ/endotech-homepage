import type { NzLaunchCatalogItem, NzLaunchFamily } from '../data/nzLaunchCatalog';
import { compareNzLaunchCatalogItems } from '../lib/catalogOrder';
import {
  createQuoteRequestPayload,
  quoteProductLabel,
  validateQuoteCustomer,
  validateQuoteLines,
  type QuoteCustomerDetails,
  type QuoteRequestLine,
} from '../lib/quoteRequest';
import { buildQuoteRequestPdf, downloadQuoteRequestPdf } from '../lib/quoteRequestPdf';
import {
  buildQuoteRequestEmailDraft,
  quoteRequestPdfBase64,
} from '../lib/quoteRequestEmail';
import { submitQuoteRequest } from '../lib/quoteRequestSubmission';
import { nzShaperPromo, nzIrootPromo, getPromoOffer, normalisePromoCode, validatePromoSelection } from '../../shared/nz-promo-offers.mjs';
import { formatPromoPrice, getPromoPriceSummary, promoPriceNote, promoTitle, promoProductCopy, promoPriceCopy, promoLinePrice } from '../lib/quotePromoPricing';
import { equipmentForSku, getEquipmentTotals } from '../data/eighteethEquipment';

const root = document.querySelector<HTMLElement>('[data-quote-builder]');

if (root) {
  const decodeCatalog = (): NzLaunchCatalogItem[] => {
    try {
      return JSON.parse(decodeURIComponent(root.dataset.catalog || '')) as NzLaunchCatalogItem[];
    } catch {
      return [];
    }
  };

  const catalog = decodeCatalog();
  const catalogBySku = new Map(catalog.map((item) => [item.sku, item]));
  const selectionStorageKey = root.dataset.localPreview === 'true' ? 'endotechnz_equipment_preview_selections_v1' : 'endotechnz_quote_request_selections_v1';
  const formStartedAt = new Date().toISOString();
  const familyOrder: NzLaunchFamily[] = ['et', 'pt', 'rg', 'micro-path', 'c-plus', 'gutta-percha', 'bioceramics', 'equipment'];
  const selections = new Map<string, number>();
  const createDraftReference = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' }).replaceAll('-', '');
    const time = now.toLocaleTimeString('en-NZ', {
      timeZone: 'Pacific/Auckland',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replaceAll(':', '');
    const random = window.crypto?.getRandomValues
      ? Array.from(window.crypto.getRandomValues(new Uint8Array(2)), (value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()
      : Math.random().toString(16).slice(2, 6).toUpperCase();
    return `NZQ-DRAFT-${date}-${time}-${random}`;
  };
  let draftReference = createDraftReference();

  const customerForm = root.querySelector<HTMLFormElement>('[data-customer-form]');
  const summary = root.querySelector<HTMLElement>('[data-selection-summary]');
  const summaryEmpty = root.querySelector<HTMLElement>('[data-selection-empty]');
  const selectionTotal = root.querySelector<HTMLElement>('[data-selection-total]');
  const reviewTotal = root.querySelector<HTMLElement>('[data-review-total]');
  const reviewBody = root.querySelector<HTMLTableSectionElement>('[data-review-lines]');
  const reviewEmpty = root.querySelector<HTMLElement>('[data-review-empty]');
  const reviewDetails = root.querySelector<HTMLElement>('[data-review-details]');
  const productSearch = root.querySelector<HTMLInputElement>('[data-product-search]');
  const status = root.querySelector<HTMLElement>('[data-quote-status]');
  const confirmation = root.querySelector<HTMLElement>('[data-quote-confirmation]');
  const downloadButton = root.querySelector<HTMLButtonElement>('[data-download-pdf]');
  const downloadSkuListButton = root.querySelector<HTMLButtonElement>('[data-download-sku-list]');
  const copySkuListButton = root.querySelector<HTMLButtonElement>('[data-copy-sku-list]');
  const printButton = root.querySelector<HTMLButtonElement>('[data-print-request]');
  const emailButton = root.querySelector<HTMLButtonElement>('[data-prepare-email]');
  const emailDraftButton = root.querySelector<HTMLButtonElement>('[data-download-email-draft]');
  const printSheet = document.querySelector<HTMLElement>('[data-quote-print-sheet]');
  const draftReferenceNodes = document.querySelectorAll<HTMLElement>('[data-draft-reference]');
  const submissionEnabled = root.dataset.submissionEnabled === 'true' && Boolean(root.dataset.submissionEndpoint);
  const emailButtonDefaultLabel = emailButton?.textContent?.trim() || 'Send PDF request directly to EndoTech NZ';
  const mobileSendMedia = window.matchMedia('(max-width: 44rem)');

  draftReferenceNodes.forEach((node) => { node.textContent = draftReference; });

  const refreshDraftReference = () => {
    draftReference = createDraftReference();
    draftReferenceNodes.forEach((node) => { node.textContent = draftReference; });
  };

  const setStatus = (message: string, tone: 'neutral' | 'success' | 'error' = 'neutral') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
    status.hidden = !message;
  };

  const reportMobileSendFailure = (stage: 'pdf' | 'delivery', error: unknown) => {
    if (!mobileSendMedia.matches || !submissionEnabled) return;
    const endpoint = root.dataset.submissionEndpoint || '';
    if (!endpoint) return;
    let diagnosticsEndpoint: URL;
    try {
      diagnosticsEndpoint = new URL(endpoint);
      diagnosticsEndpoint.pathname = diagnosticsEndpoint.pathname.replace(/nz-quote-request$/, 'nz-quote-request-diagnostic');
    } catch {
      return;
    }

    const message = error instanceof Error ? error.message : '';
    const code = stage === 'pdf'
      ? 'pdf_build_failed'
      : /timed out/i.test(message)
        ? 'delivery_timed_out'
        : /not enabled|not configured/i.test(message)
          ? 'delivery_not_configured'
          : 'delivery_failed';

    // No practice, patient, order or contact details are included in this diagnostic payload.
    void fetch(diagnosticsEndpoint, {
      method: 'POST',
      credentials: 'omit',
      cache: 'no-store',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: '2026-08-26',
        draftReference,
        stage,
        code,
        mobile: true,
      }),
    }).catch(() => {
      // Diagnostics must never block a customer from retrying or using the PDF fallback.
    });
  };

  const showRequestConfirmation = (customerEmail: string, quoteReference: string) => {
    if (!confirmation) return;
    confirmation.replaceChildren(
      createText('strong', 'Pro forma request sent'),
      createText('span', `The PDF request has been accepted for delivery to EndoTech NZ and ${customerEmail}. Reference: ${quoteReference}.`),
    );
    confirmation.hidden = false;
  };

  const clearRequestConfirmation = () => {
    if (emailButton?.dataset.completed === 'true') {
      delete emailButton.dataset.completed;
      emailButton.disabled = false;
      emailButton.textContent = emailButtonDefaultLabel;
      confirmation?.replaceChildren();
      if (confirmation) confirmation.hidden = true;
      refreshDraftReference();
    }
    setStatus('');
  };

  const persistSelections = () => {
    try {
      window.localStorage.setItem(selectionStorageKey, JSON.stringify([...selections.entries()]));
    } catch {
      // Product selections remain available for this page view if storage is unavailable.
    }
  };

  const restoreSelections = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(selectionStorageKey) || '[]') as Array<[string, number]>;
      stored.forEach(([sku, quantity]) => {
        if (catalogBySku.has(sku) && Number.isInteger(quantity) && quantity > 0 && quantity <= 999) {
          selections.set(sku, quantity);
        }
      });
    } catch {
      selections.clear();
    }
  };

  const readCustomer = (): QuoteCustomerDetails => {
    const data = new FormData(customerForm || undefined);
    return {
      fullName: String(data.get('fullName') || '').trim(),
      practice: String(data.get('practice') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      accountNumber: String(data.get('accountNumber') || '').trim(),
      promoCode: normalisePromoCode(data.get('promoCode')),
      deliveryAddress: String(data.get('deliveryAddress') || '').trim(),
      purchaseOrderReference: String(data.get('purchaseOrderReference') || '').trim(),
      notes: String(data.get('notes') || '').trim(),
    };
  };

  const selectedLines = (): Array<{ item: NzLaunchCatalogItem; quantity: number }> =>
    [...selections.entries()]
      .map(([sku, quantity]) => ({ item: catalogBySku.get(sku), quantity }))
      .filter((line): line is { item: NzLaunchCatalogItem; quantity: number } => Boolean(line.item))
      .sort((a, b) =>
        familyOrder.indexOf(a.item.family) - familyOrder.indexOf(b.item.family) ||
        compareNzLaunchCatalogItems(a.item, b.item),
      );

  const skuEntryRows = (lines: Array<{ item: NzLaunchCatalogItem; quantity: number }>) => [
    ['SKU', 'Quantity'],
    ...lines.map(({ item, quantity }) => [item.sku, String(quantity)]),
  ];

  const skuEntryText = (lines: Array<{ item: NzLaunchCatalogItem; quantity: number }>) =>
    skuEntryRows(lines).map((row) => row.join('\t')).join('\n');

  const csvCell = (value: string) => `"${value.replaceAll('"', '""')}"`;

  const skuEntryCsv = (lines: Array<{ item: NzLaunchCatalogItem; quantity: number }>) =>
    skuEntryRows(lines).map((row) => row.map(csvCell).join(',')).join('\r\n');

  const downloadBlob = (blob: Blob, filename: string) => {
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 2_000);
  };

  const downloadTextFile = (contents: string, filename: string, type: string) => {
    downloadBlob(new Blob([contents], { type }), filename);
  };

  const copyText = async (contents: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(contents);
      return;
    }
    const field = document.createElement('textarea');
    field.value = contents;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('The SKU list could not be copied. Download the SKU entry list instead.');
  };

  const setQuantity = (sku: string, rawQuantity: number) => {
    const quantity = Math.max(0, Math.min(999, Math.floor(Number(rawQuantity) || 0)));
    if (!catalogBySku.has(sku)) return;
    if ((selections.get(sku) || 0) !== quantity) clearRequestConfirmation();
    if (quantity > 0) selections.set(sku, quantity);
    else selections.delete(sku);
    root.querySelectorAll<HTMLInputElement>(`[data-quote-quantity][data-sku="${CSS.escape(sku)}"]`).forEach((input) => {
      input.value = quantity ? String(quantity) : '';
    });
    persistSelections();
    renderSelections();
  };

  const createText = (tag: keyof HTMLElementTagNameMap, text: string, className?: string) => {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
  };

  const renderSelections = () => {
    const lines = selectedLines();
    const packs = lines.filter(line => line.item.family !== 'equipment').reduce((total, line) => total + line.quantity, 0);
    const units = lines.filter(line => line.item.family === 'equipment').reduce((total, line) => total + line.quantity, 0);
    const count = `${lines.length} line${lines.length === 1 ? '' : 's'}${packs ? ` · ${packs} pack${packs === 1 ? '' : 's'}` : ''}${units ? ` · ${units} unit${units === 1 ? '' : 's'}` : ''}`;
    if (selectionTotal) selectionTotal.textContent = count;
    if (reviewTotal) reviewTotal.textContent = count;
    const equipmentTotal = getEquipmentTotals(lines.map(line => ({ sku: line.item.sku, quantity: line.quantity })));
    const liveTotal = root.querySelector<HTMLElement>('[data-equipment-live-total]');
    if (liveTotal) {
      liveTotal.hidden = equipmentTotal.selected.length === 0;
      liveTotal.replaceChildren(
        createText('span', 'Equipment subtotal'),
        createText('strong', `${formatPromoPrice(equipmentTotal.net)} + GST`),
        createText('span', `${formatPromoPrice(equipmentTotal.total)} incl. GST`),
        createText('small', equipmentTotal.hasOtherItems ? 'Equipment only. Files, points and freight will be quoted separately.' : 'Freight confirmed on your pro forma.'),
      );
    }

    if (summary) {
      summary.replaceChildren();
      lines.forEach(({ item, quantity }) => {
        const row = document.createElement('div');
        row.className = 'quote-summary-line';
        row.dataset.summarySku = item.sku;

        const copy = document.createElement('div');
        copy.append(createText('strong', quoteProductLabel(item), 'quote-product-label'));
        copy.append(createText('span', item.family === 'equipment' ? `${item.fileType} · per unit` : `${item.size} · ${item.lengthMm ? `${item.lengthMm} mm` : 'Length n/a'} · ${item.sku}`));

        const controls = document.createElement('div');
        controls.className = 'quote-summary-controls';
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = '0';
        quantityInput.max = '999';
        quantityInput.step = '1';
        quantityInput.inputMode = 'numeric';
        quantityInput.value = String(quantity);
        quantityInput.dataset.summaryQuantity = item.sku;
        quantityInput.setAttribute('aria-label', `Quantity for ${quoteProductLabel(item)} ${item.size} ${item.sku}`);
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.dataset.removeSku = item.sku;
        controls.append(quantityInput, remove);
        row.append(copy, controls);
        summary.append(row);
      });
    }

    if (summaryEmpty) summaryEmpty.hidden = lines.length > 0;
    if (summary) summary.hidden = lines.length === 0;
    renderReview();
  };

  const appendDetail = (list: HTMLElement, label: string, value: string) => {
    const wrapper = document.createElement('div');
    wrapper.append(createText('dt', label), createText('dd', value || '—'));
    list.append(wrapper);
  };

  const renderReview = () => {
    const lines = selectedLines();
    const customer = readCustomer();
    const eq = getEquipmentTotals(lines.map(line => ({ sku: line.item.sku, quantity: line.quantity })));
    const equipmentSummary = root.querySelector<HTMLElement>('[data-equipment-review]');
    if (equipmentSummary) {
      equipmentSummary.hidden = eq.selected.length === 0;
      for (const [selector, value] of [
        ['[data-equipment-net]', formatPromoPrice(eq.net)],
        ['[data-equipment-gst]', formatPromoPrice(eq.gst)],
        ['[data-equipment-total]', formatPromoPrice(eq.total)],
        ['[data-equipment-note]', eq.hasOtherItems ? 'Files, points, any promotional offers and freight are separate; this is not the complete order total.' : 'Freight and availability will be confirmed on the pro forma invoice.'],
      ]) {
        const element = equipmentSummary.querySelector<HTMLElement>(selector);
        if (element) element.textContent = value;
      }
    }
    const price = getPromoPriceSummary(customer.promoCode, lines.map(({item,quantity}) => ({sku:item.sku,quantity})));
    if (root.classList.contains('iroot-offer-active') && price?.code !== nzIrootPromo.code) {
      root.classList.remove('iroot-offer-active');
      const panel = root.querySelector<HTMLElement>('[data-iroot-offer]');
      if (panel) panel.hidden = true;
    }
    const priceSummary = root.querySelector<HTMLElement>('[data-review-promo-summary]');
    if (priceSummary) {
      priceSummary.hidden = !price;
      if (price) {
        for (const [selector,value] of [
          ['[data-promo-price-code]',price.code === nzIrootPromo.code ? 'iRoot' : price.code],
          ['[data-promo-title]',promoTitle(price)],
          ['[data-promo-products]',promoProductCopy(price)],
          ['[data-promo-net-label]',price.code === nzIrootPromo.code ? 'Bundle excl. GST' : 'Two six-packs'],
          ['[data-promo-price-total]',formatPromoPrice(price.totalInclGst)],
          ['[data-promo-price-net]',formatPromoPrice(price.netTotal)],
          ['[data-promo-price-gst]',formatPromoPrice(price.gstTotal)],
          ['[data-promo-price-note]',promoPriceNote(price)],
        ]) {
          const element = priceSummary.querySelector<HTMLElement>(selector);
          if (element) element.textContent = value;
        }
      }
    }
    const pricingNote = root.querySelector<HTMLElement>('[data-review-pricing-note]');
    if (pricingNote) pricingNote.textContent = eq.selected.length
      ? 'Review the quantities below. Equipment pricing is shown separately, with GST. Other products and freight will be confirmed on your pro forma.'
      : price
      ? 'Your promo pack price is shown below. EndoTech NZ will confirm postage, availability and account terms in the pro forma invoice.'
      : 'The website supplies SKUs and quantities only. EndoTech NZ will add pricing, GST, freight, availability and account terms in the pro forma invoice.';
    root.querySelectorAll<HTMLElement>('[data-review-promo-column]').forEach(element => { element.hidden = !price && !eq.selected.length; });
    if (reviewBody) {
      reviewBody.replaceChildren();
      lines.forEach(({ item, quantity }) => {
        const row = document.createElement('tr');
        const product = document.createElement('td');
        product.className = 'quote-review-product';
        product.append(createText('strong', quoteProductLabel(item), 'quote-product-label'));
        product.append(createText('span', item.fileType));
        [
          createText('td', item.sku),
          createText('td', String(quantity)),
          product,
          createText('td', item.size),
          createText('td', item.lengthMm ? `${item.lengthMm} mm` : '—'),
        ].forEach((cell) => row.append(cell));
        if (price || eq.selected.length) {
          const cell = createText('td', '', 'quote-promo-line-price');
          const equipmentItem = equipmentForSku(item.sku);
          if (equipmentItem) {
            cell.append(createText('span', formatPromoPrice(equipmentItem.price)), createText('small', '+ GST / unit'));
          } else if (price && promoLinePrice(price, item.sku)) {
            cell.append(createText('span',promoLinePrice(price, item.sku)!));
          } else {
            cell.textContent = 'To be quoted';
          }
          row.append(cell);
        }
        reviewBody.append(row);
      });
    }
    if (reviewEmpty) reviewEmpty.hidden = lines.length > 0;

    if (reviewDetails) {
      reviewDetails.replaceChildren();
      appendDetail(reviewDetails, 'Contact', customer.fullName);
      appendDetail(reviewDetails, 'Practice / account', customer.practice);
      appendDetail(reviewDetails, 'Email', customer.email);
      appendDetail(reviewDetails, 'Phone', customer.phone);
      appendDetail(reviewDetails, 'Account number', customer.accountNumber);
      if (customer.promoCode) appendDetail(reviewDetails, 'Promo code', customer.promoCode);
      appendDetail(reviewDetails, 'PO reference', customer.purchaseOrderReference);
      appendDetail(reviewDetails, 'Delivery', customer.deliveryAddress);
      appendDetail(reviewDetails, 'Notes', customer.notes);
    }
  };

  const setActiveFamily = (family: string) => {
    root.querySelectorAll<HTMLButtonElement>('[data-order-category]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.orderCategory === (family === 'equipment' ? 'equipment' : 'files')));
    });
    const fileTabs = root.querySelector<HTMLElement>('[data-file-family-tabs]');
    if (fileTabs) fileTabs.hidden = family === 'equipment';
    if (productSearch) productSearch.value = '';
    root.querySelectorAll<HTMLButtonElement>('[data-family-tab]').forEach((tab) => {
      const active = tab.dataset.familyTab === family;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    root.querySelectorAll<HTMLElement>('[data-family-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.familyPanel !== family;
    });
    applySearch();
  };

  const applySearch = () => {
    const query = (productSearch?.value || '').trim().toLowerCase();
    const activePanel = root.querySelector<HTMLElement>('[data-family-panel]:not([hidden])');
    if (!activePanel) return;
    let visible = 0;
    activePanel.querySelectorAll<HTMLElement>('[data-catalog-row]').forEach((row) => {
      const matches = !query || (row.dataset.search || '').includes(query);
      row.hidden = !matches;
      if (matches) visible += 1;
    });
    const noResults = activePanel.querySelector<HTMLElement>('[data-no-results]');
    if (noResults) noResults.hidden = visible > 0;
  };

  const validateDraft = () => {
    if (!customerForm?.reportValidity()) {
      setStatus('Complete the required practice details before exporting the request.', 'error');
      return null;
    }
    const customer = readCustomer();
    const customerErrors = validateQuoteCustomer(customer);
    const lines = selectedLines();
    const promoError = validatePromoSelection(customer.promoCode, lines.map(({item,quantity}) => ({sku:item.sku,quantity})));
    if (promoError) {
      setStatus(promoError, 'error');
      return null;
    }
    const lineValidation = validateQuoteLines(
      lines.map(({ item, quantity }) => ({ sku: item.sku, quantity })),
      catalog,
    );
    if (customerErrors.length || !lineValidation.ok) {
      setStatus([...customerErrors, ...lineValidation.errors][0] || 'Review the quotation request.', 'error');
      return null;
    }
    return { customer, lines };
  };

  const withBusyButton = async (button: HTMLButtonElement | null, task: () => Promise<void>) => {
    if (!button || button.disabled) return;
    const label = button.textContent;
    button.disabled = true;
    button.dataset.busy = 'true';
    try {
      await task();
    } finally {
      button.disabled = false;
      delete button.dataset.busy;
      button.textContent = label;
    }
  };

  const buildPrintSheet = (customer: QuoteCustomerDetails, lines: Array<{ item: NzLaunchCatalogItem; quantity: number }>) => {
    if (!printSheet) return;
    const price = getPromoPriceSummary(customer.promoCode, lines.map(({item,quantity}) => ({sku:item.sku,quantity})));
    const eq = getEquipmentTotals(lines.map(line => ({ sku: line.item.sku, quantity: line.quantity })));
    const eqSection = printSheet.querySelector<HTMLElement>('[data-print-equipment-summary]');
    if (eqSection) eqSection.hidden = eq.selected.length === 0;
    const eqPrice = printSheet.querySelector<HTMLElement>('[data-print-equipment-price]');
    if (eqPrice) eqPrice.textContent = `Equipment ${formatPromoPrice(eq.net)} + GST ${formatPromoPrice(eq.gst)} = ${formatPromoPrice(eq.total)} incl. GST.`;
    const priceSummary = printSheet.querySelector<HTMLElement>('[data-print-promo-summary]');
    if (priceSummary) priceSummary.hidden = !price;
    const priceLabel = printSheet.querySelector<HTMLElement>('.quote-print-title > div > p');
    if (priceLabel) priceLabel.textContent = eq.selected.length ? 'PARTIAL PRICING' : price ? 'PROMO PRICE SHOWN' : 'UNPRICED';
    const footer = printSheet.querySelector<HTMLElement>('footer');
    if (footer) footer.textContent = eq.selected.length ? 'EndoTech NZ | Pro forma request with equipment pricing' : price ? 'EndoTech NZ | Pro forma request with promotional pack price' : 'EndoTech NZ | Unpriced pro forma invoice request';
    const priceCopy = printSheet.querySelector<HTMLElement>('[data-print-promo-price]');
    const priceNote = printSheet.querySelector<HTMLElement>('[data-print-promo-note]');
    if (priceCopy && price) priceCopy.textContent = promoPriceCopy(price);
    if (priceNote && price) priceNote.textContent = promoPriceNote(price);
    const details = printSheet.querySelector<HTMLElement>('[data-print-details]');
    const body = printSheet.querySelector<HTMLTableSectionElement>('[data-print-lines]');
    const created = printSheet.querySelector<HTMLElement>('[data-print-created]');
    const notes = printSheet.querySelector<HTMLElement>('[data-print-notes]');
    if (created) created.textContent = new Intl.DateTimeFormat('en-NZ', { dateStyle: 'long', timeStyle: 'short' }).format(new Date());
    if (notes) notes.textContent = customer.notes || 'No additional notes supplied.';
    if (details) {
      details.replaceChildren();
      appendDetail(details, 'Contact', customer.fullName);
      appendDetail(details, 'Practice / account', customer.practice);
      appendDetail(details, 'Email', customer.email);
      appendDetail(details, 'Phone', customer.phone);
      appendDetail(details, 'Account number', customer.accountNumber);
      if (customer.promoCode) appendDetail(details, 'Promo code', customer.promoCode);
      appendDetail(details, 'PO reference', customer.purchaseOrderReference);
      appendDetail(details, 'Delivery address', customer.deliveryAddress);
    }
    if (body) {
      body.replaceChildren();
      lines.forEach(({ item, quantity }) => {
        const row = document.createElement('tr');
        [item.sku, String(quantity), quoteProductLabel(item), item.size, item.lengthMm ? `${item.lengthMm} mm` : '—']
          .forEach((value) => row.append(createText('td', value)));
        body.append(row);
      });
    }
  };

  root.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.matches('[data-quote-quantity]')) {
      setQuantity(target.dataset.sku || '', Number(target.value));
    }
    if (target instanceof HTMLInputElement && target.matches('[data-summary-quantity]')) {
      setQuantity(target.dataset.summaryQuantity || '', Number(target.value));
    }
    if (customerForm?.contains(target as Node)) {
      clearRequestConfirmation();
      renderReview();
    }
  });

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const category = target.closest<HTMLButtonElement>('[data-order-category]');
    if (category) setActiveFamily(category.dataset.orderCategory === 'equipment' ? 'equipment' : 'et');
    const familyTab = target.closest<HTMLButtonElement>('[data-family-tab]');
    if (familyTab) setActiveFamily(familyTab.dataset.familyTab || 'et');
    const remove = target.closest<HTMLButtonElement>('[data-remove-sku]');
    if (remove) setQuantity(remove.dataset.removeSku || '', 0);
    const clear = target.closest<HTMLButtonElement>('[data-clear-selections]');
    if (clear && selections.size > 0 && window.confirm('Clear every selected product from this draft request?')) {
      [...selections.keys()].forEach((sku) => setQuantity(sku, 0));
      setStatus('Product selections cleared.');
    }
  });

  root.querySelectorAll<HTMLButtonElement>('[data-family-tab]').forEach((tab) => {
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-family-tab]'));
      const current = tabs.indexOf(tab);
      const next = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next]?.focus();
      setActiveFamily(tabs[next]?.dataset.familyTab || 'et');
    });
  });

  productSearch?.addEventListener('input', applySearch);

  const applyPromo = (showOffer = true) => {
    const input = customerForm?.querySelector<HTMLInputElement>('[name="promoCode"]');
    const message = root.querySelector<HTMLElement>('[data-promo-status]');
    if (!input || !message) return;
    const code = normalisePromoCode(input.value);
    input.value = code === nzIrootPromo.code ? 'iRoot' : code;
    message.hidden = false;
    const offer = getPromoOffer(code);
    const offerPanel = root.querySelector<HTMLElement>('[data-iroot-offer]');
    root.classList.remove('iroot-offer-active');
    if (offerPanel) offerPanel.hidden = true;
    if (!offer) {
      message.textContent = 'That promo code is not recognised. Check the code in your offer.';
      renderReview();
      return;
    }
    if (!offer.skus.every(sku => catalogBySku.has(sku))) {
      message.textContent = 'This offer is not available in the current catalogue. Please contact EndoTech NZ.';
      return;
    }
    offer.skus.forEach(sku => setQuantity(sku, 1));
    message.textContent = code === nzIrootPromo.code ? nzIrootPromo.description : `${nzShaperPromo.description} One six-pack of each has been added. One introductory bundle per practice.`;
    const url = new URL(window.location.href);
    url.searchParams.set('promo', code === nzIrootPromo.code ? 'iRoot' : code);
    if (code === nzIrootPromo.code && offerPanel) {
      offerPanel.hidden = false;
      root.classList.add('iroot-offer-active');
      if (showOffer) {
        url.hash = 'iroot-offer';
        offerPanel.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
        offerPanel.querySelector<HTMLElement>('h1')?.focus({preventScroll:true});
      }
    }
    window.history.replaceState(null, '', url);
    renderReview();
  };
  root.querySelector<HTMLButtonElement>('[data-apply-promo]')?.addEventListener('click', () => applyPromo());
  customerForm?.querySelector<HTMLInputElement>('[name="promoCode"]')?.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); applyPromo(); }
  });
  root.querySelector<HTMLButtonElement>('[data-iroot-continue]')?.addEventListener('click', () => {
    customerForm?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
    customerForm?.querySelector<HTMLInputElement>('[name="fullName"]')?.focus({preventScroll:true});
  });

  downloadButton?.addEventListener('click', () => withBusyButton(downloadButton, async () => {
    const draft = validateDraft();
    if (!draft) return;
    downloadButton.textContent = 'Building PDF…';
    setStatus('Building your multipage pro forma invoice request PDF…');
    try {
      const bytes = await buildQuoteRequestPdf({
        draftReference,
        createdAt: new Date(),
        customer: draft.customer,
        lines: draft.lines,
        transformLogoUrl: root.dataset.transformLogo || '',
        endotechLogoUrl: root.dataset.endotechLogo || '',
        contactEmail: root.dataset.contactEmail || 'steveshepherdnz@gmail.com',
      });
      downloadQuoteRequestPdf(bytes, `EndoTech-NZ-Pro-Forma-Request-${draftReference}.pdf`);
      setStatus('Pro forma request PDF downloaded. Attach it to an email to EndoTech NZ when you are ready.', 'success');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The PDF could not be created.', 'error');
    }
  }));

  downloadSkuListButton?.addEventListener('click', () => {
    const draft = validateDraft();
    if (!draft) return;
    downloadTextFile(
      skuEntryCsv(draft.lines),
      `EndoTech-NZ-SKU-Entry-${draftReference}.csv`,
      'text/csv;charset=utf-8',
    );
    setStatus('Compact SKU and quantity entry list downloaded for the EndoTech NZ desktop app.', 'success');
  });

  copySkuListButton?.addEventListener('click', () => withBusyButton(copySkuListButton, async () => {
    const draft = validateDraft();
    if (!draft) return;
    copySkuListButton.textContent = 'Copying…';
    try {
      await copyText(skuEntryText(draft.lines));
      setStatus('SKU and quantity list copied. It is ready to paste beside the desktop invoicing app.', 'success');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The SKU list could not be copied.', 'error');
    }
  }));

  printButton?.addEventListener('click', () => {
    const draft = validateDraft();
    if (!draft) return;
    buildPrintSheet(draft.customer, draft.lines);
    setStatus('The print window is opening. Choose Save as PDF if you want another PDF copy.');
    window.requestAnimationFrame(() => window.print());
  });

  const buildAttachedEmail = async () => {
    const draft = validateDraft();
    if (!draft) return null;
    const email = root.dataset.contactEmail || 'steveshepherdnz@gmail.com';
    const subject = `Pro forma invoice request ${draftReference}`;
    const pdfFilename = `EndoTech-NZ-Pro-Forma-Request-${draftReference}.pdf`;
    const previewLines = draft.lines.slice(0, 20).map(({ item, quantity }) => `${item.sku} - ${quoteProductLabel(item)} ${item.size} - Qty ${quantity}`);
    const remaining = Math.max(0, draft.lines.length - previewLines.length);
    const body = [
      'Hello EndoTech NZ,',
      '',
      'Please prepare a pro forma invoice for the attached/requested products.',
      '',
      `Draft reference: ${draftReference}`,
      `Practice / account: ${draft.customer.practice}`,
      `Contact: ${draft.customer.fullName}`,
      `Phone: ${draft.customer.phone}`,
      `Account number: ${draft.customer.accountNumber || '-'}`,
      ...(draft.customer.promoCode ? [`Promo code: ${draft.customer.promoCode}`, getPromoOffer(draft.customer.promoCode)?.description || ''] : []),
      `PO reference: ${draft.customer.purchaseOrderReference || '-'}`,
      '',
      'Customer comments:',
      draft.customer.notes || '[Type any additional comments here]',
      '',
      'Requested products:',
      ...previewLines,
      ...(remaining ? [`...plus ${remaining} additional line${remaining === 1 ? '' : 's'} shown in the attached PDF.`] : []),
      '',
      'Please confirm availability, account terms, GST, freight and pricing in the pro forma invoice.',
    ].join('\n');

    const pdfBytes = await buildQuoteRequestPdf({
      draftReference,
      createdAt: new Date(),
      customer: draft.customer,
      lines: draft.lines,
      transformLogoUrl: root.dataset.transformLogo || '',
      endotechLogoUrl: root.dataset.endotechLogo || '',
      contactEmail: email,
    });
    const emailDraft = buildQuoteRequestEmailDraft({
      to: email,
      subject,
      body,
      pdfFilename,
      pdfBytes,
      draftReference,
    });
    return { draft, email, pdfFilename, pdfBytes, emailDraft };
  };

  const downloadAttachedEmail = (emailDraft: Blob, email: string) => {
    downloadBlob(emailDraft, `EndoTech-NZ-Email-${draftReference}.eml`);
    setStatus(`Attached email draft downloaded. Open the .eml file to compose it: ${email} and the request PDF are already included.`, 'success');
  };

  emailButton?.addEventListener('click', async () => {
    if (emailButton.disabled) return;
    const originalLabel = emailButton.textContent;
    emailButton.disabled = true;
    emailButton.dataset.busy = 'true';
    const mobileSend = mobileSendMedia.matches;
    let failureStage: 'pdf' | 'delivery' = 'pdf';
    emailButton.setAttribute('aria-busy', 'true');
    emailButton.textContent = mobileSend ? 'Preparing request PDF…' : 'Sending PDF request…';
    setStatus(mobileSend ? 'Preparing your request PDF…' : 'Building the PDF and sending it securely to EndoTech NZ…');
    try {
      const emailPackage = await buildAttachedEmail();
      if (!emailPackage) {
        emailButton.disabled = false;
        emailButton.textContent = originalLabel;
        return;
      }
      if (mobileSend) {
        emailButton.textContent = 'Sending request…';
        setStatus('PDF ready. Sending your request securely to EndoTech NZ…');
      }
      failureStage = 'delivery';
      const formData = new FormData(customerForm || undefined);
      const payload = createQuoteRequestPayload({
        draftReference,
        customer: emailPackage.draft.customer,
        lines: emailPackage.draft.lines.map(({ item, quantity }): QuoteRequestLine => ({ sku: item.sku, quantity })),
        formStartedAt,
        website: String(formData.get('website') || ''),
        path: window.location.pathname,
        attachment: {
          filename: emailPackage.pdfFilename,
          contentBase64: quoteRequestPdfBase64(emailPackage.pdfBytes),
        },
      });
      const result = await submitQuoteRequest(payload, {
        enabled: submissionEnabled,
        endpoint: root.dataset.submissionEndpoint || '',
        approvedCatalog: catalog,
        pageOrigin: window.location.origin,
      });
      emailButton.dataset.completed = 'true';
      emailButton.textContent = 'Request sent — PDF emailed';
      showRequestConfirmation(emailPackage.draft.customer.email, result.quoteReference);
      setStatus('');
    } catch (error) {
      reportMobileSendFailure(failureStage, error);
      emailButton.disabled = false;
      emailButton.textContent = originalLabel;
      const message = error instanceof Error ? error.message : 'The PDF request could not be sent.';
      setStatus(mobileSend
        ? `Your request has not been sent. ${message} You can retry or download the PDF below.`
        : message, 'error');
    } finally {
      delete emailButton.dataset.busy;
      emailButton.removeAttribute('aria-busy');
    }
  });

  emailDraftButton?.addEventListener('click', () => withBusyButton(emailDraftButton, async () => {
    emailDraftButton.textContent = 'Building email draft…';
    setStatus('Building the PDF and attached email draft…');
    try {
      const emailPackage = await buildAttachedEmail();
      if (!emailPackage) return;
      downloadAttachedEmail(emailPackage.emailDraft, emailPackage.email);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'The attached email draft could not be created.', 'error');
    }
  }));

  restoreSelections();
  const params = new URLSearchParams(window.location.search);
  if (getPromoOffer(params.get('promo'))) {
    const input = customerForm?.querySelector<HTMLInputElement>('[name="promoCode"]');
    if (input) { input.value = params.get('promo')!; applyPromo(false); }
    if (window.location.hash === '#iroot-offer') window.requestAnimationFrame(() => root.querySelector('[data-iroot-offer]')?.scrollIntoView({block:'start'}));
  }
  const requestedProduct = params.get('product') || '';
  if (equipmentForSku(requestedProduct) && catalogBySku.has(requestedProduct) && !selections.has(requestedProduct)) {
    selections.set(requestedProduct, 1);
    persistSelections();
  }
  root.querySelectorAll<HTMLInputElement>('[data-quote-quantity]').forEach((input) => {
    const quantity = selections.get(input.dataset.sku || '');
    input.value = quantity ? String(quantity) : '';
  });
  const requestedFamily = params.get('category') === 'equipment' || equipmentForSku(requestedProduct) ? 'equipment' : params.get('family');
  const initialFamily = requestedFamily && familyOrder.includes(requestedFamily as NzLaunchFamily)
    ? requestedFamily
    : root.querySelector<HTMLButtonElement>('[data-family-tab]')?.dataset.familyTab || 'et';
  setActiveFamily(initialFamily);
  renderSelections();
}
