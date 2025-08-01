import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/icons/Logo.png";
import ModifyHackathonInput from "../components/ModifyHackathonPage/ModifyHackathonInput.jsx";
import { getCurrentUser } from "../components/features/currentUser";
// import { saveHackathon } from "../components/features/hackathonFeatures";
import { Navigate, useNavigate } from "react-router-dom";
import { updateHackathon } from "../components/features/hackathonFeatures";
import { useParams } from "react-router-dom";

const ModifyHackathonPage = () => {
  const navigate = useNavigate();
  const { hackId } = useParams();
  useEffect(() => {
    if (hackId) {
      setFormData((prevData) => ({
        ...prevData,
        hackId: Number(hackId),
      }));
    }
  }, [hackId]);

  console.log(hackId);
  
  const [formData, setFormData] = useState({
    hackId: "", 
    hackName: "",
    startDate: null,
    endDate: null,
    link: "",
    maxMemNumber: "",
    description: "",
    video: null,
    pictures: null,
    coverImage: null,
    logo: null,
    ownerId: "",
    ownerEmail: "",
    participant: [],
  });

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      // setCurrentUser(user);
      console.log(currentUser);
    } else {
      console.log("currentUser 없음");
    }
  }, []);


  useEffect(() => {
    if (currentUser && (!formData.ownerId || !formData.ownerEmail)) {
      setFormData((prevData) => ({
        ...prevData,
        ownerId: currentUser.id,
        ownerEmail: currentUser.email,
      }));
    }
  }, [currentUser, formData.ownerId, formData.ownerEmail]); 
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  
  const handleSaveHack = () => {

  Object.keys(formData).forEach((field) => {
    const newValue = formData[field];
    if (newValue !== undefined && newValue !== null) {
      updateHackathon(formData.hackId, field, newValue);
    } else {
      console.log(`${field} 값이 비어 있습니다.`);
    }
  });
  

    navigate("/MyPage");
  };



  return (
    <>
      <HeaderWrapper>
        <LogoImage src={Logo} alt="로고" />
        <PageHeaderTitle>Hackathon</PageHeaderTitle>
      </HeaderWrapper>

      <ContentWrapper>
        <ModifyHackathonInput 
          onInputChange={handleInputChange}
          formData={formData}
          onDateChange={handleDateChange}
        />
        <CreateButton onClick={handleSaveHack}>수정완료</CreateButton>
      </ContentWrapper>
    </>
  );
};

export default ModifyHackathonPage;

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
`;
