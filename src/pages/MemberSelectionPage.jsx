import React from "react";
import styled from "styled-components";

import Business from "../assets/images/MemberSelectionPage/Business.png";
import General from "../assets/images/MemberSelectionPage/General.png";
import { Navigate, useNavigate} from "react-router-dom";

const MemberSelectionPage = () => {

    const navigate = useNavigate();
    return (
        <MainWrapper>
                <MainText onClick={() => navigate("/")}>FolioFrame</MainText>
                <ButtonWrapper>
                    <GeneralButton>
                        <Title>일반회원</Title>
                        <ol>
                           <ExplainText>포트폴리오 제작 및 공유</ExplainText>
                           <ExplainText>해커톤 참여</ExplainText>
                           <ExplainText>프로젝트 관리</ExplainText>
                           <ExplainText>채용자와의 연결</ExplainText>
                        </ol>
                        <JoinGeneralButton  onClick={() => navigate("/signUpDeveloperPage")}>참여하기</JoinGeneralButton>
                    </GeneralButton>
                    <BusinessButton>
                        <Title>기업회원</Title>
                        <ol>
                           <ExplainText>포트폴리오 열람</ExplainText>
                           <ExplainText>해커톤 열람</ExplainText>
                           <ExplainText>일반회원 정보 열람 </ExplainText>
                           <ExplainText>일반회원과 연결</ExplainText>
                        </ol>
                        <JoinBusinessButton  onClick={() => navigate("/SignUpRecruiterPage")}>참여하기</JoinBusinessButton>
                    </BusinessButton>
                </ButtonWrapper>
        </MainWrapper>
    );
};

export default MemberSelectionPage;

// CSS Wrapper
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // padding: 90px;
  width: 85%;
  padding: 3% 20px;
  margin: 0 auto;
  gap: 2em;
`;

const ButtonWrapper = styled.div`
    display: flex;
    gap: 2em;
    width: 100%;
    height: 100%;
    margin-top : -2em;
    align-items: center;
    justify-content: center;
`;

// CSS Buttons
const GeneralButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 1em;
    border: none;
    cursor: pointer;
    width: 30em; 
    height: 25em;
    border: 2px solid #0A27A6; 
    background-color : #fff;
`;
const BusinessButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 1em;
    border: none;
    cursor: pointer;
    width: 30em; 
    height: 25em;
    border: 2px solid #0A27A6; 
    background-color : #fff;
`;
const JoinBusinessButton = styled.button`
    color: #fff;
    font-size: 1em;
    font-weight: 800;
    font-family: "OTF R";
    background-color: #0A27A6;
    border: 1px solid #0A27A6;
    border-radius: 2em;
    height: 4em;
    width: 50%;
    margin-top: -1.5em;
    transition: all 0.3s ease-out; 

    &:hover {
        background-color: #fff;
        border: 1px solid #0A27A6;
        color: #0A27A6;
        padding: 12px 20px;
        font-weight: bold;
        opacity: 0.8;
        cursor: pointer;
        transition: all 0.3s ease-out;
    }
`;
const JoinGeneralButton = styled.button`
    color: #fff;
    font-size: 1em;
    font-weight: 800;
    font-family: "OTF R";
    background-color: #0A27A6;
    border: 1px solid #0A27A6;
    border-radius: 2em;
    height: 4em;
    width: 50%;
    margin-top: -1.5em;
    transition: all 0.3s ease-out; 

    &:hover {
        background-color: #fff;
        border: 1px solid #0A27A6;
        color: #0A27A6;
        padding: 12px 20px;
        font-weight: bold;
        opacity: 0.8;
        cursor: pointer;
        transition: all 0.3s ease-out;
    }
`;

// CSS Images

// CSS Text
const MainText = styled.p`
    font-size : 4em;
    font-weight : 800;
    font-family: "OTF B";
    color : #0A27A6;
    display : flex;
    cursor:pointer;
`;
const Title = styled.p`
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0.5em;
    // border: 0.2em solid #fff; 
    // border-radius: 0.5em;
    padding: 0.5em 2em;
    font-family: "OTF B";

`;

const ExplainText = styled.li`
    font-size: 1.5em;
    color : black;
    font-family: "OTF R";
    text-align: left;
    margin-bottom : 1em;
`;
