import axios from "axios";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { LoginState } from "../state/LoginState";
import { Navigate, useNavigate } from "react-router-dom";

const KakaoCallback = (location: any) => {
  const [loginState, setLoginState] = useRecoilState(LoginState);
  const [cookies, setCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/login/kakao`, {
          params: { code },
        })
        .then((response) => {
          console.log(response);
          setCookie("access_token", response.data.access_token, { path: "/" });
          setLoginState(true);
          navigate("/");
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return <div>123</div>;
};

export default KakaoCallback;
