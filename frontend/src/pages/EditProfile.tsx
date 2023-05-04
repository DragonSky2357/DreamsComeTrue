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
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { FormControl, Paper } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "../css/SignUp.css";
import { useCookies } from "react-cookie";
import styled from "styled-components";

const Wrapper = styled.div``;
const ContentWrapper = styled.div``;

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
    <Wrapper>
      <ContentWrapper>EditProfile</ContentWrapper>
    </Wrapper>
  );
};

export default EditProfile;
