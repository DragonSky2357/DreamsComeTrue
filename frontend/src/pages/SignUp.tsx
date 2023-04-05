import * as React from "react";
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

const theme = createTheme();

interface IFormInput {
  userid: String;
  username: String;
  email: String;
  password: String;
  passwordConfirm: String;
}

const schema = yup.object().shape({
  userid: yup.string().required("Please enter your userid").min(5).max(30),
  username: yup.string().required("Please enter you username").min(2).max(30),
  email: yup.string().email().required("Please enter your email"),
  password: yup.string().required("Please enter your password").min(6).max(30),
  passwordConfirm: yup
    .string()
    .required("Please enter your confirm password")
    .oneOf([yup.ref("password")], "Password must match"),
});

export default function SignUp() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmitHandler = async (data: any) => {
    const { userid, username, password, email } = data;
    const userData = { userid, username, password, email };

    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/user/signup`, userData)
      .then((response) => {
        if (response.data.success) {
          console.log("sucess");
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  const onInvalid = (errors: any) => console.error(errors);

  // const onSubmitHandler: any = (e: any) => {

  //   const data = new FormData(e.currentTarget);

  //   const createUser = {
  //     userid: data.get("userid"),
  //     username: data.get("username"),
  //     email: data.get("email"),
  //     password: data.get("password"),
  //   };

  //   const { userid, username, email, password } = createUser;

  //   if (password === data.get("passwordConfirm")) {
  //     onHandlerPost(createUser);
  //   }
  // };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <form onSubmit={handleSubmit(onSubmitHandler, onInvalid)}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userid"
                label="userid"
                autoComplete="userid"
                autoFocus
                placeholder="userid"
                defaultValue={""}
                className={`form-control ${errors.userid ? "is-invalid" : ""}`}
                error={!!errors.userid}
                {...register("userid")}
              />
              <div className="invalid-feedback">{errors.userid?.message}</div>

              <TextField
                margin="normal"
                required
                fullWidth
                label="username"
                type="text"
                id="username"
                autoComplete="current-password"
                placeholder="username"
                defaultValue={""}
                error={!!errors.username}
                {...register("username")}
              />
              <div className="invalid-feedback">{errors.username?.message}</div>
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="password"
                type="password"
                autoComplete="password"
                placeholder="password"
                defaultValue={""}
                error={!!errors.password}
                {...register("password")}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
              <TextField
                margin="normal"
                required
                fullWidth
                id="passwordConfirm"
                label="passwordConfirm"
                type="password"
                autoComplete="current-password"
                placeholder="passwordConfirm"
                defaultValue={""}
                error={!!errors.passwordConfirm}
                {...register("passwordConfirm")}
              />
              <div className="invalid-feedback">
                {errors.passwordConfirm?.message}
              </div>
              <TextField
                margin="normal"
                required
                fullWidth
                label="email"
                type="email"
                id="email"
                autoComplete="current-password"
                placeholder="email"
                defaultValue={""}
                error={!!errors.email}
                {...register("email")}
              />
              <div className="invalid-feedback">{errors.email?.message}</div>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/e2da5bcb-2373-4bc3-9a64-3b2d1efb9810.png)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
    </ThemeProvider>
  );
}
