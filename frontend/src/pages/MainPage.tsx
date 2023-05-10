import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "axios";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Skeleton,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import Mainboard from "../components/Mainbord";
import { useRecoilState } from "recoil";
import { LoginState } from "../state/LoginState";
import ImageSlide from "../components/ImageSlide";
import Gallery from "react-photo-gallery";
import { useCookies } from "react-cookie";

export default function Main() {
  const [posts, setPost] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [loginState, setLoginState] = useRecoilState(LoginState);
  const [cookies, setCookie] = useCookies(["access_token"]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(loginState);

    if (loginState === false) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((response: any) => {
        setPost(response.data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <PrimarySearchAppBar />
      {loading && <Skeleton width={210} height={118} />}
      <Mainboard posts={posts} />
    </div>
  );
}
