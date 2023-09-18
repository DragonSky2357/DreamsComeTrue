import { Avatar, Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import FavoriteIcon from "@mui/icons-material/Favorite";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ShareIcon from "@mui/icons-material/Share";

interface Post {
  id: string;
  title: string;
  describe: string;
  image: string;
  writer: User;
  created_at: string;
  updated_at: string;
}

interface User {
  avatar: string;
  username: string;
}
const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/post/${id}`).then((res) => {
      console.log(res.data);
      setPost(res.data);
    });
  }, []);
  return (
    <Main>
      <TitleBar />
      <Container>
        <LeftContainer>
          <PostImage>
            <img
              src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post?.image}`}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </PostImage>
        </LeftContainer>
        <RightContainer>
          <RightTopContainer>
            <PostInfoContainer>
              <TitleWrapper>
                <Typography
                  style={{
                    fontSize: "32px",
                    textAlign: "left",
                  }}
                >
                  {post?.title}
                </Typography>
              </TitleWrapper>

              <DescribeWrapper>
                <Typography
                  style={{
                    fontSize: "26px",
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {post?.describe}
                </Typography>
              </DescribeWrapper>
            </PostInfoContainer>
          </RightTopContainer>
          <RightBottomContainer>
            <IconListWrapper>
              <FavoriteIcon sx={{ fontSize: 60 }} />
              <QuestionAnswerIcon sx={{ fontSize: 60 }} />
              <ShareIcon sx={{ fontSize: 60 }} />
            </IconListWrapper>
            <UserWrapper>
              <Avatar
                src={
                  post?.writer?.avatar &&
                  `${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/avatar/${post?.writer.avatar}`
                }
                sx={{ width: "80px", height: "80px" }}
              />
              <Typography
                style={{
                  paddingLeft: "20px",
                  fontSize: "32px",
                  textAlign: "left",
                }}
              >
                {post?.writer.username}
              </Typography>
            </UserWrapper>
          </RightBottomContainer>
        </RightContainer>
      </Container>
    </Main>
  );
};

const Main = styled.div``;

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  height: 80vh;
  padding: 50px 100px 0px 100px;
`;

const LeftContainer = styled.div`
  width: 50%;
  height: 100%;
  background-color: #bbccdd;
`;

const PostImage = styled.div`
  height: 100%;
`;

const RightContainer = styled.div`
  width: 50%;
  height: 100%;
`;

const RightTopContainer = styled.div`
  height: 90%;
`;

const PostInfoContainer = styled.div`
  padding: 20px;
  white-space: pre-line;
`;

const TitleWrapper = styled.div``;
const DescribeWrapper = styled.div`
  margin-top: 50px;
`;

const RightBottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  height: 10%;
`;

const IconListWrapper = styled.div`
  display: flex;
  width: 30%;
  justify-content: space-between;
  padding-left: 50px;
`;
const UserWrapper = styled.div`
  display: flex;
  padding-right: 50px;
  align-items: center;
`;

export default PostPage;
