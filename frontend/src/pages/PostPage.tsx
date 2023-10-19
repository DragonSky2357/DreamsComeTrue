import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import axios, { HttpStatusCode } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import SellIcon from "@mui/icons-material/Sell";

interface User {
  avatar: string;
  username: string;
}

interface Comment {
  comment: string;
  create_at: string;
  writer: User;
}

interface Post {
  id: string;
  title: string;
  describe: string;
  tags: any[];
  image: string;
  writer: User;
  created_at: string;
  updated_at: string;
}

const PostPage = () => {
  const { id } = useParams();
  const [cookie] = useCookies(["access_token"]);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState<String>("");
  const [isCommetSubmit, setIsCommentSubmit] = useState<Boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const access_token = cookie.access_token;
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        console.log(res.data);
        setPost(res.data);
      });
  }, []);

  useEffect(() => {
    const access_token = cookie.access_token;
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${id}/comments`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setComments(res.data);
        setIsCommentSubmit(false);
      });
  }, [isCommetSubmit]);

  const onCommentSubmitHandler = async () => {
    try {
      const access_token = cookie.access_token;
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/post/${id}/comment`,
          { comment },
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then((res) => {
          if (res.status === HttpStatusCode.Created) {
          }
        });
    } catch (e: any) {
      console.log(e);
    } finally {
      setComment("");
      setIsCommentSubmit(true);
    }
  };
  return (
    <Main>
      <TitleBar />
      <Container>
        <TopContainer>
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
                      fontSize: "26px",
                      textAlign: "left",
                    }}
                  >
                    {post?.title}
                  </Typography>
                </TitleWrapper>

                <DescribeWrapper>
                  <Typography
                    style={{
                      fontSize: "18px",
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
                  {post?.writer?.username ?? "익명"}
                </Typography>
              </UserWrapper>
              <TagsWrapper>
                {post?.tags.map((tag, index) => (
                  <TagWrapper onClick={() => navigate(`../tags/${tag.name}`)}>
                    <Chip
                      icon={<SellIcon />}
                      label={tag.name}
                      style={{
                        color: "black",
                        background: "white",
                        fontSize: "20px",
                      }}
                    />
                  </TagWrapper>
                ))}
              </TagsWrapper>
            </RightBottomContainer>
          </RightContainer>
        </TopContainer>
        <BottomContainer>
          <WriteCommentContainer>
            <Typography style={{ fontSize: "26px" }}>댓글</Typography>
            <WriteCommentWrapper>
              <TextField
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                fullWidth
                multiline
                autoComplete="off"
                variant="outlined"
                placeholder="댓글을 입력하세요"
                style={{
                  border: "1px solid lightgrey",
                  borderRadius: "5px",
                }}
                inputProps={{
                  style: {
                    height: "120px",
                    color: "white",
                  },
                }}
              />
            </WriteCommentWrapper>
            <CommentButtonWrapper>
              <Button
                onClick={() => {
                  onCommentSubmitHandler();
                }}
                style={{
                  padding: "10px 30px 10px 30px",
                  backgroundColor: "darkorchid",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                댓글 등록
              </Button>
            </CommentButtonWrapper>
          </WriteCommentContainer>
          <ReadCommentsContainer>
            {comments.map((c) => {
              return (
                <ReadCommentContainer>
                  <ReadCommentTopContainer>
                    <ReadCommentUserInfoContainer>
                      <Avatar></Avatar>
                      <Box style={{ display: "felx", marginLeft: "20px" }}>
                        <Typography>{c.writer.username}</Typography>
                        <Typography>{c.create_at}</Typography>
                      </Box>
                    </ReadCommentUserInfoContainer>
                  </ReadCommentTopContainer>
                  <ReadCommentBottomContainer>
                    <Typography style={{ fontSize: "20px" }}>
                      {c.comment}
                    </Typography>
                    <Box
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button style={{ background: "green", color: "white" }}>
                        댓글 달기
                      </Button>
                    </Box>
                  </ReadCommentBottomContainer>
                  <Divider style={{ backgroundColor: "lightgray" }} />
                </ReadCommentContainer>
              );
            })}
          </ReadCommentsContainer>
        </BottomContainer>
      </Container>
    </Main>
  );
};

const Main = styled.div``;

const Container = styled.div`
  padding: 50px 50px 0px 50px;
`;

const TopContainer = styled.div`
  display: flex;
  height: 80vh;
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

const TagsWrapper = styled.div`
  display: flex;
`;

const RightBottomContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 10%;
`;

const UserWrapper = styled.div`
  display: flex;
  padding-right: 50px;
  align-items: center;
`;

const TagWrapper = styled.div`
  margin-right: 10px;
  font-size: 24px;
  color: #b8f8fb;
`;

const BottomContainer = styled.div`
  padding-top: 5%;
  width: 100%;
  height: 100vh;
`;

const WriteCommentContainer = styled.div`
  width: 60%;
  height: 30%;
  margin: 0 auto;
`;

const WriteCommentWrapper = styled.div`
  margin-top: 10px;
`;

const CommentButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ReadCommentsContainer = styled.div`
  margin: 0 auto;
  width: 60%;
  height: 100%;
`;

const ReadCommentContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const ReadCommentTopContainer = styled.div``;
const ReadCommentUserInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ReadCommentBottomContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 20px;
`;

export default PostPage;
