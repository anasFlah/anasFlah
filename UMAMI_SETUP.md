# Umami Analytics Setup Guide

This guide will help you set up Umami Analytics locally and integrate it with your portfolio admin dashboard.

## 🚀 **Step 1: Start Umami with Docker**

### Prerequisites
- Docker and Docker Compose installed on your system
- Port 3001 available on localhost

### Start Umami
```bash
# Navigate to your project directory
cd /path/to/your/portfolio

# Start Umami and PostgreSQL
docker-compose up -d

# Check if containers are running
docker-compose ps
```

### Verify Umami is Running
- Open http://localhost:3001 in your browser
- You should see the Umami login page

## 🔧 **Step 2: Initial Umami Setup**

### 1. Create Admin Account
- Go to http://localhost:3001
- Click "Create Account"
- Fill in the form:
  - **Username**: `admin`
  - **Password**: `umami`
  - **Email**: `admin@example.com`
- Click "Create Account"

### 2. Add Your Website
- After logging in, click "Add Website"
- Fill in the form:
  - **Name**: `My Portfolio`
  - **Domain**: `localhost:3000` (or your portfolio URL)
  - **Owner**: `admin`
- Click "Add Website"

### 3. Get Website ID
- After adding the website, note the **Website ID** (usually `1`)
- This will be used in your environment variables

## 🔧 **Step 3: Configure Environment Variables**

Create a `.env.local` file in your project root:

```env
# Umami Analytics Configuration
NEXT_PUBLIC_UMAMI_BASE_URL=http://localhost:3001
NEXT_PUBLIC_UMAMI_USERNAME=admin
NEXT_PUBLIC_UMAMI_PASSWORD=umami
NEXT_PUBLIC_UMAMI_WEBSITE_ID=1

# Umami API Configuration
NEXT_PUBLIC_UMAMI_API_URL=http://localhost:3001/api
NEXT_PUBLIC_UMAMI_TRACKING_SCRIPT_URL=http://localhost:3001/umami.js

# Admin Dashboard Configuration
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=anesflah2024
```

## 🔧 **Step 4: Update Tracking Script**

The tracking script in `pages/_document.tsx` is now automatically configured using environment variables. No manual changes needed!

## 🔧 **Step 5: Test the Integration**

### 1. Start Your Portfolio
```bash
npm run dev
```

### 2. Visit Your Portfolio
- Go to http://localhost:3000
- Navigate through different pages
- Check Umami dashboard at http://localhost:3001 to see if data is being tracked

### 3. Test Admin Dashboard
- Go to http://localhost:3000/admin
- Login with your admin credentials
- Check if real data is being displayed instead of mock data

## 📊 **API Endpoints**

Your admin dashboard now uses these Umami API endpoints:

- **Main Analytics**: `/api/analytics` - Overall stats and top pages
- **Traffic Data**: `/api/analytics/traffic` - Time-series traffic data
- **Page Analytics**: `/api/analytics/pages` - Detailed page statistics
- **Traffic Sources**: `/api/analytics/sources` - Referrer data
- **Device Analytics**: `/api/analytics/devices` - Device breakdown
- **Country Analytics**: `/api/analytics/countries` - Geographic data

## 🔧 **Troubleshooting**

### Umami Not Starting
```bash
# Check container logs
docker-compose logs umami
docker-compose logs postgres

# Restart containers
docker-compose down
docker-compose up -d
```

### No Data in Dashboard
1. Verify Umami is tracking data at http://localhost:3001
2. Check browser console for API errors
3. Verify environment variables are correct
4. Ensure website ID matches in both Umami and tracking script

### API Authentication Issues
1. Verify username/password in environment variables
2. Check if Umami admin account exists
3. Try logging in manually at http://localhost:3001

### CORS Issues
If you encounter CORS errors, add this to your `next.config.mjs`:

```javascript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/umami/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};
```

## 📱 **Responsive Design**

The admin dashboard is now fully responsive:

- **Desktop**: Full layout with sidebar and main content
- **Tablet**: Optimized spacing and grid layouts
- **Mobile**: Stacked layout with touch-friendly controls

## 🔒 **Security Notes**

- Change default passwords in production
- Use HTTPS in production
- Consider using environment-specific configurations
- Regularly update Docker images

## 🚀 **Production Deployment**

For production deployment:

1. **Update URLs**: Change localhost URLs to your production domain
2. **SSL**: Use HTTPS for all API calls
3. **Database**: Consider using external PostgreSQL database
4. **Backup**: Set up regular database backups
5. **Monitoring**: Add health checks and monitoring

## 📈 **Features Implemented**

✅ **Real Analytics Data**: All dashboard components now use live Umami data
✅ **Responsive Design**: Works perfectly on mobile, tablet, and desktop
✅ **Fallback Support**: Graceful fallback to mock data if Umami is unavailable
✅ **Error Handling**: Proper error handling and loading states
✅ **Consistent Styling**: Maintains your portfolio's dark theme
✅ **Existing Logic Preserved**: No changes to your React component logic

Your admin dashboard now displays real analytics data from Umami while maintaining the same structure and functionality! 🎉
