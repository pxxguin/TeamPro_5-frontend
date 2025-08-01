import { templateInfo } from "../commmon/dummydata/templateInfo.jsx";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/scrollbar';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Navigation, Pagination, A11y, Autoplay, Scrollbar } from 'swiper/modules';
import Logo from "../../assets/icons/Logo.png";


const CreatePortfolioTemplate = ({ templates, setProjectTemplate  }) => {
    const [activeTemplateId, setActiveTemplateId] = useState(null); 

    function handleClick(templateId) {
        setActiveTemplateId(templateId);
        setProjectTemplate(templateId);
      }
    
    return(
        <>
        <MainWrapper>
        <StyledSwiper
        spaceBetween={100}
        slidesPerView={3}  
        modules={[ A11y, Scrollbar]}
        loop={templates.length > 3} 
        speed={400}
        scrollbar={{ draggable: true }} 
        // navigation
      >

        {templates.map((template) => (
          <SwiperSlide key={template.templateId}>
            <CardGroup>
              <Card backgroundImg={template.picture || Logo}> 
                <CardContent>
                  <NameProfession>
                    <span className="name">{template.templateName}</span>
                    <span className="profession">{template.description} </span>
                  </NameProfession>
                  <ButtonGroup>
                    <button   className={activeTemplateId === template.templateId ? 'active' : ''}
                    onClick={() => handleClick(template.templateId)}>선택하기</button>
                  </ButtonGroup>
                </CardContent>
              </Card>
            </CardGroup>
          </SwiperSlide>
        ))}
      </StyledSwiper>
            {/* <CreatePortfolioSlide templates={templateInfo}/> */}
        </MainWrapper>
        </>
       
    );
};

export default CreatePortfolioTemplate;

const MainWrapper = styled.div`
  width: 80%;
  padding: 40px 40px;
  margin: 0;

  border : 1.5px solid #d0d1d9;
  border-radius : 2em;
  height : 30em;
  
  display: flex;
  flex-direction: column;
  align-items: center;

`;


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
  &:active,
  &:focus,
  &.active {
    color: #fff;
    font-weight: bold;
    background: #0A27A6;
  }
}
`;

