import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../components/TitleBar/TitleBar";
import { Avatar, Box, Button, Typography } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CountUp from "react-countup";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { ErrorResponse } from "../constants/Response";

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
  const navigate = useNavigate();
  const { username } = useParams();
  const [cookie] = useCookies(["access_token"]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = cookie.access_token;

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/profile/${username}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res: AxiosResponse) => {
        const data = res.data;
        console.log(data);
        setUser(data);
      })
      .catch((e: AxiosError) => {
        const res = e.response;
        const data = res?.data as ErrorResponse;

        if (res?.status === HttpStatusCode.Unauthorized) {
          toast.error("로그인을 먼저 해주세요🙋‍♂️");
          navigate("/");
        }
      });
  }, []);

  return (
    <Main>
      <TitleBar />
      <Container>
        <TopContainer>
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
                  {user?.username}
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
        </TopContainer>
        <BottomContainer>
          {user && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Masonry columns={6} spacing={2}>
                {user!.post?.map((item, index) => (
                  <img
                    src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${item.image}`}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      display: "block",
                      width: "20%",
                    }}
                    onClick={() => {
                      navigate(`/dream/${item.id}`);
                    }}
                  />
                ))}
              </Masonry>
            </Box>
          )}
        </BottomContainer>
      </Container>
    </Main>
  );
};

export default ProfilePage;

const Main = styled.div``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1
  height: 100%;
  padding: 30px;
`;

const TopContainer = styled.div`
  width: 50%;
  margin: 0 auto;
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
  width: 70%;
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

const BottomContainer = styled.div`
  margin-top: 100px;
  width: 100%;
`;
