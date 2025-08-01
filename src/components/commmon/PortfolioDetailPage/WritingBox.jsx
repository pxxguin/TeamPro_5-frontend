import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getCurrentUser } from "../../features/currentUser";
import Comment from "../../domain/Comment";

import BoldIcon from "../../../assets/icons/boldIcon.svg";
import ItalicIcon from "../../../assets/icons/italic-5.svg?react";
import StrikeThroughIcon from "../../../assets/icons/strikethrough-13.svg?react";
import ImageIcon from "../../../assets/icons/imageIcon.svg?react";
import LinkIcon from "../../../assets/icons/linkIcon.svg?react";

const WritingBox = ({ addComment }) => {
  const [markdown, setMarkdown] = useState("");
  const [lengthCount, setLengthCount] = useState(markdown.length);
  const [fontSize, setFontSize] = useState("0");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textareaRef = useRef(null);

  const applyFontSize = (e) => {
    const value = e.target.value;
    setFontSize(value);
    if (value === "0") return;

    const headerSyntax = "#".repeat(value) + " ";
    const textarea = textareaRef.current;
    const { selectionStart, selectionEnd } = textarea;
    const before = markdown.substring(0, selectionStart);
    const after = markdown.substring(selectionEnd);

    setMarkdown(`${before}${headerSyntax}${after}`);
    textarea.setSelectionRange(
      selectionStart + headerSyntax.length,
      selectionStart + headerSyntax.length
    );
    textarea.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setFontSize("0");
    }
  };

  const applyFormatting = (syntax) => {
    const textarea = textareaRef.current;
    const { selectionStart, selectionEnd } = textarea;
    const before = markdown.substring(0, selectionStart);
    const selected = markdown.substring(selectionStart, selectionEnd);
    const after = markdown.substring(selectionEnd);

    if (selected.length > 0) {
      setMarkdown(`${before}${syntax}${selected}${syntax}${after}`);
      textarea.setSelectionRange(
        selectionStart + syntax.length,
        selectionEnd + syntax.length
      );
    } else {
      setMarkdown(`${before}${syntax}${after}`);
      textarea.setSelectionRange(
        selectionStart + syntax.length,
        selectionStart + syntax.length
      );
    }
    textarea.focus();
  };

  const addLink = () => {
    const textarea = textareaRef.current;
    const { selectionStart, selectionEnd } = textarea;
    const before = markdown.substring(0, selectionStart);
    const selected = markdown.substring(selectionStart, selectionEnd);
    const after = markdown.substring(selectionEnd);

    const linkText = selected.length > 0 ? selected : "text";
    const linkSyntax = `[${linkText}]()`;
    setMarkdown(`${before}${linkSyntax}${after}`);
    textarea.setSelectionRange(
      selectionStart + linkSyntax.length - 4,
      selectionEnd + linkSyntax.length - 4
    );
    textarea.focus();
  };

  const handleMarkdownChange = (e) => {
    if (typeof e.target.value !== "string") {
      console.log("markdown의 value가 string이 아님.");
      console(e);
    }
    setMarkdown(e.target.value);
    setLengthCount(e.target.value.length);
  };

  const handleSubmit = () => {
    if (!markdown.trim()) {
      setErrorMessage("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      // 댓글 추가
      addComment(markdown);
      setMarkdown(""); // 입력 초기화
      setErrorMessage(""); // 에러 메시지 초기화
    } catch (error) {
      setErrorMessage("댓글 저장 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // const handleSubmit = () => {
  //   const currentUser = getCurrentUser();
  //   console.log(currentUser);
  //   if (markdown.trim() !== "") {
  //     const newComment = new Comment(
  //       null, // commentId, saveComment에서 생성
  //       null, // portfolioId
  //       currentUser.id, //userId
  //       markdown, //text
  //       new Date().toISOString().split("T")[0] //date
  //     );
  //     //console.log(newComment); -> 문제 없음.
  //     addComment(newComment);
  //     setMarkdown("");
  //   }
  // };

  return (
    <Wrapper>
      <ToolbarWrapper>
        <StyledFontSizeSelect
          name="fontSize"
          value={fontSize}
          onChange={applyFontSize}
        >
          <option value="0">폰트크기</option>
          <option value="1">1h</option>
          <option value="2">2h</option>
          <option value="3">3h</option>
          <option value="4">4h</option>
          <option value="5">5h</option>
          <option value="6">6h</option>
        </StyledFontSizeSelect>

        <StyledBar>|</StyledBar>
        <StyledBoldIcon onClick={() => applyFormatting("**")} src={BoldIcon} />
        <StyledItalicIcon
          onClick={() => applyFormatting("*")}
          src={ItalicIcon}
        />
        <StyledThroughIcon
          onClick={() => applyFormatting("~~")}
          src={StrikeThroughIcon}
        />
        {/* <StyledBar>|</StyledBar>
        <FileInputLabel htmlFor="thumbNail">
          <StyledImageIcon src={ImageIcon} />
        </FileInputLabel>
        <ImageUploadInput type="file" id="thumbNail" accept="image/*" />
        <StyledLinkIcon onClick={addLink} src={LinkIcon} /> */}
        <StyledBar>|</StyledBar>
        <StyledPreviewButton onClick={() => setIsModalOpen(true)}>
          미리보기
        </StyledPreviewButton>
      </ToolbarWrapper>

      <TextareaWrapper>
        <StyledTextarea
          ref={textareaRef}
          value={markdown}
          onChange={handleMarkdownChange}
          onKeyDown={handleKeyDown}
          placeholder="댓글의 내용을 입력해주세요."
          maxLength="100"
        />
        <TextareaBottom>
          <TextLength isOverLimit={lengthCount >= 100}>
            {lengthCount}/100 자
          </TextLength>
          <StyledContentHr />
        </TextareaBottom>
      </TextareaWrapper>

      <ButtonWrapper>
        <SubmitButton
          onClick={
            //console.log("게시글 업로드")
            handleSubmit
          }
        >
          댓글 업로드
        </SubmitButton>
      </ButtonWrapper>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsModalOpen(false)}>x</CloseButton>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

export default WritingBox;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
  width: 100%;
  margin-bottom: 1em;
`;
const TitleWrapper = styled.div`
  width: 100%;
`;

const TitleInput = styled.input`
  border: none;
  border-radius: 10px;
  width: 100%;

  background-color: transparent;
  font-size: 0.8125em;
  font-family: "NanumSquareNeo";
  font-weight: bold;
  &:focus {
    outline: none;
  }
  transition: all 0.3s ease;
  &::placeholder {
    color: #a2a3b2;
    font-weight: bold;
  }
`;

const StyledTitleHr = styled.hr`
  margin-bottom: 1em;
  width: 100%;
  border: none;
  height: 1.5px;
  background-color: ${(props) => (props.styledHr ? "#8E59FF" : "#A2A3B2")};
  box-shadow: ${(props) =>
    props.styledHr ? "0 -0.3125em 0.8em rgba(142,89,255,0.5)" : "none"};
  transition: all 0.3s ease;
`;

const ToolbarWrapper = styled.div`
  margin-top: 0.6em;
  //width: 100%;
  height: 2em;
  display: flex;
  align-items: center;
  background-color: #fbfaff;
  font-size: 0.9em;
  overflow-x: scorll;
  //position: sticky;
  top: 60px;
`;

const StyledFontSizeSelect = styled.select`
  display: flex;
  justify-content: center;
  padding-left: 0.25em;
  box-sizing: border-box;
  border: 0.1vw solid #0a27a6;
  border-radius: 0.4em;

  font-size: 1vw;
  font-family: "OTF B";
  font-weight: 800;

  width: 6em;
  height: 1.75em;

  background-color: transparent;
  color: #0a27a6;

  cursor: pointer;
  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const StyledBar = styled.div`
  margin: 0 1.2em;
  color: #a2a3b2;
`;

const StyledBoldIcon = styled.img`
  //width: 0.825em;
  height: 4vh;
  //font-size: 2vw;
  &:hover {
    filter: invert(42%) sepia(59%) saturate(4229%) hue-rotate(238deg)
      brightness(100%) contrast(105%);
  }
  @media (max-width: 768px) {
    width: 0.75em;
  }
`;

const StyledItalicIcon = styled.img`
  margin-right: 0.8vw;

  height: 3.5vh;
  &:hover {
    filter: invert(42%) sepia(59%) saturate(4229%) hue-rotate(238deg)
      brightness(100%) contrast(105%);
  }
  @media (max-width: 768px) {
    width: 0.75em;
  }
`;

const StyledThroughIcon = styled.img`
  //width: 1.0625em;
  height: 2.3vh;
  //font-size: 2vw;
  &:hover {
    filter: invert(42%) sepia(59%) saturate(4229%) hue-rotate(238deg)
      brightness(100%) contrast(105%);
  }
  @media (max-width: 768px) {
    width: 0.75em;
  }
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    width: 0.75em;
  }
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const StyledImageIcon = styled.img`
  margin-left: 0.7vw;
  height: 2.5vh;
  &:hover {
    filter: invert(42%) sepia(59%) saturate(4229%) hue-rotate(238deg)
      brightness(100%) contrast(105%);
  }
  @media (max-width: 768px) {
    width: 0.75em;
  }
`;

const StyledLinkIcon = styled.img`
  margin-left: 1.5vw;
  height: 2.4vh;
  &:hover {
    filter: invert(42%) sepia(59%) saturate(4229%) hue-rotate(238deg)
      brightness(100%) contrast(105%);
  }
  @media (max-width: 768px) {
    width: 0.8125em;
    margin-left: 1em;
  }
`;

const TextareaWrapper = styled.div`
  border-radius: 15px;
  width: 100%;
  height: auto;
  padding: 1em;
  padding-bottom: 0em;
  margin-top: 0.8125em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:focus-within {
    box-shadow: 0 0.25em 1.25em rgba(22, 26, 63, 0.2);
  }
  transition: all 0.3s ease;
`;

const StyledTextarea = styled.textarea`
  padding: 1.23em 1.23em 0 1.23em;
  border: none;
  width: 100%;
  height: 10vh;
  line-height: 1.845em;
  background-color: transparent;
  font-size: 1vw;
  font-weight: 500;
  font-family: "NanumSquareNeo";
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #a2a3b2;
    font-weight: 700;
  }
  resize: none;
`;

const TextareaBottom = styled.div`
  width: 100%;
  margin-top: 1em;
  display: flex;
  flex-direction: column;
`;

const TextLength = styled.div`
  font-size: 0.8125em;
  margin-left: auto;
  font-weight: bold;
  color: ${(props) => (props.lengthCount >= 20000 ? "red" : "#A2A3B2")};
`;

const StyledContentHr = styled.hr`
  margin: 1em 0 1em 0;
  border: none;
  width: 100%;
  height: 1.5px;
  background-color: rgba(162, 163, 178, 0.4);
`;

const StyledPreviewButton = styled.div`
  border: 0.1vw solid #0a27a6;
  border-radius: 0.4em;

  font-size: 1vw;
  font-family: "OTF B";
  font-weight: 800;

  width: 6em;
  height: 1.75em;

  box-sizing: border-box;
  padding-left: 0.25em;
  padding-right: 0.25em;
  line-height: 1.75em;
  text-align: center;

  background-color: transparent;
  color: #0a27a6;

  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  border: none;
  border-radius: 0.4em;

  margin-top: 1vh;
  width: 9.1em;
  height: 2.25em;

  float: right;

  background-color: #0a27a6;
  color: white;
  font-size: 1.1vw;
  font-family: "OTF B";
  font-weight: bold;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0.2em 1em rgba(22, 26, 63, 0.2);
  }
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 7em;
    height: 2.25em;
    font-size: 0.8125em;
  }
`;

// 모달
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;
const ModalContent = styled.div`
  background-color: #fff;
  padding: 2.4615em;
  border-radius: 10px;
  width: 68em;
  max-height: 30.7692em;
  font-size: 0.8125em;
  overflow-y: auto;
  position: relative;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1em;
  right: 1em;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
`;
