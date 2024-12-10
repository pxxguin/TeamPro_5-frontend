import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";
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

//image
import Notepad3 from "../assets/images/PortfolioDetailPage2/Notepad3.png";
import Notepad5 from "../assets/images/PortfolioDetailPage2/Notepad5.png";
import Notepad12 from "../assets/images/PortfolioDetailPage2/Notepad12.png";
import Notepad16 from "../assets/images/PortfolioDetailPage2/Notepad16.png";

//heart 이미지
import heart_none from "../assets/images/PortfolioDetailPage3/heart-none.svg";
import heart_fill from "../assets/images/PortfolioDetailPage3/heart-fill.svg";

import { deleteProject } from "../components/features/projectFeatures";

const PortfolioDetailPage2 = () => {
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [comments, setComments] = useState([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showModal, setShowModal] = useState(false); // "연락" 버튼 눌렀을 때 true
  const [modalMessage, setModalMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false); //"좋아요" 눌렀을 때 상태 반영

  const [currentUser, setLocalCurrentUser] = useState(getCurrentUser()); // 초기값 가져오기
  const navigate = useNavigate();
  useEffect(() => {
    initializeData();
    //project ID 사용해서 포트폴리오 데이터 가져오기
    const portfolio = oriProjects.get(Number(portfolioId));
    console.log("portfolioId: ", Number(portfolioId));
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
    setComments(filteredComments);

    console.log(portfolio);
  }, [oriProjects, oriUsers, oriComments]);

  useEffect(() => {
    console.log("portfolioData:", portfolioData);
    console.log("currentUser.email:", currentUser.email);
    console.log("portfolioId: ", Number(portfolioId));

    if (portfolioData && portfolioData.ownerEmail === currentUser.email) {
      console.log("작성자 일치");
      setIsOwner(true);
    } else {
      console.log("작성자 불일치");
      setIsOwner(false);
    }
  }, [currentUser.email, portfolioData]);

  // const addComment = (newCommentObj) => {
  //   // const newComment = {
  //   //   commentId: Date.now(),
  //   //   portfolioId: Number(portfolioId),
  //   //   userId: currentUser.id,
  //   //   text: newCommentObj.text,
  //   //   date: new Date().toISOString(),
  //   // };

  //   // 클라이언트 측 상태 업데이트
  //   //oriComments.set(newComment.commentId, newComment);
  //   setComments((prevComments) => [newCommentObj, ...prevComments]);

  //   // 파일에 댓글 저장
  //   saveComment(Number(portfolioId), newCommentObj.userId, newCommentObj.text);
  // };

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

  //기업 연락
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

  // console.log(portfolioData.projectTemplate);

  if (!portfolioData) {
    return <Loading>로딩 중...</Loading>;
  }
  return (
    <>
      <MainWrapper>
        <TitleWrapper>
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
          <ProjectTitle>{portfolioData.projectTitle}</ProjectTitle>
          <ProjectDescription>{portfolioData.description}</ProjectDescription>
        </TitleWrapper>

        <Maincomponent>
          <Wrapper1>
            <Label1Wrapper>
              {/* 참여기간 */}
              <PeriodText>참여기간</PeriodText>
              <Image3 src={Notepad3} alt="Notepad3" />
              <Bar>
                {portfolioData.startDate} - {portfolioData.endDate}
              </Bar>
            </Label1Wrapper>
            {/* 사용한 언어 */}
            <Label1Wrapper>
              <PeriodText>사용한 언어</PeriodText>
              <Image3 src={Notepad3} alt="Notepad3" />
              <Bar>{portfolioData.usedLanguage}</Bar>
            </Label1Wrapper>
            {/* 프로젝트 링크 */}
            <Label1Wrapper>
              <PeriodText>프로젝트 링크</PeriodText>
              <Image3 src={Notepad3} alt="Notepad3" />
              <Bar>{portfolioData.projectLink}</Bar>
            </Label1Wrapper>

            <Label2Wrapper>
              {/* 사진  등록된 사진의 갯수에 따라서 생성*/}
              <PhotoWrappeer>
                <PhotoText>사진</PhotoText>
                <Image3 src={Notepad12} alt="Notepad12" />
                <ImageContainer>
                  {portfolioData.images && portfolioData.images.length > 0 ? (
                    portfolioData.images.slice(0, 4).map((image, index) => (
                      <ImageBox key={index}>
                        <img
                          src={`http://localhost:3000/${image}`}
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
                    <ImageBox>+</ImageBox>
                  )}
                </ImageContainer>
              </PhotoWrappeer>

              {/* 로고 */}
              <LogoWrappeer>
                <PhotoText>로고</PhotoText>
                <Image3 src={Notepad12} alt="Notepad12" />
                <LogoContainer>
                <ImageBox>
                  {portfolioData.logo ? (
                    <img
                      src={`http://localhost:3000/${portfolioData.logo}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <p>+</p>
                  )}
                </ImageBox>
                </LogoContainer>
              </LogoWrappeer>

              {/* 데모 비디오 */}
              <VideoWrappeer>
                <VideoText>데모 비디오</VideoText>
                <Image3 src={Notepad12} alt="Notepad12" />
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
              </VideoWrappeer>
            </Label2Wrapper>

            {/* 개발자 개인정보 */}
            <InfoWrapper>
              <Image16 src={Notepad16} alt="Notepad16" />
              {/* <Bar>{portfolioData.ownerName} </Bar>
              <Bar>
                {portfolioData.ownerEmail
                  ? portfolioData.ownerEmail
                  : "이메일 없음."}{" "}
              </Bar> */}
              {renderDeveloperInfo()}
            </InfoWrapper>
          </Wrapper1>

          {showModal && (
            <ModalOverlay className="ModalOverlay">
              <ModalContainer>
                <p>{modalMessage}</p>
                <button onClick={() => setShowModal(false)}>확인</button>
              </ModalContainer>
            </ModalOverlay>
          )}

          <Wrapper2>
            {/* 배운점 */}
            <LearnedWrapper>
              <LearnedText>배운점</LearnedText>
              <Image5 src={Notepad5} alt="Notepad5" />
              <TextBox>
              {portfolioData.challenge
                ? portfolioData.challenge
                : "배운점 없음."}
            </TextBox>
            </LearnedWrapper>
            {/* 문제설명 */}
            <ProblemWrapper>
              <ProblemText>해결한 점</ProblemText>
              <Image5 src={Notepad5} alt="Notepad5" />
              <TextBox>
              {portfolioData.solving
                ? portfolioData.solving
                : "문제 해결 내용 없음."}
            </TextBox>
            </ProblemWrapper>
          </Wrapper2>
        </Maincomponent>
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
      </MainWrapper>

      {/* 댓글 */}
      <CommentsSection>
        <CommentsTitle>댓글</CommentsTitle>
        <WritingBox addComment={addComment} />
        {/* <CommentList
          comments={comments}
          setComments={setComments}
          portfolioId={portfolioId}
        /> */}
        <CommentList comments={comments} setComments={setComments} />
      </CommentsSection>
    </>
  );
};

export default PortfolioDetailPage2;

//css Wrapper
const MainWrapper = styled.div`
  width: 80%;
  padding: 40px 40px;
  margin: 0 auto;

  border: 5px solid #000;
  border-radius: 2em;
  height: 80%;

  display: flex;
  flex-direction: column;
  // align-items: center;
`;
const Maincomponent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
`;
const Loading = styled.div`
  display: flex;
  justify-content: center;

  font-size: 1vw;
  font-weight: bold;
`;
const TitleWrapper = styled.div`
  margin-bottom: 2.5vw;
`;
const Label1Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;
const Label2Wrapper = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Wrapper1 = styled.div`
  width: 60%;
  margin-right: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
  }
`;
const Wrapper2 = styled.div`
  width: 80%;
  margin-top: 2em;
  gap: 5em;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
  }
`;
const LearnedWrapper = styled.div`
  width: 100%;
  height: 20em;
  border: 3px solid #000;
  border-radius: 2em;
  position: relative;
`;
const ProblemWrapper = styled.div`
  width: 100%;
  height: 20em;
  border: 3px solid #000;
  border-radius: 2em;
  position: relative;
`;
const GridContainer = styled.div`
  display: grid;
  gap: 1em;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
`;

const ImageContainer = GridContainer;
const LogoContainer = GridContainer;

const PhotoWrappeer = styled.div`
  display: flex;
  flex-direction: column;
`;
const LogoWrappeer = styled.div`
  display: flex;
  flex-direction: column;
`;
const VideoWrappeer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1em;
`;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: -2em;
  margin-top: 6em;
`;

const ButtonWrapper = styled.div`
  display: flex;
  //justify-content: center;
  //align-items: center;

  margin: 2vh 0.5vw;
`;

//css button
const InfoButtons = styled.div`
  display: flex;
  gap: 1vw;
`;
const Button = styled.button`
  background-color: #000;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "OTF R";
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

// css component
const Bar = styled.p`
  position: relative;
  font-size: 1em;
  margin: 0;
  margin-top: 2.5em;
  font-family: "OTF R";

  &::after {
    content: "";
    display: block;
    width: 10em;
    height: 0.08em;
    background-color: #000;
    position: absolute;
    left: 0;
  }
`;
const ImageBox = styled.div`
  width: 5em;
  height: 5em;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1vw;
  border-radius: 1em;
  overflow: hidden;
`;
const VideoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  border: 3px solid #000;
  border-radius: 1em;
  font-size: 1vw;
  width: 40em;
  height: 15em;
`;

const DevInfo = styled.div`
  background-color: #f0f0f0;
  margin: 0.8vw;
  padding: 0.4vw;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80%;
`;
//css image
const Image3 = styled.img`
  width: 10em;
  height: auto;
  margin-right: 1em;
  margin-top: 0.2em;
`;
const Image5 = styled.img`
  width: 10em;
  height: auto;
  margin-top: -10%;
  margin-left: 30%;
`;
const Image16 = styled.img`
  width: 4em;
  height: auto;
  margin-top: -2.3em;
`;

//css text
const ProjectTitle = styled.h1`
  font-weight: bold;
  font-family: "OTF B";
`;

const ProjectDescription = styled.p`
  font-weight: bold;
  font-family: "OTF B";
  margin-top: -0.5em;
`;

const PeriodText = styled.p`
  position: absolute;
  top: 0px;
  font-size: 1em;
  font-weight: bold;
  color: #fff;
  margin-left: 3.6em;
  margin-top: 1.8em;
  font-family: "OTF R";
`;

const LearnedText = styled.p`
  position: absolute;
  top: 0px;
  font-size: 1em;
  font-weight: bold;
  color: #000;
  margin-top: -2%;
  margin-left: 42.5%;
  font-family: "OTF R";
`;

const ProblemText = styled.p`
  position: absolute;
  top: 0px;
  font-size: 1em;
  font-weight: bold;
  color: #000;
  margin-top: -2%;
  margin-left: 42.5%;
  font-family: "OTF R";
`;

const PhotoText = styled.p`
  position: absolute;
  // top: -2%;
  left: 2.5em;
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
  font-family: "OTF R";

  @media (max-width: 768px) {
    font-size: 1.2em;
    top: -2%;
    left: 8%;
  }

  @media (max-width: 480px) {
    font-size: 1em;
    top: 6%;
    left: 5%;
  }
`;

const LogoText = styled.p`
  position: absolute;
  // top: 22%;
  left: 2.5em;
  font-size: 1.5em;
  font-weight: bold;
  color: #000;
  font-family: "OTF R";

  @media (max-width: 768px) {
    font-size: 1.2em;
    top: 30%;
    left: 8%;
  }

  @media (max-width: 480px) {
    font-size: 1em;
    top: 33%;
    left: 5%;
  }
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

// 댓글 css
const CommentsSection = styled.div`
  width: 85%;
  padding: 40px 40px;
  margin: 0 auto;

  margin-top: 6vh;
`;
const CommentsTitle = styled.h2`
  font-weight: bold;
  font-family: "OTF B";
  //margin-bottom: 20px;
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

  background-color: #000;
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

const TextBox = styled.div`
  background-color: white;
  padding: 0.4vw;
  // border: 1px solid #ccc;
  border-radius: 4px;
`;