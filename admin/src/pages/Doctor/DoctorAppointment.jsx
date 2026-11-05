  import React, { useContext, useEffect, useState } from 'react';
  import { DoctorContext } from '../../context/DoctorContext';
  import { AppContext } from '../../context/AppContext';
  import { X, Check, IndianRupee } from 'lucide-react';

  const DoctorAppointment = () => {
    const { doctorToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
    const { slotDateFormat, calculateAge } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (doctorToken) {
        setLoading(true);
        getAppointments().finally(() => setLoading(false));
      }
    }, [doctorToken]);

    const stats = {
      total: appointments.length,
      completed: appointments.filter(a => a.isCompleted).length,
      cancelled: appointments.filter(a => a.cancelled).length,
      active: appointments.filter(a => !a.isCompleted && !a.cancelled).length
    };

    const getStatusBadge = (item) => {
      if (item.cancelled) {
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
            ❌ Cancelled
          </span>
        );
      }
      if (item.isCompleted) {
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

    const AppointmentCard = ({ item, index }) => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-blue-500">
                <img src={item.userData.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-bold text-gray-700 ml-2 text-lg capitalize">{item.userData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(item)}
            {!item.cancelled && !item.isCompleted && (
              <div className="flex gap-2">
                <button onClick={() => cancelAppointment(item._id)} 
                  className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all duration-300">
                  <X className="w-5 h-5" />
                </button>
                <button onClick={() => completeAppointment(item._id)}
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
            <span className="font-medium text-sm">{slotDateFormat(item.slotDate)}, {item.slotTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Age</span>
            <span className="font-medium">{calculateAge(item.userData.dob)} yrs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              item.payment ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {item.payment ? '💳 Online' : '💵 Cash'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fees</span>
            <p className="font-semibold text-gray-700 flex items-center gap-1">
              <IndianRupee size={14} className="text-blue-500" />{item.amount}
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

    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-20">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-blue-500 rounded-xl p-4 text-white">
            <p className="text-blue-100 text-sm md:text-base">Total Appointments</p>
            <p className="text-2xl md:text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-green-500 rounded-xl p-4 text-white">
            <p className="text-green-100 text-sm md:text-base">Completed</p>
            <p className="text-2xl md:text-3xl font-bold">{stats.completed}</p>
          </div>
          <div className="bg-red-500 rounded-xl p-4 text-white">
            <p className="text-red-100 text-sm md:text-base">Cancelled</p>
            <p className="text-2xl md:text-3xl font-bold">{stats.cancelled}</p>
          </div>
          <div className="bg-purple-500 rounded-xl p-4 text-white">
            <p className="text-purple-100 text-sm md:text-base">Active</p>
            <p className="text-2xl md:text-3xl font-bold">{stats.active}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gray-900 text-white px-4 md:px-6 py-4 sticky top-0 z-10">
            <h2 className="text-lg md:text-xl font-bold">All Appointments ({stats.total})</h2>
          </div>

          {/* Mobile View */}
          <div className="md:hidden h-[calc(100vh-300px)] overflow-y-auto">
            <div className="p-4">
              {appointments.map((item, index) => (
                <AppointmentCard key={item._id} item={item} index={index} />
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
              {appointments.map((item, index) => (
                <div key={item._id}
                  className="grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1.5fr] gap-1 items-center px-6 py-4 hover:bg-gray-50 transition-all duration-300">
                  <p className="text-gray-400 font-medium">{index + 1}</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-blue-500 group-hover:ring-purple-500 transition-all duration-300">
                        <img src={item.userData.image} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-300" 
                          alt={item.userData.name} />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <p className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                      {item.userData.name}
                    </p>
                  </div>
                  
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      item.payment 
                        ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' 
                        : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                    } transition-colors duration-300`}>
                      {item.payment ? '💳 Online' : '💵 Cash'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600">{calculateAge(item.userData.dob)} yrs</p>
                  
                  <div className="text-gray-600">
                    <p className="font-medium group-hover:text-blue-600 transition-colors duration-300">
                      {slotDateFormat(item.slotDate)}
                    </p>
                    <p className="text-sm text-gray-400">{item.slotTime}</p>
                  </div>
                  
                  <p className="font-semibold text-gray-700 flex items-center gap-1">
                    <IndianRupee size={14} className="text-blue-500" />{item.amount}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item)}
                    {!item.cancelled && !item.isCompleted && (
                      <div className="flex gap-2">
                        <button onClick={() => cancelAppointment(item._id)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all duration-300">
                          <X className="w-5 h-5" />
                        </button>
                        <button onClick={() => completeAppointment(item._id)}
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

  export default DoctorAppointment;