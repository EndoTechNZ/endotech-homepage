import type { NzLaunchCatalogItem, NzLaunchFamily } from '../data/nzLaunchCatalog';

export const QUOTE_REQUEST_SCHEMA_VERSION = '2026-08-06';
export const QUOTE_REQUEST_MAX_QUANTITY = 999;

export const quoteFamilyLabels: Record<NzLaunchFamily, string> = {
  et: 'Transform S™ ET',
  pt: 'Transform S™ PT',
  'micro-path': 'Micro-Path',
  'c-plus': 'Transform S™ C+ Files',
  'k-files': 'Transform S™ K-Files',
};

export interface QuoteCustomerDetails {
  fullName: string;
  practice: string;
  email: string;
  phone: string;
  accountNumber: string;
  deliveryAddress: string;
  purchaseOrderReference: string;
  notes: string;
}

export interface QuoteRequestLine {
  sku: string;
  quantity: number;
}

export interface QuoteRequestAttachment {
  filename: string;
  contentBase64: string;
}

export interface QuoteRequestPayload {
  schemaVersion: string;
  draftReference: string;
  submittedAt: string;
  customer: QuoteCustomerDetails;
  lines: QuoteRequestLine[];
  attachment: QuoteRequestAttachment;
  source: {
    site: 'endotechnz.com';
    path: string;
  };
  antiAbuse: {
    formStartedAt: string;
    website: string;
  };
}

export interface ValidatedQuoteLine extends QuoteRequestLine {
  item: NzLaunchCatalogItem;
}

export interface QuoteValidationResult {
  ok: boolean;
  errors: string[];
  lines: ValidatedQuoteLine[];
}

const clean = (value: unknown) => String(value ?? '').trim();

export const normaliseQuoteQuantity = (value: unknown): number => {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > QUOTE_REQUEST_MAX_QUANTITY) {
    return 0;
  }
  return quantity;
};

export const validateQuoteCustomer = (customer: QuoteCustomerDetails): string[] => {
  const errors: string[] = [];
  const required: Array<[keyof QuoteCustomerDetails, string, number]> = [
    ['fullName', 'Contact name', 100],
    ['practice', 'Practice or account name', 140],
    ['email', 'Email address', 200],
    ['phone', 'Phone number', 50],
    ['deliveryAddress', 'Delivery address', 500],
  ];

  for (const [field, label, maxLength] of required) {
    const value = clean(customer[field]);
    if (!value) errors.push(`${label} is required.`);
    if (value.length > maxLength) errors.push(`${label} is too long.`);
  }

  if (clean(customer.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(customer.email))) {
    errors.push('Enter a valid email address.');
  }

  if (clean(customer.accountNumber).length > 80) errors.push('Account number is too long.');
  if (clean(customer.purchaseOrderReference).length > 100) errors.push('Purchase-order reference is too long.');
  if (clean(customer.notes).length > 1_500) errors.push('Notes are too long.');

  return errors;
};

export const validateQuoteLines = (
  lines: QuoteRequestLine[],
  approvedCatalog: NzLaunchCatalogItem[],
): QuoteValidationResult => {
  const errors: string[] = [];
  const allowed = new Map(
    approvedCatalog
      .filter((item) => !item.requiresConfirmation)
      .map((item) => [item.sku.toUpperCase(), item]),
  );
  const seen = new Set<string>();
  const validated: ValidatedQuoteLine[] = [];

  if (!Array.isArray(lines) || lines.length === 0) {
    errors.push('Select at least one product.');
    return { ok: false, errors, lines: validated };
  }

  for (const line of lines) {
    const sku = clean(line?.sku).toUpperCase();
    const quantity = normaliseQuoteQuantity(line?.quantity);
    const item = allowed.get(sku);

    if (!sku || !item) {
      errors.push(`SKU ${sku || '(missing)'} is not in the approved New Zealand launch catalogue.`);
      continue;
    }
    if (seen.has(sku)) {
      errors.push(`SKU ${sku} was submitted more than once.`);
      continue;
    }
    if (!quantity) {
      errors.push(`Quantity for ${sku} must be a whole number from 1 to ${QUOTE_REQUEST_MAX_QUANTITY}.`);
      continue;
    }

    seen.add(sku);
    validated.push({ sku, quantity, item });
  }

  return { ok: errors.length === 0, errors, lines: validated };
};

export const createQuoteRequestPayload = ({
  draftReference,
  customer,
  lines,
  formStartedAt,
  attachment,
  website = '',
  path = '/quote-request/',
}: {
  draftReference: string;
  customer: QuoteCustomerDetails;
  lines: QuoteRequestLine[];
  formStartedAt: string;
  attachment: QuoteRequestAttachment;
  website?: string;
  path?: string;
}): QuoteRequestPayload => ({
  schemaVersion: QUOTE_REQUEST_SCHEMA_VERSION,
  draftReference: clean(draftReference),
  submittedAt: new Date().toISOString(),
  customer: {
    fullName: clean(customer.fullName),
    practice: clean(customer.practice),
    email: clean(customer.email),
    phone: clean(customer.phone),
    accountNumber: clean(customer.accountNumber),
    deliveryAddress: clean(customer.deliveryAddress),
    purchaseOrderReference: clean(customer.purchaseOrderReference),
    notes: clean(customer.notes),
  },
  lines: lines.map((line) => ({ sku: clean(line.sku).toUpperCase(), quantity: normaliseQuoteQuantity(line.quantity) })),
  attachment: {
    filename: clean(attachment.filename),
    contentBase64: clean(attachment.contentBase64),
  },
  source: {
    site: 'endotechnz.com',
    path,
  },
  antiAbuse: {
    formStartedAt,
    website: clean(website),
  },
});
