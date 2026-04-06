import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getSceneDurations } from "./promoData";
import type { PromoFeature, PromoSceneDurations, PromoVideoData } from "./promoTypes";

const palette = {
  bg: "#07111f",
  bgAlt: "#10233d",
  panel: "rgba(7, 17, 31, 0.72)",
  line: "rgba(148, 163, 184, 0.22)",
  text: "#f8fafc",
  muted: "#b8c4d4",
  accent: "#5eead4",
  accentSoft: "rgba(94, 234, 212, 0.14)",
};

const fadeUp = (frame: number, start: number, duration = 24) => ({
  opacity: interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }),
  transform: `translateY(${interpolate(frame, [start, start + duration], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  })}px)`,
});

const AnimatedGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const offset = interpolate(frame, [0, 180], [0, 70], {
    extrapolateRight: "extend",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        transform: `translate3d(0, ${offset}px, 0)`,
        opacity: 0.45,
      }}
    />
  );
};

const AmbientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 24), [-1, 1], [0.88, 1.1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${palette.bg} 0%, ${palette.bgAlt} 58%, ${palette.bg} 100%)`,
        overflow: "hidden",
      }}
    >
      <AnimatedGrid />
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -120,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(94, 234, 212, 0.24) 0%, rgba(94, 234, 212, 0) 72%)",
          transform: `scale(${pulse})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -220,
          left: -120,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.22) 0%, rgba(34, 211, 238, 0) 74%)",
          transform: `scale(${2 - pulse})`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

const Eyebrow: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: palette.accent,
      marginBottom: 22,
    }}
  >
    {text}
  </div>
);

const TwoColumnScene: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = ({ left, right }) => (
  <AmbientBackground>
    <div
      style={{
        position: "absolute",
        inset: "92px 110px",
        display: "grid",
        gridTemplateColumns: "1.05fr 0.95fr",
        gap: 56,
        alignItems: "center",
      }}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  </AmbientBackground>
);

const FrameCard: React.FC<{ children: React.ReactNode; accent?: string }> = ({
  children,
  accent = palette.accent,
}) => (
  <div
    style={{
      border: `1px solid ${palette.line}`,
      borderRadius: 28,
      background: `linear-gradient(180deg, rgba(7, 17, 31, 0.86) 0%, rgba(7, 17, 31, 0.62) 100%)`,
      boxShadow: `0 24px 80px rgba(0, 0, 0, 0.28), inset 0 0 0 1px rgba(255, 255, 255, 0.02)`,
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 28,
        boxShadow: `inset 0 0 120px ${accent}14`,
        pointerEvents: "none",
      }}
    />
    {children}
  </div>
);

const IntroScene: React.FC<{ video: PromoVideoData }> = ({ video }) => {
  const frame = useCurrentFrame();
  const imageFloat = interpolate(Math.sin(frame / 30), [-1, 1], [-18, 18]);
  const imageRotate = interpolate(Math.sin(frame / 45), [-1, 1], [-2, 2]);

  return (
    <TwoColumnScene
      left={
        <div>
          <div style={fadeUp(frame, 0)}>
            <Img src={staticFile(video.logoSrc)} style={{ height: 62, marginBottom: 54 }} />
          </div>
          <div style={fadeUp(frame, 6)}>
            <Eyebrow text={video.heroLabel} />
          </div>
          <div
            style={{
              ...fadeUp(frame, 12),
              fontSize: 104,
              lineHeight: 0.98,
              fontWeight: 800,
              color: palette.text,
              maxWidth: 760,
            }}
          >
            {video.title}
          </div>
          <div
            style={{
              ...fadeUp(frame, 24),
              fontSize: 40,
              lineHeight: 1.2,
              color: palette.muted,
              marginTop: 26,
              maxWidth: 620,
            }}
          >
            {video.subtitle}
          </div>
          <div
            style={{
              ...fadeUp(frame, 36),
              marginTop: 42,
              width: interpolate(frame, [36, 84], [0, 480], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              height: 4,
              borderRadius: 999,
              background: "linear-gradient(90deg, #5eead4 0%, rgba(94, 234, 212, 0) 100%)",
            }}
          />
        </div>
      }
      right={
        <div
          style={{
            ...fadeUp(frame, 18),
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile(video.heroImageSrc)}
            style={{
              width: 780,
              objectFit: "contain",
              filter: "drop-shadow(0 48px 80px rgba(0,0,0,0.4))",
              transform: `translateY(${imageFloat}px) rotate(${imageRotate}deg)`,
            }}
          />
        </div>
      }
    />
  );
};

const ClinicalProblemScene: React.FC<{ video: PromoVideoData }> = ({ video }) => {
  const frame = useCurrentFrame();

  return (
    <TwoColumnScene
      left={
        <div>
          <div style={fadeUp(frame, 0)}>
            <Eyebrow text={video.clinicalProblem.eyebrow} />
          </div>
          <div
            style={{
              ...fadeUp(frame, 10),
              fontSize: 82,
              lineHeight: 1.04,
              fontWeight: 760,
              color: palette.text,
              maxWidth: 720,
            }}
          >
            {video.clinicalProblem.headline}
          </div>
          <div
            style={{
              ...fadeUp(frame, 24),
              marginTop: 28,
              color: palette.muted,
              fontSize: 34,
              lineHeight: 1.28,
              maxWidth: 600,
            }}
          >
            {video.clinicalProblem.body}
          </div>
        </div>
      }
      right={
        <FrameCard accent="#fb7185">
          <div style={{ padding: "46px 42px" }}>
            {video.clinicalProblem.risks.map((risk, index) => (
              <div
                key={risk}
                style={{
                  ...fadeUp(frame, 18 + index * 12),
                  display: "grid",
                  gridTemplateColumns: "56px 1fr",
                  gap: 18,
                  alignItems: "start",
                  padding: index === 0 ? "0 0 24px" : "24px 0",
                  borderTop: index === 0 ? "none" : `1px solid ${palette.line}`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(251, 113, 133, 0.35)",
                    color: "#fda4af",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 16,
                    marginTop: 4,
                  }}
                >
                  0{index + 1}
                </div>
                <div style={{ color: palette.text, fontSize: 24, lineHeight: 1.3 }}>{risk}</div>
              </div>
            ))}
          </div>
        </FrameCard>
      }
    />
  );
};

const SolutionScene: React.FC<{ video: PromoVideoData }> = ({ video }) => {
  const frame = useCurrentFrame();

  return (
    <TwoColumnScene
      left={
        <div>
          <div style={fadeUp(frame, 0)}>
            <Eyebrow text={video.solution.eyebrow} />
          </div>
          <div
            style={{
              ...fadeUp(frame, 10),
              fontSize: 80,
              lineHeight: 1.04,
              fontWeight: 760,
              color: palette.text,
              maxWidth: 760,
            }}
          >
            {video.solution.headline}
          </div>
          <div
            style={{
              ...fadeUp(frame, 24),
              marginTop: 28,
              color: palette.muted,
              fontSize: 28,
              lineHeight: 1.32,
              maxWidth: 640,
            }}
          >
            {video.solution.body}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              marginTop: 34,
            }}
          >
            {video.solution.featurePills.map((pill, index) => (
              <div
                key={pill}
                style={{
                  ...fadeUp(frame, 30 + index * 8),
                  padding: "14px 24px",
                  borderRadius: 999,
                  background: palette.accentSoft,
                  border: "1px solid rgba(94, 234, 212, 0.2)",
                  color: palette.text,
                  fontSize: 20,
                  fontWeight: 650,
                }}
              >
                {pill}
              </div>
            ))}
          </div>
          {video.solution.supportText ? (
            <div
              style={{
                ...fadeUp(frame, 52),
                marginTop: 28,
                color: "#dbeafe",
                fontSize: 22,
                lineHeight: 1.35,
                maxWidth: 520,
              }}
            >
              {video.solution.supportText}
            </div>
          ) : null}
        </div>
      }
      right={
        <div style={fadeUp(frame, 18)}>
          <FrameCard>
            <div style={{ padding: 28 }}>
              <Img
                src={staticFile(video.solution.imageSrc)}
                style={{
                  width: "100%",
                  borderRadius: 22,
                  display: "block",
                }}
              />
            </div>
          </FrameCard>
        </div>
      }
    />
  );
};

const FeatureCard: React.FC<{ feature: PromoFeature; index: number }> = ({
  feature,
  index,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        ...fadeUp(frame, 18 + index * 10),
        padding: "28px 30px 30px",
        borderRadius: 24,
        border: `1px solid ${palette.line}`,
        background: "rgba(7, 17, 31, 0.6)",
      }}
    >
      <div style={{ color: palette.accent, fontSize: 18, fontWeight: 700, marginBottom: 18 }}>
        Feature 0{index + 1}
      </div>
      <div style={{ color: palette.text, fontSize: 30, fontWeight: 720, lineHeight: 1.15 }}>
        {feature.title}
      </div>
      <div style={{ color: palette.muted, fontSize: 20, lineHeight: 1.35, marginTop: 14 }}>
        {feature.description}
      </div>
    </div>
  );
};

const KeyFeaturesScene: React.FC<{ video: PromoVideoData }> = ({ video }) => {
  const frame = useCurrentFrame();
  const featureDuration = 120;
  const avatarTipVideo = staticFile("assets/avatar-tip-rounded.mp4");

  return (
    <AmbientBackground>
      <div
        style={{
          position: "absolute",
          inset: "120px 140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: 1320, minHeight: 560 }}>
          {video.keyFeatures.items.map((feature, index) => {
            const start = 10 + index * featureDuration;
            const end = start + featureDuration;
            const visibility = interpolate(
              frame,
              [start, start + 12, end - 12, end],
              [0, 1, 1, 0],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            const y = interpolate(frame, [start, start + 16], [30, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={feature.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: visibility,
                  transform: `translateY(${y}px)`,
                  pointerEvents: "none",
                }}
              >
                {index === 1 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.8fr 1.2fr",
                      gap: 56,
                      alignItems: "center",
                      minHeight: 620,
                    }}
                  >
                    <div style={{ maxWidth: 560 }}>
                      <div
                        style={{
                          color: palette.accent,
                          fontSize: 22,
                          fontWeight: 700,
                          letterSpacing: 3,
                          textTransform: "uppercase",
                          marginBottom: 26,
                        }}
                      >
                        Feature 0{index + 1}
                      </div>
                      <div
                        style={{
                          color: palette.text,
                          fontSize: 72,
                          lineHeight: 0.96,
                          fontWeight: 780,
                          letterSpacing: -1.5,
                        }}
                      >
                        {feature.title}
                      </div>
                      <div
                        style={{
                          color: palette.muted,
                          fontSize: 26,
                          lineHeight: 1.22,
                          marginTop: 24,
                          maxWidth: 520,
                        }}
                      >
                        {feature.description}
                      </div>
                    </div>
                    <div
                      style={{
                        position: "relative",
                        height: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          width: 720,
                          height: 720,
                          borderRadius: 999,
                          background:
                            "radial-gradient(circle, rgba(54,211,238,0.2) 0%, rgba(54,211,238,0.08) 34%, rgba(54,211,238,0) 72%)",
                          filter: "blur(20px)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: "36px 26px",
                          borderRadius: 34,
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          transform: "rotate(-2deg)",
                        }}
                      />
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: 520,
                          borderRadius: 34,
                          overflow: "hidden",
                          background: "rgba(6, 12, 22, 0.7)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "0 36px 100px rgba(0,0,0,0.4)",
                        }}
                      >
                      <OffthreadVideo
                        src={avatarTipVideo}
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: "scale(1.12)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(180deg, rgba(7,17,31,0.03) 0%, rgba(7,17,31,0.16) 100%)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: "0 0 auto 0",
                          height: 160,
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)",
                          mixBlendMode: "screen",
                          opacity: 0.5,
                        }}
                      />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        color: palette.accent,
                        fontSize: 26,
                        fontWeight: 700,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        marginBottom: 30,
                      }}
                    >
                      Feature 0{index + 1}
                    </div>
                    <div
                      style={{
                        color: palette.text,
                        fontSize: 96,
                        lineHeight: 0.98,
                        fontWeight: 780,
                        maxWidth: 1080,
                      }}
                    >
                      {feature.title}
                    </div>
                    <div
                      style={{
                        color: palette.muted,
                        fontSize: 40,
                        lineHeight: 1.18,
                        marginTop: 28,
                        maxWidth: 940,
                      }}
                    >
                      {feature.description}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AmbientBackground>
  );
};

const ClinicalBenefitsScene: React.FC<{ video: PromoVideoData }> = ({ video }) => {
  const frame = useCurrentFrame();

  return (
    <TwoColumnScene
      left={
        <div>
          <div style={fadeUp(frame, 0)}>
            <Eyebrow text={video.clinicalBenefits.eyebrow} />
          </div>
          <div
            style={{
              ...fadeUp(frame, 10),
              fontSize: 86,
              lineHeight: 1.02,
              fontWeight: 760,
              color: palette.text,
              maxWidth: 720,
            }}
          >
            {video.clinicalBenefits.headline}
          </div>
          <div
            style={{
              ...fadeUp(frame, 22),
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: 520,
            }}
          >
            <Img
              src={staticFile(video.heroImageSrc)}
              style={{
                width: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 36px 70px rgba(0,0,0,0.35))",
              }}
            />
          </div>
        </div>
      }
      right={
        <FrameCard>
          <div style={{ padding: "40px 42px" }}>
            {video.clinicalBenefits.items.map((benefit, index) => (
              <div
                key={benefit}
                style={{
                  ...fadeUp(frame, 18 + index * 14),
                  display: "grid",
                  gridTemplateColumns: "28px 1fr",
                  gap: 18,
                  alignItems: "start",
                  padding: index === 0 ? "0 0 22px" : "22px 0",
                  borderTop: index === 0 ? "none" : `1px solid ${palette.line}`,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: palette.accent,
                    marginTop: 12,
                    boxShadow: "0 0 20px rgba(94, 234, 212, 0.45)",
                  }}
                />
                <div style={{ color: palette.text, fontSize: 34, lineHeight: 1.24, fontWeight: 680 }}>{benefit}</div>
              </div>
            ))}
          </div>
        </FrameCard>
      }
    />
  );
};

const CallToActionScene: React.FC<{ video: PromoVideoData }> = ({ video }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardScale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 110 },
  });

  return (
    <AmbientBackground>
      <div
        style={{
          position: "absolute",
          inset: "120px 180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${cardScale})`,
            width: "100%",
          }}
        >
          <FrameCard>
            <div
              style={{
                padding: "70px 72px 64px",
                textAlign: "center",
              }}
            >
              <div style={fadeUp(frame, 0)}>
                <Eyebrow text={video.cta.eyebrow ?? "TransformX"} />
              </div>
              <div
                style={{
                  ...fadeUp(frame, 8),
                  color: palette.text,
                  fontSize: 78,
                  lineHeight: 1.04,
                  fontWeight: 780,
                  maxWidth: 960,
                  margin: "0 auto",
                }}
              >
                {video.cta.headline}
              </div>
              <div
                style={{
                  ...fadeUp(frame, 18),
                  color: palette.muted,
                  fontSize: 24,
                  lineHeight: 1.35,
                  maxWidth: 760,
                  margin: "26px auto 0",
                }}
              >
                {video.cta.subheadline}
              </div>
              <div
                style={{
                  ...fadeUp(frame, 28),
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "18px 30px",
                  borderRadius: 999,
                  background: palette.accentSoft,
                  border: "1px solid rgba(94, 234, 212, 0.2)",
                  color: palette.text,
                  marginTop: 38,
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                <span style={{ color: palette.accent }}>{video.cta.contactLabel}</span>
                <span>{video.cta.contactValue}</span>
              </div>
            </div>
          </FrameCard>
        </div>
      </div>
    </AmbientBackground>
  );
};

const scenes = (
  video: PromoVideoData,
): Array<{ key: keyof PromoSceneDurations; component: React.ReactNode }> => [
  { key: "intro", component: <IntroScene video={video} /> },
  { key: "clinicalProblem", component: <ClinicalProblemScene video={video} /> },
  { key: "solution", component: <SolutionScene video={video} /> },
  { key: "features", component: <KeyFeaturesScene video={video} /> },
  { key: "benefits", component: <ClinicalBenefitsScene video={video} /> },
  { key: "cta", component: <CallToActionScene video={video} /> },
];

const BackgroundMusic: React.FC<{ src?: string }> = ({ src }) => {
  const frame = useCurrentFrame();

  if (!src) {
    return null;
  }

  const volume = interpolate(frame, [0, 60], [0, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return <Audio src={staticFile(src)} volume={volume} />;
};

export const PromoTemplate: React.FC<{ video: PromoVideoData }> = ({ video }) => {
  const durations = getSceneDurations(video);
  let currentStart = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.bg,
        fontFamily: '"Myriad Pro", "MyriadPro-Regular", Arial, sans-serif',
      }}
    >
      <BackgroundMusic src={video.backgroundMusicSrc} />
      {scenes(video).map((scene) => {
        const sequence = (
          <Sequence
            key={scene.key}
            from={currentStart}
            durationInFrames={durations[scene.key]}
          >
            {scene.component}
          </Sequence>
        );

        currentStart += durations[scene.key];
        return sequence;
      })}
    </AbsoluteFill>
  );
};
