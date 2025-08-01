import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { recruiterProjectDataList } from "../features/dataList"; // dataList를 import 할 경로 지정

import searchImg from "../../assets/icons/Header/search.png";
import { ImCancelCircle } from "react-icons/im";

// //나중에 삭제
// const dataList = [
//   "공유자",
//   "이름",
//   "템플릿",
//   "포트폴리오",
//   "폴리오프레임",
//   "마라탕후루",
// ];

const RecruiterPageSearchBar = ({ userId, onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [nowIndex, setNowIndex] = useState(-1);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue); // 입력 값을 상태에 저장

    if (newValue.trim()) {
      // dataList 함수로부터 자동완성 결과 가져오기
      const results = Array.from(
        recruiterProjectDataList(newValue, userId) || []
      );
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
    setNowIndex(-1); // 검색어가 바뀔 때 인덱스를 초기화
  };

  const handleSearchClick = () => {
    console.log(inputValue);
    console.log(suggestions);
    onSearch(inputValue);
  };

  const handleCancelClick = () => {
    setInputValue("");
    setSuggestions([]);
    console.log("검색어 초기화");
    //search(inputValue);
  };

  const handleKeyUp = (e) => {
    if (e.key === "ArrowUp") {
      setNowIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "ArrowDown") {
      setNowIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === "Enter" && nowIndex >= 0) {
      setInputValue(suggestions[nowIndex]);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (!inputValue) {
      setSuggestions([]);
    }
  }, [inputValue]);

  return (
    <SearchBarContainer>
      <SearchBarWrapper className="SearchBarWrapper">
        <SearchInput
          value={inputValue} // 입력 필드가 상태와 동기화
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
          placeholder="포트폴리오 이름 검색"
          spellCheck="false"
        />
        <IconWrapper>
          {inputValue && (
            <CancelIconWrapper onClick={handleCancelClick}>
              <ImCancelCircle />
            </CancelIconWrapper>
          )}
          <SearchIcon
            onClick={handleSearchClick}
            src={searchImg}
            alt="search"
          />
        </IconWrapper>
      </SearchBarWrapper>
      {suggestions.length > 0 && (
        <AutoCompleteContainer className="AutoCompleteContainer">
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={index}
              className={index === nowIndex ? "active" : ""}
              onMouseDown={() => setInputValue(suggestion)}
            >
              {suggestion
                .split(new RegExp(`(${inputValue})`, "g"))
                .map((part, i) =>
                  part.toLowerCase() === inputValue.toLowerCase() ? (
                    <HighlightedText key={i}>{part}</HighlightedText>
                  ) : (
                    part
                  )
                )}
            </SuggestionItem>
          ))}
        </AutoCompleteContainer>
      )}
    </SearchBarContainer>
  );
};

export default RecruiterPageSearchBar;

const SearchBarContainer = styled.div`
  margin-top: 0.8vh;
  width: 30vw;
`;
const SearchBarWrapper = styled.div`
  width: 25vw;
  height: 2.5em;

  border: 0.0625em solid #c8c8c8;
  box-shadow: 0em 0.0625em 0.25em rgba(12, 12, 13, 0.1),
    0em 0.0625em 0.25em rgba(12, 12, 13, 0.05);
  border-radius: 62.5em;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 0.625em;
`;

const SearchInput = styled.input`
  width: 85%;
  font-family: "Inria Sans", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 1vw;
  line-height: 1em;
  color: #919194;
  border: none;
  outline: none;
  background: none;
`;

const IconWrapper = styled.div`
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const CancelIconWrapper = styled.div`
  width: 1.9vw;
  color: #d0d1d9;

  cursor: pointer;
`;

const SearchIcon = styled.img`
  width: 1.9vw;
  border-radius: 50%;

  cursor: pointer;
`;

const AutoCompleteContainer = styled.div`
  position: absolute;
  right: 11.9%;
  display: flex;
  flex-direction: column;

  width: 26vw;
  background: #e9eaee;
  color: #919194;

  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.625em;
  margin-top: 0.5rem;
`;

const SuggestionItem = styled.div`
  padding: 0.2rem 0.6rem;
  //background: #f1f3f499;
  cursor: pointer;

  display: block &.active {
    background: #e0e5f6;
    color: #000;
  }

  &:hover {
    background: #e0e5f6;
  }
`;

const HighlightedText = styled.span`
  font-weight: bold;
  color: #0a27a6;
`;
