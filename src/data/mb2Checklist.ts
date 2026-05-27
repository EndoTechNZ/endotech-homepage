const mb2ChecklistVideos: Record<string, { videoTitle: string; videoUrl: string }> = {
  '01': {
    videoTitle: 'MB2 Canal: How to Find and Treat It? Step-by-Step Guide',
    videoUrl: 'https://www.youtube.com/watch?v=j7w-ZyW9w_s',
  },
  '02': {
    videoTitle: 'Role of CBCT in MB2 canal location',
    videoUrl: 'https://www.youtube.com/watch?v=fM5PNoogb10',
  },
  '03': {
    videoTitle: 'Finding MB2',
    videoUrl: 'https://www.youtube.com/watch?v=1-eZNmjxC4c',
  },
  '04': {
    videoTitle: 'In search of the elusive MB2 canal',
    videoUrl: 'https://www.youtube.com/watch?v=9RNWDlzbDPU',
  },
  '05': {
    videoTitle: 'MB2 Canal Discovery Tip',
    videoUrl: 'https://www.youtube.com/watch?v=x3RIsY8N-L4',
  },
  '06': {
    videoTitle: 'The Champagne Bubble Test for finding hidden canals',
    videoUrl: 'https://www.youtube.com/watch?v=2ZLqLjz_xv8',
  },
  '07': {
    videoTitle: 'Finding MB2',
    videoUrl: 'https://www.youtube.com/watch?v=1-eZNmjxC4c',
  },
  '08': {
    videoTitle: 'Ultrasonic troughing to find MB2',
    videoUrl: 'https://www.youtube.com/watch?v=4BGo3E-d2SI',
  },
  '09': {
    videoTitle: 'Step by step shaping of calcified MB2',
    videoUrl: 'https://www.youtube.com/watch?v=CAa-l6ZZoWw',
  },
  '10': {
    videoTitle: 'Glide Path Management: When a Ledge is a Block',
    videoUrl: 'https://www.youtube.com/watch?v=KcBYdWioT-Y',
  },
  '11': {
    videoTitle: 'Glide Path Management - Irregular Glide Path',
    videoUrl: 'https://www.youtube.com/watch?v=O9yclUIPCqA',
  },
  '12': {
    videoTitle: 'Glide Path Management - Working Length and Patency',
    videoUrl: 'https://www.youtube.com/watch?v=qLzjL-MOtoU',
  },
  '13': {
    videoTitle: 'Maxillary molar MB2 canal negotiation with CBCT and magnification',
    videoUrl: 'https://www.youtube.com/watch?v=WnoEvvvgo68',
  },
  '14': {
    videoTitle: 'Does locating the MB2 matter?',
    videoUrl: 'https://www.youtube.com/watch?v=JMv4VuVFwbk',
  },
  '15': {
    videoTitle: 'Missed MB2 canal CBCT endodontics case report',
    videoUrl: 'https://www.youtube.com/watch?v=JdaZQJIVha4',
  },
};

export const mb2ChecklistGroups = [
  {
    stage: 'Diagnose and orient',
    items: [
      {
        number: '01',
        title: 'Expect MB2 in maxillary molars',
        text: 'Assume the canal is present until the anatomy proves otherwise.',
        summary: 'Start every maxillary molar search with MB2 as the working assumption, not a rare exception.',
        detail:
          'MB2 anatomy is common enough that the clinical error is usually under-searching, not over-searching. Begin the case assuming a second mesiobuccal canal may be present, then let the chamber floor, radiographs, CBCT when indicated, and tactile feedback prove otherwise. This mindset changes the access plan: preserve the dentinal map, establish MB1, DB, and palatal landmarks first, and search deliberately rather than cutting randomly after the obvious canals have been found.',
      },
      {
        number: '02',
        title: 'Review angled radiographs; consider CBCT',
        text: 'Use angled PA views and CBCT when calcification, retreatment, unclear anatomy, or mesial pathology raises risk.',
        summary: 'Use imaging to decide whether the search needs more information before dentine is removed.',
        detail:
          'A straight-on radiograph can hide canal separation, mesial root curvature, and the buccolingual position of MB2. Angled periapical views help show whether the MB root outline, canal disappearance, or periapical change suggests hidden anatomy. CBCT is most useful when the chamber is calcified, the tooth has been previously treated, anatomy is unclear, or mesial pathology suggests a missed canal. The point is not to scan every case; it is to add information before access or troughing becomes guesswork.',
      },
      {
        number: '03',
        title: 'Create controlled access',
        text: 'Expose the chamber floor while preserving landmarks and avoiding both under-access and overcutting.',
        summary: 'Controlled access means enough visibility and line of entry without sacrificing the landmarks that guide MB2.',
        detail:
          'MB2 is often missed when access is too small to see the chamber floor or too aggressive to preserve useful color and groove anatomy. Open the chamber enough to visualize the pulpal floor, remove restrictive overhangs, and create a reproducible path for inspection. Preserve pericervical dentine and the chamber-floor map, but do not confuse contracted access with controlled access. If the file or ultrasonic tip is being asked to work around preventable coronal obstruction, refine the access first.',
      },
      {
        number: '04',
        title: 'Identify MB1, DB, and palatal canals first',
        text: 'Use the primary canals to orient the search before actively hunting for MB2.',
        summary: 'The known canal positions give the MB2 search its coordinate system.',
        detail:
          'Before searching for MB2, confirm MB1, distobuccal, and palatal canal positions. These landmarks define the developmental groove and prevent an uncontrolled hunt across the chamber floor. MB2 is commonly found palatal or mesial-palatal to MB1, but the exact position varies. Use the known canal map to decide where to inspect, trough, and scout. This reduces the risk of chasing stains, bubbles, or shelves in the wrong direction and makes any later variation easier to interpret.',
      },
    ],
  },
  {
    stage: 'Read and expose',
    items: [
      {
        number: '05',
        title: 'Read the dentinal map',
        text: 'Preserve color changes and developmental grooves, especially palatal or mesial-palatal to MB1.',
        summary: 'The chamber floor is a map; avoid polishing away the clues before they have been read.',
        detail:
          'Color change, developmental grooves, and the relationship between MB1 and the palatal canal often reveal the direction of the MB2 search. Keep the chamber floor clean, wet, and visible under magnification. Do not flatten, polish, or overprepare the floor before reading it. The dentinal map should guide where ultrasonic refinement begins and where a small file is introduced. When the map is subtle, slow inspection is safer than widening access in every direction.',
      },
      {
        number: '06',
        title: 'Look for white-line, red-line, bubble, and color clues',
        text: 'Treat subtle lines, hypochlorite bubbles, and chamber-floor color change as locating information.',
        summary: 'Small visual signs can identify a hidden orifice before it is mechanically opened.',
        detail:
          'A white line may show a developmental groove or calcified track. A red line may reveal pulpal tissue in a narrow pathway. A persistent hypochlorite bubble can mark a small orifice or tissue space. Color change can distinguish chamber floor from reparative dentine. None of these signs is proof by itself, but together they form a direction. Use them to narrow the search, then confirm with gentle troughing and passive scouting rather than force.',
      },
      {
        number: '07',
        title: 'Remove the mesial dentine shelf deliberately',
        text: 'Improve visibility and line of entry without blind or aggressive excavation.',
        summary: 'The mesial shelf can hide MB2 and deflect instruments; remove it only with a clear purpose.',
        detail:
          'MB2 often sits beneath or behind a mesial dentine shelf between MB1 and the isthmus area. Removing this shelf improves visibility and creates a straighter line for inspection and initial negotiation. The removal must be deliberate: brush, inspect, irrigate, and reassess. Avoid blind digging toward an expected location. The goal is to uncover anatomy and remove coronal interference, not to create a trough so deep that the floor landmarks are lost.',
      },
      {
        number: '08',
        title: 'Use ultrasonics for controlled troughing',
        text: 'Brush, refine, irrigate, and inspect repeatedly rather than cutting past the anatomy.',
        summary: 'Ultrasonics should refine the map and uncover the orifice, not replace diagnosis.',
        detail:
          'Ultrasonic troughing is useful because it removes small amounts of dentine with visibility and control. Use light brushing strokes along the developmental groove, then irrigate and inspect before continuing. Work from known anatomy toward suspected anatomy. Stop often to look for a catch point, color change, or bubble response. If the trough is lengthening without new information, pause and re-orient. Controlled troughing is a sequence of inspect-refine-inspect, not continuous cutting.',
      },
    ],
  },
  {
    stage: 'Negotiate and shape',
    items: [
      {
        number: '09',
        title: 'Scout passively with small precurved K-files',
        text: 'Make sure you learn exactly how to pre-curve #08 or #10 K-files. It is only the last three flutes of the hand file, maximum 2 mm, that you pre-curve.',
        summary: 'Use a very small terminal curve to read the canal direction without forcing the file.',
        detail:
          'Once MB2 is suspected or exposed, scout with a small pre-curved #08 or #10 K-file. The curve belongs only in the last three flutes, about 1-2 mm at the tip, so the file can read the path while the shaft remains controllable. Introduce the file gently and use tactile feedback to confirm direction. If it does not advance passively, withdraw, clean, recurve, irrigate, and reassess the access. The objective is direction first, not length at any cost.',
      },
      {
        number: '10',
        title: 'If the file binds, stop and reassess',
        text: 'Binding suggests coronal interference or curvature that needs access refinement before progression.',
        summary: 'Binding is information that the pathway is not yet ready for progression.',
        detail:
          'A binding file should not be pushed, wound harder, or treated as proof that progress is being made. Binding can mean dentine shelf interference, a sharp curvature, a calcified track, debris, or a false direction. Stop, irrigate, inspect, and ask whether the coronal path needs refinement. Reconfirm the entry angle and whether the file returns to the same path. Progress only when the file can move with controlled feedback rather than forced advancement.',
      },
      {
        number: '11',
        title: 'Build a smooth glide path',
        text: 'Rotary shaping should follow a reproducible path with minimal torsional stress.',
        summary: 'The shaping file should receive a pathway it can re-enter, not a mystery it must discover.',
        detail:
          'A glide path is not a single lucky pass to length. It is a reproducible route that the instrument can leave and re-enter without force. Confirm that the small file returns to the path predictably before rotary shaping. Acrobat MB2 or other glide-path files should follow the proven direction, using feedback to confirm forward movement. A smooth glide path reduces torsional load, protects the apical third, and makes the handoff into TransformX shaping more controlled.',
      },
      {
        number: '12',
        title: 'Irrigate and recapitulate throughout',
        text: 'Maintain patency and reduce debris compaction with frequent irrigation and small-file recapitulation.',
        summary: 'MB2 is narrow and debris-sensitive; irrigation and recapitulation are part of pathway control.',
        detail:
          'MB2 canals can be narrow, curved, and connected to MB1 through an isthmus. Debris can block the path quickly, especially after troughing or early shaping. Irrigate frequently, clean flutes, and recapitulate with a small file to confirm the pathway still exists. This protects working length and keeps tactile feedback readable. If the canal stops behaving the same way, do not simply continue the sequence; re-establish the path before asking a shaping file to work.',
      },
    ],
  },
  {
    stage: 'Confirm and decide',
    items: [
      {
        number: '13',
        title: 'Confirm the MB2 pathway',
        text: 'Determine whether MB2 merges with MB1, exits independently, or connects through an isthmus.',
        summary: 'MB2 treatment decisions depend on whether the canal merges, separates, or communicates through an isthmus.',
        detail:
          'After negotiation, confirm the pathway rather than assuming every MB2 behaves the same way. MB2 may merge with MB1, maintain an independent exit, or communicate through an isthmus. This affects shaping, irrigation, obturation, and the risk of over-enlarging a narrow path. Use tactile feedback, working length behavior, radiographs, and CBCT information when available. The question is not only whether MB2 exists; it is how it connects to the mesiobuccal root system.',
      },
      {
        number: '14',
        title: 'In retreatment, suspect missed MB2',
        text: 'Persistent or recurrent mesial root pathology should raise suspicion of untreated anatomy.',
        summary: 'A previously treated maxillary molar with mesial pathology should trigger an MB2 search strategy.',
        detail:
          'In retreatment, a missed MB2 is a common explanation for persistent symptoms or recurrent mesial root pathology. Do not assume the prior access found all anatomy. Reassess the chamber floor, old filling material, posts, calcification, and restorative limitations. CBCT may be especially useful when anatomy is blocked or altered by previous treatment. The search should still be conservative: restore visibility, read the map, remove obstruction deliberately, and confirm any suspected pathway before shaping.',
      },
      {
        number: '15',
        title: 'Final decision: proceed or refer',
        text: 'Proceed only when visualization, anatomy, and instrument control make treatment predictable.',
        summary: 'Proceed only if the case can be treated with visibility, pathway control, and a predictable stop point.',
        detail:
          'The final decision is a control decision. Proceed when MB2 has been located or reasonably excluded, the access is controlled, the glide path is reproducible, and shaping can be performed without forcing. Refer when visibility is poor, calcification is advanced, the path cannot be confirmed, the file repeatedly binds, or retreatment anatomy makes the case unpredictable. Referral before perforation, ledging, transportation, or instrument separation preserves options and is often the safest clinical choice.',
      },
    ],
  },
];

export const mb2ChecklistItems = mb2ChecklistGroups.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    ...(mb2ChecklistVideos[item.number] ?? {}),
    stage: group.stage,
  })),
);

export const mb2ChecklistSources = [
  'EndoTech NZ 15-point MB2 protocol checklist source document.',
  'Al Mheiri E, Chaudhry J, Abdo S, El Abed R, Khamis AH, Jamal M. Evaluation of root and canal morphology of maxillary permanent first molars in an Emirati population; a cone-beam computed tomography study. BMC Oral Health. 2020;20:274. doi:10.1186/s12903-020-01269-2.',
  'Vertucci FJ. Root canal anatomy of the human permanent teeth. Oral Surgery, Oral Medicine, Oral Pathology. 1984;58(5):589-599. doi:10.1016/0030-4220(84)90085-9.',
  'Kulild JC, Peters DD. Incidence and configuration of canal systems in the mesiobuccal root of maxillary first and second molars. Journal of Endodontics. 1990;16(7):311-317. doi:10.1016/S0099-2399(06)81940-0.',
  'Stropko JJ. Canal morphology of maxillary molars: clinical observations of canal configurations. Journal of Endodontics. 1999;25(6):446-450. doi:10.1016/S0099-2399(99)80276-3.',
  'Cleghorn BM, Christie WH, Dong CCS. Root and root canal morphology of the human permanent maxillary first molar: a literature review. Journal of Endodontics. 2006;32(9):813-821. doi:10.1016/j.joen.2006.04.014.',
  'Local EndoTech MB2 access, reference-image, and anatomy-book folders were used for workflow structure and redrawn teaching diagrams; unpublished reference-only images are not reused directly.',
];

export const mb2ChecklistReferenceNote =
  'The MB2 checklist combines the local EndoTech protocol document with anatomy, CBCT prevalence, canal-configuration, and clinical-observation literature. The page uses these sources to support controlled access, deliberate troughing, passive scouting, glide path confirmation, and referral decisions.';
