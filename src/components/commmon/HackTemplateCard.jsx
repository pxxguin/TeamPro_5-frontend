import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { oriHackathons } from "../domain/startProgram";
import { getCurrentUser } from "../features/currentUser";
import { patchHackHits } from "../features/patchHackHits";

import Logo from "../../assets/icons/Logo.png";

const HackTemplateCard = ({ hackId, templateButton }) => {
  const navigate = useNavigate();
  const [hackData, setHackData] = useState(null);
  const currentUser = getCurrentUser(); // 현재 사용자 정보 가져오기

  useEffect(() => {
    // 해커톤 정보를 hackId로 가져옴
    const hackathon = oriHackathons.get(hackId);
    if (hackathon) {
      setHackData(hackathon);
    }
  }, [hackId]);

  const handleViewClick = () => {
    console.log(currentUser);
    console.log("patchHits 불러옴.");
    if (currentUser && hackData) {
      patchHackHits(currentUser.id, hackId);
    }

    // 해커톤 상세 페이지로 이동
    navigate(`/HackathonDetailPage/${hackId}`);
    // navigate(`/PortfolioDetailPage2/${portfolioId}`);
  };

  if (!hackData) {
    return <Loading>로딩 중...</Loading>; // 로딩 상태 표시
  }

  return (
    <Card>
      <ImageContainer>
        <Image src={hackData.coverImage || Logo} alt="Hackathon" />
      </ImageContainer>
      <TemplateName>{hackData.hackName || "빈 제목"}</TemplateName>
      <Description>{hackData.description || "빈 설명"}</Description>
      <Button onClick={handleViewClick}>{templateButton}</Button>
    </Card>
  );
};

export default HackTemplateCard;

const Loading = styled.div`
  display: flex;
  justify-content: center;

  font-size: 1vw;
  font-weight: bold;
`;

const Card = styled.div`
  //position: relative;
  width: 20vw;
  height: 35vh; // 원래 17.625em
  background-color: #ffffff;
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
  // border-radius: 0.625em;
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
