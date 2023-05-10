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
import StarIcon from "@mui/icons-material/Star";

import axios from "axios";
import { useState, useEffect } from "react";
import { Input, Rating, TextField } from "@mui/material";
import Image from "material-ui-image";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { LoginState } from "../state/LoginState";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e2e2e2;
  height: 100vh;
`;

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 750px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 50px;
  border-radius: 30px;
`;

const BoxForm = styled(Box)`
  display: flex;
`;

const ContentsWrapper = styled.div`
  width: 550px;
  height: 600px;
`;

const ContentTitleWrapper = styled.div``;

const ContentTitle = styled(Input)`
  width: 500px;
  height: 50px;
  ::placeholder {
    fontsize: 20px;
  }
`;

const ContentBodyWrapper = styled.div`
  padding-top: 50px;
`;

const ContentBody = styled(TextField)`
  width: 500px;
  height: auto;
`;

const ContentRatingWrapper = styled(Box)`
  position: absolute;
  bottom: 50px;
`;

const ImageWrapper = styled.div`
  margin: 0 auto;
  widht: 500px;
  height: 550px;
`;

const ImageButton = styled(Button)`
  width: 500px;
  height: 550px;
`;

const PostImage = styled.img`
  width: 500px;
  height: 600px;
  border-radius: 10px;
`;

const ContentBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserNameWarpper = styled.div``;
const ButtonWrapper = styled.div``;

interface IFormInput {
  title: String;
  bodyText: String;
}

const labels: { [index: string]: string } = {
  1: "악몽이었어요",
  2: "별로였어요",
  3: "나쁘지 않았어요",
  4: "좋았어요 ",
  5: "최고였어요",
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function CreatePost() {
  const [user, setUser] = useState<any>("");
  const [title, setTitle] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  const [rating, setRating] = useState<number | null>(1);
  const [imageUrl, setImageUrl] = useState<any>("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [cookies, setCookie] = useCookies(["access_token"]);
  const [loginState, setLoginState] = useRecoilState(LoginState);
  const navigate = useNavigate();

  const [hover, setHover] = React.useState(-1);

  useEffect(() => {
    if (loginState === false) {
      toast("로그인을 먼저 해주세요!!!");
      navigate("/");
    }

    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/user/login-user`, {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        })
        .then((res) => {
          setUser(res.data);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onInvalid = (errors: any) => console.error(errors);

  const downloadFile = (url: any) => {
    console.log(url);

    fetch(url, { method: "GET", mode: "cors" })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "image.png";
        document.body.appendChild(a);
        a.click();
        setTimeout((_) => {
          window.URL.revokeObjectURL(url);
        }, 60000);
        a.remove();
      })
      .catch((err) => {
        console.error("err: ", err);
      });
  };

  const createImageHandler = async () => {
    if (title.length < 2) {
      toast("제목을 2글자 이상 넣어주세요");
      return;
    }
    try {
      setImageLoading(true);
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/post/createimage`,
          { title },
          { headers: { Authorization: `Bearer ${cookies.access_token}` } }
        )
        .then((res) => {
          if (res.data.sucess === true) {
            setImageUrl(res.data.imageUrl);
          } else {
            toast(res.data.message);
          }
          setImageLoading(false);
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  const onSubmitHandler = async () => {
    if (imageUrl === "") {
      toast("이미지를 먼저 만들어 주세요");
      return;
    }

    try {
      setImageLoading(true);
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/post/create`,
          { title, bodyText, rating, imageUrl },
          {
            headers: { Authorization: `Bearer ${cookies.access_token}` },
          }
        )
        .then((res) => {
          setImageUrl(res.data.imageUrl);
          setImageLoading(false);
          navigate("/");
        });
    } catch (e: any) {
      if (e.res.data.statusCode === 401) toast("로그인을 먼저 해주세요!!!");
      navigate("/");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PrimarySearchAppBar />
      <Wrapper>
        <BoxWrapper>
          <ContentBar>
            <UserNameWarpper>
              <h1>{user}님 당신의 꿈을 들려주세요😄</h1>
            </UserNameWarpper>
            <ButtonWrapper>
              <Button onClick={() => downloadFile(imageUrl)}>
                이미지 저장
              </Button>
              <Button onClick={() => onSubmitHandler()}>포스트 저장</Button>
            </ButtonWrapper>
          </ContentBar>

          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            style={{ display: "flex" }}
          >
            <ContentsWrapper>
              <ContentTitleWrapper>
                <ContentTitle
                  placeholder="어떤 꿈을 꾸었나요?"
                  defaultValue={""}
                  inputProps={{ maxLength: 100 }}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="invalid-feedback"></div>
              </ContentTitleWrapper>
              <ContentBodyWrapper>
                <ContentBody
                  multiline
                  placeholder="자세히 알려줄 수 있나요?"
                  inputProps={{ maxLength: 500 }}
                  onChange={(e) => setBodyText(e.target.value)}
                />
                <div className="invalid-feedback"></div>
              </ContentBodyWrapper>
              <ContentRatingWrapper
                sx={{
                  width: 300,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Rating
                  name="hover-feedback"
                  size="large"
                  value={rating}
                  precision={1}
                  getLabelText={getLabelText}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
                {rating !== null && (
                  <Box sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : rating]}
                  </Box>
                )}
              </ContentRatingWrapper>
            </ContentsWrapper>

            <ImageWrapper>
              <ImageButton
                onClick={() => createImageHandler()}
                disabled={imageLoading}
              >
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
