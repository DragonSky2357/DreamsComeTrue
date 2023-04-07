import React from "react";
import styled from "styled-components";
import Pin from "./Pin";
import "../css/Mainboard.css";

const Mainboard = (props: any) => {
  let { posts } = props;

  return (
    <Wrapper>
      <Container className="mainboard__container">
        {posts.map((post: any, index: any) => {
          let { imageUrl, id } = post;
          return <Pin key={index} urls={imageUrl} imageId={id} />;
        })}
        <Pin />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: white;
  display: flex;
  widht: 100%;
  height: 100%;
  maring-top: 15px;
  justify-content: center;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1500px;
  background-color: white;
`;

export default Mainboard;
