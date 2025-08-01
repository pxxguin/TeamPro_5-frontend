import React from "react";
import styled from "styled-components";
import Logo from "../../assets/icons/Logo.png";
import SearchBar from "./SearchBar";

const PageHeader = ({ pageTitle, large, onSearch, onCancelSearch }) => {
  return (
    <>
      <Header pageTitle={pageTitle} $large={large}>
        <LogoImage src={Logo} alt="로고" />
        <PageHeaderTitle>{pageTitle}</PageHeaderTitle>
        <SearchBar
          onChange={(e) => console.log(e.target.value)}
          onClick={() => console.log("검색 버튼 클릭")}
          onSearch={onSearch}
          onCancelSearch={onCancelSearch}
        />
      </Header>
    </>
  );
};

export default PageHeader;

const Header = styled.div`
  display: flex;
  z-index: 2;
  position: relative;
  top: 0px;
  left: 0px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 10em;
  gap: 1em;
  @media (max-width: 768px) {
    margin-bottom: ${({ $large }) => ($large ? "3em" : "0em")};
  }
`;

const PageHeaderTitle = styled.div`
  color: #0a27a6;
  font-size: 2em;
  font-weight: 800;
  font-family: "OTF B";

  @media (max-width: 768px) {
    font-size: 1.25em;
    margin-top: 0.75em;
    margin-bottom: 1em;
  }
`;

const LogoImage = styled.img`
  widht: 5em;
  height: 5em;
  margin-bottom: -2em;
`;
