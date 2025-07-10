# Deployment Guide

## Step 1: Push to GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it something like `sca-timer`
   - Make it public or private (your choice)
   - Don't initialize with README (we already have one)

2. **Connect your local repo to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sca-timer.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/Login with your GitHub account

2. **Import your repository**
   - Click "New Project"
   - Select your `sca-timer` repository
   - Vercel will automatically detect it's a Node.js project

3. **Configure deployment**
   - **Framework Preset**: Node.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (not needed)
   - **Output Directory**: Leave empty (not needed)
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - You'll get a URL like: `https://sca-timer-xyz.vercel.app`

## Step 3: Test Your Deployment

1. **Test the timer app**
   - Visit your Vercel URL
   - Test both Standard and Guided modes
   - Submit feedback

2. **Test the admin dashboard**
   - Visit `https://your-url.vercel.app/admin.html`
   - Check if feedback appears
   - Test the auto-refresh feature

## Step 4: Share Your App

- **Timer App**: Share the main Vercel URL
- **Admin Dashboard**: Keep the admin URL private
- **Feedback**: All feedback will now appear in your admin dashboard

## Troubleshooting

### If feedback doesn't appear:
1. Check browser console for errors
2. Verify the API endpoints work: `https://your-url.vercel.app/api/feedback`
3. Check Vercel function logs in the dashboard

### If deployment fails:
1. Check that all files are committed to GitHub
2. Verify `vercel.json` is in the root directory
3. Check Vercel build logs for errors

## Environment Variables (Optional)

If you need to customize the app, you can add environment variables in Vercel:
- Go to your project settings
- Add any environment variables you need
- Redeploy the project

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Add your custom domain
3. Configure DNS settings
4. Your app will be available at your custom domain 