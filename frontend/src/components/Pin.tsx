import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Box, Button, Modal, Typography } from "@mui/material";
import axios from "axios";
import { useCookies } from "react-cookie";
import moment from "moment";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const Pin = (props: any) => {
  let { urls, imageId } = props;

  const [post, setPost] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [cookies, setCookie] = useCookies(["access_token"]);
  const dreamsHappiness = ["", "😱", "😨", "😑", "😙", "😆"];

  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setOpen(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${imageId}`)
      .then((response: any) => {
        setPost(response.data);
        console.log(response.data);
      });
  };
  const onFollowButtonHandler = async () => {
    const writer = post?.writer?.username;

    axios
      .patch(
        `${process.env.REACT_APP_BASE_URL}/user/u/${writer}/follow`,
        {},
        {
          headers: { Authorization: `Bearer ${cookies.access_token}` },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };

  const onStarClickHandler = async () => {
    const postId = post?.id;
    axios.patch(
      `${process.env.REACT_APP_BASE_URL}/post/${postId}/like`,
      {},
      { headers: { Authorization: `Bearer ${cookies.access_token}` } }
    );
  };
  const imageWidth = 400;
  const imageHeight = 400;

  return (
    <Wrapper>
      <Container>
        <ModalWrapper>
          <BoardImage
            src={urls}
            alt="pin"
            width={imageWidth}
            height={imageHeight}
            onClick={handleOpen}
          />

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalBox>
              <ModalImage
                src={urls}
                alt="pin"
                width={imageWidth}
                height={imageHeight}
              />
              <ModalContent>
                <ModalUserWrapper>
                  <h3>{"DREAMER "}</h3>
                  <ModalUser>
                    <Link to={`/${post?.writer?.username}`}>
                      <ModalUserName>{post?.writer?.username}</ModalUserName>
                    </Link>
                  </ModalUser>
                  <ModalPostStar onClick={onStarClickHandler}>
                    <StarBorderIcon
                      style={{ fontSize: "30px", color: "yellow" }}
                    />
                  </ModalPostStar>
                </ModalUserWrapper>
                <ModalFollowFollowerWrapper>
                  <ModalFollowerWrapper>
                    <h4>{"FOLLOWER"}</h4>
                    <ModalFollower>
                      <span>{"27K"}</span>
                    </ModalFollower>
                  </ModalFollowerWrapper>
                  <ModalFollowWrapper>
                    <h4>{"FOLLOW"}</h4>
                    <ModalFollow>
                      <span>{"27K"}</span>
                    </ModalFollow>
                  </ModalFollowWrapper>
                  <ModalFollowButtonWrapper>
                    <ModalFollowerButton
                      style={{ fontSize: "20px", color: "greenyellow" }}
                      color="secondary"
                      onClick={onFollowButtonHandler}
                    >
                      {"FOLLOW"}
                    </ModalFollowerButton>
                  </ModalFollowButtonWrapper>
                </ModalFollowFollowerWrapper>
                <ModalSimpleInfoWrapper>
                  <ModalHappiness>
                    <h4>Happiness</h4>
                    <span
                      style={{
                        paddingLeft: "10px",
                        textTransform: "uppercase",
                        fontSize: "25px",
                      }}
                    >
                      {dreamsHappiness[post?.rating]}
                    </span>
                  </ModalHappiness>
                  <ModalStar>
                    <h4>{"⭐"}</h4>
                    <span style={{ paddingLeft: "10px" }}>{15}</span>
                  </ModalStar>
                  <ModalCreatedDate>
                    <h4>CREATE</h4>
                    <span style={{ paddingLeft: "10px" }}>
                      {moment(post?.createdAt).format("YYYY.MM.DD. HH시")}
                    </span>
                  </ModalCreatedDate>
                </ModalSimpleInfoWrapper>
                <ModalTitle>
                  <h2>{post?.title}</h2>
                </ModalTitle>
                <ModalBodyText>
                  <h4>{post?.bodyText}</h4>
                </ModalBodyText>
                <ModalComment>
                  <h3>{"asdasdjalskdjaslk"}</h3>
                </ModalComment>
              </ModalContent>
            </ModalBox>
          </Modal>
        </ModalWrapper>
      </Container>
    </Wrapper>
  );
};

export default Pin;

const ModalBox = styled(Box)`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 800px;
  border: 3px inset dimgrey;
`;

const Wrapper = styled.div`
  display: flex;
  padding: 8px;
`;

const Container = styled.div`
  display: flex;
  align-itmes: center;
  box-sizing: border-box;
  cursor: pointer;
  width: 400px;
  img {
    display: flex;
    width: 100%;
    cursor: zoom-in;
    border-radius: 16px;
    object-fit: cover;
  }
`;
const ModalWrapper = styled.div``;

const BoardImage = styled.img`
  width: 400px;
  height: 400px;
`;
const ModalImage = styled.img`
  width: 50%;
  height: 100%;
  border-radius: 18px;
`;

const ModalContent = styled.div`
  width: 800px;
  padding: 20px;
  background-color: black;
`;

const ModalUserWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ModalUser = styled.div``;
const ModalUserName = styled.span`
  color: white;
  underline: none;
  font-weight: bold;
  font-size: 25px;
`;
const ModalPostStar = styled(Button)``;

const ModalFollowFollowerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
const ModalFollowerWrapper = styled.div`
  display: flex;
`;
const ModalFollowWrapper = styled.div`
  display: flex;
  padding-left: 20px;
`;

const ModalFollower = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;
const ModalFollow = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;
const ModalFollowButtonWrapper = styled.div`
  display: flex;
  padding-left: 20px;
`;

const ModalFollowerButton = styled(Button)`
  width: 50px;
`;
const ModalSimpleInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ModalHappiness = styled.div`
  display: flex;
  align-items: center;
`;
const ModalStar = styled.div`
  display: flex;
  align-items: center;
`;
const ModalCreatedDate = styled.div`
  display: flex;
  align-items: center;
`;

const ModalTitle = styled.div``;
const ModalBodyText = styled.div``;
const ModalComment = styled.div``;
