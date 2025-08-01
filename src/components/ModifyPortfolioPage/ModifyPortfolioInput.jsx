import React,{useEffect} from "react";
import styled from "styled-components";
import { useState } from "react";
// import Calendar from "./Calendar.jsx";
import CalendarInput from "./ModifyCalendarInput.jsx";
import { useParams } from "react-router-dom";
import {
  oriProjects,
  oriComments,
  initializeData,
} from "../../components/domain/startProgram.js";
import {handleImageAdd, handleMultipleImageAdd } from "../features/fileUploadFeatures.jsx";


const ModifyPortfolioInput = ({ onInputChange, formData, onDateChange  }) => {
  // 업로드 이미지 미리보기 코드
  const [LogoPreview, setLogoPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [ImagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLogo , setSelectedLogo ] = useState(null);
  const [selectedImage , setSelectedImage ] = useState(null);

  const [photosPreview, setPhotosPreview] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  
  const [comments, setComments] = useState([]);
  const [isOn, setIsOn] = useState(true);

  useEffect(() => {
    const portfolio = oriProjects.get(Number(portfolioId));
    if (portfolio) {
      setPortfolioData(portfolio);
    }
  }, [portfolioId]);


  useEffect(() => {
    if (portfolioData) {
      onInputChange({
        target: {
          name: "projectId",
          value: Number(portfolioId),
        },
      });
    }
  }, [portfolioId, portfolioData]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    onInputChange(e); // 외부 상태 관리 함수 호출
   };
  
  
  useEffect(() => {
    initializeData();
    //project ID 사용해서 포트폴리오 데이터 가져오기
    const portfolio = oriProjects.get(Number(portfolioId));
    if (portfolio) {
      setPortfolioData(portfolio);
    }
    console.log(portfolio);

    const filteredComments = Array.from(oriComments.values()).filter(
      (comment) => comment.portfolioId === Number(portfolioId)
    );
    setComments(filteredComments);
  }, [portfolioId, portfolioData?.contacts.length, portfolioData?.hits]);


  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageURL = URL.createObjectURL(file);
      setCoverImagePreview(imageURL); 
      setSelectedFile(file);
    }
  };

  const [file, setFile] = useState(null);

  let imagePath = "";


  const handleSubmit = async (event) => {
      event.preventDefault();

      if (!selectedFile) {
          alert('파일을 선택해 주세요.');
          return;
      }
      try {
        console.log("Selected File for Upload:", selectedFile);

        imagePath = await handleImageAdd(selectedFile);
        console.log("imagePath ", imagePath);
       
        onInputChange({
          target: {
              name: 'coverImage',
              value: imagePath,
              // defaultValue: String(imagePath)
          }
      });        
      alert("커버 이미지 업로드 성공!");
  
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
      }
  };

  //로고 업데이트
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageURL = URL.createObjectURL(file);
      setLogoPreview(imageURL);
      setSelectedLogo(file);
    }
  };

  const handleSubmit2 = async (event) => {
    event.preventDefault();
  
    if (!selectedLogo) {
      alert("파일을 선택해 주세요.");
      return;
    }
  
    try {
      const uploadedLogoPath = await handleImageAdd(selectedLogo); 
      onInputChange({
        target: { name: "logo", value: uploadedLogoPath },
      });
      alert("로고 업로드 성공!");
    } catch (error) {
      console.error("로고 업로드 오류:", error);
      alert("로고 업로드 중 문제가 발생했습니다.");
    }
  };

  const handlePhotosChange = (index) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const newPhotosPreview = [...photosPreview];
      newPhotosPreview[index] = file; 
      setPhotosPreview(newPhotosPreview);
    } else {
      alert("이미지 파일만 업로드 가능합니다.");
    }
  };
  
  
  const handleSubmit3 = async (event) => {
    event.preventDefault();
  
    if (!photosPreview.length) {
      alert("파일을 선택해 주세요.");
      return;
    }
  
    try {
      // 사진 업로드 호출
      const uploadedPaths = await handleMultipleImageAdd(photosPreview);
      console.log("업로드된 이미지 경로들:", uploadedPaths); // 확인

      onInputChange({
        target: { name: "images", value: uploadedPaths },
      });
      console.log("onInputChange 호출 후 formData 확인:", formData); 

      alert("사진 업로드 성공!");
    } catch (error) {
      console.error("사진 업로드 오류:", error);
    }
  };

  //토글 기능
  const handleToggle = (value = null) => {
    if (value !== null) {
        setIsOn(value);
        return;
    }
    setIsOn((prevIsOn) => !prevIsOn);
};

if (!portfolioData) {
  return <Loading>로딩 중...</Loading>;
}
// console.log("Portfolio ID:", portfolioId);
// console.log("Projects:", oriProjects);
return (
    <>
      {/* 필수항목 */}
      <VitalWrapper>
        <VitalText>필수 항목</VitalText>
        <ColumnWrapper>
          {/* 포트폴리오 이름 */}
          <InputWrapper>
            <MainText>포트폴리오 이름</MainText>
            <ExText>자신만의 포트폴리오 이름을 작성해주세요</ExText>
            <VitalInput
              name="projectTitle"
              value={portfolioData.projectTitle
                ? portfolioData.projectTitle
                : ""}
              onChange={handleInputChange}
            />
          </InputWrapper>
          {/* 포트폴리오 설명 -> 글자수 제한해야한다.*/}
          <InputWrapper>
            <MainText>포트폴리오 설명</MainText>
            <ExText>짧게 포트폴리오를 설명해주세요</ExText>
            <VitalInput
              type="text"
              name="description"
              value={portfolioData.description
                ? portfolioData.description
                : ""}
              onChange={handleInputChange}
            ></VitalInput>
          </InputWrapper>
        </ColumnWrapper>

        <ColumnWrapper>
          {/* 사용한 프로그램 */}
          <InputWrapper>
            <MainText>사용한 프로그램</MainText>
            <ExText>사용한 언어/프로그램을 작성해주세요</ExText>
            <VitalInput
              type="text"
              name="usedLanguage"
              value={portfolioData.usedLanguage
                ? portfolioData.usedLanguage
                : ""}
              onChange={handleInputChange}
            ></VitalInput>
          </InputWrapper>
          {/* 링크 */}
          <InputWrapper>
            <MainText>Links</MainText>
            <ExText>
              Github, 웹사이트, 앱 스토어 등 프로젝트를 테스트할 수 있는 곳의
              링크를 추가하세요.
            </ExText>
            <VitalInput
              type="url"
              name="projectLink"
              value={portfolioData.projectLink  ? portfolioData.projectLink
                : ""}
              onChange={handleInputChange}
            ></VitalInput>
          </InputWrapper>
        </ColumnWrapper>

        <ColumnWrapper>
          {/* The problem it solves -> 해결하는 문제 */}
          <InputWrapper>
            <MainText>해결하는 문제</MainText>
            <ExText>
              무엇에 사용할 수 있는지, 그것이 어떻게 기존 작업을 더 쉽고
              안전하게 만드는지 등을 설명합니다
            </ExText>
            <VitalInput2
              type="text"
              name="solving"
              value={portfolioData.solving
                ? portfolioData.solving
                : ""}
              onChange={handleInputChange}
            ></VitalInput2>
          </InputWrapper>
          <InputWrapper>
            <MainText>내가 마주친 도전</MainText>
            <ExText>
              이 프로젝트를 구축하는 동안 발생한 특정 버그,장애물에 대해
              알려주세요. 어떻게 극복하셨나요?{" "}
            </ExText>
            <VitalInput2
              type="text"
              name="challenge"
              value={portfolioData.challenge
                ? portfolioData.challenge
                : ""}
              onChange={handleInputChange}
            ></VitalInput2>
          </InputWrapper>
        </ColumnWrapper>

        <ColumnWrapper3>
          {/* 참여기간 */}
          <InputWrapper>
            <MainText>참여기간</MainText>
            <ExText>이 프로젝트에 참여한 기간을 선택해주세요. </ExText>
            <CalendarInput
              startDate={portfolioData.startDate}
              endDate={portfolioData.endDate}
              onDateChange={onDateChange}
             />
             
          </InputWrapper>
          <CWrapper>
              <InputWrapper>
                <MainText>공개</MainText>
                <ExText>이 프로젝트의 공개 여부를 선택해주세요. <br></br>공개를 하시면 포트폴리오 열람 화면에서 확인하실 수 있습니다. </ExText>
                <ToggleWrapper>
                  <OnToggleText onClick={() => handleToggle(true)} isOn={isOn}>
                      공개
                  </OnToggleText>
                  <ToggleBox onClick={() => handleToggle()}>
                  <Toggle isOn={isOn}></Toggle>
                  </ToggleBox>
                  <OffToggleText onClick={() => handleToggle(false)} isOn={isOn}>
                      비공개
                  </OffToggleText>
                </ToggleWrapper>
            </InputWrapper>
            <InputWrapper>
                  <MainText>카테고리</MainText>
                  <ExText>
                    이 프로젝트의 카테고리를 입력해주세요.
                  </ExText>
                  <VitalInput
                    type="text"
                    name="category"
                    value={portfolioData.category
                      ? portfolioData.category
                      : ""}
                    onChange={handleInputChange}
                  ></VitalInput>
            </InputWrapper>
          </CWrapper>
        </ColumnWrapper3>
      </VitalWrapper>

      {/* 선택항목 */}
      <ChoiceWrapper>
        <VitalText>선택 항목</VitalText>
        <ColumnWrapper2>
          {/* 데모 비디오 */}
          <InputWrapper>
            <MainText>데모 비디오</MainText>
            <ExText>프로젝트 기능을 데모하는 비디오에 링크를 추가하세요</ExText>
            <ChoiceInput
              type="url"
              name="video"
              value={portfolioData.video 
                ? portfolioData.video
                : ""}
              onChange={handleInputChange}
            ></ChoiceInput>
          </InputWrapper>
          {/* 커버 이미지*/}
          <InputWrapper>
            <MainText>커버 이미지</MainText>
            <ExText>프로젝트를 보여줄 표지 이미지를 업로드해주세요</ExText>
            <form onSubmit={handleSubmit}>
                <FileInput 
                  type="file" 
                  accept="image/*" 
                  id="coverphotos"
                  multiple={false}
                  onChange={handleCoverImageChange} 
                  required />
                <FileLabel
                  htmlFor="coverphotos"
                  style={{
                    backgroundImage: coverImagePreview
                      ? `url(${coverImagePreview})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!coverImagePreview && "+"}
                </FileLabel>
                <SubmitButton type="submit">업로드</SubmitButton>
            </form>
          </InputWrapper>
        </ColumnWrapper2>

        <ColumnWrapper2>
          {/* 사진 */}
          <InputWrapper>
            <MainText>사진</MainText>
            <ExText>
              최대 4장의 사진을 업로드하여 프로젝트를 소개해주세요
            </ExText>
            <form onSubmit={handleSubmit3}>
            <ImageWrapper>
              {photosPreview.map((preview, index) => (
                <FileLabel
                  key={index}
                  htmlFor={`photos-${index}`}
                  style={{
                    backgroundImage: preview ? `url(${URL.createObjectURL(preview)})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <FileInput
                    type="file"
                    accept="image/*"
                    id={`photos-${index}`}
                    onChange={handlePhotosChange(index)}
                    required={index === 0}
                  />
                  {!preview && "+"}
                </FileLabel>
              ))}
              {photosPreview.length < 5 && (
                <FileLabel
                  htmlFor={`photos-${photosPreview.length}`}
                  style={{
                    backgroundColor: "#f0f0f0",
                    border: "1px dashed #d0d0d0",
                  }}
                >
                  <FileInput
                    type="file"
                    accept="image/*"
                    id={`photos-${photosPreview.length}`}
                    onChange={handlePhotosChange(photosPreview.length)}
                  />
                  +
                </FileLabel>
              )}
            </ImageWrapper>
            <SubmitButton type="submit">업로드</SubmitButton>
          </form>


            {/* <ChoiceInput type="file"></ChoiceInput> */}
          </InputWrapper>
          {/* 로고 */}
          <InputWrapper>
            <MainText>로고</MainText>
            <ExText>프로젝트를 나타내는 로고를 업로드해주세요</ExText>
            <form onSubmit={handleSubmit2}>
              <FileInput
               type="file" 
               accept="image/*" 
               multiple={false}
               required
               id="Logo"
              onChange={handleLogoChange}
              />
              <FileLabel
                htmlFor="Logo"
                style={{
                  backgroundImage: LogoPreview ? `url(${LogoPreview})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {" "}
                {!LogoPreview && "+"}
              </FileLabel>
              <SubmitButton type="submit">업로드</SubmitButton>
            </form>
          </InputWrapper>
        </ColumnWrapper2>
      </ChoiceWrapper>
    </>
  );
};

export default ModifyPortfolioInput;

//css Wrapper
const Loading = styled.div`
  display: flex;
  justify-content: center;

  font-size: 1vw;
  font-weight: bold;
`;

const CWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap : 2em;
`
const VitalWrapper = styled.div`
  width: 80%;
  padding: 40px 40px;
  margin: 0 auto;

  border: 1.5px solid #d0d1d9;
  border-radius: 2em;
  height: 53em;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChoiceWrapper = styled.div`
  width: 80%;
  padding: 40px 40px;
  margin: 8em auto;

  border: 1.5px solid #d0d1d9;
  border-radius: 2em;
  height: 28em;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const ColumnWrapper = styled.div`
  display: flex;
  gap: 5%;
  justify-content: space-between;
  width: 100%;
`;
const ColumnWrapper2 = styled.div`
  display: flex;
  gap: 20%;
  // justify-content: space-between;
  width: 100%;
`;
const ColumnWrapper3 = styled.div`
  display: flex;
  gap: 1vw;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 768px) {
     gap: 4vw; 

  }
`;
const ImageWrapper = styled.div`
  display: flex;
  gap: 1em;
  justify-content: space-between;
  width: 100%;
`;

//css input
const VitalInput = styled.input`
  border: 1px solid #d0d1d9;
  border-radius: 2em;
  outline: none;
  height: 2em;
  width: 35em;
  text-indent: 1em;
  &::placeholder {
    text-indent: 1em;
  }
`;
const VitalInput2 = styled.textarea`
  border: 1px solid #d0d1d9;
  border-radius: 1em;
  outline: none;
  height: 6em;
  width: 35em;
  text-indent: 1em;
  &::placeholder {
    text-indent: 1em;
  }
`;
const ChoiceInput = styled.input`
  border: 1px solid #d0d1d9;
  border-radius: 2em;
  outline: none;
  height: 2em;
  width: 35em;
  text-indent: 1em;
  &::placeholder {
    text-indent: 1em;
  }
`;

//css Text
const VitalText = styled.p`
  color: black;
  font-size: 1.5em;
  font-weight: 800;
  font-family: "OTF B";
`;
const ExText = styled.p`
  color: black;
  font-size: 0.8em;
  font-weight: 800;
  font-family: "OTF R";
`;

const MainText = styled.p`
  font-size: 1.5em;
  font-weight: 800;
  color: #0a27a6;
  margin-bottom: -0.2em;
  // display : flex;
  font-family: "OTF B";
`;
const FileInput = styled.input`
  position: absolute;
  // width: 1em;
  // height: 1em;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const FileLabel = styled.label`
  display: inline-block;
  width: 5em;
  height: 5em;
  color: #d0d1d9;
  font-size: inherit;
  line-height: normal;
  vertical-align: middle;
  background-color: #fdfdfd;
  cursor: pointer;
  border: 1px solid #d0d1d9;
  border-radius: 1em;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

//토글

const ToggleWrapper = styled.div`
  margin-top: 2em;
  display: flex;
  align-items: center;
`;

const OnToggleText = styled.div`
  color: ${(props) => (props.isOn ? "#0A27A6" : "#A2A3B2")};
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const OffToggleText = styled.div`
  color: ${(props) => (props.isOn ? "#A2A3B2" : "#0A27A6")};
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ToggleBox = styled.div`
  margin: 0 0.8em;
  border: 1.5px solid #0a27a6;
  border-radius: 10px;
  width: 3.5em;
  height: 1.4375em;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
`;

const Toggle = styled.div`
  border-radius: 30px;
  width: 1em;
  height: 1em;
  background-color: #0a27a6;
  position: absolute;
  left: ${(props) => (props.isOn ? "0.2em" : "2.2em")};
  transition: all 0.3s ease-out;
`;

const SubmitButton = styled.button`
  border : 1px solid #0a27a6;
  border-radius : 2em;
  background-color : #fff;
  color : #0a27a6;
  font-size: 1em;
  font-weight: 800;
  font-family: "OTF R";
  margin-top :1em;
  `;

  const MainText2 = styled.p`
  font-size: 1.5em;
  font-weight: 800;
  color: #0a27a6;
  // margin-bottom: -0.2em;
  // display : flex;
  font-family: "OTF B";
`;