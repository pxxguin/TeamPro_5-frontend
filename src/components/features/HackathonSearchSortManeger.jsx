import { Link } from "react-router-dom";
import { LinkedList } from "../DataStructure/linkedList";
import { oriHackathons } from "../domain/startProgram.js";

class HackathonSearchSortManager {
  constructor() {
    this.currentHackathons = new LinkedList();

    this.state = {
      searchState: false,
      sortState: false,
    };

    this.searchTerm = null;
    this.category = null;
    this.sortOption = null;
    // this.filterOption = [];
  }

  updateUserData(userId) {
    this.userId = userId || this.userId;
    console.log("Updated User ID:", this.userId);

    this.currentHackathons = new LinkedList();
    oriHackathons.forEach((hack, key) => {
      if (this.userId === hack.ownerId) {
        this.currentHackathons.append(hack);
      }
    });
    this.currentHackathons.reverse();
    console.log("Updated currentHackathons:", this.currentHackathons);
  }

  search(searchTerm) {
    this.searchTerm = searchTerm;
    this.currentHackathons = this.doSearch();
    return this.currentHackathons;
  }

  sort(category, sortOption) {
    //, filterOption) {
    this.category = category;
    this.sortOption = sortOption;
    //this.filterOption = filterOption;
    this.currentHackathons = this.doSort();
    console.log("currentHack: ", this.currentHackathons);
    return this.currentHackathons;
  }

  //검색어 초기화
  resetToLatest() {
    this.searchTerm = null;
    this.category = null;
    this.sortOption = null;
    this.filterOption = [];
    this.state.searchState = false;
    this.state.sortState = false;

    this.currentPortfolios = new LinkedList();
    oriHackathons.forEach((pofol) => {
      this.currentPortfolios.append(pofol);
    });
    this.currentPortfolios.reverse(); // 최신순 정렬
    return this.currentPortfolios;
  }

  doSearch() {
    if (!this.searchTerm) {
      return;
    }

    let curHackathons = null;

    // 이미 링크드리스트 존재하면 그대로
    // 없으면 oriHackathons로부터 링크드리스트 생성(최신순으로)
    if (this.state.sortState) curHackathons = this.currentHackathons;
    else {
      curHackathons = new LinkedList();
      oriHackathons.forEach((hack, key) => {
        curHackathons.append(hack);
      });
      curHackathons.reverse();
    }

    let searchedHackathons = new LinkedList(); // 검색 결과를 저장할 linked list, 초기화하여 이전 검색 결과를 지움
    curHackathons.forEach((hack) => {
      // 해커톤 이름으로 검색

      // 이미 hack 자체가 객체
      let isItTarget = false;
      if (
        hack.hackName &&
        hack.hackName.toLowerCase().includes(this.searchTerm.toLowerCase())
      ) {
        isItTarget = true;
      }

      if (isItTarget) {
        searchedHackathons.append(hack);
      }
    });

    searchedHackathons.print();
    this.state.searchState = true;
    return searchedHackathons;
  }

  doSort() {
    if (
      this.category == null &&
      this.sortOption == null //&&
      //this.filterOption.length == 0
    ) {
      this.state.sortState = false;
      let result = null;

      // search 되어 있으면 search만 하고 반환
      // 없으면 아예 oriProjects로부터 링크드리스트 생성(최신순으로)
      if (this.state.searchState) result = this.doSearch();
      else {
        result = new LinkedList();
        oriHackathons.forEach((hack, key) => {
          result.append(hack);
        });
        result.reverse();
      }
      return result;
    }

    let sortedHackathons = new LinkedList();
    let curHackathons = null;

    // search 되어 있으면 search 된 것에서 시작
    // 없으면 oriProjects로부터 링크드리스트 생성(최신순으로)
    if (this.state.searchState == true) {
      if (this.state.sortState == true) {
        this.state.sortState = false;
      }
      curHackathons = this.doSearch();
    } else {
      curHackathons = new LinkedList();
      oriHackathons.forEach((hack, key) => {
        curHackathons.append(hack);
      });
      curHackathons.reverse();
    }

    // 카테고리에 따른 리스트 초기 추가
    if (this.category == null) {
      // 카테고리가 null이면 모든 템플릿 """이것은 포트폴리오이다"""을 저장한다.
      curHackathons.forEach((hack) => {
        sortedHackathons.append(hack);
      });
    } else {
      // 각 카테고리에 맞는 것만 저장한다.
      curHackathons.forEach((hack) => {
        if (hack.part == this.category) {
          sortedHackathons.append(hack);
        }
      });
    }

    // 정렬옵션에 따른 리스트 수정
    switch (this.sortOption) {
      case null: // null이면 아무 초기 설정 그대로 간다.
        break;
      case "인기순": // 인기순 -> 참여자순
        sortedHackathons.quickSort("participant");
        break;
    }

    sortedHackathons.print();
    this.state.sortState = true;
    return sortedHackathons;
  }
}

export default HackathonSearchSortManager;
