# Ali Khademi Sullivan - Professional Portfolio

A fully-featured, modern portfolio website built with Vue.js, Node.js, MongoDB, and Google Cloud Platform. Showcases projects, experience, skills, and allows visitors to get in touch.

## ✨ Features

### Public Pages
- **Hero Landing Page** - Impressive first impression with call-to-action buttons
- **Featured Projects** - Display your best work with descriptions, technologies, and links
- **Experience Timeline** - Professional timeline of your work history
- **Skills Showcase** - Organized skill categories (Languages, Frontend, Backend, Tools)
- **Contact Form** - Visitors can reach out directly
- **About Section** - Tell your story with statistics

### Admin Features
- **Project Management** - Add, edit, and delete projects
- **Experience Management** - Manage your work history
- **Contact Messages** - View and manage incoming messages
- **Admin Dashboard** - Secure admin panel for content management

## 🚀 Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Responsive CSS** - Mobile-first design

### Backend
- **Node.js & Express** - Server runtime and framework
- **MongoDB** - NoSQL database
- **JWT** - Secure authentication
- **Google Cloud Storage** - Image/resume hosting

### Deployment
- **Google Cloud App Engine** - Production hosting
- **MongoDB Atlas** - Cloud database

## 📁 Project Structure

```
├── client/                          # Vue.js frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── SiteHome_new.vue            # Landing page
│   │   │   ├── ProjectsHome_new.vue        # Projects showcase
│   │   │   ├── ExperienceHome_new.vue      # Experience timeline
│   │   │   ├── Contact_new.vue             # Contact form
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── ProjectsService.js
│   │   │   ├── ExperienceService.js
│   │   │   ├── ContactService.js
│   │   │   └── AuthService.js
│   │   ├── router/
│   │   │   └── index.js                    # Route definitions
│   │   └── App.vue                         # Main app component
│   └── .env                         # Environment variables
├── Models/                          # MongoDB schemas
│   ├── User.js                      # User model
│   ├── Projects.js                  # Project model (updated)
│   ├── Experiences.js               # Experience model (updated)
│   └── Contact.js                   # Contact message model
├── Routes/
│   └── auth.js                      # API routes & controllers
├── Server.js                        # Express server
├── app.yaml                         # Google Cloud deployment config
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 14+ 
- npm or yarn
- MongoDB Atlas account
- Google Cloud account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd alikhademisullivanportfolio
   ```

2. **Setup environment variables**
   ```bash
   # Root .env file
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/Users
   JWT_SECRET=your_jwt_secret_key
   VUE_APP_API_URL=https://your-gcp-url.com
   PORT=5000
   ```

   ```bash
   # client/.env file
   VUE_APP_API_URL=http://localhost:5000    # For local development
   # Change to production URL for build
   ```

3. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   ```

4. **Run locally**
   ```bash
   # Terminal 1 - Backend (from root directory)
   npm start
   # Server runs on http://localhost:5000
   
   # Terminal 2 - Frontend (from client directory)
   npm run serve
   # Frontend runs on http://localhost:8080
   ```

## 📊 Database Models

### Projects
```javascript
{
  name: String,                    // Project name
  description: String,             // Short description
  longDescription: String,         // Detailed description
  imageUrl: String,                // Project image URL
  githubLink: String,              // GitHub repository link
  liveLink: String,                // Live demo link
  technologies: [String],          // Tech stack
  featured: Boolean,               // Show on landing page
  order: Number,                   // Display order
  createdAt: Date
}
```

### Experiences
```javascript
{
  company: String,                 // Company name
  position: String,                // Job title
  description: String,             // Job description
  responsibilities: [String],      // Key responsibilities
  technologies: [String],          // Tech used
  startDate: Date,                 // Start date
  endDate: Date,                   // End date (optional)
  current: Boolean,                // Currently working
  logo: String,                    // Company logo URL
  order: Number,                   // Timeline order
  createdAt: Date
}
```

### Contact Messages
```javascript
{
  name: String,                    // Visitor name
  email: String,                   // Visitor email
  subject: String,                 // Message subject
  message: String,                 // Message content
  read: Boolean,                   // Admin read status
  createdAt: Date
}
```

## 🔐 Authentication

### Admin Features
Admin users can manage portfolio content through a secure login:

1. **Login** - Navigate to `/login`
2. **Register** - New admin registration at `/register`
3. **Admin Panel** - Access at `/admin` (protected route)
4. **Token** - JWT token stored in localStorage

### Creating Admin User
```bash
# Register through the UI or create directly in MongoDB
# Set isAdmin: true for admin privileges
```

## 🌐 Deployment to Google Cloud

### Prerequisites
- Google Cloud SDK installed
- GCP project created
- `gcloud` CLI configured

### Deploy Steps

1. **Update production environment variables**
   ```bash
   # client/.env for production
   VUE_APP_API_URL=https://your-project.uc.r.appspot.com
   ```

2. **Build the frontend**
   ```bash
   cd client
   npm run build
   cd ..
   ```

3. **Deploy to App Engine**
   ```bash
   gcloud app deploy app.yaml
   ```

4. **Monitor deployment**
   ```bash
   gcloud app logs read
   gcloud app browse  # Open in browser
   ```

### Environment Switching

**For Local Testing:**
```
# client/.env
VUE_APP_API_URL=http://localhost:5000
```

**For Production:**
```
# client/.env
VUE_APP_API_URL=https://your-gcp-url.uc.r.appspot.com
```

⚠️ **Important:** Restart the dev server after changing `.env` files!

```bash
# Stop current server (Ctrl+C)
# Update .env file
npm run serve  # Restart
```

## 📝 API Endpoints

### Public Endpoints
- `GET /auth/getAllProjects` - Get all projects
- `GET /auth/getAllExperiences` - Get all experiences
- `POST /auth/contact` - Submit contact form
- `GET /image/:filename` - Get project image

### Protected Endpoints (Require JWT)
- `POST /auth/addProject` - Create project
- `PUT /auth/editProject/:id` - Update project
- `DELETE /auth/deleteProject/:id` - Delete project
- `POST /auth/addExperience` - Create experience
- `PUT /auth/editExperience/:id` - Update experience
- `DELETE /auth/deleteExperience/:id` - Delete experience
- `GET /auth/contacts` - Get all contact messages
- `PUT /auth/contacts/:id/read` - Mark message as read
- `DELETE /auth/contacts/:id` - Delete message

## 🎨 Customization

### Colors & Branding
Edit the CSS in component files or update `App.vue` styles:
- Primary color: `#667eea`
- Secondary color: `#764ba2`

### Navigation
Update [client/src/router/index.js](client/src/router/index.js) to add/remove routes

### Content
Add projects, experiences, and skills through the admin panel or directly in MongoDB

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)  
- Desktop (> 1024px)

## 🐛 Troubleshooting

### API Connection Issues
1. Check `VUE_APP_API_URL` in `.env` matches your server
2. Ensure backend is running on correct port
3. Verify CORS settings in `Server.js`

### Database Connection
1. Verify MongoDB URI in `.env`
2. Check network access in MongoDB Atlas
3. Confirm database credentials

### Login Issues
1. Ensure JWT_SECRET is set
2. Check token expiration in `Routes/auth.js`
3. Verify user exists in MongoDB

## 📞 Contact

**Email:** sullivanali03@gmail.com  
**LinkedIn:** [Ali Khademi Sullivan](https://www.linkedin.com/in/ali-khademi-sullivan-49930b24a/)  
**GitHub:** [alikhademisullivan](https://github.com/alikhademisullivan)

## 📄 License

This project is open source and available for personal use.

---

**Built with ❤️ by Ali Khademi Sullivan**
