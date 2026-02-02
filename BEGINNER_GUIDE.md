# 🎯 SUPER SIMPLE BEGINNER GUIDE
## For People Who Have Never Done This Before

---

## STEP 1: Install Node.js (One Time Only)

Before anything works, you need Node.js installed:

1. **Open Safari or Chrome**
2. **Go to:** https://nodejs.org
3. **Click the big green button** that says "LTS" (the recommended version)
4. **Open the downloaded file** (it will be in your Downloads folder)
5. **Follow the installer** - just keep clicking "Continue" and "Agree"
6. **Restart your computer** after installation

**How to check if it worked:**
1. Open Terminal (Command + Space, type "Terminal", press Enter)
2. Type: `node --version`
3. Press Enter
4. If you see a number like "v20.10.0" - it worked!
5. Close Terminal

---

## STEP 2: Find Your Project Folder (THE CORRECT WAY)

The error "No such file or directory" means the folder path is wrong. Here's how to fix it:

1. **Open Finder** (blue smiley face in your dock)
2. **Find your Terrygolden.com folder** (search for it if needed)
3. **Right-click on the folder**
4. **Hold the Option key** on your keyboard
5. **Click "Copy as Pathname"**

Now you have the correct path copied!

---

## STEP 3: Build Your Website

1. **Open Terminal**
   - Press `Command + Space`
   - Type "Terminal"
   - Press Enter

2. **Type:** `cd ` (with a space after cd)

3. **Paste the path** (Command + V) - it will show your correct path

4. **Press Enter**

5. **Install dependencies** (first time only)
   - Type: `npm install`
   - Press Enter
   - Wait 2-5 minutes (you'll see lots of text scrolling)

6. **Build the website**
   - Type: `npm run build`
   - Press Enter
   - Wait about 30 seconds
   - When you see "built in X seconds" - it worked!

7. **You're done!** 
   - A folder called "dist" now exists with your website files
   - Close Terminal

---

## STEP 4: Upload to Hostinger

1. **Go to Hostinger**
   - Open your web browser
   - Go to: https://www.hostinger.com
   - Click "Login" (top right corner)
   - Enter your email and password

2. **Find File Manager**
   - After logging in, you'll see your hosting dashboard
   - Look for "File Manager" and click it
   - (It might be under "Websites" → your domain → "File Manager")

3. **Open public_html folder**
   - In File Manager, you'll see a list of folders
   - Double-click the folder called `public_html`
   - This is where your website files need to go

4. **Delete old files** (if you've uploaded before)
   - Click one file, then press `Command + A` to select all
   - Click "Delete" button
   - Confirm deletion

5. **Upload your new website**
   - Click the "Upload" button (usually at the top)
   - Click "Select Files" or drag files in
   - Navigate to your project folder → `dist` folder
   - Select ALL files inside the dist folder
   - Click "Open" or "Upload"
   - Wait for upload to complete

6. **Visit your website!**
   - Open a new browser tab
   - Go to: www.terrygolden.com
   - Your website should be live!

---

## 🆘 COMMON PROBLEMS & SOLUTIONS

### "No such file or directory"
**Problem:** The path to your project folder is wrong.
**Solution:** 
1. Open Finder
2. Find your Terrygolden.com folder
3. Right-click on it
4. Hold the `Option` key and click "Copy as Pathname"
5. Use that path instead

### "command not found: npm"
**Problem:** Node.js is not installed.
**Solution:** Go back to Step 1 and install Node.js.

### "Permission denied"
**Problem:** The script isn't allowed to run.
**Solution:** Run this in Terminal:
```
chmod +x deploy-to-hostinger.sh
```

### Website looks old after uploading
**Problem:** Your browser is showing a cached version.
**Solution:** 
- Press `Command + Shift + R` to hard refresh
- Or wait 10 minutes and try again

### "dist folder is empty" or doesn't exist
**Problem:** The build failed.
**Solution:** 
1. Open Terminal
2. Go to your project folder (cd command)
3. Type `npm run build`
4. Look for error messages
5. The dist folder should appear after a successful build

---

## 📞 NEED MORE HELP?

If you're stuck, you can:
1. Take a screenshot of the error message
2. Note which step you're on
3. Contact your web developer or Hostinger support

---

## 🎉 QUICK REFERENCE CARD

**Every time you want to update your website:**

```
1. Open Terminal
2. cd (space) then paste your folder path
3. npm run build
4. Upload dist folder contents to Hostinger public_html
5. Done!
```
