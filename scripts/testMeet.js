import { google } from 'googleapis';
import 'dotenv/config';

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

try {
  const { token } = await auth.getAccessToken();
  console.log('Token OK:', !!token);
  const cal = google.calendar({ version: 'v3', auth });
  const r = await cal.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    resource: {
      summary: 'Test',
      start: { dateTime: new Date(Date.now() + 3600e3).toISOString() },
      end: { dateTime: new Date(Date.now() + 5400e3).toISOString() },
      conferenceData: { createRequest: { requestId: 'test-' + Date.now(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
    },
  });
  console.log('Meet link:', r.data.hangoutLink);
} catch (e) {
  console.error('FAILED:', e.message, e.response?.data);
}