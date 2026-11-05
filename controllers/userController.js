import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import razorpay from 'razorpay';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { createGoogleMeetEvent } from '../utils/googleCalendar.js';

// Configure Razorpay
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Helper function to format date
const formatDate = (dateString) => {
  try {
    const [day, month, year] = dateString.split('_');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
  } catch (error) {
    return dateString;
  }
};

// Helper function to format specialization
const formatSpecialization = (specialization) => {
  return specialization || 'General Physician';
};

// Function to send payment confirmation email
const sendPaymentConfirmationEmail = async (appointmentData) => {
  const { userData, docData, slotDate, slotTime, appointmentType, amount, meetLink, virtualMeetingPlatform } = appointmentData;

  let meetingDetails = '';
  if (appointmentType === 'virtual') {
    if (virtualMeetingPlatform === 'Google Meet') {
      meetingDetails = `
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">🎥 Video Consultation Link</h3>
          <p>Join your consultation using this link: <a href="${meetLink}">${meetLink}</a></p>
        </div>
      `;
    } else if (virtualMeetingPlatform === 'MediMeet') {
      const randomCode = docData.randomCode; // Fetch the random code from the doctor model
      meetingDetails = `
        <div style="background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">🎥 Video Consultation Link</h3>
          <p>Join your consultation using this link: <a href="https://medimeet-video-chat.onrender.com">https://medimeet-video-chat.onrender.com</a></p>
          <p>Use the following code to join the meeting: <strong>${randomCode}</strong></p>
        </div>
      `;
    }
  }

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50; text-align: center;">Payment Confirmation</h2>
      
      <p>Dear <strong>${userData.name}</strong>,</p>
      
      <p>Your payment of ₹${amount} for the appointment with ${docData.name} has been successfully processed.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">🏥 Appointment Details</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Doctor:</strong> ${docData.name}</li>
          <li><strong>Specialization:</strong> ${formatSpecialization(docData.specialization)}</li>
          <li><strong>Date:</strong> ${formatDate(slotDate)}</li>
          <li><strong>Time:</strong> ${slotTime}</li>
          <li><strong>Type:</strong> ${appointmentType === 'virtual' ? 'Video Consultation' : 'In-Person Visit'}</li>
          <li><strong>Amount Paid:</strong> ₹${amount}</li>
        </ul>
      </div>
      
      ${meetingDetails}
      
      <div style="margin-top: 30px;">
        <p>For any queries, please contact our support team.</p>
      </div>
      
      <div style="margin-top: 30px; text-align: center; color: #7f8c8d;">
        <p>Best regards,<br><strong>Team PharmLink</strong></p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: {
      name: 'PharmLink Healthcare',
      address: process.env.EMAIL_USER
    },
    to: userData.email,
    subject: 'Payment Confirmation - PharmLink Healthcare',
    html: emailContent,
  };

  // Send email
  await transporter.sendMail(mailOptions);
  console.log('✅ Payment confirmation email sent successfully');
};

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation checks
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = { name, email, password: hashedPassword };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ success: true, token });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'This email is already registered. Please try another email.' });
    } else {
      res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
    }
  }
};

// API to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select('-password');

    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: 'Data Missing' });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.status(200).json({ success: true, message: 'Profile Updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime, appointmentType, virtualMeetingPlatform } = req.body;

    // Validate appointment type
    if (!appointmentType || !['virtual', 'in-person'].includes(appointmentType)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment type' });
    }

    const docData = await doctorModel.findById(docId).select('-password');

    if (!docData.available) {
      return res.status(400).json({ success: false, message: 'Doctor Not Available' });
    }

    let slots_booked = docData.slots_booked;

    // Check for slot availability
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({ success: false, message: 'Slot Not Available' });
    }

    // Book the slot
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }
    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select('-password');

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      appointmentType,
      virtualMeetingPlatform, // Include the selected platform
      randomCode: docData.randomCode, // Ensure randomCode is included
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save updated slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.status(200).json({ success: true, message: 'Appointment Booked' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Verify appointment user
    if (!appointmentData || appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: 'Unauthorized action' 
    });
}

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter((e) => e !== slotTime);
    }
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment Cancelled' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId }).populate('docId', 'randomCode'); // Ensure randomCode is populated

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to make payment of appointment using Razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment Cancelled or not found' });
    }

    // Creating options for Razorpay payment
    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // Creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify Razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Fetch order details
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === 'paid') {
      const appointmentId = orderInfo.receipt;
      
      // Update appointment with payment status
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { 
          payment: true,
          paymentId: razorpay_payment_id,
          paymentOrderId: razorpay_order_id
        },
        { new: true }
      ).populate('userId', 'name email')
       .populate('docId', 'name specialization fees');

      if (!updatedAppointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      // Create Google Meet link for virtual appointments
      if (updatedAppointment.appointmentType === 'virtual') {
        try {
          const meetLink = await createGoogleMeetEvent(updatedAppointment);
          updatedAppointment.meetLink = meetLink;
          await updatedAppointment.save();
        } catch (meetError) {
          console.error('Google Meet creation failed:', meetError);
        }
      }

      // Send confirmation email
      try {
        await sendPaymentConfirmationEmail(updatedAppointment);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      res.status(200).json({
        success: true,
        message: 'Payment successful',
        data: {
          appointment: updatedAppointment,
          meetLink: updatedAppointment.meetLink
        }
      });

    } else {
      res.status(400).json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await userModel.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = new userModel({
        name,
        email,
        googleId,
        isGoogleUser: true,
        image: picture,
        password: crypto.randomBytes(16).toString('hex') // dummy password
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.isGoogleUser = true;
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ success: true, token: jwtToken });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  googleAuth
};