export interface BlogIdea {
  slug: string;
  title: string;
  category: 'Anatomy' | 'Technique' | 'Clinical Thinking' | 'Evidence' | 'Clinical';
  summary: string;
  readTime: string;
  image: string;
  focus: string;
  placeholders: string[];
}

export const blogIdeas: BlogIdea[] = [
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
];

export function getBlogIdeaBySlug(slug: string) {
  return blogIdeas.find((idea) => idea.slug === slug);
}
