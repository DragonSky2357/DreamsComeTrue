import { useEffect, useState } from "react";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import { Box } from "@mui/material";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import PhotoAlmum from "react-photo-album";
import Velocity from "../components/TextMove/TextMove";
import Typewriter from "typewriter-effect";
import Masonry from "../components/masonry/Masonry";
import axios from "axios";
import photos from "../assets/photos";

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
