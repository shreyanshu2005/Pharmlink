import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets_frontend/assets';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  ChevronRight,
  User,
  CheckCircle2,
  Search,
  IndianRupee,
  Video,
  Link as LinkIcon,
  Key as KeyIcon,
} from 'lucide-react';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        { headers: { token } }
      );
  
      if (data.success && Array.isArray(data.appointments)) {
        const sortedAppointments = data.appointments
          .map(apt => ({
            ...apt,
            payment: Boolean(apt.payment),
            meetLink: apt.meetLink || null,
            randomCode: apt.randomCode || null, // Ensure randomCode is included
            virtualMeetingPlatform: apt.virtualMeetingPlatform || null,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
  
        console.log('Processed appointments:', sortedAppointments);
        setAppointments(sortedAppointments);
      } else {
        toast.error('Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          setLoading(true);

          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: { token } }
          );

          if (data.success) {
            setAppointments(prevAppointments =>
              prevAppointments.map(appointment => {
                if (appointment._id === order.receipt) {
                  const updatedAppointment = {
                    ...appointment,
                    ...data.data.appointment,
                    payment: true,
                    meetLink: data.data.meetLink,
                    randomCode: data.data.randomCode,
                    virtualMeetingPlatform: data.data.virtualMeetingPlatform,
                  };
                  console.log('Updated appointment:', updatedAppointment);
                  return updatedAppointment;
                }
                return appointment;
              })
            );

            toast.success('Payment successful!');
            setPayment('');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error(error.response?.data?.message || 'Payment verification failed');
        } finally {
          setLoading(false);
          getUserAppointments();
        }
      },
      modal: {
        ondismiss: function () {
          setPayment('');
          getUserAppointments();
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  const StatusBadge = ({ cancelled, payment, isCompleted }) => {
    if (cancelled) {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600">
          <AlertCircle size={14} className="mr-1" />
          Cancelled
        </div>
      );
    }

    if (isCompleted) {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={14} className="mr-1" />
          Completed
        </div>
      );
    }

    if (payment) {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600">
          <IndianRupee size={14} className="mr-1" />
          Paid
        </div>
      );
    }

    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-600">
        <AlertCircle size={14} className="mr-1" />
        Pending Payment
      </div>
    );
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.docData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.docData.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const renderMeetingInfo = (item) => {
    if (item.appointmentType !== 'virtual' || !item.payment) {
      return null;
    }
  
    console.log('Rendering meeting info for:', item);
  
    if (item.virtualMeetingPlatform === 'Google Meet' && item.meetLink) {
      return (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
          <Video size={16} className="text-blue-600" />
          <a
            href={item.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Join Google Meet
          </a>
        </div>
      );
    }
  
    if (item.virtualMeetingPlatform === 'MediMeet') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Video size={16} className="text-blue-600" />
            <a
              href="https://medimeet-video-chat.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Join MediMeet
            </a>
          </div>
          {item.randomCode && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
              <KeyIcon size={16} className="text-blue-600" />
              <span className="text-blue-600">
                Meeting Code: <strong>{item.randomCode}</strong>
              </span>
            </div>
          )}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">
          My Appointments
        </h1>
        <div className="h-1 w-20 bg-indigo-600 rounded"></div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by doctor name or speciality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition-all duration-200 shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
              <AlertCircle size={24} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Appointments Found</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {searchTerm ? "No appointments match your search criteria." : "You don't have any appointments yet. Book your first appointment to get started."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-3 sm:p-4 relative">
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <StatusBadge
                    cancelled={item.cancelled}
                    payment={item.payment}
                    isCompleted={item.isCompleted}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Doctor Image */}
                  <div className="relative group mx-auto sm:mx-0">
                    <img
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-md transition-transform"
                      src={item.docData.image}
                      alt={item.docData.name}
                    />
                  </div>

                  {/* Doctor Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-center sm:text-left mb-3">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {item.docData.name}
                      </h2>
                      <p className="text-indigo-600 font-medium inline-flex items-center text-sm">
                        <User size={16} className="mr-1.5" />
                        {item.docData.speciality}
                      </p>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <MapPin size={16} className="text-indigo-600" />
                        </div>
                        <span className="font-medium text-sm text-gray-700">
                          {item.docData?.address?.line1 || 'Address not available'}
                          {item.docData?.address?.line2 ? `, ${item.docData.address.line2}` : ''}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Calendar size={16} className="text-indigo-600" />
                          </div>
                          <span className="font-medium text-sm text-gray-700">
                            {slotDateFormat(item.slotDate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <Clock size={16} className="text-indigo-600" />
                          </div>
                          <span className="font-medium text-sm text-gray-700">
                          {item.slotTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meeting Link and Code */}
                    <div className="mt-4">
                      {renderMeetingInfo(item)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 mt-4 pt-4 border-t">
                  {!item.cancelled && (
                    <>
                      {item.isCompleted ? (
                        <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg sm:min-w-48 border border-green-500">
                          <CheckCircle2 size={16} className="mr-1.5" />
                          Completed
                        </button>
                      ) : (
                        <>
                          {!item.payment && (
                            <>
                              {payment !== item._id ? (
                                <button
                                  onClick={() => setPayment(item._id)}
                                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                                >
                                  <IndianRupee size={16} className="mr-1.5" />
                                  Pay Online
                                </button>
                              ) : (
                                <button
                                  onClick={() => appointmentRazorpay(item._id)}
                                  className="flex items-center justify-center px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                  <img
                                    className="h-6"
                                    src={assets.razorpay_logo}
                                    alt="Razorpay"
                                  />
                                </button>
                              )}
                            </>
                          )}

                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                          >
                            <AlertCircle size={16} className="mr-1.5" />
                            Cancel Appointment
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;