# BeatNest - Music Platform

BeatNest is a comprehensive music streaming and sharing platform built with Node.js/Express for the backend and React for the frontend.

## Features

### Backend Features
- ✅ User Authentication (Login, Register, Email Verification)
- ✅ Password Management (Hash, Reset, Forgot Password)
- ✅ Role-Based Authorization (User, Artist, Admin)
- ✅ Song Management (Create, Read, Update, Delete)
- ✅ Pagination, Filtering, and Sorting
- ✅ Search Functionality
- ✅ Global Error Handling
- ✅ Logger Middleware
- ✅ File Upload (Multer, Cloudinary)
- ✅ Email Service (Nodemailer)

### Frontend Features
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Modern UI/UX with Tailwind CSS
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Minimum 6 Pages
  - Home
  - Login
  - Register
  - Dashboard
  - Song Detail
  - Contact
  - Admin Panel
- ✅ Admin Panel
- ✅ CRUD Operations
- ✅ Dynamic API Integration
- ✅ Real-time Loading States

## Project Structure

```
BeatNest-Music-Project/
├── server/
│   ├── src/
│   │   ├── config/         # Database, Passport, Cloudinary
│   │   ├── constants/      # Roles, Status
│   │   ├── controllers/    # Business logic
│   │   ├── middlewares/    # Auth, Error, Logger, Role, Upload
│   │   ├── models/         # User, Song, Category, Order
│   │   ├── routes/         # API routes
│   │   ├── services/       # Auth, Email, Music
│   │   ├── utils/          # JWT, ApiError
│   │   ├── validations/    # Input validation
│   │   ├── queue/          # Email queue
│   │   ├── templates/      # Email templates
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/     # Common, Auth, Admin
    │   ├── pages/          # Home, Login, Register, Dashboard, etc.
    │   ├── services/       # API calls
    │   ├── hooks/          # useAuth, useFetch
    │   ├── context/        # AuthContext
    │   ├── utils/          # Validators, helpers
    │   ├── styles/         # Global CSS
    │   ├── assets/         # Images, icons
    │   ├── main.jsx
    │   └── App.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Installation

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/beatnest
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/verify-email/:token` - Verify email

### Songs
- `GET /api/songs` - Get all songs with pagination/filtering
- `GET /api/songs/:id` - Get song detail
- `POST /api/songs` - Create song (Artist/Admin only)
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song
- `POST /api/songs/:id/like` - Like/Unlike song
- `POST /api/songs/:id/play` - Increment play count

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/account` - Delete account

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete user
- `POST /api/admin/songs/:songId/approve` - Approve song
- `DELETE /api/admin/songs/:songId/reject` - Reject song

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcryptjs
- Nodemailer
- Multer
- Cloudinary
- Passport.js

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- React Toastify
- Zustand (State Management)
- Vite

## Available Scripts

### Server
```bash
npm run dev      # Start development server
npm start        # Start production server
npm test         # Run tests
```

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

ISC

## Author

Your Name

---

**Happy Coding! 🎵**
