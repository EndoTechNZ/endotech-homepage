import { Composition } from "remotion";
import { EndoTechDemo } from "./EndoTechDemo";
import timing from "./timing.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="EndoTechDemo"
        component={EndoTechDemo}
        durationInFrames={timing.totalFrames}
        fps={timing.fps}
        width={1920}
        height={1080}
      />
    </>
  );
};
