# Environment Setup

Create a `.env` file in the `backend` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

## Steps:

1. Create a file named `.env` in the `backend` folder
2. Copy the content above into it
3. Replace `your_jwt_secret_key_here_change_in_production` with a strong random string (for production)

## MongoDB Setup:

**Option 1: Local MongoDB**
- Make sure MongoDB is installed and running
- Default connection: `mongodb://localhost:27017/youtube-clone`

**Option 2: MongoDB Atlas**
- Get your connection string from MongoDB Atlas
- Replace `MONGODB_URI` with your Atlas connection string
- Example: `mongodb+srv://username:password@cluster.mongodb.net/youtube-clone`

## After creating .env:

1. Start MongoDB (if using local)
2. Run `npm run dev` in the backend directory
3. You should see: "Connected to MongoDB" and "Server is running on port 5000"

