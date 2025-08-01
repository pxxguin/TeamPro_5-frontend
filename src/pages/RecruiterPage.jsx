import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import TemplateCard from "../components/commmon/TemplateCard";
import RecruiterSection from "../components/RecruiterPage/RecruiterSection";

import {
  initializeData,
  oriUsers,
  oriProjects,
  recSearchSortManager,
} from "../components/domain/startProgram";
import {
  getCurrentUser,
  setCurrentUser,
} from "../components/features/currentUser";

function RecruiterPage() {
  const [myPortfolioList, setMyPortfolioList] = useState([]); // 상태로 관리되는 포트폴리오 리스트
  const { userId } = useParams();
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
    //console.log("Recruiter userId:", userId);
    initializeData();

    if (userId) {
      const updatedUser = getCurrentUser();
      if (updatedUser) {
        setLocalCurrentUser(updatedUser); // 로컬 상태 업데이트
        setCurrentUser(updatedUser); // localStorage에 반영
        recSearchSortManager.updateContacts(updatedUser.contacts); // 매니저에 업데이트된 contacts 전달
      }
      console.log("CurrentUser: ", updatedUser);

      const userPortfolios = Array.from(oriProjects.values()).filter(
        (project) =>
          project.contacts.some(
            (contact) =>
              contact === updatedUser.id || contact === updatedUser.email
          )
      );
      console.log("User Portfolios:", userPortfolios);
      setMyPortfolioList(userPortfolios);

      const initialList = recSearchSortManager.sort(null, null, []);
      setMyPortfolioList(linkedListToArray(initialList));
    }
  }, [oriProjects]);

  const handleSearchApply = (searchTerm) => {
    const searchedPortfolios = recSearchSortManager.search(searchTerm);
    setMyPortfolioList(linkedListToArray(searchedPortfolios));
  };

  const handleSortApply = (category, sortOption, filterOption) => {
    const sortedPortfolios = recSearchSortManager.sort(
      category,
      sortOption,
      filterOption
    );
    setMyPortfolioList(linkedListToArray(sortedPortfolios));
  };

  // 템플릿카드 렌더링
  const renderTemplateCard = (item) => (
    <TemplateCard
      key={item.projectId}
      portfolioId={item.projectId}
      templateButton={"보기"}
    />
  );

  return (
    <MyPageContainer className="MyPageContainer">
      <RecruiterSection
        title={"내가 연락한 포트폴리오"}
        data={myPortfolioList}
        renderItem={renderTemplateCard}
        button={true}
        onSearch={handleSearchApply}
        onSort={handleSortApply}
        userId={userId}
      />

      <RecruiterSection title={"내가 찜한 포트폴리오"} button={false} />
    </MyPageContainer>
  );
}

export default RecruiterPage;

const MyPageContainer = styled.div`
  width: 85%; //수정중...
  margin: 0 auto;
`;
