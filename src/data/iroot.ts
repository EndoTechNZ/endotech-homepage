import irootSealerHero from '../assets/iroot-sealer-bg.png';
import type { DownloadItem } from '../utils/downloads';

export interface CTAItem {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  row?: 'primary' | 'secondary';
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: 'premixed' | 'hydrophilic' | 'bioactive' | 'radiopaque' | 'alkaline' | 'stability' | 'handling' | 'washout' | 'workflow' | 'repair';
}

export interface ComparisonRow {
  label: string;
  iroot: string;
  conventional: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductRecord {
  name: string;
  slug: string;
  headline: string;
  subheadline: string;
  shortDescription: string;
  heroImage?: typeof irootSealerHero;
  visualLabel?: string;
  featureBullets: FeatureItem[];
  applications: string[];
  packaging: string[];
  faq: FAQItem[];
  regulatoryNote: string;
}

export const workflowSteps = ['Assess', 'Access', 'Glide', 'Shape', 'Clean 3D', 'Seal / Repair', 'Restore'];

export const familyPage = {
  name: 'iRoot Bioceramic Materials',
  strapline: 'Premixed bioceramic materials for sealing, repair, and simplified endodontic workflows.',
  headline: 'Bioceramic sealing and repair, streamlined for modern endodontics',
  subheadline:
    'The iRoot platform brings together premixed bioceramic materials for obturation and root repair in a simple, clinically efficient system.',
  positioning:
    'The iRoot family is designed to simplify modern endodontics with premixed bioceramic materials that are hydrophilic, dimensionally stable, highly radiopaque, and easy to deliver. From canal sealing to root repair, iRoot supports efficient clinical workflows without the mixing variability and material waste associated with conventional systems.',
  heroImage: irootSealerHero,
  ctas: [
    { label: 'Explore iRoot SP', href: '/products/iroot-sp/', row: 'primary' as const },
    { label: 'Explore iRoot BP Plus', href: '/products/iroot-bp-plus/', variant: 'ghost' as const, row: 'primary' as const },
    { label: 'Download brochure', href: '/products/iroot/evidence/#downloads', variant: 'ghost' as const, row: 'primary' as const },
    { label: 'View evidence', href: '/products/iroot/evidence/', variant: 'secondary' as const, row: 'secondary' as const },
  ],
  whyIroot: [
    { title: 'Premixed and ready to use', description: 'Remove chairside mixing variability and start from a consistent delivery format.', icon: 'premixed' as const },
    { title: 'Hydrophilic setting chemistry', description: 'Use moisture in the clinical environment as part of the setting reaction rather than fighting it.', icon: 'hydrophilic' as const },
    { title: 'High pH during setting', description: 'Support the material profile clinicians expect from modern calcium silicate systems.', icon: 'alkaline' as const },
    { title: 'Zero-shrinkage positioning', description: 'Present dimensional stability carefully and keep performance claims anchored to evidence.', icon: 'stability' as const },
    { title: 'Bioactive mineral response', description: 'Highlight hydroxyapatite-forming behaviour without overreaching into unsupported promotional language.', icon: 'bioactive' as const },
    { title: 'Workflow compatibility', description: 'Fit naturally into modern shaping, irrigation, obturation, and repair protocols.', icon: 'workflow' as const },
  ],
  applications: ['Root canal sealing', 'Perforation repair', 'Retrograde filling', 'Apexification', 'Pulp capping', 'Resorption repair'],
};

export const irootSP: ProductRecord & {
  clinicalProblem: string;
  transformxSolution: string;
  clinicalBenefits: string[];
  clinicianReasons: string[];
  story: string;
  whatMakesItDifferent: string;
  proofBlocks: { title: string; description: string }[];
  comparisonRows: ComparisonRow[];
  ctas: CTAItem[];
} = {
  name: 'iRoot SP',
  slug: 'iroot-sp',
  headline: 'Bioceramic root canal sealer',
  subheadline:
    'Premixed. Hydrophilic. Designed for predictable sealing.',
  shortDescription:
    'A premixed bioceramic root canal sealer designed for hydrophilic, moisture-assisted setting and stable canal sealing.',
  heroImage: irootSealerHero,
  featureBullets: [
    { title: 'Premixed syringe delivery', description: 'Ready to use without chairside blending or working-time guesswork.', icon: 'premixed' },
    { title: 'Hydrophilic setting reaction', description: 'Designed to set in the presence of moisture naturally found within dentin.', icon: 'hydrophilic' },
    { title: 'Hydroxyapatite-forming chemistry', description: 'Supports a bioactive interface during setting.', icon: 'bioactive' },
    { title: 'High radiopacity', description: 'Clear radiographic visibility for review and documentation.', icon: 'radiopaque' },
    { title: 'High alkaline pH during setting', description: 'Maintains the chemical profile clinicians expect from calcium silicate sealers.', icon: 'alkaline' },
    { title: 'Zero-shrinkage positioning', description: 'Communicates dimensional stability in a careful, evidence-aware way.', icon: 'stability' },
  ],
  applications: ['Root canal sealing', 'Hydraulic obturation workflows', 'Single-cone obturation techniques'],
  packaging: ['1 x 2 g syringe', '15 x mixing tips'],
  faq: [
    { question: 'What type of sealer is iRoot SP?', answer: 'iRoot SP is a premixed calcium silicate-based bioceramic root canal sealer intended for canal filling and sealing procedures.' },
    { question: 'Is iRoot SP premixed?', answer: 'Yes. The material is supplied in a syringe format to remove chairside mixing steps and support consistent delivery.' },
    { question: 'How does iRoot SP set?', answer: 'It uses a moisture-assisted setting reaction, drawing on the moisture naturally present within dentin.' },
    { question: 'Is iRoot SP suitable for hydraulic single-cone obturation?', answer: 'The page positions iRoot SP for modern hydraulic single-cone and other obturation workflows where a premixed bioceramic sealer is preferred.' },
    { question: 'What packaging format is available?', answer: 'The current pack format listed on this site is one 2 g syringe with 15 mixing tips.' },
  ],
  regulatoryNote:
    'For professional dental use only. Refer to the IFU for indications, contraindications, precautions, and instructions for use.',
  clinicalProblem:
    'Conventional mixed sealers introduce avoidable variability at the point of obturation. Mixing inconsistency, handling changes over time, and workflow interruptions can make it harder to achieve a controlled final seal after shaping and irrigation have already been done well.',
  transformxSolution:
    'Within the EndoTech workflow, TransformX shaping creates the controlled canal geometry; iRoot SP completes that workflow with a premixed bioceramic sealer designed for moisture-assisted setting, consistent delivery, and stable canal sealing.',
  clinicalBenefits: [
    'Removes chairside mixing from the obturation step',
    'Supports flow into canal irregularities during placement',
    'Aligns with modern hydraulic obturation protocols',
    'Keeps the sealer stage consistent with a workflow-first treatment philosophy',
  ],
  clinicianReasons: [
    'No chairside mixing',
    'Consistent delivery from syringe to canal',
    'Flows into canal irregularities',
    'Compatible with modern hydraulic single-cone workflows',
    'Supports a simplified obturation protocol',
  ],
  story:
    'Unlike conventional base-catalyst sealers, iRoot SP uses moisture naturally present in dentin to initiate its setting reaction. Its calcium silicate-based chemistry promotes a bioactive interface and supports hydroxyapatite formation during setting. The material is positioned for dimensional stability, clinical convenience, and integration with modern endodontic workflows.',
  whatMakesItDifferent:
    'Unlike conventional mixed sealers, iRoot SP uses moisture within dentin to initiate its setting reaction, creating a stable, bioactive sealing environment.',
  proofBlocks: [
    {
      title: 'Moisture-activated setting',
      description: 'Sets using dentinal moisture, without adding a mixing step at the point of obturation.',
    },
    {
      title: 'High pH during setting',
      description: 'Maintains an alkaline setting profile associated with modern calcium silicate sealers.',
    },
    {
      title: 'Flow and adaptation',
      description: 'Designed to flow into canal irregularities as part of a hydraulic obturation workflow.',
    },
    {
      title: 'Bioactive interface',
      description: 'Supports hydroxyapatite-forming chemistry during setting.',
    },
  ],
  comparisonRows: [
    { label: 'Premixed delivery', iroot: 'Supplied ready to use in a syringe format', conventional: 'Requires chairside proportioning or mixing' },
    { label: 'Moisture-assisted set', iroot: 'Designed to set with dentinal moisture', conventional: 'Typically depends on mixed chemistry and timing' },
    { label: 'Hydrophilic behaviour', iroot: 'Built around moisture-compatible handling', conventional: 'Often less tolerant of moisture variation' },
    { label: 'Bioactive mineral response', iroot: 'Hydroxyapatite-forming positioning', conventional: 'Usually not presented as a bioactive interface' },
    { label: 'High pH during set', iroot: 'Part of the calcium silicate material profile', conventional: 'Varies by sealer chemistry' },
    { label: 'No mixing variability', iroot: 'Consistent syringe-based presentation', conventional: 'Technique-sensitive mixing can affect feel' },
    { label: 'Workflow efficiency', iroot: 'Simplified final step in obturation', conventional: 'Adds steps at the point of treatment completion' },
  ],
  ctas: [
    { label: 'Download brochure', href: '/products/iroot/evidence/#downloads' },
    { label: 'Request distributor information', href: '/about/contact/', variant: 'secondary' },
    { label: 'View evidence', href: '/products/iroot/evidence/', variant: 'ghost' },
  ],
};

export const irootBPPlus: ProductRecord & {
  clinicalProblem: string;
  transformxSolution: string;
  clinicalBenefits: string[];
  clinicianReasons: string[];
  story: string;
  comparisonRows: ComparisonRow[];
  ctas: CTAItem[];
} = {
  name: 'iRoot BP Plus',
  slug: 'iroot-bp-plus',
  headline: 'Premixed bioceramic root repair material with controlled handling',
  subheadline:
    'A premixed root repair material available for procedures requiring biocompatibility, dimensional stability, and practical chairside handling.',
  shortDescription:
    'A premixed bioceramic root repair material developed for perforation repair, retrograde filling, apexification, and pulp capping.',
  visualLabel: 'Root Repair Platform',
  featureBullets: [
    { title: 'Premixed delivery', description: 'Reduces technique sensitivity by removing hand mixing from repair procedures.', icon: 'premixed' },
    { title: 'Controlled handling', description: 'Supports placement for root repair and vital pulp procedures.', icon: 'handling' },
    { title: 'Washout resistance', description: 'Positioned for environments where material stability during placement matters.', icon: 'washout' },
    { title: 'Shortened setting profile', description: 'Communicates a practical chairside setting profile without overstatement.', icon: 'workflow' },
    { title: 'Highly biocompatible positioning', description: 'Aligned with the healing-focused expectations of modern repair materials.', icon: 'repair' },
    { title: 'Bioactive chemistry', description: 'Part of the same calcium silicate bioceramic logic used across the family.', icon: 'bioactive' },
  ],
  applications: ['Perforation repair', 'Retrograde root-end filling', 'Apexification', 'Resorption repair', 'Pulp capping'],
  packaging: ['1 x 0.5 g syringe', '15 x mixing tips'],
  faq: [
    { question: 'What procedures is iRoot BP Plus used for?', answer: 'The site positions iRoot BP Plus for perforation repair, retrograde root-end filling, apexification, resorption repair, and pulp capping.' },
    { question: 'Is iRoot BP Plus premixed?', answer: 'Yes. It is presented as a premixed repair material to remove the variability associated with hand-mixed alternatives.' },
    { question: 'What are the handling advantages versus mixed repair materials?', answer: 'The main handling message is consistency: clinicians can work from a ready-to-use material rather than mixing at the chairside and adjusting to variable consistency.' },
    { question: 'Is it suitable for pulp capping and apexification?', answer: 'Those two applications are both included within the intended clinical use-cases highlighted on this site.' },
    { question: 'What is supplied in the package?', answer: 'The pack format listed here is one 0.5 g syringe with 15 mixing tips.' },
  ],
  regulatoryNote:
    'For professional dental use only. Refer to the IFU for full indications, contraindications, precautions, and instructions for use.',
  clinicalProblem:
    'Repair procedures often happen under clinical pressure, where material handling and placement control matter as much as the chemistry itself. Mixed repair materials can add variability, waste, and interruption at exactly the point when procedural control needs to stay high.',
  transformxSolution:
    'The EndoTech workflow is built around control at every stage. After access, shaping, and disinfection are completed, iRoot BP Plus extends that logic into repair procedures with a premixed bioceramic material designed for practical delivery and biologically aligned case management.',
  clinicalBenefits: [
    'Simplifies placement by removing hand mixing',
    'Supports a consistent material feel across repair procedures',
    'Fits treatment steps where washout resistance and handling are clinically relevant',
    'Keeps repair choices aligned with a control-first workflow philosophy',
  ],
  clinicianReasons: [
    'Premixed material presentation',
    'Practical repair-oriented consistency',
    'Broad procedure fit across repair and vital pulp cases',
    'Handling profile suited to efficient chairside placement',
    'Bioceramic chemistry positioned for modern healing-oriented workflows',
  ],
  story:
    'iRoot BP Plus applies the same premixed bioceramic platform logic as iRoot SP to root repair and vital pulp procedures. By combining a ready-to-use format with favourable handling and a healing-oriented calcium silicate profile, it supports efficient treatment without the waste and inconsistency commonly associated with mixed repair materials.',
  comparisonRows: [
    { label: 'Premixed format', iroot: 'Ready-to-use syringe presentation', conventional: 'Hand-mixed before placement' },
    { label: 'Repair-oriented consistency', iroot: 'Positioned for controlled placement', conventional: 'Consistency may change with mixing ratio' },
    { label: 'Washout resistance', iroot: 'Included in the core handling message', conventional: 'Can be more technique-sensitive' },
    { label: 'High pH during set', iroot: 'Part of the calcium silicate profile', conventional: 'Depends on material type' },
    { label: 'Bioactive response', iroot: 'Healing-oriented material positioning', conventional: 'Often presented more narrowly as a filling material' },
    { label: 'No chairside mixing', iroot: 'No blending step before use', conventional: 'Mixing adds time and variability' },
  ],
  ctas: [
    { label: 'Download brochure', href: '/products/iroot/evidence/#downloads' },
    { label: 'View applications', href: '/products/iroot/clinical-applications/', variant: 'secondary' },
    { label: 'View evidence', href: '/products/iroot/evidence/', variant: 'ghost' },
  ],
};

export const familyCards = [
  { name: irootSP.name, slug: `/products/${irootSP.slug}/`, summary: 'Root canal sealer for hydraulic obturation and predictable canal sealing.', accent: 'teal' as const },
  { name: irootBPPlus.name, slug: `/products/${irootBPPlus.slug}/`, summary: 'Root repair material for perforation repair, retrograde filling, apexification, and pulp capping.', accent: 'violet' as const },
];

export const evidenceThemes: FeatureItem[] = [
  { title: 'Moisture-assisted calcium silicate setting chemistry', description: 'Relevant to the setting behaviour of bioceramic sealer and repair materials.', icon: 'hydrophilic' },
  { title: 'High pH during setting', description: 'A recognised characteristic of calcium silicate-based material chemistry.', icon: 'alkaline' },
  { title: 'Hydroxyapatite formation and bioactivity', description: 'Supports discussion of the interfacial behaviour associated with bioceramic materials.', icon: 'bioactive' },
  { title: 'Dimensional stability', description: 'Relevant when reviewing sealing performance and material adaptation.', icon: 'stability' },
  { title: 'Clinical suitability for obturation and repair workflows', description: 'Useful when considering material selection across sealing and repair procedures.', icon: 'workflow' },
];

export const evidenceCards = [
  { title: 'Bioceramic sealer chemistry and moisture-assisted setting', description: 'Supports understanding of how calcium silicate sealers set in the presence of moisture.' },
  { title: 'High pH during setting', description: 'Relevant to the material profile associated with modern bioceramic sealers and repair materials.' },
  { title: 'Dimensional stability', description: 'Important when reviewing sealing behaviour and material adaptation over time.' },
  { title: 'Hydroxyapatite formation and bioactive interface', description: 'Supports discussion of the material-to-dentin interface associated with bioceramic chemistry.' },
  { title: 'Premixed delivery and handling consistency', description: 'Highlights the practical advantages of a ready-to-use format in clinical workflows.' },
];

export const literatureReferences = [
  { citation: 'Zhang H, Shen Y, Ruse ND, Haapasalo M. Antibacterial activity of endodontic sealers by modified direct contact test against Enterococcus faecalis. Journal of Endodontics.', note: 'Relevant to the alkaline setting environment associated with bioceramic sealer chemistry.' },
  { citation: 'Loushine BA, Bryan TE, Looney SW, et al. Setting properties and cytotoxicity evaluation of a premixed bioceramic root canal sealer. Journal of Endodontics.', note: 'Relevant to setting behaviour, material profile, and laboratory characterisation.' },
  { citation: 'Candeiro GTM, Correia FC, Duarte MAH, Ribeiro-Siqueira DC, Gavini G. Evaluation of radiopacity, pH, release of calcium ions, and flow of a bioceramic root canal sealer. Journal of Endodontics.', note: 'Relevant to radiopacity, pH, calcium ion release, and flow characteristics.' },
  { citation: 'Tay FR, Pashley DH. Monoblocks in root canals: A hypothetical or a tangible goal. Journal of Endodontics.', note: 'Provides context for discussion of the material interface within root canal treatment.' },
];

export function getProductDownloads(downloads: DownloadItem[]) {
  return downloads.length > 0
    ? downloads
    : [{ label: 'Drop brochure, IFU, SDS, or evidence files into public/downloads/iroot/', href: '#', type: 'Document' as const, fileName: 'placeholder' }];
}
