import React from "react";
import styled from "styled-components";

const MergerCreatePortfolioPageInput = ({
  formData,
  onInputChange,
  onToggleChange,
}) => {
  const handleToggle = () => {
    const newShareValue = !formData.share;
    onToggleChange({
      target: {
        name: "share",
        value: newShareValue,
      },
    });
  };

  return (
    <FormContainer>
      <InputWrapper>
        <Label>포트폴리오 이름</Label>
        <Input
          type="text"
          name="portfolioName"
          placeholder="포트폴리오 이름을 입력하세요"
          value={formData.portfolioName}
          onChange={onInputChange}
        />
      </InputWrapper>

      <Line></Line>

      <InputWrapper>
        <Label>사용 언어</Label>
        <Input
          type="text"
          name="usedLanguage"
          placeholder="예: JavaScript, Python"
          value={formData.usedLanguage}
          onChange={onInputChange}
        />
      </InputWrapper>

      <InputWrapper>
        <Label>프론트엔드</Label>
        <Input
          type="text"
          name="frontend"
          placeholder="예: Node.js, Zustand"
          value={formData.frontend}
          onChange={onInputChange}
        />
      </InputWrapper>

      <InputWrapper>
        <Label>백엔드</Label>
        <Input
          type="text"
          name="backend"
          placeholder="예: Django, Firebase"
          value={formData.backend}
          onChange={onInputChange}
        />
      </InputWrapper>

      <Line></Line>

      <ToggleWrapper>
        <Label>공유</Label>
        <ToggleContainer>
          <ToggleText isOn={formData.share}>공개</ToggleText>
          <ToggleBox onClick={handleToggle}>
            <Toggle isOn={formData.share} />
          </ToggleBox>
          <ToggleText isOn={!formData.share}>비공개</ToggleText>
        </ToggleContainer>
      </ToggleWrapper>

      <Line></Line>
    </FormContainer>
  );
};

export default MergerCreatePortfolioPageInput;

// Styled Components
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  margin-bottom: 2em;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  margin-bottom: 1vh;
`;

const Label = styled.label`
  font-size: 1.5em;
  font-weight: 800;
  color: #0a27a6;
  //margin-bottom: -0.2em;
  // display : flex;
  font-family: "OTF B";
`;

const Input = styled.input`
  border: 1px solid #d0d1d9;
  border-radius: 1em;
  outline: none;
  height: 2.5em;
  width: 30vw;
  padding-left: 1em;
  font-size: 1rem;

  &::placeholder {
    color: #a2a3b2;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleText = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: ${(props) => (props.isOn ? "#0a27a6" : "#a2a3b2")};
  cursor: pointer;
  margin: 0 0.5em;
`;

const ToggleBox = styled.div`
  width: 3.5em;
  height: 1.5em;
  border: 1.5px solid #0a27a6;
  border-radius: 1.5em;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const Toggle = styled.div`
  width: 1.2em;
  height: 1.2em;
  border-radius: 50%;
  background-color: #0a27a6;
  position: absolute;
  left: ${(props) => (props.isOn ? "0.2em" : "2em")};
  transition: all 0.3s ease;
`;

//hr
const Line = styled.hr`
  margin: 1.5vh 0;
  border: 1px solid #d0d1d9;
`;
