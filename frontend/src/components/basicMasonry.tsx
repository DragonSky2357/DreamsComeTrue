import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";
import {
  Avatar,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
  const [cookie] = useCookies(["access_token"]);
  const [hoveredItem, setHoveredItem] = useState(null);

  console.log(post);
  const onClickLikePostHandler = (postId: string) => {
    const access_token = cookie.access_token;

    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/post/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res: AxiosResponse) => {
        if (res.status == HttpStatusCode.Ok) {
          toast("❤️응원하는 메시지를 전달하게요❤️");
        }
      })
      .catch((error: AxiosResponse) => {
        if (error.status >= HttpStatusCode.InternalServerError) {
          toast("잠시 후 다시 시도해주세요🙇‍♂️");
        } else if (error.status >= HttpStatusCode.BadRequest) {
          toast(error.data["message"] + "❌");
        }
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
                        onClickLikePostHandler(item.id);
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
                <ProfileContainer>
                  <Avatar></Avatar>
                  <div>
                    <Typography>Dragonsky</Typography>
                  </div>
                  <div style={{ display: "flex" }}>
                    <VisibilityIcon />
                    <Typography>{item?.views ?? 0}</Typography>
                    <FavoriteIcon style={{ paddingLeft: "3px" }} />
                    <Typography>{item?.likes ?? 0}</Typography>
                  </div>
                </ProfileContainer>
              </ImageListItem>
            </ImageListContainer>
          );
        })}
      </Masonry>
    </MainContainer>
  );
}

const MainContainer = styled.div``;
const ImageListContainer = styled.div``;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 70%;
  left: 40%;
`;
