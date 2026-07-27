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
