# 🧹 How to Clear Your Cache - Super Easy Guide

**This guide is for complete beginners - no coding experience needed!**

---

## 📋 What You'll Need

- Your computer (Mac or Windows)
- Your web browser (Chrome, Safari, Firefox, etc.)
- The Terminal app (Mac) or Command Prompt (Windows)

---

## 🚀 QUICK METHOD (Recommended)

### Step 1: Open Terminal/Command Prompt

**On Mac:**
1. Press `Command + Space` on your keyboard
2. Type `Terminal`
3. Press `Enter` to open it

**On Windows:**
1. Press the `Windows key` on your keyboard
2. Type `cmd`
3. Click on "Command Prompt"

---

### Step 2: Go to Your Project Folder

In the Terminal/Command Prompt, type this command and press Enter:

```
cd path/to/your/project
```

**Example:** If your project is on your Desktop in a folder called "my-website":
- Mac: `cd ~/Desktop/my-website`
- Windows: `cd C:\Users\YourName\Desktop\my-website`

**💡 Tip:** You can also drag your project folder into the Terminal window and it will type the path for you!

---

### Step 3: Clear the Cache

**On Mac or Linux**, type this and press Enter:
```
npm run clean
```

**On Windows**, type this and press Enter:
```
npm run clean:win
```

---

### Step 4: Start Fresh

Now start your website with a clean slate:
```
npm run dev
```

---

### Step 5: Clear Your Browser Cache

This is **VERY IMPORTANT** - your browser also saves old versions!

**Chrome:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Command + Shift + Delete` (Mac)
2. Select "All time" from the dropdown
3. Check "Cached images and files"
4. Click "Clear data"

**Safari:**
1. Press `Command + Option + E`
2. Click "Empty"

**Firefox:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Command + Shift + Delete` (Mac)
2. Select "Everything" from the dropdown
3. Check "Cache"
4. Click "Clear Now"

---

### Step 6: Hard Refresh Your Page

After clearing browser cache, do a "hard refresh":

- **Chrome/Firefox (Windows):** Press `Ctrl + Shift + R`
- **Chrome/Firefox (Mac):** Press `Command + Shift + R`
- **Safari:** Press `Command + Option + R`

---

## ✅ All Done!

You should now see the latest version of your website!

---

## 🔧 ONE-COMMAND METHOD (Even Easier!)

If you want to clear cache AND start the server in one go:

**On Mac/Linux:**
```
npm run dev:fresh
```

This does everything automatically!

---

## 🆘 MANUAL METHOD (If Commands Don't Work)

If the commands above don't work, you can delete the cache folders manually:

### Step 1: Find and Delete These Folders

In your project folder, find and delete these folders (if they exist):
- `node_modules/.vite`
- `node_modules/.cache`
- `dist`
- `.vite`

**How to delete on Mac:**
1. Open Finder
2. Go to your project folder
3. Right-click the folder → "Move to Trash"

**How to delete on Windows:**
1. Open File Explorer
2. Go to your project folder
3. Right-click the folder → "Delete"

### Step 2: Clear Browser Cache

Follow Step 5 above.

### Step 3: Restart Your Server

In Terminal/Command Prompt:
```
npm run dev
```

---

## 🔄 NUCLEAR OPTION (Complete Reset)

If nothing else works, try this complete reset:

### Step 1: Stop the Server

In your Terminal, press `Ctrl + C` to stop the server.

### Step 2: Delete node_modules Completely

**On Mac:**
```
rm -rf node_modules
```

**On Windows:**
```
rmdir /s /q node_modules
```

### Step 3: Reinstall Everything

```
npm install
```

### Step 4: Start Fresh

```
npm run dev
```

### Step 5: Clear Browser Cache

Follow Step 5 from the Quick Method above.

---

## 📝 Summary Cheat Sheet

| What to Do | Mac Command | Windows Command |
|------------|-------------|-----------------|
| Clear Vite cache | `npm run clean` | `npm run clean:win` |
| Start fresh | `npm run dev:fresh` | `npm run clean:win && npm run dev` |
| Delete all packages | `rm -rf node_modules` | `rmdir /s /q node_modules` |
| Reinstall packages | `npm install` | `npm install` |
| Start server | `npm run dev` | `npm run dev` |

---

## ❓ Still Having Issues?

If you're still seeing old content:

1. **Try a different browser** - Sometimes one browser caches more aggressively
2. **Open in Incognito/Private mode** - This ignores all cached data
3. **Wait a few minutes** - Sometimes servers take time to update
4. **Check you're on the right URL** - Make sure you're viewing `localhost:5173` (or whatever port is shown in your terminal)

---

## 🎉 You Did It!

Clearing cache can be confusing, but you've got this! If you followed these steps, you should now be seeing the freshest version of your website.
