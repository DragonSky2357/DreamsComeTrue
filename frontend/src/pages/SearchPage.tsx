import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Mainboard from "../components/Mainbord";
import { debounce } from "lodash";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchPage = () => {
  const [search, setSearch] = useState("");

  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useCallback(
    debounce(async (search) => {
      try {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/post/search`, {
            params: { title: search, content: search },
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
              fullWidth
              style={{ width: "90%", color: "white" }}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <PostContainer>
            {post.map((p: IPost) => (
              <PostComponent
                img={p.img}
                title={p.title}
                describe={p.describe}
              />
            ))}
          </PostContainer>
        </LeftContainer>
        <RightContainer>
          <PostReviewComponent
            img="https://www.sisain.co.kr/news/photo/202207/48124_87125_4950.jpg"
            title="Dream Description"
            describe="In this dream, you will explore the world of lucid dream, We will guild you thought"
            avatar=""
            user="dragonsky"
          />
        </RightContainer>
      </MainContainer>
    </>
  );
};

interface IPost {
  img: string;
  title: string;
  describe: string;
}

const PostComponent = (post: IPost) => {
  return (
    <PostInfoContainer>
      <PostImageWrapper>
        <img
          src={post.img}
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "20px",
          }}
        />
      </PostImageWrapper>
      <PostReviewContainer>
        <PostReviewTopWrapper>
          <Typography fontSize={25}>{post.title}</Typography>
          <Avatar
            src={
              "https://mblogthumb-phinf.pstatic.net/MjAxODAxMjlfMjIz/MDAxNTE3MjIxNDA3MDMy.elAEuXxvjGCwjzDpFNaXtPm-__prDl-ejMY574bbOq4g.7BWogSkaXWbMujgT62SKBdBAeTf99z3FFmCqnUOQgnYg.JPEG.d_hye97/654684514.jpg?type=w800"
            }
            style={{ marginRight: "10px" }}
          />
        </PostReviewTopWrapper>
        <PostReviewMiddleWrapper>
          <Typography>{post.describe}</Typography>
        </PostReviewMiddleWrapper>
        <PostReviewBottomWrapper>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            style={{ marginTop: "20px", borderRadius: "20px" }}
          >
            View
          </Button>
        </PostReviewBottomWrapper>
      </PostReviewContainer>
    </PostInfoContainer>
  );
};

interface PostReview {
  img: string;
  title: string;
  describe: string;
  avatar: string;
  user: string;
}

const PostReviewComponent = (postReview: PostReview) => {
  return (
    <PostReviewContainer>
      <PostReviewTopContainer>
        <PostReviewImageWrapper>
          <img
            src={postReview.img}
            style={{
              width: "100%",
              height: "90%",
              borderRadius: "20px",
            }}
          />
        </PostReviewImageWrapper>
      </PostReviewTopContainer>
      <PostReviewMiddleContainer>
        <PostReviewMiddleTopContainer>
          <Typography fontSize={26}>{postReview.title}</Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar src={postReview.avatar} />
            <Typography paddingLeft={2} fontSize={16}>
              {postReview.user}
            </Typography>
          </div>
        </PostReviewMiddleTopContainer>

        <PostReviewMiddleBottomContainer>
          <Typography fontSize={22}>{postReview.title}</Typography>

          <Typography paddingTop={1} fontSize={20}>
            {postReview.describe}
          </Typography>
        </PostReviewMiddleBottomContainer>
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
  height: 90vh;
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
  margin: 30px;
  align-items: center;
  width: 95%;
  height: 150px;
  border-radius: 20px;
  background-color: gray;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const PostImageWrapper = styled.div`
  padding-left: 10px;
`;

const PostReviewContainer = styled.div`
  width: 95%;
  padding-left: 20px;
`;

const PostReviewTopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostReviewMiddleWrapper = styled.div`
  width: 90%;
`;

const PostReviewBottomWrapper = styled.div``;

const RightContainer = styled.div`
  padding: 30px 0px 0px 0px;
  width: 50%;
`;

const PostReviewImageWrapper = styled.div`
  height: 450px;
  border-radius: 30px;
`;

const PostReviewTopContainer = styled.div``;
const PostReviewMiddleContainer = styled.div`
  padding: 0px 30px 30px 30px;
  height: 30%;
`;
const PostReviewMiddleTopContainer = styled.div``;
const PostReviewMiddleBottomContainer = styled.div`
  padding-top: 30px;
`;
const PostReviewBottomContainer = styled.div`
  display: flex;
  position: relative;
  height: 50px;
  justify-content: space-between;
  padding-top: 20px;
`;

export default SearchPage;
