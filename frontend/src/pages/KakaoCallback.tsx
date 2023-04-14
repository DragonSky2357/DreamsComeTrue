import axios from "axios";
import React, { useEffect } from "react";

const KakaoCallback = (location: any) => {
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    try {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/auth/login/kakao`, {
          params: { code },
        })
        .then((response) => {
          console.log(response);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return <div>123</div>;
};

export default KakaoCallback;
