import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PostPage = () => {
  const location = useLocation();
  const dreamId = location.pathname.split("/")[2];

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${dreamId}`)
      .then((res) => {
        console.log(res);
      });
  }, []);
  return <Box>PostPage</Box>;
};

export default PostPage;
