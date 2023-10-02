import React, { useEffect, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { LoginState } from "../state/LoginState";
import { Button, TextField, Link, Box, Grid, Typography } from "@mui/material";

interface IFormInput {
  email: String;
  password: String;
}

const schema = yup.object().shape({
  email: yup.string().email().required("이메일을 입력해주세요").min(5).max(30),
  password: yup.string().required("비밀번호를 입력해주세요").min(6).max(30),
});

export default function SignIn() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [, setAccessToken] = useCookies(["access_token"]);
  const [, setRefreshToken] = useCookies(["refresh_token"]);
  const [, setLoginState] = useRecoilState(LoginState);
  const [image, setImage] = useState<string>("");

  const navigate = useNavigate();

  const REST_API_KEY = process.env.REACT_APP_KAKAO_LOGIN_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_LOGIN_CALLBACK_URL;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/random-image`)
      .then((res) => {
        const image = res.data["image"];
        setImage(image);
      });
  }, []);
  const onSubmitHandler = async (data: IFormInput) => {
    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/login`, data)
      .then(async (res) => {
        if (res.status === HttpStatusCode.Created) {
          setAccessToken("access_token", res.data["access_token"]);
          setRefreshToken("refresh_token", res.data["refresh_token"]);
          setLoginState(true);
          navigate("/");
        }
      })
      .catch((e) => {
        const res = e.response;

        if (res.status === HttpStatusCode.BadRequest) {
          toast(res.data["message"]);
        }
        const error = e?.response?.data?.error;
      });
  };

  const onInvalid = (errors: any) => console.error(errors);

  const onClickKakaoLogin = async () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Grid component="main" bgcolor={"white"} height={"100vh"} display={"flex"}>
      <Box width={"50%"}>
        <img
          src={process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL + "/image/" + image}
          alt="image"
          width="100%"
          height="100%"
          loading="lazy"
          style={{ objectFit: "cover" }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "auto auto",
        }}
      >
        <Typography component="h1" variant="h5" style={{ color: "black" }}>
          SIGN IN
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmitHandler, onInvalid)}
          sx={{ marginTop: 3 }}
        >
          <TextField
            id="email"
            label="email"
            autoComplete="email"
            margin="normal"
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            required
            fullWidth
            autoFocus
            error={!!errors.email}
            {...register("email")}
            style={{ width: "300px" }}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
          <TextField
            id="password"
            label="Password"
            type="password"
            margin="normal"
            autoComplete="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            required
            fullWidth
            error={!!errors.password}
            {...register("password")}
            style={{ width: "300px" }}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>

          <Box
            sx={{
              marginTop: 3,
            }}
          >
            <Button fullWidth type="submit" variant="outlined">
              Sign In
            </Button>
          </Box>
        </Box>
        <Link href="/signup">
          <Button
            sx={{ marginTop: 2, width: "300px" }}
            fullWidth
            variant="contained"
          >
            Sign Up
          </Button>
        </Link>
      </Box>
    </Grid>
  );
}
