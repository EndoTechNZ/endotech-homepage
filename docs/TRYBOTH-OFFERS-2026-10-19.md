# TRYBOTH Offers page

`/offers/#tryboth` presents the existing NZ$30 plus GST and postage bundle before the request form. Product images and labels are single keyboard-accessible links to `/technique/mb2-file/#mini-magic` and `#orifice-shaper-1708`. Hover and focus highlight the associated name and full specification together over 220 ms; reduced-motion settings remove the transition.

Mini Magic remains 15/.05, 17 mm, six files. The Orifice Shaper remains 17/.08, 17 mm, six files. Pricing comes from `shared/nz-promo-offers.mjs`; the existing request form and promo validation remain authoritative.

The size-17 comparative access sentence was supplied by Stephen for this release. Images reuse the approved Mini Magic artwork and the existing SVG display of the real photographed Orifice Shaper, preserving its flute geometry.

The Offers page is Astro-generated. The MB2 route still uses the reviewed HTML overlay: `apply-reviewed-site.mjs` inserts the generated `Mb2OrificeShaper` component and the two product anchors into that reviewed route. It also adds Offers to reviewed headers and routes the homepage offer links to the new page. Changes to the two product references must remain in the Astro source and this overlay integration.

Verified locally with the full GitHub build, internal link validation, desktop/mobile browser views, both product hovers, MB2 anchor clearance, and applying TRYBOTH to add the two correct six-packs at NZ$34.50 including GST. No request was submitted. The promo anchor clears the sticky header and highlights its input on arrival.
