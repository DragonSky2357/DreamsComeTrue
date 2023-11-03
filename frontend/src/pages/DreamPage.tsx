import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TitleBar from "../components/TitleBar/TitleBar";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { ErrorResponse } from "../constants/Response";
import BasicMasonry from "../components/BasicMasonry";

interface Writer {
  username: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
  image: string;
  views_count: number;
  likes_count: number;
  writer: Writer;
}

export default function DreamPage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]);
  const [post, setPost] = useState<Post[]>([]);

  useEffect(() => {
    const accessToken = cookies.access_token;

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/auth/check`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res: AxiosResponse) => {})
      .catch((e: AxiosError) => {
        const res = e.response;

        if (res?.status === HttpStatusCode.Unauthorized) {
          toast.info("로그인을 먼저 해주세요");
          navigate("/login");
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((res: AxiosResponse) => {
        const data = res.data;
        console.log(data);

        setPost(data);
      })
      .catch((e: AxiosError) => {
        const res = e.response;
        const data = res?.data as ErrorResponse;

        if (res?.status === HttpStatusCode.Unauthorized) {
          toast.error("권한이 없습니다." + "🚨");
        } else {
          toast.warning("잠시 후 다시 시도해주세요🙇‍♂️");
        }
      });
  }, []);

  return (
    <div>
      <TitleBar />
      {<BasicMasonry post={post} />}
    </div>
  );
}
