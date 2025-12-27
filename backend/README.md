# Backend Setup

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube-clone
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## Seeding the Database

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- 3 sample users
- 3 sample channels
- 6 sample videos
- Sample comments

**Default login credentials:**
- Email: `john@example.com`, Password: `password123`
- Email: `jane@example.com`, Password: `password123`
- Email: `tech@example.com`, Password: `password123`

## API Endpoints

See the main README.md for complete API documentation.

