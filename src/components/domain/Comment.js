class Comment {
  constructor(commentId, portfolioId, userId, text, date) {
    this.commentId = commentId;
    this.portfolioId = portfolioId;
    this.userId = userId;
    this.text = text;
    this.date = date;
  }
}

export default Comment;
