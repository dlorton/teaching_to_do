# Google Calendar API Setup Guide

## Step 1: Enable Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing Firebase project (or create a new one)
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Calendar API"
5. Click **Enable**

## Step 2: Create API Credentials

### Create API Key:
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API Key**
3. Copy the API key
4. (Recommended) Click **Edit API key** and restrict it:
   - Under "API restrictions", select "Restrict key"
   - Check "Google Calendar API"
   - Save

### Create OAuth Client ID:
1. Still in **Credentials**, click **+ CREATE CREDENTIALS** > **OAuth client ID**
2. If prompted, configure the **OAuth consent screen** first:
   - User Type: **External**
   - App name: "Teacher Companion App"
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add these scopes:
     - `https://www.googleapis.com/auth/calendar.events`
     - `https://www.googleapis.com/auth/calendar.readonly`
   - Test users: Add your email
   - Save and Continue
3. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: "Teacher Companion Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://dlorton.github.io` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for local development)
     - `https://dlorton.github.io/teaching_to_do` (for production)
   - Click **Create**
4. Copy the **Client ID** (it ends with `.apps.googleusercontent.com`)

## Step 3: Configure Your App

1. In your `teacher-companion` folder, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   VITE_GOOGLE_API_KEY=your_actual_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
   ```

3. **IMPORTANT**: Never commit `.env` to git (it's already in `.gitignore`)

## Step 4: Update Firestore Security Rules

Add these rules to allow calendar settings and events storage:

```javascript
match /users/{userId}/settings/{settingId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

match /users/{userId}/events/{eventId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

## Step 5: Test

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to **Settings** in the sidebar
3. Toggle "Calendar Sync" to **ON**
4. Click "Connect Calendar"
5. Grant permissions when prompted
6. Select a default calendar from the dropdown

## Troubleshooting

### "Access blocked: This app's request is invalid"
- Make sure you added the correct redirect URIs in Google Cloud Console
- Check that your OAuth consent screen is configured
- Add yourself as a test user if the app is not published

### "API key not valid"
- Verify the API key in your `.env` file
- Check that Google Calendar API is enabled
- Make sure there are no extra spaces in the `.env` file

### Calendar list not loading
- Check browser console for errors
- Verify you granted the calendar permissions
- Try signing out and signing in again

## Next Steps

Once settings are working, you can implement:
- "Add to Calendar" button on tasks
- "Today's Schedule" widget
- Time picker for calendar events
