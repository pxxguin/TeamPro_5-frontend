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



const HackathonPageSlide = ({  }) => {
    const postIds = new Array(6).fill(null).map((_, index) => `post${index + 1}`);
    const HackathonName = ["우아한테크코스", "UMC", "멋쟁이사자처럼","NEXTERS","AI Stages","K Hackathon"]
    // const explanation = [
    //   ""
    // ]
    const Link = [
      "https://www.woowacourse.io/",
      "https://linktr.ee/unimakeuschallenge",
      "https://likelion.net/school/kdt-blockchain-6th?utm_source=google&utm_medium=pmax&utm_campaign=kdtbcs06_google_pmax_conversion_2410_new&utm_content=ad_pmax&utm_term=new_2534_pcmo&gad_source=1&gclid=Cj0KCQiAlsy5BhDeARIsABRc6Zt2MnMi-W1Elp8FbDyzX6DfJN_LovrH6L4g4q7UQu4SbG6tDPkzSsoaAl50EALw_wcB",
      "https://nexters.co.kr/",
      "https://stages.ai/",
      "http://www.k-hackathon.com/"
    ]
    return (
      <StyledSwiper
        spaceBetween={30}
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
                    <span className="name">{HackathonName[index]}</span>
                  </NameProfession>
                  <ButtonGroup>
                    <a href={Link[index]} target="_blank" rel="noopener noreferrer">
                      <button className="aboutMe">참여하기</button>
                    </a>
                  </ButtonGroup>
                </CardContent>
              </Card>
            </CardGroup>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    );
  };
  
  export default HackathonPageSlide;

const StyledSwiper = styled(Swiper)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35em;
  width: 100%;
  max-width: 85%;
  padding: 20px 0;
  margin: 0 auto;
  position: relative;

  .swiper-pagination-bullet {
    background-color: #0a27a6;
  }

  .swiper-scrollbar {
    position: absolute;
    bottom: 8em; 
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
  gap: 1em;  
  margin-top : 5em;
//  justify-content: flex-start;  
`;

const Card = styled.div`
  position: relative;
  background: #fff;
  border-radius: 20px;
  margin: 0 0;
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
