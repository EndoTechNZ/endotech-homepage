export interface BlogIdea {
  slug: string;
  title: string;
  category: 'Anatomy' | 'Technique' | 'Clinical Thinking' | 'Evidence' | 'Clinical' | 'VPT';
  summary: string;
  readTime: string;
  image: string;
  focus: string;
  placeholders: string[];
  published?: string;
}

export const blogIdeas: BlogIdea[] = [
  {
    slug: 'working-length-when-the-file-will-not-progress',
    title: 'Working length when the file will not progress',
    category: 'Technique',
    summary: 'How to separate canal negotiation, apex-locator interpretation, and the true apical endpoint.',
    readTime: '5 min read',
    image: '/blog/reading-anatomy-not-guessing.png',
    focus: 'A problem-first guide to resistant canals and conflicting working-length signals.',
    placeholders: ['Interpret the signal', 'Remove coronal interference', 'Triangulate the endpoint', 'Know when to stop'],
    published: '27 July 2026',
  },
  {
    slug: 'rubber-dam-seal-before-root-canal-access',
    title: 'The seal before the access',
    category: 'Clinical Thinking',
    summary: 'Why rubber dam and pre-endodontic build-up are active parts of disinfection control.',
    readTime: '5 min read',
    image: '/blog/access-with-purpose.png',
    focus: 'Isolation, restorability, deep margins, and irrigant containment before access.',
    placeholders: ['Define the isolation problem', 'Assess restorability', 'Create the peripheral seal', 'Recheck control'],
    published: '27 July 2026',
  },
  {
    slug: 'irrigation-activation-what-is-it-solving',
    title: 'Irrigation activation: what is it solving?',
    category: 'Evidence',
    summary: 'Device debates make more sense after fresh chemistry, backflow, and apical safety are controlled.',
    readTime: '5 min read',
    image: '/blog/irrigation-dynamics-that-matter.png',
    focus: 'A disciplined comparison of delivery, exchange, replenishment, and activation.',
    placeholders: ['Start with the fluid problem', 'Create a safe pathway', 'Activate fresh chemistry', 'Match method to risk'],
    published: '27 July 2026',
  },
  {
    slug: 'sodium-hypochlorite-concentration-is-not-the-protocol',
    title: 'NaOCl concentration is not the protocol',
    category: 'Evidence',
    summary: 'Why stronger solution cannot replace controlled delivery, renewal, contact time, and containment.',
    readTime: '5 min read',
    image: '/blog/evidence-in-everyday-endo.png',
    focus: 'A practical discussion of concentration, CHX, chemical sequence, and extrusion risk.',
    placeholders: ['Frame the concentration debate', 'Separate irrigant roles', 'Audit delivery', 'Adapt to risk'],
    published: '27 July 2026',
  },
  {
    slug: 'vertucci-canal-pathways',
    title: 'Vertucci canal pathways: read the route before you shape',
    category: 'Anatomy',
    summary: 'A visual guide to the eight classic canal configurations—and the clinical questions each pathway should prompt.',
    readTime: '5 min read',
    image: '/blog/vertucci-canal-pathways.svg',
    focus: 'Eight original schematics for reading canal division, convergence, and apical exit patterns.',
    placeholders: ['Read the notation', 'Compare the eight types', 'Apply three clinical checks', 'Evidence and limitations'],
  },
  {
    slug: 'reading-anatomy-not-guessing',
    title: 'Reading Anatomy, Not Guessing',
    category: 'Anatomy',
    summary: 'Why shaping success starts with anatomical respect.',
    readTime: '10 min read',
    image: '/blog/reading-anatomy-not-guessing.png',
    focus: 'Anatomical interpretation before instrumentation.',
    placeholders: ['Clinical problem', 'Anatomical observations', 'Technique implications', 'Case notes'],
  },
  {
    slug: 'file-design-in-real-life',
    title: 'File Design in Real Life',
    category: 'Technique',
    summary: 'How metallurgy and motion translate to clinical confidence.',
    readTime: '8 min read',
    image: '/blog/file-design-in-real-life.png',
    focus: 'Connecting file geometry, motion, and controlled preparation.',
    placeholders: ['Clinical problem', 'Design notes', 'Workflow application', 'Key takeaways'],
  },
  {
    slug: 'access-with-purpose',
    title: 'Access With Purpose',
    category: 'Clinical Thinking',
    summary: 'Design thinking for visibility, conservation and cleanliness.',
    readTime: '7 min read',
    image: '/blog/access-with-purpose.png',
    focus: 'Access design as a clinical control decision.',
    placeholders: ['Clinical problem', 'Access objectives', 'Decision framework', 'Case notes'],
  },
  {
    slug: 'irrigation-dynamics-that-matter',
    title: 'Interesting Ideas on Irrigation',
    category: 'Evidence',
    summary: 'How flow, chemistry and activation reach the anatomy files leave behind.',
    readTime: '11 min read',
    image: '/blog/irrigation-dynamics-that-matter.png',
    focus: 'Evidence-informed irrigation choices for canal cleanliness and safety.',
    placeholders: ['Clinical problem', 'Evidence notes', 'Irrigation variables', 'Clinical implications'],
  },
  {
    slug: 'evidence-in-everyday-endo',
    title: 'Evidence in Everyday Endo',
    category: 'Clinical',
    summary: 'Applying research where it changes patient outcomes.',
    readTime: '9 min read',
    image: '/blog/evidence-in-everyday-endo.png',
    focus: 'Practical translation of research into routine endodontic decisions.',
    placeholders: ['Clinical problem', 'Evidence summary', 'Practice application', 'Outcome considerations'],
  },
  {
    slug: 'stepwise-chairside-vital-pulp-therapy-technique',
    title: 'Stepwise Chairside vital pulp therapy technique',
    category: 'VPT',
    summary: 'A controlled sequence for case selection, asepsis, haemostasis, pulp protection, and definitive sealing.',
    readTime: '7 min read',
    image: '/blog/stepwise-chairside-vital-pulp-therapy-technique.png',
    focus: 'A practical permanent-tooth VPT sequence for selection, treatment, sealing, and review.',
    placeholders: ['Case selection', 'Operative sequence', 'Haemostasis pathway', 'Seal and review'],
  },
];

export function getBlogIdeaBySlug(slug: string) {
  return blogIdeas.find((idea) => idea.slug === slug);
}
