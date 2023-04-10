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
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import CircularProgress from "@mui/material/CircularProgress";

const theme = createTheme();

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: gray;
  height: 1000px;
`;

const BoxWrapper = styled.div`
  display: flex;
  background-color: white;
  width: 1200px;
  height: 800px;
  margin-top: 120px;
  padding: 100px;
  border-radius: 30px;
`;

const BoxForm = styled(Box)`
  display: flex;
`;

const ContentsWrapper = styled.div`
  height: 800px;
  width: 400px;
`;

const ContentTitle = styled(Input)`
  width: 300px;
  height: 50px;
  ::placeholder {
    fontsize: 20px;
  }
`;

const ContentBody = styled(Input)`
  margin-top: 100px;
  width: 300px;
  height: 50px;
`;

const ImageWrapper = styled.div`
  margin-left: 100px;
  widht: 500px;
  height: 600px;
`;

const ImageButton = styled(Button)`
  width: 500px;
  height: 600px;
`;

const PostImage = styled.img`
  width: 500px;
  height: 600px;
  border-radius: 10px;
`;

interface IFormInput {
  title: String;
  bodyText: String;
}

const schema = yup.object().shape({
  title: yup.string().required("Please enter your title").min(5).max(100),
  bodyText: yup.string().required("Please enter your contents").min(6).max(300),
});

export default function CreatePost() {
  const [imageUrl, setImageUrl] = useState<any>("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  const [cookies, setCookie] = useCookies(["access_token"]);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = async (data: any) => {
    const { title, bodyText } = data;
    const postData = { title, bodyText };

    const accessToken = cookies.access_token;

    setImageLoading(true);
    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/post/create`, postData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);
        setImageUrl(response.data.imageUrl);
        setImageLoading(false);
      });
  };

  const onInvalid = (errors: any) => console.error(errors);

  useEffect(() => {
    const accessToken = cookies.access_token;

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/login-user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log(response);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PrimarySearchAppBar />
      <Wrapper>
        <BoxWrapper>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmitHandler, onInvalid)}
            sx={{ mt: 1 }}
            style={{ display: "flex" }}
          >
            <ContentsWrapper>
              <ContentTitle
                placeholder="당신의 꿈의 제목을 들려주세요"
                defaultValue={""}
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                error={!!errors.title}
                {...register("title")}
              ></ContentTitle>
              <div className="invalid-feedback">{errors.title?.message}</div>
              <ContentBody
                placeholder="당신의 꿈의 내용을 들려주세요"
                className={`form-control ${
                  errors.bodyText ? "is-invalid" : ""
                }`}
                error={!!errors.bodyText}
                {...register("bodyText")}
              ></ContentBody>
              <div className="invalid-feedback">{errors.bodyText?.message}</div>
            </ContentsWrapper>

            <ImageWrapper>
              <ImageButton type="submit">
                {imageLoading && (
                  <CircularProgress
                    style={{
                      position: "absolute",
                      top: "250px",
                    }}
                  />
                )}
                <PostImage
                  src={imageUrl}
                  alt="Click Image"
                  style={{ alignItems: "center", lineHeight: "500px" }}
                />
              </ImageButton>
            </ImageWrapper>
          </Box>
        </BoxWrapper>
      </Wrapper>
    </ThemeProvider>
  );
}
