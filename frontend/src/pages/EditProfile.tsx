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
const Contents = styled.div``;
const UserAvatar = styled.div``;
const UserNameWrapper = styled.div``;
const UserPasswordWrapper = styled.div``;
const UserPasswordConfirmWrapper = styled.div``;
const UserEmailWrapper = styled.div``;

const EditProfile = () => {
  const [cookies, setCookie] = useCookies(["access_token"]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((response) => {
        console.log(response);
      });
  });
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
          <UserNameWrapper>
            <TextField label="username" variant="outlined" />
          </UserNameWrapper>
          <UserPasswordWrapper>
            <TextField label="password" variant="outlined" />
          </UserPasswordWrapper>
          <UserPasswordConfirmWrapper>
            <TextField label="passwordConfirm" variant="outlined" />
          </UserPasswordConfirmWrapper>
          <UserEmailWrapper>
            <TextField label="email" variant="outlined" type="email" />
          </UserEmailWrapper>
        </Contents>
      </ContentWrapper>
    </Container>
  );
};

export default EditProfile;
