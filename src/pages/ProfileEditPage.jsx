import React, { useState, useEffect } from "react";
import styled from "styled-components";
import InfoSection from "../components/ProfileEditPage/InfoSection";

import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from "../components/features/currentUser";
import { initializeData, oriUsers } from "../components/domain/startProgram";
import {
  updateName,
  updateNickname,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  deleteAccount,
} from "../components/features/profileFeatures";
import { useNavigate } from "react-router-dom";

//i 아이콘
import infoIcon from "../assets/images/PortfolioEditPage/InfoIcon.svg";

// 모달 컴포넌트
const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>
          정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </ModalText>
        <ButtonContainer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

const ProfileEditPage = () => {
  const [currentUser, setLocalCurrentUser] = useState(getCurrentUser()); // 초기값 가져오기
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    initializeData();
    // oriUsers에서 현재 유저 정보 동기화
    const userId = currentUser?.id;
    if (userId) {
      const updatedUser = oriUsers.get(userId);
      if (updatedUser) {
        setLocalCurrentUser(updatedUser); // 로컬 상태 업데이트
        setCurrentUser(updatedUser); // localStorage에 반영
      }
    }
    console.log(currentUser);
  }, [oriUsers]); // oriUsers 변경 시 실행

  const handleUpdateName = (newName) => {
    updateName(currentUser.id, newName);
  };

  const handleUpdateNickname = (newNickname) => {
    updateNickname(currentUser.id, newNickname);
  };

  const handleUpdateEmail = (newEmail) => {
    updateEmail(currentUser.id, newEmail);
  };

  const handleUpdatePassword = (newPassword) => {
    updatePassword(currentUser.id, newPassword);
  };

  const handleUpdatePhone = (newPhone) => {
    updatePhoneNumber(currentUser.id, newPhone);
  };

  const handleDeleteAccount = () => {
    setIsModalOpen(false);
    //alert("계정이 성공적으로 삭제되었습니다.");
    // 추가 작업: 로그아웃 처리 또는 메인 페이지로 리다이렉트
    clearCurrentUser();
    navigate("/");
    deleteAccount(currentUser.id);
  };

  return (
    <Container>
      {/* 내 프로필 섹션 */}
      <Section>
        <SectionHeader>내 프로필</SectionHeader>
        <InfoContainer>
          <InfoSection
            label={"이름"}
            value={currentUser.name}
            isButton={false}
          />
          <InfoSection
            label={"닉네임"}
            value={currentUser.nickname}
            button={"설정"}
            onSave={handleUpdateNickname}
          />
        </InfoContainer>
      </Section>

      {/* 기본정보 섹션 */}
      <Section>
        <SectionHeader>기본 정보</SectionHeader>
        <InfoContainer>
          <InfoSection
            label={"아이디/이메일"}
            value={
              currentUser.id ||
              currentUser.email ||
              "아이디/이메일을 설정해주세요."
            }
            isButton={false}
          />
          <InfoSection
            label={"비밀번호"}
            value={"비밀번호를 설정해주세요."}
            button={"설정"}
            onSave={handleUpdatePassword}
          />
          <InfoSection
            label={"휴대폰번호"}
            value={currentUser.phoneNumber}
            button={"설정"}
            onSave={handleUpdatePhone}
          />
        </InfoContainer>
      </Section>

      {/* 연락방법 섹션 */}
      <Section>
        <HeaderContainer>
          <SectionHeader>연락방법</SectionHeader>

          <img src={infoIcon} alt="info 아이콘" />
          <div className="tooltip">
            포트폴리오를 공유했을 시, 기업이 연락할 수단입니다.
          </div>
        </HeaderContainer>
        <InfoContainer>
          {currentUser.email ? (
            <InfoSection
              label={"이메일"}
              value={currentUser.email}
              isButton={false}
            />
          ) : (
            <InfoSection
              label={"이메일"}
              value={"등록된 이메일이 없습니다."}
              button={"등록"}
              onSave={handleUpdateEmail}
            />
          )}
        </InfoContainer>
      </Section>

      <Section>
        <DeleteHeader>계정삭제</DeleteHeader>
        <InfoContainer>
          <DeleteInfo>
            1. 계정 탈퇴 시, 폴리오프레임 서비스에서 모두 탈퇴됩니다.
            <br />
            <br />
            2. 탈퇴 시 계정과 관련된 모든 권한이 사라지며 복구할 수 없습니다.
          </DeleteInfo>
          <DeleteButtonContainer>
            <DeleteButtonWrapper onClick={() => setIsModalOpen(true)}>
              <DeleteButton>
                <ButtonText>탈퇴</ButtonText>
              </DeleteButton>
            </DeleteButtonWrapper>
          </DeleteButtonContainer>
        </InfoContainer>
      </Section>

      {/* 탈퇴 확인 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </Container>
  );
};

export default ProfileEditPage;

// Styled Components
const Container = styled.div`
  width: 70%; //수정중...
  margin: 0 auto;
`;

const Section = styled.div`
  margin-top: 5vh;
  padding: 1.5rem 2rem;
  border: 1px solid #ddd;
  border-radius: 0.625em;

  gap: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex: 0 0 140px;
  gap: 0.5rem;
  -webkit-box-align: center;
  align-items: center;
  position: relative;

  img {
    width: 1vw;
    height: 1vw;
    object-fit: contain;
  }

  .tooltip {
    visibility: hidden;
    position: absolute;
    bottom: -1.5vw; /* 툴팁 위치 조정 */
    //left: 4vw;
    background-color: #333;
    color: #fff;
    text-align: center;
    padding: 0.5vw 1vw;
    border-radius: 0.625em;
    font-size: 1vw;
    white-space: nowrap;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  /* 마우스 오버 시 툴팁 표시 */
  img:hover + .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const SectionHeader = styled.div`
  font-family: "OTF R";
  font-style: normal;
  font-weight: 700;
  font-size: 1.8vw;
  line-height: 2.25em;
  color: #000000;
`;

const DeleteHeader = styled.div`
  font-family: "OTF R";
  font-style: normal;
  font-weight: 700;
  font-size: 1.8vw;
  line-height: 2.25em;
  color: red;
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

const DeleteInfo = styled.div``;

const DeleteButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DeleteButtonWrapper = styled.button`
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
  color: red;
`;

const DeleteButton = styled.div`
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

//탈퇴시
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const ModalText = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const CancelButton = styled.button`
  background: gray;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  background: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
