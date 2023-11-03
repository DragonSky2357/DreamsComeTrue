import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import styled from "styled-components";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useState, useEffect } from "react";
import TitleBar from "../components/TitleBar/TitleBar";
import { useCookies } from "react-cookie";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MuiChipsInput } from "mui-chips-input";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { ErrorResponse } from "../constants/Response";

export default function CreatePost() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState<string>("");
  const [describe, setDescribe] = useState<string>("");
  const [image, setImage] = useState<any>("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [cookies] = useCookies(["access_token"]);
  const [refreshToken] = useCookies(["refresh_token"]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((res: AxiosResponse) => {
        console.log(res);
      })
      .catch((e: AxiosError) => {
        const res = e.response;
        const data = res?.data as ErrorResponse;

        if (data.statusCode === HttpStatusCode.Unauthorized) {
          toast.info("로그인을 먼저 해주세요🙋‍♂️");
          navigate("/login");
        } else {
          toast.warning("잠시 후 다시 시도해주세요🙇‍♂️");
          navigate("/");
        }
      });
  }, []);

  const handleChangeTags = (newChips: any) => {
    setTags(newChips);
  };

  const downloadImageHandler = (url: string) => {
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
      toast("제목을 2글자 이상 넣어주세요", { type: "error" });
      return;
    }

    try {
      const access_token = cookies.access_token;
      setImageLoading(true);
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/post/createimage`,
          { title },
          { headers: { Authorization: `Bearer ${access_token}` } }
        )
        .then((res: AxiosResponse) => {
          if (res.status === HttpStatusCode.Created) {
            setImage(res.data["image"]);
          }
          setImageLoading(false);
        })
        .catch((e: AxiosError) => {
          const res = e.response;
          const data = res?.data as ErrorResponse;

          toast.error(data.message);
        });
    } catch (e: any) {
      console.log(e);
    }
  };

  const onSubmitHandler = async () => {
    if (image === "") {
      toast.error("이미지를 먼저 만들어 주세요");
      return;
    }

    if (tags.length > 6) {
      toast.info("태그는 6개까지 가능합니다.");
      return;
    }

    try {
      setImageLoading(true);
      const access_token = cookies.access_token;
      await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/post`,
          { title, describe, image, tags },
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        )
        .then((res: AxiosResponse) => {
          if (res.status === HttpStatusCode.Created) {
            toast("꿈을 현실로 만들었습니다.🚀🚀🚀");
            setImageLoading(false);
            navigate("/");
          }
        })
        .catch((e: AxiosError) => {
          const res = e.response;
          const data = res?.data as ErrorResponse;

          toast.error(data.message);
        });
    } catch (e: any) {
      navigate("/");
    }
  };

  const enlargeImageHandler = () => {
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
                Dream Factory
              </Typography>
              <InputWrapper>
                <Typography style={{ fontSize: "18px" }}>
                  Dream Title
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  placeholder="여러분의 꿈을 들려주세요."
                  maxRows={4}
                  InputProps={{
                    sx: {
                      alignItems: "start",
                      height: "13vh",
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
                <Typography style={{ fontSize: "18px" }}>
                  Dream Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  placeholder="자세히 알려줄래요?"
                  maxRows={12}
                  InputProps={{
                    sx: {
                      alignItems: "start",
                      height: "32vh",
                      marginTop: "10px",
                      borderRadius: "20px",
                      backgroundColor: "#343434",
                      color: "white",
                    },
                  }}
                  inputProps={{ maxLength: 500 }}
                  error={describe.length > 499} // 입력 값이 최대 길이를 초과하면 오류 표시
                  helperText={
                    describe.length > 499
                      ? "최대 길이(500자)를 초과했습니다."
                      : "" // 오류 메시지
                  }
                  onChange={(e: any) => {
                    console.log(describe.length);
                    if (describe.length > 500) return;
                    setDescribe(e.target.value);
                  }}
                />
              </InputWrapper>
            </LeftContainerInnerMiddle>
            <LeftContainerInnerBottom>
              <InputWrapper>
                <Typography style={{ fontSize: "18px", paddingBottom: "10px" }}>
                  Dream Tag
                </Typography>
                <MuiChipsInput
                  value={tags}
                  onChange={handleChangeTags}
                  fullWidth
                  placeholder="꿈의 테그들을 달아주세요."
                  InputProps={{
                    sx: {
                      borderRadius: "20px",
                    },
                  }}
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
                <Modal open={open && image} onClose={handleClose}>
                  <Box
                    sx={{
                      ...style,
                      width: "50%",
                      height: "80%",
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${image}`}
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
                    src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${image}`}
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
  padding-top: 20px;
  height: 50%;
`;
const LeftContainerInnerBottom = styled.div`
  padding-top: 20px;
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
