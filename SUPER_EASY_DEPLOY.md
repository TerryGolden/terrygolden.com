# 🚀 SUPER EASY AUTO-DEPLOY GUIDE
## GitHub + Netlify = Your Site Updates Automatically Forever!

**Time needed:** About 15-20 minutes (one-time setup)
**Skill level:** Complete beginner - no coding experience needed!
**Cost:** 100% FREE

---

## 📋 WHAT YOU'LL NEED

Before starting, make sure you have:
- [ ] Your project folder (the Terrygolden.com folder on your computer)
- [ ] An email address
- [ ] About 15-20 minutes

---

## 🎯 THE BIG PICTURE

Here's what we're doing:
1. **GitHub** = A place to store your website code online (like Google Drive for code)
2. **Netlify** = A service that turns your code into a live website
3. **Connect them** = Every time you update GitHub, Netlify automatically updates your website!

---

# PART 1: CREATE A GITHUB ACCOUNT
*Skip this if you already have a GitHub account*

### Step 1.1: Go to GitHub
1. Open your web browser (Chrome, Safari, Firefox, etc.)
2. Go to: **https://github.com/signup**

### Step 1.2: Create Your Account
1. **Enter your email** → Click "Continue"
2. **Create a password** → Click "Continue"
3. **Choose a username** (like "terrygolden" or your name) → Click "Continue"
4. **Email preferences** → Type "n" for no (or "y" if you want emails) → Click "Continue"
5. **Verify you're human** → Solve the puzzle
6. Click **"Create account"**

### Step 1.3: Verify Your Email
1. Check your email inbox
2. Find the email from GitHub
3. Click the verification link OR enter the code they sent you

✅ **Done!** You now have a GitHub account!

---

# PART 2: DOWNLOAD GITHUB DESKTOP
*This is a free app that makes GitHub easy - no typing commands!*

### Step 2.1: Download the App
1. Go to: **https://desktop.github.com/**
2. Click the big **"Download for Windows"** (or Mac) button
3. Wait for the download to finish

### Step 2.2: Install the App
**On Windows:**
1. Find the downloaded file (usually in your Downloads folder)
2. It's called something like `GitHubDesktopSetup.exe`
3. Double-click it
4. Wait for it to install (takes about 1 minute)

**On Mac:**
1. Find the downloaded file (usually in your Downloads folder)
2. It's called something like `GitHubDesktop.zip`
3. Double-click to unzip it
4. Drag "GitHub Desktop" to your Applications folder
5. Double-click to open it

### Step 2.3: Sign In to GitHub Desktop
1. When GitHub Desktop opens, click **"Sign in to GitHub.com"**
2. A browser window will open
3. Click **"Authorize desktop"**
4. You might need to enter your GitHub password
5. Click **"Open GitHub Desktop"** when asked

✅ **Done!** GitHub Desktop is ready!

---

# PART 3: UPLOAD YOUR PROJECT TO GITHUB
*This puts your website code online*

### Step 3.1: Add Your Project to GitHub Desktop
1. In GitHub Desktop, click **"File"** (top menu)
2. Click **"Add Local Repository..."**
3. Click **"Choose..."** button
4. Navigate to your **Terrygolden.com** folder and select it
5. Click **"Select Folder"** (Windows) or **"Open"** (Mac)

### ⚠️ If You See "This directory does not appear to be a Git repository"
That's okay! Click **"create a repository"** link, then:
1. **Name:** `terrygolden-website` (or any name you want)
2. **Description:** `My DJ website` (optional)
3. **Local Path:** Should already show your folder
4. Leave other options as default
5. Click **"Create Repository"**

### Step 3.2: Publish to GitHub (Upload Your Code)
1. You should now see your project in GitHub Desktop
2. Look at the top - you'll see a button that says **"Publish repository"**
3. Click **"Publish repository"**
4. A popup appears:
   - **Name:** Keep it as is (or change to `terrygolden-website`)
   - **Description:** Optional - add if you want
   - **Keep this code private:** ✅ CHECK THIS BOX (keeps your code private)
5. Click **"Publish Repository"**
6. Wait about 30 seconds...

✅ **Done!** Your code is now on GitHub!

### Step 3.3: Verify It Worked
1. Go to: **https://github.com** in your browser
2. Sign in if needed
3. You should see your repository listed!
4. Click on it to see your files

---

# PART 4: CREATE A NETLIFY ACCOUNT
*Skip this if you already have a Netlify account*

### Step 4.1: Go to Netlify
1. Open your browser
2. Go to: **https://app.netlify.com/signup**

### Step 4.2: Sign Up with GitHub (EASIEST!)
1. Click **"GitHub"** button (this connects everything automatically!)
2. Click **"Authorize netlify"**
3. You're now signed in!

✅ **Done!** You have a Netlify account connected to GitHub!

---

# PART 5: CONNECT YOUR WEBSITE TO NETLIFY
*This is where the magic happens!*

### Step 5.1: Add a New Site
1. In Netlify, click **"Add new site"** (or "New site from Git")
2. Click **"Import an existing project"**

### Step 5.2: Connect to GitHub
1. Click **"Deploy with GitHub"**
2. If asked, click **"Authorize Netlify"**
3. You'll see a list of your GitHub repositories

### Step 5.3: Select Your Repository
1. Find **"terrygolden-website"** (or whatever you named it)
2. Click on it

### Step 5.4: Configure Build Settings
Netlify should auto-detect these, but verify:
- **Branch to deploy:** `main` (or `master`)
- **Build command:** `npm run build`
- **Publish directory:** `dist`

*These should already be filled in from your netlify.toml file!*

### Step 5.5: Deploy!
1. Click **"Deploy site"** (or "Deploy terrygolden-website")
2. **WAIT** - This takes 2-5 minutes the first time!
3. You'll see "Site deploy in progress..."
4. When done, you'll see a green "Published" status

### Step 5.6: View Your Live Site!
1. Look at the top of the page
2. You'll see a URL like: `random-words-123456.netlify.app`
3. Click it to see your live website!

✅ **CONGRATULATIONS!** Your website is LIVE on the internet!

---

# PART 6: CONNECT YOUR CUSTOM DOMAIN (terrygolden.com)
*Make your site accessible at your own domain*

### Step 6.1: Add Your Domain in Netlify
1. In Netlify, go to **"Site settings"** (or click your site name)
2. Click **"Domain management"** in the left sidebar
3. Click **"Add custom domain"**
4. Type: `terrygolden.com`
5. Click **"Verify"**
6. Click **"Add domain"**

### Step 6.2: Also Add the WWW Version
1. Click **"Add domain alias"**
2. Type: `www.terrygolden.com`
3. Click **"Add"**

### Step 6.3: Set Up DNS at Hostinger
*You need to tell your domain to point to Netlify*

1. Log in to **Hostinger** (where you bought your domain)
2. Go to **Domains** → Click on **terrygolden.com**
3. Click **"DNS / Nameservers"** (or "Manage DNS")
4. **Delete** any existing A records or CNAME records for @ and www

### Step 6.4: Add These DNS Records

**Record 1 - For terrygolden.com (no www):**
| Field | Value |
|-------|-------|
| Type | `A` |
| Name | `@` |
| Points to | `75.2.60.5` |
| TTL | `Auto` or `3600` |

Click **"Add Record"**

**Record 2 - For www.terrygolden.com:**
| Field | Value |
|-------|-------|
| Type | `CNAME` |
| Name | `www` |
| Points to | `YOUR-SITE-NAME.netlify.app` |
| TTL | `Auto` or `3600` |

*Replace YOUR-SITE-NAME with your actual Netlify site name (like `earnest-kitsune-f7755c`)*

Click **"Add Record"**

### Step 6.5: Wait for DNS to Update
- DNS changes take **5 minutes to 48 hours** to work worldwide
- Usually works within **15-30 minutes**
- Be patient!

### Step 6.6: Enable HTTPS (Free SSL)
1. Back in Netlify → Domain management
2. Scroll down to **"HTTPS"**
3. Click **"Verify DNS configuration"**
4. Once verified, click **"Provision certificate"**
5. Wait a minute, and you'll have a secure site!

✅ **Done!** Your site is now at https://terrygolden.com!

---

# 🔄 HOW TO UPDATE YOUR WEBSITE (Forever!)

Now that everything is set up, updating is SUPER EASY:

### When You Make Changes to Your Website:

1. **Make your changes** in your local project folder

2. **Open GitHub Desktop**
   - You'll see your changes listed on the left

3. **Commit your changes:**
   - At the bottom left, type a short description (like "Updated photos")
   - Click **"Commit to main"**

4. **Push to GitHub:**
   - Click **"Push origin"** (top button)
   - Wait a few seconds...

5. **Automatic Deploy!**
   - Netlify detects the change automatically
   - Your site updates in 1-2 minutes
   - No need to do anything else!

### That's it! Just:
1. Make changes
2. Commit in GitHub Desktop
3. Push
4. Wait 1-2 minutes
5. Your live site is updated!

---

# 🆘 TROUBLESHOOTING

### "Build failed" in Netlify
- Click on the failed deploy to see the error
- Usually it's a typo in your code
- Fix the error, commit, and push again

### "DNS not configured" in Netlify
- Double-check your DNS records in Hostinger
- Make sure you used the exact values
- Wait longer (up to 48 hours)

### "Repository not found" in Netlify
- Make sure you authorized Netlify to access GitHub
- Try disconnecting and reconnecting GitHub

### Site shows old version
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait a few more minutes for deploy to finish

### Can't see changes in GitHub Desktop
- Make sure you saved your files!
- Try clicking "Fetch origin" button

---

# 📞 STILL STUCK?

Tell me:
1. What step are you on?
2. What do you see on your screen?
3. What error message (if any)?

I'll help you through it!

---

# 🎉 SUMMARY

What you accomplished:
- ✅ GitHub account created
- ✅ GitHub Desktop installed
- ✅ Code uploaded to GitHub
- ✅ Netlify account created
- ✅ Site deployed automatically
- ✅ Custom domain connected
- ✅ HTTPS enabled

**From now on:** Just make changes → commit → push → done!

Your website will update automatically forever! 🚀
