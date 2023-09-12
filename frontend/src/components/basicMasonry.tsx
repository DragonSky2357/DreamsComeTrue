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
import StarBorderIcon from "@mui/icons-material/StarBorder";
import moment from "moment";
import InfoIcon from "@mui/icons-material/Info";
import TitleBar from "./TitleBar/TitleBar";

const imageSize = ["w100&h150", "w200&h300", "w400&h500"];

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

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 800,
  bgcolor: "background.paper",
  borderRadius: "8px",
  padding: "10px",
  border: "none",
  color: "black",
  perspective: "2200px",
};

const Card = styled.div`
  cursor: pointer;
  transition: transform 2s ease-in-out;
  &:hover {
    transform: rotateX(100deg);
  }
`;

const Front = styled.div`
  position: absolute;
  padding-right: 10px;
  backface-visibility: hidden;
`;
const Back = styled(Front)`
  padding: 20px;
`;

export default function BasicMasonry(props: any) {
  const { post } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectPost, setSelectPost] = useState<any | null>(null);
  const [cookies, setCookie] = useCookies(["access_token"]);
  const [open, setOpen] = useState<boolean>(false);
  const [imageLoad, setImageLoad] = useState(false);
  const [accessToken] = useCookies(["access_token"]);

  return (
    <MainContainer>
      <ImageList variant="masonry" cols={6} gap={8}>
        {post.map((item: any, index: any) => {
          const size = imageSize[index % imageSize.length];

          return (
            <ImageListContainer>
              <ImageListItem
                key={item.image}
                className={`${classes.imageListItem} ${
                  hoveredItem === index ? classes.hovered : ""
                }`}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => {
                  setOpen(true);

                  axios
                    .get(`${process.env.REACT_APP_BASE_URL}/post/${item.id}`, {
                      headers: {
                        Authorization: `Bearer ${accessToken.access_token}`,
                      },
                    })
                    .then((res) => {
                      const data = res.data;
                      console.log(data);
                      setSelectPost(data);
                    });
                }}
              >
                <img
                  src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/images/${size}/${item.image}`}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

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
                      aria-label={`star ${item.title}`}
                    >
                      <StarBorderIcon />
                    </IconButton>
                  }
                  actionPosition="left"
                />
              </ImageListItem>
              <Modal
                open={open}
                onClose={() => {
                  setOpen(false);
                  setImageLoad(false);
                  setSelectPost(null);
                }}
                style={{
                  backgroundImage: `url(${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${selectPost?.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPositionY: "center",
                }}
              >
                <Box sx={style}>
                  {imageLoad && (
                    <Back>
                      {"DREAM"}
                      <Typography color="black" fontSize={20}>
                        {selectPost?.title}
                      </Typography>

                      <div style={{ paddingTop: 50 }}>
                        {"STORY"}
                        <Typography color="black" lineHeight={3}>
                          {selectPost?.describe}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          sx={{ width: 56, height: 56 }}
                          src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/avatar/${selectPost?.writer?.avatar}`}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "end",
                          }}
                        >
                          <Typography color="black" paddingLeft={2}>
                            {selectPost?.writer?.username}
                          </Typography>
                          <Typography color="black" paddingLeft={2}>
                            {"2023-09-10"}
                          </Typography>
                        </div>
                      </div>
                    </Back>
                  )}
                  <Card>
                    <Front>
                      <img
                        src={`${process.env.REACT_APP_AWS_S3_IMAGE_BASE_URL}/image/${selectPost?.image}`}
                        style={{ width: "100%" }}
                        loading="lazy"
                        onLoad={() => setImageLoad(true)}
                      />
                    </Front>
                  </Card>
                </Box>
              </Modal>
            </ImageListContainer>
          );
        })}
      </ImageList>
    </MainContainer>
  );
}

const MainContainer = styled(Box)``;
const ImageListContainer = styled(Box)``;
