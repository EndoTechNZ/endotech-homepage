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
- Keep the top film 110 mm wide (currently 55 mm tall) and the underside film 92 mm wide unless the
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

Current native source: `output/irrigation-tip-organizer-20261020/Irrigation-tip-organizer-approved-variant-label.blend` in the original design workspace. It was saved separately from the verified matched-photo source to preserve older native files. Regenerate using `scripts/apply_approved_variant_label.py` there. Native verification and GLB component comparison are saved alongside that source. Future edits should start from this approved native file.

## Single-tip opacity — 20 October 2026

The single-tip view (`?view=5`, or the Single tip button) starts at **35% tip surface opacity**. Assembly views start at 12%. Each mode keeps its own slider adjustment during the session; switching between them restores that mode's value. The slider, output text and rendered materials stay synchronized. The existing finer-nozzle opacity ratio of two thirds of the hub value is preserved.

The individual-tip product-page preview is captured from this same viewer at the 35% setting. Both the preview and viewer module/bootstrap use the cache token `single-tip-35-20261020`.
