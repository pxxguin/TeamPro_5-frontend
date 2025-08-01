import React, {useState} from "react";
import styled from "styled-components";
import { Navigate, useNavigate } from "react-router-dom";
import Consent from "../components/Consent/Consent.jsx";
import Eye from "../assets/icons/Login/Eye.png";
import Eyeoff from "../assets/icons/Login/Eyeoff.png";
import { userInfo } from "../components/commmon/dummydata/userInfo.jsx";

// 서버 연결
import {setEmail} from "../components/features/signUpRecruiter.jsx";
import {changedEmail} from "../components/features/signUpRecruiter.jsx";
import {setPhoneNumber} from "../components/features/signUpRecruiter.jsx";
import {changedPhoneNumber} from "../components/features/signUpRecruiter.jsx";
import {isPassword} from "../components/features/signUpRecruiter.jsx";
import { PasswordValidation, emailSignUpRecruiter, setCompany } from "../components/features/signUpRecruiter.jsx";

const SignUpRecruiterEmailPage= () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState(''); 
    const [agree, setAgree] = useState(false); // agree 상태 관리
   
    //이메일 중복 확인
    const [emailInput, setemailInput] = useState('');
    const [emailCheck, setemailCheck] = useState(false);
    //전화번호 중복 확인
    const [phone, setPhone] = useState('');
    const [phoneChecked, setPhoneChecked] = useState(false); 
    //비밀번호 확인
    const [eyeVisible, setEyeVisible] = useState(false);
    const [eyeVisibleConfirm, setEyeVisibleConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [repassword, setrePassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false); 
    const [isRePasswordEnabled, setIsRePasswordEnabled] = useState(false); 

    
    //비번 눈 아이콘
    const toggleEyeVisible = () => {
        setEyeVisible(!eyeVisible);
    };

    const toggleEyeVisibleConfirm = () => {
        setEyeVisibleConfirm(!eyeVisibleConfirm);
    };

    //팝업창 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checkStates, setCheckStates] = useState({
        privacy: false,
        portfolio: false,
        violation: false,
    });
    //팝업 창
    const handleCheckBoxClick = (value) => {
        setIsModalOpen(true);
        setAgree(value); 
    };
    const closeModal = (value) => {
        setIsModalOpen(false);
        setAgree(false);

    };
    const handleAgree = (value) => {
        setAgree(value);
        setIsModalOpen(false); 
      };
    
    const handleDisagree = () => {
        setAgree(false);
        setIsModalOpen(false); 
 
    };

    
 
    const autoHyphen = (value) => {
        const cleanedValue = value.replace(/[^0-9]/g, '');
        const formattedValue = cleanedValue
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, "$1-$2-$3")
            .replace(/(\-{1,2})$/, ''); 
        return formattedValue;
    };

    //이메일 중복 부분  
    const handleEmailInputChange = (e) => {
        setemailInput(e.target.value);
        setemailCheck(false);
        changedEmail(); 
    };
    
    const handleEmailCheck = () => {
        const isValid = setEmail(emailInput);
        if (isValid) {
            setemailCheck(true); 
        } else {
            setemailCheck(false);
            changedEmail(); 
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
            setPassword('');
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

    // 회사인증 부분
    const [Comemail, setComEmail] = useState(''); 
    const [isCompanyChecked, setCompanyChecked] = useState(false);  

    const handleEmailChange = (event) => {
        setComEmail(event.target.value);
        setCompanyChecked(false); 
    }
    
    const handleCompanyCheck = (email) => {
        setCompany(email);
        setCompanyChecked(!isCompanyChecked); 
    }
    
    
    //시작하기
    const handleSignUp = async () => {
        try {
          
            // 기본약관 동의 여부 확인
            if (!agree) {
                alert("가입 기본약관에 동의해야 회원가입이 가능합니다.");
                return; 
            }
    
            const result = await emailSignUpRecruiter(name, birthday, emailInput, password, repassword, phone);

            // 회원가입 결과 처리
            if (result && result.success) {
                alert("회원가입이 성공!");
                navigate("/LoginPage");
            } else {
                alert(result?.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원가입 중 오류 발생:", error);
            alert("회원가입 처리 중 문제가 발생했습니다.");
        }
    };
    
    
    return (
        <LoginWrapper>
            <MainText onClick={() => navigate("/")}>FolioFrame</MainText>
            <JoinWrapper>
                <ColumnWrapper1>
                    <NameInput placeholder="이름" type="text" onChange={(e) => setName(e.target.value)} />
                <ColumnWrapper2>
                        <CalendarText>생년월일</CalendarText>
                        <CalendarInput type="date" onChange={(e) => setBirthday(e.target.value.split('-'))} />
                    </ColumnWrapper2>
                </ColumnWrapper1>
                <RowWrapper>
                    <EmailInput 
                         placeholder="이메일을 입력해주세요" 
                         type="email" 
                         value={emailInput} 
                         onChange={handleEmailInputChange} 
                    />
                    <EmailcheckWrapper>
                        <EmailcheckInput 
                             type="checkbox" 
                             id="IDcheck" 
                             onClick={handleEmailCheck}
                             checked={emailCheck} 
                        />
                        <label htmlFor="IDcheck">중복확인</label>
                    </EmailcheckWrapper>
                </RowWrapper>

                <PassWrapper>
                    <PassInput
                        type={eyeVisible ? "text" : "password"}
                        placeholder="비밀번호 : 영문+특문+숫자로 12~20자"
                        value={password}
                        onChange={handlePassinputChange}
                        onBlur={handlePassValidation}
                        onKeyDown={(e) => e.key === 'Enter' && handlePassValidation()}
                    />
                   <EyeIcon
                        src={eyeVisible ? Eyeoff : Eye}
                        alt="eye"
                        onClick={toggleEyeVisible}
                    />
                </PassWrapper>
                <PassWrapper>
                    <PassInput
                        type={eyeVisibleConfirm  ? "text" : "password"}
                        placeholder="비밀번호 확인"
                        value={repassword}
                        onChange={(e) => setrePassword(e.target.value)}
                        onBlur={passwordCheck} 
                        // onBlur={() => {
                        //     if (password && repassword) {
                        //         setIsPasswordConfirmed(false); 
                        //         passwordCheck();
                        //     }
                        // }}
                        // onKeyDown={(e) => e.key === 'Enter' && passwordCheck()}
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

            {/* 회사인증 */}
            <RowWrapper>
                    <CertificInput 
                        placeholder="회사인증" 
                        type="Comemail" 
                        value={Comemail} 
                        onChange={handleEmailChange} 
                    />
                </RowWrapper>
            <CheckBoxWrapper>
                    <CompanyCheckInput 
                       type="checkbox" 
                       id="company" 
                       checked={isCompanyChecked} 
                       onChange={() => handleCompanyCheck(Comemail)} 
                       disabled={!Comemail}  
                    />
                    <label htmlFor="company">회사인증</label>
                    <CheckBoxInput 
                        // type="checkbox" 
                        // id="Join" 
                        onClick={handleCheckBoxClick}
                        type="checkbox"
                        id="Join"
                        checked={agree} 
                    />
                    <label htmlFor="Join">가입 기본약관</label>
                </CheckBoxWrapper>
            </JoinWrapper>

            <LoginButton onClick={handleSignUp} >시작하기</LoginButton>
            <MemberWrapper>
                <Text>이미 회원이신가요? |</Text>
                <JoinButton onClick={() => navigate("../LoginPage")}>로그인</JoinButton>
            </MemberWrapper>
            <JoinButton onClick={() => navigate("/SignUpRecruiterPage")}>아이디로 회원가입하기</JoinButton>

           {/* 팝업창 */}
           {isModalOpen && (
                <ModalOverlay>
                    <ModalContent>
                       <Consent 
                         checkStates={checkStates}
                         setCheckStates={setCheckStates}
                         agree={agree} 
                         onAgree={handleAgree} 
                         onDisagree={handleDisagree}
                        />
                    </ModalContent>
                </ModalOverlay>
            )}
        </LoginWrapper>
    );
};

export default SignUpRecruiterEmailPage;

//css Wrapper
const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width : 85%;
    padding: 40px 40px;
    margin: 0 auto; 
`;

const JoinWrapper = styled.div`
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    gap : 1em;
`;

const MemberWrapper = styled.div`
    display: flex;
    gap : 1em;
    margin-top : -2em;
`;

const ColumnWrapper1 = styled.div`
    display : flex;
    gap : 1em;
`;
const ColumnWrapper2 = styled.div`
    display : flex;
    gap : 0.5em;
`;

const RowWrapper = styled.div`
    display: flex;
    flex-direction: column;  
    width : 100%;
    gap: 0.5em;   
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top:-0.5em;
`;

const EmailcheckWrapper = styled.div`
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

//css input
const NameInput = styled.input`
    border-radius : 2em;
    border : 1px solid #D0D1D9;
    height : 3em;
    width : 40%;
    text-indent: 1em; 
    outline : none;
    &::placeholder {
        text-indent: 1em; 
        color : #D0D1D9;
    }

`;

const TelInput = styled.input`
    border-radius : 2em;
    border : 1px solid #D0D1D9;
    height : 3em;
    width : 100%;
    text-indent: 1em; 
    outline : none;
    &::placeholder {
        text-indent: 1em; 
        color : #D0D1D9;
    }

`;

const CertificInput = styled.input`
    border-radius : 2em;
    border : 1px solid #D0D1D9;
    height : 3em;
    width : 100%;
    text-indent: 1em; 
    outline : none;
    &::placeholder {
    text-indent: 1em;
    color : #D0D1D9;
    }

`;
const CalendarInput = styled.input`
    border: none;
    outline: none;
    height: 2em;
    padding: 0.5em;
    font-size: 1em;
    color: #D0D1D9;
    border: 1px solid #D0D1D9;
    border-radius: 4px;
    margin-right : -2em;
`;
const PassInput = styled.input`
    border-radius : 2em;
    border : 1px solid #D0D1D9;
    height : 3em;
    width : 100%;
    text-indent: 1em; 
    outline : none;

    &::placeholder {
        text-indent: 1em; 
        color : #D0D1D9;
    }
    &::-ms-reveal {
        display: none;
    }
}

`;
const EmailInput = styled.input`
    border-radius : 2em;
    border : 1px solid #D0D1D9;
    height : 3em;
    width : 100%;
    text-indent: 1em; 
    outline : none;
    &::placeholder {
        text-indent: 1em;
        color : #D0D1D9;
    }

`;
const CheckBoxInput = styled.input`
    border: 1px solid #D0D1D9;
    margin-left :2em; 
`;
const EmailcheckInput = styled.input`
    border: 1px solid #D0D1D9;
`;
const PhonecheckInput = styled.input`
    border: 1px solid #D0D1D9;
`;
const CompanyCheckInput = styled.input`
    border: 1px solid #D0D1D9;
`;

//css button
const LoginButton = styled.button`
    color : #fff;
    font-size : 1em;
    font-weight : 800;

    border-radius : 2em;
    border : none;
    background-color : #0A27A6;
    height : 3em;
    width: 15em;
    margin : 2em 0;
`;

const JoinButton = styled.button`
    color : #D0D1D9;
    font-size: 1em;
    font-weight: 500;
    border : none;
    background-color : transparent;
`;


//css text
const MainText = styled.p`
    color : #0A27A6;
    font-size: 3em;
    font-weight: 700;
    font-family: "OTF B";
    cursor : pointer;
`;

const Text = styled.p`
    color : #D0D1D9;
    font-size: 1em;
    font-weight: 500;
`;

const CalendarText =  styled.p`
    color : #D0D1D9;
    font-size: .8em;
    font-weight: 500;
    margin-top : 1em;
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

const CloseButton = styled.button`
    margin-top: 1em;
    padding: 0.5em 1em;
    background: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background: #0056b3;
    }
`;
const EyeIcon = styled.img`
    position: absolute;
    right: 1em; 
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    width : 1.2em;
    height : 1.2em;
`;