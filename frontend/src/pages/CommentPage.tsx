import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleBar from "../components/TitleBar/TitleBar";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import axios, { HttpStatusCode } from "axios";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

const CommentPage = () => {
  const [accessToken] = useCookies(["access_token"]);
  const { id } = useParams();
  const [post, setPost] = useState<any>();

  useEffect(() => {
    const access_token = accessToken.access_token;

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        if (res.status === HttpStatusCode.Ok) {
          setPost(res.data);
          console.log(res.data);
          console.log(res.data.comments);
        }
      });
  }, []);
  return (
    <>
      <TitleBar />
      <Main>
        <TopContainer>
          <img
            src={
              `${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${post?.image}` ??
              null
            }
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "none",
            }}
          />
        </TopContainer>
        <BottomContainer>
          {post?.comments.map((c: any) => {
            return (
              <CommentContainer>
                <CommentTopContainer>
                  <CommentImageWrapper>
                    <Avatar
                      src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/avatar/${c?.user?.avatar}`}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </CommentImageWrapper>
                  <CommentInfoWrapper>
                    <Typography>{c?.user?.username ?? "익명"}</Typography>
                    <Typography>{c?.created_at}</Typography>
                  </CommentInfoWrapper>
                </CommentTopContainer>
                <CommentBottomContainer>
                  <Typography>{c.comment}</Typography>
                </CommentBottomContainer>
              </CommentContainer>
            );
          })}
          <CommentSubmitContainer>
            <TextField
              InputProps={{
                sx: {
                  alignItems: "start",
                  height: "30vh",
                  color: "white",
                  backgroundColor: "#343434",
                },
              }}
              multiline
              style={{ width: "100%", height: "80%" }}
            />
            <Button
              variant="contained"
              color="secondary"
              style={{ float: "right", marginTop: "16px" }}
            >
              댓글 작성
            </Button>
          </CommentSubmitContainer>
        </BottomContainer>
      </Main>
    </>
  );
};

const Main = styled.div`
  height: 100vh;
  padding: 20px;
`;

const TopContainer = styled.div`
  margin: 0 auto;
  width: 90%;
  height: 80%;
`;
const BottomContainer = styled.div`
  margin: 0 auto;
  margin-top: 100px;
  width: 70%;
  height: 60%;
`;

const CommentContainer = styled.div`
  height: 20%;
  padding: 10px;
  margin: 10px;
`;

const CommentTopContainer = styled.div`
  display: flex;
  align-items: center;
  height: 50%;
`;

const CommentImageWrapper = styled.div`
  width: 54px;
  height: 54px;
`;
const CommentInfoWrapper = styled.div`
  padding-left: 30px;
`;

const CommentBottomContainer = styled.div`
  margin-top: 10px;
  width: 90%;
  height: 50%;
`;

const CommentSubmitContainer = styled.div`
  padding: 20px;
  width: 90%;
  height: 50%;
`;

export default CommentPage;
