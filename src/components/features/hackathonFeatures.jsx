import { oriHackathons } from "../domain/startProgram";
import Hackathon from "../domain/Hackathon";
import { appendStringToFile, removeFromFileEnd } from "./signUpDeveloper";

// const filePath = "/src/components/commmon/dummydata/hackathonInfo.jsx";

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

export const saveHackathon = async (
  hackName,
  startDate,
  endDate,
  link,
  maxMemNumber,
  description,
  video = null,
  pictures = null,
  coverImage = null,
  logo = null,
  part,
  ownerId,
  ownerEmail,
  participant = []
) => {
  if (
    !hackName ||
    !startDate ||
    !endDate ||
    !link ||
    !maxMemNumber ||
    !description ||
    !part
  ) {
    console.log(hackName, startDate, endDate, link, maxMemNumber, description);
    console.log("필수 정보가 누락됨");
    return;
  }

  const filePath = "src/components/commmon/dummydata/hackathonInfo.jsx";

  let hackIds = Array.from(oriHackathons.keys());
  const hackId = hackIds.length > 0 ? hackIds[hackIds.length - 1] + 1 : 1;

  let hackathon = new Hackathon(
    hackId,
    hackName,
    startDate,
    endDate,
    link,
    maxMemNumber,
    description,
    video,
    pictures,
    coverImage,
    logo,
    part,
    ownerId,
    ownerEmail,
    participant
  );
  oriHackathons.set(hackId, hackathon);

  const string = `    {
        hackId: ${hackId},
        hackName: "${hackName}",
        startDate: "${startDate}",
        endDate: "${endDate}",
        link: "${link}",
        maxMemNumber: ${maxMemNumber},
        description: "${description}",
        video: "${video || ""}",
        pictures: ${JSON.stringify(pictures || [])},
        coverImage: "${coverImage || ""}",
        logo: "${logo || ""}",
        part: "${part || ""}",
        ownerId: "${ownerId}",
        ownerEmail: "${ownerEmail}",
        participant: ${JSON.stringify(participant)},
    }`;

  // await removeFromFileEnd(filePath, 2);

  // console.log('removeFromFileEnd에서 오류 발생하지 않음');

  // await appendStringToFile(filePath, `,${string}\n];`);

  // console.log('appendStringToFile에서 오류 발생하지 않음');
  try {
    // `];` 제거
    await updateFile(filePath, "remove");

    // 새 객체 추가
    await updateFile(filePath, "append", string);
  } catch (error) {
    console.error("파일 업데이트 중 오류 발생:", error);
  }
};

export const updateHackathon = async (hackId, field, newValue) => {
  const idField = "hackId";
  let hackathon = oriHackathons.get(hackId);
  console.log(hackId); // 잘 나옴
  console.log(hackathon); // 변경값으로 잘 나옴

  if (!hackathon) {
    console.error(`Hackathon with hackId ${hackId} not found`);
    return;
  }

  // 같은 값으로 업데이트하려는 경우 방지
  if (hackathon[field] == newValue) {
    console.log("기존과 같은 값이 입력됨");
    return;
  }

    try {
        // maxMemNumber는 숫자형이어야 하므로 이를 숫자형으로 변환
        if (field === "maxMemNumber") {
            newValue = Number(newValue); // 숫자로 변환
        }

        const filePath = "src/components/commmon/dummydata/hackathonInfo.jsx";
        
        // 필드를 업데이트하는 API 호출
        await fetch('http://localhost:3000/update-user-field', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filePath,
                idField,
                id: Number(hackId),
                field,
                newValue
            }),
        });

        // Map 객체도 업데이트
        if(hackathon){
        hackathon[field] = newValue;
        oriHackathons.set(hackId, hackathon);
        }
        
        console.log(`${field} 필드가 성공적으로 업데이트되었습니다.`);
    } catch (error) {
        console.error('필드 업데이트 중 오류가 발생했습니다:', error);
};

export const deleteHackathon = async (hackId) => {
  try {
    const filePath = "src/components/commmon/dummydata/hackathonInfo.jsx";
    const idField = "hackId";

    await fetch("http://localhost:3000/delete-object", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        idField,
        id: Number(hackId),
      }),
    });

    // Map 객체에서도 제거
    oriHackathons.delete(hackId);

    console.log(`해커톤 ID ${hackId}가 성공적으로 삭제되었습니다.`);
  } catch (error) {
    console.error("해커톤 삭제 중 오류가 발생했습니다:", error);
  }
};

// 해커톤 지원
export const updateParticipant = async (hackId, userId) => {
  console.log(typeof hackId);

  const hackathon = oriHackathons.get(Number(hackId));

  // hackathon이 undefined인 경우 처리
  if (!hackathon) {
    console.error(`Hackathon with id ${hackId} not found.`);
    return;
  }

  if (hackathon["participant"].includes(userId)) {
    console.log("이미 참여하는 해커톤에 지원할 수 없음");
    // alert("이미 참여하는 해커톤에 지원할 수 없습니다.");
    return;
  }

  const newMemNumber = hackathon["participant"].length + 1;

  if (hackathon["maxMemNumber"] < newMemNumber) {
    alert("모집 인원을 초과하여 지원할 수 없습니다.");
    return;
  }

  try {
    const filePath = "src/components/commmon/dummydata/hackathonInfo.jsx";

    // 필드를 업데이트하는 API 호출
    await fetch("http://localhost:3000/patch-participant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        hackId: Number(hackId),
        userId: String(userId),
        newMemNumber,
      }),
    });

    // Map 객체도 업데이트
    hackathon["participant"] = hackathon["participant"] || []; // participant가 없으면 빈 배열로 초기화
    hackathon["participant"].push(userId);
    oriHackathons.set(hackId, hackathon);

    console.log(
      `${hackathon["participant"]} 필드가 성공적으로 업데이트되었습니다.`
    );
  } catch (error) {
    console.error("필드 업데이트 중 오류가 발생했습니다:", error);
  }
};

// export const isIncludedParticipant = (hackId, userId) => {
//     const hackathon = oriHackathons.get(hackId);
//     console.log(userId);
//     if (!hackathon) return;

//     return hackathon.participant.includes(userId) ? true : false;
// }
export const isIncludedParticipant = (hackId, userId) => {
  const hackathon = oriHackathons.get(hackId);
  if (!hackathon) return false;
  const value = hackathon.participant.includes(userId);
  if (value) {
    console.log(value);
    return true;
  } else {
    return false;
  }
  // return hackathon.participant.includes(userId);
};
