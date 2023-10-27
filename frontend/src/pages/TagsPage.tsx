import React, { useEffect, useState } from "react";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios, { HttpStatusCode } from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import BasicMasonry from "../components/BasicMasonry";

const TagsPage = () => {
  const { tags } = useParams();
  const [post, setPost] = useState<any[]>([]);
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = cookies.access_token;

    if (!accessToken) {
      toast("먼저 로그인을 해주세요");
      navigate("/login");
    }

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        if (err.response.data["statusCode"] === HttpStatusCode.Unauthorized) {
          toast("먼저 로그인을 해주세요");
          navigate("/login");
        }
      });

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/tag/${tags}`)
      .then((res: any) => {
        console.log(res.status === HttpStatusCode.Ok);
        if (res.status === HttpStatusCode.Ok) {
          const posts = res.data["posts"];
          console.log(posts);
          setPost(posts);
        }
      });
  }, []);
  return (
    <>
      <TitleBar />
      <MainContainer>
        <TopContainer>
          <Typography style={{ fontSize: "32px" }}>#{tags}</Typography>
        </TopContainer>
        <BottomContainer>
          <BasicMasonry post={post} />
        </BottomContainer>
      </MainContainer>
    </>
  );
};

const MainContainer = styled.div`
  height: 100vh;
  padding: 30px;
`;
const TopContainer = styled.div`
  height: 20vh;
`;
const BottomContainer = styled.div`
  height: 80vh;
`;

export default TagsPage;
