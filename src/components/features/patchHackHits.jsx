import { oriHackathons } from "../domain/startProgram.js";

export const patchHitsByServer = async (filePath, projectId, newHits) => {
  // userId : 프로젝트를 누른 유저의 Id를 가져옴
  // projectId: 해당 유저가 누른 프로젝트의 Id를 가져옴

  try {
    await fetch("http://localhost:3000/patch-hits", {
      // 서버의 /patch-hits API 호출
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, projectId, newHits }),
    });
  } catch (error) {
    console.error("파일에 문자열을 추가하는 중 오류가 발생했습니다.", error);
  }
};

export const patchHackHits = (userId, hackId) => {
  const FILE_PATH = "src/components/commmon/dummydata/hackathonInfo.jsx";
  let hack = oriHackathons.get(hackId);

  if (userId == hack.ownerId) {
    return; // 자신의 프로젝트를 누른 경우 증가하지 않고 종료
  } else {
    const newHits = hack.hits + 1;
    patchHitsByServer(FILE_PATH, hackId, newHits);
  }
};
