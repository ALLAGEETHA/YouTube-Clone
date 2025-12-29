# Frontend Setup

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components (Header, Sidebar, etc.)
├── pages/         # Page components (Home, Auth, VideoPlayer, Channel)
├── context/       # React Context (AuthContext)
├── App.jsx        # Main app component with routes
└── main.jsx       # Entry point
```

## Features

- React Router for navigation
- Axios for API calls
- Context API for state management
- Responsive CSS design
- JWT authentication

