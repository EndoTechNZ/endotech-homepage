export type PromoFeature = {
  title: string;
  description: string;
};

export type PromoProductCard = {
  name: string;
  imageSrc: string;
  accent: string;
};

export type PromoSection = {
  eyebrow: string;
  headline: string;
  body: string;
};

export type PromoSceneDurations = {
  intro: number;
  clinicalProblem: number;
  solution: number;
  features: number;
  benefits: number;
  cta: number;
};

export type PromoVideoData = {
  id: string;
  title: string;
  subtitle: string;
  heroLabel: string;
  logoSrc: string;
  heroImageSrc: string;
  backgroundMusicSrc?: string;
  products: PromoProductCard[];
  clinicalProblem: PromoSection & {
    risks: string[];
  };
  solution: PromoSection & {
    featurePills: string[];
    supportText?: string;
    imageSrc: string;
  };
  keyFeatures: {
    eyebrow: string;
    headline: string;
    items: PromoFeature[];
  };
  clinicalBenefits: {
    eyebrow: string;
    headline: string;
    items: string[];
  };
  cta: {
    eyebrow?: string;
    headline: string;
    subheadline: string;
    contactLabel: string;
    contactValue: string;
  };
  timings?: Partial<PromoSceneDurations>;
};
