import { oriUsers, oriRecruiters } from "../domain/startProgram";
import { User } from "../domain/User";
import { hashFunction } from "./hashFunction";

// 사실 이 해시함수는 프론트에서 돌려서 서버에 원본 패스워드가 아예 전달되지 않도록 하는 게 좋다.

// 파일에 문자열 추가하는 함수 (서버 API 호출)
export const appendStringToFile = async (filePath, string) => {
    try {
        await fetch('http://localhost:3000/append-string', {  // 서버의 /append-string API 호출
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath, string }),  // filePath와 string을 서버로 전달
        });
    } catch (error) {
        console.error('파일에 문자열을 추가하는 중 오류가 발생했습니다.', error);
    }
};

// 파일 끝에서 문자열을 제거하는 함수 (서버 API 호출)
export const removeFromFileEnd = async (filePath, numCharsToRemove) => {
    try {
        await fetch('http://localhost:3000/remove-from-file-end', {  // 서버의 /remove-from-file-end API 호출
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath, numCharsToRemove }),  // filePath와 numCharsToRemove를 서버로 전달
        });
    } catch (error) {
        console.error('파일 끝에서 문자열을 제거하는 중 오류가 발생했습니다.', error);
    }
};

let idCheck = false;
let emailCheck = false;
let phoneNumCheck = false;
let companyCheck = false;

export const idSignUpRecruiter = async (name, birthday, id, password, rePassword, phoneNumber) => {
    try {
      // 필수 항목 검증
      if (!name || !birthday || !phoneNumber) {
        alert('모든 항목을 입력하세요.');
        return { success: false, message: '모든 항목을 입력하세요.' };
      }
      if (!isIdChecked()) {
        return { success: false, message: '아이디 중복 확인이 필요합니다.' };
      }
      if (!isPhoneNumberChecked()) {
        return { success: false, message: '전화번호 중복 확인이 필요합니다.' };
      }
      if (!isCompanyChecked()) {
        return { success: false, message: '기업 정보 확인이 필요합니다.' };
      }
      if (!isPassword(password, rePassword)) {
        return { success: false, message: '비밀번호 확인이 필요합니다.' };
      }
  
      // 비밀번호 해싱 및 사용자 생성
      const hashPwd = await hashFunction(password);
      const user = new User(id, null, hashPwd, name, phoneNumber, birthday, true);
      oriUsers.set(id, user);
      oriRecruiters.set(id, user);
  
      // userInfo.jsx 업데이트
      const filePath = 'src/components/commmon/dummydata/userInfo.jsx';
      const string = `
      {
        id: "${id}",
        pageId: null,
        password: "${hashPwd}",
        name: "${name}",
        phoneNumber: "${phoneNumber}",
        birthday: "${birthday[0]}-${birthday[1]}-${birthday[2]}",
        recruiter: true,
        email: "",
        nickname: "",
        link: "",
        career: "없음",
        education: ""
      }`;
      await removeFromFileEnd(filePath, 3); // 기존 정보 제거
      await appendStringToFile(filePath, `,${string}\n];`); // 새 정보 추가
  
      return { success: true, message: '기업 회원가입이 완료되었습니다.' };
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    }
  };
  
  export const emailSignUpRecruiter = async (name, birthday, email, password, rePassword, phoneNumber) => {
    try {
      // 필수 항목 검증
      if (!name || !birthday || !phoneNumber) {
        alert('모든 항목을 입력하세요.');
        return { success: false, message: '모든 항목을 입력하세요.' };
      }
      if (!isEmailChecked()) {
        return { success: false, message: '이메일 중복 확인이 필요합니다.' };
      }
      if (!isPhoneNumberChecked()) {
        return { success: false, message: '전화번호 중복 확인이 필요합니다.' };
      }
      if (!isCompanyChecked()) {
        return { success: false, message: '기업 정보 확인이 필요합니다.' };
      }
      if (!isPassword(password, rePassword)) {
        return { success: false, message: '비밀번호 확인이 필요합니다.' };
      }
  
      // 랜덤 아이디 생성 및 중복 확인
      let randomId = getRandomId();
      while (isIdExists(randomId)) randomId = getRandomId();
  
      // 비밀번호 해싱 및 사용자 생성
      const hashPwd = await hashFunction(password);
      const user = new User(randomId, null, hashPwd, name, phoneNumber, birthday, true, email);
      oriUsers.set(randomId, user);
      oriRecruiters.set(randomId, user);
  
      // userInfo.jsx 업데이트
      const filePath = 'src/components/commmon/dummydata/userInfo.jsx';
      const string = `
      {
        id: "${randomId}",
        pageId: null,
        password: "${hashPwd}",
        name: "${name}",
        phoneNumber: "${phoneNumber}",
        birthday: "${birthday[0]}-${birthday[1]}-${birthday[2]}",
        recruiter: true,
        email: "${email}",
        nickname: "",
        link: "",
        career: "없음",
        education: ""
      }`;
      await removeFromFileEnd(filePath, 3); // 기존 정보 제거
      await appendStringToFile(filePath, `,${string}\n];`); // 새 정보 추가
  
      return { success: true, message: '기업 회원가입이 완료되었습니다.' };
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    }
  };
  

//현혜찡 코드
export const setId = (id) => {
   
    idCheck = false;

    const idPattern = /^[a-z0-9_.]{6,20}$/;
    if (!id.match(idPattern)) {
        alert('아이디는 영소문, 숫자, _, .만을 이용하여 6자 이상, 20자 이하로 입력하세요.');
        return idCheck;
    }

    for (const [key, user] of oriUsers){
        if (key === id){
            alert('이미 사용 중인 아이디입니다.');
            return idCheck;
        }
    }

    idCheck = true;
    return idCheck;
};

// const setEmail = (email) => {
//     // 유저 DB에 이미 해당 이메일이 존재하면 true 반환, 없으면 false
//     oriUsers.forEach((value, key) => {
//         if (value.email === email) {
//             alert('이미 계정이 존재합니다.');
//             return;
//         }
//     });

//     // 임의처리한다.
//     emailCheck = true;
// }
export const setEmail = (email) => {
    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('유효한 이메일 형식이 아닙니다.');
        return false;
    }
    for (const [key, value] of oriUsers.entries()) {
        if (value.email === email) {
            alert('이미 계정이 존재합니다.');
            return false;
        }
    }
    emailCheck = true;
    return emailCheck;
};

export const setPhoneNumber = (phoneNumber) => {
    console.log("oriUsers 데이터:", oriUsers);

    // 1. 전화번호 형식 검증
     const phonePattern = /^010-\d{4}-\d{4}$/; // 전화번호 형식: 010-xxxx-xxxx
    if (!phonePattern.test(phoneNumber.trim())) {
        alert('올바른 전화번호를 입력하세요. 형식: 010-xxxx-xxxx');
        return false;
    }

    // 2. Map 객체에서 중복 확인
    for (const [key, user] of oriUsers.entries()) {
        if (user.phoneNumber === phoneNumber) {
            alert('이미 사용 중인 전화번호입니다.');
            return false;
        }
    }

    // 중복되지 않으면 true 반환
    phoneNumCheck = true;
    return true;
};


export const isIdExists = (id) => {
    oriUsers.forEach((value, key) => {
        if (key === id) {
            return true;
        }
    });
    return false;
}

// 회사인증
// 임의로 처리한다.
// export const setCompany = () => {
//     companyCheck = true;
// }
export const setCompany = (email) => {
    // email 값을 받아 처리할 수 있도록 수정
    console.log("회사 인증 이메일:", email);
    companyCheck = true;
};
// 아이디나 이메일, 전화번호 중복 체크 후에 입력값이 변하면 다시 체크해야 하므로
export const changedId = () => idCheck = false;  
export const changedEmail = () => emailCheck = false;
export const changedPhoneNumber = () => phoneNumCheck = false;
export const changedCompany = () => companyCheck = false;

// 중복 체크가 되어 있지 않으면 실행지 않는다
export const isIdChecked = () => {
    if (idCheck === false) {
        alert('아이디 중복 체크를 해야합니다.');
        return 0
    }
    return 1;
}

export const isEmailChecked = () => {
    if (emailCheck === false) {
        alert('이메일 중복 체크를 해야 합니다.');
        return 0;
    }
    return 1;
}

export const isPhoneNumberChecked = () => {
    if (phoneNumCheck === false) {
        alert('전화번호 중복 체크를 해야 합니다.');
        return 0;
    }
    return 1;
}

export const isCompanyChecked = () => {
    if (companyCheck === false) {
        alert('회사 인증을 해야 합니다.');
        return 0;
    }
    return 1;
}

export const isPassword = (password, rePassword) => {
    // 비밀번호와 비밀번호 확인란이 동일한가
    if (password !== rePassword) {
        alert('비밀번호와 재입력한 비밀번호가 일치하지 않습니다');
        return 0;
    }

    // 비밀번호가 조건에 들어맞는가
    // 영문+특문+숫자로 12자 이상, 20자 이하
    const passPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{12,20}$/;
    const passMatcher = password.match(passPattern);
    if (!passMatcher) {
        alert('비밀번호는 영문+특수문자+숫자로 12자 이상, 20자 이하로 입력하세요.');
        return 0;
    }
    return 1;
}
export const PasswordValidation = (password) => {
    const passPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{12,20}$/;
    const passMatcher = password.match(passPattern);
    if (!passMatcher) {
        alert('비밀번호는 영문+특수문자+숫자로 12자 이상, 20자 이하로 입력하세요.');
        return 0;
    }
    return 1;
}

export const generateRandomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789_.';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export const getRandomId = () => {
    // 길이를 6에서 20 사이로 랜덤하게 설정
    const length = Math.floor(Math.random() * (20 - 6 + 1)) + 6;
    return generateRandomString(length);
}


// 아이디로 회원가입 버튼 눌렀을 때: idSignUpRecruiter
//      아이디 중복확인 눌렀을 때: setId
// 이메일로 회원가입 버튼 눌렀을 때: emailSignUpRecruiter
//      이메일 중복확인 눌렀을 때: setEmail
// 공통 전화번호 중복확인 눌렀을 때: setPhoneNumber
// 공통 회사 인증하기 눌렀을 때: setCompany
//
// 아이디 변경됐을 때: changedId
// 전화번호 변경됐을 때: changedPhoneNumber
// 회사 변경됐을 때: changedCompany
// export { idSignUpRecruiter, emailSignUpRecruiter, setId, setEmail, setPhoneNumber, setCompany, changedId, changedEmail, changedPhoneNumber, changedCompany };