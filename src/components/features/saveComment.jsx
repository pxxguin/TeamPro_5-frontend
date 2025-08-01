import { oriComments, oriProjects } from "../domain/startProgram.js";
import Comment from "../domain/Comment.js";

// export const removeFromFileEnd = async (filePath, numCharsToRemove) => {
//   try {
//     await fetch("http://localhost:3000/remove-from-file-end", {
//       // 서버의 /remove-from-file-end API 호출
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ filePath, numCharsToRemove }), // filePath와 numCharsToRemove를 서버로 전달
//     });
//   } catch (error) {
//     console.error(
//       "파일 끝에서 문자열을 제거하는 중 오류가 발생했습니다.",
//       error
//     );
//   }
// };

// export const appendStringToFile = async (filePath, string) => {
//   try {
//     await fetch("http://localhost:3000/append-string", {
//       // 서버의 /append-string API 호출
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ filePath, string }), // filePath와 string을 서버로 전달
//     });
//   } catch (error) {
//     console.error("파일에 문자열을 추가하는 중 오류가 발생했습니다.", error);
//   }
// };
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

export const patchComments = async (filePath, projectId, commentId) => {
  try {
    await fetch("http://localhost:3000/patch-comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, projectId, commentId }),
    });
  } catch (error) {
    console.error("파일에 문자열을 추가하는 중 오류가 발생했습니다.", error);
  }
};

export const saveComment = async (portfolioId, userId, text) => {
  if (!text || !userId) {
    console.log("필수 정보가 누락됨");
    return;
  }

  if (!portfolioId) {
    console.log("portfolioId 값이 없음");
    return;
  }

  // 새 댓글 ID 생성
  let commentIds = Array.from(oriComments.keys());
  const commentId =
    commentIds.length > 0 ? commentIds[commentIds.length - 1] + 1 : 1;

  const newComment = new Comment(
    commentId,
    portfolioId,
    userId,
    text,
    new Date().toISOString().split("T")[0]
  );
  oriComments.set(commentId, newComment);
  console.log(newComment);

  // 파일에 저장할 문자열 형식
  const string = `
  {
    commentId: ${commentId},
    portfolioId: ${portfolioId},
    userId: "${userId}",
    text: "${text}",
    date: "${newComment.date}"
  }`;

  // 파일 경로 (데이터를 저장할 파일)
  let filePath = "src/components/commmon/dummydata/commentInfo.jsx";
  let projectFilePath = "src/components/commmon/dummydata/projectInfo.jsx";

  // // 파일의 끝에서 '];'를 제거하고 새 데이터를 추가
  // await removeFromFileEnd(filePath, 3);
  // await appendStringToFile(filePath, `,${string}\n];`);
  try {
    // `];` 제거
    await updateFile(filePath, "remove");

    // 새 객체 추가
    await updateFile(filePath, "append", string);
  } catch (error) {
    console.error("파일 업데이트 중 오류 발생:", error);
  }

  // 프로젝트의 comments에 commentId 추가
  patchComments(projectFilePath, portfolioId, commentId);

  console.log("FileIO를 통해 댓글 달기 완료");
};

export const removeComment = async (commentId) => {
  const commentIdField = "commentId";

  let comment = oriComments.get(commentId);
  const projectId = comment.portfolioId;

  let filePath = "src/components/commmon/dummydata/commentInfo.jsx";
  let projectFilePath = "src/components/commmon/dummydata/projectInfo.jsx";

  try {
    await Promise.all([
      fetch("http://localhost:3000/delete-object", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath,
          idField: String(commentIdField),
          id: Number(commentId),
        }),
      }),

      fetch("http://localhost:3000/remove-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filePath: projectFilePath,
          projectId: Number(projectId),
          commentId: Number(commentId),
        }),
      }),
    ]);

    // 로컬 `oriComments`에서 삭제
    oriComments.delete(commentId);
  } catch (error) {
    console.error("파일에서 댓글을 삭제하는 중 오류가 발생했습니다.", error);
  }
};

export default saveComment;
