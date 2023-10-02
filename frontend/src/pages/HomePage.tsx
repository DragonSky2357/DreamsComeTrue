import React, { useEffect, useState } from "react";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import { Box, Button, Link } from "@mui/material";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import PhotoAlmum from "react-photo-album";
import Velocity from "../components/TextMove/TextMove";
import Typewriter from "typewriter-effect";
import Masonry from "../components/masonry/Masonry";
import axios from "axios";

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
  margin: 30px;
`;

const BodyContentRight = styled.div`
  display: flex;
  padding: 100px;
  aligin-items: center;
  justify-content: center;
`;

const PhotoAlmumWrapper = styled.div`
  padding: 100px;
  padding-top: 200px;
`;

const TextWrapper = styled.div`
  line-height: 100px;
`;

const HomePage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/random-image?count=15`)
      .then((res) => {
        console.log(res.data["image"]);
        const image = res.data["image"];
        setImages(image);
      });
  }, []);
  return (
    <Container>
      <TitleBar />
      <ImageSlider />

      <Velocity direction={"left"} />
      <Velocity direction={"right"} />

      <div style={{ marginRight: "30px", overflowX: "unset" }}>
        <Masonry />
      </div>
      <BodyWrapper>
        <Box
          style={{
            display: "flex",
            paddingTop: "150px",
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
        </Box>

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
