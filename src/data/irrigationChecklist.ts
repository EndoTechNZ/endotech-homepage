export const irrigationVideoLibrary = [
  {
    title: 'Endodontic Irrigation - How to Get Better Success - PDP203',
    channel: 'Jaz Gulati - Protrusive Dental Podcast',
    url: 'https://www.youtube.com/watch?v=z5h2FzHpG68',
    focus: 'NaOCl renewal, activation, concentration, surfactant, and clinical disinfection framing',
  },
  {
    title: 'Endodontic Irrigation: Power-flushing Your Way to Success',
    channel: 'Viva Learning',
    url: 'https://www.youtube.com/watch?v=j7q7lxsrwos',
    focus: 'Flow, replenishment, activation, and negative-pressure discussion',
  },
  {
    title: "Why Your Endodontic Irrigation Isn't Working",
    channel: 'Dr. Siju Jacob',
    url: 'https://www.youtube.com/watch?v=FsSMn45QGA0',
    focus: 'Needle control, EDTA, smear layer, extrusion, vapor lock, and irrigant sequence',
  },
  {
    title: 'ROOT CANAL IRRIGATION',
    channel: 'Smart Dentistry',
    url: 'https://www.youtube.com/watch?v=slUMgofcJSw',
    focus: 'Needle type, gauge, volume, side vents, activation, and irrigation procedure',
  },
  {
    title: 'EndoColibri: A Revolution in Endodontic Irrigation!',
    channel: 'EndoCowboy Kohrer Medical Engineering',
    url: 'https://www.youtube.com/watch?v=XPMq_S7c438',
    focus: 'Combined sonic or ultrasonic activation with negative-pressure irrigant movement',
  },
  {
    title: 'Endodontic Irrigation - Part 1 | Robert Kaufmann DMD MS(Endo)',
    channel: 'Beyond The Terminus',
    url: 'https://www.youtube.com/watch?v=FYh97_axCu0',
    focus: 'Needle design, extrusion risk, apical vapor lock, EndoVac, and activation methods',
  },
  {
    title: "Ultradent's Irrigation Protocol System for Root Canals",
    channel: 'Ultradent Products',
    url: 'https://www.youtube.com/watch?v=3FVXN1sCKf8',
    focus: 'NaOCl, EDTA, chlorhexidine, gauge selection, and working-length sequence',
  },
  {
    title: 'minimum invasive root canal treatment with SWEEPS / enhanced PIPS',
    channel: 'Dr. Yanbin Xu False Creek Pure Dental',
    url: 'https://www.youtube.com/watch?v=Srs77QHEvVg',
    focus: 'Laser-activated irrigation concept video without available captions in the review pass',
  },
  {
    title: 'Our Endo-Vac Technique for Irrigation',
    channel: 'St Petersburg Endodontics',
    url: 'https://www.youtube.com/watch?v=hE9nrTfImAE',
    focus: 'Negative-pressure delivery, constant flow, and apical exchange',
  },
  {
    title: 'endodontic irrigation',
    channel: 'MY ENDO BOX',
    url: 'https://www.youtube.com/watch?v=NoA4EJpNq9M',
    focus: 'NaOCl, EDTA, activation, needle delivery, apical factors, and smear-layer sequence',
  },
] as const;

const irrigationChecklistVideos: Record<string, { videoTitle: string; videoUrl: string }> = {
  '01': {
    videoTitle: "Why Your Endodontic Irrigation Isn't Working",
    videoUrl: 'https://www.youtube.com/watch?v=FsSMn45QGA0',
  },
  '02': {
    videoTitle: 'Endodontic Irrigation: Power-flushing Your Way to Success',
    videoUrl: 'https://www.youtube.com/watch?v=j7q7lxsrwos',
  },
  '03': {
    videoTitle: 'ROOT CANAL IRRIGATION',
    videoUrl: 'https://www.youtube.com/watch?v=slUMgofcJSw',
  },
  '04': {
    videoTitle: 'Endodontic Irrigation - How to Get Better Success - PDP203',
    videoUrl: 'https://www.youtube.com/watch?v=z5h2FzHpG68',
  },
  '05': {
    videoTitle: 'endodontic irrigation',
    videoUrl: 'https://www.youtube.com/watch?v=NoA4EJpNq9M',
  },
  '06': {
    videoTitle: "Ultradent's Irrigation Protocol System for Root Canals",
    videoUrl: 'https://www.youtube.com/watch?v=3FVXN1sCKf8',
  },
  '07': {
    videoTitle: 'Endodontic Irrigation - Part 1 | Robert Kaufmann DMD MS(Endo)',
    videoUrl: 'https://www.youtube.com/watch?v=FYh97_axCu0',
  },
  '08': {
    videoTitle: 'ROOT CANAL IRRIGATION',
    videoUrl: 'https://www.youtube.com/watch?v=slUMgofcJSw',
  },
  '09': {
    videoTitle: 'Our Endo-Vac Technique for Irrigation',
    videoUrl: 'https://www.youtube.com/watch?v=hE9nrTfImAE',
  },
  '10': {
    videoTitle: 'Endodontic Irrigation - How to Get Better Success - PDP203',
    videoUrl: 'https://www.youtube.com/watch?v=z5h2FzHpG68',
  },
  '11': {
    videoTitle: 'EndoColibri: A Revolution in Endodontic Irrigation!',
    videoUrl: 'https://www.youtube.com/watch?v=XPMq_S7c438',
  },
  '12': {
    videoTitle: "Why Your Endodontic Irrigation Isn't Working",
    videoUrl: 'https://www.youtube.com/watch?v=FsSMn45QGA0',
  },
};

export const irrigationChecklistGroups = [
  {
    stage: 'Open the pathway',
    items: [
      {
        number: '01',
        title: 'Clean what files cannot touch',
        text: 'Treat instrumentation as access for chemistry, not as complete canal cleaning.',
        summary: 'The file prepares the main path; irrigation has to reach the anatomy around it.',
        detail:
          'Root canal anatomy is not a smooth tube. Fins, isthmuses, lateral anatomy, apical irregularities, and canal wall depressions can remain outside direct file contact. Start the irrigation plan with that problem in mind. The aim is not only to place solution in the chamber, but to create enough access for active chemistry to exchange inside the spaces that shaping cannot mechanically touch.',
      },
      {
        number: '02',
        title: 'Shape for irrigant exchange',
        text: 'Choose size and taper with needle movement, apical exchange, and activation in mind.',
        summary: 'Preparation geometry should make safe irrigant replacement possible.',
        detail:
          'Apical size and taper change whether irrigant can reach, exchange, and return coronally. A preparation that is too restrictive limits needle placement and activation; a preparation that is too aggressive can sacrifice dentine or apical control. Shape enough for a loose delivery tip, repeatable irrigant renewal, and activation where useful. The target is controlled access for cleaning, not a larger preparation for its own sake.',
      },
      {
        number: '03',
        title: 'Preserve coronal backflow',
        text: 'A delivery tip needs room around it so fluid can return coronally instead of being driven apically.',
        summary: 'Backflow is a safety feature, not wasted irrigant.',
        detail:
          'When a needle or delivery tip binds, the canal can behave like an extension of the syringe. That increases apical pressure and extrusion risk. Keep the tip moving and confirm that it is loose in the prepared path. Coronal return flow shows that solution has somewhere to go. If the tip locks, withdraw, reassess the shape, and reduce pressure before continuing.',
      },
    ],
  },
  {
    stage: 'Keep chemistry active',
    items: [
      {
        number: '04',
        title: 'Refresh NaOCl throughout shaping',
        text: 'Use fresh solution repeatedly rather than relying on one final flush.',
        summary: 'NaOCl is consumed during tissue dissolution and organic contact.',
        detail:
          'Sodium hypochlorite does the heavy organic-tissue and antimicrobial work, but it does not stay equally active once it is consumed by tissue, debris, dentine mud, and biofilm. Replenish during instrumentation, not only after shaping is complete. Fresh solution, contact time, and exchange are more clinically meaningful than treating concentration as the only important variable.',
      },
      {
        number: '05',
        title: 'Give chemistry time and volume',
        text: 'Irrigant action depends on repeated exchange, contact time, and enough volume to renew the canal contents.',
        summary: 'A small amount of static solution is not a complete irrigation protocol.',
        detail:
          'Irrigation works through chemistry plus movement. A useful protocol repeatedly replaces spent solution with active solution and gives it enough contact time to work. Volume matters because the canal contents are being renewed, not simply wetted. When time is short or exchange is poor, even a strong solution can behave like a weak clinical step.',
      },
      {
        number: '06',
        title: 'Separate the irrigant jobs',
        text: 'Use NaOCl, EDTA, and any final rinse as distinct decisions with an intentional sequence.',
        summary: 'Organic tissue, smear layer, and final disinfection are different problems.',
        detail:
          'NaOCl is used for organic tissue dissolution and microbial reduction. EDTA or another chelator addresses the inorganic smear layer. Final rinse choices should be made deliberately and rinsed between when required; avoid casual mixing, especially when solutions are chemically incompatible. A simple repeatable sequence is safer than a complicated sequence the team cannot reproduce.',
      },
    ],
  },
  {
    stage: 'Control delivery',
    items: [
      {
        number: '07',
        title: 'Keep the needle loose',
        text: 'Place the needle short of working length, keep it moving, and never bind it.',
        summary: 'Loose delivery supports apical exchange while reducing pressure risk.',
        detail:
          'Needle placement should be deliberate, shallow enough to remain controlled, and short enough to avoid locking in the apical third. Move the needle gently, deliver slowly, and watch for unrestricted backflow. If the canal anatomy does not allow a loose path, change the delivery strategy rather than pushing harder. Safety and cleanliness belong in the same decision.',
      },
      {
        number: '08',
        title: 'Match tip design to the case',
        text: 'Gauge, flexibility, open-ended tips, and side vents all change flow and pressure behaviour.',
        summary: 'Needle design is not neutral; it changes how irrigation behaves.',
        detail:
          'Smaller-gauge and more flexible tips may reach deeper in curved or narrow preparations, while side-vented designs can alter apical velocity and pressure compared with open-ended tips. These differences are useful only when the clinician understands the trade-off. Choose the tip for the anatomy, the prepared shape, and the need for controlled exchange, not simply because it is the default syringe setup.',
      },
      {
        number: '09',
        title: 'Change strategy when apical risk is higher',
        text: 'Open apices, resorption, perforation, immature roots, and severe pain change the delivery plan.',
        summary: 'The higher the extrusion consequence, the more conservative the delivery method should become.',
        detail:
          'Extrusion risk is not the same in every case. Open apices, apical resorption, perforation, immature teeth, wide foramina, and complex retreatments reduce the margin for pressure error. Use slower delivery, shorter placement, lower pressure, and consider negative-pressure irrigation where it fits the case. The protocol should adapt before the canal tells you it was too aggressive.',
      },
    ],
  },
  {
    stage: 'Activate and finish',
    items: [
      {
        number: '10',
        title: 'Activate after access exists',
        text: 'Sonic and ultrasonic methods improve fluid movement when the pathway already allows exchange.',
        summary: 'Activation is an adjunct to access, not a rescue for a blocked canal.',
        detail:
          'Activation can improve irrigant motion, debris removal, and penetration into complex anatomy, but it works best when the canal has been shaped enough for solution to move. Do not treat activation as a shortcut around access, patency, renewal, or a loose delivery path. Use it after the pathway exists, with the instrument or activator kept free of binding against canal walls.',
      },
      {
        number: '11',
        title: 'Use negative pressure selectively',
        text: 'Negative pressure can support apical exchange when pressure control is the dominant concern.',
        summary: 'It is a control option when safer apical delivery matters more than syringe simplicity.',
        detail:
          'Negative-pressure systems reverse the delivery logic by drawing solution apically rather than expressing it under positive pressure toward the foramen. They can be useful when the clinician wants apical exchange with lower extrusion risk. They still require shape, patency, adequate volume, and an intentional sequence. The system does not replace judgment; it gives the clinician another way to manage risk.',
      },
      {
        number: '12',
        title: 'Finish with six repeatable checks',
        text: 'Before drying, confirm shape, renewal, needle control, chelation, activation, and apical safety.',
        summary: 'The best irrigation protocol is the one the clinician can repeat under pressure.',
        detail:
          'Before drying the canal, ask six practical questions: can solution exchange apically, has NaOCl been renewed, has smear layer removal been addressed, was the needle loose, was activation used only after access existed, and did the apical anatomy require a safer delivery choice? If any answer is unclear, perform one more controlled irrigation pass before obturation.',
      },
    ],
  },
] as const;

export const irrigationChecklistItems = irrigationChecklistGroups.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    ...(irrigationChecklistVideos[item.number] ?? {}),
    stage: group.stage,
  })),
);

export const irrigationChecklistSources = [
  'EndoTech NZ irrigation source folder: local PDF, slide, image, and video set reviewed for repeated clinical themes around exchange, delivery, activation, chemistry, and safety.',
  'What We Leave Behind In Root Canals After Endodontic Treatment - Some Issues and Concerns. EndoTech source-folder paper.',
  'Boutsioukis C, Arias-Moliz MT. Present status and future directions: irrigants and irrigation methods. International Endodontic Journal. 2022. Source-folder PDF.',
  'Boutsioukis C et al. Effect of needle tip design, needle depth, apical preparation size, taper, and irrigant flow on root canal irrigation. Source-folder computational-fluid-dynamics paper set, 2007-2014.',
  'Leoni GB et al. Efficacy of supplementary irrigation protocols in removal of hard-tissue debris from mesial mandibular molars. International Endodontic Journal. 2017. Source-folder PDF.',
  'van der Sluis LWM et al. Passive ultrasonic irrigation of the root canal: a review of the literature. International Endodontic Journal. 2007. Source-folder PDF.',
  'Stojicic S, Shen Y, Haapasalo M. Tissue dissolution by sodium hypochlorite: effect of concentration, temperature, agitation, and surfactant. Journal of Endodontics. 2010. Source-folder PDF.',
  'EndoTech NZ English-only curated YouTube irrigation review: 10-video set reviewed on 2026-06-05 for recurring clinical teaching points.',
];

export const irrigationChecklistReferenceNote =
  'The irrigation checklist combines the local EndoTech irrigation PDF library with a 10-video YouTube teaching review. It uses those sources to support practical decisions around canal shape, NaOCl renewal, EDTA sequencing, loose needle delivery, activation, negative pressure, and apical safety. It is a chairside education aid, not a claim that one device or solution solves every anatomy problem.';
