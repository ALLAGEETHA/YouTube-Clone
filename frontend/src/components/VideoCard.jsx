import { Link } from 'react-router-dom';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  return (
    <Link to={`/video/${video._id}`} className="video-card">
      <div className="video-thumbnail">
        <img src={video.thumbnailUrl} alt={video.title} />
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-channel">
          {video.channelId?.channelName || 'Unknown Channel'}
        </p>
        <p className="video-views">{formatViews(video.views)}</p>
      </div>
    </Link>
  );
};

export default VideoCard;

