import { Link } from "react-router-dom";
import { LinkedList } from "../DataStructure/linkedList";
import {
  oriUsers,
  oriProjects,
  oriHackathons,
} from "../domain/startProgram.js";
class SearchSortManager {
  constructor() {
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

  //검색어 초기화
  resetToLatest() {
    this.searchTerm = null;
    this.category = null;
    this.sortOption = null;
    this.filterOption = [];
    this.state.searchState = false;
    this.state.sortState = false;

    this.currentPortfolios = new LinkedList();
    oriProjects.forEach((pofol) => {
      this.currentPortfolios.append(pofol);
    });
    this.currentPortfolios.reverse(); // 최신순 정렬
    return this.currentPortfolios;
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
      return;
    }

    let curPortfolios = null;

    // 이미 링크드리스트 존재하면 그대로
    // 없으면 oriProjects로부터 링크드리스트 생성(최신순으로)
    if (this.state.sortState) curPortfolios = this.currentPortfolios;
    else {
      curPortfolios = new LinkedList();
      oriProjects.forEach((pofol, key) => {
        curPortfolios.append(pofol);
      });
      curPortfolios.reverse();
    }

    let searchedPortfolios = new LinkedList(); // 검색 결과를 저장할 linked list, 초기화하여 이전 검색 결과를 지움

    curPortfolios.forEach((pofol) => {
      // 포트폴리오 이름, 포트폴리오 공유자의 닉네임으로 검색
      let owner = oriUsers.get(pofol.owner);
      let isItTarget = false;
      if (
        (pofol.projectTitle &&
          pofol.projectTitle
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())) ||
        (owner &&
          oriUsers
            .get(pofol.ownerId)
            .nickname.toLowerCase()
            .includes(this.searchTerm.toLowerCase()))
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
          result.append(pofol);
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
        curPortfolios.append(pofol);
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
      //case "최신순": // 최신순이면 리스트가 리버스된다.(애초 데이터가 생성된 순서로 저장되므로)
      // 그러나 이미 reverse가 진행되어 있을 수 있다.
      //sortedPortfolios.reverse(); // 함수 구현하기
      //break;
    }

    // 필터옵션에 따른 리스트 수정
    //
    // 필터옵션은 있음, 없음 중 1 + Java, Python, JavaScript 중 1 + 학사, 석사, 박사 중 1이거나
    // 선택이 안 된 필터의 경우 값이 아예 들어있지 않은 배열이다.
    //
    // 배열을 처음부터 순회하면서 switch-case문으로
    // case 1과 2: 각 '있음', '없음'
    // case 3과 4와 5: 각 '자바'...
    // case 6과 7과 8: 각 학력으로 한다.
    for (const element of this.filterOption) {
      switch (element) {
        case "있음":
        case "없음":
          sortedPortfolios.forEach((pofol) => {
            let user = oriUsers.get(pofol.ownerId);
            if (user && user.career != element) {
              sortedPortfolios.remove(pofol);
            }
          });
          break;
        case "Java":
        case "Python":
        case "JavaScript":
          // sortedPortfolios.forEach(pofol => {
          //     // 포트폴리오를 순회하면서
          //     // 포폴 내부의 projects(배열)를 순회하면서
          //     // 언어를 포함하지 않는 경우 포폴을 리스트에서 삭제

          //     // 그러나... 하나라도 포함하면 리스트에서 삭제하면 안 된다.
          //     let nonFilterCount = 0;
          //     pofol.projects.forEach(project => {
          //         // 각 포폴의 progects 배열을 순회하면 progectId를 얻음
          //         // project는 각 포폴 속 프로젝트아이디의 '스트링' 배열
          //         if(oriProjects.get(Number(project)).stack != element){      // !=이 논리상 맞는데 why???
          //             nonFilterCount++;
          //         }
          //     });
          //     // 언어 필터 선택과 다른 경우가 포트폴리오 속 프로젝트수와
          //     // 일치하면 해당 포폴을 연결 리스트에서 삭제
          //     if(nonFilterCount == pofol.projects.length){
          //         sortedPortfolios.remove(pofol);
          //     }
          // });

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
        case "학사":
        case "석사":
        case "박사":
          sortedPortfolios.forEach((pofol) => {
            let user = oriUsers.get(pofol.ownerId);
            // 선택된 모든 학력 조건을 체크
            const educationMatch = this.filterOption.some(
              (education) => user && user.education === education
            );

            // 학력 조건에 하나도 맞지 않으면 삭제
            if (!educationMatch || !user) {
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

export default SearchSortManager;
