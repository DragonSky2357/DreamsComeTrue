import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Pin = (props: any) => {
  let { urls, imageId } = props;

  const randomWidth = Math.floor(Math.random() * (500 - 236)) + 236;
  const randomHeight = Math.floor(Math.random() * (500 - 236)) + 236;

  return (
    <Wrapper>
      <Container>
        <Link to={`/p/${imageId}`}>
          <img src={urls} alt="pin" width={randomWidth} height={randomHeight} />
        </Link>
      </Container>
    </Wrapper>
  );
};

export default Pin;

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

const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.5s ease;
  background-color: #008cba;
`;
const Text = styled.div`
  color: white;
  font-size: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
`;
