# Restore the original homepage

The homepage immediately before the colourful redesign is preserved at tag
`homepage-original-before-colour-20260928` (commit `22bdb755b1f28e83ec259a86079cad16e5188dd1`).

When Stephen says **“step back to the original”**, restore only
`reviewed-site/index.html` from that tag, build and test, commit the restoration,
and deploy through the existing GitHub Pages workflow. Preserve unrelated work.
Do not reset the repository or rewrite history. Extra colour-homepage assets may
remain unused; they do not affect the original page.

The production homepage is the checked-in reviewed-site HTML. The one-time import
script accepts the approved concept HTML as its argument and preserves the original
mesh renderer and lower-page content. No local proxy or mock-up toolbar is deployed.
