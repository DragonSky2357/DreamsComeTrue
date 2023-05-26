import React from "react";
import TitleBar from "../components/TitleBar";
import styled from "styled-components";
import { Button, Link } from "@mui/material";
import ImageSlider from "../components/ImageSlider";
import PhotoAlmum from "react-photo-album";
import Velocity from "../components/TextMove/TextMove";
import Typewriter from "typewriter-effect";

const photos = [
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/b10ac727-5270-4b5a-8345-0e583acc227c.png`,
    width: 400,
    height: 400,
  },
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/c3e9158a-d15d-4816-ae2d-7cb37f9e73c5.png`,
    width: 600,
    height: 600,
  },
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/c5cfe2a2-b0ad-4e76-b176-dd2a61ed9563.png`,
    width: 800,
    height: 800,
  },
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/caf5e92f-52bc-4a52-a24d-75ee6e1f421e.png`,
    width: 600,
    height: 600,
  },
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/d038599a-51a9-4c38-a779-6557d55860ca.png`,
    width: 400,
    height: 400,
  },
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/d24f20bd-3de9-46bb-af96-3bc1cf9b8109.png`,
    width: 600,
    height: 600,
  },
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/d39dc863-acc1-4203-a1fb-f71234001698.png`,
    width: 800,
    height: 800,
  },
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/eff0901e-e4c5-4813-be7e-241f666e589e.png`,
    width: 600,
    height: 600,
  },
  {
    src: `https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/f0b5f8aa-675a-4827-bf2b-a7b2e21b9e91.png`,
    width: 400,
    height: 400,
  },
];

const Container = styled.div``;
const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyContentLeft = styled.div`
  display: flex;
  padding: 100px;
  aligin-items: center;
  justify-content: center;
`;

const BodyContentRight = styled.div`
  display: flex;
  padding: 100px;
  aligin-items: center;
  justify-content: center;
`;

const PhotoAlmumWrapper = styled.div`
  padding: 100px;
`;

const ImageWrapper = styled.div`
  width: 50%;
`;
const TextWrapper = styled.div`
  line-height: 100px;
`;

const Image = styled.img`
  width: 500px;
  height: 700px;
`;

const HomePage = () => {
  return (
    <Container>
      <TitleBar />
      <ImageSlider />
      <Velocity direction={"left"} />
      <Velocity direction={"right"} />
      <BodyWrapper>
        <BodyContentLeft>
          <ImageWrapper>
            <Image src={`${process.env.PUBLIC_URL}/images/MainPage1.png`} />
          </ImageWrapper>
          <TextWrapper>
            <h2>
              꿈은 우리에게 무한한 가능성과 상상력의 세계를 제공합니다. <br />이
              곳에서는 그 꿈을 현실로 만들기 위한 도구를 제공합니다.
              <br /> 우리는 꿈을 재해석하여 아름다운 이미지를 만들어내고, <br />
              당신의 상상력을 살아있게 만들어줄 것입니다. <br />
              여기에서 당신은 누구나 자유롭게 창조의 영역으로 빠져들 수
              있습니다.
            </h2>
          </TextWrapper>
        </BodyContentLeft>

        <BodyContentRight>
          <TextWrapper>
            <h2>
              당신의 창의력을 발휘하여 다양한 이미지를 만들어보세요. <br />
              꿈의 조각들을 모아 창의적인 작품으로 완성시켜보세요.
              <br /> 복잡한 그림, 신비로운 풍경, 상상할 수 없는 생물들,
              <br /> 모든 것이 가능합니다. <br />
              이곳에서는 당신이 상상하는 대로의 세계를
              <br /> 현실로 만들어줄 것입니다.
            </h2>
          </TextWrapper>
          <ImageWrapper>
            <Image
              src={`${process.env.PUBLIC_URL}/images/MainPage2.gif`}
              style={{ paddingLeft: "300px" }}
            />
          </ImageWrapper>
        </BodyContentRight>
        <BodyContentLeft>
          <ImageWrapper>
            <Image src={`${process.env.PUBLIC_URL}/images/MainPage3.png`} />
          </ImageWrapper>
          <TextWrapper style={{ paddingLeft: "200px" }}>
            <h2>
              단순히 이미지를 만드는 공간이 아닙니다. <br /> 여기에서는 작품을
              소개하고, 다른 이들과 공유할 수 있는 기회를 제공합니다. <br />{" "}
              당신의 창작물을 자랑스럽게 전시해보세요. 또한, 다른 창작자들의
              작품을 감상하고,
              <br /> 서로의 창조적인 아이디어를 공유할 수 있습니다. 이곳에서는
              꿈을 현실로 만드는 과정에서 탄생하는 다양한 이야기들이 교차하고,
              새로운 꿈들이 탄생합니다.
            </h2>
          </TextWrapper>
        </BodyContentLeft>
        <div
          style={{
            display: "flex",
            fontSize: "80px",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h4>당신의 꿈을 </h4>
          <Typewriter
            options={{
              strings: [
                "응원합니다.",
                "들려주세요.",
                "지지합니다.",
                "펼쳐보세요.",
                "그려보세요.",
              ],
              loop: true,
              autoStart: true,
            }}
          />
        </div>
        <PhotoAlmumWrapper>
          <PhotoAlmum layout="rows" photos={photos} />
        </PhotoAlmumWrapper>
        <BodyContentRight>
          <TextWrapper>
            <h2>
              이곳에서 당신의 꿈이 현실로 이뤄질 수 있도록 지금 바로 창조의 문을
              열어보세요. 오늘밤 당신의 꿈은 무엇인가요?
            </h2>
          </TextWrapper>
        </BodyContentRight>
      </BodyWrapper>
    </Container>
  );
};

export default HomePage;
