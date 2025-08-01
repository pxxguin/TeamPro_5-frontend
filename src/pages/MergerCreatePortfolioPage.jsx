import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { oriProjects } from "../components/domain/startProgram";
import { savePortfolio } from "../components/features/savePortfolio";
import TemplateCard from "../components/commmon/TemplateCard";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../components/features/currentUser";
import MergerCreatePortfolioPageInput from "../components/MergerCreatePortfolioPage/MergerCreatePortfolioPageInput";

import Logo from "../assets/icons/Logo.png";

const MergerCreatePortfolioPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [formData, setFormData] = useState({
    portfolioName: "",
    usedLanguage: "",
    frontend: "",
    backend: "",
    share: false,
  });

  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const projects = Array.from(oriProjects.values()).filter(
        (project) => project.ownerId === currentUser.id
      );
      setUserProjects(projects);
    }
  }, [currentUser]);

  const handleSelectProject = (projectId) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
    console.log(selectedProjects);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSavePortfolio = () => {
    if (selectedProjects.length === 0) {
      alert("최소 한 개의 프로젝트를 선택해야 합니다.");
      return;
    }
    savePortfolio(
      currentUser.name,
      currentUser.id,
      currentUser.email,
      formData.portfolioName,
      selectedProjects,
      formData.usedLanguage,
      formData.frontend,
      formData.backend,
      formData.share
    );
    navigate("/MyPage");
  };

  return (
    <PageContainer>
      <HeaderWrapper>
        <LogoImage src={Logo} alt="로고" />
        <PageHeaderTitle>Portfolio</PageHeaderTitle>
      </HeaderWrapper>

      <ContentWrapper1>
        <MergerCreatePortfolioPageInput
          formData={formData}
          onInputChange={handleInputChange}
          onToggleChange={handleInputChange}
        />
        <ContentWrapper2>
          <ProjectsGrid>
            {userProjects.map((project) => (
              <ProjectCardWrapper
                key={project.projectId}
                selected={selectedProjects.includes(project.projectId)}
                onClick={() => handleSelectProject(project.projectId)}
              >
                <TemplateCard
                  key={project.projectId}
                  portfolioId={project.projectId}
                  templateButton="선택"
                  isButton={false}
                />
              </ProjectCardWrapper>
            ))}
          </ProjectsGrid>

          {/* <SubmitButton onClick={handleSavePortfolio}>포트폴리오 저장</SubmitButton> */}

          <CreateButton
            //disabled={isButtonDisabled}
            //onClick={handleSavePortfolio}
            onClick={() => {
              handleSavePortfolio(); // 프로젝트 저장 함수 호출
              navigate("/MyPage");
            }}
          >
            제작하기
          </CreateButton>
        </ContentWrapper2>
      </ContentWrapper1>
    </PageContainer>
  );
};

export default MergerCreatePortfolioPage;

// Styled Components
const PageContainer = styled.div`
  width: 85%; //수정중...
  margin: 0 auto;
`;

//css Wrapper
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5em;
  margin-bottom: 5em;
`;

const ContentWrapper1 = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
  justify-content: center;
  //min-height: 80vh;
`;
const ContentWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //min-height: 80vh;
`;

//css Image
const LogoImage = styled.img`
  widht: 5em;
  height: 5em;
  margin-bottom: -2em;
`;

//css Text
const PageHeaderTitle = styled.div`
  color: #0a27a6;
  font-size: 2em;
  font-weight: 800;
  font-family: "OTF B";

  @media (max-width: 768px) {
    font-size: 1.25em;
    margin-top: 0.75em;
    margin-bottom: 1em;
  }
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const ProjectsGrid = styled.div`
  //   display: grid;
  //   grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  //   gap: 20px;
  //   margin-top: 20px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  //place-content: center center;
  //justify-content: center;
  gap: 3vw 1vw;

  margin: 3vh;
  width: 100%;
`;

const ProjectCardWrapper = styled.div`
  border: ${(props) => (props.selected ? "2px solid #0a27a6" : "none")};
  cursor: pointer;
  //padding: 10px;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #0a27a6;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #08368b;
  }
`;

//css button
const CreateButton = styled.button`
  color: #fff;
  font-size: 1em;
  font-weight: 800;
  border-radius: 2em;
  border: none;
  background-color: #0a27a6;
  height: 3em;
  width: 20%;
  margin-top: 2em;
  font-family: "OTF R";

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:disabled {
    background-color: #0a27a6;
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
