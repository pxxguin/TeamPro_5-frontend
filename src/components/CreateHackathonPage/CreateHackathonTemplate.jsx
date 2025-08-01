import React from "react";
import styled from "styled-components";
import SearchBar from "../commmon/SearchBar.jsx";
import CreatePortfolioSlide from "./CreateHackathonSlide.jsx";
const CreatePortfolioTemplate = () => {
    return(
        <>
        <MainWrapper>
            <SearchBar/>
            <CreatePortfolioSlide/>
        </MainWrapper>
        </>
       
    );
};

export default CreatePortfolioTemplate;

const MainWrapper = styled.div`
  width: 80%;
  padding: 40px 40px;
  margin: 0;

  border : 1.5px solid #d0d1d9;
  border-radius : 2em;
  height : 30em;
  
  display: flex;
  flex-direction: column;
  align-items: center;

`;
