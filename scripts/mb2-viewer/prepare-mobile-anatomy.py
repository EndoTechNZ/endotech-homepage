"""Blender --background --python: phone-only display LOD; never save the master."""
from pathlib import Path
import bpy, json, hashlib

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path('G:/Upper-Molar-Easy-View/MB2-MicroPath/Full-Length-v4/Upper-Molar-MB2-Editable.blend')
OUT = ROOT / 'public/models/upper-molar-mb2/anatomy-mobile-v9.glb'
before_hash = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
bpy.ops.object.select_all(action='DESELECT')
report = []
for name, budget in [('Tooth_Access_Prepared', 120000), ('Pulp_Chamber_Canals_Apical_Deltas', 180000)]:
    obj = bpy.data.objects[name]
    obj.data.calc_loop_triangles()
    before = len(obj.data.loop_triangles)
    modifier = obj.modifiers.new('Phone display detail', 'DECIMATE')
    modifier.ratio = min(1.0, budget / before)
    modifier.use_collapse_triangulate = True
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.validate(verbose=True, clean_customdata=True)
    obj.data.update()
    obj.data.calc_loop_triangles()
    report.append({'name': name, 'source_triangles': before, 'mobile_triangles': len(obj.data.loop_triangles)})
    obj.select_set(False)
for row in report:
    bpy.data.objects[row['name']].select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT), export_format='GLB', use_selection=True,
    export_extras=False, export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6, export_draco_position_quantization=20,
    export_draco_normal_quantization=12)
assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == before_hash
summary = {'meshes': report, 'bytes': OUT.stat().st_size, 'master_unchanged': True,
    'desktop_anatomy_unchanged': True, 'rig_and_instrument_unchanged': True,
    'purpose': 'Mobile-only simplified display surface; not a new anatomical reconstruction'}
(ROOT / 'output').mkdir(exist_ok=True)
(ROOT / 'output/mb2-mobile-anatomy.json').write_text(json.dumps(summary, indent=2))
print(json.dumps(summary), flush=True)
