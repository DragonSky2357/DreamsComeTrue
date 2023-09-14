import React from "react";
import styled from "styled-components";
import TitleBar from "../components/TitleBar/TitleBar";
import { Avatar } from "@mui/material";

const Main = styled.div``;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const LeftContainer = styled.div`
  width: 50%;
  height: 800px;
  background-color: #bbccdd;
`;

const ProfileContainer = styled.div`
  display: flex;
`;
const ProfileLeftContainer = styled.div`
  width: 30%;
  height: 200px;
  background-color: #222222;
`;

const ProfileRightContainer = styled.div`
  width: 70%;
  height: 200px;
  background-color: #444444;
`;

const StaticsContainer = styled.div`
  margin-top: 50px;
  height: 200px;
  background-color: #444444;
`;
const AchievementContainer = styled.div`
  margin-top: 50px;
  height: 200px;
  background-color: #444444;
`;

const RightContainer = styled.div`
  width: 50%;
  height: 800px;
  background-color: #aa00bb;
`;

const ProfilePage = () => {
  return (
    <Main>
      <TitleBar />
      <Container>
        <LeftContainer>
          <ProfileContainer>
            <ProfileLeftContainer></ProfileLeftContainer>
            <ProfileRightContainer></ProfileRightContainer>
          </ProfileContainer>
          <StaticsContainer>2</StaticsContainer>
          <AchievementContainer>3</AchievementContainer>
        </LeftContainer>
        <RightContainer></RightContainer>
      </Container>
    </Main>
  );
};

export default ProfilePage;
