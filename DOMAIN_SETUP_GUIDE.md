# Domain Setup Guide: terrygolden.com

## Overview
This guide will help you connect your **terrygolden.com** domain (registered with Hostinger) to your React application.

## Current DNS Configuration
Your domain currently has:
- **A Record**: `@` → `62.72.37.31` (points to Hostinger hosting)
- **AAAA Record**: `@` → `2a02:4780:27:1144:0:29fb:25e3:2`
- **CNAME**: `www` → `terrygolden.com`
- **MX Records**: Google Workspace email (will be preserved)
- **TXT Records**: SPF/DKIM for email (will be preserved)

---

## Step 1: Identify Your Hosting Platform

First, determine where your React app is deployed:

### Option A: Netlify
1. Log into [Netlify](https://app.netlify.com)
2. Go to your site dashboard
3. Click **Domain Settings** → **Add custom domain**
4. Enter `terrygolden.com` and `www.terrygolden.com`
5. Netlify will provide DNS records to configure

### Option B: Vercel
1. Log into [Vercel](https://vercel.com)
2. Go to your project → **Settings** → **Domains**
3. Add `terrygolden.com` and `www.terrygolden.com`
4. Vercel will show required DNS configuration

### Option C: Cloudflare Pages
1. Log into Cloudflare
2. Go to **Pages** → Your project → **Custom domains**
3. Add your domain
4. Follow Cloudflare's DNS instructions

---

## Step 2: Update Hostinger DNS Settings

### Login to Hostinger
1. Go to [Hostinger](https://hpanel.hostinger.com)
2. Navigate to **Domains** → **terrygolden.com**
3. Click **DNS / Name Servers**

### DNS Configuration (Choose based on your platform)

#### For Netlify:
**Delete existing A and AAAA records, then add:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 3600 |
| CNAME | www | [your-site].netlify.app | 3600 |

**Keep all existing MX and TXT records for email!**

#### For Vercel:
**Delete existing A and AAAA records, then add:**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

**Keep all existing MX and TXT records for email!**

#### For Cloudflare Pages:
**Update nameservers to Cloudflare's (provided in your Cloudflare dashboard)**

---

## Step 3: Preserve Email Functionality

**CRITICAL**: Do NOT delete these records:

### MX Records (Google Workspace)
- `aspmx.l.google.com` (Priority 1)
- `alt1.aspmx.l.google.com` (Priority 5)
- `alt2.aspmx.l.google.com` (Priority 5)
- `alt3.aspmx.l.google.com` (Priority 10)
- `alt4.aspmx.l.google.com` (Priority 10)

### TXT Records
- SPF record: `v=spf1 include:_spf.google.com ~all`
- DKIM records (any starting with `google._domainkey`)
- Any other TXT records for email verification

---

## Step 4: Verify Configuration

### DNS Propagation
- DNS changes take 24-48 hours to fully propagate
- Check status: [whatsmydns.net](https://www.whatsmydns.net)
- Enter `terrygolden.com` to see global propagation

### Test Your Site
1. Wait 1-2 hours for initial propagation
2. Visit `https://terrygolden.com` and `https://www.terrygolden.com`
3. Both should load your React application
4. Test email to ensure it still works

---

## Step 5: SSL Certificate

Most platforms auto-provision SSL certificates:

### Netlify
- Automatically provisions Let's Encrypt SSL
- Check: Domain Settings → HTTPS
- Force HTTPS redirect in settings

### Vercel
- Automatic SSL via Let's Encrypt
- Check: Project Settings → Domains
- SSL should show as "Active"

### Cloudflare
- SSL/TLS settings in dashboard
- Set to "Full" or "Full (strict)"

---

## Troubleshooting

### Site Not Loading
- **Check DNS propagation**: Use whatsmydns.net
- **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
- **Verify DNS records**: Use `nslookup terrygolden.com`

### Email Stopped Working
- **Verify MX records**: Use MXToolbox.com
- **Check TXT records**: Ensure SPF/DKIM are intact
- **Contact Hostinger**: If records were accidentally deleted

### SSL Certificate Issues
- Wait 24 hours for DNS to fully propagate
- Force SSL renewal in your platform dashboard
- Check that both www and non-www are configured

---

## Quick Reference Commands

```bash
# Check A record
nslookup terrygolden.com

# Check MX records
nslookup -type=MX terrygolden.com

# Check TXT records
nslookup -type=TXT terrygolden.com

# Test DNS propagation globally
# Visit: https://www.whatsmydns.net/#A/terrygolden.com
```

---

## Need Help?

1. **Hostinger Support**: Live chat in hPanel
2. **Platform Support**: 
   - Netlify: support.netlify.com
   - Vercel: vercel.com/support
3. **DNS Tools**: 
   - whatsmydns.net
   - mxtoolbox.com
   - dnschecker.org

---

## Summary Checklist

- [ ] Identify hosting platform (Netlify/Vercel/etc)
- [ ] Add custom domain in platform dashboard
- [ ] Update A record in Hostinger DNS
- [ ] Update CNAME for www subdomain
- [ ] Verify MX records are preserved
- [ ] Verify TXT records are preserved
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Test site at terrygolden.com
- [ ] Test email functionality
- [ ] Verify SSL certificate is active
- [ ] Set up HTTPS redirect

**Your email will continue working as long as you don't delete the MX and TXT records!**
