import * as React from "react";
import axios, { HttpStatusCode } from "axios";
import { useState, useEffect } from "react";
import { Fab, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar/TitleBar";
import Mainboard from "../components/Mainbord";
import { useRecoilState } from "recoil";
import { LoginState } from "../state/LoginState";
import { useCookies } from "react-cookie";
import AddIcon from "@mui/icons-material/Add";

export default function DreamPage() {
  const [post, setPost] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginState, setLoginState] = useRecoilState(LoginState);
  const [cookies, setCookie] = useCookies(["access_token"]);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = cookies.access_token;

    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/check`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          if (res.status === HttpStatusCode.Ok) console.log(123);
        });
      //navigate("/login");
    } catch (e) {
      console.log(e);
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
    <div>
      <TitleBar />
      {loading && <Skeleton width={210} height={118} />}
      <Mainboard post={post} />
      <Fab
        color="primary"
        aria-label="추가"
        style={{
          position: "fixed",
          margin: 0,
          top: "auto",
          bottom: 20,
          right: 20,
          left: "auto",
        }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
