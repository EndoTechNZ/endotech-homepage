"""Run with Blender --background --python. Does not modify the approved masters."""
from pathlib import Path
import bpy, numpy as np, json, shutil
from mathutils import Vector
from mathutils.bvhtree import BVHTree

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/models/upper-molar-mb2';OUT.mkdir(parents=True,exist_ok=True)
SOURCE=Path('G:/Upper-Molar-Easy-View/MB2-MicroPath/Full-Length-v4')
bpy.ops.wm.open_mainfile(filepath=str(SOURCE/'Upper-Molar-MB2-Editable.blend'))
tooth=bpy.data.objects['Tooth_Access_Prepared'];pulp=bpy.data.objects['Pulp_Chamber_Canals_Apical_Deltas']
stopper=bpy.data.objects['MicroPath_3_stopper']
# CAD tip z=36 mm; distal stopper face goes from z=12.4 to z=15: 36-15=21 mm.
cad_shift=0
full_length=json.loads((SOURCE/'full-length-config.json').read_text())
stopper['tip_to_distal_face_mm']=21.0;stopper['illustrative_fit']=True
export_opts=dict(export_format='GLB',use_selection=True,export_extras=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_draco_position_quantization=20,export_draco_normal_quantization=12)
bpy.ops.object.select_all(action='DESELECT');tooth.select_set(True);pulp.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'anatomy.glb'),**export_opts)
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
    if o.type=='MESH':o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'micropath-21mm-at-stop.glb'),**export_opts)

rig=np.load(SOURCE/'mb2-rig.npz');blob=bytearray();arrays={}
def pack(key,a):
    a=np.ascontiguousarray(a);offset=len(blob);blob.extend(a.tobytes());arrays[key]={'offset':offset,'length':a.size,'dtype':str(a.dtype)}
def convert(a):return np.column_stack([a[:,0],a[:,2],-a[:,1]]).astype(np.float32)
for key in ['points','normals','binormals','tangents']:pack(key,convert(rig[key]))
components=[]
for i,record in enumerate(json.loads((SOURCE/'cad-components.json').read_text())['components']):
    d=np.load(SOURCE/record['mesh']);v=d['vertices'].copy()
    if record['role']=='stopper':v[:,2]+=cad_shift
    for key,a in [('vertices',v),('normals',d['normals']),('faces',d['faces'])]:pack(str(i)+'_'+key,a.astype(np.uint32 if key=='faces' else np.float32))
    components.append({'role':record['role']})
shutil.copyfile(SOURCE/'animation-data.bin',OUT/'motion.bin')
shutil.copyfile(SOURCE/'animation-data.json',OUT/'motion.json')
video=SOURCE/'Upper-Molar-With-MicroPath-13-03-EndoTech.mp4'
if not video.exists():video=SOURCE/'Upper-Molar-With-MicroPath-13-03.mp4'
if not video.exists():video=SOURCE/'Upper-Molar-With-MB2-MicroPath.mp4'
if video.exists():shutil.copyfile(video,OUT/'upper-molar-with-mb2.mp4')
tooth.data.calc_loop_triangles();bvh=BVHTree.FromPolygons([list(v.co) for v in tooth.data.vertices],[list(t.vertices) for t in tooth.data.loop_triangles],all_triangles=True)
bad=0;min_dist=1e6
for v in stopper.data.vertices:
    p=v.co;near,n,idx,dist=bvh.find_nearest(p);min_dist=min(min_dist,dist)
    if (p-near).dot(n)<0 and dist<.1:bad+=1
handle=bpy.data.objects['MicroPath_2_handle'];crown_top=min(v.co.z for v in tooth.data.vertices);handle_max=max(v.co.z for v in handle.data.vertices)
report={'stopper_setting_mm':21,'cad_tip_z_mm':36,'cad_distal_stopper_face_z_mm':15,'axial_display_factor':.5,'radial_display_factor':.133,'non_uniform_physical_scale':True,'stopper_max_z':max(v.co.z for v in stopper.data.vertices),'stopper_min_wall_distance_model_units':min_dist,'stopper_near_surface_penetrations':bad,'handle_max_z':handle_max,'crown_top_z':crown_top,'entire_handle_above_crown':handle_max<crown_top,'anatomy_decimated':False,'draco_position_bits':20,'original_master_unchanged':True}
(ROOT/'output').mkdir(exist_ok=True)
report.update(axial_display_factor=full_length['axial'],diameter_multiplier=2,handle_width_multiplier_from_v3=4/3,stop_feed=full_length['stop_feed'],cusp_reference_station=full_length['cusp_reference_station'],stopper_station_error=full_length['stop_feed']-21*full_length['axial']-full_length['cusp_reference_station'],contact_marks=False,prescribed_path_not_collision_limited=True)
(ROOT/'output/mb2-stop-21mm-validation.json').write_text(json.dumps(report,indent=2))
assert bad==0 and report['entire_handle_above_crown'],report
print(json.dumps(report,indent=2),flush=True)
