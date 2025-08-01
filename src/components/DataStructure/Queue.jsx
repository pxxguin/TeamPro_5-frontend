class Queue { 
    constructor(){
        this.queue = [];
        this.front = 0;
        this.back = 0;
    }

    enqueue(value){ 
        this.queue[this.back++] = value;
    }

    dequeue(){   
        const value = this.queue[this.front];
        delete this.queue[this.front]; 
        this.front += 1;
        return value;
    }

    size(){
        return this.back - this.front;
    }
}

export default Queue;