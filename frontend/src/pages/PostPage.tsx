import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import { Box, Button, Input, InputBase, TextField } from "@mui/material";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 1000px;
`;

const BoxWrapper = styled.div`
  display: flex;
  background-color: #fdfdfd;
  width: 1000px;
  height: 800px;
  border-radius: 30px;
  box-shadow: 5px 5px 5px 5px gray;
`;

const BoxForm = styled(Box)`
  display: flex;
`;

const ContentsWrapper = styled.div`
  height: 800px;
  width: 400px;
  padding: 30px;
`;

const ContentTitle = styled.div`
  width: 300px;
  height: 50px;
  ::placeholder {
    fontsize: 20px;
  }
`;

const ContentWriter = styled.div`
  width: 300px;
  height: 50px;
  ::placeholder {
    fontsize: 20px;
  }
`;

const ContentBody = styled.div`
  margin-top: 100px;
  width: 300px;
  height: 50px;
`;

const ContentComment = styled.div``;

const ImageWrapper = styled.div`
  position: relative;
  widht: 600px;
  height: 100%;
  padding-left: 100px;
`;

const ImageButton = styled(Button)`
  width: 500px;
  height: 600px;
`;

const PostImage = styled.img`
  width: 500px;
  height: 100%;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const CommentInputWrapper = styled.div``;
const CommentInputText = styled(TextField)`
  color: "black";
  placeholder: "친구의 꿈을 응원해주세요";
  border: "1px solid";
`;

const PostPage = () => {
  const { id } = useParams();

  const [post, setPost] = useState<any>();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${id}`)
      .then((response: any) => {
        console.log(response.data);
        setPost(response.data);
      });
  }, []);
  return (
    <div>
      <div>
        {/* {post && (
          <div>
            <img src={post?.imageUrl} />
            <div>
              <h1>{post?.title}</h1>
              <h1>{post?.bodyText}</h1>
            </div>
          </div>
        )} */}

        <PrimarySearchAppBar />
        <Wrapper>
          <BoxWrapper>
            <ContentsWrapper>
              <ContentTitle>
                <h1>{post?.title}</h1>
              </ContentTitle>
              <Link to={`/${post?.writer?.username}`}>
                <ContentWriter>
                  <h1>{post?.writer?.username}</h1>
                </ContentWriter>
              </Link>

              <ContentBody>
                <h1>{post?.bodyText}</h1>
              </ContentBody>
              <ContentComment>
                <h1>댓글</h1>
              </ContentComment>
              <CommentInputWrapper>
                <CommentInputText></CommentInputText>
              </CommentInputWrapper>
            </ContentsWrapper>

            <ImageWrapper>
              <PostImage src={post?.imageUrl} alt="test" />
            </ImageWrapper>
          </BoxWrapper>
        </Wrapper>
      </div>
    </div>
  );
};

export default PostPage;
