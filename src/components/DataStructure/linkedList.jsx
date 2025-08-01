class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

export class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    // 연결 리스트에서 특정 값을 찾는 메서드
    find(value) {
        let currentNode = this.head;
        // head부터 순회하며 value값이 같은지 찾기
        while (currentNode && currentNode.value !== value) {
            currentNode = currentNode.next;
        }
        return currentNode;
    }

    // tail에 새로운 노드를 추가하는 메서드
    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            // 연결 리스트가 비어 있으면 새로운 노드가 head이자 tail이 됨
            this.head = newNode;
            this.tail = newNode;
            this.size++;
        }
        else {
            // 현재 tail 노드의 다음에 새로운 노드 추가
            this.tail.next = newNode;
            this.tail = newNode;
            this.size++;
        }
    }

    // 연결 리스트에서 특정 값을 삭제하는 메서드
    remove(value) {
        if (this.size === 0) {
            return;
        }

        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
        } else {
            let prevNode = this.head;
            while (prevNode.next.value !== value) {
                prevNode = prevNode.next;
            }

            if (prevNode.next !== null) {
                prevNode.next = prevNode.next.next;
                this.size--;
            }
        }
    }

    // 연결 리스트를 순회하여 각 노드의 value에 접근할 때
    forEach(callback){
        let currentNode = this.head;
        while (currentNode){
            callback(currentNode.value);
            currentNode = currentNode.next;
        }
    }

    // 연결 리스트를 거꾸로 뒤집는 메서드
    reverse(){
        let prevNode = null;
        let currentNode = this.head;
        let nextNode = null;
        while (currentNode){
            nextNode = currentNode.next;
            currentNode.next = prevNode;
            prevNode = currentNode;
            currentNode = nextNode;
        }
        this.head = prevNode;
    }

    // target에 대해 연결 리스트를 퀵 정렬하는 메서드(내림차순)
    // 파라메터로 target과 value(노드데이터) 내부 변수명을 받는다.
    quickSort(target) {
        this.head = quickSortRecursive(this.head, target);
    }

    // 포트폴리오 정렬 적용 콘솔 확인용
    print(){
        let currentNode = this.head;
        let a = 0;
        while (currentNode){
            a++;
            console.log(a+"번째 노드를 출력합니다.");
            console.log(currentNode.value.portfolioId);
            currentNode = currentNode.next;
        }
    }
}

// 리스트의 마지막 노드를 찾는 메서드
function getTail(node) {
    while (node && node.next) {
        node = node.next;
    }
    return node;
}

// 피벗을 기준으로 리스트를 분할하고, 정렬된 리스트의 새 헤드를 반환하는 메서드
function partition(head, end, target) {
    // 피벗 맨뒷노드
    let pivot = end;
    let prev = null;
    let current = head;
    let tail = pivot;
    let newHead = null;

    while (current !== pivot) {
        // target에 대한 수가 클 때
        console.log(current.value);
        if (current.value[target].length > pivot.value[target].length) {
            if (!newHead) {
                newHead = current;
            }
            prev = current;
            current = current.next;
        } else {
            // 피벗보다 큰 노드를 피벗의 뒤로 이동
            if (prev) {
                prev.next = current.next;
            }
            let temp = current.next;
            current.next = null;
            tail.next = current;
            tail = current;
            current = temp;
        }
    }

    if (!newHead) {
        newHead = pivot;
    }

    return { newHead, newPivot: pivot };
}

// 퀵 정렬의 재귀
function quickSortRecursive(head, target, end = null) {
    if (!head || head === end) {
        return head;
    }

    let { newHead, newPivot } = partition(head, getTail(head), target);

    if (newHead !== newPivot) {
        let temp = newHead;
        while (temp.next !== newPivot) {
            temp = temp.next;
        }
        temp.next = null;

        // 재귀적으로 왼쪽 리스트 정렬
        newHead = quickSortRecursive(newHead, target);
        
        // 정렬된 리스트의 끝에 피벗 연결
        temp = getTail(newHead);
        temp.next = newPivot;
    }

    // 피벗의 오른쪽 리스트 정렬
    newPivot.next = quickSortRecursive(newPivot.next, target);

    return newHead;
}