import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { LoginState, LoginUser } from "../state/LoginState";

const theme = createTheme();

interface IFormInput {
  userid: String;
  password: String;
}

const schema = yup.object().shape({
  userid: yup.string().required("Please enter your userid").min(5).max(30),
  password: yup.string().required("Please enter your password").min(6).max(30),
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

  const [cookies, setCookie] = useCookies(["access_token"]);
  const [loginState, setLoginState] = useRecoilState(LoginState);
  const [loginUser, setLoginUser] = useRecoilState(LoginUser);
  const navigate = useNavigate();

  const onSubmitHandler = async (data: any) => {
    const { userid, password } = data;
    const userData = { userid, password };

    await axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/login`, userData)
      .then(async (response) => {
        console.log(response);
        if (response.data.access_token) {
          toast("Success Login");
          setCookie("access_token", response.data.access_token);
          setLoginState(true);

          await axios
            .get(`${process.env.REACT_APP_BASE_URL}/user/LoginUser`, {
              headers: {
                Authorization: `Bearer ${response.data.access_token}`,
              },
            })
            .then((response) => {
              console.log(response.data);
              setLoginUser(response.data.username);
            });
          navigate("/");
        }
      });
  };

  const onInvalid = (errors: any) => console.error(errors);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/70638dee-dd74-45d6-ac16-076d5800289b.png)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
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
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmitHandler, onInvalid)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="userid"
                label="userid"
                autoComplete="userid"
                autoFocus
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
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                defaultValue={""}
                className={`form-control ${errors.userid ? "is-invalid" : ""}`}
                error={!!errors.userid}
                {...register("password")}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
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
                Sign In
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
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
