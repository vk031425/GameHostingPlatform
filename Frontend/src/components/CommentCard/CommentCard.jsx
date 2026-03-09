import { useState } from "react";
import API from "../../config/api";
import { formatDate } from "../../utils/formatDate";
import "./CommentCard.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { CDN_BASE_URL } from "../../utils/constants";

const MAX_DEPTH = 4;

const CommentCard = ({ comment, allComments, refresh, depth = 1 }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { authData } = useContext(AuthContext);

  const profilepicUrl = comment
    ? `${CDN_BASE_URL}/${comment.user.profilepic}`
    : "/images/fallback-thumbnail.jpg";

  const replies = allComments
    .filter((c) => c.parent === comment._id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const handleLike = async () => {
    if (!authData?.isLoggedIn) {
      alert("Please login to like comments.");
      return;
    }

    try {
      await API.post(`/comments/${comment._id}/like`);
      refresh();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleReply = async () => {
    if (!authData?.isLoggedIn) {
      alert("Please login to reply comments.");
      return;
    }

    if (!replyText.trim()) return;

    let contentToSend = `@${comment.user.username} ${replyText}`;
    let parentToSend = comment._id;

    // Add mention if replying at max depth
    if (depth >= MAX_DEPTH) {
      parentToSend = comment.parent;
    }

    await API.post(`/comments/${comment.game}`, {
      content: contentToSend,
      parent: parentToSend,
    });

    setReplyText("");
    setShowReply(false);
    refresh();
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/comments/${comment._id}`);
      refresh();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleReport = async () => {
    if (!authData?.isLoggedIn) {
      alert("Please login to report.");
      return;
    }
    try {
      await API.post(`/comments/${comment._id}/report`, {
        reason: "Inappropriate",
      });
    } catch (err) {
      console.error("Report failed", err);
    }
  };

  return (
    <div className={`comment-wrapper depth-${depth}`}>
      <div className="comment-card">
        <div className="comment-header">
          <img src={profilepicUrl} />
          <span>@{comment.user.username}</span>
          <span>{formatDate(comment.createdAt)}</span>
        </div>

        <p>
          {comment.content.split(" ").map((word, index) =>
            word.startsWith("@") ? (
              <a
                key={index}
                href={`/profile/${word.substring(1)}`}
                className="mention"
              >
                {word}
              </a>
            ) : (
              " " + word
            ),
          )}
        </p>

        <div className="comment-actions">
          <button onClick={handleLike}>👍 {comment.likes.length}</button>

          <button onClick={() => setShowReply(!showReply)}>Reply</button>

          {authData?.isLoggedIn && authData?.user?._id === comment.user._id && (
            <button onClick={handleDelete}>Delete</button>
          )}

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
      </div>

      <div className="replies">
        {replies.map((reply) => (
          <CommentCard
            key={reply._id}
            comment={reply}
            allComments={allComments}
            refresh={refresh}
            depth={Math.min(depth + 1, MAX_DEPTH)}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentCard;
