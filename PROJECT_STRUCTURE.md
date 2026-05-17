# Project Structure Overview

## 📁 Backend Structure (Node.js/Express)

### Models
- **User.js** - User schema with authentication fields
- **Song.js** - Song schema with metadata
- **Category.js** - Music categories
- **Order.js** - Payment orders

### Controllers
- **auth.controller.js** - Authentication logic (register, login, password reset)
- **song.controller.js** - Song CRUD operations
- **user.controller.js** - User profile management
- **admin.controller.js** - Admin functions (stats, user management)
- **payment.controller.js** - Order management

### Services
- **auth.service.js** - Authentication business logic
- **email.service.js** - Email sending (verification, password reset)
- **music.service.js** - Song management logic

### Middlewares
- **auth.middleware.js** - JWT token verification
- **role.middleware.js** - Role-based access control
- **error.middleware.js** - Global error handling
- **logger.middleware.js** - Request logging
- **upload.middleware.js** - File upload configuration

### Configuration
- **db.js** - MongoDB connection
- **cloudinary.js** - Image/file upload service
- **passport.js** - Authentication strategies

### Routes
- **auth.routes.js** - Authentication endpoints
- **song.routes.js** - Song management endpoints
- **user.routes.js** - User profile endpoints
- **admin.routes.js** - Admin endpoints
- **index.js** - Route aggregator

### Utilities & Validations
- **ApiError.js** - Custom error class
- **jwt.js** - JWT token management
- **auth.validation.js** - Joi schemas for auth
- **song.validation.js** - Joi schemas for songs

---

## 📁 Frontend Structure (React)

### Pages (6+ Pages)
1. **Home.jsx** - Landing page with features overview
2. **Login.jsx** - User login page
3. **Register.jsx** - User registration page
4. **Dashboard.jsx** - User dashboard (profile, music, favorites)
5. **SongDetail.jsx** - Song details with player
6. **Contact.jsx** - Contact form
7. **AdminPanel.jsx** - Admin dashboard with statistics

### Components
- **Common/** - Reusable components (Header, Footer, Navbar)
- **Auth/** - Authentication components (Forms)
- **Admin/** - Admin-specific components

### Services
- **api.js** - Axios instance with interceptors for API calls

### Hooks
- **useAuth.js** - Authentication context hook
- **useFetch.js** - Data fetching hook

### Context
- **AuthContext.jsx** - Global authentication state management

### Utils
- **validators.js** - Form validation functions

### Styling
- **index.css** - Global styles with Tailwind CSS

### Assets
- **images/, icons/, fonts/** - Static assets

---

## 🔗 API Integration Points

### Authentication Flows
✅ Register → Email Verification → Login
✅ Forgot Password → Reset Password
✅ JWT Token Management

### Song Management
✅ CRUD Operations (Create, Read, Update, Delete)
✅ Search, Filter, Pagination, Sorting
✅ Like/Unlike functionality
✅ Play count tracking

### Admin Features
✅ User management
✅ Song approval/rejection
✅ Dashboard statistics
✅ Role-based access control

### Email Services
✅ Email verification
✅ Password reset emails
✅ Welcome emails

---

## 📋 PDF Requirements Mapping

### Backend Requirements
| Requirement | Implementation |
|---|---|
| Login & Register | ✅ auth.controller.js, auth.service.js |
| Email Confirmations | ✅ email.service.js, User model |
| Forget Password | ✅ auth.service.js, email.service.js |
| Pagination, Filtering, Sorting | ✅ song.controller.js, getSongs() |
| Search | ✅ Song model indexes, getSongs() |
| Role-based Authorization | ✅ role.middleware.js, authorize() |
| Password Hash | ✅ bcryptjs in User model |
| Logger Middleware | ✅ logger.middleware.js, morgan |
| Show More | ✅ Pagination in controllers |
| Global Error Handling | ✅ error.middleware.js |

### Frontend Requirements
| Requirement | Implementation |
|---|---|
| Responsive Design | ✅ Tailwind CSS, Grid, Flexbox |
| Minimum 6 Pages | ✅ 7 Pages (Home, Login, Register, Dashboard, Detail, Contact, Admin) |
| Dynamic API Integration | ✅ axios, useFetch hook |
| CRUD Operations | ✅ API calls in services |
| JWT Authentication | ✅ AuthContext, useAuth hook |
| Protected Routes | ✅ PrivateRoute wrapper (to be added) |
| Admin Panel | ✅ AdminPanel.jsx with dashboard |
| UI/UX Standards | ✅ Tailwind CSS, Modern design |

---

## 🚀 Next Steps

1. **Install Dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. **Setup Environment Variables**
   - Create `.env` files from `.env.example`
   - Configure MongoDB, Email, Cloudinary

3. **Run Development Servers**
   ```bash
   # Backend (terminal 1)
   cd server && npm run dev

   # Frontend (terminal 2)
   cd client && npm run dev
   ```

4. **Git Workflow**
   - Initialize Git repo
   - Add all files: `git add .`
   - Initial commit: `git commit -m "Initial project setup"`
   - Create feature branches for development

5. **Additional Features to Implement**
   - Protected routes wrapper
   - Upload component
   - Player component
   - Playlist management
   - Notifications system
   - Real-time updates

---

**Project is ready for development! 🎵**
