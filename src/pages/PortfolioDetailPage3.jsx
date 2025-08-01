// Entire file content, but only vulnerable parts should be modified minimally
import React, { useEffect, useState, useRef } from "react";
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
import Comment from "../components/domain/Comment";
import saveComment from "../components/features/saveComment";
//기업 연락
import { patchContacts } from "../components/features/recruiterFeatures";
//좋아요
import {
  patchLikes,
  isIncludedLikes,
} from "../components/features/likeFeatures";

import WritingBox from "../components/commmon/PortfolioDetailPage/WritingBox";
import CommentList from "../components/commmon/PortfolioDetailPage/CommentList";

//arrow 이미지
import greaterThanSign from "../assets/images/PortfolioDetailPage3/greaterThanSign.svg";
import lessThanSign from "../assets/images/PortfolioDetailPage3/lessThanSign.svg";

//logo 이미지
import logo from "../assets/icons/Logo.png";
//heart 이미지
import heart_none from "../assets/images/PortfolioDetailPage3/heart-none.svg";
import heart_fill from "../assets/images/PortfolioDetailPage3/heart-fill.svg";
//sample 이미지
import sample from "../assets/images/PortfolioDetailPage3/sample.png";
//sample 비디오
import sampleVideo from "../assets/images/PortfolioDetailPage3/sampleVideo.mp4";

import { deleteProject } from "../components/features/projectFeatures";

const PortfolioDetailPage3 = () => {
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null); //oriProjects로 부터 받아온 포트폴리오
  const [comments, setComments] = useState([]); // oriComments로 부터 받아온 필터된 포트폴리오
  const [enlargedImage, setEnlargedImage] = useState(null); //
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showModal, setShowModal] = useState(false); // "연락" 버튼 눌렀을 때 true
  const [modalMessage, setModalMessage] = useState(""); //"연락" 버튼 눌렀을 때 창에 띄워지는 메세지
  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false); //"좋아요" 눌렀을 때 상태 반영

  const mediaRef = useRef(null); //비디오, 사진 부분 스크롤
  const [currentUser, setLocalCurrentUser] = useState(getCurrentUser()); // 초기값 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    initializeData();
    console.log("초기화된 oriProjects:", oriProjects); // 디버깅용 로그
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
    console.log(portfolio);

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
  }, [oriProjects, oriUsers, oriComments]);

  const scrollLeft = () => {
    if (mediaRef.current) {
      mediaRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (mediaRef.current) {
      const maxScrollLeft =
        mediaRef.current.scrollWidth - mediaRef.current.clientWidth;
      const currentScrollLeft = mediaRef.current.scrollLeft;

      console.log("현재 scrollLeft (이동 전):", currentScrollLeft);

      // 이동할 거리 설정
      const scrollAmount = 300;

      // 현재 위치에서 scrollAmount만큼 이동하지만, 남은 거리가 적으면 끝까지 이동
      const newScrollLeft = Math.min(
        currentScrollLeft + scrollAmount,
        maxScrollLeft
      );

      // 스크롤 이동
      mediaRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });

      setTimeout(() => {
        console.log("현재 scrollLeft (이동 후):", mediaRef.current.scrollLeft);
      }, 500);
    }
  };

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

  // const addComment = (newCommentObj) => {
  //   setComments((prevComments) => [newCommentObj, ...prevComments]);
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
          <Info>{portfolioData.ownerName || "이름 없음.."}</Info>
          <Info>{portfolioData.ownerEmail || "이메일 없음.."}</Info>
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
          <Info>{portfolioData.ownerNickname || "익명"}</Info>
          <Info>example@example.com</Info>
        </>
      );
    }
  };

  if (!portfolioData) {
    return <Loading>로딩 중...</Loading>;
  }

  console.log(portfolioData.projectTemplate);

  return (
    <PageContainer>
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
      </TitleSection>

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

      <DetailContainer>
        <InfoSection>
          <InfoWrapper>
            <InfoField>프로젝트 링크</InfoField>
            <Info>{portfolioData.projectLink || "링크 없음"}</Info>
          </InfoWrapper>
          <InfoWrapper>
            <InfoField>개발자</InfoField>
            <Info>{renderDeveloperInfo()}</Info>
          </InfoWrapper>
          <InfoWrapper>
            <InfoField>참여 기간</InfoField>
            <Info>
              {portfolioData.startDate} - {portfolioData.endDate}
            </Info>
          </InfoWrapper>
          <InfoWrapper>
            <InfoField>사용한 스택</InfoField>
            <Info>{portfolioData.usedLanguage || ""}</Info>
          </InfoWrapper>
        </InfoSection>

        {showModal && (
          <ModalOverlay className="ModalOverlay">
            <ModalContainer>
              <p>{modalMessage}</p>
              <button onClick={() => setShowModal(false)}>확인</button>
            </ModalContainer>
          </ModalOverlay>
        )}

        <MediaContainer>
          <ArrowButton onClick={scrollLeft}>
            <Arrow src={lessThanSign} alt="Scroll Left" />
          </ArrowButton>
          <MediaSection ref={mediaRef}>
            <VideoContainer>
              <DemoVideo>
                <video width="100%" height="100%" controls>
                  <source src={sampleVideo} type="video/mp4" />
                </video>
              </DemoVideo>
            </VideoContainer>

            {portfolioData.images &&
              portfolioData.images.length > 0 &&
              portfolioData.images.slice(0, 4).map((image, index) => (
                <ImageContainer>
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
                </ImageContainer>
              ))}
          </MediaSection>
          <ArrowButton onClick={scrollRight}>
            <Arrow src={greaterThanSign} alt="Scroll Right" />
          </ArrowButton>
        </MediaContainer>

        {enlargedImage && (
          <Overlay onClick={() => setEnlargedImage(null)}>
            <EnlargedImage src={enlargedImage} alt="Enlarged project image" />
          </Overlay>
        )}

        <DescriptionSection>
          <Section>
            <Field>해결하는 문제</Field>
            <Text>{portfolioData.solving || "해결한 문제 없음"}</Text>
          </Section>
          <Section>
            <Field>내가 마주친 도전</Field>
            <Text>{portfolioData.challenge || "도전 내용 없음"}</Text>
          </Section>
        </DescriptionSection>
      </DetailContainer>

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
    </PageContainer>
  );
};
export default PortfolioDetailPage3;

// Styled Components
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

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
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
  font-size: 5vw;
  //font-weight: bold;
  font-family: Impact;
`;

const ProjectDescription = styled.h3`
  font-size: 1.4vw;
  color: #666;
  margin-bottom: 5vh;
`;

const InfoButtons = styled.div`
  display: flex;
  gap: 1vw;
  margin-bottom: 3vh;
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
  //cursor: pointer;
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

const InfoSection = styled.div`
  // display: flex;
  // justify-content: space-around;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 5vh;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-bottom: 2vh;

  font-family: Impact;
`;
const InfoField = styled.div`
  font-size: 2vw;
  font-weight: bold;
`;

const Info = styled.div`
  border-radius: 0.3125em;

  background-color: white;

  padding: 1vw;
  margin: 1vw;
  min-width: 80%;
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

const MediaContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const MediaSection = styled.div`
  display: flex;
  // overflow-x: hidden;

  overflow-x: scroll;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-left: var(--carousel-start-offset);
  scroll-padding-right: var(--carousel-end-offset);
  scrollbar-width: none;

  gap: 1vw;
  padding: 1vw;
  //background-color: rgba(207, 221, 251, 0.33);
  border-radius: 0.3125em;
  margin-bottom: 5vh;
  scroll-behavior: smooth;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  display: flex;
  justify-content: center;
  align-items: center;

  background: white;
  border: none;
  cursor: pointer;
  padding: 1vw;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  z-index: 10;

  &:hover {
    transform: translateY(-50%) scale(1.1);
  }

  &:first-child {
    left: -25px;
  }

  &:last-child {
    right: -25px;
  }
`;

const Arrow = styled.img`
  width: 1.5vw;
  height: 1.5vw;
`;

const VideoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 1vw;
  padding: 1vw;
  flex-shrink: 0;
  overflow-x: auto;
  border-radius: 0.3125em;

  background-color: #0a27a6;
  color: white;
`;

const DemoVideo = styled.div`
  // max-width: 25vw;
  // max-height: 14vh;
  width: 25vw;
  height: 20vh;

  background-color: #0a27a6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3125em;
  overflow: hidden;
  flex-shrink: 0;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 1vw;
  padding: 1vw;
  flex-shrink: 0;
  overflow-x: auto;
  border-radius: 0.3125em;

  background-color: #0a27a6;
  color: white;
`;

const ImageBox = styled.div`
  border-radius: 0.3125em;
  // max-width: 25vw;
  // max-height: 20vh;
  width: 25vw;
  height: 20vh;

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const EnlargedImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
`;

const DescriptionSection = styled.div`
  margin-bottom: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2vw 1vw;

  font-family: Impact;
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

const CommentsSection = styled.div`
  margin-top: 20px;
`;

const CommentsTitle = styled.h2`
  font-size: 18px;
`;

const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  padding: 50px;
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
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.href;
  } catch (e) {
    console.error("Invalid URL:", url);
    return "";
  }
}
