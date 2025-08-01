import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { oriPortfolios, oriProjects } from "../components/domain/startProgram";
import { getCurrentUser } from "../components/features/currentUser";
import TemplateCard from "../components/commmon/TemplateCard";

const MyProjectsPage = () => {
  const { portfolioId } = useParams();
  const [userProjects, setUserProjects] = useState([]);
  const [userPortfolios, setUserPortfolios] = useState([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showModal, setShowModal] = useState(false); // "연락" 버튼 눌렀을 때 true
  const [modalMessage, setModalMessage] = useState(""); //"연락" 버튼 눌렀을 때 창에 띄워지는 메세지
  const [currentUser, setLocalCurrentUser] = useState(getCurrentUser()); // 초기값 가져오기

  useEffect(() => {
    // 현재 포트폴리오와 사용자 정보를 기반으로 데이터 필터링
    const portfolio = oriPortfolios.get(Number(portfolioId));
    setUserPortfolios(portfolio);
    if (portfolio) {
      // projects 배열에서 projectId를 추출
      const portfolioProjectIds = portfolio.projects;

      // projectId가 portfolio.projects에 포함된 프로젝트 필터링
      const filteredProjects = Array.from(oriProjects.values()).filter(
        (project) => portfolioProjectIds.includes(project.projectId)
      );

      setUserProjects(filteredProjects); // 필터링된 프로젝트 업데이트
    }
  }, [portfolioId]);

  //기업 연락
  const handleContactClick = () => {
    if (currentUser && currentUser.recruiter) {
      setShowContactInfo(true); // 개발자 정보 표시
      setShowModal(true);
      setModalMessage("채용자 페이지에 저장되었습니다.");
    } else {
      setShowModal(true);
      setModalMessage("기업 회원만 연락 버튼을 사용할 수 있습니다.");
    }
  };

  //기업회원 시 "연락" 버튼
  const renderDeveloperInfo = () => {
    if (currentUser.recruiter && showContactInfo) {
      return (
        <>
          <Info>{userPortfolios.ownerName || "이름 없음.."}</Info>
          <Info>{userPortfolios.ownerEmail || "이메일 없음.."}</Info>
        </>
      );
    } else if (currentUser.recruiter) {
      return (
        <ButtonWrapper>
          <Button onClick={handleContactClick}>연락</Button>
        </ButtonWrapper>
      );
    } else {
      return (
        <>
          <Info>개발자</Info>
          <Info>example@example.com</Info>
        </>
      );
    }
  };

  return (
    <PageContainer>
      <Title>{userPortfolios.portfolioName}</Title>

      {/* <DescriptionSection>
        <Section>
          <Field>사용한 스택</Field>
          <Text>{userPortfolios.usedLanguage || "해결한 문제 없음"}</Text>
        </Section>
      </DescriptionSection> */}
      <DetailContainer>
        <InfoSection>
          <InfoWrapper1>
            <InfoField>개발자</InfoField>
            <Info>{renderDeveloperInfo()}</Info>
          </InfoWrapper1>

          <InfoWrapper2>
            <InfoWrapper3>
              <InfoField>사용한 스택</InfoField>
            </InfoWrapper3>

            <InfoWrapper4>
              <Info2>언어</Info2>
              <Info3>{userPortfolios.usedLanguage || ""}</Info3>
            </InfoWrapper4>
            <InfoWrapper4>
              <Info2>프론트엔드</Info2>
              <Info3>{userPortfolios.frontend || ""}</Info3>
            </InfoWrapper4>
            <InfoWrapper4>
              <Info2>백엔드</Info2>
              <Info3>{userPortfolios.backend || ""}</Info3>
            </InfoWrapper4>
          </InfoWrapper2>
        </InfoSection>

        {showModal && (
          <ModalOverlay className="ModalOverlay">
            <ModalContainer>
              <p>{modalMessage}</p>
              <button onClick={() => setShowModal(false)}>확인</button>
            </ModalContainer>
          </ModalOverlay>
        )}

        <Section>
          <Field>프로젝트</Field>
          <TemplateGridWrapper>
            <TemplateGrid>
              {userProjects.map((project) => (
                <TemplateCard
                  key={project.projectId}
                  portfolioId={project.projectId}
                  templateButton="자세히 보기"
                />
              ))}
            </TemplateGrid>
          </TemplateGridWrapper>
        </Section>
      </DetailContainer>
    </PageContainer>
  );
};

export default MyProjectsPage;

const PageContainer = styled.div`
  width: 85%;
  margin: 0 auto;
`;

const DetailContainer = styled.div`
  // padding: 20px;
  // max-width: 800px;
  padding: 2vh;
  margin-bottom: 4vh;

  background-color: rgb(245, 247, 247);
`;

const Title = styled.h1`
  font-size: 2vw;
  text-align: center;
  margin-bottom: 2vh;
  font-family: "OTF B";

  font-style: normal;
  font-weight: 700;

  //   height: 2.625em;
  //   top: 11.375em;
  //   font-family: "OTF B";

  //   font-style: normal;
  //   font-weight: 700;
  //   font-size: 1.875em;
  //   line-height: 2.25em;
  //   display: flex;
  //   align-items: center;
  //   text-align: center;
  //   letter-spacing: -0.025em;
  //   color: #000000;
`;

const DescriptionSection = styled.div`
  margin-bottom: 20px;
`;

const InfoSection = styled.div`
  // display: flex;
  // justify-content: space-around;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 5vh;
`;

const InfoWrapper1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 2vh;

  font-family: Impact;
`;
const InfoWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  //justify-content: space-between;

  margin-bottom: 2vh;
`;
const InfoWrapper3 = styled.div`
  display: flex;
  justify-content: center;
`;

const InfoWrapper4 = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: space-between;
`;

const InfoField = styled.div`
  font-size: 2vw;
  font-weight: bold;

  font-family: "OTF R";
`;

const Info = styled.div`
  border-radius: 0.3125em;

  background-color: white;

  padding: 1vw;
  margin: 1vw;
  min-width: 80%;
`;
const Info2 = styled.div`
  padding: 1vw;
  margin: 1vw;

  font-family: "OTF R";
  font-size: 1vw;
`;
const Info3 = styled.div`
  border-radius: 0.3125em;

  background-color: white;

  padding: 1vw;
  margin: 1vw;
  min-width: 70%;

  font-family: Impact;
`;

//
const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2vw 1vw;

  font-family: "OTF R";
`;

const Field = styled.div`
  font-size: 2vw;
  font-weight: bold;
`;

const Text = styled.div`
  border-radius: 0.3125em;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.1);

  background-color: white;

  padding: 1vw;
  margin-top: 2vw;

  min-width: 80%;
`;

const TemplateSection = styled.div``;

const TemplateGridWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  //place-content: center center;
  //justify-content: center;
  gap: 3vw 1vw;

  margin-top: 2em;
  width: 100%;
`;

//모달
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  font-size: 1.3vw;
  font-weight: bold;
  padding: 1vw;
  width: 25vw;

  border-radius: 0.3125em;

  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;

  button {
    margin-top: 1.5vw;
    padding: 0.5vw 1vw;
    background: #0a27a6;
    color: white;
    border: none;
    border-radius: 0.3125em;
    cursor: pointer;
  }

  button:hover {
    background: #0056b3;
  }
`;
