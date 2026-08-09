import type { NzLaunchCatalogItem, NzLaunchFamily } from '../data/nzLaunchCatalog';
import { compareNzLaunchCatalogItems } from '../lib/catalogOrder';
import {
  createQuoteRequestPayload,
  quoteFamilyLabels,
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
  const selectionStorageKey = 'endotechnz_quote_request_selections_v1';
  const formStartedAt = new Date().toISOString();
  const familyOrder: NzLaunchFamily[] = ['et', 'pt', 'micro-path', 'c-plus', 'k-files'];
  const selections = new Map<string, number>();
  const draftReference = (() => {
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
  })();

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
  const downloadButton = root.querySelector<HTMLButtonElement>('[data-download-pdf]');
  const downloadSkuListButton = root.querySelector<HTMLButtonElement>('[data-download-sku-list]');
  const copySkuListButton = root.querySelector<HTMLButtonElement>('[data-copy-sku-list]');
  const printButton = root.querySelector<HTMLButtonElement>('[data-print-request]');
  const emailButton = root.querySelector<HTMLButtonElement>('[data-prepare-email]');
  const emailDraftButton = root.querySelector<HTMLButtonElement>('[data-download-email-draft]');
  const printSheet = document.querySelector<HTMLElement>('[data-quote-print-sheet]');
  const draftReferenceNodes = document.querySelectorAll<HTMLElement>('[data-draft-reference]');
  const submissionEnabled = root.dataset.submissionEnabled === 'true' && Boolean(root.dataset.submissionEndpoint);

  draftReferenceNodes.forEach((node) => { node.textContent = draftReference; });

  const setStatus = (message: string, tone: 'neutral' | 'success' | 'error' = 'neutral') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone;
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
    const packs = lines.reduce((total, line) => total + line.quantity, 0);
    if (selectionTotal) selectionTotal.textContent = `${lines.length} line${lines.length === 1 ? '' : 's'} · ${packs} pack${packs === 1 ? '' : 's'}`;
    if (reviewTotal) reviewTotal.textContent = `${lines.length} line${lines.length === 1 ? '' : 's'} · ${packs} pack${packs === 1 ? '' : 's'}`;

    if (summary) {
      summary.replaceChildren();
      lines.forEach(({ item, quantity }) => {
        const row = document.createElement('div');
        row.className = 'quote-summary-line';
        row.dataset.summarySku = item.sku;

        const copy = document.createElement('div');
        copy.append(createText('strong', quoteFamilyLabels[item.family], 'quote-product-label'));
        copy.append(createText('span', `${item.size} · ${item.lengthMm ? `${item.lengthMm} mm` : 'Length n/a'} · ${item.sku}`));

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
        quantityInput.setAttribute('aria-label', `Quantity for ${quoteFamilyLabels[item.family]} ${item.size} ${item.sku}`);
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
    if (reviewBody) {
      reviewBody.replaceChildren();
      lines.forEach(({ item, quantity }) => {
        const row = document.createElement('tr');
        const product = document.createElement('td');
        product.className = 'quote-review-product';
        product.append(createText('strong', quoteFamilyLabels[item.family], 'quote-product-label'));
        product.append(createText('span', item.fileType));
        [
          createText('td', item.sku),
          createText('td', String(quantity)),
          product,
          createText('td', item.size),
          createText('td', item.lengthMm ? `${item.lengthMm} mm` : '—'),
        ].forEach((cell) => row.append(cell));
        reviewBody.append(row);
      });
    }
    if (reviewEmpty) reviewEmpty.hidden = lines.length > 0;

    if (reviewDetails) {
      reviewDetails.replaceChildren();
      const customer = readCustomer();
      appendDetail(reviewDetails, 'Contact', customer.fullName);
      appendDetail(reviewDetails, 'Practice / account', customer.practice);
      appendDetail(reviewDetails, 'Email', customer.email);
      appendDetail(reviewDetails, 'Phone', customer.phone);
      appendDetail(reviewDetails, 'Account number', customer.accountNumber);
      appendDetail(reviewDetails, 'PO reference', customer.purchaseOrderReference);
      appendDetail(reviewDetails, 'Delivery', customer.deliveryAddress);
      appendDetail(reviewDetails, 'Notes', customer.notes);
    }
  };

  const setActiveFamily = (family: string) => {
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
      appendDetail(details, 'PO reference', customer.purchaseOrderReference);
      appendDetail(details, 'Delivery address', customer.deliveryAddress);
    }
    if (body) {
      body.replaceChildren();
      lines.forEach(({ item, quantity }) => {
        const row = document.createElement('tr');
        [item.sku, String(quantity), quoteFamilyLabels[item.family], item.size, item.lengthMm ? `${item.lengthMm} mm` : '—']
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
    if (customerForm?.contains(target as Node)) renderReview();
  });

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
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
    const previewLines = draft.lines.slice(0, 20).map(({ item, quantity }) => `${item.sku} - ${quoteFamilyLabels[item.family]} ${item.size} - Qty ${quantity}`);
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
      '',
      'No patient-identifiable information is included.',
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
    emailButton.textContent = 'Sending PDF request…';
    setStatus('Building the PDF and sending it directly to steveshepherdnz@gmail.com…');
    try {
      const emailPackage = await buildAttachedEmail();
      if (!emailPackage) {
        emailButton.disabled = false;
        emailButton.textContent = originalLabel;
        return;
      }
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
      emailButton.textContent = 'PDF request sent';
      setStatus(`Sent directly to steveshepherdnz@gmail.com with the PDF attached. Your reference is ${result.quoteReference}.`, 'success');
    } catch (error) {
      emailButton.disabled = false;
      emailButton.textContent = originalLabel;
      setStatus(error instanceof Error ? error.message : 'The PDF request could not be sent.', 'error');
    } finally {
      delete emailButton.dataset.busy;
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
  root.querySelectorAll<HTMLInputElement>('[data-quote-quantity]').forEach((input) => {
    const quantity = selections.get(input.dataset.sku || '');
    input.value = quantity ? String(quantity) : '';
  });
  setActiveFamily(root.querySelector<HTMLButtonElement>('[data-family-tab]')?.dataset.familyTab || 'et');
  renderSelections();
}
