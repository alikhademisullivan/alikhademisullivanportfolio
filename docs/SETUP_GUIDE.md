# 🚀 New Portfolio Setup Guide

This guide will walk you through using your completely redesigned portfolio.

## What's New? ✨

Your portfolio has been completely redesigned with:

- ✅ Modern, professional landing page with hero section
- ✅ Featured projects showcase with filtering
- ✅ Professional experience timeline
- ✅ Skills showcase organized by category
- ✅ Contact form for visitors
- ✅ Admin panel to manage content
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Professional styling and animations
- ✅ Easy environment variable switching (local vs production)

## Quick Start

### Step 1: Configure Environment Variables

The portfolio automatically switches between local and production APIs based on `.env` files.

**For Local Development (Testing):**

Edit `client/.env`:
```
VUE_APP_API_URL=http://localhost:5000
```

**For Production (Google Cloud):**

Edit `client/.env`:
```
VUE_APP_API_URL=https://trim-mix-436100-b6.uc.r.appspot.com
```

⚠️ **IMPORTANT:** After changing `.env`, you MUST restart your dev server for changes to take effect.

### Step 2: Start the Backend Server

In a terminal from the **root directory**:
```bash
npm start
# or
node Server.js
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### Step 3: Start the Frontend Server

In a **new terminal** from the **client directory**:
```bash
cd client
npm run serve
```

You should see:
```
App running at:
  Local:   http://localhost:8080/
```

### Step 4: Open Your Portfolio

Visit [http://localhost:8080](http://localhost:8080) in your browser.

## Key Features to Explore

### 📄 Landing Page (Home)
- Clean hero section with call-to-action buttons
- About me section with statistics
- Featured projects preview
- Skills showcase
- Experience timeline
- Contact section

### 🎨 Projects Page
- Showcase of all your projects
- Filter by featured projects
- Project cards with images, descriptions, tech stack
- Links to GitHub and live demos
- Admin: Add, edit, delete projects

### 💼 Experience Page
- Timeline of your work experience
- Company logos and dates
- Key responsibilities
- Technologies used
- Admin: Add, edit, delete experiences

### 📧 Contact Page
- Contact form for visitors
- Contact information sidebar
- Admin: View all contact messages, mark as read, delete
- Success notifications

### 🔐 Admin Panel
- Login/Register for admin users
- Manage all portfolio content
- View contact messages
- Secure access only for admins

## Adding Content

### Add a Project

1. Make sure you're logged in as admin
2. Go to `/projects`
3. Click "+ Add New Project"
4. Fill in the form:
   - **Project Name**: Name of your project
   - **Short Description**: 1-2 sentences
   - **Long Description**: Detailed description
   - **Technologies**: React, Node.js, MongoDB (comma-separated)
   - **GitHub Link**: Link to your GitHub repo
   - **Live Demo Link**: Deployed website link
   - **Image URL**: Link to project screenshot
   - **Featured**: Check to show on landing page
5. Click "Add Project"

### Add Experience

1. Make sure you're logged in as admin
2. Go to `/experience`
3. Click "+ Add Experience"
4. Fill in the form:
   - **Company Name**: Where you worked
   - **Position**: Job title
   - **Description**: What you did
   - **Technologies**: Skills used (comma-separated)
   - **Start Date**: When you started
   - **End Date**: When you left (optional)
   - **Currently Working Here**: Check if still there
   - **Logo URL**: Company logo
5. Click "Add Experience"

### Manage Contact Messages

1. Go to `/contact` while logged in as admin
2. View all incoming messages at the bottom
3. Click "Mark Read" to mark as read
4. Click "Delete" to remove messages

## Environment Variable Quick Reference

| Scenario | File | Value |
|----------|------|-------|
| **Local Testing** | `client/.env` | `http://localhost:5000` |
| **Production Build** | `client/.env` | `https://trim-mix-436100-b6.uc.r.appspot.com` |
| **Backend** | Root `.env` | Set in `.env` file |

## New Routes Available

| Route | Purpose | Protected? |
|-------|---------|-----------|
| `/` | Landing page | No |
| `/projects` | Projects showcase | No (Admin features protected) |
| `/experience` | Experience timeline | No (Admin features protected) |
| `/contact` | Contact form & messages | No (Messages protected) |
| `/login` | Admin login | No |
| `/register` | Admin registration | No |
| `/logout` | Logout | Yes |
| `/admin` | Admin dashboard | Yes |

## Database Models (Updated)

The database has been updated with new, more detailed models:

### Projects (Enhanced)
```
✅ name: string
✅ description: string (short version)
✅ longDescription: string (detailed)
✅ imageUrl: string
✅ githubLink: string
✅ liveLink: string (for live demos)
✅ technologies: array (React, Node.js, etc.)
✅ featured: boolean (shows on home page)
✅ order: number (sort order)
✅ createdAt: date
```

### Experiences (Enhanced)
```
✅ company: string
✅ position: string (job title)
✅ description: string
✅ responsibilities: array
✅ technologies: array
✅ startDate: date
✅ endDate: date (optional)
✅ current: boolean (still working)
✅ logo: string (company logo URL)
✅ order: number
✅ createdAt: date
```

### Contacts (New!)
```
✅ name: string
✅ email: string
✅ subject: string
✅ message: string
✅ read: boolean
✅ createdAt: date
```

## Styling & Customization

All components use modern CSS with:
- **Gradient backgrounds**: #667eea → #764ba2
- **Responsive grids**: Auto-fit layouts
- **Smooth animations**: Hover effects, transitions
- **Professional spacing**: Consistent padding/margins
- **Mobile-first**: Optimized for all screen sizes

### Changing Colors

Edit the CSS in components to change the color scheme:
- Primary: `#667eea`
- Secondary: `#764ba2`
- Light backgrounds: `#f8f9fa`
- Text: `#333` (dark), `#666` (medium), `#999` (light)

## Common Issues & Solutions

### ❌ "Connection refused" error
**Problem**: API calls to localhost:5000 failing
**Solution**: 
1. Make sure backend is running (`npm start` in root)
2. Check `client/.env` has correct URL
3. Restart both servers

### ❌ Changes not appearing
**Problem**: Updated `.env` but no change
**Solution**: 
1. Stop the dev server (Ctrl+C)
2. Restart with `npm run serve`
3. Hard refresh browser (Ctrl+Shift+R)

### ❌ Can't login to admin
**Problem**: Login not working
**Solution**:
1. Check JWT_SECRET in root `.env`
2. Verify user exists in MongoDB
3. Check browser console for errors

### ❌ Images not loading
**Problem**: Project images show broken
**Solution**:
1. Verify imageUrl is a valid URL
2. Check the URL works in browser
3. For local testing, use full URLs (not relative paths)

## Next Steps

1. **Add your projects** - Go to `/projects` and add your best work
2. **Add your experience** - Go to `/experience` and showcase your career
3. **Update your skills** - Edit the Skills section in `SiteHome_new.vue`
4. **Customize colors** - Change the color scheme to match your brand
5. **Deploy to Google Cloud** - Follow deployment guide
6. **Add a domain** - Point your domain to the GCP app

## Files Modified/Created

### New Components
- `SiteHome_new.vue` - Modern landing page
- `ProjectsHome_new.vue` - Projects showcase
- `ExperienceHome_new.vue` - Experience timeline
- `Contact_new.vue` - Contact form & admin panel

### New Services
- `ContactService.js` - Handle contact messages

### New Models
- `Contact.js` - Contact message schema

### Updated Models
- `Projects.js` - Enhanced with more fields
- `Experiences.js` - Enhanced with more fields

### Updated Routes
- `Routes/auth.js` - Added contact endpoints

### Updated Router
- `client/src/router/index.js` - Added contact route

## Support & Questions

If you need help:
1. Check the `PORTFOLIO_README.md` for detailed documentation
2. Review the component files for implementation details
3. Check browser console for error messages
4. Verify MongoDB connection and data

## You're All Set! 🎉

Your portfolio is ready to go. Start adding content and customize it to showcase your amazing work!

Happy coding! 💻
