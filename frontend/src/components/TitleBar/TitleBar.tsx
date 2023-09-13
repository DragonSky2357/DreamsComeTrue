import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import styled from "styled-components";

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { LoginState } from "../../state/LoginState";
import { Button } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import axios, { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
`;

const LogoWrapper = styled.div``;
const ToolWrapper = styled.nav`
  width: 50%;
`;
const LogInWrapper = styled.div``;

export default function TitleBar() {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useRecoilState(LoginState);
  const [search, setSearch] = useState("");
  const [cookie, setCookie, removeCookie] = useCookies(["access_token"]);

  const sampleLocation = useLocation();

  const submitHandler = (e: any) => {
    if (sampleLocation.pathname !== "/p/search") {
      navigate(`/p/search?s=${search}`);
    } else {
      e.preventDefault();
      navigate(`/p/search?s=${search}`);
    }
  };

  const onLogoutHandler = () => {
    const accessToken = cookie.access_token;

    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/logout`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          if (res.status === HttpStatusCode.Ok) {
            toast("Logout Success");

            console.log(loginState);
            navigate("/");
          }
        });
      setLoginState(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container style={{ display: "flex", alignItems: "center" }}>
      <LogoWrapper>
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ color: "#FFFFFF" }}
          >
            Dreams Come True
          </Typography>
        </Link>
      </LogoWrapper>
      <ToolWrapper style={{ display: "flex", justifyContent: "space-around" }}>
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ color: "#FFFFFF" }}
          >
            HOME
          </Typography>
        </Link>

        <Link to={"/dream"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ color: "#FFFFFF" }}
          >
            DREAMS
          </Typography>
        </Link>

        <Link to={"/create"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ color: "#FFFFFF" }}
          >
            CREATE
          </Typography>
        </Link>

        <Link to={"/"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ color: "#FFFFFF" }}
          >
            SEARCH
          </Typography>
        </Link>

        <Link to={"/"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ color: "#FFFFFF" }}
          >
            ABOUT
          </Typography>
        </Link>
      </ToolWrapper>

      <LogInWrapper>
        {loginState === true ? (
          <div style={{ display: "flex", textTransform: "uppercase" }}>
            <MenuItem onClick={() => navigate(`/${"dragonsky"}`)}>
              MyPage
            </MenuItem>
            <MenuItem onClick={onLogoutHandler}>LogOut</MenuItem>
          </div>
        ) : (
          <div style={{ display: "flex", textTransform: "uppercase" }}>
            <MenuItem onClick={() => navigate("/login")}>LogIn</MenuItem>
            <MenuItem onClick={() => navigate("/signup")}>SingUp</MenuItem>
          </div>
        )}
      </LogInWrapper>
    </Container>
  );
}