import { Link } from "react-router-dom";
import { LinkedList } from "../DataStructure/linkedList";
import { oriUsers, oriProjects } from "../domain/startProgram.js";
import { getCurrentUser } from "./currentUser.js";

// 모든 데이터 초기화할 때 userId와 같은 프로젝트만 넣기 끝.

class MyProjectsSearchSortManager {
  constructor() {
    // this.userId = getCurrentUser();
    const currentUser = getCurrentUser();
    console.log("Current User Object:", currentUser);
    this.userId = currentUser?.id || null;
    console.log("userId: ", this.userId);
    this.currentPortfolios = new LinkedList();

    this.state = {
      searchState: false,
      sortState: false,
    };

    this.searchTerm = null;
    this.category = null;
    this.sortOption = null;
    this.filterOption = [];
  }

  updateUserData(userId) {
    this.userId = userId || this.userId;
    console.log("Updated User ID:", this.userId);

    // 최신 oriProjects로 currentPortfolios 초기화
    this.currentPortfolios = new LinkedList();
    oriProjects.forEach((pofol, key) => {
      if (this.userId === pofol.ownerId) {
        this.currentPortfolios.append(pofol);
      }
    });
    this.currentPortfolios.reverse();
    console.log("Updated currentPortfolios:", this.currentPortfolios);
  }

  search(searchTerm) {
    this.searchTerm = searchTerm;
    this.currentPortfolios = this.doSearch();
    return this.currentPortfolios;
  }

  sort(category, sortOption, filterOption) {
    this.category = category;
    this.sortOption = sortOption;
    this.filterOption = filterOption;
    this.currentPortfolios = this.doSort();
    console.log("currentPofol: ", this.currentPortfolios);
    return this.currentPortfolios;
  }

  doSearch() {
    if (!this.searchTerm) {
      console.log("검색어를 입력하세요.");
      return;
    }

    let curPortfolios = null;

    // 이미 링크드리스트 존재하면 그대로
    // 없으면 oriProjects로부터 링크드리스트 생성(최신순으로)
    if (this.state.sortState) curPortfolios = this.currentPortfolios;
    else {
      curPortfolios = new LinkedList();
      oriProjects.forEach((pofol, key) => {
        if (this.userId === pofol.ownerId) {
          curPortfolios.append(pofol);
        }
      });
      curPortfolios.reverse();
    }

    let searchedPortfolios = new LinkedList(); // 검색 결과를 저장할 linked list, 초기화하여 이전 검색 결과를 지움

    curPortfolios.forEach((pofol) => {
      // 포트폴리오 이름으로 검색
      // let owner = oriUsers.get(pofol.owner);
      let isItTarget = false;
      if (
        pofol.projectTitle &&
        pofol.projectTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
        // || (owner && oriUsers.get(pofol.ownerId).nickname.toLowerCase().includes(this.searchTerm.toLowerCase()))
      ) {
        isItTarget = true;
      }
      if (isItTarget) {
        searchedPortfolios.append(pofol);
      }
    });

    searchedPortfolios.print();
    this.state.searchState = true;
    return searchedPortfolios;
  }

  doSort() {
    if (
      this.category == null &&
      this.sortOption == null &&
      this.filterOption.length == 0
    ) {
      this.state.sortState = false;
      let result = null;

      // search 되어 있으면 search만 하고 반환
      // 없으면 아예 oriProjects로부터 링크드리스트 생성(최신순으로)
      if (this.state.searchState) result = this.doSearch();
      else {
        result = new LinkedList();
        oriProjects.forEach((pofol, key) => {
          if (this.userId === pofol.ownerId) {
            result.append(pofol);
          }
        });
        result.reverse();
      }
      return result;
    }

    let sortedPortfolios = new LinkedList();
    let curPortfolios = null;

    // search 되어 있으면 search 된 것에서 시작
    // 없으면 oriProjects로부터 링크드리스트 생성(최신순으로)
    if (this.state.searchState == true) {
      if (this.state.sortState == true) {
        this.state.sortState = false;
      }
      curPortfolios = this.doSearch();
    } else {
      curPortfolios = new LinkedList();
      oriProjects.forEach((pofol, key) => {
        if (this.userId === pofol.ownerId) {
          curPortfolios.append(pofol);
        }
      });
      curPortfolios.reverse();
    }

    // 카테고리에 따른 리스트 초기 추가
    if (this.category == null) {
      // 카테고리가 null이면 모든 템플릿 """이것은 포트폴리오이다"""을 저장한다.
      curPortfolios.forEach((pofol) => {
        sortedPortfolios.append(pofol);
      });
    } else {
      // 각 카테고리에 맞는 것만 저장한다.
      curPortfolios.forEach((pofol) => {
        if (pofol.category == this.category) {
          sortedPortfolios.append(pofol);
        }
      });
    }

    // 정렬옵션에 따른 리스트 수정
    switch (this.sortOption) {
      case null: // null이면 아무 초기 설정 그대로 간다.
        break;
      case "인기순": // 인기순, 최신순 둘 중 하나면 각 옵션에 맞게 정렬된다.
        sortedPortfolios.quickSort("likes");
        break;
      case "댓글순":
        sortedPortfolios.quickSort("comments");
        break;
    }

    // 필터옵션에 따른 리스트 수정
    for (const element of this.filterOption) {
      switch (element) {
        default:
          sortedPortfolios.forEach((pofol) => {
            // 선택된 모든 언어 조건을 체크
            const languageMatch = this.filterOption.some(
              (language) => pofol.usedLanguage === language
            );

            // 언어 조건에 하나도 맞지 않으면 삭제
            if (!languageMatch) {
              sortedPortfolios.remove(pofol);
            }
          });
          break;
      }
    }

    sortedPortfolios.print();
    this.state.sortState = true;
    return sortedPortfolios;
  }
}

export default MyProjectsSearchSortManager;
