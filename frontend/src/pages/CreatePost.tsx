import * as React from "react";

import {
  Box,
  Button,
  Input,
  Modal,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
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
import { MuiChipsInput } from "mui-chips-input";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

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
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
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

  const handleChange = (newChips: any) => {
    console.log(newChips);
    setTags(newChips);
  };

  const onInvalid = (errors: any) => console.error(errors);

  const downloadImageHandler = (url: any) => {
    const imageUrl = `${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/${url}`;

    fetch(imageUrl, { method: "GET", mode: "cors" })
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
        setTimeout((_: any) => {
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
      console.log(tags);
      setImageLoading(true);
      const access_token = accessToken.access_token;
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/post`,
          { title, describe, image, rating, tags },
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        )
        .then((res) => {
          setImageLoading(false);
          navigate("/");
        });
    } catch (e: any) {
      console.log(e);
      if (e.res.data.statusCode === 401) toast("로그인을 먼저 해주세요!!!");
      navigate("/");
    }
  };

  const enlargeImageHandler = () => {
    setOpen(true);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",

    boxShadow: 24,
  };

  return (
    <>
      <TitleBar />
      <Main>
        <LeftContainer>
          <LeftContainerInner>
            <LeftContainerInnerTop>
              <Typography style={{ fontSize: "26px" }}>
                Dream Title & Description
              </Typography>
              <InputWrapper>
                <Typography style={{ fontSize: "14px" }}>
                  Dream Title
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  InputProps={{
                    sx: {
                      alignItems: "start",
                      height: "10vh",
                      marginTop: "10px",
                      borderRadius: "20px",
                      backgroundColor: "#343434",
                      color: "white",
                    },
                  }}
                  onChange={(e: any) => {
                    setTitle(e.target.value);
                  }}
                />
              </InputWrapper>
            </LeftContainerInnerTop>
            <LeftContainerInnerMiddle>
              <InputWrapper>
                <Typography style={{ fontSize: "14px" }}>
                  Dream Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  InputProps={{
                    sx: {
                      alignItems: "start",
                      height: "30vh",
                      marginTop: "10px",
                      borderRadius: "20px",
                      backgroundColor: "#343434",
                      color: "white",
                      overflowY: "scroll",
                    },
                  }}
                  onChange={(e: any) => {
                    setDescribe(e.target.value);
                  }}
                />
              </InputWrapper>
            </LeftContainerInnerMiddle>
            <LeftContainerInnerBottom>
              <InputWrapper>
                <Typography style={{ fontSize: "14px" }}>Dream Tag</Typography>
                <MuiChipsInput
                  value={tags}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    backgroundColor: "#424242",
                    borderRadius: "20px",
                    "& .MuiChipsInput-Chip": {
                      color: "white",
                    },
                  }}
                  inputProps={{ style: { color: "white" } }}
                />
              </InputWrapper>
            </LeftContainerInnerBottom>
          </LeftContainerInner>
        </LeftContainer>
        <RightContainer>
          <RightContainerInner>
            <RightContainerInnerTop>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px",
                }}
              >
                <Typography style={{ fontSize: "26px" }}>Preview</Typography>
                <FullscreenIcon onClick={() => enlargeImageHandler()} />
                <Modal open={open} onClose={handleClose}>
                  <Box
                    sx={{
                      ...style,
                      width: "50%",
                      height: "80%",
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/${image}`}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                </Modal>
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "10px 20px 10px 20px",
                  height: "80%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => createImageHandler()}
              >
                {imageLoading ? (
                  <CircularProgress />
                ) : (
                  <img
                    src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/${image}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "20px",
                    }}
                  />
                )}
              </div>
            </RightContainerInnerTop>
            <RightContainerInnerBottom>
              <Button
                style={{
                  margin: "0 auto",
                  padding: "10px",
                  width: "80%",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  color: "black",
                }}
                onClick={() => downloadImageHandler(image)}
              >
                DownLoad
              </Button>
              <Button
                style={{
                  margin: "0 auto",
                  padding: "10px",
                  width: "80%",
                  marginTop: "20px",
                  backgroundColor: "orange",
                  borderRadius: "20px",
                  color: "white",
                }}
                onClick={() => onSubmitHandler()}
              >
                Publish
              </Button>
            </RightContainerInnerBottom>
          </RightContainerInner>
        </RightContainer>
      </Main>
    </>
  );
}

const Main = styled.div`
  display: flex;
  padding: 30px;
  height: 80vh;
`;

const LeftContainer = styled.div`
  width: 60%;
  height: 100%;
  background-color: #282828;
  border-radius: 24px;
`;

const LeftContainerInner = styled.div`
  height: 90%;
  margin: 30px;
`;

const LeftContainerInnerTop = styled.div`
  height: 30%;
`;

const LeftContainerInnerMiddle = styled.div`
  height: 50%;
`;
const LeftContainerInnerBottom = styled.div`
  height: 20%;
`;

const InputWrapper = styled.div`
  margin-top: 20px;
`;

const RightContainer = styled.div`
  width: 40%;
  height: 100%;
  margin-left: 30px;
  border-radius: 24px;
`;

const RightContainerInner = styled.div`
  height: 90%;
`;

const RightContainerInnerTop = styled.div`
  height: 75%;
  border-radius: 24px;
  background-color: #282828;
`;
const RightContainerInnerBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 30%;
  margin-top: 50px;
  border-radius: 24px;
  background-color: #282828;
`;
