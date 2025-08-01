import { oriUsers } from '../domain/startProgram.js'; 

const login = async (inputIdOrEmail, inputPwd) => {
    if (!inputIdOrEmail || !inputPwd) {
        console.log("아이디 또는 패스워드가 입력되지 않음");
        return;
    }

    const user = [...oriUsers.values()].find(user => user.id === inputIdOrEmail || user.email === inputIdOrEmail);

    if (!user || user.password !== inputPwd) {
        console.log("아이디 또는 패스워드가 일치하지 않습니다.");
        return;
    } else {
        console.log("login session에 id를 등록합니다.");
        const msg = await loginSession(inputIdOrEmail, inputPwd); 
        console.log(msg);
        return user;
    }
}


// loginSession
export const loginSession = async (trimmedIdOrEmail, trimmedPassword) => {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: trimmedIdOrEmail,  // userId 또는 email
                password: trimmedPassword
            }),
        })
        // .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

        // if (!response.ok) {
        //     const errorText = await response.text();
        //     throw new Error(`로그인 실패: ${errorText}`);
        // }

        const data = await response.text();
        console.log(data);



        return data; 
    } catch (error) {
        console.error('로그인 중 오류가 발생했습니다.', error);
        throw new Error('서버와의 통신 중 문제가 발생했습니다.');
    }
};



export default login;
