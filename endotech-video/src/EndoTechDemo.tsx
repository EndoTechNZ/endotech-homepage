import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Easing,
  Img,
  Audio,
  staticFile,
} from "remotion";
import timing from "./timing.json";

// Import images
const logoWordmark = staticFile("assets/logo-wordmark-dark.png");
const musicTrack = staticFile("assets/music.mp3");
const allProducts = staticFile("assets/TransformX_All_In_Single_Image.png");
const etProduct = staticFile("assets/et-transformx.png");
const ptProduct = staticFile("assets/TransformX_All_In_Single_Image.png");
const irootProduct = staticFile("assets/iroot-sealer.png");
const avatarTip = staticFile("assets/Avatar_Tip_comparison.png");

// Scene components map
const sceneComponents: Record<string, React.FC<{ timing?: typeof timing }>> = {
  IntroScene: () => <IntroScene />,
  ProblemScene: () => <ProblemScene />,
  TechnologyScene: () => <TechnologyScene />,
  ProductsScene: () => <ProductsScene />,
  BenefitsScene: () => <BenefitsScene timing={timing} />,
  CTAScene: () => <CTAScene />,
};

// Color palette
const colors = {
  darkBg: "#0f172a",
  darkBg2: "#1e293b",
  cyan: "#22d3ee",
  cyanDark: "#06b6d4",
  white: "#f8fafc",
  slate: "#94a3b8",
  amber: "#f59e0b",
};

// Floating particles component
const FloatingParticles: React.FC<{ count?: number; color?: string }> = ({
  count = 20,
  color = colors.cyan,
}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const seed = i * 137.5;
        const x = (seed * 7) % 100;
        const y = (seed * 13) % 100;
        const size = 3 + (seed % 8);
        const speed = 0.3 + (seed % 10) / 20;
        const delay = seed % 60;

        const yOffset = ((frame + delay) * speed) % 120 - 20;
        const xWobble = Math.sin((frame + seed) / 30) * 20;
        const opacity = interpolate(
          yOffset,
          [-20, 0, 80, 100],
          [0, 0.6, 0.6, 0]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y - yOffset}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: opacity * 0.5,
              transform: `translateX(${xWobble}px)`,
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};

// Animated gradient background
const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const gradientAngle = interpolate(frame, [0, 300], [135, 180]);

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, ${colors.cyan}15 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, ${colors.cyanDark}10 0%, transparent 50%),
          linear-gradient(${gradientAngle}deg, ${colors.darkBg} 0%, ${colors.darkBg2} 50%, ${colors.darkBg} 100%)
        `,
        overflow: "hidden",
      }}
    >
      <FloatingParticles />
      {children}
    </AbsoluteFill>
  );
};

// Glowing orb decoration
const GlowOrb: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  delay?: number;
}> = ({ x, y, size, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const pulse = interpolate(
    Math.sin((frame + delay) / 20),
    [-1, 1],
    [0.8, 1.2]
  );
  const drift = Math.sin((frame + delay) / 40) * 30;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        transform: `scale(${pulse}) translateY(${drift}px)`,
        filter: `blur(${size / 4}px)`,
      }}
    />
  );
};

// Scene 1: Hero Intro with Logo
// Everything visible from frame 0, only the gradient line animates
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle product float animation (but visible from start)
  const productRotate = interpolate(frame, [0, 150], [3, -2]);
  const productY = interpolate(frame, [0, 150], [0, -20], {
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <GradientBackground>
      <GlowOrb x={-100} y={100} size={400} color={colors.cyan} />
      <GlowOrb x={1600} y={600} size={500} color={colors.cyanDark} delay={20} />

      {/* Logo - visible from frame 0 */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 100,
        }}
      >
        <Img src={logoWordmark} style={{ height: 80 }} />
      </div>

      {/* Main product hero - visible from frame 0 with subtle float */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: "50%",
          transform: `translateY(-50%) rotate(${productRotate}deg) translateY(${productY}px)`,
        }}
      >
        <Img
          src={allProducts}
          style={{
            height: 900,
            filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.5))",
          }}
        />
      </div>

      {/* Hero text - all visible from frame 0 */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 800,
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: colors.cyan,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Introducing
        </div>
        <div
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: colors.white,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
          }}
        >
          TransformX™
        </div>
        <div
          style={{
            fontSize: 42,
            color: colors.slate,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 500,
            marginTop: 20,
          }}
        >
          Rotary Endodontic Files
        </div>

        {/* Animated gradient line - the ONLY animation in intro */}
        <div
          style={{
            width: interpolate(frame, [20, 80], [0, 600], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            height: 4,
            background: `linear-gradient(90deg, ${colors.cyan}, transparent)`,
            marginTop: 40,
            borderRadius: 2,
            opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        />
      </div>
    </GradientBackground>
  );
};

// Scene 2: Problem Statement
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  const shake = frame > 30 && frame < 90
    ? Math.sin(frame * 0.5) * interpolate(frame, [30, 60, 90], [0, 3, 0])
    : 0;

  const unexpectedScale = spring({
    frame: frame - 20,
    fps: 30,
    config: { damping: 8, stiffness: 60 },
  });

  const glitchOffset = frame > 30 && frame < 40
    ? Math.random() * 4 - 2
    : 0;

  return (
    <GradientBackground>
      <GlowOrb x={960} y={540} size={800} color="#ef4444" delay={10} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${shake}px)`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 500,
            color: colors.slate,
            fontFamily: "system-ui, sans-serif",
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Reduce the
        </div>

        <div
          style={{
            position: "relative",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {/* Glitch effect layers */}
          {frame > 30 && frame < 50 && (
            <>
              <div
                style={{
                  position: "absolute",
                  fontSize: 160,
                  fontWeight: 900,
                  color: "#ef4444",
                  fontFamily: "system-ui, sans-serif",
                  opacity: 0.5,
                  transform: `translate(${glitchOffset}px, ${-glitchOffset}px)`,
                }}
              >
                UNEXPECTED
              </div>
              <div
                style={{
                  position: "absolute",
                  fontSize: 160,
                  fontWeight: 900,
                  color: colors.cyan,
                  fontFamily: "system-ui, sans-serif",
                  opacity: 0.5,
                  transform: `translate(${-glitchOffset}px, ${glitchOffset}px)`,
                }}
              >
                UNEXPECTED
              </div>
            </>
          )}

          <div
            style={{
              fontSize: 160,
              fontWeight: 900,
              color: colors.white,
              fontFamily: "system-ui, sans-serif",
              transform: `scale(${Math.max(0, unexpectedScale)})`,
              textShadow: `0 0 100px ${colors.cyan}60`,
            }}
          >
            UNEXPECTED
          </div>
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 500,
            color: colors.slate,
            fontFamily: "system-ui, sans-serif",
            opacity: interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          in Endodontics
        </div>
      </AbsoluteFill>
    </GradientBackground>
  );
};

// Scene 3: Avatar Tip Technology
const TechnologyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imageScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const imageX = interpolate(frame, [20, 180], [0, 30], {
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <GradientBackground>
      <GlowOrb x={200} y={200} size={400} color={colors.cyan} />
      <GlowOrb x={1400} y={700} size={300} color={colors.cyanDark} delay={15} />

      {/* Technology image - positioned to avoid overlap */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: "50%",
          transform: `translateY(-50%) scale(${Math.max(0, imageScale)}) translateX(${imageX}px)`,
        }}
      >
        <Img
          src={avatarTip}
          style={{
            height: 550,
            borderRadius: 24,
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          }}
        />
      </div>

      {/* Text content */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: 650,
        }}
      >

        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: colors.white,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.1,
            opacity: interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Avatar™ Tip
        </div>

        <div
          style={{
            fontSize: 32,
            color: colors.slate,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 400,
            marginTop: 30,
            lineHeight: 1.5,
            opacity: interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Precision-engineered apical geometry for centered progression.
          Minimizes ledging, transportation, and perforation risk.
        </div>

        {/* Feature badges */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 40,
            opacity: interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {["Centered", "Controlled", "Predictable"].map((text, i) => (
            <div
              key={text}
              style={{
                padding: "12px 28px",
                background: `${colors.cyan}20`,
                border: `2px solid ${colors.cyan}40`,
                borderRadius: 50,
                fontSize: 20,
                color: colors.cyan,
                fontFamily: "system-ui, sans-serif",
                fontWeight: 600,
                transform: `translateY(${interpolate(
                  frame,
                  [70 + i * 10, 100 + i * 10],
                  [20, 0],
                  { extrapolateRight: "clamp" }
                )}px)`,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
};

// Scene 4: Product Showcase
const ProductsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const products = [
    { img: etProduct, name: "ET TransformX", delay: 0, color: colors.cyan },
    { img: ptProduct, name: "PT TransformX", delay: 60, color: colors.cyanDark },
    { img: irootProduct, name: "iRoot Sealer", delay: 144, color: colors.amber },
  ];

  return (
    <GradientBackground>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: colors.white,
            fontFamily: "system-ui, sans-serif",
            marginBottom: 60,
            opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Choose Your System
        </div>

        <div style={{ display: "flex", gap: 50, alignItems: "flex-end" }}>
          {products.map((product, i) => {
            const scale = spring({
              frame: frame - 40 - product.delay,
              fps,
              config: { damping: 15, stiffness: 40 },
            });

            const hover = interpolate(
              Math.sin((frame + product.delay) / 15),
              [-1, 1],
              [-5, 5]
            );

            return (
              <div
                key={product.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: `scale(${Math.max(0, scale)}) translateY(${hover}px)`,
                }}
              >
                <div
                  style={{
                    width: 350,
                    height: 350,
                    background: `linear-gradient(180deg, ${product.color}10 0%, ${product.color}05 100%)`,
                    borderRadius: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${product.color}30`,
                    boxShadow: `0 30px 60px ${product.color}20`,
                    marginBottom: 30,
                  }}
                >
                  <Img
                    src={product.img}
                    style={{
                      maxHeight: 280,
                      maxWidth: 280,
                      objectFit: "contain",
                      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
                    }}
                  />
                </div>

                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: colors.white,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {product.name}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </GradientBackground>
  );
};

// Scene 5: Benefits with kinetic typography
const BenefitsScene: React.FC<{ timing?: typeof timing }> = ({ timing: t }) => {
  const frame = useCurrentFrame();

  // Get benefit timing from config or use defaults
  const benefitsScene = t?.scenes.find(s => s.id === "benefits");
  const benefitNarrations = t?.narrations.filter(n => n.id.startsWith("benefits-")) || [];

  const benefits = [
    { text: "Get to length", highlight: "predictably", delay: benefitNarrations[0] ? benefitNarrations[0].startFrame - (benefitsScene?.startFrame || 0) : 0, highlightDelay: 24 },
    { text: "Same technique,", highlight: "better results", delay: benefitNarrations[1] ? benefitNarrations[1].startFrame - (benefitsScene?.startFrame || 0) : 48, highlightDelay: 24 },
    { text: "Reduced", highlight: "separation risk", delay: benefitNarrations[2] ? benefitNarrations[2].startFrame - (benefitsScene?.startFrame || 0) : 96, highlightDelay: 8 },
  ];

  return (
    <GradientBackground>
      <GlowOrb x={100} y={300} size={500} color={colors.cyan} />
      <GlowOrb x={1500} y={500} size={400} color={colors.cyanDark} delay={20} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
        }}
      >
        {benefits.map((benefit, i) => {
          const slideIn = interpolate(
            frame,
            [benefit.delay, benefit.delay + 36],
            [-100, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) }
          );

          const opacity = interpolate(
            frame,
            [benefit.delay, benefit.delay + 24],
            [0, 1],
            { extrapolateRight: "clamp" }
          );

          const highlightScale = spring({
            frame: frame - benefit.delay - benefit.highlightDelay,
            fps: 30,
            config: { damping: 12, stiffness: 80 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity,
                transform: `translateX(${slideIn}px)`,
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  color: colors.slate,
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                {benefit.text}
              </span>
              <span
                style={{
                  fontSize: 64,
                  color: colors.cyan,
                  fontFamily: "system-ui, sans-serif",
                  fontWeight: 800,
                  transform: `scale(${Math.max(0, highlightScale)})`,
                  textShadow: `0 0 40px ${colors.cyan}50`,
                }}
              >
                {benefit.highlight}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </GradientBackground>
  );
};

// Scene 6: CTA
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const pulse = interpolate(
    Math.sin(frame / 8),
    [-1, 1],
    [1, 1.05]
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.cyan} 0%, ${colors.cyanDark} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated circles in background */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 200 + i * 150,
            height: 200 + i * 150,
            borderRadius: "50%",
            border: `2px solid ${colors.white}${10 + i * 5}`,
            transform: `scale(${interpolate(
              frame,
              [0, 90],
              [0.8 + i * 0.1, 1.2 + i * 0.1]
            )})`,
          }}
        />
      ))}

      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: colors.darkBg,
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          transform: `scale(${scale})`,
          zIndex: 1,
        }}
      >
        Ready to elevate
        <br />
        your endo?
      </div>

      <div
        style={{
          marginTop: 50,
          padding: "28px 70px",
          background: colors.darkBg,
          color: colors.white,
          fontSize: 36,
          fontWeight: 700,
          borderRadius: 60,
          fontFamily: "system-ui, sans-serif",
          transform: `scale(${pulse})`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      >
        Contact Us Today
      </div>

      <div
        style={{
          marginTop: 30,
          fontSize: 28,
          color: colors.darkBg,
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
          zIndex: 1,
        }}
      >
        info@endotechsg.com
      </div>
    </AbsoluteFill>
  );
};

// Music component with fade-in
const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in over first 2 seconds (60 frames), max 25% volume
  const volume = interpolate(frame, [0, 60], [0, 0.25], {
    extrapolateRight: "clamp",
  });

  return (
    <Audio
      src={musicTrack}
      startFrom={timing.musicStartFrom}
      volume={volume}
    />
  );
};

// Main composition - uses timing.json for all timing
export const EndoTechDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.darkBg }}>
      {/* Background music */}
      <BackgroundMusic />

      {/* Narration sequences - from timing.json */}
      {timing.narrations.map((n) => (
        <Sequence key={n.id} from={n.startFrame}>
          <Audio src={staticFile(`assets/${n.file}`)} volume={1} />
        </Sequence>
      ))}

      {/* Scene sequences - from timing.json */}
      {timing.scenes.map((scene) => {
        const SceneComponent = sceneComponents[scene.name];
        return (
          <Sequence key={scene.id} from={scene.startFrame} durationInFrames={scene.durationFrames}>
            <SceneComponent timing={timing} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
