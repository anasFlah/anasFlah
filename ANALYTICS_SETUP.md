# Analytics Setup Guide

## Google Analytics 4 Integration

The admin dashboard now includes real analytics integration with Google Analytics 4. Here's how to set it up:

### 1. Google Analytics 4 Setup

1. **Create a GA4 Property** (if you don't have one):
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property for your portfolio website
   - Note down your Property ID

2. **Create a Service Account**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google Analytics Data API
   - Create a Service Account
   - Download the JSON key file

3. **Add Service Account to GA4**:
   - In your GA4 property, go to Admin → Property → Property access management
   - Add your service account email with "Viewer" permissions

### 2. Environment Variables

Create a `.env.local` file in your project root with:

```env
# Google Analytics 4 Configuration
GA4_PROPERTY_ID=your_ga4_property_id
GA4_CLIENT_EMAIL=your_service_account_email
GA4_PRIVATE_KEY=your_private_key
```

**Note**: For the private key, use the entire key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts.

### 3. Alternative: Plausible Analytics

If you prefer Plausible Analytics (privacy-focused alternative):

1. **Sign up** at [plausible.io](https://plausible.io/)
2. **Add your domain** to Plausible
3. **Get your API key** from the dashboard
4. **Update the analytics service** to use Plausible API instead

### 4. Current Implementation

The current implementation includes:

- **Mock Data**: For development and testing
- **Real GA4 Integration**: Ready for production use
- **Multiple Analytics Views**: Traffic, sources, devices, countries
- **Interactive Charts**: Using Recharts library
- **Responsive Design**: Works on all devices

### 5. Features

✅ **Real-time Analytics**
- Visitor tracking
- Page view monitoring
- Session duration
- Bounce rate

✅ **Traffic Sources**
- Direct traffic
- Search engines
- Social media
- Referrals

✅ **Device Analytics**
- Desktop usage
- Mobile usage
- Tablet usage

✅ **Geographic Data**
- Country-based analytics
- Regional insights

✅ **Interactive Charts**
- Line charts for trends
- Area charts for volume
- Pie charts for distribution
- Bar charts for comparison

### 6. Development vs Production

**Development**: Uses mock data for testing
**Production**: Connects to real GA4 data

To switch to real data, simply:
1. Set up GA4 credentials
2. Add environment variables
3. Deploy to production

### 7. Customization

You can easily customize:
- Chart colors and themes
- Time ranges (7d, 30d, 90d)
- Metrics displayed
- Chart types (line, area, bar, pie)

### 8. Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Service account should have minimal required permissions
- Consider rate limiting for API calls

### 9. Troubleshooting

**Common Issues**:
- "Failed to load analytics data" - Check GA4 credentials
- "Invalid property ID" - Verify GA4 property ID
- "Permission denied" - Check service account permissions

**Debug Mode**: Check browser console for detailed error messages.

---

The analytics system is now fully integrated and ready for production use! 🎉
