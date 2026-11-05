import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  slotTime: { type: String, required: true },
  slotDate: { type: String, required: true },
  appointmentType: { type: String, enum: ['virtual', 'in-person'], required: true },
  virtualMeetingPlatform: { type: String, enum: ['Google Meet', 'MediMeet'], default: null }, // New field
  randomCode: { type: String, default: null }, // New field for MediMeet
  meetLink: { type: String, default: null },
  date: { type: Date, default: Date.now },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  paymentId: { type: String, default: null },
  paymentOrderId: { type: String, default: null },
});

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);
export default appointmentModel;