import { useState, useEffect, ChangeEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { FormControl, Input, Paper } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "../css/SignUp.css";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import PrimarySearchAppBar from "../components/TitleBar";

const Container = styled.div``;
const ContentWrapper = styled.div``;
const Contents = styled.div`
  width: 500px;
  margin: 0 auto;
`;
const UserAvatar = styled.div``;
const UserIDWrapper = styled.div``;

const UserNameWrapper = styled.div`
  padding-top: 30px;
`;
const UserPasswordWrapper = styled.div`
  padding-top: 30px;
`;
const UserPasswordConfirmWrapper = styled.div`
  padding-top: 30px;
`;
const UserEmailWrapper = styled.div`
  padding-top: 30px;
`;

const EditProfile = () => {
  const [avatar, setAvatar] = useState<any>(null);
  const [userid, setUserid] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [cookies, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((res) => {
        setAvatar(res.data.avatar);
        setUserid(res.data.userid);
        setUsername(res.data.username);
        setEmail(res.data.email);
      });
  }, []);

  const onSubmitHandler = () => {
    const formData = new FormData();

    formData.append("username", username);
    formData.append("email", email);

    if (avatar !== null) formData.append("avatar", avatar);
    if (password !== null && password == passwordConfirm)
      formData.append("password", password);

    axios({
      method: "patch",
      url: `${process.env.REACT_APP_BASE_URL}/user/edit`,
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    }).then((res) => {
      console.log(res);
      //navigate("/");
    });
  };
  return (
    <Container>
      <PrimarySearchAppBar />
      <ContentWrapper>
        <Contents>
          <UserAvatar>
            <Avatar alt="Remy Sharp" src={avatar} />
            <input
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const files = e.target.files;
                if (files !== null) setAvatar(files[0]);
              }}
            />
          </UserAvatar>
          <UserIDWrapper>
            <TextField disabled required label="id" value={userid} />
          </UserIDWrapper>
          <UserNameWrapper>
            <TextField
              required
              label="username"
              variant="outlined"
              value={username}
              defaultValue={"username"}
              onChange={(e) => setUsername(e.target.value)}
            />
          </UserNameWrapper>
          <UserPasswordWrapper>
            <TextField
              type="password"
              label="password"
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
            />
          </UserPasswordWrapper>
          <UserPasswordConfirmWrapper>
            <TextField
              type="password"
              label="passwordConfirm"
              variant="outlined"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </UserPasswordConfirmWrapper>
          <UserEmailWrapper>
            <TextField
              required
              label="email"
              variant="outlined"
              type="email"
              value={email}
              defaultValue={"email"}
              onChange={(e) => setEmail(e.target.value)}
            />
          </UserEmailWrapper>
        </Contents>
        <Button onClick={() => onSubmitHandler()}>완료</Button>
      </ContentWrapper>
    </Container>
  );
};

export default EditProfile;
