import * as React from "react";
import axios, { HttpStatusCode } from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar/TitleBar";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import BasicMasonry from "../components/BasicMasonry";

export default function DreamPage() {
  const [post, setPost] = useState<any[]>([]);
  const [cookies] = useCookies(["access_token"]);

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
  }, []);

  return (
    <div>
      <TitleBar />
      <BasicMasonry post={post} />
    </div>
  );
}
