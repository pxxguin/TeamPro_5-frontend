import React from "react";
import styled from "styled-components";

import { Navigate } from "react-router-dom";
import MainCard from "../components/commmon/MainCard";

// import search from "../assets/icons/Header/search.png";
import Logo from "../assets/icons/Logo.png";
import copyright from "../assets/icons/Mainpage/copyright.png";
import searchImg from "../assets/icons/Header/search.png";

//slide
import Slide from "../components/MainPage/Slide";

const MainPage = () => {
  return (
    <MainContainer>
      {/* 메인 비디오  */}
      <MainPageWrapper>
        <VideoWrapper1>
          <Mainvideo autoPlay loop muted>
            <source src="/videos/Mainvideo.mp4" type="video/mp4" />
            비디오를 재생할 수 없습니다. 브라우저가 이 형식을 지원하지 않습니다.
          </Mainvideo>
          <Maintext>FolioFrame</Maintext>
        </VideoWrapper1>



        {/* 템플릿, 해커톤, 채용 */}
        <CardWrapper>
          <PointText4>
            <LogoImage src={Logo} alt="Logo" />
            FolioFrame에는 무엇이 있을까요?
          </PointText4>
          <MainCard />
        </CardWrapper>

        {/* 슬라이드 */}
        <SlideWrapper>
          <Slide />
        </SlideWrapper>
      </MainPageWrapper>

      {/* 마무리 */}
      <ThanksWrapper>
        <PointText4>FolioFrame</PointText4>
        <PointText5>
          여러분께 소개드립니다. "포폴만들조" 팀은 김태연, 김예은, 조수연,
          최현혜로 구성되어 있으며, 이번 팀 프로젝트1에서는 포트폴리오 제작을
          지원하는 웹사이트 개발을 목표로 하고 있습니다. <br></br>
          저희 팀은 사용자들이 더 나은 서비스를 통해 효과적으로 포트폴리오를
          작성할 수 있도록 최선을 다해 노력하고 있습니다. <br></br>
          앞으로도 지속적인 개선을 통해 더 높은 수준의 서비스를 제공하겠습니다.
        </PointText5>
        <CopyWrapper>
          {/* 구분선 */}
          <Bar></Bar>
          <CopyrightImage src={copyright} alt="저작권 표시" />
          {/* 메인 영상 저작권 */}
          <PointText5>
            평평한 디자인의 모션 그래픽 기하학적 배경_preview
          </PointText5>
          <PointText5>
            https://kr.freepik.com/free-video/motion-graphic-flat-design-geometric-background_3294690#fromView=search&page=1&position=7&uuid=995143c1-4b7b-489b-9250-c1fc132a130b
          </PointText5>
          {/* 공유 영상 저작권 */}
          <PointText5>소셜 미디어 중독자의 모션 그래픽_preview</PointText5>
          <PointText5>
            https://kr.freepik.com/free-video/motion-graphic-person-addicted-social-media_3294138#fromView=search&page=6&position=36&uuid=2c0106e1-e052-401a-8156-6a189382987a
          </PointText5>
          {/* 리소그래픽 영상 저작권 */}
          <PointText5>
            손으로 그린 리소그래프 요소 컬렉션의 모션 그래픽_preview
          </PointText5>
          <PointText5>
            https://kr.freepik.com/free-video/motion-graphic-hand-drawn-risograph-element-collection_3295172#fromView=search&page=1&position=8&uuid=2e65e734-07c3-4cfe-84c9-25c84cf5ea0a
          </PointText5>
          {/* 폰트 저작권 */}
          <PointText5>
            폰트
            https://copyright.keris.or.kr/wft/fntDwnldView?fntGrpId=GFT202408200000000000003
          </PointText5>
        </CopyWrapper>
      </ThanksWrapper>
    </MainContainer>
  );
};

export default MainPage;

//css wrapper
const MainContainer = styled.div`
  width: 85%;
  padding: 40px 40px;
  margin: 0 auto;
`;

const MainPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: -2em;
  top: 55%;
  transform: translateY(-50%);
  cursor: pointer;
`;

const VideoWrapper1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CardWrapper = styled.div`
  margin-top: 5em;
`;

const ThanksWrapper = styled.div`
  // margin : 0 6em;
  // margin : 0 6em;
  margin-top: 6em;
`;

const CopyWrapper = styled.div`
  // display : flex;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 50%;
  margin-top: 5em;
`;
const SlideWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 2em;
`;

//css video
const Mainvideo = styled.video`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 68.5em;
  margin-top: -3em;

  //영상 높이
  height: 25em;
  object-fit: cover;
`;

//css element

const SearchInput = styled.input`
  border-radius: 2em;
  border: 1px solid #d0d1d9;
  height: 3em;
  width: 100%;
  padding-right: 3em;
  outline: none;
  text-indent: 1em;
  &::placeholder {
    text-indent: 1em;
  }
`;

const LogoImage = styled.img`
  width: 1em;
  margin-top: -0.2em;
  padding-right: 0.5em;
`;

const CopyrightImage = styled.img`
  width: 1em;
  height: 1em;
  margin-top: 1em;
`;

const SearchIcon = styled.img`
  width: 50%;
`;

const Bar = styled.div`
  width: 100%;
  border: 1px solid #d0d1d9;
`;

//css text
const Maintext = styled.p`
  position: absolute;
  top: -1.5em;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;

  color: white;
  font-size: 5em;
  font-weight: 800;
  font-family: "OTF B";
`;

const PointText4 = styled.p`
  font-size: 2em;
  font-weight: 800;
  font-family: "OTF B";
  color: #0a27a6;
  display: flex;
`;
const PointText5 = styled.p`
  font-size: 0.8em;
  font-weight: 400;
  color: #000;
  font-family: "OTF R";
  display: flex;
`;
