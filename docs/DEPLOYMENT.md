# FTTG AutoTech - Deployment Guide

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended - Current Setup)

#### ✅ Advantages:
- **Free hosting**
- **Automatic deployments** from Git pushes
- **Global CDN** for fast loading
- **HTTPS included**
- **Custom domain support**
- **Zero maintenance**

#### 📋 Requirements:
- GitHub repository (✅ Already set up)
- Forms configured with Formspree (✅ Already done)
- Static files only (✅ Compatible)

#### 🔧 Setup Steps:
1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
   - Click "Save"

3. **Wait for deployment** (2-10 minutes)
   - Check Actions tab for build status
   - Visit your site at `https://username.github.io/repository-name`

#### 🌐 Custom Domain (Optional):
1. Add `CNAME` file with your domain
2. Configure DNS with your domain provider
3. Enable "Enforce HTTPS" in settings

---

### Option 2: Vercel (For Twilio Integration)

#### ✅ Advantages:
- **Serverless functions** support
- **Twilio integration** possible
- **Fast deployments**
- **Preview deployments**
- **Free tier available**

#### 📋 Requirements:
- Vercel account
- Migrate serverless functions
- Environment variables setup

#### 🔧 Setup Steps:
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json`**:
   ```json
   {
     "functions": {
       "backend/server.js": {
         "runtime": "@vercel/node"
       }
     },
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "/backend/server.js"
       }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

---

### Option 3: Netlify (Alternative)

#### ✅ Advantages:
- **Netlify Functions** for backend
- **Form handling** built-in
- **Deploy previews**
- **Free tier**

#### 🔧 Setup Steps:
1. Connect GitHub repository
2. Build settings:
   - Build command: (none needed)
   - Publish directory: `/`
3. Add environment variables
4. Deploy

---

### Option 4: Traditional Hosting

#### For VPS/Shared Hosting:
1. **Upload files** via FTP/SFTP
2. **Configure web server** (Apache/Nginx)
3. **Set up SSL certificate**
4. **Configure domains**

---

## 🔄 Current Deployment Status

Your project is **optimized for GitHub Pages**:

### ✅ Ready Files:
- `index.html` - Main website
- `consent.html` - Consent form
- `css/` - All stylesheets
- `js/` - JavaScript files (GitHub Pages compatible)
- `json/` - Configuration files
- `image/` - Website assets

### ❌ Not Deployed (GitHub Pages):
- `backend/` - Server files (for other platforms)
- `node_modules/` - Dependencies
- Development files

### 📧 Communication Method:
- **Forms**: Formspree integration
- **Notifications**: Email-based
- **Fallbacks**: Phone number display

---

## 🎯 Recommended Workflow

1. **Start with GitHub Pages** (current setup)
2. **Test all functionality**
3. **Monitor form submissions**
4. **Consider migration** to Vercel/Netlify only if you need:
   - Automated SMS notifications
   - Server-side processing
   - Advanced integrations

Your current setup provides **95% of the functionality** with **0% of the complexity**!
