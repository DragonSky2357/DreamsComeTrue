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
import { LoginState } from "../state/LoginState";
import { Button } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import axios from "axios";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
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
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const sampleLocation = useLocation();

  const submitHandler = (e: any) => {
    if (sampleLocation.pathname !== "/p/search") {
      navigate(`/p/search?s=${search}`);
    } else {
      e.preventDefault();
      navigate(`/p/search?s=${search}`);
    }
  };
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const onLogoutHandler = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    setLoginState(false);
    removeCookie("access_token");
    navigate("/");
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {loginState === true ? (
        <div>
          <MenuItem onClick={onLogoutHandler}>LogOut</MenuItem>
          <MenuItem onClick={() => navigate(`/${"dragonsky"}`)}>
            MyPager
          </MenuItem>
        </div>
      ) : (
        <div>
          <MenuItem onClick={() => navigate("/login")}>LogIn</MenuItem>
          <MenuItem onClick={() => navigate("/signup")}>SingUp</MenuItem>
        </div>
      )}
    </Menu>
  );

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
        {/* <Box component="form" onSubmit={submitHandler}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Search>
        </Box> */}

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
        <Link to={"/login"} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
            style={{ color: "#FFFFFF" }}
          >
            LOGIN
          </Typography>
        </Link>
      </LogInWrapper>
    </Container>
  );
}
