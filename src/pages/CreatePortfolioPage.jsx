import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/icons/Logo.png";
import CreatePortfolioInput from "../components/CreatePortfolioPage/CreatePortfolioInput";
import CreatePortfolioTemplate from "../components/CreatePortfolioPage/CreatePortfolioTemplate";
import saveProject from "../components/features/saveProject";
import { getCurrentUser } from "../components/features/currentUser";
import { Navigate, useNavigate } from "react-router-dom";
import { templateInfo } from "../components/commmon/dummydata/templateInfo.jsx";


const CreatePortfolioPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectOwnerName: "", // 포폴 만든 사람 이름
    projectOwnerNickname: "",
    projectOwnerEmail: "", // 포폴 만든 사람 이메일
    projectTemplate: null, //포폴 템플릿
    projectTitle: "", //포폴 이름
    description: "", //포폴 설명
    startDate: null,
    endDate: null,
    solving: "",
    challenge: "",
    share: false,
    usedLanguage: "",
    category: "",
    video: null,
    coverImage: null,
    images: [],
    logo: null,
  });

  // const [currentUser, setCurrentUser] = useState(null);
  const currentUser = getCurrentUser();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // setCurrentUser(user);
      console.log(currentUser);
    } else {
      console.log("currentUser 없음");
    }
  }, []);

  // 필수 항목 채워졌는지 확인
  useEffect(() => {
    const {
      projectTitle,
      description,
      startDate,
      endDate,
      solving,
      challenge,
      usedLanguage,
    } = formData;

    const isFormValid =
      projectTitle &&
      description &&
      startDate &&
      endDate &&
      solving &&
      challenge &&
      usedLanguage;
    setIsButtonDisabled(!isFormValid);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "images") {
      setUploadedImages(value); // 업로드된 이미지를 상태로 저장
      console.log("업로드된 이미지 경로가 상태에 저장됨:", value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
// YYYY-MM-DD 형식 -> 서버와 연결할 때 오류가 나옴! 수정함
  const handleDateChange = (name, date) => {
      // 날짜 객체를 복사하고 하루를 더함
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1); // 날짜 +1
    const formattedDate = newDate ? newDate.toISOString().split('T')[0] : ""; 
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedDate,
    }));
  };
  const setProjectTemplate = (templateId) => {
    setFormData((prevData) => ({
      ...prevData,
      projectTemplate: templateId,
    }));
    console.log("Selected templateId:", templateId);
  };


  const handleSaveProject = () => {
    console.log("handleSaveProject 호출됨"); // 호출 확인 로그 추가
    console.log("formData : ", formData);
  
    saveProject(
      currentUser.name, // 사용자 이름
      currentUser.id, // 사용자 아이디
      currentUser.nickname, // 사용자 닉네임
      currentUser.email, // 사용자 이메일
      formData.projectTemplate, // projectTemplate
      formData.projectTitle,
      formData.description,
      formData.startDate,
      formData.endDate,
      formData.category,
      formData.usedLanguage,
      formData.projectLink,
      formData.solving,
      formData.challenge,
      formData.video,
      formData.coverImage,
      formData.images,
      formData.logo,
      formData.share
    );
    console.log(formData.startDate, formData.endDate);
    navigate("/MyPage"); 
  };
  //이미지, 비디오 업로드
  
  return (
    <>
      <HeaderWrapper>
        <LogoImage src={Logo} alt="로고" />
        <PageHeaderTitle>Portfolio</PageHeaderTitle>
      </HeaderWrapper>

      <ContentWrapper>
        <CreatePortfolioInput
          onInputChange={handleInputChange}
          formData={formData}
          onDateChange={handleDateChange}
        />
        <CreatePortfolioTemplate
          templates={templateInfo} 
          setProjectTemplate={setProjectTemplate} 
        />
        <CreateButton  
             disabled={isButtonDisabled}
             onClick={handleSaveProject}
            // onClick={() => {
            // handleSaveProject(); // 프로젝트 저장 함수 호출
            // navigate("/MyPage")}};
          >제작하기
        </CreateButton>
      </ContentWrapper>
    </>
  );
};

export default CreatePortfolioPage;

//css Wrapper
const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5em;
  margin-bottom: 5em;
`;
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
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