



   // 포트폴리오(현재 실질적으로 프로젝트) 게시판: SearchSortManager.jsx
   // 마이페이지 포트폴리오(현재 실질적으로 프로젝트): MyProjectsSearchSortManager.jsx





import { oriUsers, oriPortfolios, oriProjects } from "../domain/startProgram.js";
import { LinkedList } from "../DataStructure/linkedList.jsx"

const sort = ( category, sortOption, filterOption, searchedList=null ) => {
    // 카테고리, 정렬옵션, 필터옵션이 모두 null이면 종료한다.
    //
    // 이 부분은 filterOprion의 배열을 쪼개는 방법이 추가되어야 한다.
    //
    if ( category == null && sortOption == null && filterOption.length == 0 ){
        return;
    }

    let sortedPortfolios = new LinkedList();
    curPortfolios = searchedList || oriPortfolios;
    
    // 카테고리에 따른 리스트 초기 추가
    if ( category === null ){ // 카테고리가 null이면 모든 템플릿 """이것은 포트폴리오이다"""을 저장한다.
        curPortfolios.forEach((pofol) => {
            sortedPortfolios.append(pofol);
        });
    } else{ // 각 카테고리에 맞는 것만 저장한다.
        curPortfolios.forEach((pofol) => {
            if ( pofol.category == category ){
                sortedPortfolios.append(pofol);
            }
        });
    }

    // 정렬옵션에 따른 리스트 수정
    switch(sortOption){
        case null: // null이면 아무 초기 설정 그대로 간다.
            break;
        case "인기순": // 인기순, 최신순 둘 중 하나면 각 옵션에 맞게 정렬된다.
            sortedPortfolios.quickSort("likes");
            break;
        case "댓글순":
            sortedPortfolios.quickSort("comments");
            break;
        case "최신순": // 최신순이면 리스트가 리버스된다.(애초 데이터가 생성된 순서로 저장되므로)
            // 그런데 이미 최신순으로 정렬된 상태일 수 있다.
            sortedPortfolios.reverse(); // 함수 구현하기
            break;
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
    for(const element of filterOption){
        switch(element){
            case "있음":
            case "없음":
                sortedPortfolios.forEach(pofol => {
                    if (oriUsers.get(pofol.owner).career != element){
                        sortedPortfolios.remove(pofol);
                    }
                });
                break;
            case "Java":
            case "Python":
            case "JavaScript":
                sortedPortfolios.forEach(pofol => {
                    // 포트폴리오를 순회하면서
                    // 포폴 내부의 projects(배열)를 순회하면서
                    // 언어를 포함하지 않는 경우 포폴을 리스트에서 삭제

                    // 그러나... 하나라도 포함하면 리스트에서 삭제하면 안 된다.
                    let nonFilterCount = 0;
                    pofol.projects.forEach(project => {
                        // 각 포폴의 progects 배열을 순회하면 progectId를 얻음
                        // project는 각 포폴 속 프로젝트아이디의 '스트링' 배열
                        if(oriProjects.get(Number(project)).stack != element){      // !=이 논리상 맞는데 why??? 
                            nonFilterCount++;
                        }
                    });
                    // 언어 필터 선택과 다른 경우가 포트폴리오 속 프로젝트수와
                    // 일치하면 해당 포폴을 연결 리스트에서 삭제
                    if(nonFilterCount == pofol.projects.length){
                        sortedPortfolios.remove(pofol);
                    }
                });
                break;
            case "학사":
            case "석사":
            case "박사":
                sortedPortfolios.forEach(pofol => {
                    if (oriUsers.get(pofol.owner).education != element){
                        sortedPortfolios.remove(pofol);
                    }
                });
                break;
        }
    }

    sortedPortfolios.print();

    return sortedPortfolios;
}

export default sort;