import React, { useState } from "react";
import styled from "styled-components";

const InfoSection = ({
  label,
  value,
  isButton = true,
  button = "설정",
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isModified, setIsModified] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsModified(false);
  };

  const handleCancelClick = () => {
    setInputValue(value);
    setIsEditing(false);
    setIsModified(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsModified(newValue !== value);
  };

  const handleSaveClick = () => {
    if (isModified && inputValue.trim()) {
      console.log(inputValue.trim());
      onSave(inputValue.trim());
      setIsEditing(false);
      setIsModified(false);
    }
  };

  return (
    <Container>
      <Label>{label}</Label>
      <Content>
        {isEditing ? (
          <EditContainer>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="값을 입력해주세요."
            />
            <ButtonGroup>
              <CancelButton onClick={handleCancelClick}>취소</CancelButton>
              <SaveButton onClick={handleSaveClick} disabled={!isModified}>
                저장
              </SaveButton>
            </ButtonGroup>
          </EditContainer>
        ) : (
          <DisplayContainer>
            <Value>{value || "값을 설정해주세요."}</Value>
            {isButton && (
              <EditButton onClick={handleEditClick}>{button}</EditButton>
            )}
          </DisplayContainer>
        )}
      </Content>
    </Container>
  );
};

export default InfoSection;

// Styled Components
const Container = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid #ddd;
`;

const Label = styled.div`
  flex: 0 0 140px;
  font-size: 1rem;
  font-weight: bold;
  line-height: 2.5rem; /* Label과 Input을 수평 정렬 */
`;

const Content = styled.div`
  flex: 1;
`;

const DisplayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #aaa;
  flex: 1;
  text-align: left;
  line-height: 2.5rem; /* Label과 Value를 수평 정렬 */
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background-color: #fff;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background-color: ${(props) => (props.disabled ? "#ddd" : "#007bff")};
  color: ${(props) => (props.disabled ? "#aaa" : "#fff")};
  border: 1px solid ${(props) => (props.disabled ? "#ddd" : "#007bff")};
  border-radius: 0.5rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "#ddd" : "#0056b3")};
  }
`;
