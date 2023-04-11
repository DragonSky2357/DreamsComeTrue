import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Mainboard from "../components/Mainbord";
import { Button } from "@mui/material";
import { useCookies } from "react-cookie";

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
  const [user, setUser] = useState<any>([]);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const { username } = navigation;

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
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/u/${username}`)
      .then((response) => {
        console.log(response);
        setUser(response.data);
      });
  }, []);
  return (
    <div>
      <PrimarySearchAppBar />
      <Main>
        <UserWrapper>
          <UserImageWrapper>
            <UserImage src="https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/e2da5bcb-2373-4bc3-9a64-3b2d1efb9810.png" />
          </UserImageWrapper>
          <UserInfoWrapper>
            <UserNameWrapper>
              <h1>{user.username}</h1>
              <Button onClick={onClickFollow}>팔로우</Button>
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
            <UserFollowerWrapper>
              <h3>팔로워 : {user?.followers?.length}</h3>
            </UserFollowerWrapper>
            <UserFollowingWrapper>
              <h3>팔로잉 : {user?.following?.length}</h3>
            </UserFollowingWrapper>
          </UserCountInfoWrapper>
        </UserWrapper>
        <PostWrapper>
          <Mainboard posts={user.post} />
        </PostWrapper>
      </Main>
    </div>
  );
};

export default UserPage;
