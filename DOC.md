# 📝 Blog App - Developer Documentation

A full-stack blog application with authentication, CRUD operations, and responsive UI.

---

## 🚀 Quick Start

```bash
# 1. Clone & Install
git clone https://github.com/ShivamNox/FullStack-Blog-Assignment
cd FullStack-Blog-Assignment
npm install

# 2. Setup Environment
cp .env.example .env
# Add your MongoDB URI and JWT secret

# 3. Build & Run
npm run build
node server.js
```

**Demo Login:** `demo@example.com` / `password123`

---

## 📁 Project Structure

```
blog-app/
├── client/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/   # Auth state
│   │   ├── hooks/     # Custom hooks
│   │   └── services/  # API calls
│   └── dist/          # Build output
│
├── server/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── utils/
│
└── node_modules/      # All dependencies here
```

---

## 🔧 Environment Variables

### `.env` (Root)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog_app
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcryptjs |
| Validation | express-validator |

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login user
GET    /api/auth/me          Get current user (protected)
```

### Posts
```
GET    /api/posts                 Get all posts (pagination, search)
GET    /api/posts/my-posts        Get my posts (protected)
GET    /api/posts/stats           Get post statistics
GET    /api/posts/:id             Get single post
POST   /api/posts                 Create post (protected)
PUT    /api/posts/:id             Update post (protected, owner only)
DELETE /api/posts/:id             Delete post (protected, owner only)
```

### Example Request
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"demo@example.com","password":"password123"}'

# Create Post (with token)
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My First Post",
    "content":"This is a blog post with at least 50 characters of content.",
    "imageURL":"https://example.com/image.jpg"
  }'
```

---

## 🗄️ Data Models

### User
```javascript
{
  username: String (3-30 chars, unique),
  email: String (unique),
  password: String (hashed, min 6 chars),
  createdAt: Date
}
```

### Post
```javascript
{
  title: String (5-120 chars),
  slug: String (auto-generated),
  content: String (min 50 chars),
  imageURL: String (optional),
  username: String,
  author: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Authentication Flow

1. **Register/Login** → Get JWT token
2. **Store token** in `localStorage`
3. **Add to headers** → `Authorization: Bearer <token>`
4. **Protected routes** validate token via middleware
5. **Owner-only actions** check `post.author === user._id`

---

## 🎨 Frontend Components

### Key Components
- `Navbar` - Navigation with auth state
- `PostCard` - Display post preview
- `PostForm` - Create/edit posts
- `Pagination` - Handle page navigation
- `ProtectedRoute` - Auth guard for routes

### Custom Hooks
- `usePosts()` - Fetch all posts
- `useMyPosts()` - Fetch user's posts
- `usePost(id)` - Fetch single post

---

## 🚦 Common Tasks

### Add New API Route
```javascript
// 1. Create controller (server/src/controllers/)
export const myController = async (req, res) => {
  // logic here
};

// 2. Add to routes (server/src/routes/)
router.get('/my-route', protect, myController);

// 3. Update client API (client/src/services/api.js)
export const myAPI = {
  getData: () => api.get('/my-route')
};
```

### Add New Page
```javascript
// 1. Create page (client/src/pages/MyPage.jsx)
export default function MyPage() {
  return <div>My Page</div>;
}

// 2. Add route (client/src/App.jsx)
<Route path="/my-page" element={<MyPage />} />
```

---

## 🐛 Debugging

### Backend Not Starting
```bash
# Check MongoDB connection
mongo --eval "db.version()"

# Check environment variables
cat .env

# View logs
npm start
```

### Frontend Build Issues
```bash
# Clear and rebuild
cd client
rm -rf node_modules dist
npm install
npm run build
```

### API Not Responding
```bash
# Check if running
curl http://localhost:5000/api/health

# Check logs for errors
# Common issues:
# - MongoDB not connected
# - Missing JWT_SECRET
# - Port already in use
```

---

## 📦 Deployment

### Production Build
```bash
# 1. Build client
cd client && npm run build && cd ..

# 2. Set environment
export NODE_ENV=production

# 3. Start server
npm start
```

### Deploy to Replit
1. Push code to Replit
2. Add secrets in Replit Secrets tab:
   - `MONGODB_URI`
   - `JWT_SECRET`
3. Click Run ▶️

### Deploy to Heroku
```bash
# Add Procfile
echo "web: npm start" > Procfile

# Deploy
heroku create
git push heroku main
heroku config:set MONGODB_URI=<your-uri>
heroku config:set JWT_SECRET=<your-secret>
```

---

## 🔐 Security Notes

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens for stateless auth
- ✅ Input validation on client & server
- ✅ SQL/NoSQL injection prevention
- ✅ CORS configured
- ✅ Helmet for security headers
- ✅ Owner-only post modifications

---

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

### Test Accounts
- Email: `demo@example.com`
- Password: `password123`

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Router Docs](https://reactrouter.com/)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

## 🆘 Common Errors

| Error | Solution |
|-------|----------|
| `Cannot find module 'helmet'` | Run `npm install` in root |
| `401 Unauthorized` | Check JWT token in localStorage |
| `Post not found` | Check route order in `postRoutes.js` |
| `CSS not loading` | Rebuild client: `cd client && npm run build` |
| `MongoDB connection failed` | Check `MONGODB_URI` in `.env` |

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error messages in console
3. Check browser DevTools Network tab
4. Verify `.env` configuration

---

**Made with ❤️ | Last Updated: 01/19/2026**
