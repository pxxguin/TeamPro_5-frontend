import { oriPortfolios } from "../domain/startProgram.js";
import Portfolio from "../domain/Portfolio.js";

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

export const savePortfolio = async (
  portfolioOwnerName, //소유자 이름
  portfolioOwnerId, // 포트폴리오 소유자 ID
  portfolioOwnerEamil,
  portfolioName, // 포트폴리오 이름
  selectedProjects = [], // 포함된 프로젝트 ID들
  usedLanguage = "", // 사용 언어
  frontend = "",
  backend = "",
  share = false // 공유 여부
) => {
  if (
    !portfolioOwnerId ||
    !portfolioName ||
    selectedProjects.length === 0 ||
    !usedLanguage
  ) {
    console.error("필수 정보가 누락되었습니다.");
    return;
  }

  // 새 포트폴리오 ID 생성
  let portfolioIds = Array.from(oriPortfolios.keys());
  const portfolioId =
    portfolioIds.length > 0 ? portfolioIds[portfolioIds.length - 1] + 1 : 1;

  // 포트폴리오 객체 생성
  const newPortfolio = new Portfolio(
    portfolioId, // 포트폴리오 ID
    portfolioOwnerName, //소유자 이름
    portfolioOwnerId, // 소유자 ID
    portfolioOwnerEamil,
    portfolioName, // 포트폴리오 이름
    selectedProjects, // 포함된 프로젝트들
    usedLanguage, // 사용 언어
    frontend,
    backend,
    share // 공유 여부
  );

  // 로컬 데이터에 추가
  oriPortfolios.set(portfolioId, newPortfolio);
  console.log("새로운 포트폴리오 생성:", newPortfolio);

  // 파일에 저장할 문자열 변환
  const string = `
  {
    portfolioId: ${portfolioId},
    portfolioName: "${portfolioName}",
    ownerName: "${portfolioOwnerName}",
    ownerId: "${portfolioOwnerId}",
    ownerEmail: "${portfolioOwnerEamil}",
    projects: ${JSON.stringify(selectedProjects)},
    usedLanguage: "${usedLanguage}",
    frontend: "${frontend}",
    backend: "${backend}",
    share: ${share}
  }`;

  // 파일 경로
  let filePath = "src/components/commmon/dummydata/portfolioInfo.jsx";

  try {
    // `];` 제거
    await updateFile(filePath, "remove");

    // 새 객체 추가
    await updateFile(filePath, "append", string);
  } catch (error) {
    console.error("파일 업데이트 중 오류 발생:", error);
  }
};

export default savePortfolio;
