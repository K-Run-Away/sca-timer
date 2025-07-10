# SCA Timer

A minimalist, modern 12-minute timer application designed for clinical scenarios with two distinct modes.

## Features

### Standard Mode
- Clean white background throughout the session
- 12-minute countdown timer
- Timer text turns red when 1 minute or less remains
- Optional completion sound

### Guided Mode
- **0-6 minutes**: Green background with "Data Gathering" text
- **6-1 minutes**: Amber background with "Clinical Management" text  
- **1-0 minutes**: Red background with "Clinical Management" text
- Visual phase transitions to guide clinical workflow

## Usage

### For Users:
1. **Open the app**: Simply open `index.html` in any modern web browser
2. **Choose your mode**: Click either "Standard" or "Guided" mode
3. **Start the timer**: Click the "Start" button to begin the countdown
4. **Control the timer**: Use "Pause" to pause/resume or "Reset" to start over
5. **Sound settings**: Toggle the "Sound on completion" checkbox to enable/disable the completion alert
6. **Provide feedback**: After timer completion, click thumbs up or thumbs down

### For Administrators:
1. **Install dependencies**: Run `npm install` to install required packages
2. **Start the server**: Run `npm start` to start the feedback collection server
3. **Access the app**: Open `http://localhost:3000` in your browser
4. **View feedback**: Access the admin dashboard at `http://localhost:3000/admin.html`
5. **API endpoints**:
   - `POST /api/feedback` - Submit feedback
   - `GET /api/feedback` - Get feedback summary
   - `GET /api/health` - Health check

## Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript
- **Backend**: Node.js with Express.js for feedback collection
- **Design**: Modern Silicon Valley aesthetic with clean typography
- **Responsive**: Works on desktop and mobile devices
- **Accessibility**: Keyboard accessible and screen reader friendly
- **GDPR Compliant**: Minimal data collection (no personal information)

## Feedback System

The app includes a GDPR-compliant feedback system that collects only essential data:
- **Rating**: Positive or negative feedback
- **Mode**: Which timer mode was used (Standard/Guided)
- **Timestamp**: When the feedback was submitted

No personal information (IP addresses, user IDs, etc.) is collected or stored.

## File Structure

```
SCA Timer/
├── index.html      # Main HTML file
├── styles.css      # Styling and animations
├── script.js       # Timer logic and interactions
├── server.js       # Node.js server for feedback collection
├── package.json    # Node.js dependencies
├── admin.html      # Admin dashboard for viewing feedback
└── README.md       # This file
```

## Browser Compatibility

Works in all modern browsers including:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Deployment

### Local Development
1. Install dependencies: `npm install`
2. Start server: `npm start`
3. Open: `http://localhost:3000`

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically
4. Get public URL to share with others

### Deploy to Other Platforms
- **Heroku**: Add `Procfile` with `web: node server.js`
- **Railway**: Connect GitHub repository
- **Render**: Connect GitHub repository

## License

This project is open source and available under the MIT License. 