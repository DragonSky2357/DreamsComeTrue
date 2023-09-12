import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Mainboard from "../components/Mainbord";
import PrimarySearchAppBar from "../components/TitleBar/TitleBar";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);

  const search = searchParams.get("s");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/search`, {
        params: { title: search, content: search },
      })
      .then((response: any) => {
        setPosts(response.data);
      });
  }, [search]);

  return (
    <div>
      <PrimarySearchAppBar />
      <Mainboard posts={posts} />
    </div>
  );
};

export default SearchPage;
