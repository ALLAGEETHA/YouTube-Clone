import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FilterButtons from '../components/FilterButtons';
import VideoCard from '../components/VideoCard';
import './Home.css';

const categories = ['All', 'Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'Technology', 'News', 'Travel', 'Food', 'Fashion', 'Science'];

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchVideos();
  }, [activeCategory, searchQuery]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (activeCategory !== 'All') params.category = activeCategory;

      const response = await axios.get('/api/videos', { params });
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVideos();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="home">
      <Header
        onMenuClick={toggleSidebar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className="home-content">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <FilterButtons
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          {loading ? (
            <div className="loading">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="no-videos">No videos found</div>
          ) : (
            <div className="video-grid">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

