import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Mainboard from "../components/Mainbord";
import { debounce } from "lodash";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import { Avatar, Button, Typography } from "@mui/material";

const SearchPage = () => {
  const [search, setSearch] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useCallback(
    debounce(async (search) => {
      try {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/post/search`, {
            params: { title: search, content: search },
          })
          .then((response: any) => {
            setPosts(response.data);
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

    // Debounce를 적용한 검색 함수를 호출합니다.
    debouncedSearch(inputSearchTerm);
  };

  return (
    <>
      <TitleBar />
      <MainContainer>
        <LeftContainer>
          <SearchContainer>1</SearchContainer>
          <PostContainer>
            <PostImageWrapper>
              <img
                src={
                  "https://www.sisain.co.kr/news/photo/202207/48124_87125_4950.jpg"
                }
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "20px",
                }}
              />
            </PostImageWrapper>
            <PostReviewContainer>
              <PostReviewTopWrapper>
                <Typography fontSize={25}>Dream Typography</Typography>
                <Avatar
                  src={
                    "https://mblogthumb-phinf.pstatic.net/MjAxODAxMjlfMjIz/MDAxNTE3MjIxNDA3MDMy.elAEuXxvjGCwjzDpFNaXtPm-__prDl-ejMY574bbOq4g.7BWogSkaXWbMujgT62SKBdBAeTf99z3FFmCqnUOQgnYg.JPEG.d_hye97/654684514.jpg?type=w800"
                  }
                  style={{ marginRight: "10px" }}
                />
              </PostReviewTopWrapper>
              <PostReviewMiddleWrapper>
                <Typography>Lucky Thompson</Typography>
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
          </PostContainer>
        </LeftContainer>
        <RightContainer>
          <PostReviewTopContainer>
            <PostReviewImageWrapper>
              <img
                src={
                  "https://www.sisain.co.kr/news/photo/202207/48124_87125_4950.jpg"
                }
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "20px",
                }}
              />
            </PostReviewImageWrapper>
          </PostReviewTopContainer>
          <PostReviewMiddleContainer>
            <PostReviewMiddleTopContainer>
              <Typography fontSize={26}>Building Dreamy Apps</Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "10px",
                }}
              >
                <Avatar
                  src={
                    "https://mblogthumb-phinf.pstatic.net/MjAxODAxMjlfMjIz/MDAxNTE3MjIxNDA3MDMy.elAEuXxvjGCwjzDpFNaXtPm-__prDl-ejMY574bbOq4g.7BWogSkaXWbMujgT62SKBdBAeTf99z3FFmCqnUOQgnYg.JPEG.d_hye97/654684514.jpg?type=w800"
                  }
                />
                <Typography paddingLeft={2} fontSize={16}>
                  dragonsky
                </Typography>
              </div>
            </PostReviewMiddleTopContainer>

            <PostReviewMiddleBottomContainer>
              <Typography fontSize={22}>Dream Description</Typography>

              <Typography paddingTop={1} fontSize={20}>
                In this dream, you will explore the world of lucid dream, We
                will guild you thought
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
        </RightContainer>
      </MainContainer>
    </>
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
  height: 10%;
  background-color: #ffffaa;
`;

const PostContainer = styled.div`
  display: flex;
  margin: 30px;
  align-items: center;
  width: 90%;
  height: 150px;
  border-radius: 20px;
  background-color: gray;
`;

const PostImageWrapper = styled.div`
  padding-left: 10px;
`;

const PostReviewContainer = styled.div`
  flex: 1;
  padding-left: 20px;
`;

const PostReviewTopWrapper = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
`;

const PostReviewMiddleWrapper = styled.div``;

const PostReviewBottomWrapper = styled.div``;

const RightContainer = styled.div`
  padding: 30px;
  width: 50%;
  background-color: #212121;
`;

const PostReviewImageWrapper = styled.div`
  height: 500px;
  border-radius: 30px;
`;

const PostReviewTopContainer = styled.div``;
const PostReviewMiddleContainer = styled.div`
  padding: 30px;
  height: 30%;
`;
const PostReviewMiddleTopContainer = styled.div``;
const PostReviewMiddleBottomContainer = styled.div`
  padding-top: 30px;
`;
const PostReviewBottomContainer = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
  padding-top: 20px;
`;
export default SearchPage;
