import { oriUsers } from "../domain/startProgram";
import {
  isEmailChecked,
  isIdChecked,
  isPhoneNumberChecked,
  isPassword,
} from "./signUpDeveloper";

import { PasswordValidation } from "./signUpDeveloper.jsx";

export const updateName = async (userId, newValue) => {
  const idField = "id";
  const field = "name";
  const user = oriUsers.get(userId);

  // 같은 값으로 업데이트하려는 경우 방지
  if (user[field] == newValue) {
    console.log("기존과 같은 값이 입력됨");
    return;
  }

  if (!newValue) {
    console.log("입력된 값이 없음");
    return;
  }

  try {
    const filePath = "src/components/commmon/dummydata/userInfo.jsx";

    // 필드를 업데이트하는 API 호출
    await fetch("http://localhost:3000/update-user-field", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: String(userId),
        field,
        newValue,
      }),
    });

    // Map 객체도 업데이트
    if (user) {
      user[field] = newValue;
      oriUsers.set(userId, user);
    }

    console.log(`${field} 필드가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("필드 업데이트 중 오류가 발생했습니다:", error);
  }
};

export const updateNickname = async (userId, newValue) => {
  const idField = "id";
  const field = "nickname";
  const user = oriUsers.get(userId);

  // 같은 값으로 업데이트하려는 경우 방지
  if (user[field] == newValue) {
    console.log("기존과 같은 값이 입력됨");
    return;
  }

  if (!newValue) {
    console.log("입력된 값이 없음");
    return;
  }

  try {
    const filePath = "src/components/commmon/dummydata/userInfo.jsx";

    // 필드를 업데이트하는 API 호출
    await fetch("http://localhost:3000/update-user-field", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: String(userId),
        field,
        newValue,
      }),
    });

    // Map 객체도 업데이트
    if (user) {
      user[field] = newValue;
      oriUsers.set(userId, user);
    }

    console.log(`${field} 필드가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("필드 업데이트 중 오류가 발생했습니다:", error);
  }
};

export const updateId = async (userId, newValue) => {
  const idField = "id";
  const field = "id";
  const user = oriUsers.get(userId);

  // 같은 값으로 업데이트하려는 경우 방지
  if (user[field] == newValue) {
    console.log("기존과 같은 값이 입력됨");
    return;
  }

  if (!newValue) {
    console.log("입력된 값이 없음");
    return;
  }

  // if (!isIdChecked()) return;

  try {
    const filePath = "src/components/commmon/dummydata/userInfo.jsx";

    // 필드를 업데이트하는 API 호출
    await fetch("http://localhost:3000/update-user-field", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: String(userId),
        field,
        newValue,
      }),
    });

    // Map 객체도 업데이트
    if (user) {
      user[field] = newValue;
      oriUsers.delete(userId);
      oriUsers.set(newValue, user);
    }

    console.log(`${field} 필드가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("필드 업데이트 중 오류가 발생했습니다:", error);
  }
};

export const updateEmail = async (userId, newValue) => {
  const idField = "id";
  const field = "email";
  const user = oriUsers.get(userId);

  // 같은 값으로 업데이트하려는 경우 방지
  if (user[field] == newValue) {
    console.log("기존과 같은 값이 입력됨");
    return;
  }

  if (!newValue) {
    console.log("입력된 값이 없음");
    return;
  }

  // if (!isEmailChecked()) return;

  try {
    const filePath = "src/components/commmon/dummydata/userInfo.jsx";

    // 필드를 업데이트하는 API 호출
    await fetch("http://localhost:3000/update-user-field", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: String(userId),
        field,
        newValue,
      }),
    });

    // Map 객체도 업데이트
    if (user) {
      user[field] = newValue;
      oriUsers.set(userId, user);
    }

    console.log(`${field} 필드가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("필드 업데이트 중 오류가 발생했습니다:", error);
  }
};

export const updatePassword = async (userId, newValue) => {
  const passPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).{12,20}$/;
  const passMatcher = newValue.match(passPattern);
  if (!passMatcher) {
    alert("비밀번호는 영문+특수문자+숫자로 12자 이상, 20자 이하로 입력하세요.");
    return;
  }

  // 같은 값으로 업데이트하려는 경우 방지
  if (user[field] == newValue) {
    console.log("기존과 같은 값이 입력됨");
    return;
  }

  if (!newValue) {
    console.log("입력된 값이 없음");
    return;
  }

  const idField = "id";
  const field = "password";
  const user = oriUsers.get(userId);

  // if (!isPassword(newValue, rePassword)) return;

  try {
    const filePath = "src/components/commmon/dummydata/userInfo.jsx";

    // 필드를 업데이트하는 API 호출
    await fetch("http://localhost:3000/update-user-field", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: String(userId),
        field,
        newValue,
      }),
    });

    // Map 객체도 업데이트
    if (user) {
      user[field] = newValue;
      oriUsers.set(userId, user);
    }

    console.log(`${field} 필드가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("필드 업데이트 중 오류가 발생했습니다:", error);
  }
};

export const updatePhoneNumber = async (userId, newValue) => {
  const phonePattern = /^010-\d{4}-\d{4}$/; // 전화번호 형식: 010-xxxx-xxxx
  if (!phonePattern.test(newValue.trim())) {
    alert("올바른 전화번호를 입력하세요. 형식: 010-xxxx-xxxx");
    return;
  }

  const idField = "id";
  const field = "phoneNumber";
  const user = oriUsers.get(userId);

  // 같은 값으로 업데이트하려는 경우 방지
  if (user[field] == newValue) {
    console.log("기존과 같은 값이 입력됨");
    return;
  }

  if (!newValue) {
    console.log("입력된 값이 없음");
    return;
  }

  // if (!isPhoneNumberChecked()) return;

  try {
    const filePath = "src/components/commmon/dummydata/userInfo.jsx";

    // 필드를 업데이트하는 API 호출
    await fetch("http://localhost:3000/update-user-field", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: String(userId),
        field,
        newValue,
      }),
    });

    // Map 객체도 업데이트
    if (user) {
      user[field] = newValue;
      oriUsers.set(userId, user);
    }

    console.log(`${field} 필드가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("필드 업데이트 중 오류가 발생했습니다:", error);
  }
};

export const deleteAccount = async (userId) => {
  try {
    const filePath = "src/components/commmon/dummydata/userInfo.jsx";
    const idField = "id";

    await fetch("http://localhost:3000/delete-object", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: String(userId),
      }),
    });

    // Map 객체에서도 제거
    oriUsers.delete(userId);

    console.log(`사용자 ID ${userId}가 성공적으로 삭제되었습니다.`);

    if (await checkFourthLastChar(filePath)) {
      // 뒤에서 4번째 문자가 } 일 경우
      //await updateFile(filePath, "remove");
      await removeFromFileEnd(filePath, 3);
      await appendStringToFile(filePath, ",\n];");
    }
  } catch (error) {
    console.error("사용자 삭제 중 오류가 발생했습니다:", error);
  }
};

export const checkFourthLastChar = async (filePath) => {
  try {
    const response = await fetch(
      "http://localhost:3000/check-fourth-last-char",
      {
        // 서버의 API 호출
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath }), // filePath를 서버로 전달
      }
    );
    if (!response.ok) {
      throw new Error("네트워크 응답이 좋지 않습니다.");
    }
    const data = await response.json();
    return data.result; // 서버에서 반환된 result 값 (true/false)
  } catch (error) {
    console.error("문자를 확인하는 중 오류가 발생했습니다.", error);
    return null;
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
