import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import styled from "styled-components";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { LoginState, LoginUser } from "../../state/LoginState";
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
  const [loginUser] = useRecoilState(LoginUser);
  const [search, setSearch] = useState("");
  const [cookie, setCookie, removeCookie] = useCookies(["access_token"]);

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

        <Link to={"/search"} style={{ textDecoration: "none" }}>
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

        <Link to={"/fortune"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ color: "#FFFFFF" }}
          >
            FORTUNE
          </Typography>
        </Link>
      </ToolWrapper>

      <LogInWrapper>
        {loginState === true ? (
          <div style={{ display: "flex", textTransform: "uppercase" }}>
            <MenuItem onClick={() => navigate(`/profile/${loginUser}`)}>
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
