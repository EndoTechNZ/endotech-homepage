# C+ NZ page release

Previous production revision: `4b983dce769789c0ba792c1e4818d463aa2fe6dc`.
Rollback tag: `rollback/nz-before-cplus-2026-09-25`.

Scope: approved local C+ page, catalogue illustration, NZ contact address,
six feature cards, Explore/footer links, and C+ family selection in the existing
NZ order form. No changes to submission, PDF generation, or product quantities.

The user-selected gold-standard headline is marketing wording, not a verified
clinical finding or Varian endorsement. No external attribution is displayed.
Detailed geometry and buckling claims remain qualified pending confirmation.

To roll back without rewriting history, revert this release commit, push to
origin/main, and verify the GitHub Pages deployment succeeds. Alternatively,
dispatch deploy-pages.yml on the rollback tag to restore the previous site,
then reconcile main with a revert. Do not force-push.

Verify `/`, `/products/c-plus/`, and `/quote-request/` after deployment.
An order must not be submitted as part of release verification.
