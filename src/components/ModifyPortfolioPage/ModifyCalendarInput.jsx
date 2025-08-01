import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Calendar from "./Calendar.jsx";
// import { useDispatch } from 'react-redux';

const ModifyPortfolioCalendarInput = ({ startDate, endDate, onDateChange }) => {
  // state 관리
  const [recruitmentStartDate, setRecruitmentStartDate] = useState(null);
  const [recruitmentEndDate, setRecruitmentEndDate] = useState(null);
  // Button 활성화 상태 관리
  const [isRecruitmentActive, setIsRecruitmentActive] = useState(true);
  const [isStudyPeriodActive, setIsStudyPeriodActive] = useState(false);

  // Redux 관리
  // const dispatch = useDispatch();

  // 날짜 형식 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 모집 날짜 불러오기
  const handleRecruitStartDateChange = (date) => {
    if (isRecruitmentActive) {
      setRecruitmentStartDate(date);
    } else if (isStudyPeriodActive) {
      setStudyPeriodStartDate(date);
    }
    const formattedDate = formatDate(date);
    console.log("Start Date:", formattedDate);

    onDateChange("startDate", date);
    // dispatch(setRecruitStartDay(formattedDate));
  };

  const handleRecruitEndDateChange = (date) => {
    if (isRecruitmentActive) {
      setRecruitmentEndDate(date);
    } else if (isStudyPeriodActive) {
      setStudyPeriodEndDate(date);
    }
    const formattedDate = formatDate(date);
    console.log("End Date:", formattedDate);

    onDateChange("endDate", date);
    // dispatch(setRecruitEndDay(formattedDate));
  };

  return (
    <ComponentWrapper>
      {/* 캘린더 영역 */}
      {isRecruitmentActive && (
        <Calendar
          onStartDateChange={handleRecruitStartDateChange}
          onEndDateChange={handleRecruitEndDateChange}
          startDate={startDate}
          endDate={endDate}
        />
      )}
      <PeriodWrapper1>
        <PeriodWrapper2>
          <Text>시작</Text>
          <Period>
            {recruitmentStartDate ? formatDate(recruitmentStartDate) : "--"}
          </Period>
        </PeriodWrapper2>
        <PeriodWrapper2>
          <Text>끝</Text>
          <Period>
            {recruitmentEndDate ? formatDate(recruitmentEndDate) : "--"}
          </Period>
        </PeriodWrapper2>
      </PeriodWrapper1>
    </ComponentWrapper>
  );
};

export default ModifyPortfolioCalendarInput;

const ComponentWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2em;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1em;
    padding-bottom: 1em;
  }
`;

const PeriodWrapper1 = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1em;
  margin-bottom: 3em;
  margin-left: 1.5em;
`;
const PeriodWrapper2 = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 0.2em;
`;

const Text = styled.div`
  border: 1px solid #0a27a6;
  border-radius: 10px;
  width: 5.0545em;
  height: 2.2054em;
  line-height: 2.2054em;
  text-align: center;
  color: #0a27a6;
  font-size: 0.8125em;
  font-weight: bold;
`;

const Period = styled.div`
  margin: 0 0.2em;
  width: 8em;
  color: #161a3f;
  font-size: 0.8125em;
  font-weight: bold;
`;