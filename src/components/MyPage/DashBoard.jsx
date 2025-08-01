import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import defaultProfilePicture from "../../assets/icons/profileIcon.svg"; // 기본 이미지

import MyPageInfoSection from "./MyPageInfoSection";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../features/currentUser";

const DashBoard = ({ name, nickname }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  return (
    <DashboardContainer className="DashBoardContainer">
      <DashboardTitle>대시보드</DashboardTitle>
      <Section>
        <SectionHeader>내 프로필</SectionHeader>
        <InfoContainer>
          <MyPageInfoSection label={"이름"} value={currentUser.name} />
          <MyPageInfoSection label={"닉네임"} value={currentUser.nickname} />
          <MyPageInfoSection
            label={"아이디/이메일"}
            value={currentUser.id || currentUser.email}
          />
        </InfoContainer>
        <ButtonContainer>
          <ButtonWrapper onClick={() => navigate("/ProfileEditPage")}>
            <Button>
              <ButtonText>프로필 편집</ButtonText>
            </Button>
          </ButtonWrapper>
        </ButtonContainer>
      </Section>
    </DashboardContainer>
  );
};

export default DashBoard;

DashBoard.propTypes = {
  profilePicture: PropTypes.string.isRequired,
};
// 기본 프로필 사진
DashBoard.defaultProps = {
  profilePicture: defaultProfilePicture,
};

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const DashboardTitle = styled.div`
  font-family: "OTF B";
  font-style: normal;
  font-weight: 700;
  font-size: 2.2vw;
  line-height: 2.25em;
  color: #000000;
`;

const Section = styled.div`
  padding: 1.5rem 2rem;
  border: 1px solid #ddd;
  border-radius: 0.625em;

  gap: 1rem;
`;

const SectionHeader = styled.div`
  font-family: "OTF R";
  font-style: normal;
  font-weight: 700;
  font-size: 1.8vw;
  line-height: 2.25em;
  color: #000000;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ButtonWrapper = styled.button`
  position: relative;
  display: inline-block;
  width: auto;
  padding: 0px 1.125rem;
  appearance: none;
  text-align: left;
  text-decoration: none;
  line-height: 1;
  box-sizing: border-box;
  height: 2.25rem;

  border-radius: 0.5rem;
  font-family: "OTF R";
  font-weight: 600;

  font-size: 0.875rem;
  user-select: none;
  cursor: pointer;
  border: 0.0625rem solid rgb(206, 212, 218);
  background-color: rgb(255, 255, 255);
  color: rgb(33, 37, 41);
`;

const Button = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 100%;
  overflow: visible;
  pointer-events: none;
`;

const ButtonText = styled.span`
  white-space: nowrap;
  height: 100%;
  overflow: hidden;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
`;

const ProfileButton = styled.button`
  width: 30%;
  height: 2.3775em;
  float: right;
  background: #0a27a6;
  border: 0.0625em solid #d0d1d9;
  border-radius: 0.625em;
  color: #ffffff;
  font-family: "OTF R";
  font-style: normal;
  font-weight: 700;
  font-size: 0.9375em;
  line-height: 1.125em;
`;
