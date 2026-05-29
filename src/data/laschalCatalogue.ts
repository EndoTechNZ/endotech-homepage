import { laschalCatalogItems } from './laschal';

export const laschalSourceCategoryHref =
  'https://laschalsurgical.com/product-category/dental-surgeon-specialties/endodontics/';

export const laschalCataloguePdfHref =
  '/downloads/EndoTech-NZ-Laschal-Endodontic-Instruments-Catalogue-clinical-steel-20260529.pdf';

export const laschalAssets = {
  hero: '/images/laschal/feature/hero-instrumentation.webp',
  logo: '/images/laschal/feature/laschal-logo.png',
  fxp: '/images/laschal/feature/fxp-protocol.webp',
  gutta: '/images/laschal/feature/gutta-percha-set.webp',
  bender: '/images/laschal/feature/file-bender.webp',
  forceps: '/images/laschal/feature/endo-file-forceps.webp',
  raptor: '/images/laschal/feature/raptor-forceps.webp',
  group: '/images/laschal/feature/sonic-steel-group.webp',
};

const byTitle = (needle: string) =>
  laschalCatalogItems.find((item) => item.title.toLowerCase().includes(needle.toLowerCase()))?.sourceUrl ??
  laschalSourceCategoryHref;

export const laschalFeaturedInstruments = [
  {
    title: 'Tactile endo file forceps',
    anchorId: 'laschal-feature-file-control',
    model: '90AHF/L, 75CHF/L, EF-1-7',
    image: laschalAssets.forceps,
    href: byTitle('15.75cm Universal Endo File Forceps'),
    clinicalProblem:
      'Deep posterior access and microscope positioning can make small files difficult to control with fingers alone.',
    solution:
      'Diamond-coated file forceps place file handling into a slim instrument profile for angled, tactile access.',
    features: ['75 or 90 degree access options', 'Diamond-coated working surfaces', 'Thumlok handle variants'],
    benefits: [
      'Improves file control under magnification',
      'Reduces finger crowding around the access',
      'Supports controlled placement in difficult anatomy',
    ],
    videos: [
      {
        label: 'Watch Marc Habib use EF-1-7 tactile file forceps',
        href: 'https://www.youtube.com/watch?v=O14DwrteW9M',
      },
      {
        label: 'Watch Laschal endodontic file forceps overview',
        href: 'https://www.youtube.com/watch?v=D0TvF82CMR4',
      },
    ],
  },
  {
    title: 'Endodontic file bender',
    anchorId: 'laschal-feature-file-bender',
    model: 'FBF',
    image: laschalAssets.bender,
    href: byTitle('Endodontic File Bending Forceps'),
    clinicalProblem:
      'Negotiating complex canal anatomy often requires a repeatable pre-curve rather than a rough hand bend.',
    solution:
      'The file bender supports short, gradual, acute, elongated, and deeper bends in endodontic files.',
    features: ['Flat-handle bending control', 'Multiple curvature styles', 'Compact chairside format'],
    benefits: [
      'Helps preserve intended file path',
      'Supports controlled negotiation',
      'Pairs naturally with tactile file forceps',
    ],
    videos: [],
  },
  {
    title: 'FXP file extraction protocol',
    anchorId: 'laschal-feature-fxp-retrieval',
    model: 'FXP/S, FXP/45, FXP/75, FXP/90, FXP/110',
    image: laschalAssets.fxp,
    href: byTitle('Laschal File Extraction Protocol'),
    clinicalProblem:
      'Separated instruments can require a narrow, controlled retrieval pathway without over-enlarging dentine.',
    solution:
      'Angled diamond excavation probes and Steiglitz forceps create a staged pathway for ultrasonic troughing and retrieval.',
    features: ['45, 75, 90, and 110 degree probe options', 'Probe bender support', 'Steiglitz forceps pairing'],
    benefits: [
      'Supports a conservative retrieval strategy',
      'Keeps access choices visible',
      'Gives clinicians a repeatable protocol sequence',
    ],
    videos: [
      {
        label: 'Watch the FXP troughing system',
        href: 'https://www.youtube.com/watch?v=afvlQpxp7Ls',
      },
      {
        label: 'Watch Dr Ortiz Hughes demonstrate FXP retrieval',
        href: 'https://www.youtube.com/watch?v=249Xa1SXEd8',
      },
      {
        label: 'Watch Steiglitz forceps retrieval support',
        href: 'https://www.youtube.com/watch?v=iJ9l7UQPtVs',
      },
    ],
  },
  {
    title: 'Gutta percha removal set',
    anchorId: 'laschal-feature-gutta-percha',
    model: 'SET-GP',
    image: laschalAssets.gutta,
    href: laschalSourceCategoryHref,
    clinicalProblem:
      'Retreatment requires removal of gutta percha while preserving visibility and avoiding unnecessary canal disruption.',
    solution:
      'A directional removal set uses scraper-style instruments that can be pre-heated for controlled gutta percha removal.',
    features: ['Four directional instruments', 'Sterile tray organization', 'Optional heat support'],
    benefits: [
      'Keeps the working field organized',
      'Supports controlled scraping movement',
      'Fits a retreatment-focused EndoTech workflow',
    ],
    videos: [],
  },
  {
    title: 'Raptor post and root-tip forceps',
    anchorId: 'laschal-feature-raptor-forceps',
    model: '45-S/L, 75-SP/L',
    image: laschalAssets.raptor,
    href: byTitle('RAPTOR Forceps'),
    clinicalProblem:
      'Posts, points, and small fragments often need narrow access with force delivered only where it is useful.',
    solution:
      'Raptor forceps use a slim, durable tip profile for controlled gripping in tight endodontic and surgical spaces.',
    features: ['45 and 75 degree options', 'N/S and E/W orientation choices', 'Narrow carbide tip geometry'],
    benefits: [
      'Improves approach options',
      'Supports low-force grip control',
      'Extends the endodontic set beyond canal instrumentation',
    ],
    videos: [],
  },
];

export const laschalClinicalTasks = [
  {
    title: 'File control and pre-curving',
    href: '#laschal-feature-file-control',
    ariaLabel: 'View file control and pre-curving instruments',
    body:
      'Bend, place, and manipulate files with less finger crowding when anatomy or microscope angle limits direct access.',
  },
  {
    title: 'Separated instrument retrieval',
    href: '#laschal-feature-fxp-retrieval',
    ariaLabel: 'View separated instrument retrieval instruments',
    body:
      'Use angled probes and Steiglitz forceps as a sequence for exposing, troughing, and removing fragments.',
  },
  {
    title: 'Retreatment and gutta percha removal',
    href: '#laschal-feature-gutta-percha',
    ariaLabel: 'View retreatment and gutta percha removal instruments',
    body:
      'Keep retreatment instruments organized by direction and movement so removal remains visible and controlled.',
  },
  {
    title: 'Microsurgical access and closure',
    href: '#laschal-catalog-needle-holders',
    ariaLabel: 'View microsurgical access and closure instruments',
    body:
      'Needle holders, scissors, tissue forceps, and suture support instruments round out the endodontic surgical setup.',
  },
];

export const laschalCategoryOrder = [
  'File retrieval',
  'Endo file control',
  'Needle holders',
  'Microsurgical scissors',
  'Micro forceps',
  'Accessories',
  'Endodontic instruments',
];

export const laschalCatalogueVideos = [
  {
    category: 'Endodontic file control',
    title: 'Marc Habib - Laschal EF-1-7 tactile file forceps',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=O14DwrteW9M',
  },
  {
    category: 'Endodontic file control',
    title: 'Laschal endodontic file forceps',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=D0TvF82CMR4',
  },
  {
    category: 'Separated file retrieval / FXP',
    title: 'FXP troughing system',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=afvlQpxp7Ls',
  },
  {
    category: 'Separated file retrieval / FXP',
    title: 'Separated file removal with the Laschal FXP system',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=jEdlVL3Mzsk',
  },
  {
    category: 'Separated file retrieval / FXP',
    title: 'Dr Ortiz Hughes demonstrates FXP retrieval',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=249Xa1SXEd8',
  },
  {
    category: 'Separated file retrieval / FXP',
    title: 'Steiglitz retrieval forceps support',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=iJ9l7UQPtVs',
  },
  {
    category: 'Microsurgical closure / suturing',
    title: 'SofTouch suture scissors',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=tLkcUML19kM',
  },
  {
    category: 'Microsurgical closure / suturing',
    title: 'Snagless needle holder',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=jcQq5E0I4wI',
  },
  {
    category: 'Microsurgical closure / suturing',
    title: 'ThumLok needle holder',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=7VOFwNafd3Y',
  },
  {
    category: 'Microsurgical closure / suturing',
    title: 'Cutting Edge needle holder',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=GOS4E0fQ0ZM',
  },
  {
    category: 'Surgical access / perio and implant support',
    title: 'Periotomes',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=_iE2rTe9KT0',
  },
  {
    category: 'Surgical access / perio and implant support',
    title: 'CORN forceps',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=4rawUzvBKjk',
  },
  {
    category: 'Surgical access / perio and implant support',
    title: 'Tissue graft forceps',
    channel: 'Laschal Surgical, LLC.',
    href: 'https://www.youtube.com/watch?v=_kZobKokHGQ',
  },
];
