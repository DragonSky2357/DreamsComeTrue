import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Pin = (props: any) => {
  let { urls, imageId } = props;

  return (
    <Wrapper>
      <Container>
        <Link to={`/p/${imageId}`}>
          <img src={urls} alt="pin" />
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
  width: 236px;
  img {
    display: flex;
    width: 100%;
    cursor: zoom-in;
    border-radius: 16px;
    object-fit: cover;
  }
`;
