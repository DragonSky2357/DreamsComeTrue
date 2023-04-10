import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import axios from "axios";

const EditProfile = () => {
  const [cookies, setCookie] = useCookies(["access_token"]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/user/edit`, {
        headers: { Authorization: `Bearer ${cookies.access_token}` },
      })
      .then((response) => {
        console.log(response);
      });
  });
  return <div>EditProfile</div>;
};

export default EditProfile;
