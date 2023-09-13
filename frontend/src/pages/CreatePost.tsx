import * as React from "react";

import { Box, Button, Input, Rating, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";
import StarIcon from "@mui/icons-material/Star";
import axios, { HttpStatusCode } from "axios";
import { useState, useEffect } from "react";
import TitleBar from "../components/TitleBar/TitleBar";
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
  background-color: black;
  height: 100vh;
`;

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  margin-top: -80px;
  padding: 40px;
  border-radius: 30px;
`;

const ContentsWrapper = styled.div``;

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
  bottom: 120px;
`;

const ImageWrapper = styled.div`
  margin-left: 20px;
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

const ContentBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserNameWarpper = styled.div`
  color: black;
`;
const ButtonWrapper = styled.div``;

interface IFormInput {
  title: String;
  describe: String;
  rating?: number;
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
  const [describe, setDescribe] = useState<string>("");
  const [rating, setRating] = useState<number | null>(1);
  const [image, setImage] = useState<any>("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [loginState] = useRecoilState(LoginState);
  const [accessToken] = useCookies(["access_token"]);
  const [refreshToken] = useCookies(["refresh_token"]);

  const navigate = useNavigate();

  const [hover, setHover] = React.useState(-1);

  useEffect(() => {
    console.log(loginState);
    if (loginState === false) {
      toast("로그인을 먼저 해주세요!!!");
      navigate("/");
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
      const access_token = accessToken.access_token;
      setImageLoading(true);
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/post/createimage`,
          { title },
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then((res) => {
          if (res.status === HttpStatusCode.Created) {
            setImage(res.data["image"]);
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
    if (image === "") {
      toast("이미지를 먼저 만들어 주세요");
      return;
    }

    try {
      setImageLoading(true);
      const access_token = accessToken.access_token;
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/post`,
          { title, describe, image, rating },
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        )
        .then((res) => {
          setImage(res.data["image"]);
          setImageLoading(false);
          navigate("/");
        });
    } catch (e: any) {
      console.log(e);
      if (e.res.data.statusCode === 401) toast("로그인을 먼저 해주세요!!!");
      navigate("/");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <TitleBar />
      <Wrapper>
        <BoxWrapper>
          <ContentBar>
            <UserNameWarpper>
              <h1>{user} </h1>
              <h1>당신의 꿈을 들려주세요😄</h1>
            </UserNameWarpper>
            <ButtonWrapper>
              <Button onClick={() => downloadFile(image)}>이미지 저장</Button>
              <Button onClick={() => onSubmitHandler()}>포스트 저장</Button>
            </ButtonWrapper>
          </ContentBar>

          <Box
            component="form"
            noValidate
            style={{ display: "flex", width: 1000 }}
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
                  onChange={(e) => setDescribe(e.target.value)}
                />
                <div className="invalid-feedback"></div>
              </ContentBodyWrapper>
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
                  src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/${image}`}
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
