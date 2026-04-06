import type { PromoSceneDurations, PromoVideoData } from "./promoTypes";

export const defaultSceneDurations: PromoSceneDurations = {
  intro: 120,
  clinicalProblem: 120,
  solution: 180,
  features: 180,
  benefits: 150,
  cta: 120,
};

export const promoVideos: PromoVideoData[] = [
  {
    id: "transformx",
    title: "TransformX",
    subtitle: "Rotary file system for controlled canal progression",
    heroLabel: "Clinical Promo Template",
    logoSrc: "assets/logo-wordmark-dark.png",
    heroImageSrc: "assets/TransformX_All_In_Single_Image.png",
    backgroundMusicSrc: "assets/music.mp3",
    products: [
      {
        name: "ET TransformX",
        imageSrc: "assets/et-transformx.png",
        accent: "#34d399",
      },
      {
        name: "PT TransformX",
        imageSrc: "assets/TransformX_All_In_Single_Image.png",
        accent: "#22d3ee",
      },
      {
        name: "iRoot Sealer",
        imageSrc: "assets/iroot-sealer.png",
        accent: "#f59e0b",
      },
    ],
    clinicalProblem: {
      eyebrow: "Clinical Problem",
      headline: "Unexpected canal behaviour increases procedural risk.",
      body: "Abrupt engagement, poor centering, and inconsistent file progression make it harder to maintain control in demanding anatomy.",
      risks: [
        "Ledging and transportation compromise shaping accuracy.",
        "Loss of tactile confidence slows treatment decisions.",
        "Separation risk rises when progression becomes unpredictable.",
      ],
    },
    solution: {
      eyebrow: "TransformX Solution",
      headline: "Avatar tip geometry supports controlled advancement to working length.",
      body: "TransformX pairs apical guidance with a familiar workflow so clinicians can adapt technique without giving up procedural discipline.",
      featurePills: ["Control", "Safety", "Adaptability"],
      supportText: "Designed to reduce procedural surprises while preserving efficient sequencing.",
      imageSrc: "assets/Avatar_Tip_comparison.png",
    },
    keyFeatures: {
      eyebrow: "Key Features",
      headline: "Features linked directly to clinical control.",
      items: [
        {
          title: "Avatar tip profile",
          description: "Supports centered progression and helps reduce ledging, transportation, and perforation risk.",
        },
        {
          title: "Consistent file behaviour",
          description: "Improves tactile predictability so the clinician can respond earlier and with more confidence.",
        },
        {
          title: "System adaptability",
          description: "Fits established endodontic workflows without adding unnecessary procedural complexity.",
        },
      ],
    },
    clinicalBenefits: {
      eyebrow: "Clinical Benefits",
      headline: "A repeatable outcome-focused message.",
      items: [
        "Reach working length with greater procedural confidence.",
        "Maintain technique familiarity while improving control.",
        "Reduce separation-related stress in complex canals.",
      ],
    },
    cta: {
      eyebrow: "TransformX",
      headline: "Structured for clinicians. Adaptable for every product message.",
      subheadline: "Swap the copy, imagery, and claims while keeping one consistent promo format.",
      contactLabel: "Contact",
      contactValue: "info@endotechsg.com",
    },
  },
  {
    id: "et-transformx",
    title: "ET TransformX Files",
    subtitle: "No technique change.",
    heroLabel: "ET TransformX",
    logoSrc: "assets/logo-wordmark-dark.png",
    heroImageSrc: "assets/et-transformx.png",
    backgroundMusicSrc: "assets/music.mp3",
    products: [
      {
        name: "ET TransformX",
        imageSrc: "assets/et-transformx.png",
        accent: "#34d399",
      },
      {
        name: "Avatar Tip",
        imageSrc: "assets/Avatar_Tip_comparison.png",
        accent: "#22d3ee",
      },
      {
        name: "Transform Technology",
        imageSrc: "assets/TransformX_All_In_Single_Image.png",
        accent: "#f59e0b",
      },
    ],
    clinicalProblem: {
      eyebrow: "Clinical Problem",
      headline: "Unexpected anatomy changes everything.",
      body: "You need more control, not a new workflow.",
      risks: [
        "Keep the ET-style technique you already know.",
        "Follow challenging canals with more controlled tip behaviour.",
        "Balance apical flexibility with confident coronal cutting.",
      ],
    },
    solution: {
      eyebrow: "TransformX Solution",
      headline: "Familiar technique. Different file behaviour.",
      body:
        "Avatar Tip follows challenging anatomy. Transform Technology varies the metallurgy along the file for flexibility at the tip and cutting strength higher in the canal.",
      featurePills: ["No technique change", "Avatar Tip", "Variable metallurgy"],
      supportText:
        "Built to feel familiar from the first file onward.",
      imageSrc: "assets/Avatar_Tip_comparison.png",
    },
    keyFeatures: {
      eyebrow: "Key Features",
      headline: "",
      items: [
        {
          title: "No technique change",
          description:
            "Stay with your established technique.",
        },
        {
          title: "Avatar Tip follows challenging anatomy",
          description:
            "More controlled apical progression in difficult canals.",
        },
        {
          title: "Transform Technology varies the metallurgy along the file",
          description:
            "Flexible where you need it. Cutting where you need it.",
        },
      ],
    },
    clinicalBenefits: {
      eyebrow: "Clinical Benefits",
      headline: "Control without compromise.",
      items: [
        "No technique change.",
        "Follow unexpected anatomy.",
        "Flexible tip. Stronger mid-root and coronal cutting.",
      ],
    },
    cta: {
      eyebrow: "ET TransformX",
      headline: "No technique change. More control.",
      subheadline:
        "ET TransformX is designed for clinicians who want familiarity at hand and adaptability in the canal.",
      contactLabel: "Learn more",
      contactValue: "info@endotechsg.com",
    },
    timings: {
      intro: 210,
      clinicalProblem: 240,
      solution: 340,
      features: 360,
      benefits: 290,
      cta: 210,
    },
  },
];

export const getSceneDurations = (
  video: PromoVideoData,
): PromoSceneDurations => ({
  ...defaultSceneDurations,
  ...video.timings,
});

export const getTotalFrames = (video: PromoVideoData) =>
  Object.values(getSceneDurations(video)).reduce((total, frames) => total + frames, 0);
