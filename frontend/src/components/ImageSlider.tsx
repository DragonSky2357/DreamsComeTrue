import React from "react";
import HeroSlider, { Overlay, Slide, MenuNav } from "hero-slider";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justifycontent: center;
  alignitems: center;
  flexflow: column;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  pointerevents: none;
`;
const Title = styled.h1`
  margin: auto;
  padding: 0;
  text-transform: uppercase;
  width: 90%;
  text-align: center;
  font-size: 3.5rem;
`;
const Subtitle = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  pointer-events: none;
`;

const images = [
  {
    url: "https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/011e2f31-9457-4129-9871-0842a0614fe3.png",
  },
  {
    url: "https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/0e8897bf-f7f4-4a8f-9abf-bfa07c169d57.png",
  },
  {
    url: "https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/62965807-ad91-4001-8f0f-18d744caceac.png",
  },
  {
    url: "https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/89cb93f6-389e-474f-828d-f9cebe9c6ac1.png",
  },
  {
    url: "https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/89dded3a-7e62-401a-bf5b-f46036628b0f.png",
  },
];

const ImageSlider = () => {
  return (
    <>
      <HeroSlider
        height={"80vh"}
        autoplay
        controller={{
          initialSlide: 1,
          slidingDuration: 500,
          slidingDelay: 100,

          onSliding: (nextSlide) =>
            console.debug("onSliding(nextSlide): ", nextSlide),
          onBeforeSliding: (previousSlide, nextSlide) =>
            console.debug(
              "onBeforeSliding(previousSlide, nextSlide): ",
              previousSlide,
              nextSlide
            ),
          onAfterSliding: (nextSlide) =>
            console.debug("onAfterSliding(nextSlide): ", nextSlide),
        }}
      >
        <Overlay>
          <Wrapper style={{}}>
            <Title>여러분의 꿈을 들려주세요</Title>
            <Title>어제 밤은 어땠나요?</Title>
          </Wrapper>
        </Overlay>

        <Slide
          background={{
            backgroundImageSrc: images[0].url,
            backgroundImageStyle: { objectFit: "none" },
          }}
        />

        <Slide
          background={{
            backgroundImageSrc: images[1].url,
            backgroundImageStyle: { objectFit: "none" },
          }}
        />

        <Slide
          background={{
            backgroundImageSrc: images[2].url,
            backgroundImageStyle: { objectFit: "none" },
          }}
        />

        <Slide
          background={{
            backgroundImageSrc: images[3].url,
            backgroundImageStyle: { objectFit: "none" },
          }}
        />

        <Slide
          background={{
            backgroundImageSrc: images[4].url,
            backgroundImageStyle: { objectFit: "none" },
          }}
        />
      </HeroSlider>
    </>
  );
};

export default ImageSlider;
