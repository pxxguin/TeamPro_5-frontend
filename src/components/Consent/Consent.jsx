import styled from 'styled-components';
import {React , useState}  from "react";

const FormComponent = ({ onAgree, onDisagree, checkStates, setCheckStates, agree }) => {
  const allChecked = Object.values(checkStates).every((isChecked) => isChecked);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  // const agree = false;
  const disagree = false;
  const handleCheckboxChange = (key) => {
      setCheckStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAgreeClick = (e) => {
      e.preventDefault(); 
      if (allChecked) {
          console.log('동의 버튼 클릭!');
          agree = true;
          setIsPopupOpen(false); 
          onAgree(true); 
      }
  };

  const handleDisagreeClick = (e) => {
      e.preventDefault();
      console.log('비동의 버튼 클릭!');
      setIsPopupOpen(false); 
      onDisagree(false);
  };

  return (
    <>
      {isPopupOpen && (
      <JoinForm id="joinForm">
        <JoinBox>

          <CheckBox>
              <p>기본 약관</p>
          </CheckBox>
          <CheckBox>
            <ul className="clearfix">
              <CheckBoxText>개인정보 보호 동의</CheckBoxText>
              <CheckBoxButton>
              <CheckboxInput
                  type="checkbox"
                  name="chk"
                  checked={checkStates.privacy}
                  onChange={() => handleCheckboxChange('privacy')}
                />
              </CheckBoxButton>
            </ul>
            <CheckBoxTextarea readOnly>
                1.1 개인정보 사용 제한
                기업회원은 열람한 일반회원의 개인정보를 본 약관에 명시된 목적(채용 평가, 입사 지원 등) 외의 용도로 사용하거나 제3자에게 제공할 수 없습니다.
              
                1.2 비밀 유지
                기업회원은 일반회원의 개인정보를 철저히 보호해야 하며, 외부 유출 방지에 만전을 기해야 합니다. 이와 관련된 자료는 열람 목적이 달성된 이후 즉시 파기해야 합니다.
            </CheckBoxTextarea>
          </CheckBox>

          <CheckBox>
            <ul className="clearfix">
              <CheckBoxText>포트폴리오 무단 사용 금지 동의</CheckBoxText>
              <CheckBoxButton>
              <CheckboxInput
                  type="checkbox"
                  name="chk"
                  checked={checkStates.portfolio}
                  onChange={() => handleCheckboxChange('portfolio')}
                />
              </CheckBoxButton>
            </ul>
            <CheckBoxTextarea readOnly>
              2.1 저작권 보호 기업회원은 일반회원의 포트폴리오에 포함된 모든 자료(텍스트, 이미지, 디자인, 코드 등)에 대한 저작권이 일반회원에게 있음을 인정합니다. 사전 서면 동의 없이 일반회원의 포트폴리오 내용을 복제, 배포, 게시, 수정할 수 없습니다.

              2.2 무단 사용 시 책임 기업회원이 본 약관을 위반하여 일반회원의 포트폴리오를 무단으로 사용한 경우, 이에 대한 모든 법적 책임은 기업회원에게 있으며, 일반회원은 이에 대해 법적 조치를 취할 수 있습니다.
            </CheckBoxTextarea>
          </CheckBox>

          <CheckBox>
            <ul className="clearfix">
              <CheckBoxText>위반 시 제재 및 손해배상</CheckBoxText>
              <CheckBoxButton>
                <CheckboxInput 
                  type="checkbox"
                  name="chk"
                  checked={checkStates.violation}
                  onChange={() => handleCheckboxChange('violation')}/>
              </CheckBoxButton>
            </ul>
              <CheckBoxTextarea readOnly>
                3.1 계정 제재본 약관을 위반할 경우, 기업회원의 계정이 일시 정지 또는 영구적으로 제한될 수 있습니다.

                3.2 손해배상 책임
                기업회원의 위반 행위로 인해 발생한 일반회원의 피해에 대해 모든 손해배상 책임을 집니다.
              </CheckBoxTextarea>
          </CheckBox>

        </JoinBox>

        <FootBtWrap>
          <ButtonItem>
            <Button isCloseButton onClick={handleDisagreeClick}>닫기</Button>
          </ButtonItem>
          <ButtonItem>
            <Button agree disabled={!allChecked} onClick={handleAgreeClick}>동의</Button>
          </ButtonItem>
        </FootBtWrap>
        
      </JoinForm>
    )}
    </>
  );
};

export default FormComponent;

const JoinForm = styled.form`
  width: 460px;
  margin: 0 auto;
`;

const JoinBox = styled.ul`
  border: 1px solid #ddd;
  background-color: #fff;
  list-style: none;
`;

const CheckBox = styled.li`
  position: relative;
    list-style: none;
  &:first-child {
    width: 85%;
    padding: 15px;
    font-weight: 600;
    color: #888;
  }
`;

const CheckBoxText = styled.li`
  float: left;
  font-size : 0.8em;
`;

const CheckBoxButton = styled.li`
  position: absolute;
  top: 50%;
  right: 30px;
  margin-top: -4em;
  list-style: none;
`;

const CheckboxInput = styled.input`
  margin-right: 10px;
`;

const CheckBoxTextarea = styled.textarea`
  width: 96%;
  height: 90px;
  margin: 0 2%;
  background-color: #f7f7f7;
  color: #888;
  border: none;
`;

const FootBtWrap = styled.ul`
  margin-top: 15px;
  list-style: none;
  padding: 0;
  display: flex;
`;

const ButtonItem = styled.li`
  width: 50%;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  height: 2em;
  font-size: 20px;
  text-align: center;
  font-size : 0.8em;
  border : none;
  background-color: ${(props) =>
      props.disabled ? '#fff' : props.agree ? '#5592FC' : '#fff'};
    color: ${(props) =>
      props.disabled ? '#888' : props.agree ? '#fff' : '#888'};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: all 0.3s ease;

   &:hover {
    background-color: ${(props) =>
      props.disabled
        ? '#f0f0f0'
        : props.agree
        ? '#5592FC'
        : props.isCloseButton
        ? '#f0f0f0' 
        : '#f0f0f0'};
  }

`;