import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Masonry from "@mui/lab/Masonry";
import {
  Avatar,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios, { HttpStatusCode } from "axios";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const useStyles: any = makeStyles((theme) => ({
  imageListItem: {
    position: "relative", // 프로필 사진 위치 지정을 위해 필요
    opacity: "0.85",
  },
  userInfo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",

    // 프로필 사진의 스타일
  },
  hovered: {
    opacity: 1,
    transition: "opacity 0.3s ease-in-out",
  },
}));

export default function BasicMasonry(props: any) {
  const { post } = props;
  const navigate = useNavigate();
  const classes = useStyles();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectPost, setSelectPost] = useState<any | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [imageLoad, setImageLoad] = useState(false);
  const [accessToken] = useCookies(["access_token"]);

  const likePostHandler = (imageId: string) => {
    const access_token = accessToken.access_token;

    console.log(access_token);
    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/post/${imageId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res: any) => {
        console.log(res);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  return (
    <MainContainer>
      <Masonry columns={5} spacing={2}>
        {post.map((item: any, index: any) => {
          return (
            <ImageListContainer key={index}>
              <ImageListItem
                key={item.image}
                className={`${classes.imageListItem} ${
                  hoveredItem === index ? classes.hovered : ""
                }`}
              >
                <ImageListItemBar
                  sx={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  title={item.title}
                  position="top"
                  actionIcon={
                    <IconButton
                      sx={{ color: "white" }}
                      onClick={() => {
                        likePostHandler(item.id);
                      }}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  }
                  actionPosition="left"
                />

                <img
                  src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${item.image}`}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    navigate(`/dream/${item.id}`);
                  }}
                />
              </ImageListItem>
            </ImageListContainer>
          );
        })}
      </Masonry>
    </MainContainer>
  );
}

const MainContainer = styled(Box)``;
const ImageListContainer = styled(Box)``;
