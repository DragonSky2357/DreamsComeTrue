import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PrimarySearchAppBar from "../components/TitleBar";
import { Container, IconButton, Skeleton, TextField } from "@mui/material";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import Mainboard from "../components/Mainbord";
import { debounce } from "lodash";

const Wrapper = styled.div`
  margin: 100px;
`;
const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  width: 60%;
  background-color: #ffffff;
`;

const ContentsWrapper = styled.div`
  margin-top: 100px;
`;

const SearchPage = () => {
  const [search, setSearch] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useCallback(
    debounce(async (search) => {
      try {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/post/search`, {
            params: { title: search, content: search },
          })
          .then((response: any) => {
            setPosts(response.data);
            console.log(response.data);
          });
      } catch (e) {
        console.log(e);
      }
    }, 500),
    []
  );

  const handleSearchChange = (event: any) => {
    const inputSearchTerm = event.target.value;
    setSearch(inputSearchTerm);

    // Debounce를 적용한 검색 함수를 호출합니다.
    debouncedSearch(inputSearchTerm);
  };

  return (
    <>
      <PrimarySearchAppBar />
      <Wrapper>
        <SearchWrapper>
          <SearchIcon
            style={{
              padding: "10px",
              width: "50px",
              height: "50px",
              color: "#000000",
            }}
          />
          <TextField
            type="search"
            id="search"
            fullWidth
            autoFocus
            InputProps={{ style: { fontSize: 30, border: "none" } }}
            onChange={handleSearchChange}
          />
        </SearchWrapper>
        <ContentsWrapper>
          {loading && <Skeleton width={210} height={118} />}
          <Mainboard posts={posts} />
        </ContentsWrapper>
      </Wrapper>
    </>
  );
};

export default SearchPage;
