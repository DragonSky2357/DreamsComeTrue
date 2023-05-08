import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import { Box, Button, Input, InputBase, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCookies } from "react-cookie";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import Mainboard from "../components/Mainbord";
import SendIcon from "@mui/icons-material/Send";

const Wrapper = styled.div`
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 800px;
  padding-left: 250px;
  padding-top: 50px;
`;

const BoxWrapper = styled.div`
  display: flex;

  background-color: #fdfdfd;
  width: 1400px;
  height: 800px;
  border-radius: 30px;
  box-shadow: 5px 5px 5px 5px gray;
`;

const BoxForm = styled(Box)`
  display: flex;
`;

const ContentsWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 30px;
`;

const ContentTitle = styled.div`
  width: 100%;
  height: 50px;
  ::placeholder {
    fontsize: 20px;
  }
`;

const ContentWriter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ::placeholder {
    fontsize: 20px;
  }
`;

const ContentBody = styled.div`
  margin-top: 20px;
  width: 300px;
  height: 50px;
`;

const ContentComment = styled.div`
  max-height: 400px;
  overflow-y: scroll;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 500px;
  height: 100%;
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

const CommentInputWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 500px;
`;
const CommentInputText = styled(TextField)`
  width: 750px;
  overflow: hidden;
`;

const CommentList = styled.div`
  display: flex;
  height: 50px;
`;

const PostWrapper = styled.div`
  width: 1400px;
  padding-top: 30px;
`;

interface IFormInput {
  comment: String;
}

const schema = yup.object().shape({
  comment: yup.string().required("Please enter your comment").min(1).max(500),
});

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>();
  const [posts, setPosts] = useState<any>([]);
  const [username, setUsername] = useState<any>("");

  const [submit, setSubmit] = useState<boolean>(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const [cookies, setCookie] = useCookies(["access_token"]);

  const onSubmitHandler = async (data: any) => {
    const { comment } = data;
    const postId = id;
    const commentData = { comment, postId };

    const accessToken = cookies.access_token;
    console.log(commentData, postId);

    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/comment/create`, commentData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);
        setSubmit(true);
      });
  };
  const onInvalid = (errors: any) => console.error(errors);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${id}`)
      .then((response: any) => {
        console.log(response.data);
        setPost(response.data);
        setUsername(response.data?.writer?.username);
        setSubmit(false);
      });
  }, [submit]);

  useEffect(() => {
    if (username !== "") {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/post/u/${username}`)
        .then((response) => {
          setPosts(response.data);
        });
    }
  }, [username]);

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
              <ContentWriter>
                <Link
                  to={`/${post?.writer?.username}`}
                  style={{ textDecoration: "none" }}
                >
                  <h1>{post?.writer?.username}</h1>
                </Link>
                <h1>님의 꿈을 소개합니다 😁</h1>
                <ThumbUpOffAltIcon fontSize="large" />
              </ContentWriter>
              <ContentTitle>
                <h2>{post?.title}</h2>
              </ContentTitle>

              <ContentBody>
                <h3>{post?.bodyText}</h3>
              </ContentBody>
              <h2>댓글</h2>
              <ContentComment>
                {post?.comment?.map((p: any, index: any) => (
                  <CommentList key={index}>
                    <Link
                      to={`/${p.writer.username}`}
                      style={{ textDecoration: "none" }}
                    >
                      <h3>{p.writer.username}</h3>
                    </Link>

                    <h4 style={{ paddingLeft: "20px" }}>{p.comment}</h4>
                  </CommentList>
                ))}
              </ContentComment>
              <CommentInputWrapper>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit(onSubmitHandler, onInvalid)}
                  sx={{ mt: 1 }}
                >
                  <CommentInputText
                    className={`form-control ${
                      errors.comment ? "is-invalid" : ""
                    }`}
                    error={!!errors.comment}
                    {...register("comment")}
                  />
                </Box>
              </CommentInputWrapper>
            </ContentsWrapper>

            <ImageWrapper>
              <PostImage src={post?.imageUrl} alt="Click Image" />
            </ImageWrapper>
          </BoxWrapper>

          <PostWrapper>
            <Mainboard posts={posts} />
          </PostWrapper>
        </Wrapper>
      </div>
    </div>
  );
};

export default PostPage;
