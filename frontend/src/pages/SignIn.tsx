import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, TextField, Link, Box, Typography } from "@mui/material";
import { ErrorResponse } from "../constants/Response";
import { useRecoilState } from "recoil";
import { LoginState, LoginUser } from "../state/LoginState";

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
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [, setAccessToken] = useCookies(["access_token"]);
  const [, setRefreshToken] = useCookies(["refresh_token"]);
  const [, setLoginState] = useRecoilState(LoginState);
  const [, setLoginUserState] = useRecoilState(LoginUser);
  const [image, setImage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/random-image`)
      .then((res: AxiosResponse) => {
        const image = res.data["image"];
        setImage(image);
      });
  }, []);

  const onSubmitHandler = async (formData: IFormInput) => {
    const data = {
      ...formData,
    };

    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/login`, data)
      .then(async (res: AxiosResponse) => {
        if (res.status === HttpStatusCode.Ok) {
          const data = res.data;

          setAccessToken("access_token", data["access_token"]);
          setRefreshToken("refresh_token", data["refresh_token"]);
          setLoginState(true);
          setLoginUserState(data["username"]);
          navigate("/");
        }
      })
      .catch((e: AxiosError) => {
        const res = e.response;
        const data = res?.data as ErrorResponse;

        if (res?.status === HttpStatusCode.Unauthorized) {
          toast(data["message"] + "🚨", {
            type: "error",
          });
        } else {
          toast("잠시 후 다시 시도해주세요🙇‍♂️", {
            type: "warning",
          });
        }
      });
  };

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <Box component="main" bgcolor={"white"} height={"100vh"} display={"flex"}>
      <Box width={"60%"}>
        <img
          src={process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL + "/image/" + image}
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
        <Typography variant="h4" style={{ color: "black" }}>
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
            type="email"
            autoComplete="email"
            required
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            style={{ width: "300px" }}
            margin="normal"
            autoFocus
            error={!!errors.email}
            {...register("email")}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="password"
            required
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            style={{ width: "300px" }}
            margin="normal"
            error={!!errors.password}
            {...register("password")}
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
    </Box>
  );
}
