import { Composition } from "remotion";
import { PromoTemplate } from "./PromoTemplate";
import { getTotalFrames, promoVideos } from "./promoData";

export const RemotionRoot = () => {
  return (
    <>
      {promoVideos.map((video) => (
        <Composition
          key={video.id}
          id={`EndoTechPromo-${video.id}`}
          component={PromoTemplate}
          defaultProps={{ video }}
          durationInFrames={getTotalFrames(video)}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
    </>
  );
};
