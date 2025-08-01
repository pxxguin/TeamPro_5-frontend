import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import defaultProfilePicture from "../../assets/icons/Header/profileIcon.png"; // 기본 이미지
import StyledButton from "./StyledButton";
import { useLocation } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import HackathonPage from "../../pages/HackathonPage";
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from "../features/currentUser";

import { SiPagekit } from "react-icons/si";
import { LuPen, LuLogOut } from "react-icons/lu";
import { TbTriangleFilled } from "react-icons/tb";

const profileMenuItems = [
  { label: "마이페이지", icon: <SiPagekit /> },
  { label: "프로필 편집", icon: <LuPen /> },
  { label: "로그아웃", icon: <LuLogOut /> },
];
function Header({}) {
  const navigate = useNavigate();

  // const [accessToken, setAccessToken] = useState(
  //   localStorage.getItem("accessToken")
  // );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // 프로필 클릭 이벤트 추가했다구리
  const menuRef = useRef(null);
  const currentUser = getCurrentUser();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // useEffect로 컴포넌트가 처음 렌더링될 때 accessToken 업데이트
  useEffect(() => {
    // const handleStorageChange = () => {
    //   setAccessToken(localStorage.getItem("accessToken"));
    // };
    // 여기 추가
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    //window.addEventListener("storage", handleStorageChange);
    document.addEventListener("mousedown", handleClickOutside);
    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {
      //window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("Id");
    clearCurrentUser();
    //setAccessToken(null); // 로그아웃 시 상태 초기화
    //setCurrentUser(null);
    navigate("./");
  };

  const handleMenuClick = (option) => {
    if (option === "마이페이지") {
      navigate("/MyPage");
    } else if (option === "프로필 편집") {
      navigate("/ProfileEditPage");
    } else if (option === "로그아웃") {
      handleLogout();
    }
    setIsProfileMenuOpen(false); // Close menu after selection
  };

  // const onProfileClick = () => {
  //   navigate("./MyPage");
  // };

  return (
    <HeaderContainer className="HeaderContainer">
      {/* 로고와 메뉴를 포함하는 메뉴박스 */}
      <MenuBox>
        {/* 프로젝트 로고 들어가야함 */}
        <Logo onClick={() => navigate("./")}>FolioFrame</Logo>
        {/* 네비게이션바에 있는 메뉴들 */}
        <TextWrapper>
          <Text 
            onClick={() => navigate("/PortfolioPage")}
            active={isActive("/PortfolioPage")}
          >포트폴리오</Text>
          <Text 
            onClick={() => navigate("/HackathonPage")}
            active={isActive("/HackathonPage")}
          >해커톤</Text>
          {currentUser?.recruiter && (
            <Text 
              onClick={() => navigate(`/RecruiterPage/${currentUser.id}`)}
              active={isActive(`/RecruiterPage/${currentUser.id}`)}
            >채용
            </Text>
          )}
        </TextWrapper>

        {/* <Nav>
          <NavLink href="#templates">템플릿</NavLink>
          <NavLink href="#hackathon">해커톤</NavLink>
        </Nav> */}
      </MenuBox>

      {/* 로그인 여부에 따라 프로필 이미지 또는 로그인/로그아웃 버튼 렌더링 */}
      <Profile className="Profile">
        {getCurrentUser() ? (
          <>
            <ProfileWrapper className="ProfileWrapper">
              <ProfilePic
                className="ProfilePic"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                src={defaultProfilePicture}
                alt="profile"
              />
              {isProfileMenuOpen && (
                <ProfilePicMenuWrapper ref={menuRef}>
                  <TriangleIcon>
                    <TbTriangleFilled />
                  </TriangleIcon>
                  <ProfilePicMenu isOpen={isProfileMenuOpen}>
                    {profileMenuItems.map((item, index) => (
                      <ProfilePicMenuItems
                        key={index}
                        onClick={() => handleMenuClick(item.label)}
                      >
                        <MenuItemIcon>{item.icon}</MenuItemIcon>
                        {item.label}
                      </ProfilePicMenuItems>
                    ))}
                  </ProfilePicMenu>
                </ProfilePicMenuWrapper>
              )}
              {/* <LoginButton onClick={handleLogout}>로그아웃</LoginButton> */}
            </ProfileWrapper>
          </>
        ) : (
          <StyledButton text="로그인" onClick={() => navigate("/LoginPage")} />
        )}
      </Profile>
    </HeaderContainer>
  );
}

Header.propTypes = {
  profilePicture: PropTypes.string.isRequired,
};
// 기본 프로필 사진
Header.defaultProps = {
  profilePicture: defaultProfilePicture,
};

export default Header;

const HeaderContainer = styled.header`
  width: 85%; //수정 중..
  height: 5em;
  background: #ffffff;
  display: flex;
  align-items: center;
  margin: 0 auto; /* 가운데 정렬 */
  position: relative;
  box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.1);
  padding-left: 20px;
  padding-right: 20px;
  justify-content: space-between;
`;

const ProfileWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  //gap: 0.5em;
  //margin-left: -5em;
  width: 100%;
`;

const ProfilePicMenuWrapper = styled.div`
  position: absolute;
  top: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TriangleIcon = styled.div`
  //position: absolute;
  //top: 100%;
  display: flex;
  justify-content: center;

  color: #15243e80;
`;

const ProfilePicMenu = styled.div`
  //position: absolute;
  //top: 135%;
  width: 10vw;
  //height: 17vh;
  background-color: #15243e80;
  border-radius: 0.625em;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  justify-content: space-between;
  z-index: 3;
`;

const MenuItemIcon = styled.div`
  display: inline-block;
  margin-right: 0.2vw;
  font-size: 0.85vw;
  cursor: pointer;
`;

const ProfilePicMenuItems = styled.div`
  margin: 0.625em;
  padding: 0.25vw;

  color: white;
  font-size: 1vw;
  font-weight: Normal;
  font-family: "OTF B";

  display: flex;
  //justify-content: space-between;
  align-items: center;

  border: 0.2em solid transparent;
  border-radius: 0.625em;
  box-sizing: border-box;

  &:hover {
    //border-radius: 0.625em;
    //border: 0.15vw solid #fff;
    background-color: #15243e60;
    cursor: pointer;
  }

  &:last-child {
    // border-bottom: none;
  }

  &.highlight {
    border: 0.0625em solid white;
    border-radius: 0.5em;
    padding: 0.75em;
    font-weight: bold;
  }
`;

const MenuBox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 70%;
  height: 5em;
`;

const Logo = styled.div`
  font-family: "OTF B";
  font-style: normal;
  font-weight: 700;
  font-size: 2.2em;
  line-height: 43px;
  color: #0a27a6;
  position: absolute;
  left: 0;
  top: calc(50% - 48px / 2);
  cursor: pointer;
`;

const TextWrapper = styled.nav`
  display: flex;
  align-items: center;
  margin-left: 200px;


`;

const Text = styled.a`
  font-family: "Inria Sans", sans-serif;
  font-family: "OTF B";
  font-weight: 700;
  font-size: 1.2em;
  line-height: 36px;
  color: #919194;
  text-decoration: none;
  margin-left: 30px;
  cursor: pointer;

  color: ${(props) => (props.active ? "#0a27a6" : "#919194")}; 

  &:hover {
    color: #0a27a6;
  }
`;

const Profile = styled.div`
  position: relative;
  width: 6vw;
  border-radius: 50%;
  display: flex;
  align-items: center;
`;

const ProfilePic = styled.img`
  //width: 25%;
  //height: 25%;
  border-radius: 50%;
  cursor: pointer;

  width: 2.8vw;
`;

const LoginButton = styled.button`
  // padding: 0.625em 0em;
  // width: 80%;
  height: 2em;
  width: 10em;
  background-color: #0a27a6;
  color: white;
  border: none;
  border-radius: 0.75em;
  font-size: 1vw;
  cursor: pointer;
  text-align: center;
  float: left;

  &:hover {
    background-color: #092091;
  }
`;
