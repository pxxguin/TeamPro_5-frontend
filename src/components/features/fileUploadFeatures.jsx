import { oriProjects } from "../domain/startProgram";

export const handleImageUpload = async (file, projectId, field) => {
  console.log("handleImageUpload started");
    // 파일 입력 엘리먼트 생성
    // const input = document.createElement('input');
    // input.type = 'file';
    // input.accept = 'image/*';

    // input.onchange = async (event) => {
    // const file = event.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const filePath = "src/components/commmon/dummydata/projectInfo.jsx";

    const formData = new FormData();
    formData.append("photo", file);
    formData.append('filePath', filePath);
    formData.append("projectId", Number(projectId));
    formData.append("field", field);

    try {
      const response = await fetch("http://localhost:3000/update-project-photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();
      console.log("업로드 결과:", result);

      const project = oriProjects.get(projectId);
      if (project) {
        project[field] = result.uploadedPath;
        oriProjects.set(projectId, project);
        console.log("프로젝트 데이터 업데이트 완료:", oriProjects.get(projectId));
      } else {
        console.error("해당 프로젝트를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("이미지 업로드 실패", error);
    }
  };

//사진을 유저가 선택하면 그 파일 경로를 string 으로 반환
export const handleImageAdd = async (file) => {
  console.log('handleImageAdd started');

  // 파일 입력 엘리먼트 생성
  // const input = document.createElement('input');
  // input.type = 'file';
  // input.accept = 'image/*';

  // input.onchange = async (event) => {
  // const file = event.target.files[0];

  // if (!file || !file.type.startsWith("image/")) {
  //   alert("이미지 파일만 업로드 가능합니다.");
  //   return;
  // }

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const response = await fetch("http://localhost:3000/add-project-photo", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const result = await response.json();
    console.log("result: ", result);
    console.log("uploadedPath in result: ", result.uploadedPath);

    return result.uploadedPath;

  } catch (error) {
    console.error("이미지 업로드 실패", error);
  }
};


export const handleMultipleImageAdd = async (files) => {
  console.log('handleMultipleImageAdd started');

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("photos", files[i]);
  }

  try {
    const response = await fetch("http://localhost:3000/add-multiple-photos", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const result = await response.json();
    console.log("result: ", result);
    console.log("uploadedPaths in result: ", result.uploadedPaths);

    return result.uploadedPaths;

  } catch (error) {
    console.error("이미지 업로드 실패", error);
    return []; // 실패 시 빈 배열 반환
  }
};


// export const handleMultipleImageUpload = async (files) => {
//   // console.log("handleImagesAdd started");

//   // 업로드 가능한 최대 이미지 개수
//   const MAX_IMAGES = 5;

//   // 파일 개수 제한
//   if (files.length > MAX_IMAGES) {
//     alert(`최대 ${MAX_IMAGES}개의 이미지만 업로드 가능합니다.`);
//     return;
//   }

//   const formData = new FormData();

//   files.forEach((file, index) => {
//     if (file && file.type && file.type.startsWith("image/")) {
//       formData.append(`photo${index + 1}`, file);
//     } else if (file) {
//       alert(`유효하지 않은 파일이 포함되어 있습니다. (${index + 1}번째 파일)`);
//     }
//   });

//   try {
//     // 서버 요청
//     const response = await fetch("http://localhost:3000/update-project-photo", {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`서버 오류: ${response.status}`);
//     }

//     // 서버 응답 처리
//     const result = await response.json();
//     console.log("result: ", result);

//     // 결과에서 업로드된 이미지 경로 추출
//     const uploadedPaths = result.uploadedPaths || [];
//     console.log("uploadedPaths: ", uploadedPaths);

//     return uploadedPaths;

//   } catch (error) {
//     console.error("이미지 업로드 실패", error);
//   }
// };


// export const handleMultipleImageUpload = async (files, projectId, field) => {
//   console.log("handleImageUpload started");
//     // 파일 입력 엘리먼트 생성
//     // const input = document.createElement('input');
//     // input.type = 'file';
//     // input.accept = 'image/*';

//     // input.onchange = async (event) => {
//     // const file = event.target.files[0];

//     const filePath = "src/components/commmon/dummydata/projectInfo.jsx";


//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append("photos", files[i]);
//     }
//     formData.append('filePath', filePath);
//     formData.append("projectId", Number(projectId));
//     formData.append("field", field);

//     try {
//       const response = await fetch("http://localhost:3000/update-project-photo", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`서버 오류: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log("업로드 결과:", result);

//       const project = oriProjects.get(projectId);
//       if (project) {
//         project[field] = result.uploadedPath;
//         oriProjects.set(projectId, project);
//         console.log("프로젝트 데이터 업데이트 완료:", oriProjects.get(projectId));
//       } else {
//         console.error("해당 프로젝트를 찾을 수 없습니다.");
//       }
//     } catch (error) {
//       console.error("이미지 업로드 실패", error);
//     }
//   };

// input.click();

// }


//수연 언니 코드
// export const handleImageUpload = async (projectId, field) => {
//     // 파일 입력 엘리먼트 생성
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = 'image/*';

//     const filePath = "src/components/commmon/dummydata/projectInfo.jsx";
  
//     input.onchange = async (event) => {
//       const file = event.target.files[0];
      
//       const formData = new FormData();
//     formData.append('photo', file);
//     formData.append('filePath', filePath);
//     formData.append('projectId', Number(projectId));
//     formData.append('field', field);

//     try {
//       const response = await fetch('http://localhost:3000/update-project-photo', {
//         method: 'POST',
//         body: formData
//       });

//       const result = await response.json();
//       console.log("result: ", result);

//       let project = oriProjects.get(projectId);
//       project.field = result.uploadedPath;
//       oriProjects.set(projectId, project);
      
//     } catch (error) {
//       console.error('이미지 업로드 실패', error);
//     }
//   };
  
//     // 파일 선택 다이얼로그 오픈
//     input.click();
//   };