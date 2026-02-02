# ⚡ Quick Reference Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Start Backend Server
```bash
# From root directory
npm start
```
✅ Should show: "Server running on port 5000"

### 2️⃣ Start Frontend Server
```bash
# From client directory
cd client
npm run serve
```
✅ Should show: "Local: http://localhost:8080/"

### 3️⃣ Open Your Portfolio
Visit [http://localhost:8080](http://localhost:8080)

---

## 📍 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page |
| Projects | `/projects` | Project showcase |
| Experience | `/experience` | Work history |
| Contact | `/contact` | Contact form |
| Admin | `/admin` | Admin panel (login required) |
| Login | `/login` | Admin login |
| Register | `/register` | Create admin account |

---

## ⚙️ Environment Setup

### For Local Testing
**File:** `client/.env`
```
VUE_APP_API_URL=http://localhost:5000
```

### For Production
**File:** `client/.env`
```
VUE_APP_API_URL=https://trim-mix-436100-b6.uc.r.appspot.com
```

⚠️ **After changing `.env`, restart the dev server!**

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `client/src/components/SiteHome_new.vue` | Landing page |
| `client/src/components/ProjectsHome_new.vue` | Projects page |
| `client/src/components/ExperienceHome_new.vue` | Experience page |
| `client/src/components/Contact_new.vue` | Contact form |
| `client/src/services/ContactService.js` | Contact API |
| `Routes/auth.js` | Backend API routes |
| `Models/Contact.js` | Contact schema |
| `Models/Projects.js` | Project schema |
| `Models/Experiences.js` | Experience schema |

---

## 🛠️ Common Tasks

### Add a Project
1. Login as admin (`/login`)
2. Go to `/projects`
3. Click "+ Add New Project"
4. Fill form and click "Add Project"

### Add Experience
1. Login as admin (`/login`)
2. Go to `/experience`
3. Click "+ Add Experience"
4. Fill form and click "Add Experience"

### View Contact Messages
1. Login as admin (`/login`)
2. Go to `/contact`
3. Scroll to "Messages" section
4. Click "Mark Read" or "Delete"

### Change Backend URL
1. Edit `client/.env`
2. Change `VUE_APP_API_URL`
3. Stop dev server (Ctrl+C)
4. Restart with `npm run serve`

---

## 🔐 Admin Login

### First Time Setup
1. Go to `/register`
2. Create username and password
3. Account is created as admin (change in MongoDB if needed)

### Login
1. Go to `/login`
2. Enter username and password
3. System will remember you

---

## 🚨 Troubleshooting

### API Not Working
```bash
# Check backend is running
npm start  # from root directory

# Check API URL in client/.env
# Should be: http://localhost:5000 (local)
```

### Changes Not Showing
```bash
# Stop dev server (Ctrl+C)
# Update .env if needed
npm run serve  # restart
# Hard refresh: Ctrl+Shift+R
```

### Database Connection Error
```bash
# Check MONGO_URI in root .env
# Verify database credentials
# Check MongoDB Atlas network access
```

### Can't Login
```bash
# Verify user exists in MongoDB
# Check JWT_SECRET in root .env
# Clear localStorage: Open DevTools → Application → Storage → Clear All
```

---

## 📝 Component Overview

### New Components Location
```
client/src/components/
├── SiteHome_new.vue          # Landing page
├── ProjectsHome_new.vue      # Projects showcase
├── ExperienceHome_new.vue    # Experience timeline
└── Contact_new.vue           # Contact form
```

### What Each Component Does

**SiteHome_new.vue**
- Hero section with intro
- About me section
- Featured projects (auto-loaded)
- Skills showcase
- Experience preview
- Contact section

**ProjectsHome_new.vue**
- Display all projects
- Add/edit/delete projects (admin)
- Filter by featured
- Links to GitHub and live demos
- Technology tags

**ExperienceHome_new.vue**
- Timeline of work history
- Add/edit/delete experiences (admin)
- Company logos and dates
- Key responsibilities
- Technologies used

**Contact_new.vue**
- Contact form (public)
- Message inbox (admin)
- Mark read/delete messages
- Contact information

---

## 🎨 Customization Quick Tips

### Change Color Scheme
**Primary Color:** #667eea (purple)
**Secondary:** #764ba2 (darker)

Find and replace in component CSS files.

### Update Hero Text
Edit `SiteHome_new.vue`:
```vue
<h1>Your Name Here</h1>
<p class="tagline">Your Job Title</p>
```

### Add Skill Categories
Edit `SiteHome_new.vue` skills section:
```vue
<div class="skill-category">
  <h4>Your Skill Category</h4>
  <span class="skill-tag">Skill Name</span>
</div>
```

---

## 📦 Database Models

### Projects Collection
```javascript
{
  name: "Project Name",
  description: "Short description",
  longDescription: "Detailed description",
  imageUrl: "https://...",
  githubLink: "https://github.com/...",
  liveLink: "https://example.com",
  technologies: ["React", "Node.js"],
  featured: true,
  order: 0,
  createdAt: Date
}
```

### Experiences Collection
```javascript
{
  company: "Company Name",
  position: "Job Title",
  description: "What you did",
  responsibilities: ["Did this", "Did that"],
  technologies: ["Java", "SQL"],
  startDate: Date,
  endDate: Date,
  current: false,
  logo: "https://...",
  order: 0,
  createdAt: Date
}
```

### Contacts Collection
```javascript
{
  name: "Visitor Name",
  email: "email@example.com",
  subject: "Message Subject",
  message: "Message content",
  read: false,
  createdAt: Date
}
```

---

## 🚀 Deploy to Google Cloud

### Quick Deploy
```bash
# 1. Update production URL
# Edit client/.env
# VUE_APP_API_URL=https://your-project.uc.r.appspot.com

# 2. Build frontend
cd client && npm run build && cd ..

# 3. Deploy
gcloud app deploy app.yaml

# 4. Monitor
gcloud app logs read
gcloud app browse
```

---

## 📞 Contact Info (Update These)
- Email: sullivanali03@gmail.com
- LinkedIn: [Your LinkedIn URL]
- GitHub: [Your GitHub URL]
- Location: London, Ontario, Canada

---

## 📚 Full Documentation

For detailed info, see:
- **SETUP_GUIDE.md** - Feature overview and setup
- **PORTFOLIO_README.md** - Technical documentation
- **DEPLOYMENT_CHECKLIST.md** - Deployment steps
- **REDESIGN_SUMMARY.md** - What's new
- **CHANGES.md** - All files changed

---

## ✅ Checklist for Launch

- [ ] Added all your projects
- [ ] Added all your experiences
- [ ] Updated skills section
- [ ] Updated contact info
- [ ] Tested on mobile
- [ ] Tested admin features
- [ ] Changed `.env` URL to production
- [ ] Built frontend (`npm run build`)
- [ ] Deployed to Google Cloud
- [ ] Verified live site works

---

## 🎯 Success Indicators

✅ Landing page loads  
✅ Projects display correctly  
✅ Experience timeline shows  
✅ Contact form works  
✅ Admin login works  
✅ Admin can add/edit/delete  
✅ Mobile view is responsive  
✅ No console errors  

---

**Version:** 2.0 (Redesigned)  
**Last Updated:** February 2, 2026  
**Status:** ✅ Production Ready

Need help? Check the full documentation files!
