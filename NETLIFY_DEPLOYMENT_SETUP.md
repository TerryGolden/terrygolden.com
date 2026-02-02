# Netlify Automated Deployment Setup Guide

This guide will help you set up automated deployment from GitHub to Netlify with continuous deployment.

## What's Been Configured

✅ **netlify.toml** - Build configuration and deployment settings
✅ **GitHub Actions workflow** - Automated deployment on every push
✅ **_redirects file** - Proper SPA routing support

## Step-by-Step Setup Instructions

### 1. Create Netlify Account & Site

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your repository: `terrygolden.com` (or your repo name)
6. Netlify will auto-detect the settings from `netlify.toml`
7. Click "Deploy site"

### 2. Configure Custom Domain (terrygolden.com)

1. In your Netlify site dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter: `terrygolden.com`
4. Netlify will provide DNS records to configure

**DNS Configuration at your domain registrar:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [your-site-name].netlify.app
```

5. Enable HTTPS (automatic and free via Let's Encrypt)

### 3. Set Up GitHub Actions (Optional - Enhanced CI/CD)

The GitHub Actions workflow provides additional automation beyond Netlify's built-in deployment.

**Get your Netlify credentials:**

1. Go to Netlify → User Settings → Applications
2. Create a new Personal Access Token
3. Copy the token (NETLIFY_AUTH_TOKEN)

4. In your Netlify site dashboard → Site settings
5. Copy the Site ID (NETLIFY_SITE_ID)

**Add secrets to GitHub:**

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add two secrets:
   - Name: `NETLIFY_AUTH_TOKEN`, Value: [your token]
   - Name: `NETLIFY_SITE_ID`, Value: [your site ID]

### 4. Test Automated Deployment

1. Make a small change to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test automated deployment"
   git push origin main
   ```

3. Watch the deployment:
   - GitHub: Actions tab (GitHub Actions workflow)
   - Netlify: Deploys tab (deployment progress)

4. Your site will automatically rebuild and deploy!

## How It Works

### Netlify Built-in Deployment (Easiest)
- Automatically triggered on every push to main/master
- Uses settings from `netlify.toml`
- No additional configuration needed
- Free SSL certificate included

### GitHub Actions Deployment (Advanced)
- Runs tests and builds before deployment
- More control over the deployment process
- Can add additional steps (linting, testing, etc.)
- Provides deployment status in GitHub

## Configuration Files Explained

### netlify.toml
```toml
[build]
  publish = "dist"          # Vite output directory
  command = "npm run build" # Build command
```

### .github/workflows/deploy.yml
- Triggers on push to main/master
- Installs dependencies
- Builds the application
- Deploys to Netlify

### public/_redirects
- Ensures all routes work with React Router
- Redirects all requests to index.html

## Troubleshooting

### Build Fails
- Check Node version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Netlify dashboard

### Routes Not Working
- Ensure `_redirects` file is in the `public` folder
- Check that `netlify.toml` has the redirect rule

### Custom Domain Not Working
- DNS changes can take 24-48 hours to propagate
- Verify DNS records are correct
- Check domain settings in Netlify dashboard

### GitHub Actions Failing
- Verify secrets are set correctly in GitHub
- Check that NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN are valid
- Review workflow logs in GitHub Actions tab

## Environment Variables

If your app needs environment variables (API keys, etc.):

1. Netlify Dashboard → Site settings → Environment variables
2. Add your variables (e.g., `VITE_SUPABASE_URL`)
3. They'll be available during build time

## Benefits of This Setup

✅ **Automatic Deployments** - Push code, site updates automatically
✅ **Free SSL Certificate** - HTTPS enabled automatically
✅ **CDN Distribution** - Fast global delivery
✅ **Preview Deployments** - Every PR gets a preview URL
✅ **Rollback Support** - Easy to revert to previous versions
✅ **Custom Domain** - Use terrygolden.com with free SSL

## Next Steps

1. Complete Netlify setup (Step 1)
2. Configure custom domain (Step 2)
3. Push code to test automated deployment
4. Optionally set up GitHub Actions (Step 3)

Your website will be live at `terrygolden.com` with automatic deployments! 🚀
