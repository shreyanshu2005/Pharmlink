import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { X, Check, IndianRupee } from 'lucide-react';

const DoctorDashboard = () => {
  const { doctorToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorToken) {
      setLoading(true);
      getDashData().finally(() => setLoading(false));
    }
  }, [doctorToken]);

  const stats = [
    {
      title: "Total Appointments",
      value: dashData?.appointments || 0,
      className: "bg-blue-500",
      textClassName: "text-blue-100"
    },
    {
      title: "Completed",
      value: dashData?.latestAppointments?.filter(apt => apt.isCompleted)?.length || 0,
      className: "bg-green-500",
      textClassName: "text-green-100"
    },
    {
      title: "Cancelled",
      value: dashData?.latestAppointments?.filter(apt => apt.cancelled)?.length || 0,
      className: "bg-red-500",
      textClassName: "text-red-100"
    },
    {
      title: "Active",
      value: dashData?.latestAppointments?.filter(apt => !apt.cancelled && !apt.isCompleted)?.length || 0,
      className: "bg-purple-500",
      textClassName: "text-purple-100"
    }
  ];

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
          ❌ Cancelled
        </span>
      );
    }
    if (appointment.isCompleted) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
          ✅ Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
        🕒 Active
      </span>
    );
  };

  const AppointmentCard = ({ appointment, index }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-blue-500">
              <img src={appointment.userData.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <p className="font-bold text-gray-700 ml-2 text-lg capitalize">{appointment.userData.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(appointment)}
          {!appointment.cancelled && !appointment.isCompleted && (
            <div className="flex gap-2">
              <button onClick={() => cancelAppointment(appointment._id)} 
                className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all duration-300">
                <X className="w-5 h-5" />
              </button>
              <button onClick={() => completeAppointment(appointment._id)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 transition-all duration-300">
                <Check className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Date & Time</span>
          <span className="font-medium text-sm">{slotDateFormat(appointment.slotDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Age</span>
          <span className="font-medium">{appointment.userData.age} yrs</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
            💵 Cash
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Fees</span>
          <p className="font-semibold text-gray-700 flex items-center gap-1">
            <IndianRupee size={14} className="text-blue-500" />{appointment.fees}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return dashData && (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-20">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.className} rounded-xl p-4 text-white`}>
            <p className={`${stat.textClassName} text-sm md:text-base`}>{stat.title}</p>
            <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-900 text-white px-4 md:px-6 py-4 sticky top-0 z-10">
          <h2 className="text-lg md:text-xl font-bold">Latest 5 Appointments</h2>
        </div>

        {/* Mobile View */}
        <div className="md:hidden h-[calc(100vh-300px)] overflow-y-auto">
          <div className="p-4">
            {dashData.latestAppointments.slice(0, 5).map((appointment, index) => (
              <AppointmentCard key={index} appointment={appointment} index={index} />
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="sticky top-0 z-10 bg-gray-50">
            <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1.5fr] gap-1 px-6 py-4 text-sm font-semibold text-gray-600">
              <p>#</p>
              <p>Patient</p>
              <p>Payment</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Fees</p>
              <p>Status</p>
            </div>
          </div>

          <div className="h-[calc(100vh-380px)] overflow-y-auto">
            {dashData.latestAppointments.slice(0, 5).map((appointment, index) => (
              <div key={index}
                className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1.5fr] gap-1 items-center px-6 py-4 hover:bg-gray-50 transition-all duration-300">
                <p className="text-gray-400 font-medium">{index + 1}</p>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-blue-500 group-hover:ring-purple-500 transition-all duration-300">
                      <img src={appointment.userData.image} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-300" 
                        alt={appointment.userData.name} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <p className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    {appointment.userData.name}
                  </p>
                </div>
                
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                    💵 Cash
                  </span>
                </div>
                
                <p className="text-gray-600">{appointment.userData.age} yrs</p>
                
                <div className="text-gray-600">
                  <p className="font-medium group-hover:text-blue-600 transition-colors duration-300">
                    {slotDateFormat(appointment.slotDate)}
                  </p>
                </div>
                
                <p className="font-semibold text-gray-700 flex items-center gap-1">
                  <IndianRupee size={14} className="text-blue-500" />{appointment.fees}
                </p>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(appointment)}
                  {!appointment.cancelled && !appointment.isCompleted && (
                    <div className="flex gap-2">
                      <button onClick={() => cancelAppointment(appointment._id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all duration-300">
                        <X className="w-5 h-5" />
                      </button>
                      <button onClick={() => completeAppointment(appointment._id)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 transition-all duration-300">
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;