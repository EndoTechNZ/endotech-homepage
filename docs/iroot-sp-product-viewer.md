# iRoot SP Disposable Tips

Page: `/products/iroot-sp-disposable-tips/`

The public viewer is self-contained under `public/models/iroot-sp-disposable-tips/`.
It uses the approved Blender GLB without altering its geometry: 150 mm diameter,
75 mm height, five layers of 20 individually selectable tips. The supplied top
and underside label artwork is preserved except for the explicitly approved front-label revision below. The product page contains exactly two tightly framed blue-grey previews. Both
are links to the full-page viewer; the tip link starts at `?view=5`. No brown
backgrounds or photo gallery are published.

## Future label revisions

Do not revise the artwork until Stephen supplies approved changes.

- Editable label image inputs: `viewer/artwork/top-label.png` and
  `viewer/artwork/back-label.png` inside that asset directory.
- Keep the top film a 100 mm diameter circle and the underside film 92 mm wide unless the
  approved revision explicitly changes placement. Preserve the clear border.
- Update the corresponding PNG inputs in the original Blender project, rerun its
  label export and matching-angle renders, then replace `viewer/model.glb`, both
  artwork PNGs and the affected neutral-background captures in `previews/` together. The GLB contains
  embedded label images as well as the separately loaded website PNGs.
- Keep the approved tip geometry and 5 × 20 layout unchanged.
- Bump the GLB and artwork query versions in `viewer/organizer.js` when publishing
  a new model; bump its bootstrap import version too when changing viewer code.
- Build with `npm run build:github`; run `npm run check:navigation-layout` and
  verify the top, underside, layer and single-tip views in the final output.

The website does not need the large Blender source file. Retain that native file
and the original image inputs in the working project for later edits.

## Approved Variant front label — 20 October 2026

Stephen selected `codex-clipboard-012a4b5a-58b1-40eb-b8f6-c458a704f562.png` and explicitly requested it on the live 3D model. The supplied artwork is used directly, including its fine frame and uppercase typography. Only the screenshot's external grey surround is removed: crop bounds `(37,17,1687,842)` produce a 1650 × 825 PNG. No lettering or illustration has been redrawn.

The top film is 110 × 55 mm, leaving a minimum 13.51 mm clear radial border on the 150 mm lid. The underside label remains 92 × 18.794 mm. All 147 exported nodes other than the top label retain identical geometry, transforms and metadata to the prior GLB; the five layers still contain 20 tips each. Surface translucency is unchanged.

Revision token: `approved-variant-label-20261020`. It versions the viewer bootstrap, module, model, separate label textures and full-kit preview to prevent stale artwork. The single-tip preview is unchanged.

Top PNG SHA-256: `c131ad561948cf72d37336a7f7690b4f06898fa168ae2b599088c46dfa89221d`.

The native source for this rectangular revision is preserved as `output/irrigation-tip-organizer-20261020/Irrigation-tip-organizer-approved-variant-label.blend` in the original design workspace. It has been superseded by the circular revision below.

## Single-tip opacity — 20 October 2026

The single-tip view (`?view=5`, or the Single tip button) starts at **35% tip surface opacity**. Assembly views start at 12%. Each mode keeps its own slider adjustment during the session; switching between them restores that mode's value. The slider, output text and rendered materials stay synchronized. The existing finer-nozzle opacity ratio of two thirds of the hub value is preserved.

The individual-tip product-page preview is captured from this same viewer at the 35% setting and uses the cache token `single-tip-35-20261020`.

## Current circular top label — 20 October 2026

Stephen requested a round label approximately 10 cm across on the 15 cm lid. The top label is now an actual **100 mm diameter circular mesh**, with a **25 mm clear radial rim** around it. The artwork is rearranged to fit the circle using the same IBC and iRoot SP marks, manufacturer, Sealing Paste and Disposable Tips wording, selected illustration and fine blue border. The underside label remains unchanged.

Current native source: `output/irrigation-tip-organizer-20261020/Irrigation-tip-organizer-round-label-100mm.blend` in the original design workspace. Editable SVG, actual-size PDF, PNG and `label-copy.json` are in `artwork/round-label/` there. Regenerate artwork with `scripts/build_round_front_label.py`, then apply it with `scripts/apply_round_front_label.py`. The earlier native models are preserved.

All 147 exported nodes other than the top label retain identical geometry, transforms and metadata. There are still 100 tips, 20 in each of five layers. The single-tip view and its product-page picture retain the 35% setting; assembly views retain 12%.

The model, label images, viewer bootstrap/module and full-kit preview are versioned `round-label-100mm-20261020`. The displayed verification revision is `round-label-100mm-single-tip-35-20261020`.
