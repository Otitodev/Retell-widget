# Retell Voice Agent WordPress Setup Guide

## Quick Setup (5 Minutes)

### Step 1: Download Plugin Files
1. Create a folder called `retell-voice-agent`
2. Copy these 3 files into the folder:
   - `retell-voice-agent.php`
   - `assets/retell.css`
   - `assets/retell.js`

### Step 2: Install WordPress Plugin
1. Zip the `retell-voice-agent` folder
2. Go to WordPress Admin → Plugins → Add New
3. Click "Upload Plugin"
4. Choose your zip file and click "Install Now"
5. Click "Activate Plugin"

### Step 3: Verify Installation
1. Visit any page on your website
2. You should see a blue floating chat bubble in the bottom-right corner
3. Click it to open the voice assistant panel

## That's It! 🎉

The voice agent is now live on your website. Users can click the floating button and start voice calls with your AI agent.

---

## What's Included

- **Floating Chat Bubble**: Appears on all pages
- **Voice Assistant Panel**: Clean, professional interface
- **Real-time Transcripts**: Shows conversation as it happens
- **Status Indicators**: Shows connection status
- **Mobile Responsive**: Works on all devices

## Troubleshooting

**Problem**: No floating button appears
- **Solution**: Check if plugin is activated in WordPress Admin → Plugins

**Problem**: "Connection failed" when starting call
- **Solution**: Verify your Make.com webhook is working by testing the URL

**Problem**: Button appears but call doesn't start
- **Solution**: Check browser console (F12) for error messages

## Customization

To change colors or styling, edit the `assets/retell.css` file and modify the `#347D9B` color values to your brand colors.

## Support

The plugin uses:
- **Retell AI** for voice processing
- **Make.com** for secure token generation
- **WordPress** for easy deployment

All components are working and tested. The setup should take less than 5 minutes.