<<<<<<< HEAD
# BeatNest-Music-Project
BeatNest Music Project
=======
# BeatNest - Spotify Clone Music Streaming Platform

**BeatNest** is a production-grade, full-stack music streaming application built with modern web technologies. It provides a complete music streaming experience with user authentication, artist management, admin controls, and premium subscription features.

## 🎵 Project Overview

BeatNest is designed to replicate Spotify's core functionality with the following architecture:

- **Frontend**: React + Vite with Tailwind CSS, Redux Toolkit, and RTK Query
- **Backend**: Node.js + Express with MongoDB
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary integration
- **Role System**: Listener, Artist, Admin

## 📁 Project Structure

```
BeatNest-Music-Project/
├── client/                 # React + Vite frontend application
│   ├── src/
│   │   ├── app/           # Redux store setup
│   │   ├── pages/         # Page components
│   │   ├── features/      # Feature-based modules
│   │   ├── components/    # Reusable UI components
│   │   ├── layouts/       # Layout components
│   │   ├── routes/        # Route configuration
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services (RTK Query)
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript types
│   │   ├── assets/        # Images, fonts, etc.
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
├── server/                 # Express.js backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── modules/       # Feature modules (MVC)
│   │   ├── middlewares/   # Express middlewares
│   │   ├── routes/        # Route handlers
│   │   ├── utils/         # Utility functions
│   │   ├── services/      # Business logic
│   │   ├── validations/   # Request validations
│   │   ├── sockets/       # WebSocket handlers
│   │   ├── jobs/          # Background jobs
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── .eslintrc.json
│
├── ARCHITECTURE.md         # Detailed architecture documentation
├── DATABASE_SCHEMA.md      # Database schema documentation
├── API_ROUTES.md           # API routes documentation
├── .gitignore
└── README.md              # This file
```

## 🚀 Key Features

### Authentication & Security
- User registration and login
- JWT authentication with refresh tokens
- Password reset functionality
- Role-based access control (RBAC)
- Secure password hashing with bcrypt

### User Features
- Home page with recommendations
- Advanced search functionality
- Music player with queue management
- Favorites/Wishlist system
- Playlist creation and management
- Listening history tracking
- User profile management
- Follow artists
- Premium subscription

### Artist Features
- Upload songs and cover images
- Create albums
- Song management
- Profile management
- Song approval workflow (pending → approved)

### Admin Features
- Comprehensive admin dashboard
- Song approval/rejection
- User management (ban/unban)
- Analytics and statistics
- Category management
- Premium user management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Validation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **Cloudinary** - Cloud storage
- **Helmet** - Security middleware
- **Express Validator** - Validation

## 📝 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB
- Git

### Installation

#### Clone Repository
```bash
git clone https://github.com/aminelibeyov/BeatNest-Music-Project.git
cd BeatNest-Music-Project
```

#### Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Configure .env with your settings
npm run dev
```

#### Setup Frontend
```bash
cd client
npm install
cp .env.example .env
# Configure .env with API URL
npm run dev
```

## 🏗️ Architecture Highlights

### Clean Architecture Principles
- Separation of concerns (MVC pattern on backend)
- Feature-based organization (frontend)
- Reusable components and services
- Scalable folder structure

### Backend MVC Structure
Each module contains:
- **Controller** - Request handlers
- **Service** - Business logic
- **Model** - Database schema
- **Route** - Endpoints
- **Validation** - Request validation

### Frontend Feature Architecture
- **Feature modules** with isolated logic
- **Reusable components** for UI
- **Custom hooks** for logic
- **RTK Query** for API state management
- **Protected routes** for RBAC

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture details
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database schemas
- [API_ROUTES.md](./API_ROUTES.md) - API endpoints reference

## 🔐 Security Features

- JWT token-based authentication
- Refresh token rotation
- Rate limiting
- CORS configuration
- Helmet security headers
- Input validation and sanitization
- SQL injection protection (MongoDB)
- XSS protection

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop experience
- Dark theme (Spotify-style)
- Smooth animations

## 📄 License

This project is part of a final project submission. All rights reserved.

---

**Last Updated**: May 2026  
**Status**: Architecture Planning Complete
>>>>>>> 90cca7e (chore: initial architecture and project setup)
