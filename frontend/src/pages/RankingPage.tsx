import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../components/TitleBar/TitleBar";
import axios, { AxiosResponse } from "axios";
import { useCookies } from "react-cookie";

interface Writer {
  username: string;
}

interface Post {
  id: string;
  image: string;
  title: string;
  writer: Writer;
}

const RankingPage = () => {
  const [cookie] = useCookies(["access_token"]);
  const accessToken = cookie.access_token;

  const [post, setPost] = useState<Post[]>([]);

  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/post/ranking`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res: AxiosResponse) => {
          const data = res.data;
          setPost(data);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Container>
      <TitleBar />
      <Main>
        <LeftContainer>
          <FirstContainer>
            <img
              src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[0]?.image}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
              alt=""
            />
          </FirstContainer>
        </LeftContainer>
        <RightContainer>
          <RightTopContainer>
            <SecondContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[1]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </SecondContainer>
            <SecondContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[2]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </SecondContainer>
          </RightTopContainer>
          <RightMiddleContainer>
            <ThirdContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[3]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </ThirdContainer>
            <ThirdContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[4]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </ThirdContainer>
            <ThirdContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[5]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </ThirdContainer>
          </RightMiddleContainer>
          <RightBottomContainer>
            <FourthContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[6]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </FourthContainer>
            <FourthContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[7]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </FourthContainer>
            <FourthContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[8]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </FourthContainer>
            <FourthContainer>
              <img
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post[9]?.image}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
                alt=""
              />
            </FourthContainer>
          </RightBottomContainer>
        </RightContainer>
      </Main>
    </Container>
  );
};

const Container = styled.div``;
const Main = styled.div`
  display: flex;
  padding: 0px 20px 0px 20px;
  height: 100vh;
`;

const LeftContainer = styled.div`
  width: 50%;
  height: 85%;
  background-color: #ffffaa;
`;

const BottomLeftContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
`;

const RightContainer = styled.div`
  width: 50%;
  height: 85%;
`;

const RightTopContainer = styled.div`
  display: flex;
  height: 40%;
`;

const RightMiddleContainer = styled.div`
  display: flex;
  height: 30%;
`;

const RightBottomContainer = styled.div`
  display: flex;
  height: 30%;
`;

const FirstContainer = styled.div`
  height: 100%;
`;

const SecondContainer = styled.div`
  width: 50%;
  height: 100%;
  background-color: #ffccff;
`;

const ThirdContainer = styled.div`
  width: 100%;
  background-color: #ccffcc;
`;

const FourthContainer = styled.div`
  width: 100%;
  background-color: #ffeeaa;
`;

export default RankingPage;
