import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/scrollbar';
import React from 'react';
import styled from 'styled-components';
import { Navigation, Pagination, A11y, Autoplay, Scrollbar } from 'swiper/modules';
import Logo from "../../assets/icons/Logo.png";



const CreatePortfolioSlide = ({  }) => {
    const postIds = new Array(6).fill(null).map((_, index) => `post${index + 1}`);

    return (
      <StyledSwiper
        spaceBetween={100}
        slidesPerView={3}  
        modules={[ A11y, Scrollbar]}
        loop={postIds.length > 3} 
        speed={400}
        scrollbar={{ draggable: true }} 
        // navigation
      >

        {postIds.map((postId, index) => (
          <SwiperSlide key={postId}>
            <CardGroup>
              <Card backgroundImg={Logo}>
                <CardContent>
                  <NameProfession>
                    <span className="name">템플릿 이름</span>
                    <span className="profession">템플릿 설명 </span>
                  </NameProfession>
                  <ButtonGroup>
                    <button className="aboutMe">선택하기</button>
                  </ButtonGroup>
                </CardContent>
              </Card>
            </CardGroup>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    );
  };
  
  export default CreatePortfolioSlide;

const StyledSwiper = styled(Swiper)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35em;
  width: 100%;
  max-width: 85%;
  padding: 20px 0em;
  margin: 0 auto;
  position: relative;

  .swiper-pagination-bullet {
    background-color: #0a27a6;
  }
 
  .swiper-scrollbar {
    position: absolute;
    bottom: 0px; 
    left: 10%;
    width: 80%;
    height: 8px;
    background-color: #ddd;
    border-radius: 5px;
  }

  .swiper-scrollbar-drag {
    background-color: #0A27A6;
    border-radius: 5px;
  }
`;


const CardGroup = styled.div`
  display: flex;
  margin-left : -2em;
`;

const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 20px;
  margin: 20px 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  height: 20em; 

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 60%; 
    width: 100%;
    background-image: url(${props => props.backgroundImg});
    background-size: contain; 
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 20px 20px 0 0;
    z-index: 1;
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px;
  position: relative;
  z-index: 100;
  width : 12em;
  
`;

const NameProfession = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  margin-top: 8em;
  flex-grow: 1; 

  .name {
    font-size: 20px;
    font-weight: 600;
    color: #0A27A6;
    font-family: "OTF B";
    height: 3em;  
    display: flex;
    justify-content: center;
    align-items: center; 
  }

  .profession {
    font-size: 15px;
    font-weight: 500;
    font-family: "OTF R";    
    margin-top: -10px;
  }
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 10px;

  button {
    background: #fff;
    outline: none;
    border: 1px solid #0A27A6;
    color: #0A27A6;
    padding: 9px 25px;
    border-radius: 20px;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
    font-family: "OTF B";

    &:hover {
      background: #0A27A6;
      color : #fff;
    }
  }
`;
