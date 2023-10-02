import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../components/TitleBar/TitleBar";
import CheckIcon from "@mui/icons-material/Check";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { LinearProgress } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import CountUp from "react-countup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

interface User {
  username: string;
  avatar: string;
  post: Post[];
  created_at: string;
  updated_at: string;
}

interface Post {
  id: string;
  title: string;
  describe: string;
  image: string;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cookie] = useCookies(["access_token"]);
  const accessToken = cookie.access_token;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res: any) => {
          setUser(res.data);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Main>
      <TitleBar />
      <Container>
        <LeftContainer>
          <ProfileContainer>
            <ProfileLeftContainer>
              <Avatar
                alt={user?.username}
                src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/avatar/${user?.avatar}`}
                sx={{ width: 150, height: 150 }}
              />
            </ProfileLeftContainer>
            <ProfileRightContainer>
              <ProfileRightTopContainer>
                <Typography style={{ fontSize: "40px" }}>
                  {user?.username} Profile
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AccountBoxIcon />}
                  onClick={() => {
                    navigate("/editProfile");
                  }}
                >
                  프로필 수정
                </Button>
              </ProfileRightTopContainer>
              <ProfileRightBottomContainer>
                <CommittedDreamerContainer>
                  <CommittedDreamerWrapper>
                    <Typography style={{ fontSize: "26px" }}>
                      <CountUp end={user?.post?.length as number} />
                    </Typography>
                    <Typography>My Dream</Typography>
                  </CommittedDreamerWrapper>
                  <CommittedDreamerWrapper>
                    <Typography style={{ fontSize: "26px" }}>
                      <CountUp end={2} />
                    </Typography>
                    <Typography>Followers</Typography>
                  </CommittedDreamerWrapper>
                  <CommittedDreamerWrapper>
                    <Typography style={{ fontSize: "26px" }}>
                      <CountUp end={32} />
                    </Typography>
                    <Typography>Following</Typography>
                  </CommittedDreamerWrapper>
                </CommittedDreamerContainer>
              </ProfileRightBottomContainer>
            </ProfileRightContainer>
          </ProfileContainer>
          <StaticsContainer>
            <Typography style={{ fontSize: "40px" }}>
              Dream Statistics
            </Typography>
            <StaticInfoContainer>
              <StaticsWrapper>
                <StaticsWrapperInnerTop>
                  <CheckIcon
                    style={{
                      marginTop: "10px",
                      fontSize: "70px",
                    }}
                  />
                </StaticsWrapperInnerTop>
                <StaticsWrapperInnerBottom>
                  <Typography style={{ fontSize: "26px" }}>
                    Finished Dreams
                  </Typography>

                  <Typography style={{ fontSize: "32px" }}>
                    <CountUp end={3} />
                  </Typography>
                </StaticsWrapperInnerBottom>
              </StaticsWrapper>
              <StaticsWrapper>
                <StaticsWrapperInnerTop>
                  <HourglassBottomIcon
                    style={{ marginTop: "10px", fontSize: "70px" }}
                  />
                </StaticsWrapperInnerTop>
                <StaticsWrapperInnerBottom>
                  <Typography style={{ fontSize: "26px" }}>
                    Hours Dreamed
                  </Typography>
                  <Typography style={{ fontSize: "32px" }}>
                    <CountUp end={56} /> Dreams
                  </Typography>
                </StaticsWrapperInnerBottom>
              </StaticsWrapper>
              <StaticsWrapper>
                <StaticsWrapperInnerTop>
                  <EmojiEventsIcon
                    style={{ marginTop: "10px", fontSize: "70px" }}
                  />
                </StaticsWrapperInnerTop>
                <StaticsWrapperInnerBottom>
                  <Typography style={{ fontSize: "26px" }}>
                    Achieved Skills
                  </Typography>
                  <Typography style={{ fontSize: "32px" }}>
                    <CountUp end={7} />
                  </Typography>
                </StaticsWrapperInnerBottom>
              </StaticsWrapper>
            </StaticInfoContainer>
          </StaticsContainer>

          <AchievementContainer>
            <Typography style={{ fontSize: "40px" }}>
              Dream Statistics
            </Typography>
            <AchievementInfoContainer>
              <AchievementInfoContainerInnerLeft>
                <CheckIcon
                  style={{
                    marginTop: "20px",
                    fontSize: "70px",
                  }}
                />
              </AchievementInfoContainerInnerLeft>
              <AchievementInfoContainerInnerRight>
                <Typography
                  style={{
                    fontSize: "26px",
                    textAlign: "left",
                  }}
                >
                  2/3 Dreams
                </Typography>
                <Box sx={{ marginTop: "15px", width: "90%", color: "#FFF" }}>
                  <LinearProgress
                    color="inherit"
                    variant="determinate"
                    value={60}
                  />
                </Box>
              </AchievementInfoContainerInnerRight>
            </AchievementInfoContainer>
            <AchievementInfoContainer>
              <AchievementInfoContainerInnerLeft>
                <CheckIcon
                  style={{
                    marginTop: "20px",
                    fontSize: "70px",
                  }}
                />
              </AchievementInfoContainerInnerLeft>
              <AchievementInfoContainerInnerRight>
                <Typography
                  style={{
                    fontSize: "26px",
                    textAlign: "left",
                  }}
                >
                  2/3 Dreams
                </Typography>
                <Box sx={{ marginTop: "15px", width: "90%", color: "#FFF" }}>
                  <LinearProgress
                    color="inherit"
                    variant="determinate"
                    value={60}
                  />
                </Box>
              </AchievementInfoContainerInnerRight>
            </AchievementInfoContainer>
          </AchievementContainer>
        </LeftContainer>
        <RightContainer>
          {user && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflowX: "hidden",
              }}
            >
              <Masonry columns={4} spacing={2}>
                {user!.post.map((item, index) => (
                  <img
                    src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${item.image}`}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                      display: "block",
                      width: "30%",
                    }}
                    onClick={() => {
                      navigate(`/dream/${item.id}`);
                    }}
                  />
                ))}
              </Masonry>
            </Box>
          )}
        </RightContainer>
      </Container>
    </Main>
  );
};

export default ProfilePage;

const Main = styled.div``;

const Container = styled.div`
  display: flex;
  flex-grow: 1
  height: 100%;
  padding: 30px;
`;

const LeftContainer = styled.div`
  width: 50%;
`;

const ProfileContainer = styled.div`
  display: flex;
`;
const ProfileLeftContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 200px;
`;

const ProfileRightContainer = styled.div`
  flex-grow: 1;
  height: 200px;
  padding-left: 50px;
`;

const ProfileRightTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
`;

const ProfileRightBottomContainer = styled.div`
  width: 80%;
  height: 50%;

  border-radius: 16px;
`;

const CommittedDreamerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  margin: 10px;
  background-color: #000000;
  border-radius: 16px;
`;

const CommittedDreamerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StaticsContainer = styled.div`
  margin-top: 50px;
  height: 300px;
`;

const StaticInfoContainer = styled.div`
  display: flex;
  padding-top: 10px;
  width: 95%;
  height: 80%;
`;

const StaticsWrapper = styled.div`
  margin: 10px 0px 0px 30px;
  width: 30%;
  background-color: #444444;
  border-radius: 32px;
  overflow: hidden;
  &:first-child {
    margin-left: 0px;
  }
`;

const StaticsWrapperInnerTop = styled.div`
  margin: 16px 5%;
  width: 90%;
  height: 40%;
  background-color: #000000;
  border-radius: 32px;
  text-align: center;
`;

const StaticsWrapperInnerBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AchievementContainer = styled.div`
  margin-top: 50px;
  height: 400px;
`;

const AchievementInfoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  width: 90%;
  height: 40%;
  background-color: #444444;
  border-radius: 32px;
  overflow: hidden;
`;

const AchievementInfoContainerInnerLeft = styled.div`
  margin: 16px 20px;
  width: 15%;
  height: 80%;
  background-color: #000000;
  border-radius: 32px;
  text-align: center;
`;

const AchievementInfoContainerInnerRight = styled.div`
  width: 80%;
  height: 100px;
`;

const RightContainer = styled.div`
  width: 50%;
  height: 1000px;
`;
