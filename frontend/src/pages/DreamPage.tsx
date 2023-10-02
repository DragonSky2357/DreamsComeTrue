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
import { toast } from "react-toastify";
import BasicMasonry from "../components/basicMasonry";

export default function DreamPage() {
  const [post, setPost] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginState, setLoginState] = useRecoilState(LoginState);
  const [cookies, setCookie] = useCookies(["access_token"]);

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = cookies.access_token;

    if (!accessToken) {
      toast("먼저 로그인을 해주세요");
      navigate("/login");
    }

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        if (err.response.data["statusCode"] === HttpStatusCode.Unauthorized) {
          toast("먼저 로그인을 해주세요");
          navigate("/login");
        }
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((response: any) => {
        setPost(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
    setLoading(false);
  }, []);

  return (
    <div>
      <TitleBar />
      {loading && <Skeleton width={210} height={118} />}
      <BasicMasonry post={post} />
    </div>
  );
}
