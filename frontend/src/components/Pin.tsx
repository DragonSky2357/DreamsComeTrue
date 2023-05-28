import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Box, Button, Modal, Typography } from "@mui/material";
import axios from "axios";

const Pin = (props: any) => {
  let { urls, imageId } = props;

  const [post, setPost] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setOpen(true);
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${imageId}`)
      .then((response: any) => {
        setPost(response.data);
        console.log(response.data);
        console.log(post);
      });
  };

  const randomWidth = 400;
  const randomHeight = 400;

  return (
    <Wrapper>
      <Container>
        <ModalWrapper>
          <BoardImage
            src={urls}
            alt="pin"
            width={randomWidth}
            height={randomHeight}
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
                width={randomWidth}
                height={randomHeight}
              />
              <ModalContent>
                <ModalUserWrapper>
                  <h3>{"DREAMER "}</h3>
                  <ModalUser>
                    <Link to={`/${post?.writer?.username}`}>
                      <h3>{post?.writer?.username}</h3>
                    </Link>
                  </ModalUser>
                </ModalUserWrapper>
                <ModalFollowFollowerWrapper>
                  <ModalFollowerWrapper>
                    <h4>{"FOLLOWER"}</h4>
                    <ModalFollower>
                      <h4>34k</h4>
                    </ModalFollower>
                  </ModalFollowerWrapper>
                  <ModalFollowWrapper>
                    <h4>{"FOLLOW"}</h4>
                    <ModalFollow>
                      <h4>27k</h4>
                    </ModalFollow>
                  </ModalFollowWrapper>
                  <ModalFollowerButton>{"FOLLOW"}</ModalFollowerButton>
                </ModalFollowFollowerWrapper>
                <ModalStarCreatedWrapper>
                  <ModalHappiness>
                    <h4>Happiness</h4>
                    {post?.rating}
                  </ModalHappiness>
                  <ModalStar>
                    <h4>{"⭐"}</h4>
                    <h5>{15}</h5>
                  </ModalStar>
                  <ModalCreatedDate>
                    <h4>CREATE</h4>
                    {post?.createdAt}
                  </ModalCreatedDate>
                </ModalStarCreatedWrapper>
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
  padding: 20px;
  background-color: black;
`;

const ModalUserWrapper = styled.div`
  display: flex;
`;

const ModalUser = styled.div``;
const ModalFollowFollowerWrapper = styled.div`
  display: flex;
`;
const ModalFollowerWrapper = styled.div`
  display: flex;
`;
const ModalFollowWrapper = styled.div`
  display: flex;
  padding-left: 20px;
`;

const ModalFollower = styled.div`
  padding-left: 20px;
`;
const ModalFollow = styled.div`
  padding-left: 20px;
`;
const ModalFollowerButton = styled(Button)``;
const ModalStarCreatedWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ModalHappiness = styled.div``;
const ModalStar = styled.div``;
const ModalCreatedDate = styled.div``;

const ModalTitle = styled.div``;
const ModalBodyText = styled.div``;
const ModalComment = styled.div``;
