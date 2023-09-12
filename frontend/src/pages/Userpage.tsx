import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PrimarySearchAppBar from "../components/TitleBar/TitleBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Mainboard from "../components/Mainbord";
import { Button, ListItemText, Modal } from "@mui/material";
import { useCookies } from "react-cookie";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import {
  Box,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemButton,
  ListSubheader,
  ModalDialog,
  ModalDialogProps,
  Stack,
  Switch,
} from "@mui/joy";

const Main = styled.div``;
const UserWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
  padding: 20px;
  margin-left: 40%;
  padding-top: 100px;
`;
const PostWrapper = styled.div`
  padding-top: 30px;
`;
const UserImageWrapper = styled.div`
  width: 200px;
  height: 200px;
`;
const UserNameWrapper = styled.div`
  display: flex;
`;

const UserInfoWrapper = styled.div``;
const UserSayWrapper = styled.div``;

const UserCreateDateWrapper = styled.div``;

const UserCountInfoWrapper = styled.div`
  display: flex;
`;
const UserPostCountWrapper = styled.div``;
const UserFollowerWrapper = styled.div`
  padding-left: 10px;
`;
const UserFollowingWrapper = styled.div`
  padding-left: 10px;
`;

const UserImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const UserPage = () => {
  const navigation = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>([]);
  const [openFollower, setOpenFollower] = useState<boolean>(false);
  const [openFollowing, setOpenFollowing] = useState<boolean>(false);

  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const { username } = navigation;

  const [layout, setLayout] = React.useState<
    ModalDialogProps["layout"] | undefined
  >(undefined);
  const [scroll, setScroll] = React.useState<boolean>(true);

  console.log(username);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/u/${user.username}`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((res) => {
        setUser(res.data);
      });
  }, []);

  const onClickFollow = async () => {
    const accessToken = cookies.access_token;

    await axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/user/u/${username}/follow`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((response) => {
        console.log(response);
      });
  };

  const onEditProfileHandler = async () => {
    navigate(`/edit/${user.username}`);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/u/${username}`)
      .then((response) => {
        console.log(response);
        setUser(response.data);
      });
  }, [username]);
  return (
    <div>
      <PrimarySearchAppBar />
      <Main>
        <UserWrapper>
          <UserImageWrapper>
            <UserImage src={user.avatar} />
          </UserImageWrapper>
          <UserInfoWrapper>
            <UserNameWrapper>
              <h1>{user.username}</h1>
              <Button onClick={onClickFollow}>팔로우</Button>
              <Button onClick={onEditProfileHandler}>수정</Button>
            </UserNameWrapper>
          </UserInfoWrapper>
          <UserSayWrapper>
            <h3>{"Dreams Come True 제작자"}</h3>
          </UserSayWrapper>
          <UserCreateDateWrapper>
            <h3>생성일 : {user?.createdAt?.split("T")[0]}</h3>
          </UserCreateDateWrapper>
          <UserCountInfoWrapper>
            <UserPostCountWrapper>
              <h3>포스터 : {user?.post?.length}</h3>
            </UserPostCountWrapper>
            <UserFollowerWrapper onClick={() => setOpenFollower(true)}>
              <h3>팔로워 : {user?.followers?.length}</h3>
            </UserFollowerWrapper>
            <UserFollowingWrapper onClick={() => setOpenFollowing(true)}>
              <h3>팔로잉 : {user?.following?.length}</h3>
            </UserFollowingWrapper>
          </UserCountInfoWrapper>
        </UserWrapper>
        <PostWrapper>
          <Mainboard posts={user.post} />
        </PostWrapper>
        {/* {openFollower && (
          <div
            style={{
              position: "relative",
              backgroundColor: "gray",
              width: "400px",
              height: "500px",
              top: "-1000px",
              right: "-40%",
            }}
          >
            123
          </div>
        )} */}

        {/* 팔로워 모달*/}
        <React.Fragment>
          <Modal
            open={openFollower}
            onClose={() => {
              setOpenFollower(false);
            }}
          >
            <ModalDialog
              aria-labelledby="dialog-vertical-scroll-title"
              layout={layout}
            >
              <ModalClose />
              <Typography id="dialog-vertical-scroll-title" component="h2">
                팔로워
              </Typography>

              <List
                sx={{
                  overflow: "hidden",
                  mx: "calc(-1 * var(--ModalDialog-padding))",
                  px: "var(--ModalDialog-padding)",
                }}
              >
                {user?.followers?.map((item: any, index: any) => (
                  <Link
                    to={`/${item.username}`}
                    onClick={() => {
                      setOpenFollower(false);
                    }}
                  >
                    <ListItem key={index}>{item.username}</ListItem>
                  </Link>
                ))}
              </List>
            </ModalDialog>
          </Modal>
        </React.Fragment>

        {/* 팔로잉 모달*/}
        <React.Fragment>
          <Modal
            open={openFollowing}
            onClose={() => {
              setOpenFollowing(false);
            }}
          >
            <ModalDialog
              aria-labelledby="dialog-vertical-scroll-title"
              layout={layout}
            >
              <ModalClose />
              <Typography id="dialog-vertical-scroll-title" component="h2">
                팔로잉
              </Typography>

              <Box>
                <List
                  sx={{
                    overflow: "hidden",
                    mx: "calc(-1 * var(--ModalDialog-padding))",
                    px: "var(--ModalDialog-padding)",
                  }}
                >
                  {user?.following?.map((item: any, index: any) => {
                    <Link to={`/${item?.username}`}>
                      <ListItem key={index}>{item?.username}</ListItem>
                    </Link>;
                  })}
                </List>
              </Box>
            </ModalDialog>
          </Modal>
        </React.Fragment>
      </Main>
    </div>
  );
};

export default UserPage;
