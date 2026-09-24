# Reviewed NZ redesign release

Production: https://endotechnz.com (GitHub Pages, origin/main).

## Rollback tonight

Previous successful production commit: `e01ad89407730b317d8164ef07b1a5c49d0ee29c`.
Remote rollback tag: `rollback/nz-before-redesign-2026-09-24`.
Previous successful Actions run: `35940216826`.

To restore the previous site without rewriting history, revert the single redesign
release commit on main, push main, and wait for the Pages workflow to succeed.
Verify homepage and `/quote-request/` after the workflow completes. Do not force-push.
Alternatively, an authorised operator can manually run the Pages workflow on the
rollback tag to republish that exact revision, then reconcile main with a revert.

## Build structure

`reviewed-site/` contains the approved local redesign and its supporting assets.
Astro builds the existing site first. `scripts/apply-reviewed-site.mjs` then applies
the reviewed pages, removes local-only notices/noindex, and validates destinations.
Do not edit only the old Astro page for a reviewed route: update its reviewed HTML
as well, or migrate it back into Astro before retiring this transitional layer.

The quote form controls, scripts, data and submission endpoint are unchanged.
The bundled production `_astro` assets retain existing quote/PDF functionality.
No test request was submitted during release verification.
