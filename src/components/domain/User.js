export class User {
    constructor(id, pageId=null, password, name, phoneNumber, birthday, recruiter=false, email=null, nickname=null, link=null, career=null, education=null, contacts=[]) {
        this.id = id; // pk
        this.pageId = pageId; // fk to MyPage
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.birthday = birthday;
        
        this.recruiter = recruiter;

        this.email = email;
        this.nickname = nickname;
        this.link = link;
        this.career = career;
        this.education = education;
        
        if (recruiter == true) {
            this.contacts = contacts;
        }
    }

    ownPage(myPage) {
        return myPage.pageId === this.pageId; // Mypage와 relation 검증
    }
}

export default User;