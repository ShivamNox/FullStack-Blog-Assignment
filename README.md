# 📝 Full-Stack Blog Application

A modern, full-stack blog application with user authentication, CRUD operations, and a responsive UI built with React and Node.js.

![Blog App Screenshot](https://raw.githubusercontent.com/ShivamNox/FullStack-Blog-Assignment/refs/heads/main/SS/Screenshot%202026-01-20%20103928.png)

## ✨ Features

- **Authentication**: Secure user registration and login with JWT
- **CRUD Operations**: Create, read, update, and delete blog posts
- **Authorization**: Only post owners can edit/delete their posts
- **Search & Pagination**: Find posts by title or username
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Toast Notifications**: User feedback for all actions
- **Form Validation**: Client and server-side validation

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for validation

### Frontend
- React 18 with Vite
- React Router v6
- Tailwind CSS
- Axios for API calls
- react-hot-toast for notifications

## 📁 Project Structure

```
blog-app/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, error handling
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Helper functions
│   │   ├── index.js       # App entry point
│   │   └── seed.js        # Database seeder
│   ├── .env.example
│   └── package.json
│
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blog-app.git
   cd blog-app
   ```

2. **Set up the Backend**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   npm install
   ```

3. **Set up the Frontend**
   ```bash
   cd ../client
   cp .env.example .env
   npm install
   ```

### Running the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be at `http://localhost:5000`

#### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

### Seeding the Database

To populate the database with sample data:

```bash
cd server
npm run seed
```

This creates:
- Demo user: `demo@example.com` / `password123`
- 5 sample blog posts

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbG..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "login": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbG..."
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Posts Endpoints

#### Get All Posts
```http
GET /posts?page=1&limit=10&search=react
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Get Single Post
```http
GET /posts/:id
```

#### Get My Posts (Auth Required)
```http
GET /posts/my-posts?page=1&limit=10
Authorization: Bearer <token>
```

#### Create Post (Auth Required)
```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Amazing Blog Post",
  "imageURL": "https://example.com/image.jpg",
  "content": "This is the content of my blog post..."
}
```

#### Update Post (Auth Required, Owner Only)
```http
PUT /posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Post (Auth Required, Owner Only)
```http
DELETE /posts/:id
Authorization: Bearer <token>
```

### Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "details": [
    { "field": "title", "message": "Title must be 5-120 characters" }
  ]
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "You are not logged in. Please log in to get access."
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "You are not authorized to update this post"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Post not found"
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with 12 rounds
- **JWT Authentication**: Secure token-based auth
- **Authorization**: Owner-only access for updates/deletes
- **Input Validation**: Server and client-side
- **CORS Configuration**: Restricted origins
- **No Password Exposure**: Passwords never returned in responses

## 📱 Screenshots

### Home Page
![Home](https://raw.githubusercontent.com/ShivamNox/FullStack-Blog-Assignment/refs/heads/main/SS/Screenshot%202026-01-20%20103928.png)

### Post Detail
![Post Detail](https://raw.githubusercontent.com/ShivamNox/FullStack-Blog-Assignment/refs/heads/main/SS/Screenshot%202026-01-20%20110514.png)

### Create Post
![Create Post](https://raw.githubusercontent.com/ShivamNox/FullStack-Blog-Assignment/refs/heads/main/SS/Screenshot%202026-01-20%20110533.png)

### My Posts
![My Posts](https://raw.githubusercontent.com/ShivamNox/FullStack-Blog-Assignment/refs/heads/main/SS/Screenshot%202026-01-20%20110550.png)

### Login
![Login](https://raw.githubusercontent.com/ShivamNox/FullStack-Blog-Assignment/refs/heads/main/SS/Screenshot%202026-01-20%20110606.png)

## 🧪 Testing with Postman

Import the following collection or use the requests above:

1. Set environment variable `BASE_URL` to `http://localhost:5000/api`
2. Set `TOKEN` variable after login
3. Use `{{TOKEN}}` in Authorization header

### Sample Requests

**Register:**
```
POST {{BASE_URL}}/auth/register
Body: { "username": "test", "email": "test@test.com", "password": "123456" }
```

**Login:**
```
POST {{BASE_URL}}/auth/login
Body: { "login": "test@test.com", "password": "123456" }
```

**Create Post:**
```
POST {{BASE_URL}}/posts
Headers: Authorization: Bearer {{TOKEN}}
Body: { "title": "Test Post", "content": "This is test content that is at least 50 characters long for validation." }
```

## 📝 Environment Variables

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/blog |
| JWT_SECRET | JWT signing secret (min 32 chars) | your-super-secret-key |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |
| NODE_ENV | Environment | development |

### Client (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |


## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [@ShivamNox](https://github.com/shivamnox)

---

Made with ❤️ using React and Node.js
```

---

## Summary

This complete full-stack blog application includes:

### ✅ Backend Features
- Express.js REST API
- MongoDB with Mongoose ODM
- JWT authentication
- Password hashing with bcryptjs
- Input validation with express-validator
- Error handling middleware
- CORS configuration
- Slug generation for SEO-friendly URLs

### ✅ Frontend Features
- React 18 with Vite
- React Router v6 for navigation
- Context API for auth state
- Custom hooks for data fetching
- Tailwind CSS for styling
- Toast notifications
- Responsive design
- Loading and empty states
- Confirm dialogs for destructive actions

### ✅ Security
- Protected routes (frontend & backend)
- Owner-only operations
- Secure password storage
- Token-based authentication
- Input sanitization

### 🚀 To Run:
1. Install dependencies in both `/server` and `/client`
2. Configure `.env` files from `.env.example`
3. Start MongoDB
4. Run `npm run seed` to populate sample data
5. Start both servers with `npm run dev`
