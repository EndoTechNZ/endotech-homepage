export interface WeeklyClinicalSource {
  label: string;
  url: string;
}

export interface WeeklyClinicalSection {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  points?: string[];
}

export interface WeeklyClinicalArticle {
  question: string;
  standfirst: string;
  sections: WeeklyClinicalSection[];
  chairsideChecks: string[];
  sources: WeeklyClinicalSource[];
  stages?: Array<{
    stage: string;
    title: string;
    criteria: string;
    outcome: string;
    signal: 'favourable' | 'guarded' | 'high-risk';
  }>;
}

export const weeklyClinicalArticles: Record<string, WeeklyClinicalArticle> = {
  'iowa-staging-index-cracked-teeth': {
    question: 'Can we turn a visible crack into a prognosis the patient can actually understand?',
    standfirst:
      'The Iowa Staging Index does not tell us whether every cracked tooth should be treated. It gives structure to a narrower—and very useful—question: once a cracked posterior tooth requires root canal treatment and restoration, which clinical findings make success more or less likely?',
    stages: [
      {
        stage: 'Stage I',
        title: 'Mesial-only crack, no apical disease',
        criteria: 'Crack-associated probing is less than 5 mm; no distal marginal-ridge crack; no periapical pathosis.',
        outcome: '93% success in the original cohort',
        signal: 'favourable',
      },
      {
        stage: 'Stage II',
        title: 'Distal ridge involved',
        criteria: 'Probing remains less than 5 mm; a distal marginal-ridge crack is present; no periapical pathosis.',
        outcome: '84% success in the original cohort',
        signal: 'favourable',
      },
      {
        stage: 'Stage III',
        title: 'Apical disease joins the picture',
        criteria: 'Probing remains less than 5 mm; distal marginal ridge is involved; periapical disease is present.',
        outcome: '69% success in the original cohort',
        signal: 'guarded',
      },
      {
        stage: 'Stage IV',
        title: 'A deep crack-associated pocket',
        criteria: 'A probing depth of 5 mm or more is present along the crack, regardless of marginal-ridge location.',
        outcome: '41% success in the original cohort',
        signal: 'high-risk',
      },
    ],
    sections: [
      {
        eyebrow: 'Start with diagnosis',
        title: 'A crack line is a finding—not a pulpal diagnosis and not a treatment plan.',
        paragraphs: [
          'The first task is to establish whether this is a superficial craze line, a cracked tooth extending into dentine, a fractured cusp, a split tooth or a vertical root fracture. Those entities do not share the same biology or prognosis. The European Society of Endodontology defines a cracked tooth as a dentinal crack of unknown depth that may extend subcrestally and may involve the pulp. A split tooth, by contrast, has complete visible separation and an unfavourable prognosis.',
          'Begin with the history: pain on loading or release, temperature sensitivity, spontaneous pain, previous episodes, a remembered hard-food event, previous fractured teeth and possible parafunction. Then examine the tooth clean and dry under strong illumination and magnification. Transillumination can reveal how light is interrupted, while a high-quality clinical photograph records what was actually visible before treatment. Staining may help in selected cases, but colour alone cannot reveal the true depth of a crack.',
          'Localise the familiar symptom gently, cusp by cusp. Probe the entire sulcus and record the exact depth and site of any isolated defect rather than writing “deep pocket”. Compare cold responses, percussion and palpation with control teeth, assess mobility, and obtain appropriate periapical and bitewing views. A normal radiograph does not exclude a crack: the ESE statement notes that only a small minority of vital cracked teeth show the crack radiographically. CBCT can reveal associated bone changes when conventional findings are inconclusive, but it cannot reliably display every fine crack.',
        ],
        points: [
          'Dry, magnify, transilluminate and photograph before removing tooth structure.',
          'Reproduce biting pain gently and stop when the patient recognises the symptom.',
          'Chart six-point probing and identify whether a deep site follows the crack line.',
          'Record separate pulpal and apical diagnoses; “cracked tooth” is not enough.',
        ],
      },
      {
        eyebrow: 'What the index measures',
        title: 'Three findings move the original Iowa stage: pocket depth, distal ridge involvement and apical disease.',
        paragraphs: [
          'Krell and Caplan developed the Iowa Staging Index from a 25-year observational dataset of cracked teeth receiving orthograde root canal treatment. Among the teeth available for multivariable outcome analysis, 82% met the study definition of success at 12 months. The three clinical variables most strongly associated with outcome were crack-associated probing depth, a distal marginal-ridge crack and the periapical diagnosis.',
          'The order matters. First ask whether a crack-associated periodontal probing is 5 mm or deeper. If it is, the tooth enters Stage IV. If probing remains below 5 mm, look for distal marginal-ridge involvement. Its absence places the case in Stage I; its presence leads to the final question—whether periapical disease is present—separating Stage II from Stage III.',
          'These are outcome groups, not a biological claim that every crack progresses neatly from I to IV. They were derived from teeth selected for root canal treatment and then restored, so the index should not be applied to every asymptomatic craze line or used to justify endodontic treatment by itself. It is most useful after the pulpal diagnosis and restorability assessment indicate that treatment is being considered.',
        ],
      },
      {
        eyebrow: 'The modified index',
        title: 'Coronal versus radicular extension adds information the original tree could not show.',
        paragraphs: [
          'A newer retrospective cohort divided each Iowa stage into C and R subgroups. “C” meant the crack remained within the pulp chamber; “R” meant it extended beyond a canal orifice into the root. Across 263 treated posterior teeth followed for one to five years, overall success was 82.9% and survival was 89.7%. Success ranged from 98.3% for Stage I-C to 33.3% for Stage IV-R.',
          'The most useful message is not that any radicular extension automatically condemns the tooth. Short radicular extensions can be retained in selected cases. Risk rose sharply when a radicular crack of 3 mm or more combined with a crack-associated probing depth of at least 5 mm. In that cohort, teeth with neither finding achieved 93.2% success; teeth with both achieved 33.3%. That combination deserves a distinctly different consent conversation.',
          'Stage IV-C is a reminder not to over-read small subgroups: it showed 75% success, but included only four teeth. The modified figures come from one retrospective protocol with defined exclusions, microscope-assisted assessment, root canal treatment and restorative management. They refine prognosis; they do not replace judgement about restorability, patient priorities, operator skill or the possibility that exploration will reveal a non-restorable fracture.',
        ],
        points: [
          'C = crack confined to the chamber; R = extension beyond a canal orifice into the root.',
          'Radicular extension of 3 mm or more was an independent failure predictor.',
          'A pocket of 5 mm or more along the crack remained one of the strongest warning signs.',
          'Multiple crack lines, a periapical lesion and unmanaged parafunction also reduced prognosis.',
        ],
      },
      {
        eyebrow: 'From stage to plan',
        title: 'Use the stage to shape the consultation—not to skip the restorative questions.',
        paragraphs: [
          'Before promising root canal treatment, ask whether the tooth can be isolated, sealed and restored with a durable cuspal-protection strategy. Inspect the opposing tooth and the contact pattern in closure and excursions. Ask why previous teeth were lost, whether an appliance is worn or damaged, and whether clenching, grinding or heavy chewing is plausible. The modified-index cohort identified multiple cracks, lack of an occlusal splint in patients with parafunctional habits, and the definitive restoration as additional outcome variables.',
          'Crack tracing should have a stopping point. Removing every stained line can sacrifice sound dentine, expose the pulp or destroy a maintainable margin without proving that the crack has been eliminated. Explore only when the result can change diagnosis or treatment, under isolation and magnification, and reassess remaining structure as you proceed. If the segments separate, the crack crosses the pulpal floor extensively, the periodontal defect is non-maintainable or a predictable restoration cannot be achieved, the plan changes.',
          'Where the pulp is vital and the tooth is restorable, not every crack needs immediate root canal treatment. Practice-based evidence shows that many posterior teeth selected for monitoring remain under monitoring at three years. Where irreversible pulpitis, necrosis or apical disease is present and the tooth remains restorable, endodontic treatment can offer meaningful survival. The stage helps explain the gradient of risk; the pulpal diagnosis determines whether endodontic treatment is indicated.',
        ],
      },
      {
        eyebrow: 'The patient conversation',
        title: 'Show the evidence, name the uncertainty and agree what would trigger reassessment.',
        paragraphs: [
          'A useful consultation separates “success” from “survival”. In the Iowa literature, success is the stricter clinician-centred outcome: resolution of previous pathosis with no signs or symptoms. Survival is patient-centred: the tooth remains present, functional and asymptomatic, even if it has not met every radiographic healing criterion. Patients should know which outcome a percentage refers to.',
          'Show the photograph, the probing chart and the radiographs. Explain the stage in plain language: “Your tooth has a crack, but the gum attachment beside it is still shallow,” or “This isolated deep pocket suggests the crack may communicate farther down the root.” Discuss reasonable options, the need for timely definitive cuspal protection when treating a cracked tooth, the possibility of later pulpal disease or fracture, and the consequences of delay.',
          'Document the findings and the limits of what can be known before access or restoration removal. Arrange review of symptoms, pulp status, periodontal probing and radiographic healing. New spontaneous pain, swelling, mobility, a deeper isolated pocket or worsening biting pain should bring the review forward. A transparent plan is safer than promising that a crack has been “fixed”.',
        ],
      },
      {
        eyebrow: 'A practical synthesis',
        title: 'The index works best as one layer in a controlled cracked-tooth workflow.',
        paragraphs: [
          'The ten chairside ideas from this week’s clinical review fit naturally around the index: make the crack visible; localise the symptom; diagnose the pulp separately; understand the limits of a PA; distinguish a craze line from structural disease; ask about fracture history; assess the opposing dentition; set a stopping point for exploration; match cuspal protection to the remaining tooth; and make uncertainty part of consent.',
          'Used this way, the Iowa stage is neither a verdict nor a decorative number. It is a disciplined summary of the findings most likely to change prognosis. It helps the clinician and patient see why a shallow, coronal, single crack without apical disease is a different proposition from a radicular crack accompanied by a 6 mm isolated pocket and a periapical lesion.',
        ],
      },
    ],
    chairsideChecks: [
      'Have the crack type, pulpal diagnosis and apical diagnosis been recorded separately?',
      'Was probing completed circumferentially and the crack-associated depth documented?',
      'Is the distal marginal ridge involved?',
      'Is there periapical disease—not merely a negative radiograph for the crack itself?',
      'If accessed, is the crack coronal or radicular, and how far does it extend beyond the orifice?',
      'Can the tooth be isolated, sealed and protected with a durable definitive restoration?',
      'Have parafunction, opposing contacts, alternatives and uncertainty been discussed?',
    ],
    sources: [
      {
        label: 'Krell & Caplan (2018): original Iowa Staging Index study',
        url: 'https://pubmed.ncbi.nlm.nih.gov/29429822/',
      },
      {
        label: 'Wongkornchaowalit et al. (2025): Modified Iowa Index',
        url: 'https://doi.org/10.1016/j.joen.2025.08.012',
      },
      {
        label: 'ESE (2025): position statement on longitudinal cracks and fractures',
        url: 'https://doi.org/10.1111/iej.14186',
      },
      {
        label: 'AAE: Cracked Teeth and Vertical Root Fractures—Colleagues for Excellence',
        url: 'https://www.aae.org/specialty/wp-content/uploads/sites/2/2022/12/ecfe-2022-edition-FINAL.pdf',
      },
      {
        label: 'Leong et al. (2020): systematic review and meta-analysis of endodontically treated cracked teeth',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31797172/',
      },
      {
        label: 'Ferracane et al. (2022): three-year treatment and monitoring outcomes',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8898304/',
      },
      {
        label: 'Zhang et al. (2024): systematic review and meta-analysis of cracked-tooth treatment outcomes',
        url: 'https://doi.org/10.1016/j.jdent.2024.104843',
      },
      {
        label: 'Kakka et al. (2022): comprehensive narrative review',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9562569/',
      },
      {
        label: 'Protrusive PDP246: Cracked Teeth Clinical Guidelines',
        url: 'https://www.youtube.com/watch?v=VHYRBnfJS3I',
      },
      {
        label: 'Protrusive PS019: Understanding Cracked Tooth Syndrome and the Dental Occlusion Triad',
        url: 'https://www.youtube.com/watch?v=mU8mM8ZNIVU',
      },
    ],
  },
  'what-heat-treatment-really-does-to-a-niti-file': {
    question: 'What does heat treatment do to an endodontic file?',
    standfirst:
      'It changes how the file behaves inside the canal: how easily it bends, how strongly it tries to straighten, how much twisting it can tolerate and how resistant it is to cyclic fatigue.',
    sections: [
      {
        eyebrow: 'The metallurgy',
        title: 'Austenite and martensite behave differently.',
        paragraphs: [
          'Nickel-titanium can exist in different metallurgical phases. The two we are most interested in clinically are austenite and martensite.',
          'An austenitic file is superelastic. Bend it and it wants to return to its original shape. That spring-back gives the instrument useful strength and a sense of backbone. It may help the file advance through a narrow canal, resist buckling or penetrate material during retreatment.',
          'That restoring force can work against us in a curved canal. The file continually tries to straighten. As it presses against the outside of a curve, it can remove dentine unevenly and transport the canal away from its original anatomy.',
          'A more martensitic file behaves differently. It is softer, more flexible and produces much lower restoring forces. It can accept the shape of a curved canal instead of fighting to return immediately to a straight position.',
          'Manufacturers use heat treatment to change the temperatures at which nickel-titanium moves between these phases. By adjusting that transformation behaviour, they can tune the clinical properties of the instrument.',
        ],
      },
      {
        eyebrow: 'Inside the curve',
        title: 'Flexibility changes stress at the canal wall and within the file.',
        paragraphs: [
          'A file with more martensitic behaviour will generally negotiate curves with less pressure against the canal wall. This is particularly useful in abrupt, multiplanar or severely curved canals, where we want the instrument to remain within the existing anatomy.',
          'Every rotation inside a curve places the file under alternating stress. The metal on the outside of the curve is placed under tension while the inside is compressed. As the instrument rotates, each part of the file cycles repeatedly between those two states. That is cyclic fatigue.',
          'A more flexible, heat-treated file can generally tolerate this repeated bending better than a stiffer instrument. This does not make it immune to fracture, but it can improve its fatigue resistance in demanding anatomy.',
          'Heat treatment also affects what happens when the tip binds. If the tip locks in the canal while the shank continues to rotate, the file is subjected to torsional stress. A martensitic instrument can often twist through a greater angle before it fractures. Because we cannot see the tip working inside the root, that additional torsional deflection may provide a useful safety margin before separation.',
        ],
      },
      {
        eyebrow: 'The trade-off',
        title: 'The softest file is not automatically the best file for every procedure.',
        paragraphs: [
          'Sometimes we need flexibility and low restoring force. At other times, we need enough stiffness to resist buckling and move through a restrictive pathway. During retreatment, an instrument may need more backbone to penetrate gutta-percha. A file that is extremely soft may feel less decisive in those situations.',
          'This is the trade-off manufacturers are managing. More martensitic behaviour usually means greater flexibility, lower restoring force and better cyclic-fatigue resistance. More austenitic behaviour generally provides greater stiffness, stronger shape recovery and more resistance to buckling.',
        ],
      },
      {
        eyebrow: 'The clinical sequence',
        title: 'Micro-Path develops the pathway in small, controlled steps.',
        paragraphs: [
          'This is also why we introduce the Micro-Path #13, #15 and #17 .03 taper files. The small progression in tip size allows the clinician to develop the glide path in controlled steps instead of making a large jump from one instrument to the next. Their .03 taper keeps the increase in metal along the working portion restrained, which helps the files negotiate difficult curves while the pathway is being established.',
          'The #13 provides an intermediate step after the smaller hand files. The #15 and #17 then develop the glide path progressively, when the anatomy permits, before larger shaping instruments enter the canal. Each file has a limited, deliberate job. It should follow a pathway that has been confirmed, without being forced beyond the available length.',
          'The upper-molar mesio-buccal root shown in the 3D animation is a demanding test of this behaviour. Its canal system may curve sharply soon after leaving the pulp chamber, change direction again deeper in the root and then present another curve toward the apical third. MB1 and MB2 may remain separate, join or divide, and some of that curvature may run in the bucco-palatal plane.',
          'A conventional two-dimensional radiograph compresses that anatomy into a flat image. A curve directed towards or away from the X-ray beam may be difficult to see. Rotating a 3D tooth makes those hidden changes in direction visible and helps explain why a hand file may stop after only a few millimetres, why forcing it can create a ledge and why a rotary file may experience concentrated cyclic stress farther down the same root.',
          'Clinical technique still changes the equation. Access, irrigation, glide-path preparation, rotational speed, torque, pressure and instrument use all influence how safely the file performs. Heat treatment lets us select the file behaviour required for each stage; the Micro-Path sequence provides small, controlled steps for developing the pathway.',
        ],
      },
    ],
    chairsideChecks: [
      'Does the file behaviour match the job being asked of it?',
      'Is the instrument following the anatomy or pressing to straighten?',
      'Has a reproducible glide path been confirmed before larger shaping?',
      'Are speed, torque, pressure and instrument use appropriate for the case?',
      'Does resistance indicate a curve that the radiograph may not reveal?',
    ],
    sources: [],
  },
  'why-file-design-matters': {
    question: 'Why does the cross-section of an endodontic file matter?',
    standfirst:
      'An endodontic file may look like a narrow piece of metal with cutting flutes, but its behaviour comes from several design decisions working together.',
    sections: [
      {
        eyebrow: 'The design system',
        title: 'No single measurement explains how a file behaves.',
        paragraphs: [
          'Cross-section, core diameter, flute depth, rake angle, pitch, taper and heat treatment all affect what the file does inside the canal.',
          'This makes file comparisons difficult. Most published studies compare complete commercial instruments. If one file behaves differently from another, the reason may be its cross-section, heat treatment, taper, core thickness or several features acting together.',
          'The cleanest engineering data comes from changing one design variable while keeping everything else identical. Manufacturers conduct this work during instrument development, and much of it remains confidential because it forms part of the design process. We can still understand the principles.',
        ],
      },
      {
        eyebrow: 'Core and flutes',
        title: 'Strength, flexibility and debris space exist in balance.',
        paragraphs: [
          'Consider a file with a square cross-section and a relatively thick core. The additional metal can provide good torsional strength. It gives the instrument backbone and helps it resist twisting when the tip encounters resistance.',
          'That strength carries a mechanical cost. A thicker core increases stiffness and reduces the available flute space. In a curved canal, the file may produce greater restoring forces as it tries to straighten. That can increase pressure against the canal wall, reduce flexibility and raise the risk of canal transportation.',
          'Smaller flute spaces also leave less room for dentine debris. Cutting is only one part of preparation. The instrument must also collect debris and carry it coronally rather than packing it farther into the canal.',
          'Now consider a double-S cross-section. A smaller central core, two principal contact points and deeper flutes can produce a different balance of properties. The reduced metal mass can improve flexibility. The cutting edges can engage dentine efficiently, while the deeper flutes provide more space for debris.',
          'That geometry may be well suited to curved or anatomically complex canals. It will not be the best answer for every clinical task because every change in geometry alters the balance between flexibility, cutting action, torsional strength and debris removal.',
        ],
      },
      {
        eyebrow: 'Cutting behaviour',
        title: 'Rake angle, pitch and core thickness determine how the file meets dentine.',
        paragraphs: [
          'A more active cutting angle can remove material efficiently but may feel more aggressive. A less active angle may give the clinician greater control in a delicate or restrictive pathway. Flute dimensions, pitch and core thickness then influence how the instrument tracks, how debris moves and where stress concentrates.',
          'This is why we developed Flex-Ion technology across the TransformS™ range. Heat treatment controls the metallurgical behaviour of the nickel-titanium, but heat treatment alone does not define the file. We combine that material behaviour with different flute dimensions, core thicknesses and rake angles so each file can perform a specific clinical job.',
          'A glide-path file should not behave like a larger shaping file. An instrument designed to negotiate a narrow curved pathway needs flexibility, low restoring force and enough resistance to buckling to progress without being pushed. A shaping file needs effective dentine engagement, space for debris and sufficient strength for the amount of work it is being asked to perform.',
        ],
      },
      {
        eyebrow: 'Task-specific design',
        title: 'Micro-Path shows why one geometry should not be asked to perform every procedure.',
        paragraphs: [
          'The Micro-Path #13, #15 and #17 .03 taper files provide a measured progression for glide-path development. The small steps in tip diameter avoid a sudden jump from one instrument size to the next. Their .03 taper limits the increase in metal along the working portion, helping the files remain flexible as they follow a narrow or curved canal.',
          'The file still needs enough backbone to progress. Make the core too small and the instrument may buckle before it advances. Make it too large and the file becomes stiff, increases its restoring force and presses harder against the outside of a curve. Micro-Path is designed around that balance.',
          'The same thinking continues through the TransformS™ range. We vary the flute form, core thickness and rake angle because negotiation, glide-path development, shaping and retreatment place different demands on an instrument. The file should be designed for the task rather than expecting one geometry to perform every procedure equally well.',
          'This is particularly relevant in the mesio-buccal root of an upper molar. Its canal system can change direction several times and may curve in a plane that is poorly represented on a two-dimensional radiograph. A file entering that root must negotiate the anatomy while managing cutting forces, torsional load, cyclic fatigue and debris removal.',
          'Judging an instrument by a single measurement, such as taper or cyclic-fatigue resistance, gives an incomplete picture. Look at how the heat treatment and physical design work together. Then match the instrument to the anatomy and the clinical job in front of you.',
        ],
      },
    ],
    chairsideChecks: [
      'What clinical job was this file designed to perform?',
      'How do core size and flute space affect flexibility and debris movement?',
      'Does the rake angle provide the right balance of cutting and control?',
      'Is the file being asked to progress, shape or retreat material?',
      'Do the geometry and heat treatment suit the anatomy?',
    ],
    sources: [],
  },
  'choosing-the-right-tip-size-and-taper': {
    question: 'What is the ideal tip size and taper for an endodontic preparation?',
    standfirst: 'It depends on the tooth, the diagnosis and the anatomy in front of you.',
    sections: [
      {
        eyebrow: 'The pendulum',
        title: 'Large preparations and minimally invasive shaping each contain a useful idea.',
        paragraphs: [
          'During the past twenty years, shaping concepts have moved between two extremes. For a time, large tapers and generous preparations were popular. The thinking was straightforward: create more space for irrigation, improve access to the apical canal and make obturation easier.',
          'Then the profession moved towards minimally invasive endodontics. Smaller preparations became desirable because they preserved more radicular dentine and reduced unnecessary weakening of the tooth.',
          'Both approaches contain useful ideas. The problem begins when either one becomes a fixed rule for every canal.',
        ],
      },
      {
        eyebrow: 'Read the label correctly',
        title: 'Tip size and taper describe different parts of the preparation.',
        paragraphs: [
          'Tip size determines the diameter at the end of the file. Taper describes how quickly the file becomes wider as we move coronally from that tip.',
          'Two instruments may have the same tip size but behave very differently because their tapers are different. A size 25 .03 taper file carries much less metal coronally than a size 25 .06 taper file. That affects flexibility, restoring force, dentine removal and the space available for irrigation.',
          'The correct preparation cannot be selected from the file label alone.',
        ],
      },
      {
        eyebrow: 'Let anatomy decide',
        title: 'The same preparation does not suit every canal.',
        paragraphs: [
          'A young, vital tooth with a broad canal presents a different problem from an older tooth with calcification. An infected canal may require a preparation that allows effective irrigation and debris removal. A thin or severely curved root may demand greater restraint to preserve dentine and maintain the existing canal path.',
          'The narrowest part of the canal is not always at the apical constriction. A canal may tighten coronally, flatten in the middle third or divide and rejoin. Curvature may occur in more than one plane, so a canal that looks manageable on a conventional radiograph may be much more demanding clinically.',
          'This is why three-dimensional understanding and tactile feedback matter. CBCT imaging, when clinically justified, can reveal anatomy that a two-dimensional radiograph compresses or hides. The clinician must then combine that information with what the instruments are communicating inside the canal.',
          'If a file stops progressing, pushing harder is rarely the answer. The instrument may have reached a constriction, an abrupt curve, a division or a ledge. Each situation requires a different response.',
        ],
      },
      {
        eyebrow: 'Establish the route',
        title: 'Micro-Path creates measured steps before final shaping.',
        paragraphs: [
          'Micro-Path begins this process with small, measured steps. The #13, #15 and #17 .03 taper files are designed to develop a reproducible glide path without making a sudden increase in tip diameter or taper. Their smaller taper limits how quickly the instrument becomes wider along its working portion, helping it negotiate restrictive and curved anatomy.',
          'The purpose of the glide path is not to create the final canal shape. It gives the shaping file a confirmed route to follow. Once that route is secure, the clinician can decide how much further enlargement the individual canal requires.',
          'The TransformS™ range was developed around that sequence. Different clinical jobs need different tip sizes, tapers, core dimensions, flute forms and rake angles. A negotiation file, a glide-path file and a shaping file should not all behave in the same way.',
          'Flex-Ion technology contributes the metallurgical side of that design. It allows the nickel-titanium to remain flexible and produce lower restoring forces in curved anatomy. The physical design of each file then determines how it cuts, resists buckling, transports debris and tolerates torsional loading.',
          'These features must work together. A flexible file with the wrong geometry for the task may not progress effectively. A strong file with too much metal may resist buckling but press heavily against the outside of a curve. Tip size, taper, heat treatment and cross-section all influence the result.',
        ],
      },
      {
        eyebrow: 'The final preparation',
        title: 'Shape enough to clean—without unnecessary dentine removal.',
        paragraphs: [
          'Most routine preparations may finish somewhere within a moderate range of apical sizes, but that range is not a prescription. Some canals permit a smaller preparation. Others need greater enlargement to remove infected dentine, improve irrigant exchange or prepare a suitable apical shape.',
          'Larger tapers may be useful in selected anatomy, but they also remove more dentine and increase the file’s diameter rapidly away from the tip. In a thin or curved root, that extra enlargement may provide little clinical benefit while reducing the remaining tooth structure.',
          'The anatomy should decide the preparation. Establish the pathway first, assess the canal and root dimensions, and then select the tip size and taper that complete the required cleaning and shaping without unnecessary dentine removal.',
        ],
      },
    ],
    chairsideChecks: [
      'Have tip size and taper been considered separately?',
      'Does the root thickness and curvature permit the planned enlargement?',
      'Is the glide path reproducible before shaping begins?',
      'Will the preparation permit irrigation without unnecessary dentine loss?',
      'Has resistance been interpreted before more pressure is applied?',
    ],
    sources: [],
  },
  'access-with-purpose': {
    question: 'How much tooth structure should an access cavity remove, and how much must it reveal?',
    standfirst:
      'Access creates the working environment for everything that follows. The cavity must expose the chamber, reveal the canal map and let instruments enter without harmful deflection, while preserving dentine that still serves a structural purpose.',
    sections: [
      {
        eyebrow: 'Before the bur',
        title: 'The access begins with orientation',
        paragraphs: [
          'A crown can disguise the tooth beneath it. Large restorations erase the normal landmarks. Rotation, tipping and attrition alter the apparent long axis, while calcification changes both the expected depth and the tactile sensation of entering the chamber. Starting from the centre of an occlusal surface without reconciling those changes invites the bur to follow the restoration rather than the root.',
          'Read the pre-operative radiograph for more than root length. Estimate the chamber depth, roof thickness and direction of the roots. Compare the clinical crown with the root axis. An angled radiograph may expose an additional root or a bucco-lingual relationship hidden in the first view. CBCT can clarify complex anatomy or a previously unsuccessful search when its use is clinically justified, but it should answer a defined question rather than serve as routine screening.',
          'Restorability also belongs in this first decision. Remove unsupported caries and decide whether defective restorative material compromises isolation, visibility or the coronal seal. A predictable rubber-dam field and a sealable perimeter matter before sodium hypochlorite enters the cavity. Sometimes a pre-endodontic build-up provides that control. Sometimes the correct decision is to stop and reassess the tooth.',
        ],
      },
      {
        eyebrow: 'Finding the chamber',
        title: 'Depth control prevents an access from becoming a perforation',
        paragraphs: [
          'Initial penetration should follow the planned long axis towards the centre of the pulp chamber. Penetrating a ceramic crown, metal substructure and dentine are separate cutting tasks. Each material deserves the appropriate bur and a deliberate change in pressure. Treating the restoration and tooth as one uniform layer increases heat, vibration and the risk of losing orientation.',
          'The familiar “drop” into the chamber may occur in a young tooth with a generous pulp space. It may be absent in an older or heavily restored tooth. The operator still needs a depth estimate. Marking the expected chamber depth on the bur, measuring against the radiograph and pausing before the floor is reached provide more reliable control than waiting for a tactile event that may never come.',
          'Once the chamber is entered, the floor becomes the anatomical reference. Blind downward cutting after entry risks furcal or axial perforation. The objective changes from penetration to lateral deroofing, visual inspection and controlled refinement.',
        ],
      },
      {
        eyebrow: 'Deroofing',
        title: 'A small opening can conceal a large clinical problem',
        paragraphs: [
          'Leaving roof dentine over the chamber creates shadows, traps pulp tissue and hides the line angles where canals are commonly found. It also directs instruments through an artificial coronal bend. A cavity may look conservative from above while making every later stage more difficult.',
          'Complete deroofing does not require indiscriminate widening. Remove the chamber roof and unsupported overhangs until the floor-wall junction can be inspected. Smooth axial walls where they obstruct vision or deflect instruments. Preserve dentine that does not interfere with canal location, irrigation or safe instrument entry.',
          'The useful endpoint is functional. The clinician should be able to inspect the floor, introduce an explorer and place small instruments into the orifices without the shaft striking an avoidable coronal shelf. It is unnecessary to remove dentine merely so every orifice appears simultaneously in the mirror.',
          'Access remains dynamic. If a file repeatedly catches, bows or enters at a damaging angle, return to the chamber and identify the coronal interference. A small, directed modification often provides more control than applying more force to the instrument.',
        ],
      },
      {
        eyebrow: 'Reading the floor',
        title: 'The pulp chamber carries its own map',
        paragraphs: [
          'External crown anatomy becomes unreliable after restoration, wear or rotation. The cemento-enamel junction and the internal chamber floor are more consistent guides. At the level of the CEJ, the chamber tends to sit centrally within the tooth. This relationship helps the operator regain orientation when the visible crown is misleading.',
          'Colour provides another boundary. The chamber floor usually appears darker than the surrounding dentinal walls. Canal orifices commonly lie at the floor-wall junction, at its line angles and where developmental grooves terminate. These are search zones, not instructions to trough the entire floor.',
          'A sharp DG16 explorer can trace subtle depressions and grooves. Magnification and coaxial illumination make colour changes and dentinal maps easier to read. Long-shank burs improve the line of sight by moving the handpiece head away from the field. Fine ultrasonic tips can remove small volumes of calcified dentine under direct vision with more control than a conventional bur.',
          'Other clues remain useful when the anatomy is difficult. Sodium hypochlorite may effervesce over residual tissue in a hidden orifice. Transillumination can reveal changes in density and crack lines. Dye can improve contrast. Each method should confirm an anatomical hypothesis rather than encourage random cutting.',
        ],
      },
      {
        eyebrow: 'Locating canals',
        title: 'Search patterns should follow the tooth, not a memorised outline',
        paragraphs: [
          'Traditional access outlines provide a starting expectation, but the pulp chamber determines the final shape. Lower incisors may contain a lingual canal hidden beneath the cingulum. Premolars may divide below a single apparent orifice. Mandibular molars may contain a second distal canal or an additional mesial canal. Upper molars frequently demand a deliberate search for MB2.',
          'In a maxillary molar, MB2 usually lies mesial and palatal to MB1 along the developmental groove towards the palatal canal. The search should begin by exposing and reading that groove, then removing small amounts of dentine under magnification. Widening the whole chamber does not improve the search. It sacrifices structure without necessarily revealing the canal.',
          'Calcification changes the strategy. Start where the chamber or pulp horn remains largest on the radiograph, or locate the largest predictable canal first. In an upper molar, the palatal canal can restore depth and orientation. In a lower molar, the distal canal can serve the same purpose. Once one canal is confirmed, the chamber-floor relationships help predict the others.',
          'Bleeding can erase those landmarks. With a hyperaemic pulp, establish haemostasis and irrigate before exploring the floor. Continuing to cut through a pool of blood removes the visual information needed to distinguish floor, wall and orifice.',
        ],
      },
      {
        eyebrow: 'The conservation question',
        title: 'Conserve structure without compromising the pathway',
        paragraphs: [
          'The debate between traditional and contracted access can become too geometric. A smaller outline does not automatically preserve the tooth if it produces coronal interference, missed tissue or instrument stress. A larger outline does not automatically improve treatment if the additional dentine serves no clinical purpose.',
          'The defensible access preserves peri-cervical dentine where possible while providing visibility, chamber debridement and a smooth route to each canal. Straight-line access should be understood as removing harmful coronal deflection towards the canal or its initial curvature. It does not mean sacrificing the entire roof of sound dentine in pursuit of a perfectly straight line to the apex.',
          'Access design should therefore respond to the individual tooth. The correct outline may change after the chamber is opened, after calcification is uncovered or when a small file reveals an unexpected direction. Conservation and convenience are not opposing principles when every cut has a defined purpose.',
        ],
      },
      {
        eyebrow: 'Common errors',
        title: 'Under-extension and over-extension fail in different ways',
        paragraphs: [
          'Under-extension leaves roof dentine, hides canals and forces files around coronal obstacles. It can lead to retained tissue, poor irrigation, ledging and instrument separation. A missed canal may ultimately represent an access failure rather than a shaping failure.',
          'Over-extension weakens cusps and peri-cervical dentine. Cutting in the wrong direction risks gouging the axial wall, perforating the furcation or exiting through the crown or root. These errors often begin with a lost long axis, an unmeasured chamber depth or an attempt to find a canal by drilling deeper instead of reading the floor.',
          'When the landmarks stop making sense, stop cutting. Re-establish the tooth axis, review the radiograph or CBCT, clear the field and reassess under magnification. Referral remains a controlled clinical decision when further searching would add more risk than information.',
        ],
      },
      {
        eyebrow: 'The endpoint',
        title: 'A good access makes the next stage calmer',
        paragraphs: [
          'The completed access should allow the chamber to be cleaned, the canals to be located and small instruments to enter without avoidable deflection. It should support irrigant exchange and later obturation while retaining useful tooth structure for restoration.',
          'That endpoint cannot be judged by outline shape alone. Watch what the instruments do. Check whether visibility remains clear and whether tissue or roof dentine remains. Revisit the cavity whenever the pathway feels less controlled than the anatomy predicted.',
          'Access with purpose means that every cut answers a clinical problem: reach the chamber, reveal the map, remove an obstruction or improve control. When a cut has no clear purpose, it probably does not belong in the tooth.',
        ],
      },
    ],
    chairsideChecks: [
      'Does the planned entry follow the true root axis rather than the restoration?',
      'Has chamber depth been estimated before cutting begins?',
      'Is the entire chamber roof removed without indiscriminate widening?',
      'Can the floor-wall junction and developmental grooves be inspected clearly?',
      'Do small instruments enter without striking a coronal shelf?',
      'Would further troughing add useful information or only procedural risk?',
    ],
    sources: [
      {
        label: 'Adams and Tomson: Access cavity preparation, British Dental Journal',
        url: 'https://doi.org/10.1038/sj.bdj.2014.206',
      },
      {
        label: 'Druttman: Access cavities and canal location',
        url: 'https://www.endopracticeus.com/endo-essentials/top-ten-tips-tip-number-5-access-cavities-canal-location/',
      },
      {
        label: 'Marchesan et al.: Contracted access and canal curvature parameters',
        url: 'https://doi.org/10.1016/j.joen.2018.07.008',
      },
      {
        label: 'Video: Coronal access in a maxillary first molar',
        url: 'https://www.youtube.com/watch?v=zoywoDL7DNk',
      },
      {
        label: 'Video: Canal-location laws during access preparation',
        url: 'https://www.youtube.com/watch?v=RObnHj9Y4-Y',
      },
      {
        label: 'Video: Ultrasonic location of MB2',
        url: 'https://www.youtube.com/watch?v=lOk6ayaz0DY',
      },
    ],
  },
  'working-length-when-the-file-will-not-progress': {
    question: 'If the locator says “not there” but the file says “no further”, which signal should you trust?',
    standfirst:
      'A difficult working-length case is rarely solved by pushing harder. The useful move is to separate three different problems: access to the canal, interpretation of the electronic reading, and the anatomy of the apical endpoint.',
    sections: [
      {
        eyebrow: 'The live question',
        title: 'The bars on an apex locator are not a millimetre ruler.',
        paragraphs: [
          'A highly active 2026 practitioner discussion began with a familiar case: two canals reached length, one stopped three millimetres short, and the electronic display appeared to confirm the shortfall. The important reply reframed the problem. The display represents an electrical relationship to the apical tissues; movement between bars is not a linear measure of distance.',
          'That matters because the clinical temptation is to convert an unstable signal into a mechanical instruction: “advance another two millimetres”. In a sharply curved or calcified canal, that can turn a diagnostic uncertainty into a ledge, transportation or separation.',
        ],
      },
      {
        eyebrow: 'First distinction',
        title: 'Canal negotiation and length determination are connected—but not identical.',
        paragraphs: [
          'Samuel Johnson frames working length as a triangulation exercise: electronic information, the pre-operative radiograph, tactile behaviour and the expected anatomy should make sense together. All Things Dentistry makes the same practical point from another angle: improve electrical contact, remove coronal interference and repeat a reproducible measurement before blaming the device.',
          'If the file cannot progress, ask whether the problem is coronal binding, packed debris, a sudden curve, calcification or a false pathway. Small stainless-steel files, controlled pre-curving and short watch-winding or quarter-turn-and-withdraw movements may help. Coronal enlargement can create room, but rotary instruments should not be used to “drill” through an unknown obstruction.',
        ],
        points: [
          'Use a stable coronal reference point and confirm the stopper has not moved.',
          'Check the lip clip, file connection and unwanted contact with metal restorations.',
          'Irrigate, recapitulate and clear coronal interference before repeating the reading.',
          'Treat sudden resistance as anatomical information, not a request for more force.',
        ],
      },
      {
        eyebrow: 'The decision',
        title: 'Trust a reproducible zero reading; investigate every disagreement.',
        paragraphs: [
          'Modern electronic apex locators are highly useful, but a single reading is not the whole case. A 2025 British Dental Journal review describes the zero reading as the most reliable reference while also emphasising patency and the limits of radiographic apex estimation. A 2025 study of contemporary and integrated locators found most measurements within a ±0.5 mm tolerance, but not all—another reason to interpret rather than merely accept the display.',
          'The practical endpoint is not “locator versus radiograph”. It is a coherent story. If the electronic endpoint is reproducible, the file path is patent and the radiographic anatomy is plausible, confidence rises. If those signals conflict, stop, clean the field, alter the angle of the radiograph where useful, reassess anatomy and consider referral before creating damage in pursuit of a number.',
        ],
      },
    ],
    chairsideChecks: [
      'Is the reading reproducible on withdrawal and reinsertion?',
      'Has coronal preflaring changed the effective canal path?',
      'Could the file be contacting metal or a wet chamber wall?',
      'Does the radiograph suggest a buccolingual curve that is not visible?',
      'Would continuing add information—or only procedural risk?',
    ],
    sources: [
      {
        label: 'Active discussion: achieving working length in a resistant canal',
        url: 'https://www.reddit.com/r/Dentistry/comments/1qc9l18/endodontists_how_are_you_achieving_working_length/',
      },
      {
        label: 'Protrusive: Working Lengths and Troubleshooting Apex Locators',
        url: 'https://www.youtube.com/watch?v=M2z8Dl_g4XY',
      },
      {
        label: 'Video comparison: Apex Locator Tips for the General Dentist',
        url: 'https://www.youtube.com/watch?v=fHMsUPGvrcw',
      },
      {
        label: 'Video comparison: achieving patency in a double-curvature canal',
        url: 'https://www.youtube.com/watch?v=h2nAoBXb53g',
      },
      {
        label: 'BDJ: contemporary biomechanical preparation',
        url: 'https://www.nature.com/articles/s41415-025-8599-1',
      },
      {
        label: 'Scientific Reports: irrigants and contemporary apex-locator accuracy',
        url: 'https://www.nature.com/articles/s41598-025-28670-7',
      },
    ],
  },
  'rubber-dam-seal-before-root-canal-access': {
    question: 'Is rubber dam simply a safety accessory—or the first active step in disinfection?',
    standfirst:
      'The useful argument is not whether a skilled operator can keep a tooth dry for a few minutes. It is whether the entire endodontic system remains isolated, chemically contained and restoratively controllable from access to seal.',
    sections: [
      {
        eyebrow: 'The live question',
        title: '“I isolate well without a dam” answers the wrong problem.',
        paragraphs: [
          'A June 2026 professional discussion about rubber dam attracted strong and divided responses. Some clinicians described alternative isolation methods; others returned to contamination, hypochlorite containment and medicolegal defensibility. The most useful contribution separated convenience from system control: suction and cheek retraction may improve access, but they do not create the same sealed operating field.',
          'The pre-endodontic build-up walkthrough frames this with characteristic practicality: no predictable isolation means no predictable use of sodium hypochlorite. The dam is not the end of the isolation decision. It is the platform on which the remaining decisions depend.',
        ],
      },
      {
        eyebrow: 'The difficult tooth',
        title: 'Sometimes the real problem is not dam placement. It is missing tooth structure.',
        paragraphs: [
          'Deep proximal caries, a subgingival margin or a fractured wall can leave the dam looking present while the access cavity remains contaminated. This is where pre-endodontic build-up becomes clinically useful. Remove unsupported caries, assess restorability and recreate enough wall form to contain irrigant and stabilise the dam.',
          'The active pre-endo build-up discussion shows the genuine trade-off: some clinicians prioritise speed; others rewall to improve irrigant control and the coronal seal. Mohamed Bayoumi’s extended clinical discussion supports the same problem-first sequence—assess the margin, create a sealable perimeter, then refine the access through a controlled build-up.',
        ],
        points: [
          'Test restorability before investing in canal preparation.',
          'Create a clean peripheral seal rather than simply adding bulk composite.',
          'Adapt the matrix to the deepest margin; do not accept a hidden cervical gap.',
          'Verify 360-degree inversion before introducing hypochlorite.',
        ],
      },
      {
        eyebrow: 'The decision',
        title: 'Build only what improves control—and stop when control is not achievable.',
        paragraphs: [
          'A pre-endodontic build-up is not an excuse to bury uncertain caries or violate periodontal tissues. If the margin cannot be exposed, dried and predictably restored, the next step may be crown lengthening, orthodontic extrusion, referral or a different treatment plan. The build-up earns its place only when it makes the case safer and more legible.',
          'The chairside test is simple: can the tooth be isolated, can irrigant be contained, can the chamber be sealed between visits if needed, and is the definitive restorative pathway plausible? If any answer is no, the endodontic problem is still a restorative problem.',
        ],
      },
    ],
    chairsideChecks: [
      'Can the tooth be isolated before access is enlarged?',
      'Is the dam visibly inverted around the complete cervical margin?',
      'Will the build-up contain irrigant without obscuring anatomy?',
      'Is the deep margin compatible with periodontal health and definitive restoration?',
      'Has restorability been discussed before treatment begins?',
    ],
    sources: [
      {
        label: 'Active discussion: Rubber Dam for Endo',
        url: 'https://www.reddit.com/r/Dentistry/comments/1u3gooz/rubber_dam_for_endo/',
      },
      {
        label: 'Supporting discussion: Pre-endo buildups',
        url: 'https://www.reddit.com/r/Dentistry/comments/1r4xrej/preendo_buildups/',
      },
      {
        label: 'Protrusive: Pre-Endodontic Build Up clinical walkthrough',
        url: 'https://www.youtube.com/watch?v=yPmY-hRyJ-Y',
      },
      {
        label: 'Video comparison: Pre-Endodontic Build Up Is Essential',
        url: 'https://www.youtube.com/watch?v=vLBl7otcvwU',
      },
    ],
  },
  'irrigation-activation-what-is-it-solving': {
    question: 'Does an activator clean the canal—or does it only improve a protocol that is already under control?',
    standfirst:
      'The current debate often starts with a device. A better discussion starts with the fluid problem: active chemistry must be replenished, exchanged and moved through anatomy that files cannot touch, without being driven beyond the apex.',
    sections: [
      {
        eyebrow: 'The live question',
        title: '“Are activators worth it?” is too early a question.',
        paragraphs: [
          'A recent professional thread asked whether a vibrating polymer tip was useful or merely another product demonstration. The replies ranged from “a washing machine versus a bucket” to recommendations for ultrasonic, multisonic and laser systems. That variety reveals the problem: activation is often discussed as a hierarchy of devices before the basic irrigation pathway has been examined.',
          'The irrigation discussion is stronger because it begins with the biological limitation of instrumentation. Files create access to the canal system; they do not contact every fin, isthmus or recess. Activation is therefore not the main event. It is one method of improving exchange after a safe pathway for irrigant already exists.',
        ],
      },
      {
        eyebrow: 'The fluid problem',
        title: 'Fresh solution, free backflow and time come before the gadget.',
        paragraphs: [
          'Dr Ammar Al-Hourani’s evidence-led teaching emphasises constant replacement because sodium hypochlorite is consumed by organic load. His fluid-motion section also clarifies why a needle that binds is both ineffective and unsafe: apical delivery without a coronal escape path raises pressure rather than improving controlled exchange.',
          'The practical sequence is therefore unglamorous but robust. Shape enough for delivery. Keep the needle loose and short of working length. Replenish throughout instrumentation. Then activate fresh irrigant in short controlled cycles, renewing the solution between cycles rather than vibrating an exhausted reservoir.',
        ],
        points: [
          'Activation cannot compensate for a blocked or underprepared delivery path.',
          'The needle or activation tip must remain passive and free in the canal.',
          'Short repeatable cycles with replenishment are easier to control than one long cycle.',
          'Open apices, resorption and perforation risk require a more conservative delivery strategy.',
        ],
      },
      {
        eyebrow: 'The decision',
        title: 'Choose the simplest activation method that reliably improves exchange.',
        paragraphs: [
          'Sonic, ultrasonic, negative-pressure, multisonic and laser-assisted methods do not create the same fluid dynamics. That does not mean every practice needs the most complex device. It means the clinician should know what problem the chosen method is intended to solve and what new risk it introduces.',
          'A repeatable ultrasonic protocol may offer a sensible balance for many practices; negative pressure may be attractive when apical containment dominates the risk discussion. The defensible conclusion is not that activation is magic or meaningless. It is that activation is valuable only inside a disciplined irrigation system.',
        ],
      },
    ],
    chairsideChecks: [
      'Can the delivery needle move freely with visible room for backflow?',
      'Is fresh irrigant being exchanged between activation cycles?',
      'Is the activation tip passive rather than cutting or binding?',
      'Does the case anatomy increase extrusion risk?',
      'Can the same protocol be performed consistently by the whole clinical team?',
    ],
    sources: [
      {
        label: 'Active discussion: Are endo activators BS?',
        url: 'https://www.reddit.com/r/Dentistry/comments/1u6mvrj/are_endo_activators_bs/',
      },
      {
        label: 'Protrusive: Endodontic Irrigation — How to Get Better Success',
        url: 'https://www.youtube.com/watch?v=z5h2FzHpG68',
      },
      {
        label: 'Video comparison: Safe & Effective Endodontic Irrigation',
        url: 'https://www.youtube.com/watch?v=j3mepPtwBwo',
      },
      {
        label: 'Video comparison: Root Canal Disinfection & Irrigation Protocols',
        url: 'https://www.youtube.com/watch?v=tKZbW6PjFaM',
      },
    ],
  },
  'sodium-hypochlorite-concentration-is-not-the-protocol': {
    question: 'If a canal is not clean, is stronger hypochlorite the answer—or is the protocol failing somewhere else?',
    standfirst:
      'Concentration is easy to compare because it is a number. Clinical effectiveness is harder: it depends on volume, contact time, renewal, temperature, anatomy, delivery and containment. The strongest bottle does not rescue weak exchange.',
    sections: [
      {
        eyebrow: 'The live question',
        title: 'The concentration debate can distract from the quality of disinfection.',
        paragraphs: [
          'A July 2026 case discussion about whether an obturation would fail quickly became a debate about moving from 1% to 5% sodium hypochlorite. One side emphasised cleaning power; another emphasised the consequence of an extrusion accident. Both concerns are valid, but neither can be resolved by choosing a percentage in isolation.',
          'The discussion places concentration inside a larger set of variables. Sodium hypochlorite remains central because it combines antimicrobial activity with organic tissue dissolution. Yet its clinical action depends on whether fresh solution reaches the relevant anatomy for long enough—and whether the operator can keep it inside the canal system.',
        ],
      },
      {
        eyebrow: 'The chemistry',
        title: 'NaOCl and chlorhexidine do different jobs.',
        paragraphs: [
          'The current practitioner discussion also repeats a common shortcut: replacing hypochlorite with chlorhexidine. Chlorhexidine has antimicrobial properties and substantivity, but it does not provide the same organic tissue dissolution. It is therefore not a drop-in replacement for the core irrigant in a necrotic or tissue-containing canal.',
          'Directly mixing chlorhexidine and sodium hypochlorite is also an avoidable chemical error because an orange-brown precipitate forms. If CHX is considered for a specific indication, residual NaOCl should first be removed with a deliberate intermediate rinse and the canal dried. In many routine cases, the clearer decision is simply not to add CHX.',
        ],
        points: [
          'Select NaOCl concentration as part of a complete delivery and containment protocol.',
          'Renew solution frequently; active chemistry is consumed by tissue and debris.',
          'Use EDTA as a separate chelation step rather than casually mixing irrigants.',
          'Do not directly combine NaOCl and CHX.',
        ],
      },
      {
        eyebrow: 'The decision',
        title: 'Make the protocol stronger before making the solution stronger.',
        paragraphs: [
          'Before increasing concentration, audit the controllable steps: rubber-dam seal, irrigant volume, replenishment, contact time, needle freedom, working depth, activation and final rinse sequence. A lower concentration delivered repeatedly and safely may create a more dependable clinical process than a higher concentration used briefly or under pressure.',
          'The adaptable protocol is the one that changes with the case. A mature closed apex with straightforward anatomy may tolerate a different delivery approach from an open apex, resorptive defect or suspected perforation. Concentration should follow risk assessment—not replace it.',
        ],
      },
    ],
    chairsideChecks: [
      'Is the rubber dam sealed before NaOCl enters the access cavity?',
      'Is solution being replenished throughout shaping?',
      'Can the needle deliver without binding or apical pressure?',
      'Is each irrigant in the final sequence performing a defined job?',
      'Has extrusion risk altered concentration, depth or delivery method?',
    ],
    sources: [
      {
        label: 'Active discussion: Will this endo fail?',
        url: 'https://www.reddit.com/r/Dentistry/comments/1v5af1s/will_this_endo_fail/',
      },
      {
        label: 'Active workflow discussion: RCT workflow help',
        url: 'https://www.reddit.com/r/Dentistry/comments/1ukzb3x/rct_work_flow_help/',
      },
      {
        label: 'Protrusive: Endodontic Irrigation — How to Get Better Success',
        url: 'https://www.youtube.com/watch?v=z5h2FzHpG68',
      },
      {
        label: 'Video comparison: Safe & Effective Endodontic Irrigation',
        url: 'https://www.youtube.com/watch?v=j3mepPtwBwo',
      },
      {
        label: 'Video comparison: Root Canal Disinfection & Irrigation Protocols',
        url: 'https://www.youtube.com/watch?v=tKZbW6PjFaM',
      },
    ],
  },
};
