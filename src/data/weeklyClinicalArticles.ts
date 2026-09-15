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
}

export const weeklyClinicalArticles: Record<string, WeeklyClinicalArticle> = {
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
