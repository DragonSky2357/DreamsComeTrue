import React from "react";
import styled from "styled-components";
import TitleBar from "../components/TitleBar/TitleBar";
import CheckIcon from "@mui/icons-material/Check";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Avatar, Box, Typography } from "@mui/material";
import { LinearProgress } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import Paper from "@mui/material/Paper";
import { styled as MuiStyle } from "@mui/material/styles";
import CountUp from "react-countup";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
    title: "Snacks",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
  {
    img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383",
    title: "Tower",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1627328715728-7bcc1b5db87d",
    title: "Tree",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1627000086207-76eabf23aa2e",
    title: "Camping Car",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1627328561499-a3584d4ee4f7",
    title: "Mountain",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
];

const Item = MuiStyle(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ProfilePage = () => {
  return (
    <Main>
      <TitleBar />
      <Container>
        <LeftContainer>
          <ProfileContainer>
            <ProfileLeftContainer>
              <Avatar
                alt="Remy Sharp"
                src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
                sx={{ width: 150, height: 150 }}
              />
            </ProfileLeftContainer>
            <ProfileRightContainer>
              <ProfileRightTopContainer>
                <Typography style={{ fontSize: "30px" }}>
                  My Dream Profile
                </Typography>
                <Typography>New Your City</Typography>
              </ProfileRightTopContainer>
              <ProfileRightBottomContainer>
                <CommittedDreamerContainer>
                  <CommittedDreamerWrapper>
                    <Typography style={{ fontSize: "26px" }}>
                      <CountUp end={0} />
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
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowX: "hidden",
            }}
          >
            <Masonry columns={4} spacing={2} style={{}}>
              {itemData.map((item, index) => (
                <img
                  src={`${item.img}?w=162&auto=format`}
                  srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    borderBottomLeftRadius: 4,
                    borderBottomRightRadius: 4,
                    display: "block",
                    width: "30%",
                  }}
                />
              ))}
            </Masonry>
          </Box>
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
