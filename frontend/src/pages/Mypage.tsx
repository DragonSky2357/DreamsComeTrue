import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Mainboard from "../components/Mainbord";

const Main = styled.div``;
const UserWrapper = styled.div``;
const PostWrapper = styled.div``;

const Mypage = () => {
  const navigation = useParams();
  const [posts, setPosts] = useState();
  const { username } = navigation;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/u/${username}`)
      .then((response) => {
        console.log(response);
        setPosts(response.data.post);
      });
  }, []);
  return (
    <div>
      <PrimarySearchAppBar />
      <Main>
        <UserWrapper></UserWrapper>
        <PostWrapper>
          <Mainboard posts={posts} />
        </PostWrapper>
      </Main>
    </div>
  );
};

export default Mypage;
