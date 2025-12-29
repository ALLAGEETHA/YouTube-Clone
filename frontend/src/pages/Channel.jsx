import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import './Channel.css';

const Channel = ({ isMyChannel = false }) => {
  const { channelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateVideo, setShowCreateVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [channelForm, setChannelForm] = useState({
    channelName: '',
    description: '',
    channelBanner: ''
  });
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    channelId: '',
    category: 'All'
  });

  useEffect(() => {
    if (isMyChannel) {
      fetchMyChannels();
    } else if (channelId) {
      fetchChannel();
    }
  }, [channelId, isMyChannel]);

  const fetchMyChannels = async () => {
    try {
      const response = await axios.get('/api/channels/my-channels');
      if (response.data.length > 0) {
        const firstChannel = response.data[0];
        setChannel(firstChannel);
        setVideos(firstChannel.videos || []);
        setVideoForm({ ...videoForm, channelId: firstChannel._id });
      } else {
        setShowCreateChannel(true);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannel = async () => {
    try {
      const response = await axios.get(`/api/channels/${channelId}`);
      setChannel(response.data);
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Error fetching channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/channels', channelForm);
      setChannel(response.data);
      setShowCreateChannel(false);
      setVideoForm({ ...videoForm, channelId: response.data._id });
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating channel');
    }
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/videos', videoForm);
      setVideos([response.data, ...videos]);
      setShowCreateVideo(false);
      setVideoForm({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        channelId: channel._id,
        category: 'All'
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating video');
    }
  };

  const handleEditVideo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/videos/${editingVideo._id}`, {
        title: videoForm.title,
        description: videoForm.description,
        thumbnailUrl: videoForm.thumbnailUrl,
        category: videoForm.category
      });
      setVideos(videos.map(v => v._id === editingVideo._id ? response.data : v));
      setEditingVideo(null);
      setShowCreateVideo(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      await axios.delete(`/api/videos/${videoId}`);
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting video');
    }
  };

  const startEditVideo = (video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      channelId: video.channelId._id || video.channelId,
      category: video.category
    });
    setShowCreateVideo(true);
  };

  if (loading) {
    return (
      <div className="channel-page">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={(e) => e.preventDefault()} />
        <div className="loading">Loading channel...</div>
      </div>
    );
  }

  if (isMyChannel && !channel && !showCreateChannel) {
    return (
      <div className="channel-page">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={(e) => e.preventDefault()} />
        <div className="channel-content">
          <button className="create-channel-button" onClick={() => setShowCreateChannel(true)}>
            Create Channel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="channel-page">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearchSubmit={(e) => e.preventDefault()} />
      <div className="channel-content">
        {showCreateChannel ? (
          <div className="channel-form-container">
            <h2>Create Channel</h2>
            <form onSubmit={handleCreateChannel} className="channel-form">
              <div className="form-group">
                <label>Channel Name</label>
                <input
                  type="text"
                  value={channelForm.channelName}
                  onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Banner URL</label>
                <input
                  type="text"
                  value={channelForm.channelBanner}
                  onChange={(e) => setChannelForm({ ...channelForm, channelBanner: e.target.value })}
                  placeholder="https://example.com/banner.png"
                />
              </div>
              <div className="form-actions">
                <button type="submit">Create Channel</button>
                <button type="button" onClick={() => setShowCreateChannel(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : channel ? (
          <>
            <div className="channel-header">
              <div
                className="channel-banner"
                style={{ backgroundImage: `url(${channel.channelBanner})` }}
              ></div>
              <div className="channel-info">
                <h1>{channel.channelName}</h1>
                <p>{channel.subscribers} subscribers</p>
                <p className="channel-description">{channel.description}</p>
                {isMyChannel && (
                  <button
                    className="create-video-button"
                    onClick={() => {
                      setEditingVideo(null);
                      setVideoForm({
                        title: '',
                        description: '',
                        videoUrl: '',
                        thumbnailUrl: '',
                        channelId: channel._id,
                        category: 'All'
                      });
                      setShowCreateVideo(true);
                    }}
                  >
                    Upload Video
                  </button>
                )}
              </div>
            </div>

            {showCreateVideo && (
              <div className="video-form-container">
                <h2>{editingVideo ? 'Edit Video' : 'Upload Video'}</h2>
                <form onSubmit={editingVideo ? handleEditVideo : handleCreateVideo} className="video-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                      rows="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>Video URL</label>
                    <input
                      type="text"
                      value={videoForm.videoUrl}
                      onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                      required={!editingVideo}
                      disabled={!!editingVideo}
                    />
                  </div>
                  <div className="form-group">
                    <label>Thumbnail URL</label>
                    <input
                      type="text"
                      value={videoForm.thumbnailUrl}
                      onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={videoForm.category}
                      onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                      required
                    >
                      <option value="All">All</option>
                      <option value="Music">Music</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Sports">Sports</option>
                      <option value="Technology">Technology</option>
                      <option value="News">News</option>
                      <option value="Travel">Travel</option>
                      <option value="Food">Food</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Science">Science</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="submit">{editingVideo ? 'Update Video' : 'Upload Video'}</button>
                    <button type="button" onClick={() => {
                      setShowCreateVideo(false);
                      setEditingVideo(null);
                    }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="channel-videos">
              <h2>Videos</h2>
              {videos.length === 0 ? (
                <p className="no-videos">No videos yet</p>
              ) : (
                <div className="video-grid">
                  {videos.map((video) => (
                    <div key={video._id} className="video-card-wrapper">
                      <VideoCard video={video} />
                      {isMyChannel && (
                        <div className="video-actions">
                          <button onClick={() => startEditVideo(video)} className="edit-button">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteVideo(video._id)} className="delete-button">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Channel;

