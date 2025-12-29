import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Auth from './pages/Auth';
import VideoPlayer from './pages/VideoPlayer';
import Channel from './pages/Channel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route
          path="/channel/:channelId"
          element={<Channel />}
        />
        <Route
          path="/my-channel"
          element={
            <ProtectedRoute>
              <Channel isMyChannel={true} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

