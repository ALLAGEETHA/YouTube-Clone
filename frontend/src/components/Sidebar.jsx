import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔥', label: 'Trending', path: '/' },
    { icon: '📺', label: 'Subscriptions', path: '/' },
    { icon: '📚', label: 'Library', path: '/' },
    { icon: '📜', label: 'History', path: '/' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
          {user && (
            <Link
              to="/my-channel"
              className="sidebar-item"
              onClick={onClose}
            >
              <span className="sidebar-icon">📹</span>
              <span className="sidebar-label">My Channel</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

