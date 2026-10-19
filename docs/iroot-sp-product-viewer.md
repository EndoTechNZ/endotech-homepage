# iRoot SP Disposable Tips

Page: `/products/iroot-sp-disposable-tips/`

The public viewer is self-contained under `public/models/iroot-sp-disposable-tips/`.
It uses the approved Blender GLB without altering its geometry: 150 mm diameter,
75 mm height, five layers of 20 individually selectable tips. The supplied top
and underside label artwork is unchanged. The product page loads the viewer only
when requested and retains static photographs when WebGL is unavailable.

## Future label revisions

Do not revise the artwork until Stephen supplies approved changes.

- Editable label image inputs: `viewer/artwork/top-label.png` and
  `viewer/artwork/back-label.png` inside that asset directory.
- Keep the top film 110 mm wide and the underside film 92 mm wide unless the
  approved revision explicitly changes placement. Preserve the clear border.
- Update the corresponding PNG inputs in the original Blender project, rerun its
  label export and matching-angle renders, then replace `viewer/model.glb`, both
  artwork PNGs and the affected images in `photos/` together. The GLB contains
  embedded label images as well as the separately loaded website PNGs.
- Keep the approved tip geometry and 5 × 20 layout unchanged.
- Bump the GLB query version in `viewer/organizer.js` when publishing a new model.
- Build with `npm run build:github`; run `npm run check:navigation-layout` and
  verify the top, underside, layer and single-tip views in the final output.

The website does not need the large Blender source file. Retain that native file
and the original image inputs in the working project for later edits.
