import React, { useState } from "react";
import styled from "styled-components";
import arrow from "../../assets/icons/SelectBox/arrow.png";
import StyledButton from "./StyledButton";
//sort 함수 import

const categories = ["프론트엔드", "백엔드", "디자인"];
const sortOptions = ["인기순"];

const SelectBox_NoFilter = ({ onSort }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState(null);

  const handleCategoryClick = (option) => {
    selectedCategory === option //selectedCagory 와 item 비교
      ? setSelectedCategory(null) // item이랑 같으면 null
      : setSelectedCategory(option); // item이랑 다르면 selectedCatgory에 item set
    setIsCategoryOpen(false); // 그리고 카테고리 메뉴를 닫는다.
  };

  const handleSortClick = (option) => {
    selectedSort === option ? setSelectedSort(null) : setSelectedSort(option);
    setIsSortOpen(false);
  };

  return (
    <SelectContainer className="SelectContiner">
      {/* 카테고리 */}
      <SelectWrapper className="SelectWrapper">
        <SelectButton
          // 카테고리 버튼 누르면..
          onClick={() => {
            setIsCategoryOpen(!isCategoryOpen); // isCategoryOpen 토글, true -> false, false -> true
            setIsSortOpen(false); //isSortOpen = false로, 카테고리 버튼 누르면 정렬 메뉴는 닫힌다.
          }}
        >
          {selectedCategory ? selectedCategory : "카테고리"}
          <ArrowImg src={arrow} alt="arrow" />
        </SelectButton>
        <SelectMenu isOpen={isCategoryOpen}>
          {/* styled-components에 prop 전달, isCategoryOpen이 true이면 isOpen이 true 값으로 전달 */}
          {categories.map((item, index) => (
            <SelectItem
              key={index}
              className={selectedCategory === item ? "highlight" : ""}
              onClick={() => handleCategoryClick(item)}
            >
              {item}
            </SelectItem>
          ))}
        </SelectMenu>
      </SelectWrapper>

      {/* 정렬 */}
      <SelectWrapper>
        <SelectButton
          onClick={() => {
            setIsSortOpen(!isSortOpen);
            setIsCategoryOpen(false);
          }}
        >
          {selectedSort ? selectedSort : "정렬"}
          <ArrowImg src={arrow} alt="arrow" />
        </SelectButton>
        <SelectMenu isOpen={isSortOpen}>
          {sortOptions.map((item, index) => (
            <SelectItem
              key={index}
              className={selectedSort === item ? "highlight" : ""}
              onClick={() => handleSortClick(item)}
            >
              {item}
            </SelectItem>
          ))}
        </SelectMenu>
      </SelectWrapper>

      <StyledButtonContainer>
        <StyledButton
          text={"적용"}
          onClick={() => {
            onSort(selectedCategory, selectedSort);
            // 기능구현으로 선택된 카테고리, 정렬, 필터 보냄.
            //sort(selectedCategory, selectedSort);
          }}
        />
      </StyledButtonContainer>
    </SelectContainer>
  );
};

export default SelectBox_NoFilter;

const SelectContainer = styled.div`
  display: flex;
  margin-top: 0.8vh;
  font-weight: 700;
  flex-direction: row;
  position: relative;
  width: 35vw;
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
`;

const SelectButton = styled.button`
  background-color: white;
  border: 0.125em solid #d0d1d9;
  border-radius: 0.75em;
  padding: 0.625em 0em;

  font-size: 0.85vw;
  color: #d0d1d9;
  cursor: pointer;
  text-align: center;

  width: 80%;
  float: left;
`;

const ArrowImg = styled.img`
  width: 1vw;
  margin-left: 1vw;
`;

const SelectMenu = styled.div`
  position: absolute;
  top: 100%;
  width: 80%;
  background-color: #15243e80;
  border-radius: 0.625em;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 1;
  font-size: 0.85vw;
`;

const SelectItem = styled.div`
  margin: 0.625em;
  padding: 0.625em;

  color: white;
  //font-size: 0.85vw;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 0.2em solid transparent;
  border-radius: 0.625em;
  box-sizing: border-box;

  &:hover {
    //border-radius: 0.625em;
    //border: 0.15vw solid #fff;
    background-color: #15243e60;
  }

  &:last-child {
    // border-bottom: none;
  }

  &.highlight {
    border: 0.0625em solid white;
    border-radius: 0.5em;
    padding: 0.75em;
    font-weight: bold;
  }
`;

const StyledButtonContainer = styled.div`
  width: 100%;
`;
