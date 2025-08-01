import {LinkedList} from '../DataStructure/linkedList.jsx';
import { oriPortfolios, oriUsers } from '../domain/startProgram.js';

const search = (input, sortedList=null) => {
    if (!input) {
        console.log("검색어를 입력하세요.");
        return;
    }

    let curPortfolios = sortedList || oriPortfolios;
    
    let searchedPortfolios = new LinkedList(); // 검색 결과를 저장할 linked list, 초기화하여 이전 검색 결과를 지움

    curPortfolios.forEach((pofol) => {
        // 포트폴리오 이름, 포트폴리오 공유자의 닉네임으로 검색
        const isItTarget = pofol.title.toLowerCase().includes(input.toLowerCase()) || oriUsers.get(pofol.owner).nickname.toLowerCase().includes(input.toLowerCase());
        if (isItTarget) {
            searchedPortfolios.append(pofol);
        }
    });

    searchedPortfolios.print();
    return searchedPortfolios;
}

export default search;