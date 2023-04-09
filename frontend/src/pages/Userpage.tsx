import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Mainboard from "../components/Mainbord";

const Main = styled.div``;
const UserWrapper = styled.div`
  height: 300px;
`;
const PostWrapper = styled.div``;
const UserImage = styled.div``;
const UserName = styled.div``;
const UserCreateDate = styled.div``;

const Userpage = () => {
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
          <UserImage></UserImage>
          <UserName>{user.username}</UserName>
          <UserCreateDate>
            생성일{user?.createdAt?.split("T")[0]}
          </UserCreateDate>
        </UserWrapper>
        <PostWrapper>
          <Mainboard posts={user.post} />
        </PostWrapper>
      </Main>
    </div>
  );
};

export default Userpage;
