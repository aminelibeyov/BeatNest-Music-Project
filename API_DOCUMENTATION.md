# BeatNest Music API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123!",
  "confirmPassword": "securePassword123!",
  "role": "user" // or "artist"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "user": {
      "_id": "123abc",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isEmailVerified": false
    },
    "token": "eyJhbGc..."
  }
}
```

### 2. Login User
**Endpoint:** `POST /auth/login`

**Rate Limit:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGc..."
  }
}
```

### 3. Verify Email
**Endpoint:** `POST /auth/verify-email/:token`

**Description:** Activates user account with email verification token

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": { /* user object */ }
}
```

### 4. Forgot Password
**Endpoint:** `POST /auth/forgot-password`

**Rate Limit:** 3 requests per hour

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

### 5. Reset Password
**Endpoint:** `POST /auth/reset-password/:token`

**Rate Limit:** 3 requests per hour

**Request Body:**
```json
{
  "password": "newPassword123!",
  "confirmPassword": "newPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": { /* user object */ }
}
```

---

## Song Endpoints

### 6. Get All Songs
**Endpoint:** `GET /songs`

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 10, max: 100)
sort: string (default: "-createdAt")
search: string (optional)
genre: string (optional)
category: string (optional)
artist: string (optional)
status: string (default: "published")
minPlays: number (optional)
maxPlays: number (optional)
minLikes: number (optional)
maxLikes: number (optional)
dateFrom: ISO date (optional)
dateTo: ISO date (optional)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Songs fetched successfully",
  "data": {
    "songs": [
      {
        "_id": "song123",
        "title": "Amazing Song",
        "artist": "Artist Name",
        "genre": "Pop",
        "duration": 240,
        "plays": 1000,
        "likes": 500,
        "coverImage": "https://...",
        "status": "published"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "pages": 15,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 7. Get Song by ID
**Endpoint:** `GET /songs/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Song fetched successfully",
  "data": {
    "_id": "song123",
    "title": "Amazing Song",
    "artist": "Artist Name",
    "artistId": {
      "_id": "artist123",
      "firstName": "Artist",
      "lastName": "Name",
      "avatar": "https://...",
      "bio": "Artist bio"
    },
    "genre": "Pop",
    "category": "Music",
    "duration": 240,
    "description": "Song description",
    "lyrics": "Song lyrics...",
    "audioUrl": "https://...",
    "coverImage": "https://...",
    "plays": 1000,
    "likes": 500,
    "status": "published"
  }
}
```

### 8. Create Song (Artist Only)
**Endpoint:** `POST /songs`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "title": "My New Song",
  "artist": "My Name",
  "category": "categoryId123",
  "duration": 240,
  "genre": "Pop",
  "description": "Song description",
  "lyrics": "Song lyrics...",
  "audioUrl": "https://cloudinary.com/...",
  "coverImage": "https://cloudinary.com/..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Song created successfully",
  "data": { /* song object */ }
}
```

### 9. Update Song (Artist/Admin Only)
**Endpoint:** `PUT /songs/:id`

**Authentication Required:** Yes

**Authorization:** Owner or Admin

**Request Body:** Same as create (any field optional)

**Response (200):**
```json
{
  "success": true,
  "message": "Song updated successfully",
  "data": { /* updated song object */ }
}
```

### 10. Delete Song (Artist/Admin Only)
**Endpoint:** `DELETE /songs/:id`

**Authentication Required:** Yes

**Authorization:** Owner or Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Song deleted successfully",
  "data": { "message": "Song deleted successfully" }
}
```

### 11. Like/Unlike Song
**Endpoint:** `POST /songs/:id/like`

**Authentication Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Song liked/unliked successfully",
  "data": {
    "likes": 501,
    "isLiked": true
  }
}
```

### 12. Increment Play Count
**Endpoint:** `POST /songs/:id/play`

**Authentication Required:** No

**Response (200):**
```json
{
  "success": true,
  "message": "Play count incremented",
  "data": { /* updated song object */ }
}
```

---

## Wishlist Endpoints

### 13. Get Wishlist
**Endpoint:** `GET /wishlist`

**Authentication Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Wishlist fetched successfully",
  "data": {
    "songs": [
      {
        "songId": { /* song object */ },
        "addedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 14. Add to Wishlist
**Endpoint:** `POST /wishlist/:songId`

**Authentication Required:** Yes

**Response (201):**
```json
{
  "success": true,
  "message": "Song added to wishlist",
  "data": { /* wishlist item */ }
}
```

### 15. Remove from Wishlist
**Endpoint:** `DELETE /wishlist/:songId`

**Authentication Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Song removed from wishlist",
  "data": { "message": "Song removed successfully" }
}
```

---

## Playlist Endpoints

### 16. Get Playlists
**Endpoint:** `GET /playlists`

**Authentication Required:** Yes

**Query Parameters:**
```
page: number (default: 1)
limit: number (default: 10)
sort: string (default: "-createdAt")
```

**Response (200):**
```json
{
  "success": true,
  "message": "Playlists fetched successfully",
  "data": {
    "playlists": [
      {
        "_id": "playlist123",
        "name": "My Playlist",
        "description": "Playlist description",
        "isPublic": true,
        "songs": ["song1", "song2"],
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 17. Create Playlist
**Endpoint:** `POST /playlists`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "name": "My New Playlist",
  "description": "Playlist description",
  "isPublic": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Playlist created successfully",
  "data": { /* playlist object */ }
}
```

### 18. Get Playlist by ID
**Endpoint:** `GET /playlists/:id`

**Authentication Required:** No (if public)

**Response (200):**
```json
{
  "success": true,
  "message": "Playlist fetched successfully",
  "data": { /* playlist with songs */ }
}
```

### 19. Update Playlist
**Endpoint:** `PUT /playlists/:id`

**Authentication Required:** Yes

**Authorization:** Owner only

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "isPublic": false
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Playlist updated successfully",
  "data": { /* updated playlist */ }
}
```

### 20. Delete Playlist
**Endpoint:** `DELETE /playlists/:id`

**Authentication Required:** Yes

**Authorization:** Owner only

**Response (200):**
```json
{
  "success": true,
  "message": "Playlist deleted successfully"
}
```

### 21. Add Song to Playlist
**Endpoint:** `POST /playlists/:playlistId/songs/:songId`

**Authentication Required:** Yes

**Response (201):**
```json
{
  "success": true,
  "message": "Song added to playlist",
  "data": { /* updated playlist */ }
}
```

### 22. Remove Song from Playlist
**Endpoint:** `DELETE /playlists/:playlistId/songs/:songId`

**Authentication Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "message": "Song removed from playlist"
}
```

---

## User Endpoints

### 23. Get User Profile
**Endpoint:** `GET /users/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "_id": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "bio": "User bio",
    "role": "user",
    "status": "active",
    "createdAt": "2024-01-01T10:30:00Z"
  }
}
```

### 24. Update User Profile
**Endpoint:** `PUT /users/:id`

**Authentication Required:** Yes

**Authorization:** Own profile or Admin

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "New bio",
  "avatar": "https://..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { /* updated user */ }
}
```

### 25. Get Artist's Songs
**Endpoint:** `GET /users/:id/songs`

**Response (200):**
```json
{
  "success": true,
  "message": "Artist songs fetched successfully",
  "data": {
    "songs": [ /* array of songs */ ],
    "pagination": { /* pagination info */ }
  }
}
```

---

## Admin Endpoints

### 26. Get All Users (Admin Only)
**Endpoint:** `GET /admin/users`

**Authentication Required:** Yes

**Authorization:** Admin only

**Query Parameters:**
```
page: number
limit: number
role: string
status: string
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [ /* array of users */ ],
    "pagination": { /* pagination info */ }
  }
}
```

### 27. Get Pending Songs (Admin Only)
**Endpoint:** `GET /admin/songs`

**Authentication Required:** Yes

**Authorization:** Admin only

**Query Parameters:**
```
status: string (default: "pending")
page: number
limit: number
```

**Response (200):**
```json
{
  "success": true,
  "message": "Songs fetched successfully",
  "data": {
    "songs": [ /* pending songs */ ],
    "pagination": { /* pagination info */ }
  }
}
```

### 28. Approve Song (Admin Only)
**Endpoint:** `POST /admin/songs/:id/approve`

**Authentication Required:** Yes

**Authorization:** Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Song approved successfully",
  "data": { /* approved song */ }
}
```

### 29. Reject Song (Admin Only)
**Endpoint:** `POST /admin/songs/:id/reject`

**Authentication Required:** Yes

**Authorization:** Admin only

**Request Body:**
```json
{
  "rejectionReason": "Reason for rejection"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Song rejected successfully",
  "data": { /* rejected song */ }
}
```

---

## Premium Endpoints

### 30. Get Premium Status
**Endpoint:** `GET /premium/status`

**Authentication Required:** Yes

**Response (200):**
```json
{
  "success": true,
  "data": {
    "isPremium": true,
    "tier": "premium",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

### 31. Subscribe to Premium
**Endpoint:** `POST /premium/subscribe`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "tier": "premium", // or "pro"
  "paymentMethod": "card_id"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": { /* subscription details */ }
}
```

---

## Error Responses

All error responses follow this format:

### 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "details": ["Field validation failed"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "statusCode": 403,
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already exists"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many authentication attempts, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

| Endpoint Type | Limit | Window |
|---|---|---|
| General | 100 | 15 minutes |
| Auth (login/register) | 5 | 15 minutes |
| Password Reset | 3 | 1 hour |

---

## Response Headers

All responses include:
```
Content-Type: application/json
X-Powered-By: Express
```

Successful responses include:
```
X-Total-Count: 150 (total records matching query)
X-Page: 1
X-Limit: 10
```

---

## Pagination Format

All paginated responses include:
```json
"pagination": {
  "total": 150,        // Total number of records
  "page": 1,          // Current page
  "limit": 10,        // Records per page
  "pages": 15,        // Total pages
  "hasNextPage": true, // Whether next page exists
  "hasPrevPage": false // Whether prev page exists
}
```

---

## Date Format

All dates returned are in ISO 8601 format:
```
2024-01-15T10:30:00.000Z
```

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "role": "user"
  }'
```

### Get Songs with Search
```bash
curl -X GET "http://localhost:5000/api/songs?search=pop&genre=Pop&limit=10&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Playlist
```bash
curl -X POST http://localhost:5000/api/playlists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Playlist",
    "description": "Description",
    "isPublic": true
  }'
```

---

## WebSocket Events (Future Implementation)

- `song:play` - When user starts playing a song
- `song:pause` - When user pauses a song
- `user:online` - When user goes online
- `user:offline` - When user goes offline
- `notification:new` - New notification
- `comment:new` - New comment on song

---

## Versioning

Current API Version: **v1**

Future versions will be available at `/api/v2/...`

---

**Last Updated:** January 2024
**Documentation Version:** 1.0
