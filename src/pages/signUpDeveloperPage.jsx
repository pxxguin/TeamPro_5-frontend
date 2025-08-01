import React, { useState } from "react";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";
import Consent from "../components/Consent/Consent.jsx";
import Eye from "../assets/icons/Login/Eye.png";
import Eyeoff from "../assets/icons/Login/Eyeoff.png";

//서버 연결
import { setId } from "../components/features/signUpDeveloper.jsx";
import { changedId } from "../components/features/signUpDeveloper.jsx";
import { setPhoneNumber } from "../components/features/signUpDeveloper.jsx";
import { changedPhoneNumber } from "../components/features/signUpDeveloper.jsx";
import { isPassword } from "../components/features/signUpDeveloper.jsx";
import { PasswordValidation } from "../components/features/signUpDeveloper.jsx";
import { idSignUpDeveloper } from "../components/features/signUpDeveloper.jsx";

const signUpDeveloperPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  //아이디 중복 확인
  const [idInput, setIdInput] = useState("");
  const [idChecked, setIdChecked] = useState(false);
  //전화번호 중복 확인
  const [phone, setPhone] = useState("");
  const [phoneChecked, setPhoneChecked] = useState(false);
  //비밀번호 확인
  const [eyeVisible, setEyeVisible] = useState(false);
  const [eyeVisibleConfirm, setEyeVisibleConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isRePasswordEnabled, setIsRePasswordEnabled] = useState(false);

  const toggleEyeVisible = () => {
    setEyeVisible(!eyeVisible);
  };

  const toggleEyeVisibleConfirm = () => {
    setEyeVisibleConfirm(!eyeVisibleConfirm);
  };

  const autoHyphen = (value) => {
    const cleanedValue = value.replace(/[^0-9]/g, "");
    const formattedValue = cleanedValue
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, "$1-$2-$3")
      .replace(/(\-{1,2})$/, "");
    return formattedValue;
  };
  //아이디 중복 부분
  const handleIdInputChange = (e) => {
    setIdInput(e.target.value);
    setIdChecked(false);
    changedId();
  };

  const handleIdCheck = () => {
    const isValid = setId(idInput);
    if (isValid) {
      setIdChecked(true);
    } else {
      setIdChecked(false);
      changedId();
    }
  };

  // 전화번호 인증 부분
  const handlePhoneChange = (event) => {
    const { value } = event.target;
    setPhone(autoHyphen(value));
    setPhoneChecked(false);
    changedPhoneNumber();
   };
  const handlePhoneCheck = () => {
    console.log("입력된 전화번호:", phone);
    const isValid = setPhoneNumber(phone);
    // setPhoneChecked(isValid);
    if (isValid) {
      setPhoneChecked(true);
    } else {
      setPhoneChecked(false);
      changedPhoneNumber();
    }
  };


  // 비밀번호 유효성 검사 및 비밀번호 확인
  const handlePassValidation = () => {
    if (PasswordValidation(password)) {
      setIsPasswordValid(true);
      setIsRePasswordEnabled(true);
    } else {
      setIsPasswordValid(false);
      setPassword("");
      setIsRePasswordEnabled(false);
    }
  };
  let alertShown = false;

  const passwordCheck = () => {
      if (isPassword(password, repassword)) {
          if (!alertShown) { 
              alert("비밀번호가 인증되었습니다.");
              alertShown = true;
          }
      } else {
          setrePassword('');
          alertShown = false; 
      }
  };

  const handlePassinputChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignUp = async () => {
    try {
      const result =  await idSignUpDeveloper(name, birthday, idInput, password, repassword, phone); 

      // 성공적으로 끝났다는 것을 확인
      if (result.success) {
        alert('회원가입이 성공!');
        navigate("/LoginPage"); 
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error)
    }
};

  return (
    <LoginWrapper>
      <MainText onClick={() => navigate("/")}>FolioFrame</MainText>
      <JoinWrapper>
        <ColumnWrapper1>
          <NameInput
            placeholder="이름"
            type="text"
            // value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <ColumnWrapper2>
            <CalendarText>생년월일</CalendarText>
            <CalendarInput
              type="date"
              // value={birthday}
              onChange={(e) => setBirthday(e.target.value.split("-"))}
            />
          </ColumnWrapper2>
        </ColumnWrapper1>
        <RowWrapper>
          <IdInput
            placeholder="아이디 : 영소문, 숫자, _, .로 이루어진 6~20자"
            type="text"
            value={idInput}
            onChange={handleIdInputChange}
          />
          <IDcheckWrapper>
            <IDcheckInput
              type="checkbox"
              id="IDcheck"
              onClick={handleIdCheck}
              checked={idChecked}
            />
            <label htmlFor="IDcheck">중복확인</label>
          </IDcheckWrapper>
        </RowWrapper>
        <PassWrapper>
          <PassInput
            type={eyeVisible ? "text" : "password"}
            placeholder="비밀번호 : 영문+특문+숫자로 12~20자"
            value={password}
            onChange={handlePassinputChange}
            onBlur={handlePassValidation}
            onKeyDown={(e) => e.key === "Enter" && handlePassValidation()}
          />
          <EyeIcon
            src={eyeVisible ? Eyeoff : Eye}
            alt="eye"
            onClick={toggleEyeVisible}
          />
        </PassWrapper>
        <PassWrapper>
          <PassInput
            type={eyeVisibleConfirm ? "text" : "password"}
            placeholder="비밀번호 확인"
            value={repassword}
            onChange={(e) => setrePassword(e.target.value)}
            onBlur={passwordCheck}
            onKeyDown={(e) => e.key === "Enter" && passwordCheck()}
            disabled={!isRePasswordEnabled}
          />
          <EyeIcon
            src={eyeVisibleConfirm ? Eyeoff : Eye}
            alt="eye"
            onClick={toggleEyeVisibleConfirm}
          />
        </PassWrapper>
        <RowWrapper>
          <TelInput
            type="tel"
            maxLength="13"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="휴대폰 번호"
            id="tel"
            autoComplete="off"
            name="users_phone"
          />
          <PhonecheckWrapper>
            <PhonecheckInput
              type="checkbox"
              id="Phonecheck"
              onClick={handlePhoneCheck}
              checked={phoneChecked}
            />
            <label htmlFor="Phonecheck">중복확인</label>
          </PhonecheckWrapper>
        </RowWrapper>
      </JoinWrapper>
      <LoginButton onClick={handleSignUp}>시작하기</LoginButton>
      <MemberWrapper>
        <Text>이미 회원이신가요? |</Text>
        <JoinButton>로그인</JoinButton>
      </MemberWrapper>
      {/* 이메일로 회원가입 이동 버튼 */}
      <JoinButton onClick={() => navigate("/SignUpDeveloperEmailPage")}>
        이메일로 회원가입하기
      </JoinButton>
    </LoginWrapper>
  );
};

export default signUpDeveloperPage;

//css Wrapper
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 85%;
  padding: 40px 40px;
  margin: 0 auto;
`;

const JoinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;
`;

const MemberWrapper = styled.div`
  display: flex;
  gap: 1em;
  margin-top: -2em;
`;

const ColumnWrapper1 = styled.div`
  display: flex;
  gap: 1em;
`;

const ColumnWrapper2 = styled.div`
  display: flex;
  gap: 0.5em;
`;

const IDcheckWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const PhonecheckWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const PassWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const RowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5em;
`;
//css input
const NameInput = styled.input`
  border-radius: 2em;
  border: 1px solid #d0d1d9;
  height: 3em;
  width: 40%;
  text-indent: 1em;
  outline: none;
  &::placeholder {
    text-indent: 1em;
    color: #d0d1d9;
  }
`;

const TelInput = styled.input`
  border-radius: 2em;
  border: 1px solid #d0d1d9;
  height: 3em;
  width: 100%;
  text-indent: 1em;
  outline: none;
  &::placeholder {
    text-indent: 1em;
    color: #d0d1d9;
  }
`;

const CalendarInput = styled.input`
  border: none;
  outline: none;
  height: 2em;
  padding: 0.5em;
  font-size: 1em;
  color: #d0d1d9;
  border: 1px solid #d0d1d9;
  border-radius: 4px;
  margin-right: -2em;
`;
const PassInput = styled.input`
  border-radius: 2em;
  border: 1px solid #d0d1d9;
  height: 3em;
  width: 90%;
  text-indent: 1em;
  padding-right: 2.5em;
  outline: none;
  &::placeholder {
    text-indent: 1em;
    color: #d0d1d9;
  }
  &::-ms-reveal {
    display: none;
  }
`;
const IdInput = styled.input`
  border-radius: 2em;
  border: 1px solid #d0d1d9;
  height: 3em;
  width: 100%;
  text-indent: 1em;
  outline: none;
  &::placeholder {
    text-indent: 1em;
    color: #d0d1d9;
  }
`;
const IDcheckInput = styled.input`
  border: 1px solid #d0d1d9;
`;
const PhonecheckInput = styled.input`
  border: 1px solid #d0d1d9;
`;
//css button
const LoginButton = styled.button`
  color: #fff;
  font-size: 1em;
  font-weight: 800;

  border-radius: 2em;
  border: none;
  background-color: #0a27a6;
  height: 3em;
  width: 15em;
  margin: 2em 0;
`;

const JoinButton = styled.button`
  color: #d0d1d9;
  font-size: 1em;
  font-weight: 500;
  border: none;
  background-color: transparent;
`;

//css text
const MainText = styled.p`
  color: #0a27a6;
  font-size: 3em;
  font-weight: 700;
  font-family: "OTF B";
  cursor: pointer;
`;

const Text = styled.p`
  color: #d0d1d9;
  font-size: 1em;
  font-weight: 500;
`;

const CalendarText = styled.p`
  color: #d0d1d9;
  font-size: 0.8em;
  font-weight: 500;
  margin-top: 1em;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2em;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 500px;
`;

const EyeIcon = styled.img`
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 1.2em;
  height: 1.2em;
`;
