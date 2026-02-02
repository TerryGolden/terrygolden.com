# 🚀 Easy Deployment Guide - No Coding Required!

## What This Does
This guide will help you upload your Terry Golden website to Hostinger **without using any Terminal commands**. You'll just double-click a file and follow simple steps!

---

## ⚠️ ONE-TIME SETUP (Do This First!)

### Step 1: Make the Script Work
Before you can double-click the deployment file, you need to make it "executable" (this just means making it clickable).

**Here's how:**

1. **Open Terminal** (don't worry, you'll only type ONE command)
   - Press `Command + Space` on your keyboard
   - Type "Terminal" and press Enter
   - A window with text will open

2. **Type this command** (copy and paste it):
   ```
   chmod +x "/Users/sgarmaturen/SG Danmark Dropbox/Terry Goldenbeck/Mac (2)/Desktop/Terrygolden.com/deploy-to-hostinger.sh"
   ```

3. **Press Enter**

4. **Close Terminal** - You're done! You never need to do this again.

---

## 🎯 HOW TO DEPLOY YOUR WEBSITE (Every Time You Want to Upload)

### Step 1: Double-Click the Magic File
1. Go to your project folder on Desktop
2. Find the file called **`deploy-to-hostinger.sh`**
3. **Double-click it**
4. A window will open showing the build process
5. Wait until you see "SUCCESS! YOUR WEBSITE IS READY"
6. Press Enter to close the window

### Step 2: Upload to Hostinger
1. **Log in to Hostinger**
   - Go to https://www.hostinger.com
   - Click "Login" (top right)
   - Enter your email and password

2. **Open File Manager**
   - After logging in, find your website
   - Click "File Manager" button

3. **Go to the Right Folder**
   - You'll see a list of folders
   - Double-click the folder called **`public_html`**
   - This is where your website files go

4. **Delete Old Files** (if this isn't your first upload)
   - Select all files in public_html
   - Click the "Delete" button
   - Confirm deletion

5. **Upload New Files**
   - Click the "Upload" button (top of the page)
   - Click "Select Files"
   - Navigate to your Desktop → Terrygolden.com → **dist** folder
   - Press `Command + A` to select ALL files
   - Click "Open"
   - Wait for upload to complete (you'll see a progress bar)

6. **Done!**
   - Visit your website: www.terrygolden.com
   - Your changes are now live!

---

## 🆘 TROUBLESHOOTING

### "Permission Denied" when double-clicking
- You forgot Step 1 of the One-Time Setup
- Go back and run that Terminal command

### "Command not found: npm"
- You need to install Node.js first
- Download from: https://nodejs.org
- Install it, then restart your computer
- Try double-clicking the script again

### Script runs but shows errors
- Make sure you're connected to the internet
- Try double-clicking the script again
- If it still fails, contact support

### Website doesn't update after upload
- Clear your browser cache:
  - Press `Command + Shift + R` to hard refresh
- Wait 5-10 minutes for changes to appear
- Make sure you uploaded files to `public_html` folder

---

## 📝 QUICK SUMMARY

**Every time you want to update your website:**

1. ✅ Double-click `deploy-to-hostinger.sh`
2. ✅ Wait for "SUCCESS" message
3. ✅ Log in to Hostinger
4. ✅ Open File Manager → public_html
5. ✅ Delete old files
6. ✅ Upload all files from the `dist` folder
7. ✅ Visit your website!

**That's it! No coding required!** 🎉
