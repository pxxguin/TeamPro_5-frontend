import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PrevMonth from "../../assets/icons/Calendar/arrow_left.png";
import NextMonth from "../../assets/icons/Calendar/arrow_right.png";
import { Color } from "../CreatePortfolioPage/Color.jsx";

const CreateHackCalendar = ({ onStartDateChange, onEndDateChange }) => {
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
    const nextMonthStartDay = (firstDayOfMonth + daysInMonth) % 7;

    const cells = [];
    const today = new Date();

    const isDateSelected = (day) => {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
        return (
            startDate &&
            endDate &&
            (currentDate.toDateString() === startDate.toDateString() ||
                currentDate.toDateString() === endDate.toDateString())
        );
    };

    const isInSelectionRange = (day) => {
        if (!startDate || !endDate) return false;
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
        return currentDate >= startDate && currentDate <= endDate;
    };

    const handleDateClick = (day) => {
        const selectedDate = new Date(date.getFullYear(), date.getMonth(), day);

        if (!startDate) {
            setStartDate(selectedDate);
            setEndDate(null);
            onStartDateChange(selectedDate); // Start date 변경 알림
        } else if (!endDate) {
            if (selectedDate < startDate) {
                setStartDate(selectedDate);
                setEndDate(null);
                onStartDateChange(selectedDate); // Start date 변경 알림
            } else {
                setEndDate(selectedDate);
                onEndDateChange(selectedDate); // End date 변경 알림
            }
        } else {
            setStartDate(selectedDate);
            setEndDate(null);
            onStartDateChange(selectedDate); // Start date 변경 알림
        }
    };

    // 이전 달의 날짜 추가
    for (let i = firstDayOfMonth; i > 0; i--) {
        cells.push(
            <Cell key={`prev-${i}`} className="empty">
                {prevMonthLastDate - i + 1}
            </Cell>,
        );
    }

    // 현재 달의 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday =
            today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

        cells.push(
            <Cell
                key={day}
                isToday={isToday}
                isInRange={isInSelectionRange(day)}
                isSelected={isDateSelected(day)}
                isStart={
                    startDate &&
                    new Date(date.getFullYear(), date.getMonth(), day).toDateString() === startDate.toDateString()
                }
                isEnd={
                    endDate &&
                    new Date(date.getFullYear(), date.getMonth(), day).toDateString() === endDate.toDateString()
                }
                onClick={() => handleDateClick(day)}
            >
                {day}
            </Cell>,
        );
    }

    // 다음 달의 날짜 추가
    for (let i = 1; i <= (7 - nextMonthStartDay) % 7; i++) {
        cells.push(
            <Cell key={`next-${i}`} className="empty">
                {i}
            </Cell>,
        );
    }

    const prevMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    };

    return (
        <CalendarWrapper>
            <CalendarWrapper1>
                <Header>
                    <StyledPrevMonth onClick={prevMonth} />
                    <MonthYear>
                        {`${year}년`} <Color>{`${monthName}`}</Color>
                    </MonthYear>
                    <StyledNextMonth onClick={nextMonth} />
                </Header>
                <Grid>
                    {days.map((day, index) => (
                        <Day key={index}>{day}</Day>
                    ))}
                    {cells}
                </Grid>
            </CalendarWrapper1>
        </CalendarWrapper>
    );
};

export default CreateHackCalendar;
/* CSS */
const CalendarWrapper = styled.div`
  width: 50%;

  @media (max-width: 768px) {
    height: auto;
    width: 100%;
  }
`;

const CalendarWrapper1 = styled.div`
    display : flex;
    flex-direction : column;
    justify-content :center;
    align-items : center;
    position: relative;
    width: 100%;
    height: 100%;
    // padding : 2em;
    // padding-bottom : 1em;
    box-sizing: border-box;

    @media (max-width: 768px) {
        width : 100%
        padding-right: 0;
        border-right: none;
        border-bottom: 1px solid #0A27A6;;
        padding-bottom: 1em;
    }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2em;
  margin-bottom: 0.5em;
`;

// const StyledPrevMonth = styled(PrevMonth)`
//     width: 0.61em;
//     cursor: pointer;
// `;

const MonthYear = styled.div`
  font-size: 0.73em;
  text-align: center;
  font-weight: 800;
  padding: 0 2em;
`;

// const StyledNextMonth = styled(NextMonth)`
//     width: 0.61em;
//     cursor: pointer;
// `;

const Grid = styled.div`
  row-gap: 0.2em;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  font-size: 1em;
  place-items: center center;

  @media (max-width: 768px) {
  }
`;

const Day = styled.div`
  text-align: center;
  box-sizing: border-box;
`;

const Cell = styled.div`
  @media (max-width: 1100px) {
    font-size: 0.8125em;
  }
  @media (max-width: 900px) {
    font-size: 0.75em;
  }

  @media (max-width: 768px) {
    font-size: 1em;
  }
  padding: 1em;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5em;
  width: 2.5em;
  cursor: pointer;
  &.empty {
    color: #ccc;
  }
  transition: all ease 0.3s;

  font-weight: ${(props) => (props.isToday ? "600" : "400")};
  color: ${(props) =>
    props.isToday || props.isStart || props.isEnd ? "#FFFFFF" : "#000000"};
  background-color: ${(props) =>
    props.isToday
      ? "#CFDDFB"
      : props.isStart || props.isEnd
      ? "#0A27A6;"
      : "transparent"};
  border-radius: 50%;
  box-shadow: ${(props) =>
    props.isToday ? "0px 4px 10px rgba(129, 76, 161, 0.19)" : "none"};
  position: relative;
  // z-index: 10;

  @media (max-width: 768px) {
    height: 2em;
    width: 2em;
    padding: 0.4em;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${(props) =>
      props.isInRange ? "#CFDDFB" : "transparent"};
    z-index: -1;
    transition: all ease 0.3s;
    border-radius: ${(props) =>
      props.isStart ? "20px 0 0 20px" : props.isEnd ? "0 20px 20px 0" : "0"};
    visibility: ${(props) => (props.isInRange ? "visible" : "hidden")};
  }
`;
const StyledPrevMonth = styled.img.attrs({ src: PrevMonth })`
  width: 0.61em;
  cursor: pointer;
`;

const StyledNextMonth = styled.img.attrs({ src: NextMonth })`
  width: 2em;
  cursor: pointer;
`;
