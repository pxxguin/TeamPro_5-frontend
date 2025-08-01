// 메인 페이지가 작동(=서버에 시연자가 접속)하면
// 1. 모든 개발자 유저 정보를 hashmap 등에 등록한다.
// 2. 모든 채용자 유저 정보를 hashmap 등에 등록한다.
// 3. 모든 공유된 템플릿 정보를 hashmap에 등록한다.
// ... 수정할 때마다 업데이트 필요

// 이미 저장되어 있는 것을 읽어들이지 않는다면, 프로그램을 실행시킬 때마다 데이터를 추가해야 한다.
// 1. 프로그램을 실행하면 외부 파일에서 정보를 불러와 저장한다.
// 2. 추가되는 유저, 템플릿 등은 바로바로 '이미 있는 데이터' 파일에 추가한다.
// import Template from "../domain/Template";
import User from "./User.js";
import Portfolio from "./Portfolio.js";
import Project from "./Project.js";
import Template from "./Template.js";
import Comment from "./Comment.js";
import Hackathon from "./Hackathon.js";

import { templateInfo } from "../commmon/dummydata/templateInfo"; // 저장된 모든 템플릿 정보
import { portfolioInfo } from "../commmon/dummydata/portfolioInfo.jsx"; // 저장된 모든 포트폴리오 정보
import { projectInfo } from "../commmon/dummydata/projectInfo.jsx";
import { userInfo } from "../commmon/dummydata/userInfo.jsx"; // 저장된 모든 유저 정보
import { commentInfo } from "../commmon/dummydata/commentInfo.jsx"; //저장된 혹은 저장할 모든 댓글 정보
import { hackathonInfo } from "../commmon/dummydata/hackathonInfo.jsx";
import SearchSortManager from "../features/SearchSortManager.jsx";
import HackathonSearchSortManeger from "../features/HackathonSearchSortManeger.jsx";
import MyProjectsSearchSortManager from "../features/MyProjectsSearchSortManager.jsx";
import callRecSearchSortManager from "../features/callRecSearchSortManager.jsx";

export const oriUsers = new Map();
console.log(oriUsers);
export const oriRecruiters = new Map();
export const oriPortfolios = new Map();
export const oriProjects = new Map();
export const oriTemplates = new Map();
export const oriComments = new Map();
export const oriHackathons = new Map();

// 유저에게 공유되는 템플릿들
/* let oriTemplates = new Map();
templateInfo.forEach((data) => {
    template = new Template(data.templateId);
    oriTemplates.set(data.templateId, template);
}); */

export const initializeData = () => {
  userInfo.forEach((data) => {
    let user = new User(
      data.id,
      data.pageId,
      data.password,
      data.name,
      data.phoneNumber,
      data.birthday,
      data.recruiter,
      data.email,
      data.nickname,
      data.link,
      data.career,
      data.education,
      data.contacts
    );
    oriUsers.set(data.id, user);
    if (user.recruiter === true) {
      oriRecruiters.set(data.id, user);
    }
  });

  portfolioInfo.forEach((data) => {
    let portfolio = new Portfolio(
      data.portfolioId,
      data.ownerName,
      data.ownerId,
      data.ownerEmail,
      data.portfolioName,
      data.projects,
      data.usedLanguage,
      data.frontend,
      data.backend,
      data.share
    );
    oriPortfolios.set(data.portfolioId, portfolio);
  });

  projectInfo.forEach((data) => {
    let project = new Project(
      data.ownerName,
      data.ownerId,
      data.ownerNickname,
      data.ownerEmail,
      data.projectTemplate,
      data.projectId,
      data.projectTitle,
      data.description,
      data.startDate,
      data.endDate,
      data.category,
      data.usedLanguage,
      data.projectLink,
      data.solving,
      data.challenge,
      data.video,
      data.coverImage,
      data.images,
      data.logo,
      data.share,
      data.hits,
      data.likes,
      data.contacts,
      data.comments
    );
    oriProjects.set(data.projectId, project);
  });

  //댓글 불러오기.
  commentInfo.forEach((data) => {
    let comment = new Comment(
      data.commentId,
      data.portfolioId,
      data.userId,
      data.text,
      data.date
    );
    oriComments.set(data.commentId, comment);
  });

  hackathonInfo.forEach((data) => {
    let hackathon = new Hackathon(
      data.hackId,
      data.hackName,
      data.startDate,
      data.endDate,
      data.link,
      data.maxMemNumber,
      data.description,
      data.video,
      data.pictures,
      data.coverImage,
      data.logo,
      data.part,
      data.ownerId,
      data.ownerEmail,
      data.participant
    );
    oriHackathons.set(data.hackId, hackathon);
  });

  // templateInfo.forEach((data) => {
  //   let template = new Template(
  //     data.templateId,
  //     data.templateName,
  //     data.templateOwner,
  //     data.description,
  //     data.picture,
  //     data.file
  //   );
  //   oriTemplates.set(data.templateId, template);
  // });
  /* oriUsers.forEach((value, key) => {
        console.log(value.id);
    });
    console.log("저장된 유저 아이디 확인 출력 끝");
    oriPortfolios.forEach((value, key) => {
        console.log(value.portfolioId);
    });
    console.log("저장된 포폴 아이디 확인 출력 끝");
    oriProjects.forEach((value, key) => {
        console.log(value.projectId);
    });
    console.log("저장된 프젝 아이디 확인 출력 끝"); */
};

export const searchSortManager = new SearchSortManager(
  oriPortfolios,
  oriUsers,
  oriProjects
);

export const hackathonSearchSortManeger = new HackathonSearchSortManeger(
  oriHackathons,
  oriUsers
);

export const myProjectsSearchSortManager = new MyProjectsSearchSortManager(
  oriProjects,
  oriHackathons,
  oriUsers
);

export const recSearchSortManager = new callRecSearchSortManager(oriProjects);
