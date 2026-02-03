import React from "react";
import { type EmblaOptionsType } from "embla-carousel";
import {
  PrevButton,
  NextButton,
  HomeButton,
  usePrevNextButtons,
} from "./emblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import { Image, type ImageType } from "../image";
import type { ActiveImage } from "../images";

type PropType = {
  slides: ImageType[];
  options?: EmblaOptionsType;
  setIsCarousel: (activeImage: ActiveImage | undefined) => void;
  keyPrefix?: string;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="embla ">
      <div className="embla__viewport " ref={emblaRef} tabIndex={0}>
        <div className="embla__container ">
          {slides.map((image, index) => (
            <>
              <div
                className="embla__slide"
                key={props.keyPrefix ? `${props.keyPrefix}-${index}` : index}
              >
                <Image index={index} data={image} id={`slide-${index}`} />
                <div className="caption">{image.alt}</div>
              </div>
            </>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <HomeButton />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
