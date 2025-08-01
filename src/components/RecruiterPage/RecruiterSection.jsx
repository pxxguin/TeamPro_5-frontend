import SelectBox from "../commmon/SelectBox";
import React from "react";
import styled from "styled-components";
import RecruiterPageSearchBar from "./RecruiterPageSearchBar";

import StyledButton from "../commmon/StyledButton";

import { Navigate, useNavigate } from "react-router-dom";
import { oriProjects, searchSortManager } from "../domain/startProgram";

const RecruiterSection = ({
  title,
  data = [],
  renderItem,
  button,
  buttonKey,
  onSearch,
  onSort,
  userId,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <MyContainer>
        <MyTitle>{title}</MyTitle>
        <MyProtFolioMenuBarWrapper>
          <SelectBox onSort={onSort} />
          <RecruiterPageSearchBar
            onChange={(e) => console.log(e.target.value)}
            onSearch={onSearch}
            userId={userId}
          />
        </MyProtFolioMenuBarWrapper>

        <Line></Line>

        <TemplateGridWrapper>
          <TemplateGrid>
            {data.length > 0 ? (
              data.map((item) => renderItem(item))
            ) : (
              <EmptyGridItem>
                <Text>비었습니다.</Text>
              </EmptyGridItem>
            )}
          </TemplateGrid>
        </TemplateGridWrapper>
      </MyContainer>
      <Line></Line>

      {button && (
        <StyledButtonWrapper>
          <StyledButton
            text={"추가"}
            onClick={() => {
              navigate("/PortfolioPage");
            }} //navigate 넣으면 된다요
          />
        </StyledButtonWrapper>
      )}
    </>
  );
};
export default RecruiterSection;

const MyContainer = styled.div`
  margin-top: 10vh;
`;

const MyTitle = styled.div`
  height: 2.625em;
  top: 11.375em;
  font-family: "OTF B";

  font-style: normal;
  font-weight: 700;
  font-size: 1.875em;
  line-height: 2.25em;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.025em;
  color: #000000;
`;

const MyProtFolioMenuBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MyTemplateMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TemplateGridWrapper = styled.div`
  //display: flex;
  //justify-content: flex-start;
  //align-items: center;
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
  margin: 1.5vh 0;
  border: 1px solid #d0d1d9;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const EmptyGridItem = styled.div`
  grid-column: 1 / -1; /* 그리드 전체 열을 차지 */
  display: grid; /* Flex 대신 Grid 사용 */
  place-content: center; /* Grid로 중앙 정렬 */
`;

const Text = styled.div`
  font-size: 1.5vw;
  font-family: "OTF R";
  align-items: center;
  width: 100%;
  height: 100%;
`;
