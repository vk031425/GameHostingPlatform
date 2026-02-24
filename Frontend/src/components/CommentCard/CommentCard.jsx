import { useState } from "react";
import API from "../../config/api";
import { formatDate } from "../../utils/formatDate";
import "./CommentCard.css";

const CommentCard = ({ comment, allComments, refresh }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const replies = allComments.filter(
    (c) => c.parent === comment._id
  );

  const handleLike = async () => {
    await API.post(`/comments/${comment._id}/like`);
    refresh();
  };

  const handleReply = async () => {
    await API.post(`/comments/${comment.game}`, {
      content: replyText,
      parent: comment._id,
    });

    setReplyText("");
    setShowReply(false);
    refresh();
  };

  const handleDelete = async () => {
    await API.delete(`/comments/${comment._id}`);
    refresh();
  };

  const handleReport = async () => {
    await API.post(`/comments/${comment._id}/report`, {
      reason: "Inappropriate",
    });
  };

  return (
    <div className="comment-card">
      <div className="comment-header">
        <img src={comment.user.profilepic} />
        <span>@{comment.user.username}</span>
        <span>{formatDate(comment.createdAt)}</span>
      </div>

      <p>{comment.content}</p>

      <div className="comment-actions">
        <button onClick={handleLike}>
          👍 {comment.likes.length}
        </button>

        <button onClick={() => setShowReply(!showReply)}>
          Reply
        </button>

        <button onClick={handleDelete}>Delete</button>

        <button onClick={handleReport}>Report</button>
      </div>

      {showReply && (
        <div className="reply-box">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button onClick={handleReply}>Post Reply</button>
        </div>
      )}

      {replies.length > 0 && (
        <div className="replies">
          {replies.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply}
              allComments={allComments}
              refresh={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;