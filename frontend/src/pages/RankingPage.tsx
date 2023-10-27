import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../components/TitleBar/TitleBar";
import axios from "axios";
import { useCookies } from "react-cookie";

const RankingPage = () => {
  const [cookie] = useCookies(["access_token"]);

  const accessToken = cookie.access_token;

  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/post/ranking`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res: any) => {
          console.log(res.data);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Container>
      <TitleBar />
      <Main>
        <FirstContainer></FirstContainer>
        <SecondContainer></SecondContainer>
        <ThirdContainer></ThirdContainer>
        <FourthContainer></FourthContainer>
      </Main>
    </Container>
  );
};

const Container = styled.div``;
const Main = styled.div`
  padding: 20px;
  height: 100vh;
`;
const FirstContainer = styled.div`
  height: 25%;
  background-color: #ffeeaa;
`;
const SecondContainer = styled.div`
  height: 25%;
  background-color: #aaffaa;
`;
const ThirdContainer = styled.div`
  height: 25%;
  background-color: #00ffaa;
`;
const FourthContainer = styled.div`
  height: 25%;
  background-color: #ffaaaa;
`;

export default RankingPage;
