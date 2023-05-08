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
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PrimarySearchAppBar from "../components/PrimarySearchAppBar";
import Mainboard from "../components/Mainbord";
import { useRecoilState } from "recoil";
import { LoginState } from "../state/LoginState";
import ImageSlide from "../components/ImageSlide";
import Gallery from "react-photo-gallery";

export default function Main() {
  const [posts, setPost] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loginState, setLoginState] = useRecoilState(LoginState);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(loginState);

    if (loginState === false) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post`)
      .then((response: any) => {
        setPost(response.data);
        console.log(response.data);
      });
  }, []);

  return (
    <div className="app">
      <PrimarySearchAppBar />
      <Mainboard posts={posts} />
    </div>
  );
}
