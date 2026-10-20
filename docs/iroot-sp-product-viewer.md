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
- Keep the top film a 100 mm diameter circle and the underside film a 92 mm diameter circle unless the
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

The circular-label native source is preserved as `output/irrigation-tip-organizer-20261020/Irrigation-tip-organizer-round-label-100mm.blend` in the original design workspace. The current native model also includes the side outlets described below. Editable SVG, actual-size PDF, PNG and `label-copy.json` are in `artwork/round-label/` there. Regenerate artwork with `scripts/build_round_front_label.py`, then apply it with `scripts/apply_round_front_label.py`. That script reads `current-model.json` so later label revisions preserve the latest tip geometry. The earlier native models are preserved.

All 147 exported nodes other than the top label retain identical geometry, transforms and metadata. There are still 100 tips, 20 in each of five layers. The single-tip view and its product-page picture retain the 35% setting; assembly views retain 12%.

The model, label images, viewer bootstrap/module and full-kit preview are versioned `round-label-100mm-20261020`. The displayed verification revision is `round-label-100mm-single-tip-35-20261020`.

## Two distal side outlets — 20 October 2026

Current native source: `output/irrigation-tip-organizer-20261020/Irrigation-tip-organizer-two-side-outlets.blend` in the original design workspace, tracked by `current-model.json`. The shared tip mesh has two actual curved openings through the distal wall, 180° apart, with the same handedness, and a smooth closed rounded terminal end. The form follows Stephen's supplied CN223169817U patent PDF, claims 1–3 and Figures 5–6. The model's microscopic outlet dimensions are illustrative, rather than measured manufacturing dimensions.

Only the last 2.625 mm of the nozzle changes. The hub, wings, elbow, proximal nozzle and all 100 placements are preserved. All 48 non-tip nodes, including both labels, preserve their geometry, materials, transforms and metadata. Blender checks confirm a manifold shared tip mesh, two opposed open sectors through the side wall and a closed cap.

Single-tip mode still opens at 35% opacity. It allows closer manual zoom and adds **Zoom to side outlets**, followed by **View opposite outlet**, so both sides can be inspected. `?view=5&detail=outlets` opens the first outlet close-up directly. The rest of the six views and the separate assembly/single-tip opacity settings are retained.

Model and viewer code revision: `two-side-outlets-20261020`; displayed verification revision: `two-side-outlets-single-tip-35-20261020`. The round-label artwork files are unchanged. Geometry checks are saved as `side-outlets-verification.json` and `side-outlets-export-comparison.json` in the original working project.

## Current circular back label — 20 October 2026

Stephen requested the back label round as well. It is now an actual **92 mm diameter circular mesh**, centred on the 150 mm base with a **29 mm clear radial rim**. The existing manufacturer, representative, distributor, contact details, document revision and original supplied symbols are reflowed into the circle. The front label remains a 100 mm circle.

Current native source: `output/irrigation-tip-organizer-20261020/Irrigation-tip-organizer-round-front-and-back-labels.blend` in the original design workspace. `current-model.json` tracks the current native source, export and protected tip hash. The back artwork has an editable SVG, actual-size PDF, PNG, source symbols and `label-copy.json` in `artwork/round-back-label/`. Regenerate with `scripts/build_round_back_label.py`, then apply with `scripts/apply_round_back_label.py`. Both back and front label application scripts read the current manifest and preserve the latest tip geometry.

All 147 exported nodes other than the back label retain identical geometry, materials, transforms and metadata. The five layers of 20 tips, two opposed side outlets, closed rounded ends and 35% single-tip setting are preserved. `?view=6` opens the circular underside label. The full-kit preview is refreshed from the updated viewer; the single-tip preview is unchanged.

Model, artwork and viewer code revision: `round-back-label-92mm-20261020`; displayed verification revision: `round-back-label-92mm-single-tip-35-20261020`. Native checks and export comparison are in `round-back-label-verification.json` and `round-back-label-export-comparison.json` in the working project.
