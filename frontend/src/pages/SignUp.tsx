import "../css/SignUp.css";
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, TextField, Link, Grid, Box, Typography } from "@mui/material";
import { ErrorResponse } from "../constants/Response";

interface IFormInput {
  email: String;
  username: String;
  password: String;
  passwordConfirm: String;
}

const schema = yup.object().shape({
  email: yup.string().email().required("Please enter your email"),
  username: yup.string().required("Please enter you username").min(2).max(30),
  password: yup.string().required("Please enter your password").min(6).max(30),
  passwordConfirm: yup
    .string()
    .required("Please enter your confirm password")
    .oneOf([yup.ref("password")], "Password must match"),
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const [image, setImage] = useState<string>("");

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
      email: formData.email,
      username: formData.username,
      password: formData.password,
    };

    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/signup`, data)
      .then((res: AxiosResponse) => {
        if (res.status === HttpStatusCode.Created) {
          toast("회원 가입 성공 🎉🎉🎉");
          navigate("/login");
        }
      })
      .catch((e: AxiosError) => {
        const res = e.response;
        const data = res?.data as ErrorResponse;

        if (data.statusCode === HttpStatusCode.Conflict) {
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

  return (
    <Grid component="main" bgcolor={"white"} height={"100vh"} display={"flex"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "auto auto",
          width: "50%",
        }}
      >
        <Typography component="h1" variant="h5" style={{ color: "black" }}>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmitHandler)} style={{ width: "50%" }}>
          <TextField
            id="email"
            label="email"
            type="email"
            margin="normal"
            defaultValue={""}
            placeholder="email"
            required
            fullWidth
            error={!!errors.email}
            {...register("email")}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>

          <TextField
            id="username"
            label="username"
            type="text"
            margin="normal"
            defaultValue={""}
            placeholder="username"
            required
            fullWidth
            error={!!errors.username}
            {...register("username")}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
          <TextField
            id="password"
            label="password"
            type="password"
            autoComplete="password"
            placeholder="password"
            margin="normal"
            defaultValue={""}
            required
            fullWidth
            error={!!errors.password}
            {...register("password")}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
          <TextField
            id="passwordConfirm"
            label="passwordConfirm"
            type="password"
            placeholder="passwordConfirm"
            margin="normal"
            required
            fullWidth
            defaultValue={""}
            error={!!errors.passwordConfirm}
            {...register("passwordConfirm")}
          />
          <div className="invalid-feedback">
            {errors.passwordConfirm?.message}
          </div>

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link href="/login">{"로그인 페이지 이동"}</Link>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Box width={"50%"}>
        <img
          src={process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL + "/image/" + image}
          alt=""
          width={"100%"}
          height={"100%"}
          loading="lazy"
          style={{ objectFit: "cover" }}
        />
      </Box>
    </Grid>
  );
}
