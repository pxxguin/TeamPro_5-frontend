import {oriUsers, oriProjects} from "../domain/startProgram.js";

export const isRecruiter = (userId) => {
    let user = oriUsers.get(userId);
    return user.recruiter? true : false;
}

export const patchContactsByServer = async (filePath1, filePath2, projectId, newContact) => {

    try {
        console.log('Sending request with:', { filePath1, filePath2, projectId, newContact });
        const response = await fetch('http://localhost:3000/patch-contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath1, filePath2, projectId, newContact }),
        });
        
        if (!response.ok) {
          console.error('Response status:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Detailed error:', error);
      }
}

export const patchContacts = (projectId, userId) => {
    // projectId: 컨택 버튼이 눌린 프로젝트의 id
    // userId: 컨택을 하는 기업회원의 id

    if (!oriUsers.get(userId) || !oriProjects.get(projectId)) {
      console.log("아이디가 존재하지 않음");
      return;
  }

    const FILE_PATH_1 = 'src/components/commmon/dummydata/projectInfo.jsx';
    const FILE_PATH_2 = 'src/components/commmon/dummydata/userInfo.jsx';

    if (!isRecruiter(userId)) {
        return; // 해당 사용자가 기업회원이 아닌 경우 종료
    }
    else {
        patchContactsByServer(FILE_PATH_1, FILE_PATH_2, projectId, userId);
    }
}