import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // GitHub 스타일의 마크다운 지원
import styled from "styled-components";
import { getCurrentUser } from "../../features/currentUser";
import { oriComments } from "../../domain/startProgram";
//댓글 삭제
import { removeComment } from "../../features/saveComment";

const CommentList = ({ comments, setComments, portfolioId }) => {
  // const handleDelete = (index) => {
  //   const currentUser = getCurrentUser();
  //   const commentToDelete = comments[index];

  //   if (currentUser && commentToDelete.userId === currentUser.id) {
  //     oriComments.delete(commentToDelete.commentId); //oriComments에서 삭제

  //     setComments((prevComments) => prevComments.filter((_, i) => i !== index));
  //   } else {
  //     alert("본인이 작성한 댓글만 삭제할 수 있습니다.");
  //   }
  // };

  console.log("comments 데이터 확인:", comments); // 디버깅용 로그

  const handleDelete = async (index) => {
    const currentUser = getCurrentUser();
    const commentToDelete = comments[index];

    if (currentUser && commentToDelete.userId === currentUser.id) {
      try {
        // 서버와 파일에서 댓글 삭제
        await removeComment(commentToDelete.commentId);

        // 로컬 상태에서 삭제
        setComments((prevComments) =>
          prevComments.filter((_, i) => i !== index)
        );
      } catch (error) {
        console.error("댓글 삭제 중 오류 발생:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    } else {
      alert("본인이 작성한 댓글만 삭제할 수 있습니다.");
    }
  };

  return (
    <CommentListWrapper>
      {comments.map((comment, index) => (
        <Comment key={index}>
          <CommentHeader>
            <CommentUser>{comment.userId}</CommentUser>
            <CommentDate>{comment.date}</CommentDate>
            {comment.userId === getCurrentUser().id && (
              <DeleteButton onClick={() => handleDelete(index)}>
                삭제
              </DeleteButton>
            )}
          </CommentHeader>
          <CommentText>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {comment.text}
            </ReactMarkdown>
          </CommentText>
        </Comment>
      ))}
    </CommentListWrapper>
  );
};

export default CommentList;

const CommentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  //align-items: center;
  width: 100%;
  margin-bottom: 1em;
`;

const Comment = styled.div`
  margin-top: 20px;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
`;

const CommentUser = styled.span`
  font-weight: bold;
  font-family: "OTF B";
`;

const CommentDate = styled.span`
  font-weight: bold;
  font-family: "OTF R";
`;

const CommentText = styled.p`
  margin: 10px 0;
`;

const DeleteButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #0a27a6;
  color: white;
  cursor: pointer;
  margin-top: 5px;
  font-family: "OTF B";
`;
