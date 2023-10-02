import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Mainboard from "../components/Mainbord";
import { debounce } from "lodash";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import {
  Avatar,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";

interface IPost {
  id: string;
  image: string;
  title: string;
  describe: string;
  writer: Writer;
  onClickHandler: any;
}

interface Writer {
  username: string;
  avatar: string;
}
interface PostReview {
  id: string;
  image: string;
  title: string;
  describe: string;
  avatar: string;
  writer: Writer;
}

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const [post, setPost] = useState([]);
  const [selectPost, setSelectPost] = useState<PostReview>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectPost = (post: any) => {
    setSelectPost(post);
  };

  const debouncedSearch = useCallback(
    debounce(async (search) => {
      try {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/post/search`, {
            params: { search },
          })
          .then((response: any) => {
            setPost(response.data);
            console.log(response.data);
          });
      } catch (e) {
        console.log(e);
      }
    }, 500),
    []
  );

  const handleSearchChange = (event: any) => {
    const inputSearchTerm = event.target.value;
    setSearch(inputSearchTerm);
    console.log(inputSearchTerm);
    // Debounce를 적용한 검색 함수를 호출합니다.
    debouncedSearch(inputSearchTerm);
  };

  return (
    <>
      <TitleBar />
      <MainContainer>
        <LeftContainer>
          <SearchContainer>
            <SearchIcon style={{ fontSize: "60px" }} />
            <TextField
              inputProps={{ style: { color: "white" } }}
              style={{ width: "90%", fontSize: "30px" }}
              onChange={handleSearchChange}
            />
          </SearchContainer>

          {post.length !== 0 && (
            <PostContainer>
              {post.map((p: IPost) => (
                <PostComponent
                  id={p.id}
                  image={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${p.image}`}
                  title={p.title}
                  describe={p.describe}
                  writer={p.writer}
                  onClickHandler={handleSelectPost}
                />
              ))}
            </PostContainer>
          )}
        </LeftContainer>
        <RightContainer>
          {selectPost && (
            <PostReviewComponent
              id={selectPost?.id!}
              image={selectPost?.image!}
              title={selectPost?.title!}
              describe={selectPost?.describe!}
              writer={selectPost?.writer!}
              avatar={selectPost?.avatar!}
            />
          )}
        </RightContainer>
      </MainContainer>
    </>
  );
};

const PostComponent = (post: IPost) => {
  const navigate = useNavigate();
  const { onClickHandler } = post;
  return (
    <PostInfoContainer onClick={() => onClickHandler(post)}>
      <PostImageWrapper>
        <img
          src={post.image}
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "20px",
          }}
        />
      </PostImageWrapper>
      <PostInfoInnerContainer>
        <PostInfoTopWrapper>
          <Typography
            width="90%"
            fontSize={20}
            overflow={"hidden"}
            whiteSpace={"pre-line"}
            textOverflow={"ellipsis"}
          >
            {post.title}
          </Typography>
          <Avatar
            src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/avatar/${post?.writer?.avatar}`}
            style={{
              width: "50px",
              height: "50px",
              marginRight: "10px",
              position: "relative",
              top: "-20px",
            }}
          />
        </PostInfoTopWrapper>

        <PostInfoBottomWrapper>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            style={{ marginTop: "20px", borderRadius: "20px" }}
            onClick={() => {
              navigate(`/dream/${post.id}`);
            }}
          >
            View
          </Button>
        </PostInfoBottomWrapper>
      </PostInfoInnerContainer>
    </PostInfoContainer>
  );
};

const PostReviewComponent = (postReview: PostReview) => {
  console.log(postReview);
  return (
    <PostReviewContainer>
      <PostReviewTopContainer>
        <PostReviewImageWrapper>
          <img
            src={postReview.image!}
            style={{
              width: "90%",
              height: "90%",
              borderRadius: "20px",
            }}
          />
        </PostReviewImageWrapper>
      </PostReviewTopContainer>
      <PostReviewMiddleContainer>
        <PostReviewMiddleTopContainer>
          <Typography fontSize={24}>{postReview.title}</Typography>
        </PostReviewMiddleTopContainer>
        <PostReviewMiddleInnerTopContainer>
          <Avatar
            alt="Natacha"
            src="https://mblogthumb-phinf.pstatic.net/MjAxODAxMjlfMjIz/MDAxNTE3MjIxNDA3MDMy.elAEuXxvjGCwjzDpFNaXtPm-__prDl-ejMY574bbOq4g.7BWogSkaXWbMujgT62SKBdBAeTf99z3FFmCqnUOQgnYg.JPEG.d_hye97/654684514.jpg?type=w800"
            style={{ width: "64px", height: "64px" }}
          />
          <Typography width="90%" paddingLeft={2} fontSize={26} color={"white"}>
            {postReview?.writer?.username ?? "익명"}
          </Typography>
        </PostReviewMiddleInnerTopContainer>
        <PostReviewMiddleInnerBottomContainer>
          <PostCreateInfoWrapper>
            <AccessTimeIcon />
            <Typography
              width="90%"
              paddingLeft={2}
              fontSize={12}
              color={"white"}
            >
              {"2023-03-09"}
            </Typography>
          </PostCreateInfoWrapper>
          <PostCreateInfoWrapper>
            <StarIcon />
            <Typography
              width="90%"
              paddingLeft={2}
              fontSize={12}
              color={"white"}
            >
              {"4/5"}
            </Typography>
          </PostCreateInfoWrapper>
        </PostReviewMiddleInnerBottomContainer>
        <PostReviewMiddleBottomContainer></PostReviewMiddleBottomContainer>
      </PostReviewMiddleContainer>
      <PostReviewBottomContainer>
        <Button
          variant="contained"
          style={{
            width: "48%",
            borderRadius: "20px",
            backgroundColor: "white",
            color: "black",
          }}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          style={{
            width: "48%",
            borderRadius: "20px",
            backgroundColor: "purple",
            color: "white",
          }}
        >
          Send
        </Button>
      </PostReviewBottomContainer>
    </PostReviewContainer>
  );
};
const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;
const LeftContainer = styled.div`
  padding: 30px;
  width: 50%;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  height: 10%;
  background-color: #262a2d;
  border-radius: 20px;
`;

const PostContainer = styled.div`
  margin-top: 30px;
  height: 100%;
  overflow: scroll;
  overflow-x: hidden;
`;

const PostInfoContainer = styled.div`
  display: flex;
  margin: 30px 30px 30px 0px;
  padding: 10px 0px 10px 10px;
  align-items: center;
  width: 95%;
  border-radius: 20px;
  background-color: gray;
  overflow: hidden;
  white-space: nowra;
  text-overflow: ellipsis;
`;

const PostImageWrapper = styled.div``;

const PostInfoInnerContainer = styled.div`
  padding-left: 20px;
  width: 90%;
`;

const PostInfoTopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostInfoMiddleWrapper = styled.div`
  width: 90%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break; break-all;
`;

const PostInfoBottomWrapper = styled.div``;

const RightContainer = styled.div`
  padding: 30px 0px 0px 0px;
  width: 50%;
`;

const PostReviewContainer = styled.div`
  padding-left: 10px;
  width: 90%;
`;

const PostReviewImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 450px;
  border-radius: 30px;
`;

const PostReviewTopContainer = styled.div``;
const PostReviewMiddleContainer = styled.div`
  padding: 0px 30px 30px 30px;
  height: 30%;
`;
const PostReviewMiddleTopContainer = styled.div``;

const PostReviewMiddleInnerTopContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  width: 30%;
  border-radius: 30px;
  background-color: #0055cc;
`;

const PostReviewMiddleInnerBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const PostCreateInfoWrapper = styled.div`
  display: flex;
`;
const PostReviewMiddleBottomContainer = styled.div`
  padding-top: 30px;
`;
const PostReviewBottomContainer = styled.div`
  display: flex;
  position: relative;
  height: 50px;
  justify-content: space-between;
`;

export default SearchPage;
