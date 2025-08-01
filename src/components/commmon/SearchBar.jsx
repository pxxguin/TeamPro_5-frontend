import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { dataList } from "../features/dataList"; // dataList를 import 할 경로 지정
import { searchSortManager } from "../domain/startProgram";

import searchImg from "../../assets/icons/Header/search.png";
import { ImCancelCircle } from "react-icons/im";

//나중에 삭제
// const dataList = [
//   "공유자",
//   "이름",
//   "템플릿",
//   "포트폴리오",
//   "폴리오프레임",
//   "마라탕후루",
// ];

const SearchBar = ({ onSearch, onCancelSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [nowIndex, setNowIndex] = useState(-1);

  const searchBarRef = useRef(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue); // 입력 값을 상태에 저장

    if (newValue.trim()) {
      // dataList 함수로부터 자동완성 결과 가져오기
      const results = Array.from(dataList(newValue) || []);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
    setNowIndex(-1); // 검색어가 바뀔 때 인덱스를 초기화
  };

  const handleSearchClick = () => {
    console.log(inputValue);
    console.log(suggestions);
    onSearch(inputValue); // PortfolioPage로 검색어 전달
  };

  const handleCancelClick = () => {
    setInputValue("");
    setSuggestions([]);
    console.log("검색어 초기화");
    //search(inputValue);
    if (onCancelSearch) {
      onCancelSearch(); // 최신순 정렬 실행
    }
  };

  //기존 코드
  // const handleKeyUp = (e) => {
  //   if (e.key === "ArrowUp") {
  //     setNowIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  //   } else if (e.key === "ArrowDown") {
  //     setNowIndex((prevIndex) =>
  //       Math.min(prevIndex + 1, suggestions.length - 1)
  //     );
  //   } else if (e.key === "Enter" && nowIndex >= 0) {
  //     setInputValue(suggestions[nowIndex]);
  //     setSuggestions([]);
  //   }
  // };

  // 키보드 검색어 이동
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setNowIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setNowIndex((prevIndex) =>
        prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter" && nowIndex >= 0) {
      setInputValue(suggestions[nowIndex]);
      setSuggestions([]);
      setNowIndex(-1);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setNowIndex(-1);
    }
  };

  // useEffect(() => {
  //   if (!inputValue) {
  //     setSuggestions([]);
  //   }
  // }, [inputValue]);

  useEffect(() => {
    if (nowIndex >= 0 && suggestions[nowIndex]) {
      setInputValue(suggestions[nowIndex]);
    } else {
      setInputValue(inputValue);
    }
  }, [nowIndex]);

  //검색창 외부 클릭 시 검색창을 닫음
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SearchBarContainer ref={searchBarRef}>
      <SearchBarWrapper
        expanded={suggestions.length > 0}
        className="SearchBarWrapper"
      >
        <SearchInput
          value={inputValue} // 입력 필드가 상태와 동기화
          onChange={handleInputChange}
          ref={inputRef}
          // onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
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
              onMouseDown={() => {
                setInputValue(suggestion);
                setSuggestions([]);
              }}
              style={{
                backgroundColor: index === nowIndex ? "#d3d3d3" : "white",
                color: index === nowIndex ? "black" : "gray",
              }}
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

export default SearchBar;

const SearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40vw;
`;

const SearchBarWrapper = styled.div`
  height: 6.8vh;
  width: 100%;
  box-shadow: ${(props) =>
    props.expanded
      ? "0px -4px 8px rgba(0, 0, 0, 0.1)"
      : "0px 4px 8px rgba(0, 0, 0, 0.1), 0px -4px 8px rgba(0, 0, 0, 0.1)"};
  border-radius: ${(props) => (props.expanded ? "15px 15px 0 0" : "62.5em")};
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 1.25em;
`;

const AutoCompleteContainer = styled.div`
  position: absolute;
  top: 100%;
  width: 40vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1.25em;
  background: #fff;
  color: #919194;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 15px 15px;
  margin-top: -0.5rem;
`;

const SuggestionItem = styled.div`
  padding: 0.2rem 0.6rem;
  cursor: pointer;
  width: 100%;
  display: block;
  text-indent: 0.1em;

  &.active {
    background: #e0e5f6;
    color: #000;
  }

  &:last-child {
    margin-bottom: 0.5em;
  }

  &:hover {
    background: #e0e5f6;
  }
`;

const SearchInput = styled.input`
  width: 85%;

  font-family: "Inria Sans", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 1.2vw;
  color: #919194;

  border: none;
  outline: none;
  background: none;

  &::placeholder {
    font-size: 0.8em;
    text-indent: 0.1em;
  }
`;

const IconWrapper = styled.div`
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
`;

const CancelIconWrapper = styled.div`
  width: 1.9vw;
  color: #d0d1d9;

  cursor: pointer;
`;

const SearchIcon = styled.img`
  width: 2vw;
  border-radius: 50%;
`;

const HighlightedText = styled.span`
  font-weight: bold;
  color: #0a27a6;
`;
