import { useState, useEffect } from "react";
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
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";

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
  const [user, setUser] = useState<any>(null);
  const [cookies, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      });
  }, []);

  const onSubmitHandler = () => {
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/user/edit`,
        { user },
        {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        }
      )
      .then((res) => {
        navigate("/");
      });
  };
  return (
    <Container>
      <PrimarySearchAppBar />
      <ContentWrapper>
        <Contents>
          <UserAvatar>
            <Avatar
              alt="Remy Sharp"
              src="https://static.vecteezy.com/system/resources/previews/002/002/403/original/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
            />
          </UserAvatar>
          <UserIDWrapper>
            <TextField disabled required label="id" value={user?.id} />
          </UserIDWrapper>
          <UserNameWrapper>
            <TextField
              required
              label="username"
              variant="outlined"
              value={user?.username}
              defaultValue={"username"}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </UserNameWrapper>
          <UserPasswordWrapper>
            <TextField
              label="password"
              variant="outlined"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </UserPasswordWrapper>
          <UserPasswordConfirmWrapper>
            <TextField
              label="passwordConfirm"
              variant="outlined"
              onChange={(e) =>
                setUser({ ...user, comfirmPassword: e.target.value })
              }
            />
          </UserPasswordConfirmWrapper>
          <UserEmailWrapper>
            <TextField
              required
              label="email"
              variant="outlined"
              type="email"
              value={user?.email}
              defaultValue={"email"}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </UserEmailWrapper>
        </Contents>
        <Button onClick={() => onSubmitHandler()}>완료</Button>
      </ContentWrapper>
    </Container>
  );
};

export default EditProfile;
