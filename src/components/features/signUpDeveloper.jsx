import { oriUsers } from "../domain/startProgram";
import { User } from "../domain/User";
import { hashFunction } from "./hashFunction";

// 사실 이 해시함수는 프론트에서 돌려서 서버에 원본 패스워드가 아예 전달되지 않도록 하는 게 좋다.

// 파일에서 데이터를 가져오는 함수 (서버 API 호출)
export const fetchFileData = async (filePath) => {
  try {
    const response = await fetch("http://localhost:3000/read-number", {
      // 서버의 /read-number API 호출
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }), // filePath를 서버로 전달
    });
    if (!response.ok) {
      throw new Error("네트워크 응답이 좋지 않습니다.");
    }
    const data = await response.json();
    return data.number; // 서버에서 반환된 숫자 값
  } catch (error) {
    console.error("파일을 읽는 중 오류가 발생했습니다.", error);
    return null;
  }
};

// 파일에 문자열 추가하는 함수 (서버 API 호출)
export const appendStringToFile = async (filePath, string) => {
  try {
    await fetch("http://localhost:3000/append-string", {
      // 서버의 /append-string API 호출
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, string }), // filePath와 string을 서버로 전달
    });
  } catch (error) {
    console.error("파일에 문자열을 추가하는 중 오류가 발생했습니다.", error);
  }
};

// 파일 비우는 함수 (서버 API 호출)
export const truncateFile = async (filePath) => {
  try {
    await fetch("http://localhost:3000/truncate-file", {
      // 서버의 /truncate-file API 호출
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }), // filePath를 서버로 전달
    });
  } catch (error) {
    console.error("파일을 비우는 중 오류가 발생했습니다.", error);
  }
};

// 파일 끝에서 문자열을 제거하는 함수 (서버 API 호출)
export const removeFromFileEnd = async (filePath, numCharsToRemove) => {
  try {
    await fetch("http://localhost:3000/remove-from-file-end", {
      // 서버의 /remove-from-file-end API 호출
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, numCharsToRemove }), // filePath와 numCharsToRemove를 서버로 전달
    });
  } catch (error) {
    console.error(
      "파일 끝에서 문자열을 제거하는 중 오류가 발생했습니다.",
      error
    );
  }
};

export const updateFile = async (filePath, operation, string = null) => {
  try {
    await fetch("http://localhost:3000/update-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, operation, string }),
    });
  } catch (error) {
    console.error(`파일 업데이트 중 오류 발생 (${operation}):`, error);
  }
};

let idCheck = false;
let emailCheck = false;
let phoneNumCheck = false;

// 아이디 중복 검사
export const idSignUpDeveloper = async (
  name,
  birthday,
  id,
  password,
  rePassword,
  phoneNumber
) => {
  try {
    // 필수 항목 확인
    if (!name || !birthday || !phoneNumber) {
      alert("모든 항목을 입력하세요.");
      return { success: false, message: "모든 항목을 입력하세요." };
    }
    if (!isIdChecked()) {
      return { success: false, message: "아이디 중복 확인이 필요합니다." };
    }
    if (!isPhoneNumberChecked()) {
      return { success: false, message: "전화번호 중복 확인이 필요합니다." };
    }
    if (!isPassword(password, rePassword)) {
      return { success: false, message: "비밀번호 확인이 필요합니다." };
    }

    // 페이지 ID 가져오기
    const filePath = "src/components/commmon/dummydata/nextPageId.jsx";
    const pageId = await fetchFileData(filePath);
    if (pageId === null) {
      alert("페이지 아이디를 읽는 데 오류가 발생했습니다.");
      return {
        success: false,
        message: "페이지 아이디를 읽는 데 오류가 발생했습니다.",
      };
    }

    // 페이지 ID 업데이트
    await truncateFile(filePath);
    await appendStringToFile(filePath, String(pageId + 1));

    // 비밀번호 해싱
    const hashPwd = await hashFunction(password);

    // 사용자 객체 생성 및 저장
    const user = new User(id, pageId, hashPwd, name, phoneNumber, birthday);
    oriUsers.set(id, user);

    // userInfo.jsx 업데이트
    const userInfoPath = "src/components/commmon/dummydata/userInfo.jsx";
    const userInfoString = `
    {
      id: "${id}",
      pageId: ${pageId},
      password: "${hashPwd}",
      name: "${name}",
      phoneNumber: "${phoneNumber}",
      birthday: "${birthday[0]}-${birthday[1]}-${birthday[2]}",
      recruiter: false,
      email: "",
      nickname: "",
      link: "",
      career: "없음",
      education: ""
    }`;
    // await removeFromFileEnd(userInfoPath, 3); // 기존 파일 끝에서 제거
    // await appendStringToFile(userInfoPath, `,${userInfoString}\n];`); // 새 정보 추가

    await updateFile(userInfoPath, "remove");
    await updateFile(userInfoPath, "append", userInfoString);

    return { success: true, message: "회원가입이 완료되었습니다." };
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    return { success: false, message: "회원가입 중 오류가 발생했습니다." };
  }
};

export const emailSignUpDeveloper = async (
  name,
  birthday,
  email,
  password,
  rePassword,
  phoneNumber
) => {
  try {
    // 입력값 검증
    if (!name || !birthday || !phoneNumber) {
      alert("모든 항목을 입력하세요.");
      return { success: false, message: "모든 항목을 입력하세요." };
    }
    if (!isEmailChecked()) {
      return { success: false, message: "이메일 확인이 필요합니다." };
    }
    if (!isPhoneNumberChecked()) {
      return { success: false, message: "전화번호 확인이 필요합니다." };
    }
    if (!isPassword(password, rePassword)) {
      return { success: false, message: "비밀번호 확인이 필요합니다." };
    }

    // 파일에서 pageId를 가져오고 다음 ID 업데이트
    const filePath = "src/components/commmon/dummydata/nextPageId.jsx";
    const pageId = await fetchFileData(filePath);
    await truncateFile(filePath);
    await appendStringToFile(filePath, String(pageId + 1));

    // 랜덤 ID 생성 및 중복 확인
    let randomId = getRandomId();
    while (isIdExists(randomId)) {
      randomId = getRandomId();
    }

    // 비밀번호 해싱
    const hashPwd = await hashFunction(password);

    // 사용자 생성
    const user = new User(
      randomId,
      pageId,
      hashPwd,
      name,
      phoneNumber,
      birthday,
      email
    );
    oriUsers.set(randomId, user);

    // userInfo.jsx 파일 업데이트
    const userInfoPath = "src/components/commmon/dummydata/userInfo.jsx";
    const userInfoString = `
    {
      id: "${randomId}",
      pageId: ${pageId},
      password: "${hashPwd}",
      name: "${name}",
      phoneNumber: "${phoneNumber}",
      birthday: "${birthday[0]}-${birthday[1]}-${birthday[2]}",
      recruiter: false,
      email: "${email}",
      nickname: "",
      link: "",
      career: "없음",
      education: ""
    }`;
    await removeFromFileEnd(userInfoPath, 3); // 기존 유저 정보를 파일 끝에서 제거
    await appendStringToFile(userInfoPath, `,${userInfoString}\n];`); // 새 유저 정보 추가

    // 성공 반환
    return { success: true, message: "회원가입이 완료되었습니다." };
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);
    return { success: false, message: "회원가입 중 오류가 발생했습니다." };
  }
};

export const setId = (id) => {
  idCheck = false;

  const idPattern = /^[a-z0-9_.]{6,20}$/;
  if (!id.match(idPattern)) {
    alert(
      "아이디는 영소문, 숫자, _, .만을 이용하여 6자 이상, 20자 이하로 입력하세요."
    );
    return idCheck;
  }

  for (const [key, user] of oriUsers) {
    if (key === id) {
      alert("이미 사용 중인 아이디입니다.");
      return idCheck;
    }
  }

  idCheck = true;
  return idCheck;
};

export const setEmail = (email) => {
  // 이메일 형식 확인
  emailCheck = false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("유효한 이메일 형식이 아닙니다.");
    return emailCheck;
  }
  for (const [key, value] of oriUsers.entries()) {
    if (value.email === email) {
      alert("이미 계정이 존재합니다.");
      return emailCheck;
    }
  }
  emailCheck = true;
  return emailCheck;
};

//forEach로 하면 return값이 없어서 계속 오류 메시지가 나오는 문제점이 있어서 수정함
export const setPhoneNumber = (phoneNumber) => {
  console.log("oriUsers 데이터:", oriUsers);

  // 1. 전화번호 형식 검증
  const phonePattern = /^010-\d{4}-\d{4}$/; // 전화번호 형식: 010-xxxx-xxxx
  if (!phonePattern.test(phoneNumber.trim())) {
    alert("올바른 전화번호를 입력하세요. 형식: 010-xxxx-xxxx");
    return false;
  }

  // 2. Map 객체에서 중복 확인
  for (const [key, user] of oriUsers.entries()) {
    if (user.phoneNumber === phoneNumber) {
      alert("이미 사용 중인 전화번호입니다.");
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
};

// 아이디나 이메일, 전화번호 중복 체크 후에 입력값이 변하면 다시 체크해야 하므로
export const changedId = () => (idCheck = false);
export const changedEmail = () => (emailCheck = false);
export const changedPhoneNumber = () => (phoneNumCheck = false);

// 중복 체크가 되어 있지 않으면 실행지 않는다
export const isIdChecked = () => {
  if (idCheck === false) {
    alert("아이디 중복 체크를 해야합니다.");
    return 0;
  }
  return 1;
};

export const isEmailChecked = () => {
  if (emailCheck === false) {
    alert("이메일 중복 체크를 해야 합니다.");
    return 0;
  }
  return 1;
};

export const isPhoneNumberChecked = () => {
  if (phoneNumCheck === false) {
    alert("전화번호 중복 체크를 해야 합니다.");
    return 0;
  }
  return 1;
};
export const isPassword = (password, rePassword) => {
  // 비밀번호와 비밀번호 확인란이 동일한가
  if (password !== rePassword) {
    alert("비밀번호와 재입력한 비밀번호가 일치하지 않습니다");
    return 0;
  }

  // 비밀번호가 조건에 들어맞는가
  // 영문+특문+숫자로 12자 이상, 20자 이하
  const passPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{12,20}$/;
  const passMatcher = password.match(passPattern);
  if (!passMatcher) {
    alert("비밀번호는 영문+특수문자+숫자로 12자 이상, 20자 이하로 입력하세요.");
    return 0;
  }
  return 1;
};

export const PasswordValidation = (password) => {
  const passPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{12,20}$/;
  const passMatcher = password.match(passPattern);
  if (!passMatcher) {
    alert("비밀번호는 영문+특수문자+숫자로 12자 이상, 20자 이하로 입력하세요.");
    return 0;
  }
  return 1;
};

export const generateRandomString = (length) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789_.";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const getRandomId = () => {
  // 길이를 6에서 20 사이로 랜덤하게 설정
  const length = Math.floor(Math.random() * (20 - 6 + 1)) + 6;
  return generateRandomString(length);
};

// 아이디로 회원가입 버튼 눌렀을 때: idSignUpDeveloper
//      아이디 중복확인 눌렀을 때: setId
// 이메일로 회원가입 버튼 눌렀을 때: emailSignUpDeveloper
//      이메일 중복확인 눌렀을 때: setEmail
// 공통 전화번호 중복확인 눌렀을 때: setPhoneNumber
//
// 아이디 변경됐을 때: changedId
// 전화번호 변경됐을 때: changedPhoneNumber
export default {
  idSignUpDeveloper,
  emailSignUpDeveloper,
  setId,
  setEmail,
  setPhoneNumber,
  changedId,
  changedEmail,
  changedPhoneNumber,
};
