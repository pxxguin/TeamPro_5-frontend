import { oriProjects } from "../domain/startProgram.js";
import Project from "../domain/Project.js";

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

export const saveProject = async (
  projectOwnerName, // 포폴 만든 사람 이름
  projectOwnerId, // 포폴 만든 사람 아이디
  projectOwnerNickname,
  projectOwnerEmail, // 포폴 만든 사람 이메일
  projectTemplate = null, //포폴 템플릿
  projectTitle, //포폴 이름
  description, //포폴 설명
  startDate,
  endDate,
  category,
  usedLanguage,
  projectLink = null,
  // projectLink = "없음",
  solving,
  challenge,
  video = null,
  coverImage = null,
  images = [],
  logo = null,
  // video = "없음",
  // coverImage = "없음",
  // images = [],
  // logo = "없음",
  share = false // 공유 여부
) => {
  if (
    !projectOwnerName ||
    !projectOwnerId ||
    !projectOwnerNickname ||
    !projectOwnerEmail ||
    !projectTitle ||
    !description ||
    !startDate ||
    !endDate ||
    !solving ||
    !challenge ||
    !usedLanguage
  ) {
    console.log(
      projectOwnerName,
      projectOwnerId,
      projectOwnerNickname,
      projectOwnerEmail,
      projectTitle,
      description,
      startDate,
      endDate,
      solving,
      challenge,
      usedLanguage
    );
    console.log("필수 정보가 누락됨");
    return;
  }

  let projectIds = Array.from(oriProjects.keys());
  const projectId =
    projectIds.length > 0 ? projectIds[projectIds.length - 1] + 1 : 1;

  // if (projectIds.includes(projectId)) {
  //   while (!projectIds.includes(projectId)) {
  //     projectId += 1;
  //   }
  // }

  const newProject = new Project(
    projectOwnerName,
    projectOwnerId,
    projectOwnerNickname,
    projectOwnerEmail,
    projectTemplate,
    projectId,
    projectTitle,
    description,
    startDate,
    endDate,
    category,
    usedLanguage,
    projectLink,
    solving,
    challenge,
    video,
    coverImage,
    images,
    logo,
    share
  );
  oriProjects.set(projectId, newProject);
  console.log(newProject);

  // !!! 수정한 코드 문자열로 변환함!!!
  const string = `
  {
      projectId: ${projectId},
      projectTemplate: ${projectTemplate},
      projectTitle: "${projectTitle}", 
      projectOwnerName: "${projectOwnerName}",
      description: "${description || ""}",
      startDate: "${startDate}", 
      endDate: "${endDate}", 
      category: "${category || ""}", 
      usedLanguage: "${usedLanguage}", 
      projectLink: "${projectLink || ""}",
      solving: "${solving}", 
      challenge: "${challenge}",
      video: "${video || " "}",
      coverImage: "${coverImage || ""}", 
      images: ${JSON.stringify(images || [])}, 
      logo: "${logo || ""}", 
      share: ${share},

      ownerId: "${projectOwnerId}",
      ownerEmail: "${projectOwnerEmail}"
  }`;

  let filePath = "src/components/commmon/dummydata/projectInfo.jsx";

  // await removeFromFileEnd(filePath, 3);
  // await appendStringToFile(filePath, `${string}\n];`);
  // try {
  //   // `];` 제거
  //   await removeFromFileEnd(filePath);

  //   // 새 객체 추가
  //   await appendStringToFile(filePath, string);
  // } catch (error) {
  //   console.error("파일 업데이트 중 오류 발생:", error);
  // }
  try {
    // `];` 제거
    await updateFile(filePath, "remove");

    // 새 객체 추가
    await updateFile(filePath, "append", string);
  } catch (error) {
    console.error("파일 업데이트 중 오류 발생:", error);
  }
};

export default saveProject;
