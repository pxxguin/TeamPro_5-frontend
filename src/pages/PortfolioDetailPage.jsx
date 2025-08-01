import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import {
  oriProjects,
  oriUsers,
  oriComments,
  initializeData,
} from "../components/domain/startProgram";
import {
  getCurrentUser,
  setCurrentUser,
} from "../components/features/currentUser";
//기업 연락
import { patchContacts } from "../components/features/recruiterFeatures";
//좋아요
import {
  patchLikes,
  isIncludedLikes,
} from "../components/features/likeFeatures";
import Comment from "../components/domain/Comment";
import saveComment from "../components/features/saveComment";

import WritingBox from "../components/commmon/PortfolioDetailPage/WritingBox";
import CommentList from "../components/commmon/PortfolioDetailPage/CommentList";

//logo 이미지
import logo from "../assets/icons/Logo.png";
//heart 이미지
import heart_none from "../assets/images/PortfolioDetailPage3/heart-none.svg";
import heart_fill from "../assets/images/PortfolioDetailPage3/heart-fill.svg";

import { deleteProject } from "../components/features/projectFeatures";

const PortfolioDetailPage = () => {
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [comments, setComments] = useState([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showModal, setShowModal] = useState(false); // "연락" 버튼 눌렀을 때 true
  const [modalMessage, setModalMessage] = useState(""); //"연락" 버튼 눌렀을 때 창에 띄워지는 메세지
  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false); //"좋아요" 눌렀을 때 상태 반영

  const [currentUser, setLocalCurrentUser] = useState(getCurrentUser()); // 초기값 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    initializeData();
    //project ID 사용해서 포트폴리오 데이터 가져오기
    const portfolio = oriProjects.get(Number(portfolioId));
    if (portfolio) {
      setPortfolioData(portfolio);
      setIsLiked(isIncludedLikes(portfolio.projectId, currentUser.id)); //초기상태

      // 현재 유저가 recruiter이고 연락을 이미 클릭한 경우
      if (
        currentUser.recruiter &&
        portfolio.contacts.includes(currentUser.id)
      ) {
        setShowContactInfo(true); // 개발자 정보 표시
      }
    }

    // oriUsers에서 현재 유저 정보 동기화
    const userId = currentUser?.id;
    if (userId) {
      const updatedUser = oriUsers.get(userId);
      if (updatedUser) {
        setLocalCurrentUser(updatedUser); // 로컬 상태 업데이트
        setCurrentUser(updatedUser); // localStorage에 반영
      }
    }

    const filteredComments = Array.from(oriComments.values()).filter(
      (comment) => comment.portfolioId === Number(portfolioId)
    );
    console.log("초기화된 comments:", filteredComments); // 디버깅용 로그
    setComments(filteredComments);

    console.log(portfolio);
  }, [oriProjects, oriUsers, oriComments]);

  useEffect(() => {
    console.log("portfolioData:", portfolioData);
    console.log("currentUser.email:", currentUser.email);

    if (portfolioData && portfolioData.ownerEmail === currentUser.email) {
      console.log("작성자 일치");
      setIsOwner(true);
    } else {
      console.log("작성자 불일치");
      setIsOwner(false);
    }
  }, [currentUser.email, portfolioData]);

  const addComment = (text) => {
    try {
      // saveComment에서 댓글 객체 생성 및 파일 저장
      const newComment = saveComment(Number(portfolioId), currentUser.id, text);
      console.log("추가된 댓글:", newComment); // 디버깅용 로그

      // 상태 업데이트
      setComments((prevComments) => [newComment, ...prevComments]);
    } catch (error) {
      console.error("댓글 저장 중 오류 발생:", error);
    }
  };


  const handleContactClick = () => {
    if (currentUser && currentUser.recruiter) {
      patchContacts(Number(portfolioId), currentUser.id); // 기업 연락 호출
      setShowContactInfo(true); // 개발자 정보 표시
      setShowModal(true);
      setModalMessage("채용자 페이지에 저장되었습니다.");
    } else {
      setShowModal(true);
      setModalMessage("기업 회원만 연락 버튼을 사용할 수 있습니다.");
    }
  };

  //좋아요 클릭
  const handleLikeClick = () => {
    if (!portfolioData) return;

    if (isLiked) {
      // 좋아요 취소
      portfolioData.likes = portfolioData.likes.filter(
        (id) => id !== currentUser.id
      );
      setIsLiked(false);
    } else {
      // 좋아요 추가
      portfolioData.likes.push(currentUser.id);
      setIsLiked(true);
    }

    // 서버 업데이트 호출
    patchLikes(portfolioData.projectId, currentUser.id);

    // 좋아요 카운트 업데이트
    setPortfolioData({ ...portfolioData });
  };

  const renderDeveloperInfo = () => {
    if (currentUser.recruiter && showContactInfo) {
      return (
        <>
          <DevInfo>{portfolioData.ownerName}</DevInfo>
          <DevInfo>{portfolioData.ownerEmail || "이메일 없음"}</DevInfo>
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
          <DevInfo>{portfolioData.ownerNickname || "익명"}</DevInfo>
          <DevInfo>example@example.com</DevInfo>
        </>
      );
    }
  };

  if (!portfolioData) {
    return <Loading>로딩 중...</Loading>;
  }
  return (
    <DetailContainer>
      <TitleSection>
        <TitleWrapper>
          {/* {portfolioData.logo && (
            <Logo>
              <img src={portfolioData.logo} alt="projectLogo" />
            </Logo>
          )} */}
          <Logo>
              {portfolioData.logo ? (
                <img
                  src={sanitizeUrl(`http://localhost:3000/${portfolioData.logo}`)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "1em",
                  }}
                  />
                ) : (
                  <img src={logo} alt="projectLogo" />
                )}
          </Logo>
          <ProjectTitle>{portfolioData.projectTitle}</ProjectTitle>
        </TitleWrapper>
        <ProjectDescription>{portfolioData.description}</ProjectDescription>
        <InfoButtons>
          <Button>조회수 {portfolioData.hits || 0}</Button>
          <Button>기업 연락 {portfolioData.contacts.length || 0}</Button>
          <HeartBox onClick={handleLikeClick}>
            <img
              src={isLiked ? heart_fill : heart_none} // 좋아요 상태에 따라 이미지 변경
              alt={isLiked ? "heart-fill" : "heart-none"}
            />
            <Likes>{portfolioData.likes.length}</Likes>
          </HeartBox>
        </InfoButtons>
      </TitleSection>

      <ContentSection>
        <LinkDevelperSection>
          <ProjectLinkField>
            <Project>프로젝트 링크</Project>
            <ProjectLink>
              {portfolioData.projectLink
                ? portfolioData.projectLink
                : "프로젝트 링크 없음."}
            </ProjectLink>{" "}
            {/*portfolioInfo에 추가해야함 */}
          </ProjectLinkField>

          <DeveloperField>
            <Developer>개발자</Developer>
            <DevContainer>{renderDeveloperInfo()}</DevContainer>
          </DeveloperField>
        </LinkDevelperSection>

        {showModal && (
          <ModalOverlay className="ModalOverlay">
            <ModalContainer>
              <p>{modalMessage}</p>
              <button onClick={() => setShowModal(false)}>확인</button>
            </ModalContainer>
          </ModalOverlay>
        )}

        <OtherInfoSection>
          <PeriodField>
            <Label>참여 기간</Label>
            <TextBox>
              {portfolioData.startDate} - {portfolioData.endDate}
            </TextBox>
          </PeriodField>

          <ProblemSolvingField>
            <Label>해결하는 문제</Label>
            <TextBox>
              {portfolioData.solving
                ? portfolioData.solving
                : "문제 해결 내용 없음."}
            </TextBox>
            {/*portfolioInfo에 추가해야함*/}
          </ProblemSolvingField>

          <LearnedField>
            <Label>내가 마주친 도전</Label>
            <TextBox>
              {portfolioData.challenge
                ? portfolioData.challenge
                : "배운 점 없음."}
            </TextBox>
            {/*portfolioInfo에 추가해야함*/}
          </LearnedField>

          <LanguagesUsedField>
            <Label>사용한 프로그램</Label>
            <TextBox>
              {portfolioData.usedLanguage
                ? portfolioData.usedLanguage
                : "사용 언어 없음."}
            </TextBox>
            {/*portfolioInfo에 추가해야함*/}
          </LanguagesUsedField>

          <DemoVideoField>
            <Label>데모 비디오</Label>
            {portfolioData.video ? (
              <VideoBox>
                <video width="100%" height="100%" controls>
                  <source src={portfolioData.video} type="video/mp4" />
                  비디오를 지원하지 않는 브라우저입니다.
                </video>
              </VideoBox>
            ) : (
              <VideoBox>비디오 없음</VideoBox>
            )}
          </DemoVideoField>

          <ImagesField>
            <Label>사진</Label>
            <ImageContainer>
                  {portfolioData.images && portfolioData.images.length > 0 ? (
                    portfolioData.images.slice(0, 4).map((image, index) => (
                      <ImageBox key={index}>
                        <img
                          src={sanitizeUrl(`http://localhost:3000/${image}`)}
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
                    <ImageBox>사진 없음</ImageBox>
                  )}
                </ImageContainer>
          </ImagesField>
        </OtherInfoSection>
      </ContentSection>
      {/* 수정 버튼 작성자와 포폴의 아이디가 동일할 경우에만 보이게한다. */}
      {isOwner && (
        <ButtonWrapper2>
          <SubmitButton
            onClick={() => {
              navigate(`/ModifyPortfolioPage/${portfolioId}`);
            }}
          >
            수정
          </SubmitButton>
          <SubmitButton
            onClick={async () => {
              await deleteProject(portfolioId);
              navigate("/Mypage");
            }}
          >
            삭제
          </SubmitButton>
        </ButtonWrapper2>
      )}

      <CommentsSection>
        <CommentsTitle>댓글</CommentsTitle>
        <WritingBox addComment={addComment} />
        <CommentList
          comments={comments}
          setComments={setComments}
          portfolioId={portfolioId}
        />
      </CommentsSection>
    </DetailContainer>
  )
};

export default PortfolioDetailPage;

// Styled Components
const Loading = styled.div`
  display: flex;
  justify-content: center;

  font-size: 1vw;
  font-weight: bold;
`;

const DetailContainer = styled.div`
  width: 85%;
  margin: 0 auto;
`;

const TitleSection = styled.div`
  margin-bottom: 2.5vw;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Logo = styled.h1`
  width: 6vw;
  height: 6vw;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ProjectTitle = styled.h1`
  font-weight: bold;
  font-family: "OTF B";
`;

const ProjectDescription = styled.p``;

const InfoButtons = styled.div`
  display: flex;
  gap: 1vw;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 1.2vh 0;
`;

const Button = styled.button`
  background-color: #0a27a6;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "OTF B";
`;

const HeartBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4vw;
  width: 2vw;

  cursor: pointer;

  font-weight: bold;

  img {
    width: 1.5vw; /* 하트 크기 조정 */
    height: auto; /* 비율 유지 */
    object-fit: contain; /* 이미지를 잘 보이게 */
  }
`;

const Likes = styled.div`
  font-family: "OTF B";
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2vw;
  margin-bottom: 15vh;

  // grid-template-areas:
  //   "projectLink participationPeriod"
  //   "developer   problemSolving"
  //   "    .       learned"
  //   "    .       languagesUsed"
  //   "    .       demoVideo"
  //   "    .       images";
`;

const LinkDevelperSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const OtherInfoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: 3vh;
`;

const Label = styled.label`
  font-weight: bolder;
  font-size: 1.6vw;
  margin-bottom: 8px;
`;

const ProjectLinkField = styled.div`
  margin-bottom: 4vh;

  border: 0.1vw solid #d0d1d9;
  border-radius: 0.3125em;
  box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;
`;

const DeveloperField = styled.div`
  border: 0.1vw solid #d0d1d9;
  border-radius: 0.3125em;
  box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;
`;

const PeriodField = styled(Field)`
  grid-area: participationPeriod;
`;

const ProblemSolvingField = styled(Field)`
  grid-area: problemSolving;
`;

const LearnedField = styled(Field)`
  grid-area: learned;
`;

const LanguagesUsedField = styled(Field)`
  grid-area: languagesUsed;
`;

const DemoVideoField = styled(Field)`
  grid-area: demoVideo;
`;

const ImagesField = styled(Field)`
  grid-area: images;
`;

const TextBox = styled.div`
  background-color: white;
  padding: 0.4vw;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  background-color: #f0f0f0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 100px;
`;

const Project = styled.div`
  margin: 0.8vw;

  //font-family: "OTF B";
  font-weight: bold;
  font-size: 1.2vw;
`;

const ProjectLink = styled.div`
  background-color: #f0f0f0;
  margin: 0.8vw;
  padding: 0.4vw;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80%;
`;

const Developer = styled.div`
  margin: 0.8vw;

  //font-family: "OTF B";
  font-weight: bold;
  font-size: 1.2vw;
`;
const DevContainer = styled.div``;

const DevInfo = styled.div`
  background-color: #f0f0f0;
  margin: 0.8vw;
  padding: 0.4vw;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80%;
`;

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

const VideoBox = styled.div`
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 1px dashed #ccc;
  font-size: 1vw;
`;

const ImageContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const ImageBox = styled.div`
  background-color: #f0f0f0;
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1vw;
`;

const CommentsSection = styled.div`
  margin-top: 6vh;
`;

const CommentsTitle = styled.h2`
  font-weight: bold;
  font-family: "OTF B";
  //margin-bottom: 20px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 80px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CommentButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #0a27a6;
  color: white;
  cursor: pointer;
  margin-top: 5px;
`;

// const Comment = styled.div`
//   margin-top: 20px;
// `;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
`;

const CommentUser = styled.span`
  font-weight: bold;
`;

const CommentTime = styled.span`
  color: gray;
`;

const CommentText = styled.p`
  margin: 10px 0;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 10px;
`;

//css 수정, 삭제 버튼
const ButtonWrapper2 = styled.div`
  display: flex;
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

function sanitizeUrl(url) {
  // Basic URL validation to prevent XSS
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.href;
  } catch (e) {
    return 'about:blank'; // Fallback to a safe URL
  }
}
