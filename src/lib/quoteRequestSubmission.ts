import type { NzLaunchCatalogItem } from '../data/nzLaunchCatalog';
import {
  validateQuoteCustomer,
  validateQuoteLines,
  type QuoteRequestPayload,
} from './quoteRequest';

export interface QuoteRequestSubmissionConfig {
  enabled: boolean;
  endpoint: string;
  approvedCatalog: NzLaunchCatalogItem[];
  pageOrigin: string;
  timeoutMs?: number;
}

export interface QuoteRequestSubmissionResult {
  ok: true;
  quoteReference: string;
}

const MINIMUM_COMPLETION_MS = 2_500;
const CLIENT_COOLDOWN_MS = 60_000;
const LAST_SUBMISSION_KEY = 'endotechnz_quote_request_last_submission_v1';

const resolveEndpoint = (rawEndpoint: string, pageOrigin: string): URL => {
  let endpoint: URL;
  try {
    endpoint = new URL(rawEndpoint, pageOrigin);
  } catch {
    throw new Error('The quotation-request endpoint is not a valid URL.');
  }

  const isLocalDevelopment = endpoint.hostname === 'localhost' || endpoint.hostname === '127.0.0.1';
  if (endpoint.protocol !== 'https:' && !isLocalDevelopment) {
    throw new Error('The quotation-request endpoint must use HTTPS.');
  }
  if (endpoint.username || endpoint.password) {
    throw new Error('The quotation-request endpoint must not contain credentials.');
  }

  return endpoint;
};

const readLastSubmissionAt = (): number => {
  try {
    return Number(window.localStorage.getItem(LAST_SUBMISSION_KEY) || 0);
  } catch {
    return 0;
  }
};

const rememberSubmission = () => {
  try {
    window.localStorage.setItem(LAST_SUBMISSION_KEY, String(Date.now()));
  } catch {
    // Storage can be unavailable in private modes. Server-side rate limiting remains authoritative.
  }
};

export const submitQuoteRequest = async (
  payload: QuoteRequestPayload,
  config: QuoteRequestSubmissionConfig,
): Promise<QuoteRequestSubmissionResult> => {
  if (!config.enabled) {
    throw new Error('Online submission is not enabled for this review build.');
  }

  const endpoint = resolveEndpoint(config.endpoint, config.pageOrigin);
  const customerErrors = validateQuoteCustomer(payload.customer);
  const lineValidation = validateQuoteLines(payload.lines, config.approvedCatalog);
  if (customerErrors.length || !lineValidation.ok) {
    throw new Error([...customerErrors, ...lineValidation.errors][0] || 'The request could not be validated.');
  }

  if (payload.antiAbuse.website) {
    throw new Error('The request could not be submitted.');
  }

  const startedAt = Date.parse(payload.antiAbuse.formStartedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MINIMUM_COMPLETION_MS) {
    throw new Error('Please take a moment to review the request before sending it.');
  }

  const lastSubmissionAt = readLastSubmissionAt();
  if (lastSubmissionAt && Date.now() - lastSubmissionAt < CLIENT_COOLDOWN_MS) {
    throw new Error('Please wait one minute before sending another request.');
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), config.timeoutMs ?? 15_000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'error',
      referrerPolicy: 'strict-origin-when-cross-origin',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-EndoTech-Form-Version': payload.schemaVersion,
      },
      body: JSON.stringify(payload),
    });

    const body = await response.json().catch(() => ({})) as Partial<QuoteRequestSubmissionResult> & { error?: string };
    if (!response.ok || body.ok !== true || !body.quoteReference) {
      throw new Error(body.error || 'EndoTech NZ could not receive the request. Please download the PDF and email it instead.');
    }

    rememberSubmission();
    return { ok: true, quoteReference: String(body.quoteReference) };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('The request timed out. Please download the PDF and email it instead.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};
