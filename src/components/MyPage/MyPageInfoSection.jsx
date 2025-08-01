import React from "react";
import styled from "styled-components";

const MyPageInfoSection = ({ label, value }) => {
  return (
    <>
      <InfoWrapper>
        <LabelWrapper>
          <Label>{label}</Label>
        </LabelWrapper>
        <ValueContainer>
          <ValueWrapper>
            <Value>{value}</Value>
          </ValueWrapper>
        </ValueContainer>
      </InfoWrapper>
    </>
  );
};

export default MyPageInfoSection;

const ValueContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  min-width: 0px;
`;

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
  -webkit-box-align: center;
  align-items: center;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex: 0 0 140px;
  gap: 0.5rem;
  -webkit-box-align: center;
  align-items: center;
`;

const ValueWrapper = styled.div`
  width: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
`;

const Label = styled.div`
  flex: 0 0 auto;
`;

const Value = styled.p`
  //font-family: "OTF R";
  -webkit-tap-highlight-color: transparent;
  font-size: 1rem;
  text-decoration: none;
  color: rgb(33, 37, 41);
  font-weight: 600;
  line-height: 1.5;
  text-underline-position: under;
`;
