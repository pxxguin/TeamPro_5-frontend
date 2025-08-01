import Trie from "../DataStructure/Trie.jsx";
import { oriProjects } from "../domain/startProgram.js";
import { oriHackathons } from "../domain/startProgram.js";

export const dataList = (input) => {
  if (!input) {
    console.log("검색어가 입력되지 않음");
    return;
  }

  let trie = new Trie();

  for (let key of oriProjects.keys()) {
    trie.insert(oriProjects.get(key).projectTitle);
  }

  return new Set(trie.autoComplete(input));
};

export const HackdataList = (input) => {
  if (!input) {
    console.log("검색어가 입력되지 않음");
    return;
  }

  let trie = new Trie();

  for (let key of oriHackathons.keys()) {
    trie.insert(oriHackathons.get(key).hackName);
  }

  return new Set(trie.autoComplete(input));
};

//마이페이지 검색용
export const userProjectDataList = (input, userId) => {
  if (!input || !userId) {
    console.log("검색어 또는 사용자 ID가 입력되지 않음");
    return new Set();
  }

  let trie = new Trie();

  for (let key of oriProjects.keys()) {
    const project = oriProjects.get(key);
    if (project.ownerId === userId) {
      trie.insert(project.projectTitle);
    }
  }

  return new Set(trie.autoComplete(input));
};

// 채용자 페이지 검색용
export const recruiterProjectDataList = (input, userId) => {
  if (!input || !userId) {
    console.log("검색어 또는 사용자 ID가 입력되지 않음");
    return new Set();
  }

  let trie = new Trie();

  for (let key of oriProjects.keys()) {
    const project = oriProjects.get(key);
    if (project.contacts && project.contacts.includes(userId)) {
      trie.insert(project.projectTitle);
    }
  }

  return new Set(trie.autoComplete(input));
};
