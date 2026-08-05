# EndoTech NZ quotation-request builder

## Status

This is a review-only implementation on `codex/nz-quote-request-builder`.

- It is not linked from the production navigation.
- It is not merged or deployed.
- Online submission is disabled by default.
- The customer can build an unpriced request, download a multipage PDF, print/save a PDF, or prepare an email to `steveshepherdnz@gmail.com`.
- A formal EndoTech NZ quotation is still required before supply.

## Functional reference

The Singapore `/order/` workflow was inspected as a functional reference. Its useful patterns were retained:

- bulk quantity entry against exact SKUs;
- one combined live summary;
- customer/practice details and delivery information;
- a generated document and email-oriented handoff;
- a serverless boundary for any future submission.

The New Zealand implementation deliberately changes the model:

- Transform S™ and Micro-Path branding replaces Transform X and Acrobat;
- only the five initial NZ families are present;
- only confirmed rows from `src/data/nzLaunchCatalog.ts` are selectable;
- the document is an **unpriced quotation request**, not a pro forma invoice or order;
- the PDF is generated in the browser for review, so GitHub Pages remains purely static;
- the interface does not depend on Shopify;
- customer details are not stored in browser storage;
- submission cannot activate unless both a reviewed endpoint and an explicit enable flag are configured.

## Approved catalogue boundary

The source catalogue has 159 rows. The builder imports `nzCustomerSelectableCatalog`, which excludes all 38 `requiresConfirmation` rows and exposes 121 approved rows:

| Family | Selectable SKUs |
| --- | ---: |
| Transform S™ ET | 36 |
| Transform S™ PT | 20 |
| Micro-Path | 4 |
| Transform S™ C+ Files | 8 |
| Transform S™ K-Files | 53 |

`npm run check:quote-catalog` fails if these totals, SKU prefixes, uniqueness, or withdrawn brand identifiers drift unexpectedly.

## Review route

The local review route is:

```text
/quote-request/
```

It should stay unlinked until copy, product scope, privacy wording, PDF layout and the operational workflow have been approved.

## Future submission architecture

The recommended production arrangement is:

1. Keep `endotechnz.com` and the quotation interface on GitHub Pages.
2. Deploy an **NZ-only** serverless function on a separate Netlify site.
3. Set `PUBLIC_QUOTE_REQUEST_ENDPOINT` to that HTTPS function URL.
4. Keep `PUBLIC_QUOTE_REQUEST_SUBMISSION_ENABLED=false` until end-to-end testing is complete.
5. Enable the flag only after the endpoint, email identities and operating process are approved.

The browser adapter is `src/lib/quoteRequestSubmission.ts`. It sends no credentials, uses an explicit schema version, applies a short timeout, performs client-side catalogue validation, checks a honeypot/minimum-completion time and uses a one-minute client cooldown. These are usability safeguards only; the server remains authoritative.

### Request contract

```json
{
  "schemaVersion": "2026-08-06",
  "draftReference": "NZQ-DRAFT-20260806-103000-A1B2",
  "submittedAt": "2026-08-05T22:30:00.000Z",
  "customer": {
    "fullName": "Example contact",
    "practice": "Example Dental",
    "email": "contact@example.test",
    "phone": "+64 9 000 0000",
    "accountNumber": "",
    "deliveryAddress": "Example delivery address",
    "purchaseOrderReference": "",
    "notes": ""
  },
  "lines": [
    { "sku": "TSET-250425RF", "quantity": 2 }
  ],
  "source": {
    "site": "endotechnz.com",
    "path": "/quote-request/"
  },
  "antiAbuse": {
    "formStartedAt": "2026-08-05T22:29:20.000Z",
    "website": ""
  }
}
```

Successful response:

```json
{
  "ok": true,
  "quoteReference": "NZQ-20260806-00001"
}
```

The server must generate the authoritative `NZQ-` reference. It must not trust the draft reference, product names, family names, sizes, pack quantities or any future client-supplied prices.

## Required server controls before activation

The separate endpoint must include all of the following:

- allow POST and OPTIONS only;
- enforce a small request-body limit, for example 64 KB;
- allow browser origins only from `https://endotechnz.com` and any explicitly approved `www` origin;
- load a versioned server-side allow-list containing the same 121 confirmed SKUs;
- reject unknown, duplicate, withheld or malformed SKUs;
- accept whole-number quantities from 1 to 999 only;
- discard client product descriptions and rebuild them from the server catalogue;
- validate and length-limit every customer field;
- reject the honeypot, implausibly fast completion and replayed/idempotency keys;
- rate-limit by an appropriate privacy-preserving client key;
- add managed bot protection such as Cloudflare Turnstile if abuse warrants it;
- keep Resend/API keys and email identities exclusively in server environment variables;
- use an approved NZ sender identity and deliver internal requests only to the approved NZ account;
- escape all customer content in HTML email, filenames, spreadsheets and PDFs;
- generate the official PDF/server record after validation rather than accepting a customer-uploaded document as authoritative;
- return generic public errors while retaining restricted operational logs;
- define retention, deletion and access rules for customer contact and delivery data;
- avoid logging full addresses, phone numbers, notes or email bodies unnecessarily.

## PDF and privacy decisions

- The PDF uses the approved high-resolution Transform S™ wordmark and EndoTech NZ mark already in the website repository.
- It is designed as an A4 multipage document with repeated branding and page numbers.
- There is no price column.
- Every export states that it is not a quotation, invoice, purchase order or confirmed order.
- Product selections alone are stored locally to help customers continue a draft.
- Customer, practice, delivery and notes fields are never saved to local storage.
- The form and PDF both warn against patient-identifiable information.

## Operational review checklist

- Confirm the public name: “Quotation request” versus “Request a quote”.
- Confirm whether delivery address and phone should remain required.
- Confirm the account-number and purchase-order wording.
- Confirm the recipient mailbox and the future approved sender domain.
- Confirm whether the customer should receive an automated acknowledgement.
- Confirm whether a PDF attachment, internal spreadsheet and CRM record are all required.
- Confirm the final `NZQ-` numbering and who owns follow-up.
- Confirm privacy notice/retention wording with the business owner.
- Test desktop, mobile, keyboard-only, screen reader, long requests and PDF pagination.
- Complete abuse, CORS, rate-limit and catalogue-tampering tests before enabling submission.
