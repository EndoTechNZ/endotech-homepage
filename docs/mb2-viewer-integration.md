# MB2 3D viewer - local implementation

## Current correction: roots-up video v8 and mobile viewer v9

This section supersedes the historical implementation notes below. Stephen requested both live-site corrections on 14 September 2026 and had authorized commit, push and deployment. NZ and USA now share the corrected assets; NZ placement remains below protocol navigation and above Anatomy Map.

The current film is `Upper-Molar-With-MicroPath-Roots-Up-v8.mp4`: the existing 36-second roots-up anatomy introduction plus a re-rendered 32-second roots-up MicroPath animation. Only the camera presentation changed. Titles remain upright: EndoTech (72 px), Upper First Molar - Micropath (36 px), #13 - 03 Taper (51 px). Public links use the fresh `upper-molar-with-mb2-roots-up-v8.mp4` filename; the old canonical MP4 is also replaced so existing links recover. H264, 1920x1080, 24 fps, 68 seconds, 1,632 frames; full decode passed.

The previous viewer required a 16,384-pixel-wide float texture, rejecting GPUs with smaller limits. The same 16,093 path/basis samples now occupy a 4096x16 tiled texture. Phones also use a 1,244,760-byte anatomy display mesh (desktop: 4,996,192 bytes), one Draco worker, a 1x backbuffer and no multisampling/preserved backbuffer. Phone rendering drops from 2,785,666 to 686,470 drawn triangles. `prepare-mobile-anatomy.py` decimates temporary Blender objects and does not modify/save the approved master. Desktop anatomy and all motion/CAD data are unchanged. The lighter display does not change the prescribed glide path, full endpoint, file dimensions, rotation or stopper.

Local browser checks passed: Chrome with Pixel 7 emulation and an enforced 4096 texture limit; WebKit with iPhone 13 emulation; USA Chrome phone emulation; NZ desktop Chrome. Checked lazy load, whole/apical/cusp views, mode/reset controls, full feed 7.183999999982163, 21 mm CAD stopper setting, two revolutions/second, no contact marks, no horizontal overflow, and video HTTP 200. No console/page errors. This is browser emulation, not verification on Stephen's physical phone. A context-loss message retains a clear video fallback.

Engineering references: [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices), [Three renderer capabilities](https://threejs.org/docs/pages/WebGLRenderer.html), [Draco worker limit](https://threejs.org/docs/pages/DRACOLoader.html).

## Historical implementation notes

Status: Stephen authorized commit, push and live publication on 14 September 2026. Prepared for the existing NZ GitHub Pages deployment workflow. The module appears below the protocol navigation and above Anatomy Map, with “Watch video instead” links in both the module and standalone viewer. The approved web orientation, geometry and motion are unchanged.

Current video titles (revision 7): canonical `upper-molar-with-mb2.mp4` comes from `Full-Length-v4/Upper-Molar-With-MicroPath-13-03-EndoTech.mp4`. Closing text is “EndoTech” (72 px), “Upper First Molar - Micropath” (36 px), “#13 - 03 Taper” (51 px). The video camera, model and motion remain as approved; this text-only revision does not alter the web orientation below. Previous source MP4s are preserved.

Current web presentation: upper-molar orientation (14 September 2026). The camera is rolled 180 degrees before OrbitControls is initialized, so roots face up and the file enters from below. The same orientation applies to whole-tooth, entry, cusp and apical views and reset. Only the web presentation and its poster changed; anatomy.glb, motion.bin/json, the CAD/glide path and the existing MP4 were left untouched. The user clarified that the video should be left alone. The standalone self-contained HTML also uses this orientation. Build was made into output/build-orientation-v6 and only the completed viewer bundle/page copied into the running preview to avoid a transient 404.

Placement: `UpperMolarViewer.astro` is included on `/technique/mb2-file/` immediately before the technique section, below the protocol navigation and above Anatomy Map.

The poster loads first. The 3D iframe and its model/motion assets load only after the user chooses Load interactive 3D model. `/viewers/upper-molar-mb2/` is the standalone route. All assets, including Three.js and Draco, are self-hosted. No private Dropbox PDF or reference index is published.

Controls: combined view, canals only, tooth only, tooth opacity, apical close-up, chamber entry, stopper-at-cusp close-up, model auto-rotation, reset, full screen, file visibility, playback/scrubbing, orbit/pan/zoom. Autoplay is off. The parent tells the iframe when it is off-screen so motion/rendering can pause. Video remains available without WebGL.

## Current demonstration and limitations

Full-Length-v4 supersedes the rejected Contact-Study-v3. Stephen explicitly requested the normal thicker file on the existing approved glide path, reaching its previous full apical endpoint even where the enlarged display contacts the wall. The complete path file and the working-file/shank mesh are byte-identical to v3. Only the handle and its decorative sleeves gain another one-third width; their lengths and shank bands are unchanged. There are no contact patches or contact controls. Rotation remains 2 revolutions per second. This is a prescribed-path illustration, not a physically validated fit or cutting simulation; known file/wall overlap is not hidden or used to halt insertion.

At full feed 7.183999999982163, the actual CAD tip reaches the previous endpoint and the single stopper distal face sits at cusp-reference station -3.026176319885254. CAD tip z=36 minus stopper face z=15 is 21 mm. The axial display factor is 0.4861988723746389. A 46,800-ray footprint check found the stopper above the crown with only a 0.000168-model-unit minimum gap (numerical clearance). The handle remains entirely above the crown. The tooth is uncalibrated and file fitting is anisotropic: 21 mm is the CAD setting, not a calibrated specimen length. This illustrative 13/.03 L25 source CAD is not a dimensionally accurate representation of the 17 mm 15/.05 product discussed elsewhere on the MB2 page.

Source revision: `G:/Upper-Molar-Easy-View/MB2-MicroPath/Full-Length-v4`. It contains the self-contained viewer, editable Blender scene, full-pose GLB, motion data, and verification report. Prior revisions and original approved anatomy remain preserved.

Latest video text update uses `Upper-Molar-With-MicroPath-13-03.mp4`. The closing section now reads “Upper first molar – MicroPath” / “Size 13 · .03 taper”; the withdrawal heading and sentence are removed. Geometry and motion are unchanged. On 14 September the in-app preview tab was found displaying a 404; reloading it restored the complete model. Avoid opening the preview during an Astro rebuild, when the output directory may temporarily be incomplete. A video-only replacement does not need a page rebuild.

Reference material informed oblique chamber approach and chamber-outline access, while preserving the approved root path and canals. Public reading: [Mamoun 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC4926604/) and [AAE access guidance](https://www.aae.org/specialty/wp-content/uploads/sites/2/2017/07/ecfespring2010_final.pdf). Research-only figures were not copied into public assets.

## Rebuild and handoff

1. Generate and validate the source scene and motion package with the local modelling scripts; the asset-preparation script points at the selected revision.
2. Run `scripts/mb2-viewer/prepare-assets.py` using Blender in background mode to create compressed anatomy/static-pose GLBs and copy packed motion data.
3. Run `node scripts/mb2-viewer/sync-decoder.mjs` after installing dependencies.
4. Create the poster from the actual viewer, and copy the verified combined MP4 into the model asset directory.
5. Run `npm run build`, then desktop/mobile browser checks against the built site.
6. Obtain Stephen's approval before staging, committing, pushing or deploying.

The live NZ website has not been changed. The USA site is not part of this integration.
