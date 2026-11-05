import { google } from 'googleapis';
import nodemailer from 'nodemailer';

// Validate required environment variables
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REFRESH_TOKEN',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Google OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set OAuth2 credentials (refresh token)
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Google Calendar API instance
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

/**
 * Function to refresh the access token.
 */
const refreshAccessToken = async () => {
  try {
    const { credentials } = await oauth2Client.refreshToken(process.env.GOOGLE_REFRESH_TOKEN);
    oauth2Client.setCredentials(credentials);
    console.log('Access token refreshed successfully');
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token. Please re-authenticate.');
  }
};

/**
 * Function to create a Google Calendar event with a Meet link.
 */
export const createGoogleMeetEvent = async (appointmentData) => {
  const { userData, docData, slotDate, slotTime, virtualMeetingPlatform } = appointmentData;
  if (virtualMeetingPlatform !== 'Google Meet') {
    return null; // Do not create a Google Meet link if the platform is not Google Meet
  }

  // Validate slotDate and slotTime formats
  if (!slotDate || !slotDate.match(/^\d{2}_\d{2}_\d{4}$/)) {
    throw new Error('Invalid slotDate format. Expected format: DD_MM_YYYY');
  }

  if (!slotTime || !slotTime.match(/^\d{2}:\d{2}$/)) {
    throw new Error('Invalid slotTime format. Expected format: HH:MM');
  }

  // Parse slot date and time
  const [day, month, year] = slotDate.split('_').map(Number);
  const [startHour, startMinute] = slotTime.split(':').map(Number);

  // Validate parsed values
  if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(startHour) || isNaN(startMinute)) {
    throw new Error('Invalid date or time values');
  }

  if (month < 1 || month > 12) throw new Error('Invalid month. Expected value between 1 and 12');
  if (day < 1 || day > 31) throw new Error('Invalid day. Expected value between 1 and 31');
  if (startHour < 0 || startHour > 23) throw new Error('Invalid hour. Expected value between 0 and 23');
  if (startMinute < 0 || startMinute > 59) throw new Error('Invalid minute. Expected value between 0 and 59');

  // Create start and end times
  const startTime = new Date(year, month - 1, day, startHour, startMinute);
  const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes duration

  const event = {
    summary: `Appointment with ${docData.name}`,
    description: `Virtual appointment with ${docData.name} (${docData.speciality}).`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'Asia/Kolkata', // Replace with the appropriate time zone
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'Asia/Kolkata', // Replace with the appropriate time zone
    },
    conferenceData: {
      createRequest: {
        requestId: `appointment-${appointmentData._id}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    attendees: [{ email: userData.email }],
    reminders: {
      useDefault: true,
    },
  };

  try {
    console.log('Creating Google Meet event for appointment:', appointmentData._id);
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    console.log('Google Meet event created successfully. Meet link:', meetLink);
    return meetLink;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token expired, refresh the token and retry
      console.log('Access token expired. Refreshing token...');
      await refreshAccessToken();
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
      });
      return response.data.hangoutLink;
    } else {
      console.error('Error creating Google Meet event:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
      });
      throw new Error('Failed to create Google Meet event. Please try again.');
    }
  }
};

/**
 * Function to send the Google Meet link via email.
 */
export const sendMeetLinkEmail = async (userData, meetLink, appointmentData) => {
  if (!appointmentData || !appointmentData.docData) {
    throw new Error('Invalid appointment data: docData is missing');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailContent = `
    <p>Dear ${userData.name},</p>
    <p>Your virtual consultation with PharmLink is scheduled to begin soon. Please find your secure video consultation link below.</p>
    <h3>🎥 VIDEO CONSULTATION ACCESS</h3>
    <p><strong>Join Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
    <p><strong>Doctor:</strong> ${appointmentData.docData.name}</p>
    <p><strong>Date:</strong> ${formatDate(appointmentData.slotDate)}</p>
    <p><strong>Time:</strong> ${formatTime(appointmentData.slotTime)}</p>
    <p><strong>Duration:</strong> 30 minutes</p>
    <h3>⚡ QUICK TECHNICAL CHECKLIST</h3>
    <ul>
      <li>Test your internet connection</li>
      <li>Check camera and microphone</li>
    </ul>
    <h3>📝 JOINING INSTRUCTIONS</h3>
    <ol>
      <li>Click the join link above</li>
      <li>Allow camera and microphone access</li>
      <li>Enter your name if prompted</li>
      <li>Doctor will admit you at appointment time</li>
    </ol>
    <h3>💡 FOR BEST EXPERIENCE</h3>
    <ul>
      <li>Join 5 minutes before scheduled time</li>
      <li>Use Chrome or Firefox browser</li>
      <li>Have medical documents ready</li>
    </ul>
    <h3>❗ NEED HELP?</h3>
    <p>Having technical issues? Email: <a href="mailto:support@pharmlink.example">support@pharmlink.example</a></p>
    <p>We're looking forward to your virtual consultation.</p>
    <p>Best regards,<br>Team PharmLink</p>
    <p><em>Note: This is a secure link. Please do not share it with others.</em></p>
  `;

  const mailOptions = {
    from: {
      name: 'PharmLink Healthcare',
      address: process.env.EMAIL_USER,
    },
    to: userData.email,
    subject: `Your Video Consultation Link - Appointment with ${appointmentData.docData.name}`,
    html: emailContent,
  };

  try {
    console.log('Sending email to:', userData.email);
    await transporter.sendMail(mailOptions);
    console.log('Meet link email sent successfully');
    console.log('====================================');
    console.log('Email sent to:', userData.email);
    console.log('Appointment ID:', appointmentData._id);
    console.log('====================================');
  } catch (error) {
    console.error('Error sending Meet link email:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });
    throw new Error('Failed to send email. Please try again.');
  }
};

// Helper function to format date
const formatDate = (dateString) => {
  const [day, month, year] = dateString.split('_');
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${day} ${months[parseInt(month) - 1]} ${year}`;
};

// Helper function to format time with AM/PM
const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
  return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
};