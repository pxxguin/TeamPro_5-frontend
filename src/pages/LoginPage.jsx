import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";
import {
  setCurrentUser,
  getCurrentUser,
} from "../components/features/currentUser.js";

import Eye from "../assets/icons/Login/Eye.png";
import Eyeoff from "../assets/icons/Login/Eyeoff.png";

import { userInfo } from "../components/commmon/dummydata/userInfo.jsx";
import { hashFunction } from "../components/features/hashFunction.jsx";

const LoginPage = () => {
  const [eyeVisible, setEyeVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [emailOrId, setemailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [Id, setId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    //이미 로그인된 사용자 있으면 홈으로
    const currentUser = getCurrentUser();
    if (currentUser) {
      navigate("/");
    }
  }, [navigate]);

  // 회원가입 페이지 이동

  const onClickImg = () => {
    navigate("/MemberSelectionPage");
  };

  // 비밀번호 눈
  const toggleEyeVisible = () => {
    setEyeVisible(!eyeVisible);
  };

  // // 현혜징 X
  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedId = Id.trim();
    const trimmedPassword = password.trim();

    console.log("입력된 이메일 및 아이디 :", trimmedEmail, trimmedId);
    console.log("입력된 비밀번호 : ", trimmedPassword);
    console.log("더미 데이터:", userInfo);

    const promises = userInfo.map(async (value) => {
      const hashPwd = await hashFunction(trimmedPassword);
      if ((value.email && value.email.toLowerCase() === trimmedEmail.toLowerCase()) ||
        (value.id && value.id.toString() === trimmedId)) {
        return value.password === hashPwd ? value : null;
      }
      return null;
    });

    Promise.all(promises)
      .then((results) => {
        const user = results.find((result) => result !== null);
        if (user) {
          console.log("로그인 성공!");
          // 로그인한 유저 처리
          setCurrentUser(user); //현재 사용자 정보 저장
          navigate("/");
        } else {
          alert('아이디 혹은 이메일과 비밀번호를 정확하게 입력하세요.');
          console.log("비밀번호가 일치하지 않거나, 유저 정보가 없습니다.");
        }
      })
      .catch((error) => {
        console.error("로그인 오류:", error);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  
  return (
    <LoginWrapper>
      <MainText onClick={() => navigate("/")}>FolioFrame</MainText>
      <JoinWrapper>
      <IDinput
        placeholder="이메일 주소 또는 아이디"
        value={emailOrId}
        onChange={(e) => {
          const inputValue = e.target.value.trim();
          setemailOrId(inputValue);
            if (inputValue.includes("@")) {
              setEmail(inputValue);
              setId(""); // ID는 초기화
            } else {
              setId(inputValue);
              setEmail(""); // 이메일 초기화
            }
        }}
        onKeyDown={handleKeyDown}
      />
        <PassWrapper>
          <PASSinput
            type={eyeVisible ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <EyeIcon
            src={eyeVisible ? Eyeoff : Eye}
            alt="eye"
            onClick={toggleEyeVisible}
          />
        </PassWrapper>
      </JoinWrapper>
      <LoginButton onClick={handleLogin}>로그인</LoginButton>
      <MemberWrapper>
        <Text>회원이 아니신가요? |</Text>
        <JoinButton onClick={onClickImg}>회원가입</JoinButton>
      </MemberWrapper>
    </LoginWrapper>
  );
  };
  
  export default LoginPage;
  
//css Wrapper
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // padding: 90px;
  width: 85%;
  padding: 8% 40px;
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

const PassWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 200%;
  margin-bottom: -1.25em;
`;

//css input
const IDinput = styled.input`
  border-radius: 2em;
  border: 1px solid #d0d1d9;
  height: 3em;
  width: 200%;
  text-indent: 1em;
  outline: none;

  &::placeholder {
    text-indent: 1em;
  }
`;

const PASSinput = styled.input`
  border-radius: 2em;
  border: 1px solid #d0d1d9;
  height: 3em;
  width: 100%;
  text-indent: 1em;
  outline: none;

  &::placeholder {
    text-indent: 1em;
  }
  &::-ms-reveal {
    display: none;
  }
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

const EyeIcon = styled.img`
  position: absolute;
  right: 1em;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 1.2em;
  height: 1.2em;
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