import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Mainboard from "../components/Mainbord";

const Main = styled.div``;
const UserWrapper = styled.div`
  height: 400px;
  padding: 20px;
  margin-left: 40%;
`;
const PostWrapper = styled.div``;
const UserImageWrapper = styled.div``;
const UserNameWrapper = styled.div``;
const UserCreateDateWrapper = styled.div``;

const UserImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const UserPage = () => {
  const navigation = useParams();
  const [user, setUser] = useState<any>([]);
  const { username } = navigation;

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
          <UserNameWrapper>
            <h1>{user.username}</h1>
          </UserNameWrapper>
          <UserCreateDateWrapper>
            <h1>생성일{user?.createdAt?.split("T")[0]}</h1>
          </UserCreateDateWrapper>
        </UserWrapper>
        <PostWrapper>
          <Mainboard posts={user.post} />
        </PostWrapper>
      </Main>
    </div>
  );
};

export default UserPage;
