import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DashBoard from "../components/MyPage/DashBoard";
import MyPageSection from "../components/MyPage/MyPageSection";
import TemplateCard from "../components/commmon/TemplateCard";
import HackTemplateCard from "../components/commmon/HackTemplateCard";
import PortfolioTemplateCard from "../components/commmon/PortfolioTemplateCard";

import {
  initializeData,
  oriProjects,
  oriHackathons,
  oriPortfolios,
  myProjectsSearchSortManager,
  hackathonSearchSortManeger,
} from "../components/domain/startProgram";
import {
  getCurrentUser,
  setCurrentUser,
} from "../components/features/currentUser";

function MyPage() {
  const [myPortfolioList, setmyPortfolioList] = useState([]); // 상태로 관리되는 포트폴리오 리스트
  const [myHackathonList, setmyHackathonList] = useState([]);
  const [myPortfoliosList, setMyPortfoliosList] = useState([]);
  const [currentUser, setLocalCurrentUser] = useState(getCurrentUser()); // 초기값 가져오기

  //LinkedList를 배열로 바꾸는 함수
  const linkedListToArray = (linkedList) => {
    const array = [];
    let currentNode = linkedList.head;
    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }
    return array;
  };

  useEffect(() => {
    initializeData(); // 데이터를 초기화
    if (currentUser) {
      console.log("Current User:", currentUser);

      // console.log(oriProjects);
      const userProjects = Array.from(oriProjects.values()).filter(
        (project) =>
          project.ownerId === currentUser.id ||
          project.ownerEmail === currentUser.email
      );

      setmyPortfolioList(userProjects);

      const userHackathons = Array.from(oriHackathons.values()).filter(
        (hackathon) =>
          hackathon.ownerId === currentUser.id ||
          hackathon.ownerEmail === currentUser.email
      );
      console.log("User Hackathons:", userHackathons);
      setmyHackathonList(userHackathons);

      const userPortfolios = Array.from(oriPortfolios.values()).filter(
        (portfolio) =>
          portfolio.ownerId === currentUser.id ||
          portfolio.ownerEmail === currentUser.email
      );
      setMyPortfoliosList(userPortfolios);

      //
      // myProjectsSearchSortManager.updateUserData(currentUser.id);
      // const initialList = myProjectsSearchSortManager.sort(null, null, []);
      // setmyPortfolioList(linkedListToArray(initialList));

      //해커톤 초기화
      // hackathonSearchSortManeger.updateUserData(currentUser.id);
      //const hackInitialList = hackathonSearchSortManeger.sort(null, null, []);
      //setmyHackathonList(linkedListToArray(hackInitialList));

      console.log("User Portfolios:", userPortfolios);
    }
  }, [currentUser]);

  const handleMyProjectSearchApply = (searchTerm) => {
    const searchedPortfolios = myProjectsSearchSortManager.search(searchTerm);
    setmyPortfolioList(linkedListToArray(searchedPortfolios));
  };

  const handleMyHackathonSearchApply = (searchTerm) => {
    const searchedHackathons = hackathonSearchSortManeger.search(searchTerm);
    setmyHackathonList(linkedListToArray(searchedHackathons));
  };

  const handleMyProjectSortApply = (category, sortOption, filterOption) => {
    const sortedPortfolios = myProjectsSearchSortManager.sort(
      category,
      sortOption,
      filterOption
    );
    setmyPortfolioList(linkedListToArray(sortedPortfolios));
  };

  // 템플릿카드 렌더링
  const renderTemplateCard = (item) => (
    <TemplateCard
      key={item.projectId}
      portfolioId={item.projectId}
      templateButton={"보기"}
    />
  );
  const renderHackTemplateCard = (item) => (
    <HackTemplateCard
      key={item.hackId}
      hackId={item.hackId}
      templateButton={"보기"}
    />
  );
  const renderPortTemplateCard = (item) => (
    <PortfolioTemplateCard
      key={item.portfolioId}
      portfolioId={item.portfolioId}
      templateButton={"보기"}
    />
  );
  return (
    <MyPageContainer className="MyPageContainer">
      <DashBoardContainer>
        <DashBoard name={currentUser.name} nickname={currentUser.nickname} />
      </DashBoardContainer>
      {!currentUser.recruiter && (
        <>
          <MyPageSection
            title={"내가 만든 프로젝트"}
            data={myPortfolioList}
            renderItem={renderTemplateCard}
            button={true}
            buttonKey={"프로젝트"}
            onSearch={handleMyProjectSearchApply}
            onSort={handleMyProjectSortApply}
            userId={currentUser?.id}
            userEmail={currentUser?.email}
            userNickname={currentUser?.nickname}
          />

          <MyPageSection
            title={"내가 만든 포트폴리오"}
            data={myPortfoliosList}
            renderItem={renderPortTemplateCard}
            button={true}
            buttonKey={"포트폴리오"}
            //onSearch={handleMyProjectSearchApply}
            //onSort={handleMyProjectSortApply}
            //userId={currentUser?.id}
          />
          <MyPageSection
            title={"내가 만든 해커톤"}
            data={myHackathonList}
            renderItem={renderHackTemplateCard}
            button={true}
            buttonKey={"해커톤"}
            // onSearch={handleMyHackathonSearchApply}
          />
        </>
      )}
    </MyPageContainer>
  );
}

export default MyPage;

const MyPageContainer = styled.div`
  width: 85%; //수정중...
  margin: 0 auto;
`;

const DashBoardContainer = styled.div`
  display: flex;
`;
