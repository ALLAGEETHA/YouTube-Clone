# YouTube Clone - MERN Stack Project

A full-stack YouTube clone application built with MongoDB, Express, React, and Node.js (MERN stack). This project demonstrates a complete video sharing platform with user authentication, video management, comments, and channel functionality.

## Features

### Frontend (React)
- **Home Page**: YouTube-style header, collapsible sidebar, filter buttons, and video grid
- **User Authentication**: Registration and login with JWT-based authentication
- **Search & Filter**: Search videos by title and filter by category (12 categories)
- **Video Player Page**: Full video player with like/dislike functionality and comment CRUD operations
- **Channel Page**: Create channels, upload videos, and manage videos (CRUD operations)
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop devices

### Backend (Node.js & Express)
- **RESTful API**: Well-structured API endpoints for all features
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Integration**: Efficient data storage and retrieval
- **Protected Routes**: Authentication middleware for secure endpoints

## Technologies Used

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas or local instance)
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS3 with responsive design

## Project Structure

```
youtube-clone/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Channel.js
│   │   ├── Video.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── videoRoutes.js
│   │   └── commentRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd youtube-clone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

**Note**: Replace `your_jwt_secret_key_here_change_in_production` with a strong, random secret key for production use.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Start MongoDB

If using local MongoDB:

```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas and update the `MONGODB_URI` in your `.env` file.

### 5. Run the Application

**Backend** (from `backend` directory):
```bash
npm run dev
# or
npm start
```

**Frontend** (from `frontend` directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Channels
- `POST /api/channels` - Create a new channel (protected)
- `GET /api/channels/my-channels` - Get user's channels (protected)
- `GET /api/channels/:channelId` - Get channel by ID
- `PUT /api/channels/:channelId` - Update channel (protected)

### Videos
- `GET /api/videos` - Get all videos (supports ?search= and ?category= query params)
- `GET /api/videos/:videoId` - Get video by ID
- `POST /api/videos` - Create a new video (protected)
- `PUT /api/videos/:videoId` - Update video (protected)
- `DELETE /api/videos/:videoId` - Delete video (protected)
- `POST /api/videos/:videoId/like` - Like a video (protected)
- `POST /api/videos/:videoId/dislike` - Dislike a video (protected)

### Comments
- `GET /api/comments/video/:videoId` - Get all comments for a video
- `POST /api/comments` - Create a new comment (protected)
- `PUT /api/comments/:commentId` - Update comment (protected)
- `DELETE /api/comments/:commentId` - Delete comment (protected)

## Usage Guide

### 1. User Registration & Login
- Navigate to the home page
- Click "Sign In" button in the header
- Register a new account or login with existing credentials
- After successful login, you'll be redirected to the home page

### 2. Creating a Channel
- After logging in, navigate to "My Channel" from the sidebar or header
- Click "Create Channel" button
- Fill in the channel details (name, description, banner URL)
- Submit the form

### 3. Uploading Videos
- Go to your channel page
- Click "Upload Video" button
- Fill in video details:
  - Title (required)
  - Description
  - Video URL (required) - Use a publicly accessible video URL
  - Thumbnail URL (required) - Use a publicly accessible image URL
  - Category (required)
- Submit the form

### 4. Managing Videos
- On your channel page, you can:
  - View all your videos
  - Edit video details (click "Edit" button)
  - Delete videos (click "Delete" button)

### 5. Watching Videos
- Click on any video thumbnail from the home page
- Watch the video in the player
- Like or dislike the video (requires login)
- Add comments (requires login)
- Edit or delete your own comments

### 6. Search & Filter
- Use the search bar in the header to search videos by title
- Use filter buttons to filter videos by category
- Categories include: All, Music, Gaming, Education, Entertainment, Sports, Technology, News, Travel, Food, Fashion, Science

## Sample Data Structure

### User
```json
{
  "userId": "user01",
  "username": "JohnDoe",
  "email": "john@example.com",
  "password": "hashedPassword123",
  "avatar": "https://example.com/avatar/johndoe.png",
  "channels": ["channel01"]
}
```

### Channel
```json
{
  "channelId": "channel01",
  "channelName": "Code with John",
  "owner": "user01",
  "description": "Coding tutorials and tech reviews by John Doe.",
  "channelBanner": "https://example.com/banners/john_banner.png",
  "subscribers": 5200,
  "videos": ["video01", "video02"]
}
```

### Video
```json
{
  "videoId": "video01",
  "title": "Learn React in 30 Minutes",
  "thumbnailUrl": "https://example.com/thumbnails/react30min.png",
  "videoUrl": "https://example.com/videos/react30min.mp4",
  "description": "A quick tutorial to get started with React.",
  "channelId": "channel01",
  "uploader": "user01",
  "views": 15200,
  "likes": 1023,
  "dislikes": 45,
  "category": "Education",
  "uploadDate": "2024-09-20"
}
```

### Comment
```json
{
  "commentId": "comment01",
  "videoId": "video01",
  "userId": "user02",
  "text": "Great video! Very helpful.",
  "timestamp": "2024-09-21T08:30:00Z"
}
```

## Database Seeding (Optional)

To populate the database with sample data, you can use MongoDB Compass or create a seed script. Here's a sample seed script structure:

```javascript
// backend/seed.js
import mongoose from 'mongoose';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';
// ... seed data
```

## Features Implementation

### ✅ Completed Features

1. **Home Page**
   - YouTube-style header with logo and search bar
   - Collapsible sidebar (toggleable via hamburger menu)
   - Filter buttons (12 categories)
   - Video grid with thumbnails, titles, channel names, and views

2. **User Authentication**
   - Registration with username, email, and password
   - Login with email and password
   - JWT-based authentication
   - Protected routes
   - Form validation with error messages
   - Auto-redirect after registration to login page

3. **Search & Filter**
   - Search videos by title
   - Filter videos by category
   - Real-time filtering

4. **Video Player Page**
   - Video player with controls
   - Video title and description
   - Channel information
   - Like and dislike buttons (fully functional)
   - Comment section with CRUD operations
   - View counter

5. **Channel Page**
   - Create channel functionality
   - Display channel videos
   - Upload new videos
   - Edit existing videos
   - Delete videos
   - Channel banner and information

6. **Responsive Design**
   - Mobile-friendly layout
   - Tablet optimization
   - Desktop experience

## Code Quality

- **ES Modules**: All code uses `import/export` syntax
- **Clean Code**: Well-organized folder structure
- **Error Handling**: Comprehensive error handling throughout
- **Validation**: Input validation on both frontend and backend
- **Security**: Password hashing, JWT authentication, protected routes

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env` file
   - Verify network connectivity for MongoDB Atlas

2. **CORS Errors**
   - Ensure backend CORS is configured correctly
   - Check that frontend proxy is set up in `vite.config.js`

3. **Authentication Issues**
   - Clear browser localStorage
   - Verify JWT_SECRET is set in backend `.env`
   - Check token expiration

4. **Port Already in Use**
   - Change PORT in backend `.env` file
   - Update frontend proxy in `vite.config.js` if needed

## Development Notes

- The project uses ES Modules throughout
- Vite is used instead of Create React App
- All API calls use Axios with proper error handling
- Responsive design uses CSS Grid and Flexbox
- Authentication state is managed via React Context

## Future Enhancements

- Video upload functionality (currently uses URLs)
- User subscriptions
- Video recommendations
- Playlists
- Nested comments
- Video analytics
- User profiles

## License

This project is created for educational purposes.

## Author

Created as a capstone project demonstrating full-stack MERN development skills.

## Acknowledgments

- YouTube for design inspiration
- MERN stack community for best practices

