# 🚀 Automated Deployment to Hostinger

This guide shows you how to deploy your website with **ONE DOUBLE-CLICK** instead of manual uploads!

---

## 📋 What You'll Need

From your Hostinger account, you need:
1. **FTP Host** (looks like: ftp.yourdomain.com)
2. **FTP Username** (usually your email or a username)
3. **FTP Password** (the password you created)
4. **Remote Directory** (usually `/public_html`)

---

## 🔧 ONE-TIME SETUP (5 Minutes)

### Step 1: Create Your Configuration File

1. Find the file called `ftp-config.example.json` in your project folder
2. **Right-click** on it → **Duplicate** (or Copy & Paste)
3. Rename the copy to `ftp-config.json` (remove ".example")
4. **Right-click** on `ftp-config.json` → **Open With** → **TextEdit** (Mac) or **Notepad** (Windows)

### Step 2: Fill In Your Hostinger Details

Replace the placeholder text with your actual Hostinger information:

```json
{
  "host": "ftp.yourdomain.com",
  "user": "your-actual-username",
  "password": "your-actual-password",
  "remoteDir": "/public_html",
  "port": 21
}
```

**Example with real data:**
```json
{
  "host": "ftp.terrygolden.com",
  "user": "terry@terrygolden.com",
  "password": "MySecurePass123!",
  "remoteDir": "/public_html",
  "port": 21
}
```

**Save and close** the file.

### Step 3: Make the Script Executable (Mac/Linux Only)

1. Open **Terminal**
2. Type: `cd ` (with a space after cd)
3. Drag your project folder into Terminal
4. Press **Enter**
5. Type: `chmod +x auto-deploy.sh`
6. Press **Enter**

**Windows users:** Skip this step!

---

## 🎯 HOW TO DEPLOY (Every Time)

### Mac/Linux:
1. **Double-click** `auto-deploy.sh`
2. Wait for the script to finish
3. Your website is live! ✅

### Windows:
1. **Right-click** `auto-deploy.sh`
2. Select **Open with Git Bash** (or WSL)
3. Wait for the script to finish
4. Your website is live! ✅

---

## 📊 What Happens Automatically

The script does ALL of this for you:

1. ✅ Checks if you have the config file
2. ✅ Installs any missing dependencies
3. ✅ Builds your website (creates the `dist` folder)
4. ✅ Connects to your Hostinger FTP
5. ✅ Uploads all files automatically
6. ✅ Shows you success/error messages

**Total time:** 2-5 minutes (depending on internet speed)

---

## 🔒 Security Notes

- `ftp-config.json` contains your password
- This file is **ignored by Git** (won't be uploaded to GitHub)
- Keep this file **private** and **never share** it
- If you share your project, delete `ftp-config.json` first

---

## 🆘 Troubleshooting

### "ftp-config.json not found"
→ You need to create it from the example file (see Step 1)

### "Build failed"
→ There's an error in your code. Check the error message and fix it first.

### "Upload failed"
→ Check your FTP credentials in `ftp-config.json`. Make sure they're correct.

### "lftp command not found" (Mac)
→ Install Homebrew, then run: `brew install lftp`

### "Permission denied" (Mac/Linux)
→ Run: `chmod +x auto-deploy.sh` in Terminal

### Windows: "bash: command not found"
→ Install Git Bash from: https://git-scm.com/downloads

---

## 🎉 Benefits of Automated Deployment

- ⚡ **10x Faster** than manual upload
- 🎯 **No mistakes** - script does everything correctly
- 🔄 **Consistent** - same process every time
- 🚀 **One click** - that's it!

---

## 📞 Need Help?

If the automated script doesn't work, you can always use the manual method:
- See `EASY_DEPLOYMENT_GUIDE.md` for the double-click build script
- See `HOSTINGER_UPLOAD_GUIDE.md` for manual File Manager upload

---

**Happy deploying! 🚀**
