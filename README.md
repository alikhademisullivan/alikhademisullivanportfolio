# Ali Khademi Sullivan — Portfolio

Personal portfolio site built with Vue 3, Express, and MongoDB.

**Live site:** [alikhs.com](https://alikhs.com)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vue 3, Vue Router, Bootstrap 5 |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| File storage | MongoDB (resume, images, profile photo) |
| Hosting | Render (free tier) |

---

## Project Structure

```
├── Server.js              # Express entry point
├── Routes/auth.js         # All API routes
├── Models/                # Mongoose schemas
├── client/                # Vue 3 frontend
│   ├── src/
│   │   ├── components/    # Pages and UI components
│   │   │   └── extras/    # Non-portfolio pages (hidden routes)
│   │   ├── services/      # Axios API clients
│   │   └── router/        # Vue Router config
│   └── public/
├── docs/                  # Old deployment notes (reference only)
└── .env                   # Local env vars (never commit)
```

---

## Local Development

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB)

### 1. Clone and install

```bash
git clone https://github.com/alikhademisullivan/alikhademisullivanportfolio.git
cd alikhademisullivanportfolio
npm install
cd client && npm install && cd ..
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/Users?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_here
VUE_APP_API_URL=http://localhost:5000
CLIENT_URL=http://localhost:5000
PORT=5000
```

### 3. Build the frontend

```bash
cd client && npm run build && cd ..
```

### 4. Run the server

```bash
node Server.js
```

Visit `http://localhost:5000`

### Frontend dev server (hot reload)

To work on the Vue frontend with live reload, run the backend and frontend separately:

```bash
# Terminal 1 — backend
node Server.js

# Terminal 2 — frontend dev server
cd client && npm run serve
```

Frontend runs at `http://localhost:8081`, proxying API calls to the backend at port 5000.  
Set `VUE_APP_API_URL=http://localhost:5000` in your `.env`.

---

## Deployment (Render)

### Environment variables (set in Render dashboard)

| Key | Value |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret string |
| `VUE_APP_API_URL` | `https://alikhs.com` |
| `CLIENT_URL` | `https://alikhs.com` |
| `CORS_ORIGINS` | `https://alikhs.com,https://www.alikhs.com` |
| `PORT` | `10000` |

### Build & start commands (set in Render dashboard)

```
Build:  npm install && cd client && npm install && npm run build
Start:  node Server.js
```

---

## Admin Panel

Go to `/login` and sign in with your admin account to:
- Add / edit / delete projects and experiences
- Upload your resume (PDF) and profile photo
- View and manage contact form messages
- Manage skill categories

---

## API Routes

All routes are prefixed with `/auth`.

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | — | Login |
| `POST` | `/auth/register` | — | Register |
| `GET` | `/auth/getAllProjects` | — | Get all projects |
| `POST` | `/auth/addProject` | Admin | Add project |
| `PUT` | `/auth/editProject/:id` | Admin | Edit project |
| `DELETE` | `/auth/deleteProject/:id` | Admin | Delete project |
| `GET` | `/auth/getAllExperiences` | — | Get all experiences |
| `POST` | `/auth/addExperience` | Admin | Add experience |
| `PUT` | `/auth/editExperience/:id` | Admin | Edit experience |
| `DELETE` | `/auth/deleteExperience/:id` | Admin | Delete experience |
| `GET` | `/auth/getAllSkills` | — | Get all skills |
| `POST` | `/auth/addSkill` | Admin | Add skill |
| `POST` | `/auth/contact` | — | Submit contact form |
| `GET` | `/auth/contacts` | Admin | View messages |
| `POST` | `/auth/uploadResume` | Admin | Upload resume |
| `GET` | `/auth/resume` | — | Serve resume PDF |
| `POST` | `/auth/uploadProfilePhoto` | Admin | Upload profile photo |
| `GET` | `/auth/profilePhoto` | — | Serve profile photo |
| `POST` | `/auth/uploadImage` | Admin | Upload image |
| `GET` | `/auth/image/:id` | — | Serve stored image |
