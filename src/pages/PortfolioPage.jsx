import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import SearchBar from "../components/commmon/SearchBar";
import SelectBox from "../components/commmon/SelectBox";
import TemplateCard from "../components/commmon/TemplateCard";
import StyledButton from "../components/commmon/StyledButton";
import { dummydata } from "../components/commmon/dummydata/dummydata"; // dummydata 파일을 import
import { Navigate, useNavigate } from "react-router-dom";
import {
  oriProjects,
  searchSortManager,
  initializeData,
} from "../components/domain/startProgram";
//import { initializeData } from "../components/domain/startProgram";

import PageHeader from "../components/commmon/PageHeader";
import {
  getCurrentUser,
  setCurrentUser,
} from "../components/features/currentUser";

const PortfolioPage = () => {
  const navigate = useNavigate();

  const [sharedPortfolioList, setsharedPortfolioList] = useState([]);

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
    initializeData();
    const sharedPortfolios = Array.from(oriProjects.values()).filter(
      (portfolio) => portfolio.share === true
    );
    console.log(sharedPortfolios);
    setsharedPortfolioList(sharedPortfolios);

    const initialList = searchSortManager.sort(null, null, sharedPortfolios);
    setsharedPortfolioList(linkedListToArray(initialList));
  }, []);

  const handleSortApply = (category, sortOption, filterOption) => {
    const sortedLinkedList = searchSortManager.sort(
      category,
      sortOption,
      filterOption
    );
    setsharedPortfolioList(linkedListToArray(sortedLinkedList));
  };

  const handleSearchApply = (searchTerm) => {
    const searchedLinkedList = searchSortManager.search(searchTerm);
    setsharedPortfolioList(linkedListToArray(searchedLinkedList));
  };

  const handleCancelSearch = () => {
    const resetList = searchSortManager.resetToLatest(); // 최신순 정렬된 리스트
    setsharedPortfolioList(linkedListToArray(resetList));
  };

  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const currentUser = getCurrentUser();

  const handleCreatePortfolioClick = () => {
    console.log(currentUser);
    if (!currentUser?.email || !currentUser?.nickname) {
      alert("이메일과 닉네임을 등록해 주세요.");
    } else {
      navigate("/CreatePortfolioPage");
    }
  };

  return (
    <TemplatePageContainer className="TemplatePageContainer">
      <PageHeader
        pageTitle="Portfolio"
        onSearch={handleSearchApply}
        onCancelSearch={handleCancelSearch}
      />

      <SelectBoxWrapper>
        <SelectBox onSort={handleSortApply} />
      </SelectBoxWrapper>
      <Line></Line>
      <TemplateGridWrapper>
        {sharedPortfolioList.length === 0 ? (
          <EmptyGridItem>
            <Text>검색 결과가 없습니다.</Text>
          </EmptyGridItem>
        ) : (
          <TemplateGrid>
            {sharedPortfolioList
              .filter((portfolio) => portfolio.share === true)
              .map((portfolio) => (
                <TemplateCard
                  key={portfolio.projectId}
                  portfolioId={portfolio.projectId}
                  templateButton={"보기"}
                />
              ))}
          </TemplateGrid>
        )}
      </TemplateGridWrapper>

      <ButtonWrapper>
        {/* 포트폴리오 제작 페이지로 넘어갈 수 있는 버튼 추가 */}
        {accessToken && currentUser?.recruiter === false && (
          <StartButton onClick={handleCreatePortfolioClick}>
            포트폴리오 제작하기
          </StartButton>
        )}
      </ButtonWrapper>
    </TemplatePageContainer>
  );
};

export default PortfolioPage;

const TemplatePageContainer = styled.div`
  width: 85%; //수정중...
  margin: 0 auto;
`;

const SelectBoxWrapper = styled.div`
  display: flex;
  align-items: center;

  margin-top: 10vh;
`;

const TemplateGridWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  // margin-top: 2em;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  //place-content: center center;
  //justify-content: center;
  gap: 3vw 1vw;

  margin-top: 2em;
  width: 100%;
`;

const Line = styled.hr`
  margin: 0.625em 0;
  border: 1px solid #d0d1d9;
`;

const StartButton = styled.button`
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

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const EmptyGridItem = styled.div`
  grid-column: 1 / -1; /* 그리드 전체 열을 차지 */
  display: grid; /* Flex 대신 Grid 사용 */
  place-content: center; /* Grid로 중앙 정렬 */

  margin-top: 5vh;
`;

const Text = styled.div`
  font-size: 1.5vw;
  font-family: "OTF R";
  align-items: center;
  width: 100%;
  height: 100%;
`;
