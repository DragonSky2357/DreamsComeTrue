import React from "react";
import styled from "styled-components";

const Pin = (props: any) => {
  let { urls } = props;

  console.log(urls);
  return (
    <Wrapper>
      <Container>
        <img src={urls} alt="pin" />
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
