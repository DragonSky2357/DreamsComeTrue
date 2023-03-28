import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";

import axios from "axios";
import { useState, useEffect } from "react";
import { Input, TextField } from "@mui/material";
import Image from "material-ui-image";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: gray;
`;

const BoxWrapper = styled.div`
  display: flex;
  background-color: white;
  width: 1400px;
  height: 1200px;
  margin-top: 120px;
  padding: 100px;
`;

const ContentsWrapper = styled.div`
  height: 800px;
  width: 400px;
`;

const ImageWrapper = styled.div`
  widht: 400px;
  height: 400px;
`;

const ContentTitle = styled(Input)`
  border: 0;
  color: white;
  width: 300px;
  height: 100px;
`;

const ContentBody = styled(Input)`
  height: 200px;
`;

const PostImage = styled.img`
  width: 500px;
  height: 500px;
`;
export default function CreatePost() {
  const [posts, setPost] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post`)
      .then((response: any) => {
        setPost(response.data);
        console.log(response.data);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Wrapper>
        <BoxWrapper>
          <ContentsWrapper>
            <ContentTitle placeholder="당신의 꿈의 제목을 들려주세요"></ContentTitle>
            <ContentBody
              placeholder="당신의 꿈의 내용을 들려주세요"
              fullWidth
            ></ContentBody>
          </ContentsWrapper>
          <ImageWrapper>
            <PostImage
              src={
                "https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/57475bb0-446e-498c-ad10-300d75d70917.png"
              }
            />
          </ImageWrapper>
        </BoxWrapper>
      </Wrapper>
    </ThemeProvider>
  );
}
