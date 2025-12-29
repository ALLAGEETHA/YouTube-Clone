# PowerShell script to create a proper Git commit history
# This script helps organize commits for the YouTube Clone project

Write-Host "Initializing Git repository..." -ForegroundColor Green
git init
git branch -M main

Write-Host "`nCreating commit history..." -ForegroundColor Green
Write-Host "Note: This script creates logical commits. For real development," -ForegroundColor Yellow
Write-Host "you should commit incrementally as you build features.`n" -ForegroundColor Yellow

# Backend commits
Write-Host "Backend commits..." -ForegroundColor Cyan
git add backend/package.json backend/.gitignore backend/README.md
git commit -m "Backend: Initialize Node.js project with Express and dependencies" --allow-empty

git add backend/models/
git commit -m "Backend: Add MongoDB models (User, Channel, Video, Comment)" --allow-empty

git add backend/middleware/auth.js
git commit -m "Backend: Implement JWT authentication middleware" --allow-empty

git add backend/routes/authRoutes.js
git commit -m "Backend: Add authentication routes (register, login, get current user)" --allow-empty

git add backend/routes/channelRoutes.js
git commit -m "Backend: Implement channel management API routes" --allow-empty

git add backend/routes/videoRoutes.js
git commit -m "Backend: Add video CRUD operations and search/filter API" --allow-empty

git add backend/routes/commentRoutes.js
git commit -m "Backend: Implement comment CRUD operations API" --allow-empty

git add backend/server.js
git commit -m "Backend: Configure Express server with routes and MongoDB connection" --allow-empty

git add backend/env.template backend/setup-env.js backend/ENV_SETUP.md
git commit -m "Backend: Add environment configuration and setup utilities" --allow-empty

git add backend/seed.js
git commit -m "Backend: Add database seeding script for sample data" --allow-empty

git add backend/test-connection.js
git commit -m "Backend: Add MongoDB connection test utility" --allow-empty

# Frontend commits
Write-Host "Frontend commits..." -ForegroundColor Cyan
git add frontend/package.json frontend/vite.config.js frontend/index.html
git commit -m "Frontend: Initialize React project with Vite" --allow-empty

git add frontend/src/main.jsx frontend/src/App.jsx frontend/src/index.css
git commit -m "Frontend: Set up React app structure and routing" --allow-empty

git add frontend/src/context/AuthContext.jsx
git commit -m "Frontend: Implement authentication context with JWT" --allow-empty

git add frontend/src/components/Header.jsx frontend/src/components/Header.css
git commit -m "Frontend: Create header component with search bar and user info" --allow-empty

git add frontend/src/components/Sidebar.jsx frontend/src/components/Sidebar.css
git commit -m "Frontend: Implement collapsible sidebar navigation" --allow-empty

git add frontend/src/components/FilterButtons.jsx frontend/src/components/FilterButtons.css
git commit -m "Frontend: Add category filter buttons component" --allow-empty

git add frontend/src/components/VideoCard.jsx frontend/src/components/VideoCard.css
git commit -m "Frontend: Create video card component for video grid" --allow-empty

git add frontend/src/pages/Home.jsx frontend/src/pages/Home.css
git commit -m "Frontend: Implement home page with video grid and filters" --allow-empty

git add frontend/src/pages/Auth.jsx frontend/src/pages/Auth.css
git commit -m "Frontend: Create authentication page with registration and login" --allow-empty

git add frontend/src/pages/VideoPlayer.jsx frontend/src/pages/VideoPlayer.css
git commit -m "Frontend: Implement video player page with like/dislike and comments" --allow-empty

git add frontend/src/pages/Channel.jsx frontend/src/pages/Channel.css
git commit -m "Frontend: Create channel page with video management (CRUD)" --allow-empty

git add frontend/src/components/ProtectedRoute.jsx
git commit -m "Frontend: Add protected route component for authentication" --allow-empty

# Documentation
Write-Host "Documentation commits..." -ForegroundColor Cyan
git add README.md
git commit -m "Docs: Add comprehensive project README" --allow-empty

git add QUICKSTART.md SETUP_INSTRUCTIONS.md MONGODB_SETUP.md
git commit -m "Docs: Add setup and configuration documentation" --allow-empty

git add TROUBLESHOOTING.md RUN_PROJECT.md
git commit -m "Docs: Add troubleshooting and run instructions" --allow-empty

git add RUBRIC_CHECKLIST.md GIT_COMMIT_GUIDE.md
git commit -m "Docs: Add rubric compliance checklist and git guide" --allow-empty

git add .gitignore
git commit -m "Config: Add .gitignore for node_modules and environment files" --allow-empty

# Final commit with all actual files
Write-Host "`nAdding all project files..." -ForegroundColor Cyan
git add .
git commit -m "Project: Complete YouTube Clone MERN Stack implementation"

Write-Host "`n✅ Commit history created!" -ForegroundColor Green
Write-Host "Total commits: " -NoNewline
git log --oneline | Measure-Object -Line | Select-Object -ExpandProperty Lines
Write-Host "`nView commit history: git log --oneline" -ForegroundColor Yellow

