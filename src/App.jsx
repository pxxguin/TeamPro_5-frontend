import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import profileIcon from "./assets/icons/Header/profileIcon.png";
import LoginPage from "./pages/LoginPage";
import MemberSelectionPage from "./pages/MemberSelectionPage";
import SignUpRecruiterPage from "./pages/SignUpRecruiterPage";
import SignUpRecruiterEmailPage from "./pages/SignUpRecruiterEmailPage";
import SignUpDeveloperPage from "./pages/signUpDeveloperPage";
import SignUpDeveloperEmailPage from "./pages/SignUpDeveloperEmailPage";
import LayOut from "./components/commmon/LayOut";
import MyPage from "./pages/MyPage";
import MainPage from "./pages/MainPage";
import PortfolioPage from "./pages/PortfolioPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import HackathonPage from "./pages/HackathonPage";
import CreatePortfolioPage from "./pages/CreatePortfolioPage";
import ModifyPortfolioPage from "./pages/ModifyPortfolioPage";
import ModifyHackathonPage from "./pages/ModifyHackathonPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import PortfolioDetailPage2 from "./pages/PortfolioDetailPage2";
import HackathonDetailPage from "./pages/HackathonDetailPage";
import PortfolioDetailPage3 from "./pages/PortfolioDetailPage3";
import RecruiterPage from "./pages/RecruiterPage";
import CreateHackathonPage from "./pages/CreateHackathonPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import MergerCreatePortfolioPage from "./pages/MergerCreatePortfolioPage";

import { initializeData } from "./components/domain/startProgram";

function App() {
  //
  useEffect(() => {
    // 데이터 초기화 함수 호출
    initializeData();
  }, []);

  return (
    <Routes>
      <Route>
        {/* 기본 로그인 페이지 */}
        <Route path="/LoginPage" element={<LoginPage />} />
        {/* 회원 선택 페이지 */}
        <Route path="/MemberSelectionPage" element={<MemberSelectionPage />} />
        {/* 기업회원 회원가입 페이지 */}
        <Route path="/SignUpRecruiterPage" element={<SignUpRecruiterPage />} />
        {/* 기업회원 이메일 회원가입 페이지 */}
        <Route
          path="/SignUpRecruiterEmailPage"
          element={<SignUpRecruiterEmailPage />}
        />
        {/* 일반회원 회원가입 페이지 */}
        <Route path="/SignUpDeveloperPage" element={<SignUpDeveloperPage />} />
        {/* 일반회원 이메일 회원가입 페이지 */}
        <Route
          path="/SignUpDeveloperEmailPage"
          element={<SignUpDeveloperEmailPage />}
        />
        <Route element={<LayOut />}>
          {/* 메인 화면  */}
          <Route path="/" element={<MainPage />} />
          <Route path="/LoginPage/MainPage" element={<MainPage />} />
          {/* 해커톤 화면  */}
          <Route path="/HackathonPage" element={<HackathonPage />} />
          {/* 포트폴리오 제작 화면  */}
          <Route
            path="/CreatePortfolioPage"
            element={<CreatePortfolioPage />}
          />
          <Route
            path="/ModifyPortfolioPage/:portfolioId"
            element={<ModifyPortfolioPage />}
          />
          {/* 해커톤 제작 화면 */}
          <Route
            path="/CreateHackathonPage"
            element={<CreateHackathonPage />}
          />
          <Route
            path="/ModifyHackathonPage/:hackId"
            element={<ModifyHackathonPage />}
          />
          {/* 해커톤 상세 페이지 */}
          <Route
            path="/HackathonDetailPage/:hackId"
            element={<HackathonDetailPage />}
          />
          {/* 포폴 상세 페이지 템플릿 2 */}
          <Route
            path="/PortfolioDetailPage2/:portfolioId"
            element={<PortfolioDetailPage2 />}
          />

          {/*마이 페이지  */}
          <Route
            path="/MyPage"
            element={
              <MyPage
                profileIcon={profileIcon}
                name={"포폴만들조"}
                nickname={"폴리오프레임"}
              />
            }
          />
          <Route
            path="/MyPage"
            element={
              <MyPage
                profileIcon={profileIcon}
                name={"포폴만들조"}
                nickname={"폴리오프레임"}
              />
            }
          />
          {/* 포폴 열람 화면*/}
          <Route path="/PortfolioPage" element={<PortfolioPage />} />

          {/*프로필 편집 화면*/}
          <Route path="/ProfileEditPage" element={<ProfileEditPage />} />

          {/* 포트폴리오 상세페이지*/}
          <Route
            path="/PortfolioDetailPage/:portfolioId"
            element={<PortfolioDetailPage />}
          />
          {/* 포트폴리오 상세페이지3 */}
          <Route
            path="/PortfolioDetailPage3/:portfolioId"
            element={<PortfolioDetailPage3 />}
          />
          {/* 채용자 페이지*/}
          <Route path="/RecruiterPage/:userId" element={<RecruiterPage />} />
          {/* 프로젝트 병합 페이지*/}
          <Route
            path="/MyProjectsPage/:portfolioId"
            element={<MyProjectsPage />}
          />
          <Route
            path="/MergerCreatePortfolioPage"
            element={<MergerCreatePortfolioPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
