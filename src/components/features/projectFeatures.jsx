import { oriProjects } from "../domain/startProgram.js";

export const updateProject = async (projectId, field, newValue) => {
  const idField = "projectId";
  let project = oriProjects.get(projectId);
  if (!project) {
    console.error(`프로젝트 ID ${projectId}에 해당하는 데이터가 없습니다.`);
    return;
  }

  if (project[field] == newValue) {
    console.log("기존과 같은 값이 입력됨");
    return;
  }

  if (!newValue) {
    console.log("입력된 값이 없음");
    return;
  }

  try {
    // usedTemplate은 숫자형이어야 하므로 이를 숫자형으로 변환
    if (field === "usedTemplate") {
      newValue = Number(newValue); // 숫자로 변환
    }

    const filePath = "src/components/commmon/dummydata/projectInfo.jsx";

    // 필드를 업데이트하는 API 호출
    await fetch("http://localhost:3000/update-field", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: Number(projectId),
        field,
        newValue,
      }),
    });

    // Map 객체도 업데이트
    if (project) {
      project[field] = newValue;
      oriProjects.set(projectId, project);
    }

    console.log(`${field} 필드가 성공적으로 업데이트되었습니다.`);
  } catch (error) {
    console.error("필드 업데이트 중 오류가 발생했습니다:", error);
  }
};

// // 프로젝트 삭제
// export const deleteProject = async (projectId) => {
//   try {
//     const filePath = "src/components/commmon/dummydata/projectInfo.jsx";
//     const idField = "projectId";

//     await fetch("http://localhost:3000/delete-object", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         filePath,
//         idField,
//         id: Number(projectId),
//       }),
//     });

//     // Map 객체에서도 제거
//     oriProjects.delete(projectId);

//     console.log(`프로젝트 ID ${projectId}가 성공적으로 삭제되었습니다.`);
//   } catch (error) {
//     console.error("삭제 중 오류가 발생했습니다:", error);
//   }
// };

// 프로젝트 삭제
export const deleteProject = async (projectId) => {
  try {
    const filePath = "src/components/commmon/dummydata/projectInfo.jsx";
    const idField = "projectId";

    await fetch("http://localhost:3000/delete-object", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: Number(projectId),
      }),
    });

    // Map 객체에서도 제거
    oriProjects.delete(projectId);

    console.log(`프로젝트 ID ${projectId}가 성공적으로 삭제되었습니다.`);

    if (await checkFourthLastChar(filePath)) {
      // 뒤에서 4번째 문자가 } 일 경우
      //await updateFile(filePath, "remove");
      await removeFromFileEnd(filePath, 3);
      await appendStringToFile(filePath, ",\n];");
    }
  } catch (error) {
    console.error("삭제 중 오류가 발생했습니다:", error);
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
