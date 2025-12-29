import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`/api/videos/${videoId}`);
      setVideo(response.data);
      if (user && user.userId) {
        const userId = typeof user.userId === 'string' ? user.userId : user.userId.toString();
        setIsLiked(response.data.likedBy?.some(id => id.toString() === userId) || false);
        setIsDisliked(response.data.dislikedBy?.some(id => id.toString() === userId) || false);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments/video/${videoId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const response = await axios.post(`/api/videos/${videoId}/like`);
      setVideo({ ...video, likes: response.data.likes, dislikes: response.data.dislikes });
      setIsLiked(response.data.isLiked);
      setIsDisliked(response.data.isDisliked);
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) return;
    
    try {
      const response = await axios.post(`/api/videos/${videoId}/dislike`);
      setVideo({ ...video, likes: response.data.likes, dislikes: response.data.dislikes });
      setIsLiked(response.data.isLiked);
      setIsDisliked(response.data.isDisliked);
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      const response = await axios.post('/api/comments', {
        videoId,
        text: commentText
      });
      setComments([response.data, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.put(`/api/comments/${commentId}`, {
        text: editText
      });
      setComments(comments.map(c => c._id === commentId ? response.data : c));
      setEditingCommentId(null);
      setEditText('');
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="video-player-page">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={(e) => e.preventDefault()} />
        <div className="loading">Loading video...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-player-page">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={(e) => e.preventDefault()} />
        <div className="error">Video not found</div>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={(e) => e.preventDefault()} />
      <div className="video-player-content">
        <div className="video-main">
          <div className="video-container">
            <video controls src={video.videoUrl} className="video-element">
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="video-details">
            <h1 className="video-title">{video.title}</h1>
            <div className="video-meta">
              <div className="video-stats">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{formatDate(video.createdAt)}</span>
              </div>
              <div className="video-actions">
                <button
                  className={`action-button ${isLiked ? 'active' : ''}`}
                  onClick={handleLike}
                  disabled={!user}
                >
                  <span>👍</span> {video.likes}
                </button>
                <button
                  className={`action-button ${isDisliked ? 'active' : ''}`}
                  onClick={handleDislike}
                  disabled={!user}
                >
                  <span>👎</span> {video.dislikes}
                </button>
              </div>
            </div>

            <div className="channel-info">
              <Link to={`/channel/${video.channelId._id}`} className="channel-link">
                <div className="channel-avatar">
                  <img src={video.uploader?.avatar || 'https://via.placeholder.com/40'} alt={video.channelId.channelName} />
                </div>
                <div className="channel-details">
                  <h3>{video.channelId.channelName}</h3>
                  <p>{video.channelId.subscribers} subscribers</p>
                </div>
              </Link>
            </div>

            <div className="video-description">
              <p>{video.description || 'No description available.'}</p>
            </div>
          </div>

          <div className="comments-section">
            <h2 className="comments-title">
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h2>

            {user && (
              <form onSubmit={handleAddComment} className="comment-form">
                <div className="comment-input-container">
                  <img
                    src={user.avatar || 'https://via.placeholder.com/40'}
                    alt={user.username}
                    className="comment-avatar"
                  />
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>
                <button type="submit" className="comment-submit">Comment</button>
              </form>
            )}

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <img
                    src={comment.userId?.avatar || 'https://via.placeholder.com/40'}
                    alt={comment.userId?.username}
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    {editingCommentId === comment._id ? (
                      <div className="comment-edit">
                        <input
                          type="text"
                          className="comment-edit-input"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                        />
                        <div className="comment-edit-actions">
                          <button
                            onClick={() => handleEditComment(comment._id)}
                            className="comment-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditText('');
                            }}
                            className="comment-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="comment-header">
                          <span className="comment-author">{comment.userId?.username}</span>
                          <span className="comment-date">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                        {user && user.userId && comment.userId?._id && user.userId.toString() === comment.userId._id.toString() && (
                          <div className="comment-actions">
                            <button
                              onClick={() => {
                                setEditingCommentId(comment._id);
                                setEditText(comment.text);
                              }}
                              className="comment-action-button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="comment-action-button"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;

