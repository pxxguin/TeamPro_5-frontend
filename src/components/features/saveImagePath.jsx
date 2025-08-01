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

export const saveImagePath = async (projectId, field, path) => {
    const string = `
    {
        projectId: ${projectId},
        field: "${field}", 
        path: "${path}"
    }`;
    
    let filePath = "src/components/commmon/dummydata/imagePathInfo.jsx";
    
    await removeFromFileEnd(filePath, 3);
    await appendStringToFile(filePath, `${string}\n];`);
    try {
        // `];` 제거
        await removeFromFileEnd(filePath);
    
        // 새 객체 추가
        await appendStringToFile(filePath, string);
    }
    catch (error) {
    console.error("파일 업데이트 중 오류 발생:", error);
  }

};