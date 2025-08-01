import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  oriHackathons,
  oriComments,
  initializeData,
} from "../components/domain/startProgram";
import { getCurrentUser } from "../components/features/currentUser";
import { patchContacts } from "../components/features/recruiterFeatures";
import Comment from "../components/domain/Comment";
import saveComment from "../components/features/saveComment";
import { deleteHackathon, isIncludedParticipant } from "../components/features/hackathonFeatures";


//logo 이미지
import logo from "../assets/icons/Logo.png";

import person from "../assets/icons/person.png";
import Calendar from "../assets/icons/Calendar.png";

import  Link  from "../assets/icons/Link.png";
import { SiThangs } from "react-icons/si";

import {updateParticipant} from "../components/features/hackathonFeatures";

const HackathonDetailPage = () => {
  const hackId = Number(useParams().hackId); // URL에서 hackId를 숫자로 변환
  const [HackathonData, setHackathonData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [isUserParticipant, setIsUserParticipant] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 팝업 상태 추가

  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const userId = currentUser.id;



  console.log(userId);
  console.log(hackId);

  useEffect(() => {
    // hackId를 사용하여 해당 해커톤 데이터를 가져오기
    const Hackathon = oriHackathons.get(Number(hackId)); 
    console.log(typeof hackId);
    if (Hackathon) {
      setHackathonData(Hackathon);
      console.log(Hackathon);
    }
  }, [hackId]);


  useEffect(() => {
    if (HackathonData && currentUser) {
      
    if (HackathonData && HackathonData.ownerEmail === currentUser.email|| 
        HackathonData.ownerId === currentUser.id) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    }
  }, [HackathonData?.ownerEmail, HackathonData?.ownerId, currentUser?.email, currentUser?.id]);


  useEffect(() => {
    if (HackathonData && userId) {
      const isParticipant = isIncludedParticipant(Number(hackId), userId);
      setIsUserParticipant(isParticipant);
    }
  }, [HackathonData, userId]);
  
  
  const handleParticipation = async () => {
    if (HackathonData.participant.length < HackathonData.maxMemNumber && !isUserParticipant) {
      try {
        await updateParticipant(Number(hackId), userId);
  
        // 상태 업데이트
        setHackathonData((prev) => ({
          ...prev,
          participant: [...prev.participant, userId],
        }));
  
        setIsUserParticipant(true); // 참여 상태를 바로 업데이트
      } catch (error) {
        console.error("참여 업데이트 중 오류 발생:", error);
      }
    }
  };
  
  useEffect(() => {
    if (HackathonData && userId) {
      // 참여 여부를 상태에 반영
      const isParticipant = HackathonData.participant.includes(userId);
      setIsUserParticipant(isParticipant);
    }
  }, [HackathonData, userId]);
 
  
  // console.log(hackId);
  
  if (!HackathonData) {
    return <Loading>로딩 중...</Loading>;
  }
  // 사진 업로드 핸들러
  const handlePhotosChange = (index) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const newPictures = [...(HackathonData.pictures || [])];
      newPictures[index] = URL.createObjectURL(file);

      setHackathonData((prevData) => ({
        ...prevData,
        pictures: newPictures,
      }));
    }
  };

  // 커버 이미지 업로드 핸들러
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageURL = URL.createObjectURL(file);

      setHackathonData((prevData) => ({
        ...prevData,
        coverImage: imageURL,
      }));
    }
  };

  // 홍보 비디오 URL 핸들러
  const handleVideoChange = (e) => {
    const videoURL = e.target.value;

    setHackathonData((prevData) => ({
      ...prevData,
      video: videoURL,
    }));
  };


  const handlePopupToggle = () => {
    setIsPopupOpen((prev) => !prev);
  };

  if (!HackathonData) {
    return <Loading>로딩 중...</Loading>;
  }


  
  return (
    <>
    <MainWrapper>
      {/* 본문 */}
      <LeftContent>
        <HackTitle>{HackathonData.hackName}</HackTitle>
        <Line></Line>
        <RowWrapper>
          <Mem>모집인원</Mem>
          <MemTitle>{HackathonData.maxMemNumber + "명" || "없습니다."}</MemTitle>
          <Mem>모집파트</Mem>
          <MemTitle>{HackathonData.part || "없습니다."}</MemTitle>
          {/* <Mem2>현재 참여중인 인원</Mem2>
          <MemTitle>{HackathonData.participant.length || "없습니다."}</MemTitle> */}
        </RowWrapper>
        <RowWrapper>
        <LinkWrapper>
          <LinkIcon src={Link} alt="Link" />
          <LinkInput value={HackathonData.link || "없습니다."} readOnly />
        </LinkWrapper>
        </RowWrapper>
      {/* 해커톤 설명 */}
      <Line></Line>
      <HackTitle>해커톤 설명</HackTitle>
      <ContentSection2>
        <DesTitle>{HackathonData.description || "없습니다"}</DesTitle>
      </ContentSection2>
      <Line></Line>
      <RowWrapper>
      {/* 사진 */}
      <HackTitle>사진</HackTitle>
        <RowWrapper
          style={{
            display: "flex",
            alignItems: "flex-start", 
            gap: "20px",
          }}
        >
          <ImageWrapper
            style={{
              display: "flex",
              flexWrap: "wrap", 
              gap: "10px",
              flex: "1", 
            }}
          >
            {HackathonData.pictures && HackathonData.pictures.length > 0 ? (
              HackathonData.pictures.slice(0, 4).map((image, index) => (
                <ImageBox
                  key={index}
                  style={{
                    width: "100px",
                    height: "100px",
                    overflow: "hidden", 
                  }}
                >
                  <img
                    src={sanitizeURL(`http://localhost:3000/${image}`)}
                    alt={`프로젝트 이미지 ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </ImageBox>
              ))
            ) : (
              <ImageBox style={{ width: "100px", height: "100px" }}>+</ImageBox>
            )}
          </ImageWrapper>
        </RowWrapper>
        </RowWrapper>

        <ColumnWrapper2>
          {/* 홍보 비디오 */}
          <ColWrapper>
            <HackTitle>홍보 비디오</HackTitle>
           {!HackathonData.video ? (
              <ChoiceInput
                type="url"
                value={HackathonData.video || ""}
                placeholder="비디오 URL을 입력하세요"
                onChange={handleVideoChange}
              />
            ) : (
              <VideoWrapper>
                <video controls width="100%">
                  <source src={HackathonData.video} type="video/mp4" />
                  <p>비디오 재생을 지원하지 않는 브라우저입니다.</p>
                </video>
              </VideoWrapper>
            )}
              
          </ColWrapper>

          {/* 커버 이미지 */}
          <ColWrapper>
            <HackTitle2>커버 이미지</HackTitle2>
            <ImageWrapper>
               {HackathonData.coverImage ? (
            <img
              src={sanitizeURL(`http://localhost:3000/${HackathonData.coverImage}`)}
              style={{
                width: "100px",
                height: "100px",
              // width: "100%",
              // height: "100%",
              objectFit: "cover",
              borderRadius: "1em",
              display: "block", 
              marginLeft: "auto", 
              marginRight: "auto", 
            }}
            />
          ) : (
            <ImageBox>+</ImageBox>
         )}
            </ImageWrapper>
            {/* {HackathonData.coverImage ? (
            <img
              src={`http://localhost:3000/${HackathonData.coverImage}`}
              style={{
              width: "40%",
              height: "30%",
              objectFit: "cover",
              borderRadius: "1em",
              display: "block", // 중앙 정렬에 도움
              marginLeft: "auto", // 오른쪽 이동
              marginRight: "auto", // 중앙 정렬 유지
            }}
            />
          ) : (
            <ImageBox>+</ImageBox>
         )} */}
          </ColWrapper>
        </ColumnWrapper2>
      </LeftContent>
  
      {/* 오른쪽 사이드 창 */}
      <ContentSection1>
        <Logo>
          {HackathonData.logo ? (
            <img
             src={sanitizeURL(`http://localhost:3000/${HackathonData.logo}`)}
             style={{
             width: "100%",
             height: "100%",
             objectFit: "cover",
             borderRadius: "1em",
            }}
            />
          ) : (
            <img src={logo} alt="Logo" />
         )}

        </Logo>
        <HackTitle>{HackathonData.hackName}</HackTitle>
        <RowWrapper>
          <TimeWrapper>
            <RowWrapper>
              <CalendarImage src={Calendar} alt="달력" />
              <TimeTitle>
                모집기간 {HackathonData.startDate} - {HackathonData.endDate}
              </TimeTitle>
            </RowWrapper>
            <RowWrapper>
              <PersonImage src={person} alt="사람" />
              <Mem2>현재 참여중인 인원 : </Mem2>
              <MemTitle>{HackathonData.participant.length || "없습니다."}</MemTitle>
            </RowWrapper>
           
          </TimeWrapper>
        </RowWrapper>
        <StartButton
          onClick={() => {
            if (isOwner) {
              console.log("팝업 상태를 토글합니다.");
              handlePopupToggle();
            } else {
              handleParticipation();
            }
          }}
        >
          {isOwner ? "지원현황" : isUserParticipant ? "지원완료" : "지원하기"}
        </StartButton>
      </ContentSection1>

    </MainWrapper>
    <DetailContainer>
    {/* 수정, 삭제 버튼 */}
    {isOwner && (
      <ButtonWrapper2>
        <SubmitButton
          onClick={() => {
            navigate(`/ModifyHackathonPage/${hackId}`);
          }}
        >
        수정
        </SubmitButton>
        <SubmitButton
          onClick={async () => {
            // 해커톤 삭제
            await deleteHackathon(hackId);
            // Mypage로 이동
          navigate("/Mypage");
      }}>삭제</SubmitButton>
      </ButtonWrapper2>
    )}

    {/* 지원현황을 클릭하면 지원자들을 볼 수 있도록 (내가 제작한 해커톤인 경우에만 보이게 ) */}
    {isOwner && isPopupOpen && (
      <PopupOverlay>
        <PopupContainer>
          <CloseButton onClick={handlePopupToggle}>X</CloseButton>
          <CommentsSection>
            <CommentsTitle>지원자</CommentsTitle>
            <ParticipantList>
              {HackathonData.participant && HackathonData.participant.length > 0 ? (
                HackathonData.participant.map((participant, index) => (
                  <li key={index}>{participant}</li>
                ))
              ) : (
                <li>지원자가 없습니다.</li>
              )}
            </ParticipantList>
          </CommentsSection>
        </PopupContainer>
      </PopupOverlay>
    )}


    </DetailContainer>
        

    </>
    
  );
};

export default HackathonDetailPage;

// css Wrapper
const ContentSection1 = styled.div`
  position: sticky;
  top: 0;
  width: 50vh; 
  height: 50vh; 
  background-color: #fff;
  padding: 5px 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.4); 
  overflow-y: auto;
  border-radius : 2em;
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;
`;
const ContentSection2 = styled.div`
  width: 100%;
  height : 100vh;
  color: #ccc;
  border-radius: 2em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom : 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; 

`;
const LeftContent = styled.div`
  flex: 1;
  // margin-right: 20px;
`;

const MainWrapper = styled.div`
  width: 85%; //수정중...
  margin: 0 auto;
  display: flex;
  justify-content: space-between; 
  align-items: flex-start;
  gap : 2em;
`;
const VideoWrapper = styled.div`
`;
const TimeWrapper = styled.div`
`;
const ImageWrapper = styled.div`
  display: flex;
  // gap: -1em;
  justify-content: space-between;
  margin-left:2em;
  width: 80%;
`;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap : 1em;
`;
const ColWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const LinkWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 60%;
`;
const ColumnWrapper2 = styled.div`
  display: flex;
  // gap: 20%;
  width: 100%;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;

  font-size: 1vw;
  font-weight: bold;
`;
const Line = styled.hr`
  margin: 1.5vh 0;
  border: 1px solid #d0d1d9;
`;
const Mem = styled.p`
  width : 4em;
  height : 1.5em;
  color : #fff;
  font-weight: bold;
  font-family: "OTF R";
  font-size : 1em;

  border : 1px solid #ccc;
  border-radius : 0.2em;
  background-color : #0a27a6;
 
  display: flex;
  align-items: center; 
  justify-content: center;
`;
const Mem2 = styled.p`
  width : 8em;
  height : 1.5em;
  color : #000;
  font-weight: bold;
  font-family: "OTF R";
  font-size : 1em;
  margin-left : -0.1em;
  // border : 1px solid #ccc;
  // border-radius : 0.2em;
  // background-color : #0a27a6;
 
  display: flex;
  align-items: center; 
  justify-content: center;
`;
const DetailContainer = styled.div`
  width: 85%;
  margin: 0 auto;
`;
//css Input
const LinkInput = styled.input`
  border: 1.4px solid #0a27a6;
  border-radius: 1em;
  width: 100%;
  height: 2em;
  padding-left: 35px; 
`;
const ChoiceInput = styled.input`
  border: 1px solid #d0d1d9;
  border-radius: 2em;
  outline: none;
  height: 20em;
  width: 35em; 
  text-indent: 1em;
  &::placeholder {
    text-indent: 1em;
  }
`;
//css image
const CalendarImage = styled.img`
  width : 1.5em;
  height : 1.4em;
  margin-top:0.4em;
`;
const PersonImage = styled.img`
  width : 1.5em;
  height : 1.5em;
  margin-top: 1em;
`;
const Logo = styled.h1`
  width: 6vw;
  height: 6vw;
  margin-bottom : -1em;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const LinkIcon = styled.img`
  position: absolute; 
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
`;
//css Text
const HackTitle = styled.h1`
  color : #0a27a6;
  font-weight: bold;
  font-family: "OTF B";
  // color : #000;
`;
const HackTitle2 = styled.h1`
  color : #0a27a6;
  font-weight: bold;
  font-family: "OTF B";
  margin-left : 1em;
  // color : #000;
`;

const TimeTitle = styled.h1`
  font-weight: bold;
  font-family: "OTF R";
  font-size : 1em;
  color : #000;

`;
const MemTitle = styled.h1`
  font-weight: bold;
  font-family: "OTF R";
  font-size : 1em;
  color : #000;
  margin-top : 1.2em;
`;
const DesTitle = styled.p`
  font-weight: bold;
  font-family: "OTF R";
  font-size : 1em;
  color : #000;

`;

//css button
const StartButton = styled.button`
  // color: #fff;
  font-size: 1em;
  font-weight: 800;
  border-radius: 2em;
  border: none;
  // background-color: #0a27a6;
  height: 3em;
  width: 50%;
  font-family: "OTF R";

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  background-color: ${({ isFull }) => (isFull ? "#cccccc" : "#0a27a6")};
  color: ${({ isFull }) => (isFull ? "#666666" : "#ffffff")};
  cursor: ${({ isFull }) => (isFull ? "not-allowed" : "pointe")};

`;


const FileInput = styled.input`
  position: absolute;
  padding: 0;
  overflow: hidden;
  clip:rect(0,0,0,0);
  border: 0;
`;

const FileLabel = styled.label`
  display: inline-block;
  width: 5em;  
  height: 5em;
  color: #d0d1d9;
  font-size: inherit;
  line-height: normal;
  vertical-align: middle;
  background-color: #fdfdfd;
  cursor: pointer;
  border: 1px solid #d0d1d9;
  border-radius: 1em;  
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;


// css 수정, 삭제 버튼
const ButtonWrapper2 = styled.div`
  display: flex;
  margin-right : 2em;
  justify-content: flex-end;
  gap: 1em;
`;
const SubmitButton = styled.button`
  border: none;
  border-radius: 0.4em;

  margin-top: 1vh;
  width: 9.1em;
  height: 2.25em;

  float: right;

  background-color: #0a27a6;
  color: white;
  font-size: 1.1vw;
  font-family: "OTF B";
  font-weight: bold;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0.2em 1em rgba(22, 26, 63, 0.2);
  }
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 7em;
    height: 2.25em;
    font-size: 0.8125em;
  }
`;

//css 지원자 
const CommentsSection = styled.div`
  margin-top: 6vh;
`;

const CommentsTitle = styled.h2`
  font-weight: bold;
  font-family: "OTF B";
  color : #0a27a6;

  text-align: center; 
`;

const ParticipantList = styled.p`
  color:#000;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 50vw;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative; 

`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 1em;
  right: 1em;
  cursor: pointer;
  color : #0a27a6;
`;

const ImageBox = styled.div`
  // width: 5em;
  // height: 5em;
  // border: 1px solid #000;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // font-size: 1vw;
  // border-radius: 1em;
  // overflow: hidden;

  display: inline-block;
  width: 5em;  
  height: 5em;
  color: #d0d1d9;
  font-size: inherit;
  line-height: normal;
  vertical-align: middle;
  background-color: #fdfdfd;
  cursor: pointer;
  border: 1px solid #d0d1d9;
  border-radius: 1em;  
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;


const VideoText = styled.p`
  position: absolute;
  left: 2em;
  font-size: 1.2em;
  font-weight: bold;
  color: #000;
  font-family: "OTF R";
  // left: 2.5em;
  // font-size: 1.5em;

  @media (max-width: 768px) {
    font-size: 1em;
    top: 72%;
    left: 5%;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
    top: 75%;
    left: 5%;
  }
`;
const VideoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center; 

  border-radius: 1em;
  font-size: 1vw;
  width: 40em;
  height: 15em;

`;

const VideoWrappeer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1em;

  border: 1px solid #d0d1d9;
  border-radius: 2em;
  outline: none;
  width: 30em;
  height: 15em;
  text-indent: 1em;
  &::placeholder {
    text-indent: 1em;
  }
`;

function sanitizeURL(url) {
  try {
    const parsedURL = new URL(url);
    return parsedURL.href;
  } catch (e) {
    console.error("Invalid URL:", url);
    return "";
  }
}