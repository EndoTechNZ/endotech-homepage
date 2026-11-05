# iRoot SP Disposable Tips release — 5 November 2026

Stephen approved commit, push and deployment after reviewing the local page.
The page includes Coming soon, embedded pack/case and needle models, the approved
engineering image with 30 Gauge and 4% taper, and a black tip close-up with a
thin teal rim, shaded inner wall and lumen light. Hover rotates 30 degrees/second;
normal page scrolling drives 360 degrees. Reduced motion uses keyboard controls.

The existing Blender GLB is reused without modification:
SHA256 97f782116351652130fc34321f425d2c83e86f1ed470cf5e77600973d5f1cfd9.
Original native Blender files and the complete standalone viewer are preserved.
The VortiFlow URL redirects to the approved iRoot SP Disposable Tips name.

Full build and screenshots are stored on E:
E:/EndoTech Working Storage/Scratch/iroot-sp-3d-release-20261105/
Run npm run build:github, npm run check:navigation-layout, and
TIP_BASE_URL=<served final dist> node scripts/validate-iroot-tip.mjs.
Image-edit prompts are kept beside this release note.

Release integration also keeps the product header in normal flow on mobile and fixes an existing Explore-menu focus-transfer race that cancelled pointer clicks. Desktop and mobile product-link activation is covered by the required navigation check.
