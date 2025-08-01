import React, { useEffect, useState } from "react";
import styled from "styled-components";

import HackPageHeader from "../components/commmon/HackPageHeader.jsx";
import HackTemplateCard from "../components/commmon/HackTemplateCard.jsx";
import { dummydata } from "../components/commmon/dummydata/dummydata";
//import SelectBox from "../components/commmon/SelectBox.jsx";
import SelectBox_NoFilter from "../components/commmon/SelectBox _NoFilter.jsx";
import HackSearchBar from "../components/commmon/HackSearchBar";
import StyledButton from "../components/commmon/StyledButton";
import HackathonPageSlide from "../components/HackathonPage/HackathonPageSlide.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  setCurrentUser,
} from "../components/features/currentUser";

import {
  oriHackathons,
  hackathonSearchSortManeger,
  initializeData,
} from "../components/domain/startProgram";

const HackathonPage = () => {
  const navigate = useNavigate();

  const [sharedHackathonList, setsharedHackathonList] = useState([]);

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
    console.log("oriHackathons 값:", oriHackathons); //-> O

    const sharedHackathonArray = Array.from(oriHackathons.values()); // Map을 배열로 변환
    console.log("sharedHackathonArray 값:", sharedHackathonArray); //-> O

    setsharedHackathonList(sharedHackathonArray); // 상태 업데이트

    const initialList = hackathonSearchSortManeger.sort(null, null);
    setsharedHackathonList(linkedListToArray(initialList));
  }, []);

  const handleSortApply = (category, sortOption) => {
    const sortedLinkedList = hackathonSearchSortManeger.sort(
      category,
      sortOption
    );
    setsharedHackathonList(linkedListToArray(sortedLinkedList));
  };

  const handleSearchApply = (searchTerm) => {
    const searchedLinkedList = hackathonSearchSortManeger.search(searchTerm);
    setsharedHackathonList(linkedListToArray(searchedLinkedList));
  };

  const handleCancelSearch = () => {
    const resetList = hackathonSearchSortManeger.resetToLatest(); // 최신순 정렬된 리스트
    setsharedHackathonList(linkedListToArray(resetList));
  };

  const currentUser = getCurrentUser();

  return (
    <>
      <HackPageHeader
        pageTitle="Hackathon"
        onSearch={handleSearchApply}
        onCancelSearch={handleCancelSearch}
      />
      <MainWrapper>
        <SelectBoxWrapper>
          <SelectBox_NoFilter onSort={handleSortApply} />
        </SelectBoxWrapper>
        <Line></Line>

        {/* 12개의 카드를 그리드 형태로 출력 */}
        <HackathonGridWrapper>
          <TemplateGridWrapper>
            <TemplateGrid>
              {sharedHackathonList.map((Hackathon) => (
                <HackTemplateCard
                  key={Hackathon.hackId}
                  hackId={Hackathon.hackId}
                  templateButton={"보기"}
                />
              ))}
            </TemplateGrid>
          </TemplateGridWrapper>
        </HackathonGridWrapper>
        {/* 기존 해커톤 */}
        <Line2></Line2>

        <HackathonPageSlide />

        <ButtonWrapper>
          {/* 포트폴리오 제작 페이지로 넘어갈 수 있는 버튼 추가 */}
          <StartButton onClick={() => navigate("/CreateHackathonPage")}>
            해커톤 제작하기
          </StartButton>
        </ButtonWrapper>
      </MainWrapper>
    </>
  );
};

export default HackathonPage;

//css Wrapper

const MainWrapper = styled.div`
  width: 85%; //수정중...
  margin: 0 auto;
`;
const PageCategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;
const SelectBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10vh;
`;
const MyTemplateMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10vh;
`;

const HackathonGridWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const TemplateGridWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
//css buttom
const StartButton = styled.button`
  color: #fff;
  font-size: 1em;
  font-weight: 800;
  border-radius: 2em;
  border: none;
  background-color: #0a27a6;
  height: 3em;
  width: 20%;
  font-family: "OTF R";

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

//css element
const SearchInput = styled.input`
  border-radius: 2em;
  border: 1px solid #d0d1d9;
  height: 3em;
  width: 50%;
  text-indent: 1em;
  outline: none;
  &::placeholder {
    text-indent: 1em;
  }
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
const Line2 = styled.hr`
  margin: 5em 0 0 0;
  border: 1px solid #d0d1d9;
`;
//css Text
const HeaderText = styled.p`
  color: #0a27a6;
  font-size: 2em;
  font-weight: 800;
  font-family: "OTF B";
`;
