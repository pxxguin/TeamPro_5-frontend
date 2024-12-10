import express from "express";
import fs from "fs-extra";
import path from "path";
import { createServer } from "vite";
import cors from "cors";
import { fileURLToPath } from "url";
import multer from "multer";
import bodyParsers from "body-parser";

// __dirname 설정 (ES 모듈 호환)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

//const multer = require("multer");
//const path = require("path");
const uploadDir = path.join(__dirname, "uploads");

// uploads 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
////////////////////////////////

app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true })); // URL-encoded 요청 처리

// 파일 읽기
app.post("/read-number", (req, res) => {
  const { filePath } = req.body;
  const absolutePath = path.resolve(__dirname, filePath); // 절대 경로로 변환
  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("파일을 읽는 중 오류가 발생했습니다:", err);
      return res
        .status(500)
        .json({ error: "파일을 읽는 중 오류가 발생했습니다." });
    }
    const number = Number(data.trim()); // 숫자 변환
    res.json({ number });
  });
});

// 파일 내용 비우기
app.post("/truncate-file", (req, res) => {
  const { filePath } = req.body;
  const absolutePath = path.resolve(__dirname, filePath); // 절대 경로로 변환
  fs.truncate(absolutePath, 0, (err) => {
    if (err) {
      console.error("파일을 비우는 중 오류가 발생했습니다:", err);
      return res
        .status(500)
        .json({ error: "파일을 비우는 중 오류가 발생했습니다." });
    }
    res.json({ success: true });
  });
});

//뒤에서 n개의 문자 지우기
app.post("/remove-from-file-end", (req, res) => {
  const { filePath, numCharsToRemove } = req.body;
  const absolutePath = path.resolve(__dirname, filePath); // 절대 경로로 변환
  fs.stat(absolutePath, (err, stats) => {
    if (err) {
      console.error("파일 정보를 읽는 중 오류가 발생했습니다:", err);
      return res
        .status(500)
        .json({ error: "파일 정보를 읽는 중 오류가 발생했습니다." });
    }
    const newLength = Math.max(0, stats.size - numCharsToRemove); // 새로운 파일 크기 계산
    fs.truncate(absolutePath, newLength, (err) => {
      if (err) {
        console.error("파일을 비우는 중 오류가 발생했습니다:", err);
        return res
          .status(500)
          .json({ error: "파일을 비우는 중 오류가 발생했습니다." });
      }
      res.json({ success: true });
    });
  });
});

// 파일에 글 추가
app.post("/append-string", (req, res) => {
  const { filePath, string } = req.body;
  const absolutePath = path.resolve(__dirname, filePath); // 절대 경로로 변환
  console.log("파일 경로:", absolutePath); // 절대 경로 확인

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("파일을 읽는 중 오류가 발생했습니다:", err);
      return res
        .status(500)
        .json({ error: "파일을 읽는 중 오류가 발생했습니다." });
    }
    const newData = data + string; // 기존 데이터에 추가
    fs.writeFile(absolutePath, newData, "utf8", (err) => {
      if (err) {
        console.error("파일을 저장하는 중 오류가 발생했습니다:", err);
        return res
          .status(500)
          .json({ error: "파일을 저장하는 중 오류가 발생했습니다." });
      }
      res.json({ success: true });
    });
  });
});

//파일 뒤에 객체 붙이기
app.post("/update-file", (req, res) => {
  const { filePath, operation, string } = req.body; // operation 추가
  const absolutePath = path.resolve(__dirname, filePath);

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("파일 읽기 오류:", err);
      return res.status(500).json({ error: "파일 읽기 오류" });
    }

    let updatedData;
    if (operation === "remove") {
      // // 파일 끝의 `];` 제거
      updatedData = data.replace(/,\s*\];\s*$/, "");
    } else if (operation === "append") {
      // 문자열 추가 후 닫기
      updatedData = `${data.trim()},\n${string.trim()},\n];`;
    } else {
      return res.status(400).json({ error: "알 수 없는 작업 요청" });
    }

    fs.writeFile(absolutePath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("파일 쓰기 오류:", err);
        return res.status(500).json({ error: "파일 쓰기 오류" });
      }
      res.json({ success: true });
    });
  });
});

// 파일 크기 가져오기
app.post("/get-file-size", (req, res) => {
  const { filePath } = req.body;
  const absolutePath = path.resolve(__dirname, filePath); // 절대 경로로 변환
  fs.stat(absolutePath, (err, stats) => {
    if (err) {
      console.error("파일 크기를 가져오는 중 오류가 발생했습니다:", err);
      return res
        .status(500)
        .json({ error: "파일 크기를 가져오는 중 오류가 발생했습니다." });
    }
    const size = stats.size;
    let fileSize = "";
    if (size < 1024) {
      fileSize = `${size} bytes`;
    } else if (size < 1048576) {
      fileSize = `${(size / 1024).toFixed(1)} KB`;
    } else {
      fileSize = `${(size / 1048576).toFixed(1)} MB`;
    }
    res.json({ fileSize });
  });
});

app.post("/patch-hits", async (req, res) => {
  try {
    const { filePath, projectId, newHits } = req.body;

    // 파일 읽기
    const data = await fs.readFile(filePath, "utf8");

    // JavaScript 객체 문자열을 JSON으로 변환하기 위한 전처리
    let contentWithoutExport = data.replace("export const projectInfo = ", "");
    contentWithoutExport = contentWithoutExport.replace(/;\s*$/, ""); // 끝에 있는 세미콜론 제거

    // JavaScript 객체를 JSON으로 변환하기 위한 함수
    function convertToValidJSON(jsString) {
      try {
        // eval을 안전하게 사용하기 위한 Function 생성
        return Function(`"use strict"; return (${jsString})`)();
      } catch (error) {
        console.error("JavaScript 객체 파싱 에러:", error);
        throw error;
      }
    }

    // JavaScript 객체 문자열을 실제 객체로 변환
    const projectsObj = convertToValidJSON(contentWithoutExport);

    // hits 업데이트
    const updatedProjects = projectsObj.map((project) => {
      if (project.projectId === projectId) {
        return { ...project, hits: newHits };
      }
      return project;
    });

    // 다시 파일에 쓸 때는 원래 형식으로 변환
    const updatedContent =
      "export const projectInfo = " +
      JSON.stringify(updatedProjects, null, 2)
        .replace(/"([^"]+)":/g, "$1:") // 속성 이름의 따옴표 제거
        .replace(/}]/g, "}\n]") +
      ";\n";

    // 파일 쓰기
    await fs.writeFile(filePath, updatedContent, "utf8");
    res.json({ success: true, hits: newHits });
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({
      error: "파일 처리 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

//해커톤 조회수
app.post("/patch-hack-hits", async (req, res) => {
  try {
    const { filePath, hackId, newHits } = req.body;

    // 파일 읽기
    const data = await fs.readFile(filePath, "utf8");

    // JavaScript 객체 문자열을 JSON으로 변환하기 위한 전처리
    let contentWithoutExport = data.replace("export const projectInfo = ", "");
    contentWithoutExport = contentWithoutExport.replace(/;\s*$/, ""); // 끝에 있는 세미콜론 제거

    // JavaScript 객체를 JSON으로 변환하기 위한 함수
    function convertToValidJSON(jsString) {
      try {
        // eval을 안전하게 사용하기 위한 Function 생성
        return Function(`"use strict"; return (${jsString})`)();
      } catch (error) {
        console.error("JavaScript 객체 파싱 에러:", error);
        throw error;
      }
    }

    // JavaScript 객체 문자열을 실제 객체로 변환
    const projectsObj = convertToValidJSON(contentWithoutExport);

    // hits 업데이트
    const updatedProjects = projectsObj.map((project) => {
      if (project.hackId === hackId) {
        return { ...project, hits: newHits };
      }
      return project;
    });

    // 다시 파일에 쓸 때는 원래 형식으로 변환
    const updatedContent =
      "export const projectInfo = " +
      JSON.stringify(updatedProjects, null, 2)
        .replace(/"([^"]+)":/g, "$1:") // 속성 이름의 따옴표 제거
        .replace(/}]/g, "}\n]") +
      ";\n";

    // 파일 쓰기
    await fs.writeFile(filePath, updatedContent, "utf8");
    res.json({ success: true, hits: newHits });
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({
      error: "파일 처리 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

app.post("/patch-contacts", async (req, res) => {
  try {
    const { filePath1, filePath2, projectId, newContact } = req.body;

    // 파일 읽기
    const data1 = await fs.readFile(filePath1, "utf8");
    const data2 = await fs.readFile(filePath2, "utf8");

    // JavaScript 객체 문자열을 실제 객체로 변환
    let contentWithoutExport1 = data1.replace(
      "export const projectInfo = ",
      ""
    );
    contentWithoutExport1 = contentWithoutExport1.replace(/;\s*$/, "");
    let contentWithoutExport2 = data2.replace("export const userInfo = ", "");
    contentWithoutExport2 = contentWithoutExport2.replace(/;\s*$/, "");

    function convertToValidJSON(jsString) {
      try {
        return Function(`"use strict"; return (${jsString})`)();
      } catch (error) {
        console.error("JavaScript 객체 파싱 에러:", error);
        throw error;
      }
    }

    const projectInfo = convertToValidJSON(contentWithoutExport1);
    const userInfo = convertToValidJSON(contentWithoutExport2); // 수정됨

    // 해당 projectId의 project 객체 찾기
    const project = projectInfo.find((p) => p.projectId === projectId);
    // 해당 newContact의 user 객체 찾기
    const recruiter = userInfo.find((u) => u.id === newContact);

    // 프로젝트의 contacts 필드 업데이트
    if (!project.contacts) {
      project.contacts = [];
    }
    if (!project.contacts.includes(newContact)) {
      project.contacts.push(newContact);
    }

    // 채용자의 contacts 필드 업데이트
    if (!recruiter.contacts) {
      recruiter.contacts = [];
    }
    if (!recruiter.contacts.includes(projectId)) {
      recruiter.contacts.push(projectId);
    }

    // 두 파일 모두 업데이트
    const updatedContent1 =
      "export const projectInfo = " +
      JSON.stringify(projectInfo, null, 2)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/}]/g, "}\n]") +
      ";\n";

    const updatedContent2 =
      "export const userInfo = " +
      JSON.stringify(userInfo, null, 2)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/}]/g, "}\n]") +
      ";\n";

    // 두 파일 모두 저장
    await fs.writeFile(filePath1, updatedContent1, "utf8");
    await fs.writeFile(filePath2, updatedContent2, "utf8");
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({
      success: false,
      error: "파일 처리 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

app.post("/patch-likes", async (req, res) => {
  try {
    const { filePath, projectId, userId } = req.body;

    // 파일 읽기
    const data = await fs.readFile(filePath, "utf8");

    // JavaScript 객체 문자열을 실제 객체로 변환
    let contentWithoutExport = data.replace("export const projectInfo = ", "");
    contentWithoutExport = contentWithoutExport.replace(/;\s*$/, "");

    function convertToValidJSON(jsString) {
      try {
        return Function(`"use strict"; return (${jsString})`)();
      } catch (error) {
        console.error("JavaScript 객체 파싱 에러:", error);
        throw error;
      }
    }

    const projectInfo = convertToValidJSON(contentWithoutExport);

    // 해당 projectId의 project 객체 찾기
    const project = projectInfo.find((p) => p.projectId === projectId);

    // 프로젝트의 likes 필드 업데이트
    if (!project.likes) {
      project.likes = [];
    }
    if (!project.likes.includes(userId)) {
      project.likes.push(userId);
    } else {
      project.likes = project.likes.filter((element) => element != userId);
    }

    const updatedContent =
      "export const projectInfo = " +
      JSON.stringify(projectInfo, null, 2)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/}]/g, "}\n]") +
      ";\n";

    await fs.writeFile(filePath, updatedContent, "utf8");
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({
      success: false,
      error: "파일 처리 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

app.post("/patch-comments", async (req, res) => {
  try {
    const { filePath, projectId, commentId } = req.body;

    if (!projectId) return;

    // 파일 읽기
    const data = await fs.readFile(filePath, "utf8");

    // JavaScript 객체 문자열을 실제 객체로 변환
    let contentWithoutExport = data.replace("export const projectInfo = ", "");
    contentWithoutExport = contentWithoutExport.replace(/;\s*$/, "");

    function convertToValidJSON(jsString) {
      try {
        return Function(`"use strict"; return (${jsString})`)();
      } catch (error) {
        console.error("JavaScript 객체 파싱 에러:", error);
        throw error;
      }
    }

    const projectInfo = convertToValidJSON(contentWithoutExport);

    const project = projectInfo.find((p) => p.projectId === projectId);
    console.log("projectId: ", projectId);
    console.log("project: ", project);

    if (!project.comments) {
      project.comments = [];
    }
    if (!project.comments.includes(commentId)) {
      project.comments.push(commentId);
    } else {
      project.likes = project.comments.filter(
        (element) => element != commentId
      );
    }

    const updatedContent =
      "export const projectInfo = " +
      JSON.stringify(projectInfo, null, 2)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/}]/g, "}\n]") +
      ";\n";

    await fs.writeFile(filePath, updatedContent, "utf8");
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({
      success: false,
      error: "파일 처리 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

app.post("/remove-comments", async (req, res) => {
  try {
    const { filePath, projectId, commentId } = req.body;

    // 파일 읽기
    const data = await fs.readFile(filePath, "utf8");

    // JavaScript 객체 문자열을 실제 객체로 변환
    let contentWithoutExport = data.replace("export const projectInfo = ", "");
    contentWithoutExport = contentWithoutExport.replace(/;\s*$/, "");

    function convertToValidJSON(jsString) {
      try {
        return Function(`"use strict"; return (${jsString})`)();
      } catch (error) {
        console.error("JavaScript 객체 파싱 에러:", error);
        throw error;
      }
    }

    const projectInfo = convertToValidJSON(contentWithoutExport);

    const project = projectInfo.find((p) => p.projectId === projectId);

    if (!project.comments) {
      project.comments = [];
    }
    if (project.comments.includes(commentId)) {
      project.comments = project.comments.filter(
        (element) => element != commentId
      );
    }

    const updatedContent =
      "export const projectInfo = " +
      JSON.stringify(projectInfo, null, 2)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/}]/g, "}\n]") +
      ";\n";

    await fs.writeFile(filePath, updatedContent, "utf8");
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({
      success: false,
      error: "파일 처리 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

app.post("/patch-participant", async (req, res) => {
  try {
    const { filePath, hackId, userId } = req.body;

    // 파일 읽기
    const data = await fs.readFile(filePath, "utf8");

    // JavaScript 객체 문자열을 실제 객체로 변환
    let contentWithoutExport = data.replace(
      "export const hackathonInfo = ",
      ""
    );
    contentWithoutExport = contentWithoutExport.replace(/;\s*$/, "");

    function convertToValidJSON(jsString) {
      try {
        return Function(`"use strict"; return (${jsString})`)();
      } catch (error) {
        console.error("JavaScript 객체 파싱 에러:", error);
        throw error;
      }
    }

    const hackathonInfo = convertToValidJSON(contentWithoutExport);

    // const hackathon = hackathonInfo.find(p => p.hackId === hackId);
    const hackathon = hackathonInfo.find(
      (p) => Number(p.hackId) === Number(hackId)
    );

    console.log("hackId: ", hackId);
    console.log("hackathon: ", hackathon);

    if (!hackathon.participant) {
      hackathon.participant = [];
    }
    if (!hackathon.participant.includes(userId)) {
      hackathon.participant.push(userId);
    } else {
      hackathon.participant = hackathon.participant.filter(
        (element) => element != userId
      );
    }

    const updatedContent =
      "export const hackathonInfo = " +
      JSON.stringify(hackathonInfo, null, 2)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/}]/g, "}\n]") +
      ";\n";

    await fs.writeFile(filePath, updatedContent, "utf8");
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({
      success: false,
      error: "파일 처리 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

app.post("/delete-object", (req, res) => {
  const { filePath, idField, id } = req.body;
  const absolutePath = path.resolve(__dirname, filePath);

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("파일을 읽는 중 오류가 발생했습니다:", err);
      return res
        .status(500)
        .json({ error: "파일을 읽는 중 오류가 발생했습니다." });
    }

    // 객체 삭제를 위한 정규식
    const pattern = new RegExp(
      `(,?\\s*\\{[^}]*${idField}:\\s*['"]?${id}['"]?[^}]*\\},?)`,
      "g"
    );
    let newData = data.replace(pattern, "");

    // 연속된 쉼표 제거
    newData = newData.replace(/,\s*,/g, ",");

    // 배열의 시작과 끝 쉼표 정리
    newData = newData.replace(/\[\s*,/g, "[");
    newData = newData.replace(/,\s*]/g, "]");

    // 객체 사이의 불필요한 공백 및 개행 정리
    newData = newData.replace(/}\s*{/g, "},\n  {");

    fs.writeFile(absolutePath, newData, "utf8", (err) => {
      if (err) {
        console.error("파일을 저장하는 중 오류가 발생했습니다:", err);
        return res
          .status(500)
          .json({ error: "파일을 저장하는 중 오류가 발생했습니다." });
      }
      res.json({ success: true });
    });
  });
});

//뒤에서 4번째 문자가 }인지 확인
app.post("/check-fourth-last-char", (req, res) => {
  const { filePath } = req.body;
  const absolutePath = path.resolve(__dirname, filePath);

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("파일을 읽는 중 오류가 발생했습니다:", err);
      return res
        .status(500)
        .json({ error: "파일을 읽는 중 오류가 발생했습니다." });
    }

    try {
      // 데이터에서 마지막 네 번째 문자를 확인
      const trimmedData = data.trim(); // 앞뒤 공백 제거
      if (trimmedData.length < 4) {
        return res.status(200).json({ result: false }); // 4자 이하인 경우 false 반환
      }

      const fourthLastChar = trimmedData[trimmedData.length - 4]; // 네 번째 문자
      const isClosingBrace = fourthLastChar === "}"; // 네 번째 문자가 }인지 확인

      return res.status(200).json({ result: isClosingBrace });
    } catch (error) {
      console.error("처리 중 오류가 발생했습니다:", error);
      res.status(500).json({ error: "데이터 처리 중 오류가 발생했습니다." });
    }
  });
});
app.post("/update-user-field", (req, res) => {
  console.log("update-user-field 시작됨");
  const { filePath, idField, id, field, newValue } = req.body;
  const absolutePath = path.resolve(__dirname, filePath);

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("파일을 읽는 중 오류가 발생했습니다:", err);
      return res
        .status(500)
        .json({ error: "파일을 읽는 중 오류가 발생했습니다." });
    }

    const pattern = new RegExp(
      `(${idField}: *['"]?)${id}(['"]?[^}]*\\b${field}\\b: *)['"']?.*?['"']?(?=,|})`,
      "g"
    );

    const updatedData = data.replace(pattern, (match, prefix1, prefix2) => {
      // newValue의 타입에 따라 다르게 처리
      if (typeof newValue === "number") {
        return `${prefix1}${id}${prefix2}${newValue}`;
      } else {
        const quote = match.includes('"') ? '"' : "'";
        return `${prefix1}${id}${prefix2}${quote}${newValue}${quote}`;
      }
    });

    fs.writeFile(absolutePath, updatedData, "utf8", (err) => {
      if (err) {
        console.error("파일을 저장하는 중 오류가 발생했습니다:", err);
        return res
          .status(500)
          .json({ error: "파일을 저장하는 중 오류가 발생했습니다." });
      }
      res.json({ success: true });
    });
  });
});

app.post("/update-field", (req, res) => {
  const { filePath, idField, id, field, newValue } = req.body;
  const absolutePath = path.resolve(__dirname, filePath);

  fs.readFile(absolutePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "파일을 읽을 수 없습니다." });
    }

    try {
      const pattern = new RegExp(
        `({[\\s\\S]*?projectId: *${id}[\\s\\S]*?${field}: *)((?:\\[[^\\]]*\\])|(?:["'].*?["'])|(?:\\d+)|(?:true|false))([,}])`,
        "g"
      );

      const formatValue = (value) => {
        if (Array.isArray(value)) return `[]`;
        if (typeof value === "string") return `"${value}"`;
        return value;
      };

      const updatedData = data.replace(
        pattern,
        (match, before, oldValue, endChar) => {
          return `${before}${formatValue(newValue)}${endChar}`;
        }
      );

      fs.writeFile(absolutePath, updatedData, "utf8", (err) => {
        if (err) {
          return res.status(500).json({ error: "파일을 저장할 수 없습니다." });
        }
        res.json({ success: true });
      });
    } catch (error) {
      console.error("업데이트 중 오류:", error);
      res.status(500).json({ error: "데이터 처리 중 오류가 발생했습니다." });
    }
  });
});

// 업로드 디렉토리가 없으면 생성
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// Multer 스토리지 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 파일이 저장될 경로
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 파일 이름
  },
});

// const upload = multer({ storage: storage });

// 파일 필터 추가
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image file"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: 파일 형식이 올바르지 않습니다.");
  },
});

const uploadMultiple = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: 파일 형식이 올바르지 않습니다.");
  },
  // 최대 업로드 파일 수와 파일 크기 제한 (옵션)
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
    files: 4, // 최대 4 파일 제한
  },
});

//수연언니 코드
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

app.post("/update-project-photo", upload.single("photo"), async (req, res) => {
  var { filePath, projectId, field } = req.body;
  console.log("filePath: ", filePath);
  console.log("projectId:", projectId, typeof projectId);
  const absolutePath = path.resolve(__dirname, filePath);

  projectId = Number(projectId);

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "파일이 업로드되지 않았습니다.",
    });
  }

  const photoPath = req.file.path;

  /// 파일 읽기
  const data = await fs.readFile(filePath, "utf8");

  // JavaScript 객체 문자열을 실제 객체로 변환
  let contentWithoutExport = data.replace("export const projectInfo = ", "");
  contentWithoutExport = contentWithoutExport.replace(/;\s*$/, "");

  function convertToValidJSON(jsString) {
    try {
      return Function(`"use strict"; return (${jsString})`)();
    } catch (error) {
      console.error("JavaScript 객체 파싱 에러:", error);
      throw error;
    }
  }

  const projectInfo = convertToValidJSON(contentWithoutExport);

  // 특정 프로젝트 찾아 photo 필드 업데이트
  const project = projectInfo.find((p) => p.projectId === projectId);
  console.log("project: ", project);
  if (project) {
    project[field] = photoPath;

    const updatedContent =
      "export const projectInfo = " +
      JSON.stringify(projectInfo, null, 2)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/}]/g, "}\n]") +
      ";\n";

    await fs.writeFile(absolutePath, updatedContent, "utf8");

    res.json({
      success: true,
      message: "이미지 업로드 완료",
      uploadedPath: photoPath,
    });
  } else {
    res
      .status(404)
      .json({ success: false, message: "프로젝트를 찾을 수 없습니다." });
  }
});

app.post("/add-project-photo", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "파일이 업로드되지 않았습니다.",
      });
    }

    // const imagePath = path.join('/uploads', req.file.filename); // 이미지 경로 생성
    // res.json({ success: true, imagePath: imagePath });

    const photoPath = path.normalize(req.file.path).replace(/\\/g, "/");
    console.log("photoPath: ", photoPath);
    res.json({
      success: true,
      message: "이미지 업로드 완료",
      uploadedPath: photoPath,
    });
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    res.status(500).json({
      success: false,
      message: "서버 오류: " + error.message,
    });
  }
});

app.post(
  "/add-multiple-photos",
  uploadMultiple.array("photos"),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "파일이 업로드되지 않았습니다.",
        });
      }

      // 파일 경로들을 정규화하여 저장
      const uploadedPaths = req.files.map((file) =>
        path.normalize(file.path).replace(/\\/g, "/")
      );

      console.log("uploadedPaths: ", uploadedPaths);

      res.json({
        success: true,
        message: "이미지들 업로드 완료",
        uploadedPaths: uploadedPaths,
      });
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      res.status(500).json({
        success: false,
        message: "서버 오류: " + error.message,
      });
    }
  }
);

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "파일이 없습니다.",
    });
  }

  // 경로를 템플릿 문자열로 생성
  const imagePath = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    imagePath: imagePath,
  });
});

// app.post("/upload", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res
//       .status(400)
//       .json({ success: false, message: "파일이 없습니다." });
//   }

//   const imagePath = path.join('/uploads', req.file.filename); // 이미지 경로 생성
//   res.json({ success: true, imagePath: photoPath });
// });

app.use("/uploads", express.static("uploads")); // 업로드된 파일을 정적 파일로 제공

//   console.log("서버가 3000번 포트에서 실행 중입니다.");
// });

// 수연 언니 코드
// app.post("/add-project-photo", upload.single("photo"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       message: "파일이 업로드되지 않았습니다.",
//     });
//   }

//   const photoPath = req.file.path;
//   res.json({
//     success: true,
//     message: "이미지 업로드 완료",
//     uploadedPath: photoPath,
//   });
// });

// Vite 개발 서버 시작
async function startVite() {
  const vite = await createServer({
    server: { middlewareMode: "ssr" }, // Vite를 미들웨어 모드로 실행
  });

  // Vite의 미들웨어를 Express 앱에 연결
  app.use(vite.middlewares);

  // 서버 시작
  app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
  });
}

startVite();
