import Queue from "./Queue.jsx";

class Node {
  constructor(value = "", isWord = false) {
    this.value = value;
    this.children = new Map();
    this.isWord = isWord;
  }
}

class Trie {
  constructor() {
    this.root = new Node();
  }

  insert(text) {
    let currentNode = this.root;
    for (const char of text) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new Node(currentNode.value + char));
      }
      currentNode = currentNode.children.get(char);
    }
    currentNode.isWord = true;
  }

  find(text) {
    let currentNode = this.root;
    for (const char of text) {
      if (!currentNode.children.has(char)) return null;
      currentNode = currentNode.children.get(char);
    }
    return currentNode;
  }

  autoComplete(prefix) {
    const node = this.find(prefix);
    if (!node) {
      return [];
    }

    const words = [];
    const queue = new Queue();
    queue.enqueue(node);

    while (queue.size()) {
      const currentNode = queue.dequeue();
      if (currentNode.isWord) {
        words.push(currentNode.value);
      }
      for (const childNode of currentNode.children.values()) {
        queue.enqueue(childNode);
      }
    }

    return words;
  }
}

export default Trie;
