# How to Upload Your Website to Hostinger (Simple Guide)

## What You Need Before Starting
- Your Hostinger account login details
- Your website files (we'll prepare these first)

---

## STEP 1: Prepare Your Website Files

Before uploading, we need to create the final website files. Think of this like packing a suitcase before a trip.

### On Mac:
1. Open the **Terminal** app (find it by pressing Command + Space, then type "Terminal")
2. Copy and paste this command, then press Enter:
   ```
   cd ~/Desktop
   ```
3. Look for your project folder name and type:
   ```
   cd "Terrygolden.com"
   ```
   (If your folder has a different name, use that name instead)

4. Now type this command and press Enter:
   ```
   npm install
   ```
   (This downloads everything needed - will take 1-2 minutes)

5. After that finishes, type this and press Enter:
   ```
   npm run build
   ```
   (This creates your website files - takes about 30 seconds)

6. You should now see a new folder called **"dist"** in your project folder. This contains your website!

---

## STEP 2: Find Your Website Files

1. Open **Finder** (the smiling face icon)
2. Go to your Desktop
3. Open your "Terrygolden.com" folder
4. You should see a folder called **"dist"** - this is what we'll upload!
5. Open the "dist" folder
6. You'll see files like:
   - index.html
   - assets (folder)
   - Other files

**IMPORTANT:** Keep this Finder window open - you'll need it soon!

---

## STEP 3: Log Into Hostinger

1. Open your web browser (Chrome, Safari, etc.)
2. Go to: **https://www.hostinger.com**
3. Click the **"Login"** button (top right corner)
4. Enter your email and password
5. Click **"Sign In"**

---

## STEP 4: Open File Manager

1. After logging in, you'll see your dashboard
2. Look for your website/domain name and click on it
3. Find and click on **"File Manager"** (it might be under "Files" or "Website" section)
4. The File Manager will open in a new window

---

## STEP 5: Find the Right Folder

In the File Manager, you need to find where your website files go:

1. Look for a folder called **"public_html"** - double-click to open it
   - This is the main folder where your website lives
   - Everything you put here will appear on your website

2. **IMPORTANT:** If there are already files in public_html:
   - Select all files (click the checkbox at the top)
   - Click the **"Delete"** button
   - Confirm deletion
   - This clears out old files to make room for your new website

---

## STEP 6: Upload Your Website Files

Now the fun part - uploading your website!

### Method 1: Drag and Drop (Easiest)
1. Arrange your windows so you can see both:
   - Hostinger File Manager (showing public_html folder)
   - Finder window (showing contents of your "dist" folder)

2. In Finder, select ALL files inside the "dist" folder:
   - Click on the first file
   - Press Command + A (this selects everything)

3. Drag all the selected files from Finder into the File Manager window
   - Drop them into the public_html folder area

4. Wait for the upload to complete (you'll see a progress bar)

### Method 2: Using Upload Button
1. In File Manager, make sure you're inside the "public_html" folder
2. Click the **"Upload"** button (usually at the top)
3. Click **"Select Files"**
4. Navigate to your Desktop → Terrygolden.com → dist folder
5. Select ALL files and folders inside "dist"
6. Click **"Open"**
7. Wait for upload to complete

---

## STEP 7: Check Your Website

1. Wait 2-3 minutes after upload completes
2. Open a new browser tab
3. Type your website address (e.g., www.terrygolden.com)
4. Press Enter
5. Your website should now appear! 🎉

---

## Troubleshooting

### "Command not found" error in Terminal
- You need to install Node.js first
- Go to: https://nodejs.org
- Download and install the LTS version
- Then start over from Step 1

### Website shows "Index of /" or blank page
- Make sure you uploaded files FROM INSIDE the "dist" folder
- The "index.html" file must be directly in public_html
- NOT in a subfolder like public_html/dist/

### Files won't upload
- Check your internet connection
- Try using Method 2 (Upload Button) instead of drag-and-drop
- Make sure you have enough storage space in Hostinger

### Website still shows old version
- Clear your browser cache (Press Command + Shift + R on Mac)
- Wait a few more minutes for changes to appear
- Try opening in a private/incognito browser window

---

## Need to Update Your Website Later?

Whenever you make changes:
1. Go back to Terminal
2. Navigate to your project folder (Step 1, commands 2-3)
3. Run: `npm run build`
4. Upload the NEW files from the "dist" folder to Hostinger
5. Replace the old files when asked

---

## Quick Checklist
- [ ] Created "dist" folder using Terminal commands
- [ ] Logged into Hostinger
- [ ] Opened File Manager
- [ ] Found public_html folder
- [ ] Deleted old files (if any)
- [ ] Uploaded ALL files from inside "dist" folder
- [ ] Waited 2-3 minutes
- [ ] Checked website in browser

---

**Questions?** If something isn't working, double-check that:
- You uploaded files from INSIDE the "dist" folder (not the dist folder itself)
- The index.html file is directly in public_html
- All files finished uploading (check for any error messages)
