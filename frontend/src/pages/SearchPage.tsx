import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import "moment/locale/ko";
import Favorite from "@mui/icons-material/Favorite";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useCookies } from "react-cookie";

interface Writer {
  username: string;
  avatar: string;
}

interface IPost {
  id: string;
  title: string;
  describe: string;
  image: string;
  created_at: Date;
  writer: Writer;
}

interface Post extends IPost {
  views_count: number;
  likes_count: number;
  onClickHandler: any;
}

interface PostReview extends IPost {
  views_count: number;
  likes_count: number;
}

const SearchPage = () => {
  const [cookies] = useCookies(["access_token"]);
  const [search, setSearch] = useState(null);
  const [post, setPost] = useState([]);
  const [selectPost, setSelectPost] = useState<PostReview>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectPost = (post: PostReview) => {
    setSelectPost(post);
  };

  const debouncedSearch = useCallback(
    debounce(async (search: String) => {
      if (search === "") {
        setPost([]);
        return;
      }
      search.trim();

      const accessToken = cookies.access_token;

      try {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/post/search`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { search },
          })
          .then((res: AxiosResponse) => {
            const data = res.data;
            console.log(data);
            setPost(data);
          })
          .catch((e: AxiosError) => {
            toast.error("잠시 후 다시 시도해 주세요.🙇‍♂️");
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
          <SearchContainer>
            <SearchIcon style={{ fontSize: "60px" }} />
            <TextField
              inputProps={{ style: { color: "white" } }}
              style={{ width: "90%", fontSize: "30px" }}
              onChange={handleSearchChange}
            />
          </SearchContainer>

          {search !== null && post.length === 0 ? (
            <PostNotFoundContainer>
              <p>원하는 꿈을 찾지는 못했지만 </p>
              <p>당신의 꿈은 찾을 수 있을거에요</p>
            </PostNotFoundContainer>
          ) : (
            <PostContainer>
              {post.map((p: Post) => (
                <PostComponent
                  id={p.id}
                  title={p.title}
                  describe={p.describe}
                  image={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${p.image}`}
                  views_count={p.views_count}
                  likes_count={p.likes_count}
                  created_at={p.created_at}
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
              title={selectPost?.title!}
              describe={selectPost?.describe!}
              image={selectPost?.image!}
              views_count={selectPost?.views_count!}
              likes_count={selectPost?.likes_count!}
              created_at={selectPost?.created_at}
              writer={selectPost?.writer!}
            />
          )}
        </RightContainer>
      </MainContainer>
    </>
  );
};

const PostComponent = (post: Post) => {
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
            width="95%"
            fontSize={16}
            overflow={"hidden"}
            whiteSpace={"pre-line"}
            textOverflow={"ellipsis"}
          >
            {post.title}
          </Typography>
        </PostInfoTopWrapper>

        <PostInfoBottomWrapper></PostInfoBottomWrapper>
      </PostInfoInnerContainer>
    </PostInfoContainer>
  );
};

const PostReviewComponent = (postReview: PostReview) => {
  const navigate = useNavigate();
  const [cookie] = useCookies(["access_token"]);

  const onClickLikePostHandler = (postId: string) => {
    const access_token = cookie.access_token;

    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/post/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res: AxiosResponse) => {
        if (res.status === HttpStatusCode.Ok) {
          toast("❤️응원하는 메시지를 전달하게요❤️");
        }
      })
      .catch((error: AxiosResponse) => {
        if (error.status >= HttpStatusCode.InternalServerError) {
          toast("잠시 후 다시 시도해주세요🙇‍♂️", {
            type: "warning",
          });
        } else if (error.status >= HttpStatusCode.BadRequest) {
          toast(error.data["message"] + "🚨");
        }
      });
  };

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
        <PostReviewMiddleInnerContainer>
          <PostCreateInfoWrapper>
            <Avatar
              alt="Natacha"
              src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/avatar/${postReview?.writer?.avatar}`}
              style={{ width: "64px", height: "64px" }}
            />
            <Typography
              width="90%"
              paddingLeft={2}
              fontSize={26}
              color={"white"}
            >
              {postReview?.writer?.username ?? "익명"}
            </Typography>
          </PostCreateInfoWrapper>

          <PostCreateInfoWrapper>
            <Favorite style={{ color: "red" }} />
            <Typography
              width="90%"
              paddingLeft={2}
              fontSize={12}
              color={"white"}
            >
              {postReview?.likes_count!}
            </Typography>
          </PostCreateInfoWrapper>
          <PostCreateInfoWrapper>
            <VisibilityIcon style={{ color: "lightgreen" }} />
            <Typography
              width="90%"
              paddingLeft={2}
              fontSize={12}
              color={"white"}
            >
              {postReview?.views_count!}
            </Typography>
          </PostCreateInfoWrapper>
          <PostCreateInfoWrapper>
            <AccessTimeIcon />
            <Typography
              width="90%"
              paddingLeft={2}
              fontSize={12}
              color={"white"}
            >
              <Typography>
                {moment(postReview?.created_at).fromNow()}
              </Typography>
            </Typography>
          </PostCreateInfoWrapper>
        </PostReviewMiddleInnerContainer>
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
          onClick={() => {
            navigate(`/dream/${postReview?.id}`);
          }}
        >
          <AutoStoriesIcon style={{ color: "green" }} />
          <Typography style={{ paddingLeft: "10px", color: "black" }}>
            View
          </Typography>
        </Button>
        <Button
          variant="contained"
          style={{
            width: "48%",
            borderRadius: "20px",
            backgroundColor: "white",
            color: "white",
          }}
          onClick={() => {
            onClickLikePostHandler(postReview.id);
          }}
        >
          <Favorite style={{ paddingLeft: "10px", color: "red" }} />
          <Typography style={{ color: "black" }}>Like</Typography>
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

const PostNotFoundContainer = styled.div`
  position: absolute;
  top: 40%;
  left: 10%;
  text-align: center;
  font-size: 46px;
`;

const PostContainer = styled.div`
  margin-top: 30px;
  height: 100%;
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

const PostReviewMiddleInnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 20px;
`;

const PostReviewMiddleInnerBottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const PostCreateInfoWrapper = styled.div`
  display: flex;
  align-items: center;
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
