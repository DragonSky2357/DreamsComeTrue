import axios from "axios";
import React, { useEffect } from "react";

const MainPage = () => {
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post`)
      .then((response: any) => {
        console.log(response.data);
      });
  }, []);

  return <div>MainPage</div>;
};

export default MainPage;
