import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { oriProjects } from "../domain/startProgram";
import { getCurrentUser } from "../features/currentUser";
import { patchHits } from "../features/patchHits";

import Logo from "../../assets/icons/Logo.png";

const TemplateCard = ({ portfolioId, templateButton, isButton = true }) => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    //프롭스로 받은 포트폴리오 ID 사용해서 oriPortfolios에서 포트폴리오 데이터 가져오기
    const portfolio = oriProjects.get(portfolioId);
    if (portfolio) {
      setPortfolioData(portfolio);
    }
  }, [portfolioId]);

  const handleViewClick = () => {
    if (isButton === true) {
      console.log(currentUser);
      console.log("patchHits 불러옴.");
      if (currentUser && portfolioData) {
        patchHits(currentUser.id, portfolioId); // 조회수 증가 호출
      }

      // navigate(`/PortfolioDetailPage/${portfolioId}`);
      // if (portfolioId === 8) {
      //   navigate(`/PortfolioDetailPage2/${portfolioId}`);
      // } else if (portfolioId === 7) {
      //   navigate(`/PortfolioDetailPage3/${portfolioId}`);
      // } else {
      //   navigate(`/PortfolioDetailPage/${portfolioId}`);
      // }
    }
  };

  if (!portfolioData) {
    return <Loading>로딩 중...</Loading>;
  }

  return (
    <Card>
      <ImageContainer>
        <Image src={portfolioData.coverImage || Logo} alt="Template" />
      </ImageContainer>
      <TemplateName>{portfolioData.projectTitle || "빈 제목"}</TemplateName>
      <Description>{portfolioData.description || "빈 설명"}</Description>
      <Button
        onClick={() => {
          handleViewClick();
          if (portfolioData.projectTemplate === 2) {
            navigate(`/PortfolioDetailPage2/${portfolioId}`);
          } else if (portfolioData.projectTemplate === 3) {
            navigate(`/PortfolioDetailPage3/${portfolioId}`);
          } else {
            navigate(`/PortfolioDetailPage/${portfolioId}`);
          }
        }}
      >
        {templateButton}
      </Button>
    </Card>
  );
};

// // TemplateCard의 프롭타입
// TemplateCard.propTypes = {
//   templateName: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   templateThumnail: PropTypes.string.isRequired,
// };

export default TemplateCard;

const Loading = styled.div`
  display: flex;
  justify-content: center;

  font-size: 1vw;
  font-weight: bold;
`;

const Card = styled.div`
  //position: relative;
  width: 100%;
  height: 35vh; // 원래 17.625em
  background-color: #ffffff;
  // border: 0.125em solid #d0d1d9;
  border-radius: 1em;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const ImageContainer = styled.div`
  margin-top: 1vh;

  width: 18vw;
  height: 15vh; // 원래 8.855em
  background-color: #f9f9f9;

  border: 0.0625em solid #d0d1d9;
  border-radius: 1em;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 100%; // 원래 3.36em
  height: 2.58em;
  object-fit: contain;
`;

const TemplateName = styled.h3`
  margin-top: 0.5em; // 원래 1.25em
  margin-bottom: 0.5em;
  font-family: "OTF B";
  font-weight: 700;
  font-size: 1.2vw;
  line-height: 1.1875em;
  text-align: center;
  color: #000000;
`;

const Description = styled.div`
  font-family: "Inria Sans", sans-serif;
  font-weight: 300;
  font-size: 0.9vw;
  line-height: 1.0625em;
  text-align: center;
  color: #d0d1d9;
  width: 18vw;
  overflow: scroll;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Button = styled.button`
  margin-top: 1vh;
  margin-bottom: 1vh;

  width: 18vw;
  height: 4.5vh;
  background-color: #0a27a6;
  border-radius: 62.5em;
  border: none;
  color: #ffffff;
  font-family: "OTF B";
  font-weight: 700;
  font-size: 1em;
  line-height: 1.1875em;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #092091;
  }
`;
