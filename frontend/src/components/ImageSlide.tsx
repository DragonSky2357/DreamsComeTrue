import React from "react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styled from "styled-components";

const ImageSliderWrapper = styled.div``;

const ImageSlide = () => {
  return (
    <ImageSliderWrapper>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        effect={"fade"}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            width="100%"
            height="500px"
            src="https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/e2da5bcb-2373-4bc3-9a64-3b2d1efb9810.png"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            width="100%"
            height="500px"
            src="https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/23cfd063-d337-4d8d-b5a3-c26aa0e049a4.png"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            width="100%"
            height="500px"
            src="https://dreams-come-true-bucket.s3.ap-northeast-2.amazonaws.com/image/70638dee-dd74-45d6-ac16-076d5800289b.png"
          />
        </SwiperSlide>
      </Swiper>
    </ImageSliderWrapper>
  );
};

export default ImageSlide;
