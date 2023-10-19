import { useEffect, useState } from "react";
import TitleBar from "../components/TitleBar/TitleBar";
import styled from "styled-components";
import {
  Autocomplete,
  Avatar,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import axios, { HttpStatusCode } from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { MuiChipsInput } from "mui-chips-input";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

interface User {
  email?: string;
  avatar: string;
  username: string;
  introduce: string;
  tag: string[];
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies(["access_token"]);
  const accessToken = cookie.access_token;
  const [user, setUser] = useState<User>();
  const [tag, setTag] = useState([]);
  const [profileImageFile, setProfileImageFile] = useState("");
  const [profileImage, setProfileImage] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (newChips: any) => {
    setTag(newChips);
  };

  useEffect(() => {
    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/user/profile/edit`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res: any) => {
          setUser(res.data);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const changeHandler = (id: any, value: any) => {
    setUser((current: any) => {
      const object = { ...current };
      object[id] = value;
      return object;
    });
  };

  const profileImageChangeHandler = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      toast("잘못된 이미지 입니다.");
      return;
    }

    const img = e.target.files[0];
    setProfileImageFile(img);
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
  };

  const onSubmitHandler = () => {
    const formData = new FormData();
    formData.append("avatar", profileImageFile);
    formData.append("username", user?.username!);
    formData.append("introduce", user?.introduce!);
    tag.forEach((tag) => formData.append("tag", tag));
    setLoading(true);

    axios
      .patch(`${process.env.REACT_APP_BASE_URL}/user/profile/edit`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const res = response;
        if (
          res.status === HttpStatusCode.Ok ||
          res.status === HttpStatusCode.NoContent
        ) {
          setLoading(false);
          toast("회원 정보 수정 성공!!!");
          navigate("/");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <TitleBar />
      <Main>
        {user && (
          <MainTopContainer>
            <Typography style={{ fontSize: "40px" }}>
              Profile Information
            </Typography>
            <ProfileImageContainer>
              <Avatar
                alt="Remy Sharp"
                src={
                  profileImage
                    ? profileImage
                    : `${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/avatar/${user?.avatar}`
                }
                sx={{ width: 150, height: 150 }}
              />
              <Button
                variant="contained"
                color="secondary"
                component="label"
                style={{
                  width: 150,
                  height: 50,
                  marginLeft: 30,
                  borderRadius: 30,
                }}
              >
                프로필 사진 변경
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    profileImageChangeHandler(e);
                  }}
                />
              </Button>
            </ProfileImageContainer>
            <MainTopInnerContainer>
              <InputComponent
                label={"Email"}
                icon={EmailIcon}
                value={user.email}
                disabled
                changeHandler={changeHandler}
              />
              <InputComponent
                id="username"
                label={"Username"}
                icon={AccountCircle}
                value={user.username}
                placeholder="이름을 입력하세요"
                changeHandler={changeHandler}
              />
              <InputComponent
                id="introduce"
                label={"Introduce"}
                icon={ChatBubbleIcon}
                placeholder="안녕하세요 당신의 꿈을 소개할 DREAMER입니다."
                changeHandler={changeHandler}
              />
              <div>
                <InputLabel
                  style={{
                    color: "white",
                    fontSize: "26px",
                  }}
                >
                  Tag
                </InputLabel>
                <MuiChipsInput
                  value={tag}
                  onChange={handleChange}
                  sx={{
                    width: "800px",
                    backgroundColor: "grey",

                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                        borderRadius: "10px",
                      },
                    },
                    "& .MuiChipsInput-TextField": {
                      color: "white",
                    },
                    "& .MuiChipsInput-Chip": {
                      color: "white",
                    },
                    "& .MuiChipsInput-Chip-Editing": {
                      color: "white",
                    },
                  }}
                  inputProps={{ style: { color: "white" } }}
                />
              </div>
            </MainTopInnerContainer>
            {/* <MainBottomInnerContainer>
              <div style={{ display: "flex" }}></div>
              <InputComponent
                id="password"
                label={"New Password"}
                type="password"
                icon={AccountCircle}
                changeHandler={changeHandler}
              />
              <InputComponent
                id="passwordConfirm"
                label={"New Password Confirm"}
                type="password"
                icon={ChatBubbleIcon}
                changeHandler={changeHandler}
              />
            </MainBottomInnerContainer> */}
            <MainBottomContainer>
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={() => {
                  navigate("/");
                }}
              >
                Go Home
              </Button>
              <LoadingButton
                variant="contained"
                color="secondary"
                size="large"
                onClick={onSubmitHandler}
              >
                Update Profile
              </LoadingButton>
            </MainBottomContainer>
            <Autocomplete
              id="tag"
              options={[]}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="freeSolo"
                  placeholder="Favorites"
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                        borderRadius: "10px",
                      },
                    },
                  }}
                  inputProps={{ style: { color: "white" } }}
                />
              )}
            />
          </MainTopContainer>
        )}
      </Main>
    </div>
  );
};

interface InputComponent {
  id?: string;
  label: string;
  type?: string;
  icon: any;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  changeHandler: any;
}
const InputComponent = (props: InputComponent) => {
  const { id, label, type, icon, placeholder, value, disabled, changeHandler } =
    props;

  return (
    <FormControl variant="standard">
      <InputLabel style={{ color: "white", fontSize: "26px" }}>
        {label}
      </InputLabel>
      <TextField
        sx={{
          marginTop: "60px",
          fontSize: "20px",
          width: "800px",
          backgroundColor: "grey",
          borderRadius: "10px",
          borderColor: "white",
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000000",
          },
          "&::placeholder": {
            color: "black",
            opacity: 1,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
              borderRadius: "10px",
            },
          },
        }}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        inputProps={{ style: { color: "white" } }}
        onChange={(e) => {
          changeHandler(id, e.target.value);
        }}
      />
    </FormControl>
  );
};

const Main = styled.div`
  width: 800px;
  height: 100vh;
  padding: 30px;
  margin: 0 auto;
`;

const MainTopContainer = styled.div`
  height: 100%;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 30px;
`;

const MainTopInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 60%;
`;

const MainBottomInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MainBottomContainer = styled.div`
  display: flex;
  height: 100px;
  align-items: center;
  justify-content: space-around;
`;

export default EditProfile;
