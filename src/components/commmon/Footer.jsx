import React from "react";
import styled from "styled-components";

import Logo from "../../assets/icons/Logo.png";
import Facebook from "../../assets/icons/Footer/Facebook.png";
import Instagram from "../../assets/icons/Footer/Instagram.png";
import Twitter from "../../assets/icons/Footer/Twitter.png";

const Footer = () => {
  return (
    <FooterWrapper>
      <MainText>FolioFrame</MainText>
      <LogoWrapper>
        {/*로고 대신해서...;;*/}
        <img src={Logo} alt="Logo" width={30} height={60} />
      </LogoWrapper>

      <TextWrapper>
        <RightWrapper>
          <Text>팀프로젝트1 5팀</Text>
          <Text>팀명 : 포폴만드조</Text>
          <Text>조원 : 김태연, 김예은, 조수연, 최현혜</Text>
        </RightWrapper>

        <LeftWrapper>
          <img src={Twitter} alt="Twitter" />
          <img src={Instagram} alt="Instagram" />
          <img src={Facebook} alt="Facebook" />
        </LeftWrapper>
      </TextWrapper>
    </FooterWrapper>
  );
};

export default Footer;

// css Wrapper
const FooterWrapper = styled.div`
  background-color: #d0d1d9;
  width: 85%; //수정 중...
  height: 277px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 40px; /*margin값 40으로 주기로 해서 padding에 위아래 40으로 쥼!!!*/
  margin: 0 auto; /* 가운데 정렬 */
`;

const LogoWrapper = styled.div`
  align-items: center;
  justify-content: center;
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const RightWrapper = styled.div`
  color: #fff;
`;

const LeftWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

// css Text
const MainText = styled.div`
  font-size: 1.5em;
  font-weight: 700;
  text-align: center;
  color: #fff;
  font-family: "OTF B";

`;

const Text = styled.div`
    color: #fff;
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;
    padding: 3px; 0;
    font-family: "OTF R";

`;