import React from "react";
import styled from "styled-components";
import { useState } from "react";
// import Calendar from "./Calendar.jsx";
import CalendarInput from "./CalendarInput.jsx";
import {handleImageAdd, handleMultipleImageAdd } from "../features/fileUploadFeatures.jsx";

const CreateHackathonInput = ({ onInputChange, formData, onDateChange }) => {
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

 // 파일 선택 핸들러
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
          target: { name: "pictures", value: uploadedPaths },
        });
        console.log("onInputChange 호출 후 formData 확인:", formData); // 상태 확인-> 나오는데 더미 데이터로 안 넘어간다?ㅍ왜지? -> 수연 언니 나온다아아아앙

        alert("사진 업로드 성공!");
      } catch (error) {
        console.error("사진 업로드 오류:", error);
      }
    };

  return(
    <>
     {/* 필수항목 */}
    <VitalWrapper> 
     <VitalText>필수 항목</VitalText>
      <ColumnWrapper>
        {/* 해커톤 이름 */}
          <InputWrapper>
              <MainText>해커톤 이름</MainText>
              <ExText>해커톤 이름을 작성해주세요</ExText>
              <VitalInput 
                type="text"
                name="hackName" 
                value={formData.hackName}
                onChange={onInputChange}>
              </VitalInput>
          </InputWrapper>
        {/* 링크 */}
        <InputWrapper>
              <MainText>Links</MainText>
              <ExText>해커톤을 설명할 자료 링크를 입력해주세요.</ExText>
              <VitalInput 
                type="url"
                name="link" 
                value={formData.link}
                onChange={onInputChange}>
              </VitalInput>
          </InputWrapper>
        </ColumnWrapper>


        {/* 모집 부분 */}
        <ColumnWrapper>
          <InputWrapper>
              <MainText>모집 파트</MainText>
              <ExText>모집할 파트를 입력해주세요.</ExText>
              <VitalInput
                type="text"
                name="part" 
                value={formData.part}
                onChange={onInputChange}></VitalInput>
          </InputWrapper>

        <InputWrapper>
              <MainText>모집인원</MainText>
              <ExText>모집인원을 입력해주세요.</ExText>
              <VitalInput 
                type="text"
                name="maxMemNumber" 
                value={formData.maxMemNumber}
                onChange={onInputChange}
              ></VitalInput>
          </InputWrapper>
        </ColumnWrapper>

        <ColumnWrapper3>
          {/* 참여기간 */}
          <InputWrapper>
              <MainText>모집기간</MainText>
              <ExText>이 해커톤에 참여한 기간을 선택해주세요. </ExText>
              <CalendarInput
                startDate={formData.startDate}
                endDate={formData.endDate}
                onDateChange={onDateChange}
              />
          </InputWrapper>
          {/* 공유 여부 */}
          <InputWrapper>
              <MainText>해커톤 설명</MainText>
              <ExText>해커톤에 대해서 자세히 설명해주세요</ExText>
              <VitalInput2
                name="description" 
                value={formData.description}
                onChange={onInputChange}
              ></VitalInput2>
            </InputWrapper>
        </ColumnWrapper3>
        
        

    </VitalWrapper>

    {/* 선택항목 */}
    <ChoiceWrapper> 
      <VitalText>선택 항목</VitalText>
      <ColumnWrapper2>
        {/* 데모 비디오 */}
          <InputWrapper>
              <MainText>홍보 비디오</MainText>
              <ExText>해커톤을 홍보하는 비디오를 링크에 추가하세요</ExText>
              <ChoiceInput type="url"></ChoiceInput>
          </InputWrapper>
        {/* 커버 이미지*/}
          <InputWrapper>
              <MainText>커버 이미지</MainText>
              <ExText>해커톤을 보여줄 표지 이미지를 업로드해주세요</ExText>
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
              <ExText>최대 4장의 사진을 업로드하여 해커톤을 소개해주세요</ExText>
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
              <ExText>해커톤을 나타내는 로고를 업로드해주세요</ExText>
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

export default CreateHackathonInput;

//css Wrapper

const VitalWrapper = styled.div`
  width: 80%;
  padding: 40px 40px;
  margin: 0 auto;

  border : 1.5px solid #d0d1d9;
  border-radius : 2em;
  height : 45em;
  
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const ChoiceWrapper = styled.div`
  width: 80%;
  padding: 40px 40px;
  margin: 8em auto;

  border : 1.5px solid #d0d1d9;
  border-radius : 2em;
  height : 28em;
  
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const InputWrapper = styled.div`
    display : flex;
    flex-direction : column;
    
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
  height: 23em;
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
    font-size : 1.5em;
    font-weight : 800;
    color : #0A27A6;
    margin-bottom : -0.2em;
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
  clip:rect(0,0,0,0);
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
    color: ${(props) => (props.isOn ? '#0A27A6' : '#A2A3B2')};
    font-size: 0.9em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
`;

const OffToggleText = styled.div`
    color: ${(props) => (props.isOn ? '#A2A3B2' : '#0A27A6')};
    font-size: 0.9em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
`;

const ToggleBox = styled.div`
    margin: 0 0.8em;
    border: 1.5px solid #0A27A6;;
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
    background-color: #0A27A6;;
    position: absolute;
    left: ${(props) => (props.isOn ? '0.2em' : '2.2em')};
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